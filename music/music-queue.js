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
    playOrder: entries.map(entry => entry.id),
    cursor: entries.length ? 0 : -1,
    shuffle: false,
    repeatMode: 'off'
  }
}

export function getCurrentEntry(state) {
  const id = currentId(state)
  return id ? state.entries.find(entry => entry.id === id) || null : null
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

export function removeEntry(state, entryId) {
  const activeId = currentId(state)
  const removedPlayIndex = state.playOrder.indexOf(entryId)
  const entries = state.entries.filter(entry => entry.id !== entryId)
  const playOrder = state.playOrder.filter(id => id !== entryId)
  if (!playOrder.length) return { ...state, entries, playOrder, cursor: -1 }

  let cursor
  if (activeId && activeId !== entryId) {
    cursor = playOrder.indexOf(activeId)
  } else {
    cursor = Math.min(Math.max(removedPlayIndex, 0), playOrder.length - 1)
  }
  return { ...state, entries, playOrder, cursor: clampCursor(cursor, playOrder.length) }
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
