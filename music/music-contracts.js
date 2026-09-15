export const ERROR_CODES = Object.freeze({
  INVALID_URL: 'INVALID_URL',
  UNSUPPORTED_PROVIDER: 'UNSUPPORTED_PROVIDER',
  EMBED_UNAVAILABLE: 'EMBED_UNAVAILABLE',
  PLAYBACK_ERROR: 'PLAYBACK_ERROR',
  METADATA_UNAVAILABLE: 'METADATA_UNAVAILABLE',
  PLAYER_API_TIMEOUT: 'PLAYER_API_TIMEOUT',
  STORAGE_ERROR: 'STORAGE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
})

export const PLAYBACK_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ERROR: 'error'
})

export const EMPTY_CAPABILITIES = Object.freeze({
  play: false,
  pause: false,
  seek: false,
  volume: false,
  next: false,
  previous: false,
  progress: false,
  endedEvent: false
})

export function createCapabilitySet(overrides = {}) {
  return Object.freeze({ ...EMPTY_CAPABILITIES, ...overrides })
}

export class MusicCenterError extends Error {
  constructor(code, message, cause = null) {
    super(message)
    this.name = 'MusicCenterError'
    this.code = code
    this.cause = cause
  }
}
