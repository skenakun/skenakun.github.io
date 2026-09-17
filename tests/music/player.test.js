import test from 'node:test'
import assert from 'node:assert/strict'
import { createPlayerManager } from '../../music/music-player.js'

function fakeAdapter(name, log) {
  return {
    capabilities: { play: true, pause: true, seek: false, volume: false, next: false, previous: false, progress: false, endedEvent: false },
    async load(item) { log.push(`${name}:load:${item.sourceId}`) },
    async play() { log.push(`${name}:play`) },
    async pause() { log.push(`${name}:pause`) },
    async seek() {},
    async setVolume() {},
    getState() { return {} },
    destroy() { log.push(`${name}:destroy`) }
  }
}

test('pauses the old provider before activating the next provider', async () => {
  const log = []
  const manager = createPlayerManager({
    createAdapter: item => fakeAdapter(item.provider, log)
  })
  await manager.load({ provider: 'youtube', sourceId: 'a' })
  await manager.load({ provider: 'spotify', sourceId: 'b' })
  assert.deepEqual(log.slice(0, 3), ['youtube:load:a', 'youtube:pause', 'spotify:load:b'])
})

test('does not call unsupported controls and preserves adapter on minimize', async () => {
  let destroyed = 0
  let seekCalls = 0
  const manager = createPlayerManager({
    createAdapter: () => ({
      capabilities: { play: true, pause: true, seek: false, volume: false, next: false, previous: false, progress: false, endedEvent: false },
      async load() {}, async play() {}, async pause() {}, async seek() { seekCalls += 1 }, async setVolume() {},
      getState() { return {} },
      destroy() { destroyed += 1 }
    })
  })
  await manager.load({ provider: 'spotify', sourceId: 'b' })
  await manager.seek(20)
  manager.setMinimized(true)
  assert.equal(seekCalls, 0)
  assert.equal(destroyed, 0)
  assert.equal(manager.getState().minimized, true)
})

test('maps adapter progress events into unified state', async () => {
  let emit
  const manager = createPlayerManager({
    createAdapter: (_item, eventEmitter) => {
      emit = eventEmitter
      return {
        capabilities: { play: true, pause: true, seek: true, volume: true, next: false, previous: false, progress: true, endedEvent: true },
        async load() {}, async play() {}, async pause() {}, async seek() {}, async setVolume() {}, getState() { return {} }, destroy() {}
      }
    }
  })
  await manager.load({ provider: 'youtube', sourceId: 'a' })
  emit('progress', { position: 12, duration: 100 })
  assert.equal(manager.getState().position, 12)
  assert.equal(manager.getState().duration, 100)
})

test('maps adapter metadata events into the current item without changing identity', async () => {
  let emit
  const manager = createPlayerManager({
    createAdapter: (_item, eventEmitter) => {
      emit = eventEmitter
      return {
        capabilities: { play: true, pause: true, seek: false, volume: false, next: false, previous: false, progress: false, endedEvent: false },
        async load() {}, async play() {}, async pause() {}, async seek() {}, async setVolume() {}, getState() { return {} }, destroy() {}
      }
    }
  })
  await manager.load({ provider: 'youtube', fingerprint: 'youtube:video:AAA', sourceId: 'AAA', title: 'YouTube video' })
  emit('metadata', { title: 'Real title', author: 'Channel', artworkUrl: 'https://img.example/a.jpg', providerLabel: 'YouTube' })
  const current = manager.getState().currentItem
  assert.equal(current.fingerprint, 'youtube:video:AAA')
  assert.equal(current.sourceId, 'AAA')
  assert.equal(current.title, 'Real title')
  assert.equal(current.author, 'Channel')
  assert.equal(current.artworkUrl, 'https://img.example/a.jpg')
})

test('provider-native next resumes playback when local queue has no next item', async () => {
  const calls = []
  const manager = createPlayerManager({
    queueController: { next: () => null },
    createAdapter: () => ({
      capabilities: { play: true, pause: true, seek: false, volume: false, next: true, previous: false, progress: false, endedEvent: false },
      async load() {}, async play() { calls.push('play') }, async pause() {}, async next() { calls.push('next') },
      async seek() {}, async setVolume() {}, getState() { return {} }, destroy() {}
    })
  })
  await manager.load({ provider: 'spotify', sourceId: 'playlist' })
  await manager.next()
  assert.deepEqual(calls, ['next', 'play'])
})
