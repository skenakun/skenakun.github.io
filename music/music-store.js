import { ERROR_CODES, MusicCenterError } from './music-contracts.js'

const DB_VERSION = 1
const STORE_NAMES = Object.freeze({
  tracks: 'tracks',
  playlists: 'playlists',
  playlistItems: 'playlistItems',
  history: 'history',
  favorites: 'favorites',
  queue: 'queue',
  settings: 'settings'
})

function makeId(prefix = 'mc') {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

function storageError(message, cause) {
  return new MusicCenterError(ERROR_CODES.STORAGE_ERROR, message, cause)
}

function requestPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(storageError('IndexedDB request failed', request.error))
  })
}

function transactionPromise(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(storageError('IndexedDB transaction failed', transaction.error))
    transaction.onabort = () => reject(storageError('IndexedDB transaction was aborted', transaction.error))
  })
}

function cloneValue(value) {
  return value == null ? value : structuredClone(value)
}

export async function openMusicStore(options = {}) {
  const indexedDBFactory = options.indexedDBFactory || globalThis.indexedDB
  const dbName = options.dbName || 'musicCenterDB'
  if (!indexedDBFactory?.open) throw storageError('IndexedDB is not available in this browser')

  const request = indexedDBFactory.open(dbName, DB_VERSION)
  request.onupgradeneeded = () => {
    const db = request.result
    if (!db.objectStoreNames.contains(STORE_NAMES.tracks)) db.createObjectStore(STORE_NAMES.tracks, { keyPath: 'fingerprint' })
    if (!db.objectStoreNames.contains(STORE_NAMES.playlists)) db.createObjectStore(STORE_NAMES.playlists, { keyPath: 'id' })
    if (!db.objectStoreNames.contains(STORE_NAMES.playlistItems)) {
      const store = db.createObjectStore(STORE_NAMES.playlistItems, { keyPath: 'id' })
      store.createIndex('playlistId', 'playlistId', { unique: false })
    }
    if (!db.objectStoreNames.contains(STORE_NAMES.history)) {
      const store = db.createObjectStore(STORE_NAMES.history, { keyPath: 'id' })
      store.createIndex('playedAt', 'playedAt', { unique: false })
    }
    if (!db.objectStoreNames.contains(STORE_NAMES.favorites)) db.createObjectStore(STORE_NAMES.favorites, { keyPath: 'trackId' })
    if (!db.objectStoreNames.contains(STORE_NAMES.queue)) db.createObjectStore(STORE_NAMES.queue, { keyPath: 'key' })
    if (!db.objectStoreNames.contains(STORE_NAMES.settings)) db.createObjectStore(STORE_NAMES.settings, { keyPath: 'key' })
  }

  const db = await new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(storageError('Unable to open Music Center storage', request.error))
    request.onblocked = () => reject(storageError('Music Center storage upgrade is blocked'))
  })

  const api = {
    async saveTrack(track) {
      if (!track?.fingerprint) throw storageError('Track fingerprint is required')
      const tx = db.transaction(STORE_NAMES.tracks, 'readwrite')
      tx.objectStore(STORE_NAMES.tracks).put(cloneValue(track))
      await transactionPromise(tx)
      return cloneValue(track)
    },

    async getTrack(fingerprint) {
      const tx = db.transaction(STORE_NAMES.tracks, 'readonly')
      const result = await requestPromise(tx.objectStore(STORE_NAMES.tracks).get(fingerprint))
      await transactionPromise(tx)
      return result || null
    },

    async listTracks() {
      const tx = db.transaction(STORE_NAMES.tracks, 'readonly')
      const result = await requestPromise(tx.objectStore(STORE_NAMES.tracks).getAll())
      await transactionPromise(tx)
      return result
    },

    async setFavorite(trackId, favorite = true) {
      const tx = db.transaction(STORE_NAMES.favorites, 'readwrite')
      const store = tx.objectStore(STORE_NAMES.favorites)
      if (favorite) store.put({ trackId, savedAt: Date.now() })
      else store.delete(trackId)
      await transactionPromise(tx)
      return Boolean(favorite)
    },

    async listFavorites() {
      const tx = db.transaction(STORE_NAMES.favorites, 'readonly')
      const result = await requestPromise(tx.objectStore(STORE_NAMES.favorites).getAll())
      await transactionPromise(tx)
      return result.sort((a, b) => b.savedAt - a.savedAt).map(row => row.trackId)
    },

    async addHistory(trackId, playedAt = Date.now()) {
      const tx = db.transaction(STORE_NAMES.history, 'readwrite')
      const store = tx.objectStore(STORE_NAMES.history)
      store.put({ id: makeId('history'), trackId, playedAt })
      await transactionPromise(tx)

      const trimTx = db.transaction(STORE_NAMES.history, 'readwrite')
      const trimStore = trimTx.objectStore(STORE_NAMES.history)
      const rows = await requestPromise(trimStore.getAll())
      rows.sort((a, b) => b.playedAt - a.playedAt)
      for (const row of rows.slice(200)) trimStore.delete(row.id)
      await transactionPromise(trimTx)
      return { trackId, playedAt }
    },

    async listHistory() {
      const tx = db.transaction(STORE_NAMES.history, 'readonly')
      const rows = await requestPromise(tx.objectStore(STORE_NAMES.history).getAll())
      await transactionPromise(tx)
      return rows.sort((a, b) => b.playedAt - a.playedAt).slice(0, 200)
    },

    async createPlaylist(name) {
      const playlist = { id: makeId('playlist'), name: String(name || 'Playlist').trim() || 'Playlist', createdAt: Date.now(), updatedAt: Date.now() }
      const tx = db.transaction(STORE_NAMES.playlists, 'readwrite')
      tx.objectStore(STORE_NAMES.playlists).put(playlist)
      await transactionPromise(tx)
      return playlist
    },

    async listPlaylists() {
      const tx = db.transaction(STORE_NAMES.playlists, 'readonly')
      const rows = await requestPromise(tx.objectStore(STORE_NAMES.playlists).getAll())
      await transactionPromise(tx)
      return rows.sort((a, b) => a.createdAt - b.createdAt)
    },

    async renamePlaylist(id, name) {
      const tx = db.transaction(STORE_NAMES.playlists, 'readwrite')
      const store = tx.objectStore(STORE_NAMES.playlists)
      const playlist = await requestPromise(store.get(id))
      if (!playlist) throw storageError('Playlist not found')
      playlist.name = String(name || '').trim() || playlist.name
      playlist.updatedAt = Date.now()
      store.put(playlist)
      await transactionPromise(tx)
      return playlist
    },

    async deletePlaylist(id) {
      const tx = db.transaction([STORE_NAMES.playlists, STORE_NAMES.playlistItems], 'readwrite')
      tx.objectStore(STORE_NAMES.playlists).delete(id)
      const itemStore = tx.objectStore(STORE_NAMES.playlistItems)
      const rows = await requestPromise(itemStore.index('playlistId').getAll(id))
      for (const row of rows) itemStore.delete(row.id)
      await transactionPromise(tx)
    },

    async setPlaylistItems(playlistId, trackIds = []) {
      const tx = db.transaction(STORE_NAMES.playlistItems, 'readwrite')
      const store = tx.objectStore(STORE_NAMES.playlistItems)
      const oldRows = await requestPromise(store.index('playlistId').getAll(playlistId))
      for (const row of oldRows) store.delete(row.id)
      trackIds.forEach((trackId, position) => {
        store.put({ id: `${playlistId}:${position}:${makeId('item')}`, playlistId, trackId, position })
      })
      await transactionPromise(tx)
      return [...trackIds]
    },

    async getPlaylistItems(playlistId) {
      const tx = db.transaction(STORE_NAMES.playlistItems, 'readonly')
      const rows = await requestPromise(tx.objectStore(STORE_NAMES.playlistItems).index('playlistId').getAll(playlistId))
      await transactionPromise(tx)
      return rows.sort((a, b) => a.position - b.position).map(row => row.trackId)
    },

    async saveQueue(snapshot) {
      const tx = db.transaction(STORE_NAMES.queue, 'readwrite')
      tx.objectStore(STORE_NAMES.queue).put({ key: 'active', value: cloneValue(snapshot) })
      await transactionPromise(tx)
    },

    async loadQueue() {
      const tx = db.transaction(STORE_NAMES.queue, 'readonly')
      const row = await requestPromise(tx.objectStore(STORE_NAMES.queue).get('active'))
      await transactionPromise(tx)
      return row?.value ?? null
    },

    async saveSettings(settings) {
      const tx = db.transaction(STORE_NAMES.settings, 'readwrite')
      tx.objectStore(STORE_NAMES.settings).put({ key: 'preferences', value: cloneValue(settings) })
      await transactionPromise(tx)
    },

    async loadSettings() {
      const tx = db.transaction(STORE_NAMES.settings, 'readonly')
      const row = await requestPromise(tx.objectStore(STORE_NAMES.settings).get('preferences'))
      await transactionPromise(tx)
      return row?.value ?? null
    },

    close() {
      db.close()
    }
  }

  return api
}

export { STORE_NAMES }
