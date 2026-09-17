import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createQueueState,
  playNext,
  setShuffle,
  moveNext,
  setRepeatMode,
  addGroupToEnd,
  removeGroup,
  setGroupCollapsed,
  normalizeQueueState
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


test('playlist groups append ordered child entries and preserve group metadata through shuffle', () => {
  const base = createQueueState(['standalone'], { idFactory: ids })
  const group = { id: 'group-a', title: 'Road Mix', provider: 'youtube', collapsed: false }
  const grouped = addGroupToEnd(base, group, ['a', 'b', 'c'], ids)
  assert.deepEqual(grouped.entries.map(entry => entry.trackId), ['standalone', 'a', 'b', 'c'])
  assert.deepEqual(grouped.entries.slice(1).map(entry => [entry.groupId, entry.groupIndex]), [
    ['group-a', 0], ['group-a', 1], ['group-a', 2]
  ])
  assert.deepEqual(grouped.groups, [group])

  const shuffled = setShuffle(grouped, true, () => 0)
  assert.deepEqual(shuffled.entries.slice(1).map(entry => entry.groupId), ['group-a', 'group-a', 'group-a'])
  assert.deepEqual(shuffled.groups, [group])
})

test('removing playlist children preserves siblings and removes an empty group', async () => {
  const mod = await import('../../music/music-queue.js')
  let state = addGroupToEnd(createQueueState([], { idFactory: ids }), { id: 'group-a', title: 'Mix', collapsed: false }, ['a', 'b'], ids)
  const first = state.entries[0]
  state = mod.removeEntry(state, first.id)
  assert.equal(state.entries.length, 1)
  assert.equal(state.groups.length, 1)
  state = mod.removeEntry(state, state.entries[0].id)
  assert.equal(state.entries.length, 0)
  assert.deepEqual(state.groups, [])
})

test('removing a playlist group removes all children and keeps unrelated entries', () => {
  let state = createQueueState(['before'], { idFactory: ids })
  state = addGroupToEnd(state, { id: 'group-a', title: 'Mix', collapsed: false }, ['a', 'b'], ids)
  state = addGroupToEnd(state, { id: 'group-b', title: 'Mix 2', collapsed: false }, ['c'], ids)
  state = removeGroup(state, 'group-a')
  assert.deepEqual(state.entries.map(entry => entry.trackId), ['before', 'c'])
  assert.deepEqual(state.groups.map(group => group.id), ['group-b'])
  assert.ok(state.cursor >= -1 && state.cursor < state.playOrder.length)
})

test('group collapse changes presentation state without changing playback order', () => {
  let state = addGroupToEnd(createQueueState([], { idFactory: ids }), { id: 'group-a', title: 'Mix', collapsed: false }, ['a', 'b'], ids)
  const order = [...state.playOrder]
  state = setGroupCollapsed(state, 'group-a', true)
  assert.equal(state.groups[0].collapsed, true)
  assert.deepEqual(state.playOrder, order)
})

test('legacy queue snapshots normalize missing groups to an empty array', () => {
  const legacy = { entries: [{ id: 'q1', trackId: 'a' }], playOrder: ['q1'], cursor: 0, shuffle: false, repeatMode: 'off' }
  const normalized = normalizeQueueState(legacy)
  assert.deepEqual(normalized.groups, [])
  assert.equal(normalized.entries[0].trackId, 'a')
})
