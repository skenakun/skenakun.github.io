function defaultIdFactory() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

function clampCursor(cursor, length) {
  if (!length) return -1
  return Math.max(0, Math.min(Number.isInteger(cursor) ? cursor : 0, length - 1))
}

function currentId(state) {
  return state.cursor >= 0 ? state.playOrder[state.cursor] || null : null
}

function fisherYates(values, random = Math.random) {
  const copy = [...values]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

export function createQueueState(trackIds = [], options = {}) {
  const idFactory = options.idFactory || defaultIdFactory
  const entries = trackIds.map(trackId => ({ id: idFactory(), trackId }))
  return {
    entries,
    groups: [],
    playOrder: entries.map(entry => entry.id),
    cursor: entries.length ? 0 : -1,
    shuffle: false,
    repeatMode: 'off'
  }
}

export function normalizeQueueState(snapshot) {
  if (!snapshot || !Array.isArray(snapshot.entries) || !Array.isArray(snapshot.playOrder)) return createQueueState([])
  const entries = snapshot.entries.filter(entry => entry?.id && entry?.trackId).map(entry => ({ ...entry }))
  const entryIds = new Set(entries.map(entry => entry.id))
  const playOrder = snapshot.playOrder.filter(id => entryIds.has(id))
  const normalizedOrder = playOrder.length === entries.length ? playOrder : entries.map(entry => entry.id)
  const groupIds = new Set(entries.map(entry => entry.groupId).filter(Boolean))
  const groups = (Array.isArray(snapshot.groups) ? snapshot.groups : [])
    .filter(group => group?.id && groupIds.has(group.id))
    .map(group => ({ ...group, collapsed: Boolean(group.collapsed) }))
  const cursor = normalizedOrder.length
    ? clampCursor(snapshot.cursor, normalizedOrder.length)
    : -1
  return {
    entries,
    groups,
    playOrder: normalizedOrder,
    cursor,
    shuffle: Boolean(snapshot.shuffle),
    repeatMode: ['off', 'all', 'one'].includes(snapshot.repeatMode) ? snapshot.repeatMode : 'off'
  }
}

export function getCurrentEntry(state) {
  const id = currentId(state)
  return id ? state.entries.find(entry => entry.id === id) || null : null
}

function reindexGroups(entries) {
  const positions = new Map()
  return entries.map(entry => {
    if (!entry.groupId) return entry
    const index = positions.get(entry.groupId) || 0
    positions.set(entry.groupId, index + 1)
    return { ...entry, groupIndex: index }
  })
}

function pruneGroups(groups = [], entries = []) {
  const liveIds = new Set(entries.map(entry => entry.groupId).filter(Boolean))
  return groups.filter(group => liveIds.has(group.id))
}

export function addGroupToEnd(state, group, trackIds = [], idFactory = defaultIdFactory) {
  if (!group?.id || !trackIds.length) return state
  const childEntries = trackIds.map((trackId, groupIndex) => ({ id: idFactory(), trackId, groupId: group.id, groupIndex }))
  const entries = [...state.entries, ...childEntries]
  const playOrder = [...state.playOrder, ...childEntries.map(entry => entry.id)]
  const groups = [...(state.groups || []).filter(item => item.id !== group.id), { ...group, collapsed: Boolean(group.collapsed) }]
  return {
    ...state,
    entries,
    groups,
    playOrder,
    cursor: state.cursor === -1 && childEntries.length ? state.playOrder.length : state.cursor
  }
}

export function setGroupCollapsed(state, groupId, collapsed) {
  if (!(state.groups || []).some(group => group.id === groupId)) return state
  return {
    ...state,
    groups: state.groups.map(group => group.id === groupId ? { ...group, collapsed: Boolean(collapsed) } : group)
  }
}

export function addToEnd(state, trackId, idFactory = defaultIdFactory) {
  const entry = { id: idFactory(), trackId }
  const entries = [...state.entries, entry]
  const playOrder = [...state.playOrder, entry.id]
  return {
    ...state,
    entries,
    playOrder,
    cursor: state.cursor === -1 ? 0 : state.cursor
  }
}

export function playNext(state, trackId, idFactory = defaultIdFactory) {
  const entry = { id: idFactory(), trackId }
  if (state.cursor === -1) {
    return { ...state, entries: [entry], playOrder: [entry.id], cursor: 0 }
  }
  const activeId = currentId(state)
  const canonicalIndex = Math.max(0, state.entries.findIndex(item => item.id === activeId))
  const entries = [...state.entries]
  entries.splice(canonicalIndex + 1, 0, entry)
  const playOrder = [...state.playOrder]
  playOrder.splice(state.cursor + 1, 0, entry.id)
  return { ...state, entries, playOrder }
}

function removeEntriesById(state, removedIds) {
  const activeId = currentId(state)
  const removedPlayIndices = state.playOrder
    .map((id, index) => removedIds.has(id) ? index : -1)
    .filter(index => index >= 0)
  if (!removedPlayIndices.length) return state
  const firstRemovedPlayIndex = Math.min(...removedPlayIndices)
  const entries = reindexGroups(state.entries.filter(entry => !removedIds.has(entry.id)))
  const groups = pruneGroups(state.groups || [], entries)
  const playOrder = state.playOrder.filter(id => !removedIds.has(id))
  if (!playOrder.length) return { ...state, entries, groups, playOrder, cursor: -1 }

  let cursor
  if (activeId && !removedIds.has(activeId)) cursor = playOrder.indexOf(activeId)
  else cursor = Math.min(Math.max(firstRemovedPlayIndex, 0), playOrder.length - 1)
  return { ...state, entries, groups, playOrder, cursor: clampCursor(cursor, playOrder.length) }
}

export function removeEntry(state, entryId) {
  return removeEntriesById(state, new Set([entryId]))
}

export function removeGroup(state, groupId) {
  const removedIds = new Set(state.entries.filter(entry => entry.groupId === groupId).map(entry => entry.id))
  if (!removedIds.size) return {
    ...state,
    groups: (state.groups || []).filter(group => group.id !== groupId)
  }
  return removeEntriesById(state, removedIds)
}

export function reorderEntry(state, fromIndex, toIndex) {
  if (fromIndex === toIndex) return state
  if (fromIndex < 0 || fromIndex >= state.entries.length || toIndex < 0 || toIndex >= state.entries.length) return state
  const activeId = currentId(state)
  const entries = [...state.entries]
  const [moved] = entries.splice(fromIndex, 1)
  entries.splice(toIndex, 0, moved)
  const playOrder = state.shuffle ? [...state.playOrder] : entries.map(entry => entry.id)
  const cursor = activeId ? playOrder.indexOf(activeId) : clampCursor(state.cursor, playOrder.length)
  return { ...state, entries, playOrder, cursor: clampCursor(cursor, playOrder.length) }
}

export function setShuffle(state, enabled, random = Math.random) {
  const nextEnabled = Boolean(enabled)
  if (nextEnabled === state.shuffle) return state
  const activeId = currentId(state)

  if (!nextEnabled) {
    const playOrder = state.entries.map(entry => entry.id)
    const cursor = activeId ? playOrder.indexOf(activeId) : clampCursor(state.cursor, playOrder.length)
    return { ...state, shuffle: false, playOrder, cursor: clampCursor(cursor, playOrder.length) }
  }

  if (!state.playOrder.length) return { ...state, shuffle: true }
  const cursor = clampCursor(state.cursor, state.playOrder.length)
  const before = state.playOrder.slice(0, cursor).filter(id => id !== activeId)
  const after = state.playOrder.slice(cursor + 1).filter(id => id !== activeId)
  const shuffledRest = fisherYates([...before, ...after], random)
  const beforeCount = before.length
  const playOrder = [
    ...shuffledRest.slice(0, beforeCount),
    activeId,
    ...shuffledRest.slice(beforeCount)
  ].filter(Boolean)
  return { ...state, shuffle: true, playOrder, cursor: activeId ? playOrder.indexOf(activeId) : -1 }
}

export function setRepeatMode(state, mode) {
  if (!['off', 'all', 'one'].includes(mode)) return state
  return { ...state, repeatMode: mode }
}

export function moveNext(state) {
  if (!state.playOrder.length) return state
  if (state.repeatMode === 'one' && state.cursor >= 0) return state
  if (state.cursor < state.playOrder.length - 1) return { ...state, cursor: state.cursor + 1 }
  if (state.repeatMode === 'all') return { ...state, cursor: 0 }
  return state
}

export function movePrevious(state) {
  if (!state.playOrder.length) return state
  if (state.repeatMode === 'one' && state.cursor >= 0) return state
  if (state.cursor > 0) return { ...state, cursor: state.cursor - 1 }
  if (state.repeatMode === 'all') return { ...state, cursor: state.playOrder.length - 1 }
  return state
}
