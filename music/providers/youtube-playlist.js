import { ERROR_CODES, MusicCenterError } from '../music-contracts.js'
import { withProviderTimeout } from './provider-utils.js'
import { loadYouTubeApi } from './youtube.js'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function createProbeTarget(documentRef) {
  if (!documentRef?.createElement) return null
  const target = documentRef.createElement('div')
  target.className = 'mc-playlist-probe mc-youtube-playlist-probe'
  if (target.style) {
    target.style.position = 'fixed'
    target.style.left = '-10000px'
    target.style.top = '0'
    target.style.width = '200px'
    target.style.height = '200px'
    target.style.pointerEvents = 'none'
    target.style.opacity = '0'
  }
  documentRef.body?.append?.(target)
  return target
}

function normalizeVideoIds(values) {
  if (!Array.isArray(values)) return []
  return values.map(value => String(value || '').trim()).filter(Boolean)
}

export async function listYouTubePlaylistVideoIds(item, options = {}) {
  if (!item?.sourceId) throw new MusicCenterError(ERROR_CODES.INVALID_URL, 'YouTube playlist ID is required')
  const windowRef = options.windowRef || globalThis.window
  const documentRef = options.documentRef || globalThis.document
  const apiLoader = options.apiLoader || (() => loadYouTubeApi({ windowRef, documentRef }))
  const timeoutMs = Number.isFinite(options.readinessTimeoutMs) ? options.readinessTimeoutMs : 10000
  const pollIntervalMs = Number.isFinite(options.pollIntervalMs) ? options.pollIntervalMs : 100
  const ownedTarget = options.host ? null : createProbeTarget(documentRef)
  const target = options.host || ownedTarget
  if (!target) throw new MusicCenterError(ERROR_CODES.PLAYER_API_TIMEOUT, 'YouTube playlist probe requires a browser document')

  let player = null
  try {
    const api = await apiLoader()
    let resolveReady
    let rejectReady
    const readyPromise = new Promise((resolve, reject) => {
      resolveReady = resolve
      rejectReady = reject
    })
    player = api.createPlayer(target, {
      ready: () => resolveReady(player),
      stateChange: () => {},
      error: event => rejectReady(new MusicCenterError(
        ERROR_CODES.PLAYBACK_ERROR,
        `YouTube playlist probe error${event?.data != null ? ` (${event.data})` : ''}`
      ))
    })
    await withProviderTimeout(readyPromise, 'YouTube playlist probe', timeoutMs)
    player.cuePlaylist?.({ listType: 'playlist', list: item.sourceId })

    const deadline = Date.now() + timeoutMs
    let previous = null
    while (Date.now() < deadline) {
      const ids = normalizeVideoIds(player?.getPlaylist?.())
      if (ids.length && previous && ids.length === previous.length && ids.every((id, index) => id === previous[index])) return ids
      previous = ids.length ? ids : null
      await delay(pollIntervalMs)
    }
    throw new MusicCenterError(ERROR_CODES.PLAYER_API_TIMEOUT, 'YouTube playlist enumeration API timeout')
  } finally {
    player?.destroy?.()
    ownedTarget?.remove?.()
  }
}
