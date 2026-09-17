import { createCapabilitySet, ERROR_CODES, MusicCenterError } from '../music-contracts.js'
import { loadScriptOnce, mountProviderNode, removeProviderNode, withProviderTimeout } from './provider-utils.js'

const SPOTIFY_API = 'https://open.spotify.com/embed/iframe-api/v1'
let spotifyApiValue = null

export function loadSpotifyApi({ windowRef = globalThis.window, documentRef = globalThis.document } = {}) {
  if (spotifyApiValue) return Promise.resolve(spotifyApiValue)
  return loadScriptOnce({
    key: 'spotify-iframe-api',
    timeoutMs: 8000,
    loader: () => new Promise((resolve, reject) => {
      if (!windowRef || !documentRef?.createElement) {
        reject(new Error('Spotify IFrame API requires a browser document'))
        return
      }
      const previousReady = windowRef.onSpotifyIframeApiReady
      windowRef.onSpotifyIframeApiReady = api => {
        try { previousReady?.(api) } catch (error) { console.warn('Previous Spotify ready callback failed', error) }
        spotifyApiValue = api
        resolve(api)
      }
      const existing = documentRef.querySelector?.(`script[src="${SPOTIFY_API}"]`)
      if (!existing) {
        const script = documentRef.createElement('script')
        script.async = true
        script.src = SPOTIFY_API
        script.dataset.musicProviderScript = 'spotify-iframe-api'
        script.onerror = () => reject(new Error('Unable to load Spotify IFrame API'))
        documentRef.body?.append(script) || documentRef.head.append(script)
      }
    })
  })
}

function spotifyUriToUrl(uri) {
  const match = String(uri || '').match(/^spotify:(track|episode):([^:]+)$/i)
  return match ? `https://open.spotify.com/${match[1].toLowerCase()}/${encodeURIComponent(match[2])}` : ''
}

async function loadSpotifyOEmbedMetadata(canonicalUrl) {
  if (!canonicalUrl || typeof globalThis.fetch !== 'function') return null
  try {
    const response = await globalThis.fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(canonicalUrl)}`)
    if (!response?.ok) return null
    const data = await response.json()
    return {
      title: String(data?.title || '').trim(),
      author: '',
      artworkUrl: String(data?.thumbnail_url || '').trim(),
      canonicalUrl
    }
  } catch {
    return null
  }
}

export function createSpotifyAdapter({
  host,
  emit = () => {},
  windowRef = globalThis.window,
  documentRef = globalThis.document,
  apiLoader = () => loadSpotifyApi({ windowRef, documentRef }),
  metadataLoader = loadSpotifyOEmbedMetadata,
  readinessTimeoutMs = 10000
} = {}) {
  if (!host) throw new TypeError('Spotify adapter requires a host')
  let controller = null
  let state = { status: 'idle', position: 0, duration: null }
  let ownedNode = null
  let metadataToken = 0
  let lastPlayingUri = ''

  const capabilities = createCapabilitySet({
    play: true,
    pause: true,
    seek: true,
    progress: true
  })

  function syncPlayingMetadata(playingURI) {
    const uri = String(playingURI || '')
    if (!uri || uri === lastPlayingUri) return
    const canonicalUrl = spotifyUriToUrl(uri)
    if (!canonicalUrl) return
    lastPlayingUri = uri
    const token = ++metadataToken
    void Promise.resolve(metadataLoader(canonicalUrl)).then(metadata => {
      if (!metadata || token !== metadataToken) return
      emit('metadata', { ...metadata, canonicalUrl, providerLabel: 'Spotify', state: 'ready' })
    }).catch(() => {})
  }

  function attachListeners(active) {
    active.addListener?.('ready', () => {
      state = { ...state, status: 'ready' }
      emit('ready')
    })
    active.addListener?.('playback_started', event => {
      const playingURI = event?.data?.playingURI || null
      state = { ...state, status: 'playing' }
      syncPlayingMetadata(playingURI)
      emit('playing', { playingURI })
    })
    active.addListener?.('playback_update', event => {
      const data = event?.data || {}
      const position = Number(data.position || 0) / 1000
      const duration = Number(data.duration || 0) / 1000 || null
      const status = data.isPaused ? 'paused' : data.isBuffering ? 'loading' : 'playing'
      state = { ...state, status, position, duration }
      syncPlayingMetadata(data.playingURI)
      emit('progress', { position, duration, paused: Boolean(data.isPaused), buffering: Boolean(data.isBuffering) })
      if (data.isPaused) emit('paused')
      else if (!data.isBuffering) emit('playing')
    })
  }

  async function ensureController(initialItem) {
    if (controller) return controller
    const api = await apiLoader()
    let target = host
    if (documentRef?.createElement && typeof host.replaceChildren === 'function') {
      target = documentRef.createElement('div')
      target.className = 'mc-provider-frame mc-spotify-frame'
      ownedNode = target
      mountProviderNode(host, target)
    }
    const controllerPromise = new Promise((resolve, reject) => {
      try {
        api.createController(target, {
          url: initialItem?.canonicalUrl,
          width: '100%',
          height: '100%'
        }, created => {
          attachListeners(created)
          resolve(created)
        })
      } catch (cause) {
        reject(new MusicCenterError(ERROR_CODES.PLAYBACK_ERROR, 'Unable to create Spotify player', cause))
      }
    })
    try {
      controller = await withProviderTimeout(controllerPromise, 'Spotify player', readinessTimeoutMs)
      return controller
    } catch (error) {
      removeProviderNode(ownedNode)
      ownedNode = null
      throw error
    }
  }

  return {
    kind: 'controlled',
    capabilities,
    async load(item) {
      state = { ...state, status: 'loading', position: 0, duration: null }
      const active = await ensureController(item)
      active.loadEntity?.(item.canonicalUrl, false, item.startSeconds || 0)
    },
    async play() { controller?.play?.() },
    async pause() { controller?.pause?.() },
    async seek(seconds) { controller?.seek?.(Math.max(0, Number(seconds) || 0)) },
    async setVolume() {},
    getState() { return { ...state } },
    destroy() {
      controller?.destroy?.()
      controller = null
      metadataToken += 1
      lastPlayingUri = ''
      state = { status: 'idle', position: 0, duration: null }
      removeProviderNode(ownedNode)
      ownedNode = null
    }
  }
}
