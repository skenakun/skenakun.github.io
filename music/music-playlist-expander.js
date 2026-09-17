import { resolveMusicUrl } from './music-resolver.js'
import { listYouTubePlaylistVideoIds } from './providers/youtube-playlist.js'
import { listSoundCloudPlaylistItems } from './providers/soundcloud-playlist.js'

export const PLAYLIST_CACHE_TTL_MS = 6 * 60 * 60 * 1000

function defaultIdFactory() {
  if (globalThis.crypto?.randomUUID) return `pg-${globalThis.crypto.randomUUID()}`
  return `pg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

function providerLabel(item) {
  if (item?.sourceBrand === 'youtube-music') return 'YouTube Music'
  if (item?.provider === 'youtube') return 'YouTube'
  if (item?.provider === 'soundcloud') return 'SoundCloud'
  return 'Music'
}

export function isExpandablePlaylist(item) {
  return item?.type === 'playlist' && (item.provider === 'youtube' || item.provider === 'soundcloud')
}

function youtubeTrack(videoId, parent, now) {
  const canonicalUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`
  return {
    provider: 'youtube',
    sourceBrand: parent.sourceBrand || 'youtube',
    type: 'video',
    sourceId: videoId,
    canonicalUrl,
    originalUrl: canonicalUrl,
    fingerprint: `youtube:video:${videoId}`,
    startSeconds: 0,
    title: 'YouTube video',
    author: '',
    artworkUrl: `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`,
    providerLabel: parent.sourceBrand === 'youtube-music' ? 'YouTube Music' : 'YouTube',
    metadataState: 'loading',
    metadata: { title: '', author: '', artworkUrl: '' },
    libraryVisible: false,
    savedAt: now
  }
}

function soundCloudTrack(url, parent, now, immediate = null) {
  const entity = resolveMusicUrl(url)
  return {
    ...entity,
    sourceBrand: parent.sourceBrand || 'soundcloud',
    title: immediate?.title || 'SoundCloud track',
    author: immediate?.author || '',
    artworkUrl: immediate?.artworkUrl || '',
    providerLabel: 'SoundCloud',
    metadataState: immediate?.title || immediate?.author || immediate?.artworkUrl ? 'ready' : 'loading',
    metadata: {
      title: immediate?.title || '',
      author: immediate?.author || '',
      artworkUrl: immediate?.artworkUrl || ''
    },
    libraryVisible: false,
    savedAt: now
  }
}

function groupFor(parent, idFactory) {
  return {
    id: idFactory(),
    playlistFingerprint: parent.fingerprint,
    provider: parent.provider,
    sourceBrand: parent.sourceBrand || parent.provider,
    sourceId: parent.sourceId,
    title: parent.title || `${providerLabel(parent)} playlist`,
    artworkUrl: parent.artworkUrl || '',
    collapsed: false
  }
}

export async function expandPlaylist(item, options = {}) {
  if (!isExpandablePlaylist(item)) throw new TypeError('Playlist provider is not expandable')
  const store = options.store || null
  const nowFn = options.now || Date.now
  const currentTime = Number(nowFn())
  const cacheTtlMs = Number.isFinite(options.cacheTtlMs) ? options.cacheTtlMs : PLAYLIST_CACHE_TTL_MS
  const idFactory = options.idFactory || defaultIdFactory
  const youtubeLister = options.youtubeLister || listYouTubePlaylistVideoIds
  const soundcloudLister = options.soundcloudLister || listSoundCloudPlaylistItems
  const cached = await store?.getPlaylistExpansion?.(item.fingerprint) || null
  const fresh = cached && Number.isFinite(Number(cached.expandedAt)) && currentTime - Number(cached.expandedAt) <= cacheTtlMs

  let childIds = fresh ? [...(cached.childIds || [])] : null
  let immediateById = new Map()
  let usedStaleCache = false

  if (!childIds) {
    try {
      if (item.provider === 'youtube') {
        childIds = await youtubeLister(item, options)
      } else {
        const children = await soundcloudLister(item, options)
        childIds = children.map(child => child.canonicalUrl).filter(Boolean)
        immediateById = new Map(children.map(child => [child.canonicalUrl, child]))
      }
      await store?.savePlaylistExpansion?.({
        fingerprint: item.fingerprint,
        provider: item.provider,
        sourceId: item.sourceId,
        childIds: [...childIds],
        expandedAt: currentTime
      })
    } catch (error) {
      if (!cached?.childIds?.length) throw error
      childIds = [...cached.childIds]
      usedStaleCache = true
    }
  }

  const tracks = item.provider === 'youtube'
    ? childIds.map(id => youtubeTrack(id, item, currentTime))
    : childIds.map(url => soundCloudTrack(url, item, currentTime, immediateById.get(url)))

  return {
    group: groupFor(item, idFactory),
    tracks,
    usedStaleCache
  }
}
