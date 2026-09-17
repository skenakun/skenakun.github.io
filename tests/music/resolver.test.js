import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveMusicUrl } from '../../music/music-resolver.js'

const YT_ID = 'M7lc1UVf-VE'

test('normalizes YouTube and youtu.be to one fingerprint', () => {
  const a = resolveMusicUrl(`https://www.youtube.com/watch?v=${YT_ID}&utm_source=x`)
  const b = resolveMusicUrl(`https://youtu.be/${YT_ID}`)
  assert.equal(a.fingerprint, `youtube:video:${YT_ID}`)
  assert.equal(b.fingerprint, a.fingerprint)
  assert.equal(a.canonicalUrl, `https://www.youtube.com/watch?v=${YT_ID}`)
})

test('retains YouTube Music branding while using YouTube identity', () => {
  const item = resolveMusicUrl(`https://music.youtube.com/watch?v=${YT_ID}`)
  assert.equal(item.provider, 'youtube')
  assert.equal(item.sourceBrand, 'youtube-music')
  assert.equal(item.fingerprint, `youtube:video:${YT_ID}`)
})

test('resolves YouTube playlists', () => {
  const item = resolveMusicUrl('https://www.youtube.com/playlist?list=PL123456')
  assert.equal(item.type, 'playlist')
  assert.equal(item.sourceId, 'PL123456')
  assert.equal(item.fingerprint, 'youtube:playlist:PL123456')
})

test('rejects unsafe schemes and provider lookalike hosts', () => {
  assert.throws(() => resolveMusicUrl('javascript:alert(1)'), /HTTPS/)
  assert.throws(() => resolveMusicUrl('https://youtube.com.evil.example/watch?v=x'), /provider/i)
})

test('recognizes first-class and fallback provider shapes', () => {
  const cases = [
    ['https://open.spotify.com/track/abc123', 'spotify', 'track'],
    ['https://soundcloud.com/example/track-name', 'soundcloud', 'track'],
    ['https://www.mixcloud.com/user/show-name/', 'mixcloud', 'show'],
    ['https://music.apple.com/us/album/example/123', 'apple-music', 'album'],
    ['https://www.deezer.com/track/123', 'deezer', 'track'],
    ['https://tidal.com/browse/track/123', 'tidal', 'track'],
    ['https://artist.bandcamp.com/album/example', 'bandcamp', 'album']
  ]

  for (const [url, provider, type] of cases) {
    const item = resolveMusicUrl(url)
    assert.equal(item.provider, provider)
    assert.equal(item.type, type)
  }
})

test('rejects all release security probe URLs without producing provider entities', () => {
  const unsafe = [
    'javascript:alert(1)',
    'data:text/html,hello',
    'file:///tmp/song.mp3',
    'https://youtube.com.evil.example/watch?v=M7lc1UVf-VE',
    'https://evil.example/?url=https://youtube.com/watch?v=M7lc1UVf-VE'
  ]
  for (const value of unsafe) assert.throws(() => resolveMusicUrl(value))
})

test('normalizes locale-prefixed Spotify share URLs', () => {
  const cases = [
    ['https://open.spotify.com/intl-id/track/4xAJlngfYcP4NbUqQkruOV?si=84a6908536704104', 'track', '4xAJlngfYcP4NbUqQkruOV'],
    ['https://open.spotify.com/intl-id/album/1ABCDEF234567890', 'album', '1ABCDEF234567890'],
    ['https://open.spotify.com/intl-id/playlist/37i9dQZF1DXcBWIGoYBM5M', 'playlist', '37i9dQZF1DXcBWIGoYBM5M']
  ]

  for (const [url, type, id] of cases) {
    const item = resolveMusicUrl(url)
    assert.equal(item.provider, 'spotify')
    assert.equal(item.type, type)
    assert.equal(item.sourceId, id)
    assert.equal(item.canonicalUrl, `https://open.spotify.com/${type}/${id}`)
    assert.equal(item.fingerprint, `spotify:${type}:${id}`)
  }
})
