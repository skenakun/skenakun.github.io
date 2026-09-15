import test from 'node:test'
import assert from 'node:assert/strict'
import {
  loadScriptOnce,
  clearScriptCacheForTests
} from '../../music/providers/provider-utils.js'

test('deduplicates concurrent external script loads', async () => {
  clearScriptCacheForTests()
  let loads = 0
  const fakeLoad = () => {
    loads += 1
    return Promise.resolve('ready')
  }
  const a = loadScriptOnce({ key: 'x', loader: fakeLoad })
  const b = loadScriptOnce({ key: 'x', loader: fakeLoad })
  assert.equal(await a, 'ready')
  assert.equal(await b, 'ready')
  assert.equal(loads, 1)
})

test('failed loads are evicted so a later retry can run', async () => {
  clearScriptCacheForTests()
  let attempts = 0
  const loader = () => {
    attempts += 1
    return attempts === 1 ? Promise.reject(new Error('boom')) : Promise.resolve('ok')
  }
  await assert.rejects(loadScriptOnce({ key: 'retry', loader, timeoutMs: 100 }))
  assert.equal(await loadScriptOnce({ key: 'retry', loader, timeoutMs: 100 }), 'ok')
  assert.equal(attempts, 2)
})

test('provider mount cleanup removes only the node owned by the retiring adapter', async () => {
  const { mountProviderNode, removeProviderNode } = await import('../../music/providers/provider-utils.js')
  const children = []
  const host = {
    replaceChildren(node) { children.splice(0, children.length, node) },
    append(node) { children.push(node) }
  }
  const oldNode = { remove() { const i = children.indexOf(oldNode); if (i >= 0) children.splice(i, 1) } }
  const newNode = { remove() { const i = children.indexOf(newNode); if (i >= 0) children.splice(i, 1) } }
  mountProviderNode(host, oldNode)
  mountProviderNode(host, newNode)
  removeProviderNode(oldNode)
  assert.deepEqual(children, [newNode])
})

test('provider readiness promises time out instead of hanging forever', async () => {
  const { withProviderTimeout } = await import('../../music/providers/provider-utils.js')
  await assert.rejects(
    withProviderTimeout(new Promise(() => {}), 'YouTube player', 5),
    error => error?.code === 'PLAYER_API_TIMEOUT' && /YouTube player/.test(error.message)
  )
})
