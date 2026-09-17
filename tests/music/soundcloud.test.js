import test from 'node:test'
import assert from 'node:assert/strict'
import { createSoundCloudAdapter } from '../../music/providers/soundcloud.js'

test('builds a trusted SoundCloud player URL and supports widget transport', async () => {
  let iframeSrc = ''
  const adapter = createSoundCloudAdapter({
    host: {},
    emit: () => {},
    widgetFactory: () => ({
      bind: (name, fn) => { if (name === 'ready') queueMicrotask(fn) },
      load: () => {},
      play: () => {},
      pause: () => {},
      seekTo: () => {},
      setVolume: () => {}
    }),
    iframeFactory: src => { iframeSrc = src; return { src } }
  })
  await adapter.load({ canonicalUrl: 'https://soundcloud.com/forss/flickermood' })
  assert.equal(adapter.capabilities.play, true)
  assert.equal(adapter.capabilities.seek, true)
  assert.equal(adapter.capabilities.volume, true)
  assert.match(iframeSrc, /^https:\/\/w\.soundcloud\.com\/player\//)
  assert.match(iframeSrc, /auto_play=false/)
})

test('converts SoundCloud play progress from milliseconds to seconds', async () => {
  const bindings = new Map()
  const events = []
  const widget = {
    bind: (name, fn) => { bindings.set(name, fn); if (name === 'ready') queueMicrotask(fn) },
    load() {}, play() {}, pause() {}, seekTo() {}, setVolume() {},
    getDuration: cb => cb(10000)
  }
  const adapter = createSoundCloudAdapter({
    host: {}, emit: (type, detail) => events.push([type, detail]),
    widgetFactory: () => widget,
    iframeFactory: src => ({ src })
  })
  await adapter.load({ canonicalUrl: 'https://soundcloud.com/forss/flickermood' })
  bindings.get('playProgress')({ currentPosition: 2500 })
  const progress = events.find(([type]) => type === 'progress')
  assert.equal(progress[1].position, 2.5)
})

test('waits for SoundCloud READY and times out when the widget never becomes ready', async () => {
  const adapter = createSoundCloudAdapter({
    host: {},
    readinessTimeoutMs: 5,
    widgetFactory: () => ({ bind() {}, load() {} }),
    iframeFactory: src => ({ src, remove() {} })
  })
  await assert.rejects(
    adapter.load({ canonicalUrl: 'https://soundcloud.com/forss/flickermood' }),
    error => error?.code === 'PLAYER_API_TIMEOUT'
  )
})

test('emits current SoundCloud track metadata when playback starts', async () => {
  const bindings = new Map()
  const events = []
  const widget = {
    bind: (name, fn) => { bindings.set(name, fn); if (name === 'ready') queueMicrotask(fn) },
    load() {}, play() {}, pause() {}, seekTo() {}, setVolume() {},
    getDuration: cb => cb(10000),
    getCurrentSound: cb => cb({
      title: 'Sound title', permalink_url: 'https://soundcloud.com/a/sound-title',
      user: { username: 'Sound Artist' }, artwork_url: 'https://i1.sndcdn.com/sound.jpg'
    })
  }
  const adapter = createSoundCloudAdapter({
    host: {}, emit: (type, detail) => events.push([type, detail]),
    widgetFactory: () => widget, iframeFactory: src => ({ src })
  })
  await adapter.load({ canonicalUrl: 'https://soundcloud.com/a/sets/mix' })
  bindings.get('play')()
  const metadata = events.find(([type]) => type === 'metadata')?.[1]
  assert.ok(metadata)
  assert.equal(metadata.title, 'Sound title')
  assert.equal(metadata.author, 'Sound Artist')
  assert.equal(metadata.artworkUrl, 'https://i1.sndcdn.com/sound.jpg')
})
