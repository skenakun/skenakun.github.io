import { resolveMusicUrl } from './music/music-resolver.js'
import { openMusicStore } from './music/music-store.js'
import {
  addGroupToEnd,
  addToEnd,
  createQueueState,
  getCurrentEntry,
  moveNext,
  movePrevious,
  normalizeQueueState,
  removeEntry,
  removeGroup,
  reorderEntry,
  setGroupCollapsed,
  setRepeatMode,
  setShuffle
} from './music/music-queue.js'
import { resolveMetadata, PROVIDER_LABELS } from './music/music-metadata.js'
import { createProviderAdapter } from './music/provider-registry.js'
import { createPlayerManager } from './music/music-player.js'
import { createMusicView } from './music/music-view.js'
import { expandPlaylist, isExpandablePlaylist } from './music/music-playlist-expander.js'

const DEFAULT_SETTINGS = Object.freeze({
  volume: 0.8,
  activeView: 'home',
  minimized: false,
  lastTrackFingerprint: null
})

let initPromise = null
let app = null

export function cycleRepeatMode(mode) {
  if (mode === 'off') return 'all'
  if (mode === 'all') return 'one'
  return 'off'
}

export function mergeTrackMetadata(track, metadata = {}) {
  return {
    ...track,
    title: metadata.title || track.title || '',
    author: metadata.author || track.author || '',
    artworkUrl: metadata.artworkUrl || track.artworkUrl || '',
    providerLabel: metadata.providerLabel || track.providerLabel || '',
    metadataState: metadata.state || track.metadataState || 'unavailable',
    metadata: {
      title: metadata.title || track.metadata?.title || '',
      author: metadata.author || track.metadata?.author || '',
      artworkUrl: metadata.artworkUrl || track.metadata?.artworkUrl || ''
    }
  }
}

export function queueTracksForView(queueState, tracksById) {
  const byEntryId = new Map((queueState?.entries || []).map(entry => [entry.id, entry]))
  return (queueState?.playOrder || []).map(entryId => {
    const entry = byEntryId.get(entryId)
    const track = entry ? tracksById.get(entry.trackId) : null
    return track ? {
      ...track,
      queueEntryId: entry.id,
      queueGroupId: entry.groupId || null,
      queueGroupIndex: Number.isInteger(entry.groupIndex) ? entry.groupIndex : null
    } : null
  }).filter(Boolean)
}

export function applyExpandedPlaylistToQueue(queueState, expansion, options = {}) {
  const tracks = Array.isArray(expansion?.tracks) ? expansion.tracks : []
  if (!expansion?.group || !tracks.length) return { queue: queueState, startTrack: null }
  const queue = addGroupToEnd(queueState, expansion.group, tracks.map(track => track.fingerprint), options.idFactory)
  if (!options.activateFirst) return { queue, startTrack: null }
  const firstGroupEntry = queue.entries.find(entry => entry.groupId === expansion.group.id)
  const cursor = firstGroupEntry ? queue.playOrder.indexOf(firstGroupEntry.id) : -1
  return {
    queue: cursor >= 0 ? { ...queue, cursor } : queue,
    startTrack: tracks[0] || null
  }
}

export function normalizeStoredMusicState(tracks = [], snapshot = null) {
  const fingerprintMap = new Map()
  const byFingerprint = new Map()
  for (const track of tracks || []) {
    let normalized = track
    if (track?.provider === 'spotify' && (String(track.type || '').startsWith('intl-') || /open\.spotify\.com\/intl-[a-z]{2,3}\//i.test(track.canonicalUrl || track.originalUrl || ''))) {
      try {
        const entity = resolveMusicUrl(track.originalUrl || track.canonicalUrl)
        normalized = {
          ...track,
          ...entity,
          title: /^Spotify intl-/i.test(String(track.title || '')) ? `Spotify ${entity.type}` : track.title,
          providerLabel: 'Spotify'
        }
      } catch {
        normalized = track
      }
    }
    fingerprintMap.set(track.fingerprint, normalized.fingerprint)
    const prior = byFingerprint.get(normalized.fingerprint)
    byFingerprint.set(normalized.fingerprint, prior
      ? { ...prior, ...normalized, libraryVisible: prior.libraryVisible !== false || normalized.libraryVisible !== false }
      : normalized)
  }
  const queue = normalizeQueueState(snapshot)
  const remappedQueue = {
    ...queue,
    entries: queue.entries.map(entry => ({ ...entry, trackId: fingerprintMap.get(entry.trackId) || entry.trackId }))
  }
  return { tracks: [...byFingerprint.values()], queue: remappedQueue, fingerprintMap }
}

export function queueCanMove(queueState) {
  const length = queueState?.playOrder?.length || 0
  const cursor = Number.isInteger(queueState?.cursor) ? queueState.cursor : -1
  if (!length || cursor < 0) return { previous: false, next: false }
  if (queueState.repeatMode === 'one') return { previous: true, next: true }
  const wraps = queueState.repeatMode === 'all' && length > 1
  return {
    previous: cursor > 0 || wraps,
    next: cursor < length - 1 || wraps
  }
}

function providerLabel(item) {
  if (item.sourceBrand === 'youtube-music') return 'YouTube Music'
  return PROVIDER_LABELS[item.provider] || item.provider || 'Music'
}

function immediateTrack(entity) {
  const label = providerLabel(entity)
  return {
    ...entity,
    title: `${label} ${entity.type || 'content'}`,
    author: '',
    artworkUrl: '',
    providerLabel: label,
    metadataState: 'loading',
    metadata: { title: '', author: '', artworkUrl: '' },
    libraryVisible: true,
    savedAt: Date.now()
  }
}

function validQueueSnapshot(snapshot) {
  return normalizeQueueState(snapshot)
}

function userMessage(error) {
  const code = error?.code
  if (code === 'INVALID_URL') return 'Use a valid HTTPS music link.'
  if (code === 'UNSUPPORTED_PROVIDER') return 'That streaming provider is not supported yet.'
  if (code === 'PLAYER_API_TIMEOUT') return 'The provider player took too long to load. You can retry or open the original link.'
  if (code === 'STORAGE_ERROR') return 'Music Center could not save local data in this browser.'
  return error?.message || 'Music Center could not complete that action.'
}

function createDebouncedAction(callback, delay = 150) {
  let timer = null
  return {
    schedule() {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        void Promise.resolve(callback()).catch(error => console.warn('Music Center persistence failed', error))
      }, delay)
    },
    flush() {
      if (!timer) return Promise.resolve()
      clearTimeout(timer)
      timer = null
      return Promise.resolve(callback())
    },
    cancel() {
      if (timer) clearTimeout(timer)
      timer = null
    }
  }
}

async function createApp(options = {}) {
  const documentRef = options.documentRef || globalThis.document
  const windowRef = options.windowRef || globalThis.window
  if (!documentRef) throw new Error('Music Center requires a browser document')

  const overlayRoot = documentRef.getElementById('music-center-root')
  const miniRoot = documentRef.getElementById('music-mini-player')
  const playbackHost = documentRef.getElementById('mc-playback-host')
  if (!overlayRoot || !miniRoot || !playbackHost) throw new Error('Music Center mount points are missing')

  const store = await openMusicStore()
  const [savedSettings, savedQueue, tracks, favorites, history, playlists] = await Promise.all([
    store.loadSettings(),
    store.loadQueue(),
    store.listTracks(),
    store.listFavorites(),
    store.listHistory(),
    store.listPlaylists()
  ])

  let settings = { ...DEFAULT_SETTINGS, ...(savedSettings || {}) }
  const normalizedStored = normalizeStoredMusicState(tracks || [], savedQueue)
  let queueState = normalizedStored.queue
  let tracksById = new Map(normalizedStored.tracks.map(track => [track.fingerprint, track]))
  let favoriteIds = new Set(favorites || [])
  let historyRows = history || []
  let playlistRows = playlists || []
  let selectedPlaylistId = null
  const restoredTrackId = normalizedStored.fingerprintMap.get(settings.lastTrackFingerprint) || settings.lastTrackFingerprint
  let selectedTrack = restoredTrackId ? tracksById.get(restoredTrackId) || null : null
  let lastNonZeroVolume = settings.volume > 0 ? settings.volume : 0.8
  let lastHistoryFingerprint = null
  let lastPlayerState = null
  let destroyed = false

  const queueWriter = createDebouncedAction(() => store.saveQueue(queueState))
  const settingsWriter = createDebouncedAction(() => store.saveSettings(settings))

  function trackFromCurrentQueue() {
    const entry = getCurrentEntry(queueState)
    return entry ? tracksById.get(entry.trackId) || null : null
  }

  function updateSettings(patch) {
    settings = { ...settings, ...patch }
    settingsWriter.schedule()
  }

  function scheduleQueue() {
    queueWriter.schedule()
  }

  function currentLibraryModel(overrides = {}) {
    return {
      tracks: [...tracksById.values()].sort((a, b) => Number(b.savedAt || 0) - Number(a.savedAt || 0)),
      favorites: [...favoriteIds],
      history: historyRows,
      playlists: playlistRows,
      queue: queueTracksForView(queueState, tracksById),
      queueState,
      ...overrides
    }
  }

  let view = null
  let player = null

  function renderLibrary(overrides = {}) {
    view?.renderLibrary(currentLibraryModel(overrides))
  }

  function renderPlayer(state = player?.getState?.() || {}) {
    const current = state.currentItem || selectedTrack || null
    const movement = queueCanMove(queueState)
    view?.renderPlayer({
      ...state,
      currentItem: current,
      favorite: Boolean(current && favoriteIds.has(current.fingerprint)),
      canQueueNext: movement.next,
      canQueuePrevious: movement.previous
    })
  }

  function commitQueue(nextState) {
    queueState = validQueueSnapshot(nextState)
    selectedTrack = trackFromCurrentQueue() || selectedTrack
    scheduleQueue()
    renderLibrary()
    renderPlayer()
  }

  function focusTrackInQueue(trackId) {
    const existing = queueState.entries.find(entry => entry.trackId === trackId)
    if (existing) {
      const cursor = queueState.playOrder.indexOf(existing.id)
      if (cursor >= 0) commitQueue({ ...queueState, cursor })
      return existing
    }
    const next = addToEnd(queueState, trackId)
    const entry = next.entries[next.entries.length - 1]
    const cursor = next.playOrder.indexOf(entry.id)
    commitQueue({ ...next, cursor })
    return entry
  }

  function moveQueue(direction) {
    const before = getCurrentEntry(queueState)
    const nextState = direction === 'previous' ? movePrevious(queueState) : moveNext(queueState)
    const after = getCurrentEntry(nextState)
    const canRepeatOne = queueState.repeatMode === 'one' && Boolean(before)
    if ((!after || after.id === before?.id) && !canRepeatOne) return null
    commitQueue(nextState)
    return tracksById.get(after.trackId) || null
  }

  const queueController = {
    next() { return moveQueue('next') },
    previous() { return moveQueue('previous') }
  }

  player = createPlayerManager({
    initialVolume: settings.volume,
    queueController,
    createAdapter: (item, emit) => createProviderAdapter(item, { host: playbackHost, emit, windowRef, documentRef })
  })

  async function refreshPersistentCollections() {
    const [favoriteList, nextHistory, nextPlaylists] = await Promise.all([
      store.listFavorites(), store.listHistory(), store.listPlaylists()
    ])
    favoriteIds = new Set(favoriteList)
    historyRows = nextHistory
    playlistRows = nextPlaylists
    renderLibrary()
    renderPlayer()
  }

  async function syncTrackFromPlayback(track) {
    if (!track?.fingerprint) return
    const current = tracksById.get(track.fingerprint)
    if (!current) return
    const merged = { ...mergeTrackMetadata(current, track), activeCanonicalUrl: track.activeCanonicalUrl || current.activeCanonicalUrl || '' }
    tracksById.set(track.fingerprint, merged)
    selectedTrack = merged
    const identityChanged = Boolean(track.activeCanonicalUrl && current.canonicalUrl && track.activeCanonicalUrl !== current.canonicalUrl)
    if (!identityChanged) await store.saveTrack(merged)
    renderLibrary()
    renderPlayer(player?.getState?.() || {})
  }

  async function enrichTracksBounded(tracks, concurrency = 4) {
    const pending = [...new Map((tracks || []).map(track => [track.fingerprint, track])).values()]
    let cursor = 0
    async function worker() {
      while (!destroyed) {
        const index = cursor
        cursor += 1
        if (index >= pending.length) return
        try { await enrichMetadata(pending[index]) } catch (error) { console.warn('Music Center metadata lookup failed', error) }
      }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, pending.length) }, () => worker()))
  }

  async function enrichMetadata(track) {
    const metadata = await resolveMetadata(track)
    if (destroyed) return
    const current = tracksById.get(track.fingerprint)
    if (!current) return
    const merged = mergeTrackMetadata(current, metadata)
    tracksById.set(track.fingerprint, merged)
    await store.saveTrack(merged)
    if (selectedTrack?.fingerprint === merged.fingerprint) selectedTrack = merged
    renderLibrary()
    renderPlayer()
  }

  async function saveExpandedTracks(tracks) {
    const saved = []
    for (const child of tracks) {
      const existing = tracksById.get(child.fingerprint)
      const merged = existing
        ? {
            ...child,
            ...existing,
            title: existing.title && existing.title !== `${existing.providerLabel || providerLabel(existing)} ${existing.type || 'content'}` ? existing.title : child.title,
            author: existing.author || child.author,
            artworkUrl: existing.artworkUrl || child.artworkUrl,
            libraryVisible: existing.libraryVisible !== false
          }
        : child
      tracksById.set(merged.fingerprint, merged)
      await store.saveTrack(merged)
      saved.push(merged)
    }
    return saved
  }

  async function addExpandedPlaylist(parentTrack, { activateFirst = false } = {}) {
    const expansion = await expandPlaylist(parentTrack, { store, windowRef, documentRef })
    const tracks = await saveExpandedTracks(expansion.tracks)
    const applied = applyExpandedPlaylistToQueue(queueState, { ...expansion, tracks }, { activateFirst })
    commitQueue(applied.queue)
    renderLibrary()
    if (expansion.usedStaleCache) view.showNotice('Playlist loaded from cached contents because the provider refresh failed.', 'info')
    else view.showNotice(`Added ${tracks.length} playlist item${tracks.length === 1 ? '' : 's'} to queue.`, 'success')
    void enrichTracksBounded(tracks)
    if (applied.startTrack) await loadAndMaybePlay(applied.startTrack, true, { focusQueue: false })
    return { expansion: { ...expansion, tracks }, startTrack: applied.startTrack }
  }

  async function addUrl(rawUrl) {
    const entity = resolveMusicUrl(rawUrl)
    const existing = tracksById.get(entity.fingerprint)
    const track = existing
      ? { ...existing, originalUrl: entity.originalUrl, canonicalUrl: entity.canonicalUrl, libraryVisible: true, savedAt: existing.savedAt || Date.now() }
      : immediateTrack(entity)
    tracksById.set(track.fingerprint, track)
    await store.saveTrack(track)
    renderLibrary()

    if (isExpandablePlaylist(track)) {
      const activateFirst = !player.getState().currentItem
      try {
        return await addExpandedPlaylist(track, { activateFirst })
      } catch (error) {
        view.showNotice(userMessage(error), 'error')
        throw error
      }
    }

    view.showNotice(existing ? 'Link already exists in your library.' : 'Added to your Music Center.', 'success')
    void enrichMetadata(track).catch(error => console.warn('Music Center metadata lookup failed', error))
    return track
  }

  async function loadAndMaybePlay(track, autoplay = true, options = {}) {
    if (!track) return
    selectedTrack = track
    if (options.focusQueue !== false) focusTrackInQueue(track.fingerprint)
    updateSettings({ lastTrackFingerprint: track.fingerprint })
    await player.load(track)
    renderPlayer()
    if (autoplay && player.getState().capabilities.play) await player.play()
    else if (!player.getState().capabilities.play) view.showNotice('This provider uses its official page for playback. Open Original is available above.', 'info')
  }

  async function toggleFavorite(trackId) {
    if (!trackId || !tracksById.has(trackId)) return
    const next = !favoriteIds.has(trackId)
    await store.setFavorite(trackId, next)
    if (next) favoriteIds.add(trackId)
    else favoriteIds.delete(trackId)
    renderLibrary()
    renderPlayer()
  }

  async function createLocalPlaylist(name) {
    const clean = String(name || '').trim()
    if (!clean) return null
    const playlist = await store.createPlaylist(clean)
    playlistRows = await store.listPlaylists()
    renderLibrary()
    return playlist
  }

  async function choosePlaylistForTrack(trackId) {
    if (!tracksById.has(trackId)) return
    let playlist = null
    if (!playlistRows.length) {
      const name = windowRef?.prompt?.('New playlist name', 'My Playlist')
      playlist = await createLocalPlaylist(name)
    } else if (playlistRows.length === 1) {
      playlist = playlistRows[0]
    } else {
      const choices = playlistRows.map(row => row.name).join(', ')
      const name = windowRef?.prompt?.(`Add to playlist: ${choices}`, playlistRows[0].name)
      playlist = playlistRows.find(row => row.id === name || row.name.toLowerCase() === String(name || '').trim().toLowerCase()) || null
    }
    if (!playlist) return
    const items = await store.getPlaylistItems(playlist.id)
    if (!items.includes(trackId)) await store.setPlaylistItems(playlist.id, [...items, trackId])
    view.showNotice(`Added to ${playlist.name}.`, 'success')
  }

  async function openPlaylist(playlistId) {
    const playlist = playlistRows.find(row => row.id === playlistId)
    if (!playlist) return
    selectedPlaylistId = playlistId
    const ids = await store.getPlaylistItems(playlistId)
    const filtered = ids.map(id => tracksById.get(id)).filter(Boolean)
    view.setActiveView('library')
    renderLibrary({ tracks: filtered })
    view.showNotice(`${playlist.name} · ${filtered.length} item${filtered.length === 1 ? '' : 's'}`, 'info')
  }

  function reorderVisibleQueue(from, to) {
    if (!Number.isInteger(from) || !Number.isInteger(to) || from === to) return
    if (queueState.shuffle) {
      if (from < 0 || to < 0 || from >= queueState.playOrder.length || to >= queueState.playOrder.length) return
      const activeId = getCurrentEntry(queueState)?.id || null
      const playOrder = [...queueState.playOrder]
      const [moved] = playOrder.splice(from, 1)
      playOrder.splice(to, 0, moved)
      const cursor = activeId ? playOrder.indexOf(activeId) : queueState.cursor
      commitQueue({ ...queueState, playOrder, cursor })
      return
    }
    commitQueue(reorderEntry(queueState, from, to))
  }

  async function handleIntent(intent = {}) {
    try {
      if (intent.type !== 'queue' && intent.type !== 'queue-close') view.showNotice('')
      switch (intent.type) {
        case 'ADD_URL':
          await addUrl(intent.value)
          break
        case 'navigate':
          selectedPlaylistId = null
          renderLibrary()
          view.setActiveView(intent.view || 'home')
          updateSettings({ activeView: intent.view || 'home' })
          break
        case 'play-item': {
          const track = tracksById.get(intent.id)
          if (track && isExpandablePlaylist(track)) await addExpandedPlaylist(track, { activateFirst: true })
          else await loadAndMaybePlay(track, true)
          break
        }
        case 'play-pause': {
          const state = player.getState()
          if (!state.currentItem && selectedTrack) await loadAndMaybePlay(selectedTrack, true)
          else if (state.status === 'playing') await player.pause()
          else if (state.currentItem) await player.play()
          break
        }
        case 'previous':
          await player.previous()
          break
        case 'next':
          await player.next()
          break
        case 'seek':
          await player.seek(intent.value)
          break
        case 'seek-relative': {
          const state = player.getState()
          await player.seek(Math.max(0, state.position + Number(intent.value || 0)))
          break
        }
        case 'volume':
          if (Number(intent.value) > 0) lastNonZeroVolume = Number(intent.value)
          await player.setVolume(intent.value)
          updateSettings({ volume: player.getState().volume })
          break
        case 'mute-toggle': {
          const state = player.getState()
          const nextVolume = state.volume > 0 ? 0 : lastNonZeroVolume
          if (state.volume > 0) lastNonZeroVolume = state.volume
          await player.setVolume(nextVolume)
          updateSettings({ volume: nextVolume })
          break
        }
        case 'favorite':
          await toggleFavorite((player.getState().currentItem || selectedTrack)?.fingerprint)
          break
        case 'favorite-item':
          await toggleFavorite(intent.id)
          break
        case 'playlist-add':
          await choosePlaylistForTrack(intent.id)
          break
        case 'create-playlist': {
          const name = windowRef?.prompt?.('Playlist name', 'New Playlist')
          const created = await createLocalPlaylist(name)
          if (created) view.showNotice(`Created ${created.name}.`, 'success')
          break
        }
        case 'playlist-open':
          await openPlaylist(intent.id)
          break
        case 'queue-play': {
          const cursor = queueState.playOrder.indexOf(intent.id)
          const entry = queueState.entries.find(row => row.id === intent.id)
          if (cursor >= 0 && entry) {
            commitQueue({ ...queueState, cursor })
            await loadAndMaybePlay(tracksById.get(entry.trackId), true, { focusQueue: false })
          }
          break
        }
        case 'queue-remove':
          commitQueue(removeEntry(queueState, intent.id))
          break
        case 'queue-group-remove':
          commitQueue(removeGroup(queueState, intent.id))
          break
        case 'queue-group-toggle': {
          const group = (queueState.groups || []).find(row => row.id === intent.id)
          if (group) commitQueue(setGroupCollapsed(queueState, intent.id, !group.collapsed))
          break
        }
        case 'queue-reorder':
          reorderVisibleQueue(intent.from, intent.to)
          break
        case 'shuffle':
          commitQueue(setShuffle(queueState, !queueState.shuffle))
          break
        case 'repeat':
          commitQueue(setRepeatMode(queueState, cycleRepeatMode(queueState.repeatMode)))
          break
        case 'queue':
          view.setQueueOpen(true)
          break
        case 'queue-close':
          view.setQueueOpen(false)
          break
        case 'minimize':
          player.setMinimized(true)
          view.minimize()
          updateSettings({ minimized: true })
          break
        case 'reopen':
          view.show()
          player.setMinimized(false)
          updateSettings({ minimized: false })
          break
        case 'retry': {
          const current = player.getState().currentItem || selectedTrack
          if (current) await loadAndMaybePlay(current, true)
          break
        }
        default:
          break
      }
    } catch (error) {
      console.warn('Music Center action failed', error)
      view.showNotice(userMessage(error), 'error')
    }
  }

  view = createMusicView({
    overlayRoot,
    miniRoot,
    playbackHost,
    documentRef,
    dispatch: intent => { void handleIntent(intent) }
  })

  view.renderLibrary(currentLibraryModel())
  if (['home', 'library', 'favorites', 'recent'].includes(settings.activeView)) view.setActiveView(settings.activeView)
  renderPlayer(player.getState())

  const unsubscribe = player.subscribe(state => {
    const previous = lastPlayerState
    lastPlayerState = state
    if (state.currentItem) {
      selectedTrack = state.currentItem
      const stored = tracksById.get(state.currentItem.fingerprint)
      if (stored && (stored.title !== state.currentItem.title || stored.author !== state.currentItem.author || stored.artworkUrl !== state.currentItem.artworkUrl || state.currentItem.activeCanonicalUrl)) {
        void syncTrackFromPlayback(state.currentItem).catch(error => console.warn('Music Center playback metadata sync failed', error))
      }
    }
    renderPlayer(state)

    const fingerprint = state.currentItem?.fingerprint || null
    if (state.status === 'playing' && fingerprint && fingerprint !== lastHistoryFingerprint) {
      lastHistoryFingerprint = fingerprint
      void store.addHistory(fingerprint, Date.now()).then(async () => {
        historyRows = await store.listHistory()
        renderLibrary()
      }).catch(error => console.warn('Music Center history save failed', error))
    }

    if (!previous || previous.volume !== state.volume) updateSettings({ volume: state.volume })
    if (!previous || previous.minimized !== state.minimized) updateSettings({ minimized: state.minimized })
    if (fingerprint && previous?.currentItem?.fingerprint !== fingerprint) updateSettings({ lastTrackFingerprint: fingerprint })
  })

  return {
    store,
    player,
    view,
    async refresh() {
      tracksById = new Map((await store.listTracks()).map(track => [track.fingerprint, track]))
      await refreshPersistentCollections()
    },
    async destroy() {
      if (destroyed) return
      destroyed = true
      unsubscribe()
      await Promise.allSettled([queueWriter.flush(), settingsWriter.flush()])
      player.destroy()
      view.destroy()
      store.close()
    }
  }
}

export function initMusicCenter() {
  if (initPromise) return initPromise
  initPromise = createApp().then(value => {
    app = value
    return value
  }).catch(error => {
    initPromise = null
    throw error
  })
  return initPromise
}

export async function openMusicCenter() {
  const instance = app || await initMusicCenter()
  instance.view.show()
  instance.player.setMinimized(false)
  return instance
}

export function getMusicCenterAppForTests() {
  return app
}
