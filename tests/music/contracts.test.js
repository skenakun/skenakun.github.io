import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ERROR_CODES,
  EMPTY_CAPABILITIES,
  MusicCenterError,
  createCapabilitySet
} from '../../music/music-contracts.js'

test('capability set defaults unsupported operations to false', () => {
  const caps = createCapabilitySet({ play: true, pause: true })
  assert.equal(caps.play, true)
  assert.equal(caps.pause, true)
  assert.equal(caps.seek, false)
  assert.equal(caps.volume, false)
  assert.deepEqual(Object.keys(caps), Object.keys(EMPTY_CAPABILITIES))
})

test('MusicCenterError carries a stable public code', () => {
  const error = new MusicCenterError(ERROR_CODES.INVALID_URL, 'Bad URL')
  assert.equal(error.code, 'INVALID_URL')
  assert.equal(error.message, 'Bad URL')
})
