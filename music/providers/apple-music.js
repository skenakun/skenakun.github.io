import { createGenericAdapter } from './generic.js'

export function createAppleMusicAdapter(deps) {
  const adapter = createGenericAdapter({ ...deps, label: 'Open Apple Music' })
  return { ...adapter, kind: 'external-fallback', displayName: 'Apple Music', iconKey: 'apple-music' }
}
