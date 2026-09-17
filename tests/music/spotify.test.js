import test from 'node:test'
import assert from 'node:assert/strict'
import { createSpotifyAdapter } from '../../music/providers/spotify.js'

test('loads Spotify entities and does not claim volume support', async () => {
  const calls = []
  const listeners = new Map()
  const controller = {
    loadEntity: url => calls.push(['loadEntity', url]),
    play: () => calls.push(['play']),
    pause: () => calls.push(['pause']),
    seek: value => calls.push(['seek', value]),
    addListener: (name, fn) => listeners.set(name, fn),
    destroy: () => calls.push(['destroy'])
  }
  const adapter = createSpotifyAdapter({
    host: {},
    emit: () => {},
    apiLoader: async () => ({ createController: (_host, _options, cb) => cb(controller) })
  })
  await adapter.load({ canonicalUrl: 'https://open.spotify.com/track/abc123' })
  assert.equal(adapter.capabilities.seek, true)
  assert.equal(adapter.capabilities.volume, false)
  assert.deepEqual(calls[0], ['loadEntity', 'https://open.spotify.com/track/abc123'])
})

test('normalizes Spotify playback progress from milliseconds to seconds', async () => {
  const events = []
  const listeners = new Map()
  const controller = {
    loadEntity() {}, play() {}, pause() {}, seek() {}, destroy() {},
    addListener: (name, fn) => listeners.set(name, fn)
  }
  const adapter = createSpotifyAdapter({
    host: {}, emit: (type, detail) => events.push([type, detail]),
    apiLoader: async () => ({ createController: (_host, _options, cb) => cb(controller) })
  })
  await adapter.load({ canonicalUrl: 'https://open.spotify.com/track/abc123' })
  listeners.get('playback_update')({ data: { position: 2500, duration: 10000, isPaused: false, isBuffering: false } })
  const progress = events.find(([type]) => type === 'progress')
  assert.equal(progress[1].position, 2.5)
  assert.equal(progress[1].duration, 10)
})

test('fails Spotify load when createController never becomes ready', async () => {
  const adapter = createSpotifyAdapter({
    host: {},
    readinessTimeoutMs: 5,
    apiLoader: async () => ({ createController() {} })
  })
  const outerTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('outer timeout')), 40))
  await assert.rejects(
    Promise.race([
      adapter.load({ canonicalUrl: 'https://open.spotify.com/track/abc123' }),
      outerTimeout
    ]),
    error => error?.code === 'PLAYER_API_TIMEOUT'
  )
})

test('maps Spotify active track URI to live metadata', async () => {
  const listeners = new Map()
  const events = []
  const controller = {
    loadEntity() {}, play() {}, pause() {}, seek() {}, destroy() {},
    addListener: (name, fn) => listeners.set(name, fn)
  }
  const adapter = createSpotifyAdapter({
    host: {},
    emit: (type, detail) => events.push([type, detail]),
    metadataLoader: async url => ({ title: 'Spotify Track', author: 'Spotify Artist', artworkUrl: 'https://i.scdn.co/image/a.jpg', canonicalUrl: url }),
    apiLoader: async () => ({ createController: (_host, _options, cb) => cb(controller) })
  })
  await adapter.load({ canonicalUrl: 'https://open.spotify.com/playlist/playlist123' })
  listeners.get('playback_started')({ data: { playingURI: 'spotify:track:track123' } })
  await new Promise(resolve => setTimeout(resolve, 0))
  const metadata = events.find(([type]) => type === 'metadata')?.[1]
  assert.ok(metadata)
  assert.equal(metadata.title, 'Spotify Track')
  assert.equal(metadata.author, 'Spotify Artist')
  assert.equal(metadata.artworkUrl, 'https://i.scdn.co/image/a.jpg')
  assert.equal(metadata.canonicalUrl, 'https://open.spotify.com/track/track123')
})
