import { createCapabilitySet } from '../music-contracts.js'
import { mountProviderNode, removeProviderNode, renderExternalCard } from './provider-utils.js'

export function createGenericAdapter({ host, label = 'Open Original' } = {}) {
  if (!host) throw new TypeError('Generic provider adapter requires a host')
  let currentItem = null
  let ownedNode = null
  return {
    capabilities: createCapabilitySet(),
    async load(item) {
      currentItem = item
      ownedNode = renderExternalCard(item, { label })
      mountProviderNode(host, ownedNode)
    },
    async play() {},
    async pause() {},
    async seek() {},
    async setVolume() {},
    getState() {
      return { status: currentItem ? 'ready' : 'idle', position: 0, duration: null }
    },
    destroy() {
      currentItem = null
      removeProviderNode(ownedNode)
      ownedNode = null
    }
  }
}
