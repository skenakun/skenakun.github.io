import { ERROR_CODES, MusicCenterError } from './music-contracts.js'
import { createYouTubeAdapter } from './providers/youtube.js'
import { createSpotifyAdapter } from './providers/spotify.js'
import { createSoundCloudAdapter } from './providers/soundcloud.js'
import { createMixcloudAdapter } from './providers/mixcloud.js'
import { createAppleMusicAdapter } from './providers/apple-music.js'
import { createDeezerAdapter } from './providers/deezer.js'
import { createTidalAdapter } from './providers/tidal.js'
import { createBandcampAdapter } from './providers/bandcamp.js'
import { createGenericAdapter } from './providers/generic.js'

const FACTORIES = Object.freeze({
  youtube: createYouTubeAdapter,
  spotify: createSpotifyAdapter,
  soundcloud: createSoundCloudAdapter,
  mixcloud: createMixcloudAdapter,
  'apple-music': createAppleMusicAdapter,
  deezer: createDeezerAdapter,
  tidal: createTidalAdapter,
  bandcamp: createBandcampAdapter
})

const GENERIC_PROVIDERS = new Set(['generic', 'amazon-music', 'audiomack', 'qobuz', 'pandora'])

export function createProviderAdapter(item, deps = {}) {
  const provider = item?.provider
  const factory = FACTORIES[provider]
  if (factory) return factory(deps)
  if (GENERIC_PROVIDERS.has(provider)) {
    const adapter = createGenericAdapter(deps)
    return { ...adapter, kind: 'external-fallback' }
  }
  throw new MusicCenterError(ERROR_CODES.UNSUPPORTED_PROVIDER, `Unsupported music provider: ${provider || 'unknown'}`)
}

export { FACTORIES as PROVIDER_FACTORIES }
