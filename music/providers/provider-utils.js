import { ERROR_CODES, MusicCenterError } from '../music-contracts.js'

const scriptPromises = new Map()

export function withProviderTimeout(promise, key, timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new MusicCenterError(
      ERROR_CODES.PLAYER_API_TIMEOUT,
      `${key} API timeout`
    )), timeoutMs)
    Promise.resolve(promise).then(
      value => { clearTimeout(timer); resolve(value) },
      error => { clearTimeout(timer); reject(error) }
    )
  })
}

function browserScriptLoader({ key, src, ready }) {
  return () => new Promise((resolve, reject) => {
    if (typeof ready === 'function' && ready()) {
      resolve(ready())
      return
    }
    if (!globalThis.document?.createElement) {
      reject(new Error(`${key} requires a browser document`))
      return
    }
    const script = document.createElement('script')
    script.async = true
    script.src = src
    script.dataset.musicProviderScript = key
    script.onload = () => {
      const value = typeof ready === 'function' ? ready() : true
      if (value) resolve(value)
      else reject(new Error(`${key} API loaded but did not become ready`))
    }
    script.onerror = () => reject(new Error(`Unable to load ${key} API`))
    document.head.append(script)
  })
}

export function loadScriptOnce({ key, loader, src, ready, timeoutMs = 8000 }) {
  if (!key) throw new TypeError('loadScriptOnce requires a key')
  if (scriptPromises.has(key)) return scriptPromises.get(key)
  const resolvedLoader = loader || browserScriptLoader({ key, src, ready })
  const promise = withProviderTimeout(Promise.resolve().then(resolvedLoader), key, timeoutMs)
  scriptPromises.set(key, promise)
  promise.catch(() => scriptPromises.delete(key))
  return promise
}

export function clearScriptCacheForTests() {
  scriptPromises.clear()
}


export function mountProviderNode(host, node) {
  if (!host || !node) return node
  if (typeof host.replaceChildren === 'function') host.replaceChildren(node)
  else if (typeof host.append === 'function') host.append(node)
  return node
}

export function removeProviderNode(node) {
  node?.remove?.()
}

export function createTrustedIframe({ src, title, allow = 'autoplay; encrypted-media', className = '', loading = 'eager' }) {
  if (!globalThis.document?.createElement) throw new Error('Iframe creation requires a browser document')
  const url = new URL(src, globalThis.location?.href || 'https://example.invalid')
  if (url.protocol !== 'https:') throw new Error('Trusted iframe URL must use HTTPS')
  const iframe = document.createElement('iframe')
  iframe.src = url.href
  iframe.title = title || 'Music player'
  iframe.loading = loading
  iframe.referrerPolicy = 'strict-origin-when-cross-origin'
  iframe.allow = allow
  iframe.allowFullscreen = true
  iframe.frameBorder = '0'
  if (className) iframe.className = className
  return iframe
}

export function renderExternalCard(item, { label = 'Open Original' } = {}) {
  if (!globalThis.document?.createElement) throw new Error('External card rendering requires a browser document')
  const card = document.createElement('div')
  card.className = 'mc-external-card'

  const badge = document.createElement('span')
  badge.className = 'mc-provider-badge'
  badge.textContent = item.sourceBrand || item.provider || 'Music'

  const title = document.createElement('strong')
  title.textContent = item.title || 'Open in the original music service'

  const link = document.createElement('a')
  link.className = 'mc-external-link'
  link.href = item.canonicalUrl
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.textContent = label

  card.append(badge, title, link)
  return card
}
