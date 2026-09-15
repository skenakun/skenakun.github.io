import { createCapabilitySet, ERROR_CODES, MusicCenterError } from '../music-contracts.js'
import { loadScriptOnce, mountProviderNode, removeProviderNode, withProviderTimeout } from './provider-utils.js'

const YOUTUBE_API = 'https://www.youtube.com/iframe_api'

function youtubeApiFacade(windowRef) {
  return {
    createPlayer(target, callbacks = {}) {
      return new windowRef.YT.Player(target, {
        width: '100%',
        height: '100%',
        playerVars: { playsinline: 1, rel: 0 },
        events: {
          onReady: event => callbacks.ready?.(event),
          onStateChange: event => callbacks.stateChange?.(event),
          onError: event => callbacks.error?.(event)
        }
      })
    }
  }
}

export function loadYouTubeApi({ windowRef = globalThis.window, documentRef = globalThis.document } = {}) {
  if (windowRef?.YT?.Player) return Promise.resolve(youtubeApiFacade(windowRef))
  return loadScriptOnce({
    key: 'youtube-iframe-api',
    timeoutMs: 8000,
    loader: () => new Promise((resolve, reject) => {
      if (!windowRef || !documentRef?.createElement) {
        reject(new Error('YouTube API requires a browser document'))
        return
      }
      const previousReady = windowRef.onYouTubeIframeAPIReady
      windowRef.onYouTubeIframeAPIReady = () => {
        try { previousReady?.() } catch (error) { console.warn('Previous YouTube ready callback failed', error) }
        if (windowRef.YT?.Player) resolve(youtubeApiFacade(windowRef))
        else reject(new Error('YouTube IFrame API did not expose YT.Player'))
      }
      const existing = documentRef.querySelector?.(`script[src="${YOUTUBE_API}"]`)
      if (!existing) {
        const script = documentRef.createElement('script')
        script.async = true
        script.src = YOUTUBE_API
        script.dataset.musicProviderScript = 'youtube-iframe-api'
        script.onerror = () => reject(new Error('Unable to load YouTube IFrame API'))
        documentRef.head.append(script)
      }
    })
  })
}

export function createYouTubeAdapter({
  host,
  emit = () => {},
  windowRef = globalThis.window,
  documentRef = globalThis.document,
  apiLoader = () => loadYouTubeApi({ windowRef, documentRef }),
  readinessTimeoutMs = 10000
} = {}) {
  if (!host) throw new TypeError('YouTube adapter requires a host')
  let player = null
  let playerReadyPromise = null
  let progressTimer = null
  let ready = false
  let ownedNode = null

  const capabilities = createCapabilitySet({
    play: true,
    pause: true,
    seek: true,
    volume: true,
    next: true,
    previous: true,
    progress: true,
    endedEvent: true
  })

  function stopProgress() {
    if (progressTimer) clearInterval(progressTimer)
    progressTimer = null
  }

  function emitProgress() {
    if (!player) return
    const position = Number(player.getCurrentTime?.() || 0)
    const duration = Number(player.getDuration?.() || 0) || null
    emit('progress', { position, duration })
  }

  function startProgress() {
    stopProgress()
    emitProgress()
    progressTimer = setInterval(emitProgress, 1000)
  }

  function onStateChange(event) {
    const state = Number(event?.data)
    if (state === 1) {
      emit('playing')
      startProgress()
    } else if (state === 2) {
      stopProgress()
      emitProgress()
      emit('paused')
    } else if (state === 0) {
      stopProgress()
      emitProgress()
      emit('ended')
    }
  }

  async function ensurePlayer() {
    if (player) {
      await playerReadyPromise
      return player
    }
    const api = await apiLoader()
    let target = host
    if (documentRef?.createElement && typeof host.replaceChildren === 'function') {
      target = documentRef.createElement('div')
      target.className = 'mc-provider-frame mc-youtube-frame'
      ownedNode = target
      mountProviderNode(host, target)
    }

    let resolveReady
    let rejectReady
    const rawReadyPromise = new Promise((resolve, reject) => {
      resolveReady = resolve
      rejectReady = reject
    })
    playerReadyPromise = withProviderTimeout(rawReadyPromise, 'YouTube player', readinessTimeoutMs)

    player = api.createPlayer(target, {
      ready: () => {
        ready = true
        resolveReady(player)
        emit('ready')
      },
      stateChange: onStateChange,
      error: event => {
        stopProgress()
        const error = new MusicCenterError(
          ERROR_CODES.PLAYBACK_ERROR,
          `YouTube playback error${event?.data != null ? ` (${event.data})` : ''}`
        )
        if (!ready) rejectReady(error)
        emit('error', error)
      }
    })
    try {
      await playerReadyPromise
      return player
    } catch (error) {
      stopProgress()
      player?.destroy?.()
      player = null
      playerReadyPromise = null
      ready = false
      removeProviderNode(ownedNode)
      ownedNode = null
      throw error
    }
  }

  return {
    kind: 'controlled',
    capabilities,
    async load(item) {
      const active = await ensurePlayer()
      if (item.type === 'playlist') {
        active.cuePlaylist({ listType: 'playlist', list: item.sourceId })
      } else {
        active.cueVideoById({ videoId: item.sourceId, startSeconds: item.startSeconds || 0 })
      }
      if (ready) emit('ready')
    },
    async play() { (await ensurePlayer()).playVideo?.() },
    async pause() { player?.pauseVideo?.(); stopProgress() },
    async seek(seconds) { player?.seekTo?.(Math.max(0, Number(seconds) || 0), true); emitProgress() },
    async setVolume(value) {
      const normalized = Math.max(0, Math.min(1, Number(value) || 0))
      player?.setVolume?.(Math.round(normalized * 100))
    },
    async next() { player?.nextVideo?.() },
    async previous() { player?.previousVideo?.() },
    getState() {
      return {
        status: ready ? 'ready' : player ? 'loading' : 'idle',
        position: Number(player?.getCurrentTime?.() || 0),
        duration: Number(player?.getDuration?.() || 0) || null
      }
    },
    destroy() {
      stopProgress()
      player?.destroy?.()
      player = null
      playerReadyPromise = null
      ready = false
      removeProviderNode(ownedNode)
      ownedNode = null
    }
  }
}
