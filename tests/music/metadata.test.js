import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveMetadata } from '../../music/music-metadata.js'

test('returns fallback metadata when network lookup fails', async () => {
  const result = await resolveMetadata(
    {
      provider: 'spotify',
      canonicalUrl: 'https://open.spotify.com/track/abc123',
      type: 'track'
    },
    { fetchImpl: async () => { throw new Error('offline') }, timeoutMs: 10 }
  )
  assert.equal(result.state, 'unavailable')
  assert.equal(result.providerLabel, 'Spotify')
})

test('keeps text and thumbnail fields without persisting provider HTML', async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({
      title: 'Example Track',
      author_name: 'Example Artist',
      thumbnail_url: 'https://cdn.example/art.jpg',
      html: '<iframe src="https://example.invalid"></iframe>'
    })
  })
  const result = await resolveMetadata(
    { provider: 'spotify', canonicalUrl: 'https://open.spotify.com/track/abc123', type: 'track' },
    { fetchImpl }
  )
  assert.equal(result.title, 'Example Track')
  assert.equal(result.author, 'Example Artist')
  assert.equal(result.artworkUrl, 'https://cdn.example/art.jpg')
  assert.equal('html' in result, false)
})

test('uses immediate safe fallback for providers without a frontend metadata endpoint', async () => {
  let called = false
  const result = await resolveMetadata(
    { provider: 'apple-music', canonicalUrl: 'https://music.apple.com/us/album/example/123', type: 'album' },
    { fetchImpl: async () => { called = true } }
  )
  assert.equal(called, false)
  assert.equal(result.providerLabel, 'Apple Music')
})

test('resolves direct YouTube video metadata through oEmbed', async () => {
  let requestedUrl = ''
  const result = await resolveMetadata(
    { provider: 'youtube', type: 'video', canonicalUrl: 'https://www.youtube.com/watch?v=AAA' },
    { fetchImpl: async url => {
      requestedUrl = String(url)
      return { ok: true, json: async () => ({ title: 'Video A', author_name: 'Channel A', thumbnail_url: 'https://i.ytimg.com/vi/AAA/hqdefault.jpg' }) }
    } }
  )
  assert.match(requestedUrl, /youtube\.com\/oembed/)
  assert.equal(result.title, 'Video A')
  assert.equal(result.author, 'Channel A')
  assert.equal(result.artworkUrl, 'https://i.ytimg.com/vi/AAA/hqdefault.jpg')
})
