import {
  createCapabilitySet,
  ERROR_CODES,
  MusicCenterError,
  PLAYBACK_STATUS
} from './music-contracts.js'

function normalizedVolume(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0.8
  return Math.max(0, Math.min(1, number))
}

export function createPlayerManager({ createAdapter, queueController = null, initialVolume = 0.8 } = {}) {
  if (typeof createAdapter !== 'function') throw new TypeError('Player manager requires createAdapter')

  const listeners = new Set()
  let activeAdapter = null
  let activeToken = 0
  let destroyed = false
  let state = {
    currentItem: null,
    provider: null,
    status: PLAYBACK_STATUS.IDLE,
    position: 0,
    duration: null,
    volume: normalizedVolume(initialVolume),
    capabilities: createCapabilitySet(),
    error: null,
    minimized: false
  }

  function snapshot() {
    return { ...state, capabilities: { ...state.capabilities } }
  }

  function publish(patch) {
    if (destroyed) return
    state = { ...state, ...patch }
    const value = snapshot()
    for (const listener of listeners) listener(value)
  }

  function adapterEvent(token, type, detail) {
    if (destroyed || token !== activeToken) return
    if (type === 'ready') publish({ status: PLAYBACK_STATUS.READY, error: null })
    else if (type === 'playing') publish({ status: PLAYBACK_STATUS.PLAYING, error: null })
    else if (type === 'paused') publish({ status: PLAYBACK_STATUS.PAUSED })
    else if (type === 'progress') publish({
      position: Number(detail?.position || 0),
      duration: Number.isFinite(Number(detail?.duration)) && Number(detail.duration) > 0 ? Number(detail.duration) : state.duration
    })
    else if (type === 'error') publish({
      status: PLAYBACK_STATUS.ERROR,
      error: detail instanceof Error ? detail : new MusicCenterError(ERROR_CODES.PLAYBACK_ERROR, 'Playback error')
    })
    else if (type === 'ended') {
      publish({ status: PLAYBACK_STATUS.PAUSED })
      if (state.capabilities.endedEvent) void advanceQueue('next', true)
    }
  }

  async function load(item, options = {}) {
    if (destroyed) return null
    const previousAdapter = activeAdapter
    if (previousAdapter) await previousAdapter.pause?.()

    publish({ status: PLAYBACK_STATUS.LOADING, error: null })
    const token = activeToken + 1
    let candidate
    try {
      candidate = createAdapter(item, (type, detail) => adapterEvent(token, type, detail))
      if (!candidate?.load) throw new TypeError('Provider adapter must implement load()')
      await candidate.load(item)
    } catch (cause) {
      candidate?.destroy?.()
      publish({
        status: PLAYBACK_STATUS.ERROR,
        error: cause instanceof MusicCenterError
          ? cause
          : new MusicCenterError(ERROR_CODES.PLAYBACK_ERROR, 'Unable to load this music source', cause)
      })
      throw state.error
    }

    activeToken = token
    activeAdapter = candidate
    previousAdapter?.destroy?.()
    publish({
      currentItem: item,
      provider: item?.provider || null,
      status: PLAYBACK_STATUS.READY,
      position: 0,
      duration: null,
      capabilities: createCapabilitySet(candidate.capabilities || {}),
      error: null
    })

    if (state.capabilities.volume) await candidate.setVolume?.(state.volume)
    if (options.play === true) await play()
    return candidate
  }

  async function play() {
    if (!activeAdapter || !state.capabilities.play) return false
    await activeAdapter.play?.()
    publish({ status: PLAYBACK_STATUS.PLAYING, error: null })
    return true
  }

  async function pause() {
    if (!activeAdapter || !state.capabilities.pause) return false
    await activeAdapter.pause?.()
    publish({ status: PLAYBACK_STATUS.PAUSED })
    return true
  }

  async function seek(seconds) {
    if (!activeAdapter || !state.capabilities.seek) return false
    const value = Math.max(0, Number(seconds) || 0)
    await activeAdapter.seek?.(value)
    publish({ position: value })
    return true
  }

  async function setVolume(value) {
    const volume = normalizedVolume(value)
    publish({ volume })
    if (activeAdapter && state.capabilities.volume) await activeAdapter.setVolume?.(volume)
    return volume
  }

  async function advanceQueue(direction, autoplay = true) {
    const method = direction === 'previous' ? 'previous' : 'next'
    let nextItem = null
    if (typeof queueController?.[method] === 'function') nextItem = await queueController[method](state.currentItem)
    if (nextItem) {
      await load(nextItem)
      if (autoplay) await play()
      return nextItem
    }
    const capability = direction === 'previous' ? 'previous' : 'next'
    if (activeAdapter && state.capabilities[capability] && typeof activeAdapter[method] === 'function') {
      await activeAdapter[method]()
      return state.currentItem
    }
    return null
  }

  return {
    load,
    play,
    pause,
    seek,
    setVolume,
    next() { return advanceQueue('next', true) },
    previous() { return advanceQueue('previous', true) },
    setMinimized(value) {
      publish({ minimized: Boolean(value) })
    },
    subscribe(listener) {
      if (typeof listener !== 'function') return () => {}
      listeners.add(listener)
      listener(snapshot())
      return () => listeners.delete(listener)
    },
    getState: snapshot,
    destroy() {
      if (destroyed) return
      activeAdapter?.destroy?.()
      activeAdapter = null
      listeners.clear()
      destroyed = true
    }
  }
}
