function clone(value) {
  return value == null ? value : structuredClone(value)
}

class FakeRequest {
  constructor() {
    this.result = undefined
    this.error = null
    this.onsuccess = null
    this.onerror = null
  }
}

class FakeTransaction {
  constructor(db, storeNames) {
    this.db = db
    this.storeNames = Array.isArray(storeNames) ? storeNames : [storeNames]
    this.oncomplete = null
    this.onerror = null
    this.onabort = null
    this.error = null
    this.pending = 0
    this.completionScheduled = false
  }

  objectStore(name) {
    if (!this.storeNames.includes(name)) throw new Error(`Store ${name} is not in transaction`)
    const store = this.db._stores.get(name)
    if (!store) throw new Error(`Missing store ${name}`)
    return new FakeObjectStore(store, this)
  }

  _start() {
    this.pending += 1
  }

  _finish() {
    this.pending -= 1
    this._scheduleCompletion()
  }

  _scheduleCompletion() {
    if (this.pending !== 0 || this.completionScheduled) return
    this.completionScheduled = true
    setTimeout(() => {
      this.completionScheduled = false
      if (this.pending === 0) this.oncomplete?.({ target: this })
    }, 0)
  }
}

class FakeIndex {
  constructor(store, transaction, keyPath) {
    this.store = store
    this.transaction = transaction
    this.keyPath = keyPath
  }

  getAll(query) {
    return makeRequest(this.transaction, () => {
      return [...this.store.records.values()]
        .filter(value => query === undefined || value?.[this.keyPath] === query)
        .map(clone)
    })
  }
}

class FakeObjectStore {
  constructor(store, transaction = null) {
    this.store = store
    this.transaction = transaction
  }

  createIndex(name, keyPath) {
    this.store.indices.set(name, { keyPath })
    return new FakeIndex(this.store, this.transaction, keyPath)
  }

  index(name) {
    const definition = this.store.indices.get(name)
    if (!definition) throw new Error(`Missing index ${name}`)
    return new FakeIndex(this.store, this.transaction, definition.keyPath)
  }

  put(value) {
    return makeRequest(this.transaction, () => {
      const copied = clone(value)
      const key = copied?.[this.store.keyPath]
      if (key === undefined) throw new Error(`Missing keyPath ${this.store.keyPath}`)
      this.store.records.set(key, copied)
      return key
    })
  }

  delete(key) {
    return makeRequest(this.transaction, () => this.store.records.delete(key))
  }

  get(key) {
    return makeRequest(this.transaction, () => clone(this.store.records.get(key)))
  }

  getAll() {
    return makeRequest(this.transaction, () => [...this.store.records.values()].map(clone))
  }
}

function makeRequest(transaction, operation) {
  const request = new FakeRequest()
  transaction?._start()
  setTimeout(() => {
    try {
      request.result = operation()
      request.onsuccess?.({ target: request })
    } catch (error) {
      request.error = error
      request.onerror?.({ target: request })
      if (transaction) {
        transaction.error = error
        transaction.onerror?.({ target: transaction })
      }
    } finally {
      transaction?._finish()
    }
  }, 0)
  return request
}

class FakeDatabase {
  constructor(name, state) {
    this.name = name
    this._state = state
    this._stores = state.stores
    this.objectStoreNames = {
      contains: storeName => this._stores.has(storeName)
    }
  }

  createObjectStore(name, options = {}) {
    const store = { keyPath: options.keyPath, records: new Map(), indices: new Map() }
    this._stores.set(name, store)
    return new FakeObjectStore(store)
  }

  transaction(storeNames) {
    const tx = new FakeTransaction(this, storeNames)
    queueMicrotask(() => tx._scheduleCompletion())
    return tx
  }

  close() {}
}

export function createFakeIndexedDB() {
  const databases = new Map()
  return {
    open(name, version = 1) {
      const request = new FakeRequest()
      setTimeout(() => {
        try {
          let state = databases.get(name)
          const needsUpgrade = !state || version > state.version
          if (!state) {
            state = { version, stores: new Map() }
            databases.set(name, state)
          }
          if (version < state.version) throw new Error('VersionError')
          if (version > state.version) state.version = version
          request.result = new FakeDatabase(name, state)
          if (needsUpgrade) request.onupgradeneeded?.({ target: request, oldVersion: 0, newVersion: version })
          request.onsuccess?.({ target: request })
        } catch (error) {
          request.error = error
          request.onerror?.({ target: request })
        }
      }, 0)
      return request
    }
  }
}
