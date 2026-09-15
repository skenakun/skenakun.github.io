import { createGenericAdapter } from './generic.js'

export function createBandcampAdapter(deps) {
  const adapter = createGenericAdapter({ ...deps, label: 'Open Bandcamp' })
  return { ...adapter, kind: 'external-fallback', displayName: 'Bandcamp', iconKey: 'bandcamp' }
}
