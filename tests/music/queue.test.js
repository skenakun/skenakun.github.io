import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createQueueState,
  playNext,
  setShuffle,
  moveNext,
  setRepeatMode
} from '../../music/music-queue.js'

const ids = (() => {
  let n = 0
  return () => `q${++n}`
})()

test('playNext inserts immediately after current entry', () => {
  let state = createQueueState(['a', 'b'], { idFactory: ids })
  state = playNext(state, 'x', ids)
  assert.deepEqual(state.entries.map(entry => entry.trackId), ['a', 'x', 'b'])
})

test('shuffle keeps canonical entry order intact', () => {
  const state = createQueueState(['a', 'b', 'c'], { idFactory: ids })
  const shuffled = setShuffle(state, true, () => 0)
  assert.deepEqual(shuffled.entries.map(entry => entry.trackId), ['a', 'b', 'c'])
  assert.notDeepEqual(shuffled.playOrder, state.playOrder)
  const restored = setShuffle(shuffled, false)
  assert.deepEqual(restored.playOrder, restored.entries.map(entry => entry.id))
})

test('repeat all wraps at the end', () => {
  let state = createQueueState(['a', 'b'], { idFactory: ids })
  state = { ...state, cursor: 1 }
  state = setRepeatMode(state, 'all')
  const next = moveNext(state)
  assert.equal(next.cursor, 0)
})

test('remove and reorder preserve a valid cursor', async () => {
  const mod = await import('../../music/music-queue.js')
  let state = mod.createQueueState(['a', 'b', 'c'], { idFactory: ids })
  const firstId = state.entries[0].id
  state = mod.reorderEntry(state, 0, 2)
  assert.deepEqual(state.entries.map(entry => entry.trackId), ['b', 'c', 'a'])
  state = mod.removeEntry(state, firstId)
  assert.deepEqual(state.entries.map(entry => entry.trackId), ['b', 'c'])
  assert.ok(state.cursor >= -1 && state.cursor < state.playOrder.length)
})
