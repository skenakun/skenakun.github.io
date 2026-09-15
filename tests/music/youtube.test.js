import test from 'node:test'
import assert from 'node:assert/strict'
import { createYouTubeAdapter } from '../../music/providers/youtube.js'

test('cues a video without autoplay and exposes full transport capabilities', async () => {
  const calls = []
  const fakePlayer = {
    cueVideoById: arg => calls.push(['cueVideoById', arg]),
    cuePlaylist: arg => calls.push(['cuePlaylist', arg]),
    playVideo: () => calls.push(['play']),
    pauseVideo: () => calls.push(['pause']),
    seekTo: value => calls.push(['seek', value]),
    setVolume: value => calls.push(['volume', value]),
    getCurrentTime: () => 0,
    getDuration: () => 180,
    destroy: () => calls.push(['destroy'])
  }
  const adapter = createYouTubeAdapter({
    host: {},
    emit: () => {},
    apiLoader: async () => ({ createPlayer: (_target, handlers) => { queueMicrotask(() => handlers.ready?.()); return fakePlayer } })
  })
  await adapter.load({ provider: 'youtube', type: 'track', sourceId: 'M7lc1UVf-VE', startSeconds: 12 })
  assert.deepEqual(calls[0], ['cueVideoById', { videoId: 'M7lc1UVf-VE', startSeconds: 12 }])
  assert.equal(adapter.capabilities.volume, true)
  assert.equal(adapter.capabilities.endedEvent, true)
})

test('cues playlists without autoplay', async () => {
  const calls = []
  const fakePlayer = {
    cueVideoById: arg => calls.push(['video', arg]),
    cuePlaylist: arg => calls.push(['playlist', arg]),
    getCurrentTime: () => 0,
    getDuration: () => 0,
    destroy() {}
  }
  const adapter = createYouTubeAdapter({
    host: {}, emit: () => {},
    apiLoader: async () => ({ createPlayer: (_target, handlers) => { queueMicrotask(() => handlers.ready?.()); return fakePlayer } })
  })
  await adapter.load({ provider: 'youtube', type: 'playlist', sourceId: 'PL123' })
  assert.deepEqual(calls, [['playlist', { listType: 'playlist', list: 'PL123' }]])
})

test('waits for the YouTube player ready event before cueing media', async () => {
  const calls = []
  let callbacks
  const fakePlayer = {
    cueVideoById: arg => calls.push(['cue', arg]),
    getCurrentTime: () => 0,
    getDuration: () => 0,
    destroy() {}
  }
  const adapter = createYouTubeAdapter({
    host: {},
    emit: () => {},
    apiLoader: async () => ({
      createPlayer: (_target, handlers) => {
        callbacks = handlers
        return fakePlayer
      }
    })
  })
  let settled = false
  const loading = adapter.load({ provider: 'youtube', type: 'track', sourceId: 'M7lc1UVf-VE', startSeconds: 0 }).then(() => { settled = true })
  await Promise.resolve()
  await Promise.resolve()
  assert.equal(settled, false)
  assert.deepEqual(calls, [])
  callbacks.ready()
  await loading
  assert.equal(settled, true)
  assert.deepEqual(calls[0], ['cue', { videoId: 'M7lc1UVf-VE', startSeconds: 0 }])
})

test('fails YouTube load when the player never becomes ready', async () => {
  const adapter = createYouTubeAdapter({
    host: {},
    readinessTimeoutMs: 5,
    apiLoader: async () => ({
      createPlayer: () => ({
        cueVideoById() {}, destroy() {}
      })
    })
  })
  const outerTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('outer timeout')), 40))
  await assert.rejects(
    Promise.race([
      adapter.load({ type: 'track', sourceId: 'M7lc1UVf-VE', startSeconds: 0 }),
      outerTimeout
    ]),
    error => error?.code === 'PLAYER_API_TIMEOUT'
  )
})
