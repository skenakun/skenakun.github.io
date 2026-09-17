import test from 'node:test'
import assert from 'node:assert/strict'
import { listSoundCloudPlaylistItems } from '../../music/providers/soundcloud-playlist.js'

function fakeIframe() {
  return { remove() {} }
}

test('enumerates SoundCloud set items with immediate metadata', async () => {
  const bindings = new Map()
  const widget = {
    bind(name, fn) { bindings.set(name, fn); if (name === 'ready') queueMicrotask(fn) },
    unbind(name) { bindings.delete(name) },
    getSounds(callback) {
      callback([
        { permalink_url: 'https://soundcloud.com/a/one', title: 'One', user: { username: 'Artist A' }, artwork_url: 'https://i1.sndcdn.com/a.jpg' },
        { permalink_url: 'https://soundcloud.com/b/two', title: 'Two', user: { username: 'Artist B' }, artwork_url: 'https://i1.sndcdn.com/b.jpg' }
      ])
    }
  }
  const items = await listSoundCloudPlaylistItems(
    { provider: 'soundcloud', type: 'playlist', canonicalUrl: 'https://soundcloud.com/a/sets/mix' },
    {
      host: { replaceChildren() {} },
      iframeFactory: fakeIframe,
      widgetFactory: () => widget,
      readinessTimeoutMs: 40
    }
  )
  assert.deepEqual(items.map(item => [item.canonicalUrl, item.title, item.author]), [
    ['https://soundcloud.com/a/one', 'One', 'Artist A'],
    ['https://soundcloud.com/b/two', 'Two', 'Artist B']
  ])
})

test('cleans up SoundCloud probe after readiness timeout', async () => {
  let removed = 0
  const iframe = { remove() { removed += 1 } }
  await assert.rejects(
    listSoundCloudPlaylistItems(
      { provider: 'soundcloud', type: 'playlist', canonicalUrl: 'https://soundcloud.com/a/sets/mix' },
      {
        host: { replaceChildren() {} },
        iframeFactory: () => iframe,
        widgetFactory: () => ({ bind() {}, unbind() {}, getSounds() {} }),
        readinessTimeoutMs: 8
      }
    ),
    error => error?.code === 'PLAYER_API_TIMEOUT'
  )
  assert.equal(removed, 1)
})

test('mounts a temporary SoundCloud probe off-screen when no host is supplied', async () => {
  let appended = null
  let removed = 0
  const iframe = { style: {}, remove() { removed += 1 } }
  const widget = {
    bind(name, fn) { if (name === 'ready') queueMicrotask(fn) },
    unbind() {},
    getSounds(callback) { callback([{ permalink_url: 'https://soundcloud.com/a/one', title: 'One' }]) }
  }
  const documentRef = { body: { append(node) { appended = node } } }
  const items = await listSoundCloudPlaylistItems(
    { provider: 'soundcloud', type: 'playlist', canonicalUrl: 'https://soundcloud.com/a/sets/mix' },
    { documentRef, iframeFactory: () => iframe, widgetFactory: () => widget, readinessTimeoutMs: 40 }
  )
  assert.equal(appended, iframe)
  assert.equal(iframe.style.position, 'fixed')
  assert.equal(items.length, 1)
  assert.equal(removed, 1)
})
