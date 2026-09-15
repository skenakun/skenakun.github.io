# Music Center Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lazy-loaded, fullscreen Music Center with persistent local library, cross-provider queue, provider-aware playback, and a synchronized mini player to the existing Waifu Gallery on branch `V1`.

**Architecture:** Music Center is an isolated ES-module feature loaded from the existing feature loader. Pure modules handle URL resolution, queue policy, storage, metadata, and unified playback state. Provider adapters encapsulate third-party iframe or widget APIs, while a permanent playback host keeps the active provider alive when the fullscreen overlay is minimized.

**Tech Stack:** Vanilla HTML, CSS, ES modules, IndexedDB, Node built-in test runner, `fake-indexeddb` for storage tests only, YouTube IFrame Player API, Spotify IFrame API, SoundCloud Widget API, Mixcloud Widget API.

**Spec:** `docs/superpowers/specs/2026-09-16-music-center-design.md`

## Global Constraints

- Target repository is `skenakun/skenakun.github.io`.
- Target branch is `V1`.
- Runtime stays frontend-only and GitHub Pages compatible.
- No OAuth, provider account login, custom backend, media proxy, stream extraction, scraping protected content, or download feature.
- External provider input must use HTTPS.
- Music Center must not become a general-purpose iframe injector.
- Existing Gallery, Mini Game, and Android Simulator behavior must remain unchanged when Music Center is never opened.
- Music Center must inherit the website CSS variables and Color Burst behavior.
- All Music Center CSS selectors use the `mc-` namespace.
- Provider SDKs load only when that provider is needed.
- Only one provider may be active at a time.
- Playback must not autoplay after a full page reload.
- History is capped at 200 entries.
- Unsupported provider capabilities are disabled rather than simulated.
- Provider API readiness target is 8 seconds, metadata target is 6 seconds, and embed readiness target is 10 seconds.
- Current provider documentation wins over any assumption in the design. Downgrade capability rather than add unofficial workarounds.

---

## File Structure

### Existing files to modify

- `index.html` registers the Music trigger and permanent Music Center mount points.
- `feature-loader.js` preloads and opens the Music Center module without changing the existing Mini Game or Android Simulator loading flow.

### New runtime files

- `music-center.js` owns feature initialization, event wiring, persistence orchestration, and the public `openMusicCenter()` entry point.
- `music-center.css` owns all Music Center layout, theme inheritance, responsive behavior, mini player styling, focus states, and reduced-motion behavior.
- `music/music-contracts.js` owns shared error codes, playback states, capability normalization, and the `MusicCenterError` type.
- `music/music-resolver.js` validates and normalizes shared URLs.
- `music/music-queue.js` owns persistent queue state, play-next, reorder, shuffle, and repeat semantics.
- `music/music-store.js` owns IndexedDB schema, migration, CRUD, favorites, history, playlists, queue, and settings persistence.
- `music/music-metadata.js` performs non-blocking metadata lookup with timeout and safe fallback.
- `music/music-player.js` owns the unified player state and single-active-provider switching.
- `music/music-view.js` creates and renders the fullscreen and mini-player UI.
- `music/provider-registry.js` maps normalized providers to adapter factories.
- `music/providers/provider-utils.js` owns one-time external script loading and safe iframe helpers.
- `music/providers/youtube.js` owns YouTube and compatible YouTube Music playback.
- `music/providers/spotify.js` owns Spotify IFrame API playback.
- `music/providers/soundcloud.js` owns SoundCloud Widget API playback.
- `music/providers/mixcloud.js` owns Mixcloud Widget API playback.
- `music/providers/apple-music.js` owns Apple Music recognized-link fallback behavior.
- `music/providers/deezer.js` owns Deezer recognized-link fallback behavior.
- `music/providers/tidal.js` owns TIDAL recognized-link fallback behavior.
- `music/providers/bandcamp.js` owns Bandcamp recognized-link fallback behavior.
- `music/providers/generic.js` owns recognized external-provider fallback behavior.

### New test files

- `package.json` enables Node ES-module tests.
- `tests/music/contracts.test.js`
- `tests/music/resolver.test.js`
- `tests/music/queue.test.js`
- `tests/music/store.test.js`
- `tests/music/provider-utils.test.js`
- `tests/music/youtube.test.js`
- `tests/music/spotify.test.js`
- `tests/music/soundcloud.test.js`
- `tests/music/mixcloud.test.js`
- `tests/music/fallback-providers.test.js`
- `tests/music/metadata.test.js`
- `tests/music/player.test.js`

---

### Task 1: Establish the test harness and shared contracts

**Files:**
- Create: `package.json`
- Create: `music/music-contracts.js`
- Create: `tests/music/contracts.test.js`

**Interfaces:**
- Produces: `MusicCenterError`, `ERROR_CODES`, `PLAYBACK_STATUS`, `EMPTY_CAPABILITIES`, `createCapabilitySet(overrides)`.
- Consumes: no Music Center runtime dependency.

- [ ] **Step 1: Add the Node test harness**

Create `package.json` with no production dependency and one test command.

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test"
  }
}
```

- [ ] **Step 2: Write the failing contract test**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ERROR_CODES,
  EMPTY_CAPABILITIES,
  MusicCenterError,
  createCapabilitySet
} from '../../music/music-contracts.js'

test('capability set defaults unsupported operations to false', () => {
  const caps = createCapabilitySet({ play: true, pause: true })
  assert.equal(caps.play, true)
  assert.equal(caps.pause, true)
  assert.equal(caps.seek, false)
  assert.equal(caps.volume, false)
  assert.deepEqual(Object.keys(caps), Object.keys(EMPTY_CAPABILITIES))
})

test('MusicCenterError carries a stable public code', () => {
  const error = new MusicCenterError(ERROR_CODES.INVALID_URL, 'Bad URL')
  assert.equal(error.code, 'INVALID_URL')
  assert.equal(error.message, 'Bad URL')
})
```

- [ ] **Step 3: Run the test and verify failure**

Run:

```bash
npm test -- tests/music/contracts.test.js
```

Expected result: FAIL because `music/music-contracts.js` does not exist.

- [ ] **Step 4: Implement the shared contracts**

```js
export const ERROR_CODES = Object.freeze({
  INVALID_URL: 'INVALID_URL',
  UNSUPPORTED_PROVIDER: 'UNSUPPORTED_PROVIDER',
  EMBED_UNAVAILABLE: 'EMBED_UNAVAILABLE',
  PLAYBACK_ERROR: 'PLAYBACK_ERROR',
  METADATA_UNAVAILABLE: 'METADATA_UNAVAILABLE',
  PLAYER_API_TIMEOUT: 'PLAYER_API_TIMEOUT',
  STORAGE_ERROR: 'STORAGE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
})

export const PLAYBACK_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ERROR: 'error'
})

export const EMPTY_CAPABILITIES = Object.freeze({
  play: false,
  pause: false,
  seek: false,
  volume: false,
  next: false,
  previous: false,
  progress: false,
  endedEvent: false
})

export function createCapabilitySet(overrides = {}) {
  return Object.freeze({ ...EMPTY_CAPABILITIES, ...overrides })
}

export class MusicCenterError extends Error {
  constructor(code, message, cause = null) {
    super(message)
    this.name = 'MusicCenterError'
    this.code = code
    this.cause = cause
  }
}
```

- [ ] **Step 5: Run the contracts test**

Run:

```bash
npm test -- tests/music/contracts.test.js
```

Expected result: PASS.

- [ ] **Step 6: Commit**

```bash
git add package.json music/music-contracts.js tests/music/contracts.test.js
git commit -m "test: establish music center contracts"
```

---

### Task 2: Implement safe URL resolution and deduplication

**Files:**
- Create: `music/music-resolver.js`
- Create: `tests/music/resolver.test.js`

**Interfaces:**
- Consumes: `MusicCenterError`, `ERROR_CODES` from `music/music-contracts.js`.
- Produces: `resolveMusicUrl(input)` returning a normalized entity with `provider`, `sourceBrand`, `type`, `sourceId`, `canonicalUrl`, `originalUrl`, `fingerprint`, and `startSeconds`.

- [ ] **Step 1: Write resolver tests for YouTube identity and safety**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveMusicUrl } from '../../music/music-resolver.js'

const YT_ID = 'M7lc1UVf-VE'

test('normalizes YouTube and youtu.be to one fingerprint', () => {
  const a = resolveMusicUrl(`https://www.youtube.com/watch?v=${YT_ID}&utm_source=x`)
  const b = resolveMusicUrl(`https://youtu.be/${YT_ID}`)
  assert.equal(a.fingerprint, `youtube:video:${YT_ID}`)
  assert.equal(b.fingerprint, a.fingerprint)
  assert.equal(a.canonicalUrl, `https://www.youtube.com/watch?v=${YT_ID}`)
})

test('retains YouTube Music branding while using YouTube identity', () => {
  const item = resolveMusicUrl(`https://music.youtube.com/watch?v=${YT_ID}`)
  assert.equal(item.provider, 'youtube')
  assert.equal(item.sourceBrand, 'youtube-music')
  assert.equal(item.fingerprint, `youtube:video:${YT_ID}`)
})

test('resolves YouTube playlists', () => {
  const item = resolveMusicUrl('https://www.youtube.com/playlist?list=PL123456')
  assert.equal(item.type, 'playlist')
  assert.equal(item.sourceId, 'PL123456')
  assert.equal(item.fingerprint, 'youtube:playlist:PL123456')
})

test('rejects unsafe schemes and provider lookalike hosts', () => {
  assert.throws(() => resolveMusicUrl('javascript:alert(1)'), /HTTPS/)
  assert.throws(() => resolveMusicUrl('https://youtube.com.evil.example/watch?v=x'), /provider/i)
})
```

- [ ] **Step 2: Add provider-shape tests**

```js
test('recognizes first-class and fallback provider shapes', () => {
  const cases = [
    ['https://open.spotify.com/track/abc123', 'spotify', 'track'],
    ['https://soundcloud.com/example/track-name', 'soundcloud', 'track'],
    ['https://www.mixcloud.com/user/show-name/', 'mixcloud', 'show'],
    ['https://music.apple.com/us/album/example/123', 'apple-music', 'album'],
    ['https://www.deezer.com/track/123', 'deezer', 'track'],
    ['https://tidal.com/browse/track/123', 'tidal', 'track'],
    ['https://artist.bandcamp.com/album/example', 'bandcamp', 'album']
  ]

  for (const [url, provider, type] of cases) {
    const item = resolveMusicUrl(url)
    assert.equal(item.provider, provider)
    assert.equal(item.type, type)
  }
})
```

- [ ] **Step 3: Run tests and verify failure**

Run:

```bash
npm test -- tests/music/resolver.test.js
```

Expected result: FAIL because the resolver does not exist.

- [ ] **Step 4: Implement strict host matching and provider parsers**

Implement `resolveMusicUrl()` with `new URL(input.trim())`, reject non-HTTPS schemes, normalize hostnames to lowercase, and route through exact parsers.

```js
const HOSTS = Object.freeze({
  youtube: new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'music.youtube.com']),
  spotify: new Set(['open.spotify.com', 'spotify.link']),
  soundcloud: new Set(['soundcloud.com', 'www.soundcloud.com', 'on.soundcloud.com']),
  mixcloud: new Set(['mixcloud.com', 'www.mixcloud.com']),
  appleMusic: new Set(['music.apple.com']),
  deezer: new Set(['deezer.com', 'www.deezer.com']),
  tidal: new Set(['tidal.com', 'www.tidal.com', 'listen.tidal.com']),
  generic: new Set(['music.amazon.com', 'audiomack.com', 'www.audiomack.com', 'open.qobuz.com', 'www.pandora.com'])
})

function isBandcampHost(hostname) {
  return hostname === 'bandcamp.com' || hostname.endsWith('.bandcamp.com')
}
```

For YouTube, preserve `t` or `start` only as parsed `startSeconds`, never as part of the fingerprint. For Spotify, use the first path segment as type and second as source ID when available. For SoundCloud and Mixcloud, use normalized path identity. For fallback providers, build the fingerprint from provider plus normalized pathname.

- [ ] **Step 5: Run resolver tests**

Run:

```bash
npm test -- tests/music/resolver.test.js
```

Expected result: PASS.

- [ ] **Step 6: Commit**

```bash
git add music/music-resolver.js tests/music/resolver.test.js
git commit -m "feat: resolve music provider links safely"
```

---

### Task 3: Implement the queue engine with stable shuffle semantics

**Files:**
- Create: `music/music-queue.js`
- Create: `tests/music/queue.test.js`

**Interfaces:**
- Produces: `createQueueState(trackIds, options)`, `addToEnd`, `playNext`, `removeEntry`, `reorderEntry`, `setShuffle`, `setRepeatMode`, `moveNext`, `movePrevious`, `getCurrentEntry`.
- Queue entries use `{ id, trackId }` so duplicate tracks can appear more than once.

- [ ] **Step 1: Write failing queue tests**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createQueueState,
  playNext,
  setShuffle,
  moveNext,
  setRepeatMode
} from '../../music/music-queue.js'

const ids = (() => {
  let n = 0
  return () => `q${++n}`
})()

test('playNext inserts immediately after current entry', () => {
  let state = createQueueState(['a', 'b'], { idFactory: ids })
  state = playNext(state, 'x', ids)
  assert.deepEqual(state.entries.map(entry => entry.trackId), ['a', 'x', 'b'])
})

test('shuffle keeps canonical entry order intact', () => {
  const state = createQueueState(['a', 'b', 'c'], { idFactory: ids })
  const shuffled = setShuffle(state, true, () => 0)
  assert.deepEqual(shuffled.entries.map(entry => entry.trackId), ['a', 'b', 'c'])
  assert.notDeepEqual(shuffled.playOrder, state.playOrder)
  const restored = setShuffle(shuffled, false)
  assert.deepEqual(restored.playOrder, restored.entries.map(entry => entry.id))
})

test('repeat all wraps at the end', () => {
  let state = createQueueState(['a', 'b'], { idFactory: ids })
  state = { ...state, cursor: 1 }
  state = setRepeatMode(state, 'all')
  const next = moveNext(state)
  assert.equal(next.cursor, 0)
})
```

- [ ] **Step 2: Run and verify failure**

```bash
npm test -- tests/music/queue.test.js
```

Expected result: FAIL because `music/music-queue.js` does not exist.

- [ ] **Step 3: Implement immutable queue operations**

Use stable queue entry IDs and keep canonical `entries` separate from transient `playOrder`.

```js
export function createQueueState(trackIds = [], options = {}) {
  const idFactory = options.idFactory || (() => crypto.randomUUID())
  const entries = trackIds.map(trackId => ({ id: idFactory(), trackId }))
  return {
    entries,
    playOrder: entries.map(entry => entry.id),
    cursor: entries.length ? 0 : -1,
    shuffle: false,
    repeatMode: 'off'
  }
}
```

Implement shuffle with Fisher-Yates over entry IDs. Keep the current entry anchored when enabling shuffle so pressing Next does not unexpectedly replace the track currently playing.

- [ ] **Step 4: Add removal and reorder tests**

```js
test('remove and reorder preserve a valid cursor', async () => {
  const mod = await import('../../music/music-queue.js')
  let state = mod.createQueueState(['a', 'b', 'c'], { idFactory: ids })
  const firstId = state.entries[0].id
  state = mod.reorderEntry(state, 0, 2)
  assert.deepEqual(state.entries.map(entry => entry.trackId), ['b', 'c', 'a'])
  state = mod.removeEntry(state, firstId)
  assert.deepEqual(state.entries.map(entry => entry.trackId), ['b', 'c'])
  assert.ok(state.cursor >= -1 && state.cursor < state.playOrder.length)
})
```

- [ ] **Step 5: Run queue tests**

```bash
npm test -- tests/music/queue.test.js
```

Expected result: PASS.

- [ ] **Step 6: Commit**

```bash
git add music/music-queue.js tests/music/queue.test.js
git commit -m "feat: add persistent music queue semantics"
```

---

### Task 4: Implement IndexedDB persistence

**Files:**
- Modify: `package.json`
- Create: `music/music-store.js`
- Create: `tests/music/store.test.js`

**Interfaces:**
- Produces: `openMusicStore(options)`, returning an object with `saveTrack`, `getTrack`, `listTracks`, `setFavorite`, `listFavorites`, `addHistory`, `listHistory`, `createPlaylist`, `renamePlaylist`, `deletePlaylist`, `setPlaylistItems`, `getPlaylistItems`, `saveQueue`, `loadQueue`, `saveSettings`, `loadSettings`, `close`.
- Tracks use `fingerprint` as the stable key.

- [ ] **Step 1: Install the test-only IndexedDB implementation**

Run:

```bash
npm install --save-dev fake-indexeddb
```

Verify that `package.json` gains only a `devDependencies` entry and no runtime bundle dependency.

- [ ] **Step 2: Write the failing store test**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { indexedDB } from 'fake-indexeddb'
import { openMusicStore } from '../../music/music-store.js'

test('stores one canonical track per fingerprint', async () => {
  const store = await openMusicStore({ indexedDBFactory: indexedDB, dbName: 'mc-test-dedup' })
  const base = {
    fingerprint: 'youtube:video:M7lc1UVf-VE',
    provider: 'youtube',
    sourceBrand: 'youtube',
    type: 'track',
    sourceId: 'M7lc1UVf-VE',
    canonicalUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    originalUrl: 'https://youtu.be/M7lc1UVf-VE'
  }
  await store.saveTrack(base)
  await store.saveTrack({ ...base, title: 'Updated' })
  const all = await store.listTracks()
  assert.equal(all.length, 1)
  assert.equal(all[0].title, 'Updated')
  store.close()
})
```

- [ ] **Step 3: Add history-cap and queue persistence tests**

```js
test('caps history at 200 newest entries', async () => {
  const store = await openMusicStore({ indexedDBFactory: indexedDB, dbName: 'mc-test-history' })
  for (const i of Array.from({ length: 205 }, (_, index) => index)) {
    await store.addHistory('track-a', i)
  }
  const history = await store.listHistory()
  assert.equal(history.length, 200)
  assert.equal(history[0].playedAt, 204)
  store.close()
})

test('round trips queue and settings snapshots', async () => {
  const store = await openMusicStore({ indexedDBFactory: indexedDB, dbName: 'mc-test-snapshot' })
  await store.saveQueue({ entries: [], playOrder: [], cursor: -1, shuffle: false, repeatMode: 'off' })
  await store.saveSettings({ volume: 0.8, minimized: true })
  assert.equal((await store.loadQueue()).cursor, -1)
  assert.equal((await store.loadSettings()).volume, 0.8)
  store.close()
})
```

- [ ] **Step 4: Run and verify failure**

```bash
npm test -- tests/music/store.test.js
```

Expected result: FAIL because `openMusicStore` is not implemented.

- [ ] **Step 5: Implement schema version 1**

Use `indexedDBFactory.open(dbName, 1)` and create these object stores in `onupgradeneeded`:

```js
const STORE_NAMES = Object.freeze({
  tracks: 'tracks',
  playlists: 'playlists',
  playlistItems: 'playlistItems',
  history: 'history',
  favorites: 'favorites',
  queue: 'queue',
  settings: 'settings'
})
```

Use these key strategies:

```text
tracks        keyPath: fingerprint
playlists     keyPath: id
playlistItems keyPath: id, index: playlistId
history       keyPath: id, index: playedAt
favorites     keyPath: trackId
queue         keyPath: key, single record key "active"
settings      keyPath: key, single record key "preferences"
```

Wrap request and transaction completion in Promises. Convert low-level IndexedDB failures into `MusicCenterError(ERROR_CODES.STORAGE_ERROR, ...)`.

- [ ] **Step 6: Implement history trimming**

After inserting a history row, read the `playedAt` index in descending order and delete every record after the first 200. History rows use `crypto.randomUUID()` when available and a time plus random fallback only when it is not available.

- [ ] **Step 7: Run store tests**

```bash
npm test -- tests/music/store.test.js
```

Expected result: PASS.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json music/music-store.js tests/music/store.test.js
git commit -m "feat: persist music center library state"
```

---

### Task 5: Add provider utilities and safe external fallback

**Files:**
- Create: `music/providers/provider-utils.js`
- Create: `music/providers/generic.js`
- Create: `tests/music/provider-utils.test.js`

**Interfaces:**
- Produces: `loadScriptOnce({ key, src, ready, timeoutMs })`, `clearScriptCacheForTests()`, `createTrustedIframe(options)`, `createGenericAdapter(deps)`.
- `createTrustedIframe` only receives embed URLs built by provider code, never raw arbitrary user input.

- [ ] **Step 1: Write script-cache tests**

```js
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
```

- [ ] **Step 2: Run and verify failure**

```bash
npm test -- tests/music/provider-utils.test.js
```

Expected result: FAIL because the provider utility does not exist.

- [ ] **Step 3: Implement one-time loading and timeout**

```js
const scriptPromises = new Map()

export function loadScriptOnce({ key, loader, timeoutMs = 8000 }) {
  if (scriptPromises.has(key)) return scriptPromises.get(key)
  const promise = Promise.race([
    loader(),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${key} API timeout`)), timeoutMs)
    })
  ])
  scriptPromises.set(key, promise)
  promise.catch(() => scriptPromises.delete(key))
  return promise
}
```

The browser-facing overload creates an async `<script>` with the supplied trusted `src`. `createTrustedIframe()` sets `title`, `loading`, `referrerPolicy`, and the minimum `allow` string required by the adapter.

- [ ] **Step 4: Implement `generic.js` as external-only**

`createGenericAdapter()` returns all playback capabilities as false. `load(item)` renders a provider card in the permanent host with an `Open Original` anchor using `item.canonicalUrl`. It does not construct an iframe from the arbitrary URL.

```js
return {
  capabilities: createCapabilitySet(),
  async load(item) {
    host.replaceChildren(renderExternalCard(item))
  },
  async play() {},
  async pause() {},
  async seek() {},
  async setVolume() {},
  getState() {
    return { status: 'ready', position: 0, duration: null }
  },
  destroy() {
    host.replaceChildren()
  }
}
```

- [ ] **Step 5: Run provider utility tests**

```bash
npm test -- tests/music/provider-utils.test.js
```

Expected result: PASS.

- [ ] **Step 6: Commit**

```bash
git add music/providers/provider-utils.js music/providers/generic.js tests/music/provider-utils.test.js
git commit -m "feat: add safe provider loading utilities"
```

---

### Task 6: Implement the YouTube and YouTube Music adapter

**Files:**
- Create: `music/providers/youtube.js`
- Create: `tests/music/youtube.test.js`

**Interfaces:**
- Produces: `createYouTubeAdapter({ host, emit, windowRef, documentRef })`.
- Uses `https://www.youtube.com/iframe_api`.
- Emits `ready`, `playing`, `paused`, `progress`, `ended`, and `error` events to the player manager.

- [ ] **Step 1: Write the adapter contract test with a fake YT player**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { createYouTubeAdapter } from '../../music/providers/youtube.js'

test('cues a video without autoplay and exposes full transport capabilities', async () => {
  const calls = []
  const fakePlayer = {
    cueVideoById: arg => calls.push(['cueVideoById', arg]),
    cuePlaylist: arg => calls.push(['cuePlaylist', arg]),
    playVideo: () => calls.push(['play']),
    pauseVideo: () => calls.push(['pause']),
    seekTo: value => calls.push(['seek', value]),
    setVolume: value => calls.push(['volume', value]),
    getCurrentTime: () => 0,
    getDuration: () => 180,
    destroy: () => calls.push(['destroy'])
  }
  const adapter = createYouTubeAdapter({
    host: {},
    emit: () => {},
    apiLoader: async () => ({ createPlayer: () => fakePlayer })
  })
  await adapter.load({ provider: 'youtube', type: 'track', sourceId: 'M7lc1UVf-VE', startSeconds: 12 })
  assert.deepEqual(calls[0], ['cueVideoById', { videoId: 'M7lc1UVf-VE', startSeconds: 12 }])
  assert.equal(adapter.capabilities.volume, true)
  assert.equal(adapter.capabilities.endedEvent, true)
})
```

- [ ] **Step 2: Run and verify failure**

```bash
npm test -- tests/music/youtube.test.js
```

Expected result: FAIL because the adapter does not exist.

- [ ] **Step 3: Implement the YouTube API loader**

Chain any pre-existing `window.onYouTubeIframeAPIReady` callback rather than overwriting it silently. Resolve after `window.YT.Player` is available. Use the shared 8-second timeout.

- [ ] **Step 4: Implement one reusable `YT.Player` instance**

Create the player once inside `host`. For a track, use `cueVideoById`. For a playlist, use `cuePlaylist`. Set `playsinline: 1` and do not call `playVideo()` from `load()`.

```js
async function load(item) {
  const player = await ensurePlayer()
  if (item.type === 'playlist') {
    player.cuePlaylist({ listType: 'playlist', list: item.sourceId })
    return
  }
  player.cueVideoById({
    videoId: item.sourceId,
    startSeconds: item.startSeconds || 0
  })
}
```

Map YouTube state `1` to playing, `2` to paused, `0` to ended, and error callbacks to playback errors. Poll current position only while playing and stop the timer on pause, error, destroy, and ended.

- [ ] **Step 5: Run YouTube tests**

```bash
npm test -- tests/music/youtube.test.js
```

Expected result: PASS.

- [ ] **Step 6: Commit**

```bash
git add music/providers/youtube.js tests/music/youtube.test.js
git commit -m "feat: add youtube music playback adapter"
```

---

### Task 7: Implement the Spotify adapter

**Files:**
- Create: `music/providers/spotify.js`
- Create: `tests/music/spotify.test.js`

**Interfaces:**
- Produces: `createSpotifyAdapter({ host, emit, windowRef, documentRef })`.
- Uses `https://open.spotify.com/embed/iframe-api/v1`.
- Supports play, pause, seek, position, and duration from the documented controller API. Volume remains unsupported because the iframe API does not expose a volume method.

- [ ] **Step 1: Write a failing capability and event test**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { createSpotifyAdapter } from '../../music/providers/spotify.js'

test('loads Spotify entities and does not claim volume support', async () => {
  const calls = []
  const listeners = new Map()
  const controller = {
    loadEntity: url => calls.push(['loadEntity', url]),
    play: () => calls.push(['play']),
    pause: () => calls.push(['pause']),
    seek: value => calls.push(['seek', value]),
    addListener: (name, fn) => listeners.set(name, fn),
    destroy: () => calls.push(['destroy'])
  }
  const adapter = createSpotifyAdapter({
    host: {},
    emit: () => {},
    apiLoader: async () => ({ createController: (_host, _options, cb) => cb(controller) })
  })
  await adapter.load({ canonicalUrl: 'https://open.spotify.com/track/abc123' })
  assert.equal(adapter.capabilities.seek, true)
  assert.equal(adapter.capabilities.volume, false)
  assert.deepEqual(calls[0], ['loadEntity', 'https://open.spotify.com/track/abc123'])
})
```

- [ ] **Step 2: Run and verify failure**

```bash
npm test -- tests/music/spotify.test.js
```

Expected result: FAIL because the Spotify adapter does not exist.

- [ ] **Step 3: Implement Spotify API readiness without losing existing callbacks**

Wrap `window.onSpotifyIframeApiReady` so multiple consumers can coexist. Create one controller in the permanent host, then use `loadEntity(item.canonicalUrl)` for subsequent items.

- [ ] **Step 4: Map documented playback events**

Use `ready`, `playback_started`, and `playback_update`. Convert Spotify milliseconds to seconds before emitting unified progress.

```js
controller.addListener('playback_update', event => {
  emit('progress', {
    position: event.data.position / 1000,
    duration: event.data.duration / 1000,
    paused: event.data.isPaused,
    buffering: event.data.isBuffering
  })
})
```

Do not expose `volume`, `next`, `previous`, or `endedEvent` unless the current documented iframe API provides a reliable method or event during implementation.

- [ ] **Step 5: Run Spotify tests**

```bash
npm test -- tests/music/spotify.test.js
```

Expected result: PASS.

- [ ] **Step 6: Commit**

```bash
git add music/providers/spotify.js tests/music/spotify.test.js
git commit -m "feat: add spotify iframe adapter"
```

---

### Task 8: Implement the SoundCloud adapter

**Files:**
- Create: `music/providers/soundcloud.js`
- Create: `tests/music/soundcloud.test.js`

**Interfaces:**
- Produces: `createSoundCloudAdapter({ host, emit, windowRef, documentRef })`.
- Uses `https://w.soundcloud.com/player/api.js` and `https://w.soundcloud.com/player/?url=<encoded canonical URL>`.

- [ ] **Step 1: Write a failing adapter test**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { createSoundCloudAdapter } from '../../music/providers/soundcloud.js'

test('builds a trusted SoundCloud player URL and supports widget transport', async () => {
  const adapter = createSoundCloudAdapter({
    host: {},
    emit: () => {},
    widgetFactory: () => ({
      bind: () => {},
      load: () => {},
      play: () => {},
      pause: () => {},
      seekTo: () => {},
      setVolume: () => {}
    }),
    iframeFactory: src => ({ src })
  })
  await adapter.load({ canonicalUrl: 'https://soundcloud.com/forss/flickermood' })
  assert.equal(adapter.capabilities.play, true)
  assert.equal(adapter.capabilities.seek, true)
  assert.equal(adapter.capabilities.volume, true)
})
```

- [ ] **Step 2: Run and verify failure**

```bash
npm test -- tests/music/soundcloud.test.js
```

Expected result: FAIL because the adapter does not exist.

- [ ] **Step 3: Implement iframe and Widget API creation**

Build only the official `w.soundcloud.com/player/` URL with the normalized SoundCloud URL encoded into its `url` query parameter. Set `auto_play=false`, show artwork, and keep `single_active=true`.

Map Widget API events `READY`, `PLAY`, `PAUSE`, `FINISH`, `PLAY_PROGRESS`, and `ERROR` into unified events. Convert SoundCloud millisecond positions to seconds.

- [ ] **Step 4: Run SoundCloud tests**

```bash
npm test -- tests/music/soundcloud.test.js
```

Expected result: PASS.

- [ ] **Step 5: Commit**

```bash
git add music/providers/soundcloud.js tests/music/soundcloud.test.js
git commit -m "feat: add soundcloud widget adapter"
```

---

### Task 9: Implement the Mixcloud adapter

**Files:**
- Create: `music/providers/mixcloud.js`
- Create: `tests/music/mixcloud.test.js`

**Interfaces:**
- Produces: `createMixcloudAdapter({ host, emit, windowRef, documentRef })`.
- Uses `https://widget.mixcloud.com/media/js/widgetApi.js` and the provider show key derived from the normalized pathname.

- [ ] **Step 1: Write the failing Mixcloud test**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { createMixcloudAdapter } from '../../music/providers/mixcloud.js'

test('loads a Mixcloud show key and exposes ended-event support', async () => {
  const calls = []
  const widget = {
    ready: Promise.resolve(),
    load: (key, start) => calls.push(['load', key, start]),
    play: () => calls.push(['play']),
    pause: () => calls.push(['pause']),
    seek: value => calls.push(['seek', value]),
    getPosition: async () => 0,
    getDuration: async () => 300,
    events: {
      play: { on: () => {}, off: () => {} },
      pause: { on: () => {}, off: () => {} },
      progress: { on: () => {}, off: () => {} },
      ended: { on: () => {}, off: () => {} },
      error: { on: () => {}, off: () => {} }
    }
  }
  const adapter = createMixcloudAdapter({
    host: {},
    emit: () => {},
    widgetFactory: () => widget,
    iframeFactory: () => ({})
  })
  await adapter.load({ sourceId: '/spartacus/party-time/' })
  assert.equal(adapter.capabilities.endedEvent, true)
  assert.deepEqual(calls[0], ['load', '/spartacus/party-time/', false])
})
```

- [ ] **Step 2: Run and verify failure**

```bash
npm test -- tests/music/mixcloud.test.js
```

Expected result: FAIL because the Mixcloud adapter does not exist.

- [ ] **Step 3: Implement the widget adapter**

Create one official Mixcloud widget iframe and initialize `Mixcloud.PlayerWidget(iframe)`. Wait for `widget.ready`, then call `widget.load(item.sourceId, false)` so `load()` never initiates autoplay.

Use Mixcloud `play`, `pause`, `seek`, `getPosition`, `getDuration`, `progress`, `ended`, and `error` APIs. Leave volume unsupported because the documented Widget API does not expose a volume setter.

- [ ] **Step 4: Run Mixcloud tests**

```bash
npm test -- tests/music/mixcloud.test.js
```

Expected result: PASS.

- [ ] **Step 5: Commit**

```bash
git add music/providers/mixcloud.js tests/music/mixcloud.test.js
git commit -m "feat: add mixcloud widget adapter"
```

---

### Task 10: Add fallback provider adapters and registry

**Files:**
- Create: `music/providers/apple-music.js`
- Create: `music/providers/deezer.js`
- Create: `music/providers/tidal.js`
- Create: `music/providers/bandcamp.js`
- Create: `music/provider-registry.js`
- Create: `tests/music/fallback-providers.test.js`

**Interfaces:**
- Produces: `createProviderAdapter(item, deps)`.
- Apple Music, Deezer, TIDAL, and Bandcamp begin with truthful external fallback behavior unless a documented official embed builder is implemented and smoke-tested in the same task.
- Generic recognized providers use `createGenericAdapter`.

- [ ] **Step 1: Write registry tests**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { createProviderAdapter } from '../../music/provider-registry.js'

test('returns a provider-specific adapter factory', () => {
  const adapter = createProviderAdapter(
    { provider: 'apple-music', canonicalUrl: 'https://music.apple.com/us/album/example/123' },
    { host: {}, emit: () => {} }
  )
  assert.equal(adapter.capabilities.play, false)
  assert.equal(adapter.kind, 'external-fallback')
})

test('rejects a provider missing from the registry', () => {
  assert.throws(
    () => createProviderAdapter({ provider: 'unknown' }, { host: {}, emit: () => {} }),
    /unsupported/i
  )
})
```

- [ ] **Step 2: Run and verify failure**

```bash
npm test -- tests/music/fallback-providers.test.js
```

Expected result: FAIL because the registry does not exist.

- [ ] **Step 3: Implement four named fallback adapters**

Each file exports a factory that wraps `createGenericAdapter()` but preserves the provider display name and provider-specific icon key. The adapter kind is explicit.

```js
export function createAppleMusicAdapter(deps) {
  const adapter = createGenericAdapter({ ...deps, displayName: 'Apple Music' })
  return { ...adapter, kind: 'external-fallback' }
}
```

Apply the same pattern for Deezer, TIDAL, and Bandcamp. This satisfies the approved V1 rule that these providers use an official embed where safely available or a graceful Open Original fallback. Do not synthesize undocumented embed URLs.

- [ ] **Step 4: Implement the registry**

Map `youtube`, `spotify`, `soundcloud`, `mixcloud`, `apple-music`, `deezer`, `tidal`, `bandcamp`, and `generic` to exact factories. Throw `MusicCenterError(ERROR_CODES.UNSUPPORTED_PROVIDER, ...)` for anything else.

- [ ] **Step 5: Run registry tests**

```bash
npm test -- tests/music/fallback-providers.test.js
```

Expected result: PASS.

- [ ] **Step 6: Commit**

```bash
git add music/provider-registry.js music/providers/apple-music.js music/providers/deezer.js music/providers/tidal.js music/providers/bandcamp.js tests/music/fallback-providers.test.js
git commit -m "feat: register music provider fallbacks"
```

---

### Task 11: Implement non-blocking metadata resolution

**Files:**
- Create: `music/music-metadata.js`
- Create: `tests/music/metadata.test.js`

**Interfaces:**
- Produces: `resolveMetadata(item, options)` returning `{ state, title, author, artworkUrl, providerLabel }`.
- Metadata failure never throws into playback orchestration. It returns `state: 'unavailable'` with fallback fields.

- [ ] **Step 1: Write metadata fallback tests**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveMetadata } from '../../music/music-metadata.js'

test('returns fallback metadata when network lookup fails', async () => {
  const result = await resolveMetadata(
    {
      provider: 'spotify',
      canonicalUrl: 'https://open.spotify.com/track/abc123',
      type: 'track'
    },
    { fetchImpl: async () => { throw new Error('offline') }, timeoutMs: 10 }
  )
  assert.equal(result.state, 'unavailable')
  assert.equal(result.providerLabel, 'Spotify')
})
```

- [ ] **Step 2: Write safe oEmbed parsing test**

```js
test('keeps text and thumbnail fields without persisting provider HTML', async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({
      title: 'Example Track',
      author_name: 'Example Artist',
      thumbnail_url: 'https://cdn.example/art.jpg',
      html: '<iframe src="https://example.invalid"></iframe>'
    })
  })
  const result = await resolveMetadata(
    { provider: 'spotify', canonicalUrl: 'https://open.spotify.com/track/abc123', type: 'track' },
    { fetchImpl }
  )
  assert.equal(result.title, 'Example Track')
  assert.equal('html' in result, false)
})
```

- [ ] **Step 3: Run and verify failure**

```bash
npm test -- tests/music/metadata.test.js
```

Expected result: FAIL because the metadata resolver does not exist.

- [ ] **Step 4: Implement provider metadata endpoints with timeout**

Use official oEmbed endpoints only where the frontend can request them safely:

```js
const OEMBED_BUILDERS = {
  spotify: item => `https://open.spotify.com/oembed?url=${encodeURIComponent(item.canonicalUrl)}`,
  soundcloud: item => `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(item.canonicalUrl)}`,
  mixcloud: item => `https://app.mixcloud.com/oembed/?url=${encodeURIComponent(item.canonicalUrl)}&format=json`
}
```

For YouTube, prefer player-delivered metadata after the adapter is ready so no API key is introduced. For providers without a frontend-safe metadata endpoint, return fallback metadata immediately.

Use `AbortController` and a 6-second default timeout. Copy only known scalar fields from the response. Never persist the `html` field from an oEmbed response.

- [ ] **Step 5: Run metadata tests**

```bash
npm test -- tests/music/metadata.test.js
```

Expected result: PASS.

- [ ] **Step 6: Commit**

```bash
git add music/music-metadata.js tests/music/metadata.test.js
git commit -m "feat: resolve provider metadata safely"
```

---

### Task 12: Implement the unified player manager

**Files:**
- Create: `music/music-player.js`
- Create: `tests/music/player.test.js`

**Interfaces:**
- Produces: `createPlayerManager({ createAdapter, queueController, initialVolume })`.
- Public methods: `load(item, options)`, `play()`, `pause()`, `seek(seconds)`, `setVolume(value)`, `next()`, `previous()`, `setMinimized(value)`, `subscribe(listener)`, `getState()`, `destroy()`.
- State includes `currentItem`, `provider`, `status`, `position`, `duration`, `volume`, `capabilities`, `error`, and `minimized`.

- [ ] **Step 1: Write the single-active-provider test**

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { createPlayerManager } from '../../music/music-player.js'

function fakeAdapter(name, log) {
  return {
    capabilities: { play: true, pause: true, seek: false, volume: false, next: false, previous: false, progress: false, endedEvent: false },
    async load(item) { log.push(`${name}:load:${item.sourceId}`) },
    async play() { log.push(`${name}:play`) },
    async pause() { log.push(`${name}:pause`) },
    async seek() {},
    async setVolume() {},
    getState() { return {} },
    destroy() { log.push(`${name}:destroy`) }
  }
}

test('pauses the old provider before activating the next provider', async () => {
  const log = []
  const manager = createPlayerManager({
    createAdapter: item => fakeAdapter(item.provider, log)
  })
  await manager.load({ provider: 'youtube', sourceId: 'a' })
  await manager.load({ provider: 'spotify', sourceId: 'b' })
  assert.deepEqual(log.slice(0, 3), ['youtube:load:a', 'youtube:pause', 'spotify:load:b'])
})
```

- [ ] **Step 2: Add unsupported-control and minimize tests**

```js
test('does not call unsupported controls and preserves adapter on minimize', async () => {
  let destroyed = 0
  const manager = createPlayerManager({
    createAdapter: () => ({
      capabilities: { play: true, pause: true, seek: false, volume: false, next: false, previous: false, progress: false, endedEvent: false },
      async load() {}, async play() {}, async pause() {}, async seek() {}, async setVolume() {},
      getState() { return {} },
      destroy() { destroyed += 1 }
    })
  })
  await manager.load({ provider: 'spotify', sourceId: 'b' })
  manager.setMinimized(true)
  assert.equal(destroyed, 0)
  assert.equal(manager.getState().minimized, true)
})
```

- [ ] **Step 3: Run and verify failure**

```bash
npm test -- tests/music/player.test.js
```

Expected result: FAIL because the player manager does not exist.

- [ ] **Step 4: Implement state publication and provider switching**

Use a subscriber set and publish immutable snapshots.

```js
const listeners = new Set()
let state = {
  currentItem: null,
  provider: null,
  status: PLAYBACK_STATUS.IDLE,
  position: 0,
  duration: null,
  volume: initialVolume,
  capabilities: createCapabilitySet(),
  error: null,
  minimized: false
}

function publish(patch) {
  state = { ...state, ...patch }
  for (const listener of listeners) listener({ ...state })
}
```

When switching provider, pause the current adapter first. Create and load the target adapter. Do not mark the new adapter active until `load()` resolves. If target load fails, publish `PLAYBACK_ERROR` and keep the previous adapter paused.

- [ ] **Step 5: Wire adapter events into state**

Map `ready`, `playing`, `paused`, `progress`, `ended`, and `error`. Call queue advancement only when `ended` is reliable for the active adapter. A user-invoked `next()` always advances the local queue.

- [ ] **Step 6: Run player tests**

```bash
npm test -- tests/music/player.test.js
```

Expected result: PASS.

- [ ] **Step 7: Run the complete unit suite**

```bash
npm test
```

Expected result: all current tests PASS.

- [ ] **Step 8: Commit**

```bash
git add music/music-player.js tests/music/player.test.js
git commit -m "feat: add unified music player manager"
```

---

### Task 13: Build the fullscreen UI and mini player

**Files:**
- Create: `music/music-view.js`
- Create: `music-center.css`

**Interfaces:**
- Produces: `createMusicView({ overlayRoot, miniRoot, playbackHost, dispatch })`.
- Public methods: `renderPlayer(state)`, `renderLibrary(model)`, `setActiveView(view)`, `show()`, `minimize()`, `destroy()`.
- Emits UI intents through `dispatch({ type, ...payload })` rather than calling provider adapters directly.

- [ ] **Step 1: Build semantic DOM from one view factory**

Create the overlay structure with `role="dialog"`, `aria-modal="true"`, a labelled title, URL form, sidebar, main pane, queue pane, bottom transport, and mini player. Use semantic `<button>`, `<form>`, `<input>`, `<nav>`, and `<section>` elements.

The view factory starts from these stable mount points:

```js
const roots = {
  overlay: document.querySelector('#mc-overlay'),
  mini: document.querySelector('#mc-mini-player'),
  playback: document.querySelector('#mc-playback-host')
}
```

- [ ] **Step 2: Add event delegation**

Use `data-mc-action` attributes for `play-pause`, `previous`, `next`, `favorite`, `minimize`, `reopen`, `queue`, `retry`, `open-original`, `create-playlist`, and navigation actions. The URL form dispatches `ADD_URL` with the input value.

```js
root.addEventListener('click', event => {
  const button = event.target.closest('[data-mc-action]')
  if (!button) return
  dispatch({
    type: button.dataset.mcAction,
    id: button.dataset.mcId || null
  })
})
```

- [ ] **Step 3: Implement capability-driven control states**

`renderPlayer(state)` disables seek, volume, previous, and next controls when the corresponding capability or queue operation is unavailable. External fallback items show `Open Original` and do not show fake transport controls.

- [ ] **Step 4: Implement website-native styling**

Use only existing theme variables for surfaces and accents.

```css
.mc-shell { color: var(--ink) }
.mc-shell { background: var(--bg) }
.mc-panel { background: var(--surface) }
.mc-panel { border: 1px solid var(--line) }
.mc-panel { box-shadow: var(--shadow-soft) }
.mc-primary { color: var(--ink) }
.mc-primary { background: linear-gradient(135deg, var(--purple), var(--pink), var(--cyan)) }
```

Do not define a separate Music Center palette in JavaScript or CSS.

- [ ] **Step 5: Implement responsive layouts**

Desktop uses `Sidebar | Main | Queue`. Tablet moves queue into a drawer. Mobile uses a top bar, main content, bottom player, bottom navigation, and queue drawer. Use `min-height: 100vh` plus `height: 100dvh` where supported.

- [ ] **Step 6: Add accessibility and reduced-motion behavior**

Provide visible `:focus-visible` styling. Add a `@media (prefers-reduced-motion: reduce)` block that removes large transforms and nonessential animation. Escape minimizes only when the overlay is active. Space, M, and arrow shortcuts are ignored while focus is in input, textarea, select, or contenteditable controls.

- [ ] **Step 7: Browser-inspect the view without provider playback**

Serve the repository locally:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` and temporarily invoke the view from DevTools after importing `music/music-view.js`. Confirm no global Gallery selector changes and no overflow is introduced at desktop, tablet, or mobile widths.

- [ ] **Step 8: Commit**

```bash
git add music/music-view.js music-center.css
git commit -m "feat: build music center interface"
```

---

### Task 14: Orchestrate library, favorites, history, playlists, queue, and metadata

**Files:**
- Create: `music-center.js`

**Interfaces:**
- Produces: `initMusicCenter()` and `openMusicCenter()`.
- Consumes every module created in Tasks 2 through 13.
- `initMusicCenter()` is idempotent and never starts playback.

- [ ] **Step 1: Implement idempotent initialization**

Use one module-level Promise so concurrent clicks cannot initialize the feature twice.

```js
let initPromise = null
let app = null

export function initMusicCenter() {
  if (initPromise) return initPromise
  initPromise = createApp().then(value => {
    app = value
    return value
  })
  return initPromise
}

export async function openMusicCenter() {
  const instance = await initMusicCenter()
  instance.view.show()
  instance.player.setMinimized(false)
}
```

- [ ] **Step 2: Restore persistent state without autoplay**

Load settings, queue, library, favorites, history, and playlists before the first full render. Restore volume and view state. Do not call `player.play()` during initialization, even if a previous current item exists.

- [ ] **Step 3: Implement ADD_URL flow**

Use this exact order:

```text
resolveMusicUrl
saveTrack
render immediate fallback metadata
resolveMetadata in background
merge metadata into track
refresh library
load item only after explicit user Play or Play Now action
```

Invalid or unsupported URLs render the approved recoverable error state and never create an iframe.

- [ ] **Step 4: Record history only on real playback start**

Subscribe to player state. When state transitions into `playing` for a new current item, call `store.addHistory(currentItem.fingerprint, Date.now())`. Do not add history merely on paste, save, or load.

- [ ] **Step 5: Implement local favorites and playlists**

Favorite actions call `store.setFavorite(trackId, boolean)` only. Playlist creation uses `crypto.randomUUID()` for local playlist IDs. Playlist membership stores canonical track fingerprints, so the same track can belong to many playlists without duplicate track records.

- [ ] **Step 6: Persist queue and settings after state changes**

Debounce writes by about 150 ms so drag reorder and progress updates do not flood IndexedDB. Persist queue only when queue structure, cursor, shuffle, or repeat changes. Persist settings when volume, active view, or minimized state changes. Do not persist every progress tick.

- [ ] **Step 7: Implement minimize and reopen behavior**

Minimize hides the fullscreen overlay, keeps `#mc-playback-host` mounted, and shows `#mc-mini-player` only when `currentItem` exists. Reopen only changes UI visibility and `minimized` state. It never destroys the adapter.

- [ ] **Step 8: Implement recovery actions**

`Retry` reloads the current item through the existing adapter or a fresh adapter after a failed init. `Open Original` uses `target="_blank"` and `rel="noopener noreferrer"`. `Next` advances the local queue. Metadata errors remain nonfatal.

- [ ] **Step 9: Run the full unit suite**

```bash
npm test
```

Expected result: PASS.

- [ ] **Step 10: Commit**

```bash
git add music-center.js
git commit -m "feat: orchestrate music center state"
```

---

### Task 15: Register Music Center in the existing page and feature loader

**Files:**
- Modify: `index.html`
- Modify: `feature-loader.js`

**Interfaces:**
- Existing Gallery, Mini Game, Android Simulator trigger behavior remains intact.
- Music trigger ID is `musicCenterBtn`.
- Permanent mount IDs are `mc-playback-host`, `mc-overlay`, and `mc-mini-player`.

- [ ] **Step 1: Add the Music trigger and mount points to `index.html`**

Place the Music button alongside the existing Mini Game and Ponsel feature actions, following the existing button classes and icon treatment.

```html
<button id="musicCenterBtn" type="button" aria-label="Open Music Center">
  <span aria-hidden="true">♫</span>
  <span>Music</span>
</button>
```

Add stable mounts near the end of `<body>` before the existing script includes:

```html
<div id="mc-playback-host" class="mc-playback-host" aria-live="off"></div>
<div id="mc-overlay"></div>
<div id="mc-mini-player"></div>
```

Do not add provider scripts to `index.html`.

- [ ] **Step 2: Extend the existing feature loader rather than creating a parallel loader**

Add a cached module import and stylesheet loader while preserving the existing Mini Game and Android Simulator code path.

```js
let musicModulePromise = null

function ensureMusicCenterCss() {
  if (document.querySelector('link[data-feature="music-center"]')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'music-center.css'
  link.dataset.feature = 'music-center'
  document.head.appendChild(link)
}

function preloadMusicCenter() {
  ensureMusicCenterCss()
  if (!musicModulePromise) musicModulePromise = import('./music-center.js')
  return musicModulePromise
}
```

On `pointerenter` and `focus`, call `preloadMusicCenter()`. On click, await the module and call `openMusicCenter()`.

- [ ] **Step 3: Verify lazy behavior from a clean reload**

Open DevTools Network, reload the Gallery, and confirm that none of these appear before Music hover, focus, or click:

```text
music-center.js
music-center.css
music/providers/youtube.js
music/providers/spotify.js
https://www.youtube.com/iframe_api
https://open.spotify.com/embed/iframe-api/v1
https://w.soundcloud.com/player/api.js
https://widget.mixcloud.com/media/js/widgetApi.js
```

After hovering the Music trigger, Music Center local assets may load. Provider SDKs must still remain absent until a provider item is actually used.

- [ ] **Step 4: Verify existing features still open**

From a clean reload, open Mini Game, close it, open Ponsel, close it, then open Music. Confirm no duplicate CSS or JS injection and no console error from the existing loaders.

- [ ] **Step 5: Commit**

```bash
git add index.html feature-loader.js
git commit -m "feat: register lazy music center"
```

---

### Task 16: Provider smoke testing, responsive regression, and release verification

**Files:**
- Modify only files implicated by verified defects found during this task.

**Interfaces:**
- Validates the complete V1 against the acceptance criteria in the approved spec.

- [ ] **Step 1: Run the automated suite from a clean install**

```bash
npm ci
npm test
```

Expected result: all tests PASS.

- [ ] **Step 2: Start the site through HTTP**

```bash
python3 -m http.server 8000
```

Use HTTP rather than opening `index.html` as a `file:` URL because module loading and provider iframe behavior differ under `file:`.

- [ ] **Step 3: Smoke-test YouTube with the official API example video**

Use:

```text
https://www.youtube.com/watch?v=M7lc1UVf-VE
```

Verify add, metadata fallback or enrichment, explicit Play, pause, seek, volume, minimize, reopen, and no restart caused by minimization. Then verify a compatible YouTube playlist URL supplied for the release smoke test uses playlist playback without scraping.

- [ ] **Step 4: Smoke-test Spotify with the official documentation example**

Use:

```text
https://open.spotify.com/episode/7makk4oTQel546B0PZlDM5
```

Verify load, explicit Play when browser policy allows it, pause, seek, progress updates, and that Music Center does not render a fake volume control for Spotify.

- [ ] **Step 5: Smoke-test SoundCloud and Mixcloud**

Use:

```text
https://soundcloud.com/forss/flickermood
https://www.mixcloud.com/spartacus/party-time/
```

Verify each provider initializes only after its item is used. Confirm Mixcloud automatic queue advancement occurs only from its documented `ended` event. Confirm SoundCloud finish events advance the queue only when the widget emits a reliable finish event.

- [ ] **Step 6: Verify fallback providers**

Paste representative Apple Music, Deezer, TIDAL, and Bandcamp links. Confirm each is recognized, saved, rendered with provider branding, and exposes `Open Original` when no tested official embed path is active. Confirm no raw user URL is inserted as an iframe source.

- [ ] **Step 7: Verify persistence**

Create two local playlists, favorite at least two items, queue items from at least three providers, enable shuffle, set repeat mode, minimize Music Center, and reload the page. Confirm the library, favorites, playlists, queue, shuffle, repeat, volume, and last view restore. Confirm playback does not begin until a user gesture.

- [ ] **Step 8: Verify theme inheritance**

Toggle every existing website palette or Color Burst mode available in the current branch. Confirm Music Center surfaces and accents change automatically through website CSS variables. Search runtime code for hard-coded theme state and remove any duplicate theme implementation.

- [ ] **Step 9: Verify responsive and accessibility behavior**

Check representative widths around 1440 px, 1024 px, 768 px, and 390 px. Confirm queue drawer behavior, `100dvh` mobile sizing, visible keyboard focus, Escape minimize, no shortcuts inside the URL input, and reduced-motion behavior with OS reduced motion enabled.

- [ ] **Step 10: Verify existing site regression**

From a clean reload where Music is never opened, exercise Gallery search, filters, shuffle, lightbox, upload flow, language toggle, Color Burst, Mini Game, and Android Simulator. Confirm no new console errors and no layout shift introduced by Music Center mounts.

- [ ] **Step 11: Verify security cases**

Attempt these inputs and confirm all are rejected without iframe creation:

```text
javascript:alert(1)
data:text/html,hello
file:///tmp/song.mp3
https://youtube.com.evil.example/watch?v=M7lc1UVf-VE
https://evil.example/?url=https://youtube.com/watch?v=M7lc1UVf-VE
```

- [ ] **Step 12: Run final tests and inspect the diff**

```bash
npm test
git status --short
git diff --check
git diff --stat
```

Expected result: tests PASS, `git diff --check` prints no whitespace errors, and the diff contains only Music Center files plus the minimal `index.html` and `feature-loader.js` integration.

- [ ] **Step 13: Commit verified fixes if Task 16 changed code**

If smoke testing required code changes, stage only those verified fixes and commit them with a focused message such as:

```bash
git add <verified-files>
git commit -m "fix: harden music center provider playback"
```

If Task 16 found no defect, do not create an empty commit.

---

## Implementation References

Use the current official provider documentation while executing adapter tasks:

- YouTube IFrame Player API: `https://developers.google.com/youtube/iframe_api_reference`
- Spotify IFrame API: `https://developer.spotify.com/documentation/embeds/references/iframe-api`
- Spotify IFrame tutorial: `https://developer.spotify.com/documentation/embeds/tutorials/using-the-iframe-api`
- Spotify oEmbed: `https://developer.spotify.com/documentation/embeds/reference/oembed`
- SoundCloud Widget API: `https://developers.soundcloud.com/docs/api/html5-widget`
- Mixcloud Widget API: `https://www.mixcloud.com/developers/widget/`
- TIDAL Embeds overview: `https://developer.tidal.com/documentation/embeds/embeds-overview`

## Plan Self-Review

- Spec coverage: all 20 acceptance criteria map to Tasks 2 through 16.
- Scope: Music Center remains one cohesive feature. Provider adapters are independent implementation tasks behind one stable contract, so a second design spec is not required.
- Placeholder scan: no deferred implementation markers remain.
- Type consistency: resolver entities use `fingerprint` as the track key, queue entries reference track fingerprints, store APIs persist the same identifiers, and the player manager receives the normalized entity directly.
- Security consistency: only resolver-approved providers reach adapters, provider adapters construct their own trusted embed endpoints, and fallback adapters never iframe arbitrary user input.
- Playback consistency: `load()` never starts first playback, minimization never destroys the active adapter, and full reload never autoplays.
- Theme consistency: Music Center uses existing CSS variables with no duplicated palette state.
- Persistence consistency: IndexedDB is separate from the Gallery database and history remains capped at 200 rows.
