import test from 'node:test'
import assert from 'node:assert/strict'
import {
  cycleRepeatMode,
  mergeTrackMetadata,
  queueTracksForView,
  queueCanMove
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
