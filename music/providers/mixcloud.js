import { createCapabilitySet, ERROR_CODES, MusicCenterError } from '../music-contracts.js'
import { createTrustedIframe, loadScriptOnce, mountProviderNode, removeProviderNode, withProviderTimeout } from './provider-utils.js'

const MIXCLOUD_API = 'https://widget.mixcloud.com/media/js/widgetApi.js'
const MIXCLOUD_EMBED = 'https://player-widget.mixcloud.com/widget/iframe/'

function buildMixcloudPlayerUrl(showKey) {
  const url = new URL(MIXCLOUD_EMBED)
  url.searchParams.set('hide_cover', '1')
  url.searchParams.set('mini', '1')
  url.searchParams.set('light', '1')
  url.searchParams.set('feed', showKey)
  return url.href
}

export function loadMixcloudApi({ windowRef = globalThis.window } = {}) {
  if (windowRef?.Mixcloud?.PlayerWidget) return Promise.resolve(windowRef.Mixcloud)
  return loadScriptOnce({
    key: 'mixcloud-widget-api',
    src: MIXCLOUD_API,
    ready: () => windowRef?.Mixcloud,
    timeoutMs: 8000
  })
}

export function createMixcloudAdapter({
  host,
  emit = () => {},
  windowRef = globalThis.window,
  documentRef = globalThis.document,
  apiLoader = () => loadMixcloudApi({ windowRef }),
  widgetFactory,
  iframeFactory,
  readinessTimeoutMs = 10000
} = {}) {
  if (!host) throw new TypeError('Mixcloud adapter requires a host')
  let widget = null
  let state = { status: 'idle', position: 0, duration: null }
  let ownedNode = null
  const listeners = []

  const capabilities = createCapabilitySet({
    play: true,
    pause: true,
    seek: true,
    progress: true,
    endedEvent: true
  })

  function listen(channel, fn) {
    channel?.on?.(fn)
    if (channel?.off) listeners.push(() => channel.off(fn))
  }

  function attachEvents(active) {
    listen(active.events?.play, () => {
      state = { ...state, status: 'playing' }
      emit('playing')
    })
    listen(active.events?.pause, () => {
      state = { ...state, status: 'paused' }
      emit('paused')
    })
    listen(active.events?.progress, (position, duration) => {
      state = { ...state, position: Number(position || 0), duration: Number(duration || 0) || null }
      emit('progress', { position: state.position, duration: state.duration })
    })
    listen(active.events?.ended, () => {
      state = { ...state, status: 'paused' }
      emit('ended')
    })
    listen(active.events?.error, error => {
      emit('error', new MusicCenterError(ERROR_CODES.PLAYBACK_ERROR, 'Mixcloud playback error', error))
    })
  }

  async function ensureWidget(item) {
    if (widget) return widget
    let factory = widgetFactory
    if (!factory) {
      const api = await apiLoader()
      factory = iframe => api.PlayerWidget(iframe)
    }
    const iframeUrl = buildMixcloudPlayerUrl(item.sourceId)
    const iframe = iframeFactory
      ? iframeFactory(iframeUrl)
      : createTrustedIframe({
          src: iframeUrl,
          title: 'Mixcloud player',
          allow: 'autoplay',
          className: 'mc-provider-frame mc-mixcloud-frame'
        })
    ownedNode = iframe
    mountProviderNode(host, iframe)
    widget = factory(iframe)
    try {
      await withProviderTimeout(widget.ready, 'Mixcloud widget', readinessTimeoutMs)
    } catch (error) {
      widget = null
      removeProviderNode(ownedNode)
      ownedNode = null
      throw error
    }
    attachEvents(widget)
    emit('ready')
    return widget
  }

  return {
    kind: 'controlled',
    capabilities,
    async load(item) {
      state = { ...state, status: 'loading', position: 0, duration: null }
      const active = await ensureWidget(item)
      await active.load(item.sourceId, false)
      const [position, duration] = await Promise.all([
        active.getPosition?.() ?? Promise.resolve(0),
        active.getDuration?.() ?? Promise.resolve(null)
      ])
      state = { ...state, status: 'ready', position: Number(position || 0), duration: Number(duration || 0) || null }
      emit('ready')
    },
    async play() { await widget?.play?.() },
    async pause() { await widget?.pause?.() },
    async seek(seconds) { await widget?.seek?.(Math.max(0, Number(seconds) || 0)) },
    async setVolume() {},
    getState() { return { ...state } },
    destroy() {
      for (const off of listeners.splice(0)) off()
      widget = null
      state = { status: 'idle', position: 0, duration: null }
      removeProviderNode(ownedNode)
      ownedNode = null
    }
  }
}

export { buildMixcloudPlayerUrl }
