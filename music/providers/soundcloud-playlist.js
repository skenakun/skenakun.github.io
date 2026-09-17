import { ERROR_CODES, MusicCenterError } from '../music-contracts.js'
import { createTrustedIframe, mountProviderNode, removeProviderNode, withProviderTimeout } from './provider-utils.js'
import { buildSoundCloudPlayerUrl, loadSoundCloudApi } from './soundcloud.js'

function safeHttps(value) {
  try {
    const url = new URL(String(value || ''))
    return url.protocol === 'https:' ? url.href : ''
  } catch {
    return ''
  }
}

function normalizeSound(sound) {
  const canonicalUrl = safeHttps(sound?.permalink_url)
  if (!canonicalUrl) return null
  return {
    canonicalUrl,
    title: String(sound?.title || '').trim(),
    author: String(sound?.user?.username || sound?.publisher_metadata?.artist || '').trim(),
    artworkUrl: safeHttps(sound?.artwork_url)
  }
}

export async function listSoundCloudPlaylistItems(item, options = {}) {
  if (!item?.canonicalUrl) throw new MusicCenterError(ERROR_CODES.INVALID_URL, 'SoundCloud playlist URL is required')
  const windowRef = options.windowRef || globalThis.window
  const documentRef = options.documentRef || globalThis.document
  const apiLoader = options.apiLoader || (() => loadSoundCloudApi({ windowRef }))
  const timeoutMs = Number.isFinite(options.readinessTimeoutMs) ? options.readinessTimeoutMs : 10000
  const playerUrl = buildSoundCloudPlayerUrl(item.canonicalUrl)
  const iframe = options.iframeFactory
    ? options.iframeFactory(playerUrl)
    : createTrustedIframe({
        src: playerUrl,
        title: 'SoundCloud playlist probe',
        allow: 'autoplay',
        className: 'mc-playlist-probe mc-soundcloud-playlist-probe'
      })
  if (options.host) mountProviderNode(options.host, iframe)
  else {
    if (iframe.style) {
      iframe.style.position = 'fixed'
      iframe.style.left = '-10000px'
      iframe.style.top = '0'
      iframe.style.width = '200px'
      iframe.style.height = '166px'
      iframe.style.pointerEvents = 'none'
      iframe.style.opacity = '0'
    }
    documentRef?.body?.append?.(iframe)
  }

  let widget = null
  const readyEvent = windowRef?.SC?.Widget?.Events?.READY || 'ready'
  try {
    let factory = options.widgetFactory
    if (!factory) {
      const loaded = await apiLoader()
      factory = loaded
    }
    if (!factory) throw new MusicCenterError(ERROR_CODES.PLAYER_API_TIMEOUT, 'SoundCloud Widget API unavailable')
    widget = factory(iframe)
    await withProviderTimeout(new Promise((resolve, reject) => {
      widget.bind?.(readyEvent, resolve)
      const errorEvent = windowRef?.SC?.Widget?.Events?.ERROR || 'error'
      widget.bind?.(errorEvent, error => reject(new MusicCenterError(ERROR_CODES.PLAYBACK_ERROR, 'SoundCloud playlist probe error', error)))
    }), 'SoundCloud playlist probe', timeoutMs)

    const sounds = await withProviderTimeout(new Promise(resolve => {
      widget.getSounds?.(value => resolve(Array.isArray(value) ? value : []))
    }), 'SoundCloud playlist enumeration', timeoutMs)
    return sounds.map(normalizeSound).filter(Boolean)
  } finally {
    widget?.unbind?.(readyEvent)
    widget?.unbind?.(windowRef?.SC?.Widget?.Events?.ERROR || 'error')
    removeProviderNode(iframe)
  }
}
