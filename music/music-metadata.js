const PROVIDER_LABELS = Object.freeze({
  youtube: 'YouTube',
  spotify: 'Spotify',
  soundcloud: 'SoundCloud',
  mixcloud: 'Mixcloud',
  'apple-music': 'Apple Music',
  deezer: 'Deezer',
  tidal: 'TIDAL',
  bandcamp: 'Bandcamp',
  'amazon-music': 'Amazon Music',
  audiomack: 'Audiomack',
  qobuz: 'Qobuz',
  pandora: 'Pandora',
  generic: 'Music'
})

const OEMBED_BUILDERS = Object.freeze({
  youtube: item => item?.type === 'playlist' ? null : `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(item.canonicalUrl)}`,
  spotify: item => `https://open.spotify.com/oembed?url=${encodeURIComponent(item.canonicalUrl)}`,
  soundcloud: item => `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(item.canonicalUrl)}`,
  mixcloud: item => `https://app.mixcloud.com/oembed/?url=${encodeURIComponent(item.canonicalUrl)}&format=json`
})

function providerLabel(item) {
  if (item?.sourceBrand === 'youtube-music') return 'YouTube Music'
  return PROVIDER_LABELS[item?.provider] || 'Music'
}

function fallbackMetadata(item, state = 'unavailable') {
  return {
    state,
    title: item?.title || `${providerLabel(item)} ${item?.type || 'content'}`,
    author: item?.author || '',
    artworkUrl: item?.artworkUrl || '',
    providerLabel: providerLabel(item)
  }
}

function scalar(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function resolveMetadata(item, options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch
  const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : 6000
  const builder = OEMBED_BUILDERS[item?.provider]
  const endpoint = typeof builder === 'function' ? builder(item) : null
  if (!endpoint || typeof fetchImpl !== 'function') return fallbackMetadata(item)

  const controller = typeof AbortController === 'function' ? new AbortController() : null
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null
  try {
    const response = await fetchImpl(endpoint, controller ? { signal: controller.signal } : undefined)
    if (!response?.ok) return fallbackMetadata(item)
    const data = await response.json()
    const title = scalar(data?.title)
    const author = scalar(data?.author_name || data?.author)
    const artworkUrl = scalar(data?.thumbnail_url)
    if (!title && !author && !artworkUrl) return fallbackMetadata(item, 'partial')
    return {
      state: 'ready',
      title: title || fallbackMetadata(item).title,
      author,
      artworkUrl,
      providerLabel: providerLabel(item)
    }
  } catch {
    return fallbackMetadata(item)
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export { OEMBED_BUILDERS, PROVIDER_LABELS }
