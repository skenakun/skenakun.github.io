import test from 'node:test'
import assert from 'node:assert/strict'
import { buildMusicCenterMarkup, createPlayerPresentation, renderQueueMarkup, selectTracksForView } from '../../music/music-view.js'

test('music center markup contains semantic dialog, add-link form, navigation, queue, and transport', () => {
  const html = buildMusicCenterMarkup()
  assert.match(html, /role="dialog"/)
  assert.match(html, /id="mc-url-form"/)
  assert.match(html, /<nav[^>]*aria-label="Music Center"/)
  assert.match(html, /Up Next/)
  assert.match(html, /data-mc-action="play-pause"/)
})

test('player presentation disables controls the provider cannot support', () => {
  const model = createPlayerPresentation({
    currentItem: { provider: 'spotify', title: 'Track' },
    status: 'ready', position: 10, duration: 100, volume: 0.8,
    capabilities: { play: true, pause: true, seek: true, volume: false, next: false, previous: false }
  })
  assert.equal(model.seekDisabled, false)
  assert.equal(model.volumeDisabled, true)
  assert.equal(model.nextDisabled, true)
  assert.equal(model.progressPercent, 10)
})

test('external fallback presentation exposes original-link mode instead of fake playback', () => {
  const model = createPlayerPresentation({
    currentItem: { provider: 'apple-music', canonicalUrl: 'https://music.apple.com/example' },
    status: 'ready', position: 0, duration: null, volume: 0.8,
    capabilities: { play: false, pause: false, seek: false, volume: false }
  })
  assert.equal(model.externalOnly, true)
  assert.equal(model.playDisabled, true)
  assert.equal(model.originalUrl, 'https://music.apple.com/example')
})

test('music center exposes a live recoverable notice region', () => {
  const html = buildMusicCenterMarkup()
  assert.match(html, /id="mc-notice"/)
  assert.match(html, /aria-live="polite"/)
})

test('minimize keeps the provider overlay mounted for background playback', async () => {
  const { createMusicView } = await import('../../music/music-view.js')
  const makeClassList = () => {
    const values = new Set()
    return {
      add: value => values.add(value),
      remove: value => values.delete(value),
      toggle: (value, force) => force === undefined ? (values.has(value) ? values.delete(value) : values.add(value)) : (force ? values.add(value) : values.delete(value)),
      contains: value => values.has(value)
    }
  }
  const makeRoot = () => ({
    hidden: false,
    innerHTML: '',
    classList: makeClassList(),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {},
    removeEventListener() {},
    contains: () => true,
    replaceChildren() {},
    setAttribute() {},
    removeAttribute() {}
  })
  const overlayRoot = makeRoot()
  const miniRoot = makeRoot()
  const playbackHost = { classList: makeClassList() }
  const bodyClassList = makeClassList()
  const view = createMusicView({
    overlayRoot,
    miniRoot,
    playbackHost,
    documentRef: { body: { classList: bodyClassList }, addEventListener() {}, removeEventListener() {} }
  })
  view.show()
  view.minimize()
  assert.equal(overlayRoot.hidden, false)
  assert.equal(overlayRoot.classList.contains('is-minimized'), true)
  assert.equal(overlayRoot.getAttribute?.('aria-hidden'), undefined)
})


test('grouped queue markup renders playlist header, thumbnails, metadata, and controls', () => {
  const model = {
    queue: [
      { queueEntryId: 'q1', queueGroupId: 'g1', queueGroupIndex: 0, title: 'Track One', author: 'Artist A', artworkUrl: 'https://img.example/one.jpg', provider: 'youtube' },
      { queueEntryId: 'q2', queueGroupId: 'g1', queueGroupIndex: 1, title: 'Track Two', author: 'Artist B', artworkUrl: 'https://img.example/two.jpg', provider: 'youtube' }
    ],
    queueState: {
      groups: [{ id: 'g1', title: 'Road Mix', collapsed: false }],
      playOrder: ['q1', 'q2'], cursor: 1, shuffle: false
    }
  }
  const html = renderQueueMarkup(model)
  assert.match(html, /mc-queue-group/)
  assert.match(html, /Road Mix/)
  assert.match(html, /aria-expanded="true"/)
  assert.match(html, /data-mc-action="queue-group-remove"/)
  assert.match(html, /https:\/\/img\.example\/one\.jpg/)
  assert.match(html, /Track One/)
  assert.match(html, /Artist A/)
  assert.match(html, /is-current/)
})

test('collapsed queue group hides children and reports active playlist position', () => {
  const html = renderQueueMarkup({
    queue: [
      { queueEntryId: 'q1', queueGroupId: 'g1', queueGroupIndex: 0, title: 'Hidden One' },
      { queueEntryId: 'q2', queueGroupId: 'g1', queueGroupIndex: 1, title: 'Hidden Two' }
    ],
    queueState: { groups: [{ id: 'g1', title: 'Collapsed Mix', collapsed: true }], playOrder: ['q1', 'q2'], cursor: 1, shuffle: false }
  })
  assert.match(html, /aria-expanded="false"/)
  assert.match(html, /Playing 2 \/ 2/)
  assert.doesNotMatch(html, /Hidden One/)
  assert.doesNotMatch(html, /Hidden Two/)
})

test('shuffle queue markup renders the actual play order as a flat list', () => {
  const html = renderQueueMarkup({
    queue: [
      { queueEntryId: 'q2', queueGroupId: 'g1', title: 'Second' },
      { queueEntryId: 'q1', queueGroupId: 'g1', title: 'First' }
    ],
    queueState: { groups: [{ id: 'g1', title: 'Mix', collapsed: false }], playOrder: ['q2', 'q1'], cursor: 0, shuffle: true }
  })
  assert.doesNotMatch(html, /mc-queue-group-header/)
  assert.ok(html.indexOf('Second') < html.indexOf('First'))
})

test('expanded playlist children stay out of Home until promoted but remain available in history', () => {
  const hidden = { fingerprint: 'a', title: 'Child', libraryVisible: false }
  const visible = { fingerprint: 'b', title: 'Saved', libraryVisible: true }
  const model = { tracks: [hidden, visible], favorites: [], history: [{ trackId: 'a' }] }
  assert.deepEqual(selectTracksForView('home', model).map(track => track.fingerprint), ['b'])
  assert.deepEqual(selectTracksForView('recent', model).map(track => track.fingerprint), ['a'])
})
