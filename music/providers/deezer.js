import { createGenericAdapter } from './generic.js'

export function createDeezerAdapter(deps) {
  const adapter = createGenericAdapter({ ...deps, label: 'Open Deezer' })
  return { ...adapter, kind: 'external-fallback', displayName: 'Deezer', iconKey: 'deezer' }
}
