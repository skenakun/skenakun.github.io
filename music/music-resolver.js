import { ERROR_CODES, MusicCenterError } from './music-contracts.js'

const HOSTS = Object.freeze({
  youtube: new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'music.youtube.com']),
  spotify: new Set(['open.spotify.com', 'spotify.link']),
  soundcloud: new Set(['soundcloud.com', 'www.soundcloud.com', 'on.soundcloud.com']),
  mixcloud: new Set(['mixcloud.com', 'www.mixcloud.com']),
  appleMusic: new Set(['music.apple.com']),
  deezer: new Set(['deezer.com', 'www.deezer.com']),
  tidal: new Set(['tidal.com', 'www.tidal.com', 'listen.tidal.com']),
  generic: new Set(['music.amazon.com', 'audiomack.com', 'www.audiomack.com', 'open.qobuz.com', 'www.pandora.com'])
})

function isBandcampHost(hostname) {
  return hostname === 'bandcamp.com' || hostname.endsWith('.bandcamp.com')
}

function normalizePath(pathname) {
  const decoded = pathname.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/'
  return decoded
}

function parseStartSeconds(url) {
  const raw = url.searchParams.get('start') || url.searchParams.get('t')
  if (!raw) return 0
  if (/^\d+$/.test(raw)) return Number(raw)
  const match = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i)
  if (!match) return 0
  return Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0)
}

function buildEntity({ provider, sourceBrand = provider, type, sourceId, canonicalUrl, originalUrl, startSeconds = 0 }) {
  const id = sourceId || new URL(canonicalUrl).pathname
  return Object.freeze({
    provider,
    sourceBrand,
    type,
    sourceId: sourceId || null,
    canonicalUrl,
    originalUrl,
    fingerprint: `${provider}:${type}:${id}`,
    startSeconds
  })
}

function parseYouTube(url, originalUrl) {
  const host = url.hostname.toLowerCase()
  const sourceBrand = host === 'music.youtube.com' ? 'youtube-music' : 'youtube'
  const startSeconds = parseStartSeconds(url)
  let videoId = null
  let playlistId = url.searchParams.get('list')

  if (host === 'youtu.be') {
    videoId = url.pathname.split('/').filter(Boolean)[0] || null
  } else if (url.pathname === '/watch' || url.pathname === '/shorts' || url.pathname.startsWith('/shorts/')) {
    if (url.pathname.startsWith('/shorts/')) videoId = url.pathname.split('/').filter(Boolean)[1] || null
    else videoId = url.searchParams.get('v')
  } else if (url.pathname.startsWith('/embed/')) {
    videoId = url.pathname.split('/').filter(Boolean)[1] || null
  }

  if (url.pathname === '/playlist' && playlistId) {
    const canonicalUrl = `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`
    return buildEntity({ provider: 'youtube', sourceBrand, type: 'playlist', sourceId: playlistId, canonicalUrl, originalUrl, startSeconds })
  }

  if (videoId) {
    const canonicalUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`
    return buildEntity({ provider: 'youtube', sourceBrand, type: 'video', sourceId: videoId, canonicalUrl, originalUrl, startSeconds })
  }

  if (playlistId) {
    const canonicalUrl = `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`
    return buildEntity({ provider: 'youtube', sourceBrand, type: 'playlist', sourceId: playlistId, canonicalUrl, originalUrl, startSeconds })
  }

  throw new MusicCenterError(ERROR_CODES.INVALID_URL, 'YouTube URL does not contain a playable video or playlist ID')
}

function parseSpotify(url, originalUrl) {
  let parts = normalizePath(url.pathname).split('/').filter(Boolean)
  const spotifyTypes = new Set(['track', 'album', 'playlist', 'artist', 'episode', 'show'])
  if (/^intl-[a-z]{2,3}$/i.test(parts[0] || '') && spotifyTypes.has(parts[1])) parts = parts.slice(1)
  let type = parts[0] || 'link'
  let sourceId = parts[1] || normalizePath(url.pathname)
  if (url.hostname.toLowerCase() === 'spotify.link') {
    type = 'link'
    sourceId = normalizePath(url.pathname)
  }
  const canonicalUrl = url.hostname.toLowerCase() === 'open.spotify.com'
    ? `https://open.spotify.com/${[type, sourceId].filter(Boolean).join('/')}`
    : `https://${url.hostname.toLowerCase()}${normalizePath(url.pathname)}`
  return buildEntity({ provider: 'spotify', type, sourceId, canonicalUrl, originalUrl })
}

function parseSoundCloud(url, originalUrl) {
  const path = normalizePath(url.pathname)
  const parts = path.split('/').filter(Boolean)
  const type = parts.includes('sets') ? 'playlist' : parts.length >= 2 ? 'track' : 'profile'
  return buildEntity({ provider: 'soundcloud', type, sourceId: path, canonicalUrl: `https://soundcloud.com${path}`, originalUrl })
}

function parseMixcloud(url, originalUrl) {
  const path = normalizePath(url.pathname)
  const parts = path.split('/').filter(Boolean)
  const type = parts.length >= 2 ? 'show' : 'profile'
  return buildEntity({ provider: 'mixcloud', type, sourceId: path, canonicalUrl: `https://www.mixcloud.com${path}${path === '/' ? '' : '/'}`, originalUrl })
}

function parseAppleMusic(url, originalUrl) {
  const parts = normalizePath(url.pathname).split('/').filter(Boolean)
  const known = new Set(['album', 'playlist', 'song', 'artist', 'music-video', 'station'])
  const type = parts.find((p) => known.has(p)) || 'content'
  const sourceId = parts.at(-1) || normalizePath(url.pathname)
  return buildEntity({ provider: 'apple-music', type, sourceId, canonicalUrl: `https://music.apple.com${normalizePath(url.pathname)}${url.search}`, originalUrl })
}

function parseDeezer(url, originalUrl) {
  const parts = normalizePath(url.pathname).split('/').filter(Boolean)
  const known = new Set(['track', 'album', 'playlist', 'artist', 'episode', 'show'])
  const type = parts.find((p) => known.has(p)) || 'content'
  const index = parts.findIndex((p) => p === type)
  const sourceId = index >= 0 ? parts[index + 1] || normalizePath(url.pathname) : normalizePath(url.pathname)
  return buildEntity({ provider: 'deezer', type, sourceId, canonicalUrl: `https://www.deezer.com${normalizePath(url.pathname)}`, originalUrl })
}

function parseTidal(url, originalUrl) {
  const parts = normalizePath(url.pathname).split('/').filter(Boolean)
  const known = new Set(['track', 'album', 'playlist', 'video', 'artist', 'mix'])
  const type = parts.find((p) => known.has(p)) || 'content'
  const index = parts.findIndex((p) => p === type)
  const sourceId = index >= 0 ? parts[index + 1] || normalizePath(url.pathname) : normalizePath(url.pathname)
  return buildEntity({ provider: 'tidal', type, sourceId, canonicalUrl: `https://tidal.com${normalizePath(url.pathname)}`, originalUrl })
}

function parseBandcamp(url, originalUrl) {
  const parts = normalizePath(url.pathname).split('/').filter(Boolean)
  const type = parts[0] === 'album' ? 'album' : parts[0] === 'track' ? 'track' : 'content'
  const sourceId = parts[1] || normalizePath(url.pathname)
  return buildEntity({ provider: 'bandcamp', type, sourceId, canonicalUrl: `https://${url.hostname.toLowerCase()}${normalizePath(url.pathname)}`, originalUrl })
}

function parseGeneric(url, originalUrl) {
  const host = url.hostname.toLowerCase()
  const provider = host.includes('amazon') ? 'amazon-music'
    : host.includes('audiomack') ? 'audiomack'
      : host.includes('qobuz') ? 'qobuz'
        : host.includes('pandora') ? 'pandora'
          : 'generic'
  const path = normalizePath(url.pathname)
  return buildEntity({ provider, type: 'content', sourceId: path, canonicalUrl: `https://${host}${path}${url.search}`, originalUrl })
}

export function resolveMusicUrl(input) {
  const originalUrl = String(input ?? '').trim()
  let url
  try {
    url = new URL(originalUrl)
  } catch (cause) {
    throw new MusicCenterError(ERROR_CODES.INVALID_URL, 'Enter a valid HTTPS music URL', cause)
  }

  if (url.protocol !== 'https:') {
    throw new MusicCenterError(ERROR_CODES.INVALID_URL, 'Music links must use HTTPS')
  }

  url.hash = ''
  const host = url.hostname.toLowerCase()
  if (HOSTS.youtube.has(host)) return parseYouTube(url, originalUrl)
  if (HOSTS.spotify.has(host)) return parseSpotify(url, originalUrl)
  if (HOSTS.soundcloud.has(host)) return parseSoundCloud(url, originalUrl)
  if (HOSTS.mixcloud.has(host)) return parseMixcloud(url, originalUrl)
  if (HOSTS.appleMusic.has(host)) return parseAppleMusic(url, originalUrl)
  if (HOSTS.deezer.has(host)) return parseDeezer(url, originalUrl)
  if (HOSTS.tidal.has(host)) return parseTidal(url, originalUrl)
  if (isBandcampHost(host)) return parseBandcamp(url, originalUrl)
  if (HOSTS.generic.has(host)) return parseGeneric(url, originalUrl)

  throw new MusicCenterError(ERROR_CODES.UNSUPPORTED_PROVIDER, 'Unsupported music provider')
}
