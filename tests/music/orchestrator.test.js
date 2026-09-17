import test from 'node:test'
import assert from 'node:assert/strict'
import {
  cycleRepeatMode,
  mergeTrackMetadata,
  queueTracksForView,
  queueCanMove,
  applyExpandedPlaylistToQueue,
  normalizeStoredMusicState
} from '../../music-center.js'

test('cycles repeat mode through off, all, one', () => {
  assert.equal(cycleRepeatMode('off'), 'all')
  assert.equal(cycleRepeatMode('all'), 'one')
  assert.equal(cycleRepeatMode('one'), 'off')
})

test('merges safe metadata into a canonical track without replacing identity', () => {
  const track = { fingerprint: 'spotify:track:abc', provider: 'spotify', canonicalUrl: 'https://open.spotify.com/track/abc' }
  const merged = mergeTrackMetadata(track, { state: 'ready', title: 'Song', author: 'Artist', artworkUrl: 'https://img.example/a.jpg', providerLabel: 'Spotify' })
  assert.equal(merged.fingerprint, track.fingerprint)
  assert.equal(merged.provider, 'spotify')
  assert.equal(merged.title, 'Song')
  assert.equal(merged.metadataState, 'ready')
})

test('queue view follows play order and exposes stable queue entry ids', () => {
  const queue = {
    entries: [{ id: 'q-a', trackId: 'a' }, { id: 'q-b', trackId: 'b' }],
    playOrder: ['q-b', 'q-a'],
    cursor: 0,
    shuffle: true,
    repeatMode: 'off'
  }
  const tracks = new Map([['a', { fingerprint: 'a', title: 'A' }], ['b', { fingerprint: 'b', title: 'B' }]])
  assert.deepEqual(queueTracksForView(queue, tracks).map(item => [item.fingerprint, item.queueEntryId]), [['b', 'q-b'], ['a', 'q-a']])
  assert.deepEqual(queueCanMove(queue), { previous: false, next: true })
})


test('expanded playlist activates its first child when added to an idle queue', async () => {
  const { createQueueState } = await import('../../music/music-queue.js')
  let n = 0
  const expansion = {
    group: { id: 'g1', title: 'Mix', collapsed: false },
    tracks: [{ fingerprint: 'a' }, { fingerprint: 'b' }]
  }
  const result = applyExpandedPlaylistToQueue(createQueueState([]), expansion, {
    activateFirst: true,
    idFactory: () => `q${++n}`
  })
  assert.deepEqual(result.queue.entries.map(entry => entry.trackId), ['a', 'b'])
  assert.equal(result.queue.cursor, 0)
  assert.equal(result.startTrack.fingerprint, 'a')
})

test('expanded playlist appends without moving an active queue cursor', async () => {
  const { createQueueState, getCurrentEntry } = await import('../../music/music-queue.js')
  let n = 0
  const queue = createQueueState(['current', 'next'], { idFactory: () => `base${++n}` })
  const activeBefore = getCurrentEntry(queue).id
  const expansion = {
    group: { id: 'g1', title: 'Mix', collapsed: false },
    tracks: [{ fingerprint: 'a' }, { fingerprint: 'b' }]
  }
  const result = applyExpandedPlaylistToQueue(queue, expansion, {
    activateFirst: false,
    idFactory: () => `playlist${++n}`
  })
  assert.equal(getCurrentEntry(result.queue).id, activeBefore)
  assert.equal(result.startTrack, null)
  assert.deepEqual(result.queue.entries.map(entry => entry.trackId), ['current', 'next', 'a', 'b'])
})

test('queue view exposes playlist group metadata for rendering', () => {
  const queue = {
    entries: [{ id: 'q-a', trackId: 'a', groupId: 'g1', groupIndex: 0 }],
    groups: [{ id: 'g1', title: 'Mix', collapsed: false }],
    playOrder: ['q-a'], cursor: 0, shuffle: false, repeatMode: 'off'
  }
  const rows = queueTracksForView(queue, new Map([['a', { fingerprint: 'a', title: 'A' }]]))
  assert.equal(rows[0].queueGroupId, 'g1')
  assert.equal(rows[0].queueGroupIndex, 0)
})


test('normalizes previously stored locale-prefixed Spotify entities and queue references', () => {
  const legacy = {
    fingerprint: 'spotify:intl-id:track', provider: 'spotify', type: 'intl-id', sourceId: 'track',
    canonicalUrl: 'https://open.spotify.com/intl-id/track/4xAJlngfYcP4NbUqQkruOV',
    originalUrl: 'https://open.spotify.com/intl-id/track/4xAJlngfYcP4NbUqQkruOV?si=old',
    title: 'Spotify intl-id', providerLabel: 'Spotify', libraryVisible: true
  }
  const queue = {
    entries: [{ id: 'q1', trackId: legacy.fingerprint }], playOrder: ['q1'], cursor: 0,
    shuffle: false, repeatMode: 'off'
  }
  const normalized = normalizeStoredMusicState([legacy], queue)
  assert.equal(normalized.tracks[0].fingerprint, 'spotify:track:4xAJlngfYcP4NbUqQkruOV')
  assert.equal(normalized.tracks[0].type, 'track')
  assert.equal(normalized.tracks[0].title, 'Spotify track')
  assert.equal(normalized.queue.entries[0].trackId, 'spotify:track:4xAJlngfYcP4NbUqQkruOV')
})
