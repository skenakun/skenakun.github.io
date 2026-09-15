import test from 'node:test'
import assert from 'node:assert/strict'
import { createProviderAdapter } from '../../music/provider-registry.js'

test('returns a provider-specific adapter factory', () => {
  const adapter = createProviderAdapter(
    { provider: 'apple-music', canonicalUrl: 'https://music.apple.com/us/album/example/123' },
    { host: {}, emit: () => {} }
  )
  assert.equal(adapter.capabilities.play, false)
  assert.equal(adapter.kind, 'external-fallback')
})

test('routes recognized generic streaming providers to safe external fallback', () => {
  for (const provider of ['amazon-music', 'audiomack', 'qobuz', 'pandora']) {
    const adapter = createProviderAdapter({ provider, canonicalUrl: 'https://example.invalid/content' }, { host: {}, emit: () => {} })
    assert.equal(adapter.kind, 'external-fallback')
    assert.equal(adapter.capabilities.play, false)
  }
})

test('rejects a provider missing from the registry', () => {
  assert.throws(
    () => createProviderAdapter({ provider: 'unknown' }, { host: {}, emit: () => {} }),
    /unsupported/i
  )
})
