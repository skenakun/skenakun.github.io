import { createGenericAdapter } from './generic.js'

export function createTidalAdapter(deps) {
  const adapter = createGenericAdapter({ ...deps, label: 'Open TIDAL' })
  return { ...adapter, kind: 'external-fallback', displayName: 'TIDAL', iconKey: 'tidal' }
}
