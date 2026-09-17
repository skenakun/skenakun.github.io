import test from 'node:test'
import assert from 'node:assert/strict'
import { createFakeIndexedDB } from '../helpers/fake-indexeddb.js'
import { openMusicStore } from '../../music/music-store.js'

test('stores one canonical track per fingerprint', async () => {
  const store = await openMusicStore({ indexedDBFactory: createFakeIndexedDB(), dbName: 'mc-test-dedup' })
  const base = {
    fingerprint: 'youtube:video:M7lc1UVf-VE',
    provider: 'youtube',
    sourceBrand: 'youtube',
    type: 'track',
    sourceId: 'M7lc1UVf-VE',
    canonicalUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    originalUrl: 'https://youtu.be/M7lc1UVf-VE'
  }
  await store.saveTrack(base)
  await store.saveTrack({ ...base, title: 'Updated' })
  const all = await store.listTracks()
  assert.equal(all.length, 1)
  assert.equal(all[0].title, 'Updated')
  store.close()
})

test('caps history at 200 newest entries', async () => {
  const store = await openMusicStore({ indexedDBFactory: createFakeIndexedDB(), dbName: 'mc-test-history' })
  for (const i of Array.from({ length: 205 }, (_, index) => index)) {
    await store.addHistory('track-a', i)
  }
  const history = await store.listHistory()
  assert.equal(history.length, 200)
  assert.equal(history[0].playedAt, 204)
  store.close()
})

test('round trips queue and settings snapshots', async () => {
  const store = await openMusicStore({ indexedDBFactory: createFakeIndexedDB(), dbName: 'mc-test-snapshot' })
  await store.saveQueue({ entries: [], playOrder: [], cursor: -1, shuffle: false, repeatMode: 'off' })
  await store.saveSettings({ volume: 0.8, minimized: true })
  assert.equal((await store.loadQueue()).cursor, -1)
  assert.equal((await store.loadSettings()).volume, 0.8)
  store.close()
})

test('persists favorites and local playlist membership', async () => {
  const store = await openMusicStore({ indexedDBFactory: createFakeIndexedDB(), dbName: 'mc-test-playlist' })
  await store.setFavorite('track-a', true)
  const playlist = await store.createPlaylist('Gaming')
  await store.setPlaylistItems(playlist.id, ['track-a', 'track-b'])
  assert.deepEqual(await store.listFavorites(), ['track-a'])
  assert.deepEqual(await store.getPlaylistItems(playlist.id), ['track-a', 'track-b'])
  await store.setFavorite('track-a', false)
  assert.deepEqual(await store.listFavorites(), [])
  store.close()
})


test('persists playlist expansion cache and grouped queue snapshots', async () => {
  const store = await openMusicStore({ indexedDBFactory: createFakeIndexedDB(), dbName: 'mc-test-expansion-cache' })
  const expansion = {
    fingerprint: 'youtube:playlist:PL123',
    provider: 'youtube',
    sourceId: 'PL123',
    childIds: ['AAA', 'BBB'],
    expandedAt: 123456
  }
  await store.savePlaylistExpansion(expansion)
  assert.deepEqual(await store.getPlaylistExpansion(expansion.fingerprint), expansion)

  const queue = {
    entries: [{ id: 'q1', trackId: 'youtube:video:AAA', groupId: 'g1', groupIndex: 0 }],
    groups: [{ id: 'g1', title: 'Mix', collapsed: true }],
    playOrder: ['q1'], cursor: 0, shuffle: false, repeatMode: 'off'
  }
  await store.saveQueue(queue)
  assert.deepEqual(await store.loadQueue(), queue)
  store.close()
})

test('version 2 migration preserves data created by an older database', async () => {
  const indexedDBFactory = createFakeIndexedDB()
  const seed = indexedDBFactory.open('mc-test-migration', 1)
  await new Promise((resolve, reject) => {
    seed.onupgradeneeded = () => {
      seed.result.createObjectStore('tracks', { keyPath: 'fingerprint' })
    }
    seed.onsuccess = () => resolve()
    seed.onerror = () => reject(seed.error)
  })
  const legacyDb = seed.result
  const tx = legacyDb.transaction('tracks', 'readwrite')
  tx.objectStore('tracks').put({ fingerprint: 'legacy:track:1', title: 'Legacy' })
  await new Promise(resolve => { tx.oncomplete = resolve })
  legacyDb.close()

  const store = await openMusicStore({ indexedDBFactory, dbName: 'mc-test-migration' })
  assert.equal((await store.getTrack('legacy:track:1')).title, 'Legacy')
  await store.savePlaylistExpansion({ fingerprint: 'youtube:playlist:PLX', provider: 'youtube', sourceId: 'PLX', childIds: [], expandedAt: 1 })
  assert.equal((await store.getPlaylistExpansion('youtube:playlist:PLX')).sourceId, 'PLX')
  store.close()
})
