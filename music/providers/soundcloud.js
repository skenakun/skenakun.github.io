import { createCapabilitySet, ERROR_CODES, MusicCenterError } from '../music-contracts.js'
import { createTrustedIframe, loadScriptOnce, mountProviderNode, removeProviderNode, withProviderTimeout } from './provider-utils.js'

const SC_API = 'https://w.soundcloud.com/player/api.js'
const SC_PLAYER = 'https://w.soundcloud.com/player/'

function buildSoundCloudPlayerUrl(canonicalUrl) {
  const url = new URL(SC_PLAYER)
  url.searchParams.set('url', canonicalUrl)
  url.searchParams.set('auto_play', 'false')
  url.searchParams.set('show_artwork', 'true')
  url.searchParams.set('single_active', 'true')
  url.searchParams.set('show_comments', 'false')
  return url.href
}

export function loadSoundCloudApi({ windowRef = globalThis.window } = {}) {
  if (windowRef?.SC?.Widget) return Promise.resolve(windowRef.SC.Widget)
  return loadScriptOnce({
    key: 'soundcloud-widget-api',
    src: SC_API,
    ready: () => windowRef?.SC?.Widget,
    timeoutMs: 8000
  })
}

export function createSoundCloudAdapter({
  host,
  emit = () => {},
  windowRef = globalThis.window,
  documentRef = globalThis.document,
  apiLoader = () => loadSoundCloudApi({ windowRef }),
  widgetFactory,
  iframeFactory,
  readinessTimeoutMs = 10000
} = {}) {
  if (!host) throw new TypeError('SoundCloud adapter requires a host')
  let widget = null
  let ownedNode = null
  let currentUrl = null
  let state = { status: 'idle', position: 0, duration: null }

  const capabilities = createCapabilitySet({
    play: true,
    pause: true,
    seek: true,
    volume: true,
    progress: true,
    endedEvent: true
  })

  const events = windowRef?.SC?.Widget?.Events || {
    READY: 'ready', PLAY: 'play', PAUSE: 'pause', FINISH: 'finish', PLAY_PROGRESS: 'playProgress', ERROR: 'error'
  }

  function emitCurrentMetadata(active) {
    active.getCurrentSound?.(sound => {
      if (!sound) return
      emit('metadata', {
        state: 'ready',
        title: String(sound.title || '').trim(),
        author: String(sound.user?.username || sound.publisher_metadata?.artist || '').trim(),
        artworkUrl: String(sound.artwork_url || '').trim(),
        providerLabel: 'SoundCloud',
        canonicalUrl: String(sound.permalink_url || '').trim()
      })
    })
  }

  function bindWidget(active) {
    return new Promise((resolve, reject) => {
      active.bind?.(events.READY, () => {
        state = { ...state, status: 'ready' }
        active.getDuration?.(durationMs => {
          state = { ...state, duration: Number(durationMs || 0) / 1000 || null }
        })
        emit('ready')
        resolve(active)
      })
      active.bind?.(events.PLAY, () => {
        state = { ...state, status: 'playing' }
        emitCurrentMetadata(active)
        emit('playing')
      })
      active.bind?.(events.PAUSE, () => {
        state = { ...state, status: 'paused' }
        emit('paused')
      })
      active.bind?.(events.FINISH, () => {
        state = { ...state, status: 'paused' }
        emit('ended')
      })
      active.bind?.(events.PLAY_PROGRESS, data => {
        const position = Number(data?.currentPosition || 0) / 1000
        state = { ...state, position }
        emit('progress', { position, duration: state.duration })
      })
      active.bind?.(events.ERROR, error => {
        const wrapped = new MusicCenterError(ERROR_CODES.PLAYBACK_ERROR, 'SoundCloud playback error', error)
        reject(wrapped)
        emit('error', wrapped)
      })
    })
  }

  async function ensureWidget(item) {
    if (widget) return widget
    if (!widgetFactory) await apiLoader()
    const playerUrl = buildSoundCloudPlayerUrl(item.canonicalUrl)
    const iframe = iframeFactory
      ? iframeFactory(playerUrl)
      : createTrustedIframe({
          src: playerUrl,
          title: 'SoundCloud player',
          allow: 'autoplay',
          className: 'mc-provider-frame mc-soundcloud-frame'
        })
    ownedNode = iframe
    mountProviderNode(host, iframe)
    const factory = widgetFactory || windowRef?.SC?.Widget
    if (!factory) throw new MusicCenterError(ERROR_CODES.PLAYER_API_TIMEOUT, 'SoundCloud Widget API unavailable')
    widget = factory(iframe)
    try {
      await withProviderTimeout(bindWidget(widget), 'SoundCloud widget', readinessTimeoutMs)
      return widget
    } catch (error) {
      widget = null
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
      const first = !widget
      const active = await ensureWidget(item)
      if (!first || currentUrl !== item.canonicalUrl) {
        active.load?.(item.canonicalUrl, { auto_play: false, show_artwork: true, single_active: true })
      }
      currentUrl = item.canonicalUrl
    },
    async play() { widget?.play?.() },
    async pause() { widget?.pause?.() },
    async seek(seconds) { widget?.seekTo?.(Math.max(0, Number(seconds) || 0) * 1000) },
    async setVolume(value) {
      const normalized = Math.max(0, Math.min(1, Number(value) || 0))
      widget?.setVolume?.(Math.round(normalized * 100))
    },
    getState() { return { ...state } },
    destroy() {
      widget = null
      currentUrl = null
      state = { status: 'idle', position: 0, duration: null }
      removeProviderNode(ownedNode)
      ownedNode = null
    }
  }
}

export { buildSoundCloudPlayerUrl }
