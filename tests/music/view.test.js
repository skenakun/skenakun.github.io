import test from 'node:test'
import assert from 'node:assert/strict'
import { buildMusicCenterMarkup, createPlayerPresentation } from '../../music/music-view.js'

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
