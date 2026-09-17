import test from 'node:test'
import assert from 'node:assert/strict'
import { expandPlaylist, isExpandablePlaylist } from '../../music/music-playlist-expander.js'

function memoryStore(initial = null) {
  let record = initial
  const saves = []
  return {
    saves,
    async getPlaylistExpansion() { return record },
    async savePlaylistExpansion(next) { record = structuredClone(next); saves.push(record); return record }
  }
}

const youtubePlaylist = {
  provider: 'youtube', sourceBrand: 'youtube-music', type: 'playlist', sourceId: 'PL123',
  fingerprint: 'youtube:playlist:PL123', canonicalUrl: 'https://www.youtube.com/playlist?list=PL123'
}

const soundcloudPlaylist = {
  provider: 'soundcloud', sourceBrand: 'soundcloud', type: 'playlist', sourceId: '/dj/sets/mix',
  fingerprint: 'soundcloud:playlist:/dj/sets/mix', canonicalUrl: 'https://soundcloud.com/dj/sets/mix'
}

test('recognizes only supported expandable playlist providers', () => {
  assert.equal(isExpandablePlaylist(youtubePlaylist), true)
  assert.equal(isExpandablePlaylist(soundcloudPlaylist), true)
  assert.equal(isExpandablePlaylist({ provider: 'spotify', type: 'playlist' }), false)
  assert.equal(isExpandablePlaylist({ provider: 'youtube', type: 'video' }), false)
})

test('fresh YouTube cache avoids a provider probe and builds canonical children', async () => {
  const now = 10_000_000
  const store = memoryStore({
    fingerprint: youtubePlaylist.fingerprint,
    provider: 'youtube', sourceId: 'PL123', childIds: ['AAA', 'BBB'], expandedAt: now - 1000
  })
  let probes = 0
  const result = await expandPlaylist(youtubePlaylist, {
    store, now: () => now, idFactory: () => 'group-1',
    youtubeLister: async () => { probes += 1; return ['NOPE'] }
  })
  assert.equal(probes, 0)
  assert.equal(result.group.id, 'group-1')
  assert.deepEqual(result.tracks.map(track => track.fingerprint), ['youtube:video:AAA', 'youtube:video:BBB'])
  assert.equal(result.tracks[0].sourceBrand, 'youtube-music')
  assert.equal(result.tracks[0].libraryVisible, false)
  assert.match(result.tracks[0].artworkUrl, /AAA/)
})

test('stale cache refreshes and falls back to stale ids when refresh fails', async () => {
  const now = 50_000_000
  const stale = {
    fingerprint: youtubePlaylist.fingerprint,
    provider: 'youtube', sourceId: 'PL123', childIds: ['OLD'], expandedAt: now - (7 * 60 * 60 * 1000)
  }
  const refreshedStore = memoryStore(stale)
  const refreshed = await expandPlaylist(youtubePlaylist, {
    store: refreshedStore, now: () => now, idFactory: () => 'g', youtubeLister: async () => ['NEW']
  })
  assert.deepEqual(refreshed.tracks.map(track => track.sourceId), ['NEW'])
  assert.equal(refreshed.usedStaleCache, false)
  assert.equal(refreshedStore.saves.length, 1)

  const fallback = await expandPlaylist(youtubePlaylist, {
    store: memoryStore(stale), now: () => now, idFactory: () => 'g2', youtubeLister: async () => { throw new Error('offline') }
  })
  assert.deepEqual(fallback.tracks.map(track => track.sourceId), ['OLD'])
  assert.equal(fallback.usedStaleCache, true)
})

test('SoundCloud expansion canonicalizes permalink children and keeps immediate metadata', async () => {
  const store = memoryStore()
  const result = await expandPlaylist(soundcloudPlaylist, {
    store,
    now: () => 100,
    idFactory: () => 'sound-group',
    soundcloudLister: async () => [{
      canonicalUrl: 'https://soundcloud.com/artist/song',
      title: 'Song', author: 'Artist', artworkUrl: 'https://i1.sndcdn.com/art.jpg'
    }]
  })
  assert.equal(result.tracks[0].provider, 'soundcloud')
  assert.equal(result.tracks[0].type, 'track')
  assert.equal(result.tracks[0].title, 'Song')
  assert.equal(result.tracks[0].author, 'Artist')
  assert.equal(result.tracks[0].artworkUrl, 'https://i1.sndcdn.com/art.jpg')
  assert.equal(result.tracks[0].libraryVisible, false)
  assert.deepEqual(store.saves[0].childIds, ['https://soundcloud.com/artist/song'])
})

test('expansion failure without cache is propagated without a partial result', async () => {
  await assert.rejects(expandPlaylist(youtubePlaylist, {
    store: memoryStore(), idFactory: () => 'g', youtubeLister: async () => { throw new Error('provider down') }
  }), /provider down/)
})
