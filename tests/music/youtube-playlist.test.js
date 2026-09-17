import test from 'node:test'
import assert from 'node:assert/strict'
import { listYouTubePlaylistVideoIds } from '../../music/providers/youtube-playlist.js'

test('enumerates YouTube playlist video ids in provider order', async () => {
  const calls = []
  let handlers
  const fakePlayer = {
    cuePlaylist: args => calls.push(['cue', args]),
    getPlaylist: () => ['AAA', 'BBB', 'AAA'],
    destroy: () => calls.push(['destroy'])
  }
  const result = await listYouTubePlaylistVideoIds(
    { provider: 'youtube', type: 'playlist', sourceId: 'PL123' },
    {
      host: {},
      pollIntervalMs: 1,
      readinessTimeoutMs: 40,
      apiLoader: async () => ({
        createPlayer: (_target, nextHandlers) => {
          handlers = nextHandlers
          queueMicrotask(() => handlers.ready?.())
          return fakePlayer
        }
      })
    }
  )
  assert.deepEqual(result, ['AAA', 'BBB', 'AAA'])
  assert.deepEqual(calls[0], ['cue', { listType: 'playlist', list: 'PL123' }])
  assert.equal(calls.at(-1)[0], 'destroy')
})

test('destroys the YouTube probe when playlist enumeration times out', async () => {
  let destroyed = 0
  await assert.rejects(
    listYouTubePlaylistVideoIds(
      { provider: 'youtube', type: 'playlist', sourceId: 'PL123' },
      {
        host: {},
        pollIntervalMs: 1,
        readinessTimeoutMs: 8,
        apiLoader: async () => ({
          createPlayer: (_target, handlers) => {
            queueMicrotask(() => handlers.ready?.())
            return { cuePlaylist() {}, getPlaylist: () => [], destroy() { destroyed += 1 } }
          }
        })
      }
    ),
    error => error?.code === 'PLAYER_API_TIMEOUT'
  )
  assert.equal(destroyed, 1)
})

test('waits for a stable YouTube playlist list instead of returning the first partial result', async () => {
  let reads = 0
  const fakePlayer = {
    cuePlaylist() {},
    getPlaylist() {
      reads += 1
      if (reads === 1) return ['AAA']
      return ['AAA', 'BBB']
    },
    destroy() {}
  }
  const ids = await listYouTubePlaylistVideoIds(
    { provider: 'youtube', type: 'playlist', sourceId: 'PLSTABLE' },
    {
      host: {}, pollIntervalMs: 1, readinessTimeoutMs: 50,
      apiLoader: async () => ({ createPlayer: (_target, handlers) => { queueMicrotask(() => handlers.ready?.()); return fakePlayer } })
    }
  )
  assert.deepEqual(ids, ['AAA', 'BBB'])
  assert.ok(reads >= 3)
})
