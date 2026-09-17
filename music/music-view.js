const VIEW_LABELS = Object.freeze({
  home: 'Home',
  library: 'Library',
  favorites: 'Favorites',
  recent: 'Recently Played'
})

const PROVIDER_LABELS = Object.freeze({
  youtube: 'YouTube', spotify: 'Spotify', soundcloud: 'SoundCloud', mixcloud: 'Mixcloud',
  'apple-music': 'Apple Music', deezer: 'Deezer', tidal: 'TIDAL', bandcamp: 'Bandcamp',
  'amazon-music': 'Amazon Music', audiomack: 'Audiomack', qobuz: 'Qobuz', pandora: 'Pandora'
})

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char])
}

function safeArtwork(url = '') {
  try {
    const parsed = new URL(url, globalThis.location?.href || 'https://example.invalid')
    return parsed.protocol === 'https:' || parsed.protocol === 'data:' ? parsed.href : ''
  } catch {
    return ''
  }
}

function formatTime(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0))
  const minutes = Math.floor(value / 60)
  return `${minutes}:${String(value % 60).padStart(2, '0')}`
}

export function calculateTitleMarquee(contentWidth, viewportWidth) {
  const content = Math.max(0, Number(contentWidth) || 0)
  const viewport = Math.max(0, Number(viewportWidth) || 0)
  const distance = Math.ceil(content - viewport)
  if (!viewport || distance <= 4) return { active: false, distance: 0, duration: 0 }
  return {
    active: true,
    distance,
    duration: Math.max(7, Math.min(18, Number((6 + distance / 55).toFixed(2))))
  }
}

export function createPlayerPresentation(state = {}) {
  const item = state.currentItem || null
  const caps = state.capabilities || {}
  const duration = Number(state.duration) || 0
  const position = Math.max(0, Number(state.position) || 0)
  const externalOnly = Boolean(item && !caps.play && item.canonicalUrl)
  const title = item?.title || item?.metadata?.title || 'Nothing playing yet'
  const author = item?.author || item?.metadata?.author || 'Paste a music link to begin'
  const provider = item?.sourceBrand === 'youtube-music' ? 'YouTube Music' : PROVIDER_LABELS[item?.provider] || 'Music Center'
  return {
    item,
    title,
    author,
    provider,
    artworkUrl: safeArtwork(item?.artworkUrl || item?.metadata?.artworkUrl || ''),
    status: state.status || 'idle',
    playing: state.status === 'playing',
    position,
    duration,
    positionText: formatTime(position),
    durationText: duration ? formatTime(duration) : '--:--',
    progressPercent: duration ? Math.max(0, Math.min(100, (position / duration) * 100)) : 0,
    volumePercent: Math.round(Math.max(0, Math.min(1, Number(state.volume ?? 0.8))) * 100),
    externalOnly,
    originalUrl: item?.canonicalUrl || '',
    playDisabled: !item || !caps.play,
    seekDisabled: !item || !caps.seek || !duration,
    volumeDisabled: !item || !caps.volume,
    nextDisabled: !item || (!caps.next && state.canQueueNext !== true),
    previousDisabled: !item || (!caps.previous && state.canQueuePrevious !== true),
    error: state.error || null
  }
}

export function buildMusicCenterMarkup() {
  return `
    <div class="mc-shell" role="dialog" aria-modal="true" aria-labelledby="mc-title" tabindex="-1">
      <header class="mc-topbar">
        <div class="mc-brand-wrap">
          <span class="mc-brand-icon" aria-hidden="true">♫</span>
          <div><strong id="mc-title">Music Center</strong><small>Universal streaming hub</small></div>
        </div>
        <form class="mc-url-form" id="mc-url-form" autocomplete="off">
          <label class="mc-sr-only" for="mc-url-input">Music link</label>
          <input id="mc-url-input" name="musicUrl" type="url" inputmode="url" placeholder="Paste YouTube, Spotify, SoundCloud, Mixcloud…" required>
          <button class="mc-primary" type="submit"><span aria-hidden="true">＋</span><span>Add</span></button>
        </form>
        <button class="mc-icon-button" type="button" data-mc-action="minimize" aria-label="Minimize Music Center">⌄</button>
      </header>
      <div id="mc-notice" class="mc-notice" role="status" aria-live="polite" hidden></div>

      <div class="mc-layout">
        <aside class="mc-sidebar mc-panel">
          <nav aria-label="Music Center" class="mc-nav">
            <button class="mc-nav-item is-active" type="button" data-mc-action="navigate" data-mc-view="home"><span>⌂</span>Home</button>
            <button class="mc-nav-item" type="button" data-mc-action="navigate" data-mc-view="favorites"><span>♡</span>Favorites</button>
            <button class="mc-nav-item" type="button" data-mc-action="navigate" data-mc-view="library"><span>▦</span>Library</button>
            <button class="mc-nav-item" type="button" data-mc-action="navigate" data-mc-view="recent"><span>◷</span>Recently Played</button>
          </nav>
          <div class="mc-sidebar-section">
            <div class="mc-section-eyebrow"><span>Your playlists</span><button type="button" data-mc-action="create-playlist" aria-label="Create playlist">＋</button></div>
            <div id="mc-playlists" class="mc-playlist-list"><p class="mc-empty-small">No local playlists yet.</p></div>
          </div>
          <div class="mc-supported">
            <span>Works with</span>
            <div class="mc-provider-dots" aria-label="YouTube, Spotify, SoundCloud, Mixcloud and more">
              <i>Y</i><i>S</i><i>◖</i><i>M</i><i>＋</i>
            </div>
          </div>
        </aside>

        <main class="mc-main mc-panel">
          <section class="mc-now-playing" aria-labelledby="mc-now-label">
            <div class="mc-now-copy">
              <span id="mc-now-label" class="mc-kicker">Now Playing</span>
              <h2 id="mc-now-title">Nothing playing yet</h2>
              <p id="mc-now-author">Paste a music link to begin</p>
              <div class="mc-now-meta">
                <span id="mc-now-provider" class="mc-provider-pill">Music Center</span>
                <button type="button" class="mc-ghost-button" data-mc-action="favorite" id="mc-favorite-btn">♡ Favorite</button>
                <a id="mc-open-original" class="mc-ghost-button" href="#" target="_blank" rel="noopener noreferrer" hidden>↗ Open Original</a>
              </div>
            </div>
            <div class="mc-art-wrap">
              <div class="mc-art-placeholder" id="mc-art-placeholder"><span>♫</span></div>
              <img id="mc-artwork" class="mc-artwork" alt="" hidden>
            </div>
          </section>

          <section class="mc-provider-zone" aria-label="Provider player">
            <div id="mc-provider-stage" class="mc-provider-stage"></div>
          </section>

          <section class="mc-collection-section">
            <div class="mc-section-heading"><div><span class="mc-kicker" id="mc-view-kicker">Your music</span><h3 id="mc-view-title">Home</h3></div><span id="mc-library-count" class="mc-count">0 items</span></div>
            <div id="mc-library-grid" class="mc-track-grid"><div class="mc-empty-state"><span>♫</span><strong>Your Music Center is ready</strong><p>Add a supported streaming link above.</p></div></div>
          </section>
        </main>

        <aside class="mc-queue mc-panel" aria-labelledby="mc-queue-title">
          <div class="mc-queue-head"><div><span class="mc-kicker">Queue</span><h3 id="mc-queue-title">Up Next</h3></div><button class="mc-icon-button" type="button" data-mc-action="queue-close" aria-label="Close queue">×</button></div>
          <div id="mc-queue-list" class="mc-queue-list"><p class="mc-empty-small">Queue is empty.</p></div>
          <div class="mc-queue-tools">
            <button type="button" data-mc-action="shuffle" id="mc-shuffle-btn">⇄ Shuffle</button>
            <button type="button" data-mc-action="repeat" id="mc-repeat-btn">↻ Repeat</button>
          </div>
        </aside>
      </div>

      <footer class="mc-transport mc-panel" aria-label="Music playback controls">
        <div class="mc-transport-track">
          <div class="mc-mini-art" id="mc-transport-art">♫</div>
          <div class="mc-title-copy"><div class="mc-title-viewport" id="mc-transport-title-viewport"><strong class="mc-marquee-title" id="mc-transport-title">Nothing playing</strong></div><small id="mc-transport-author">Music Center</small></div>
        </div>
        <div class="mc-transport-center">
          <div class="mc-transport-buttons">
            <button type="button" data-mc-action="shuffle" aria-label="Shuffle">⇄</button>
            <button type="button" data-mc-action="previous" id="mc-prev-btn" aria-label="Previous">◀</button>
            <button type="button" class="mc-play-button" data-mc-action="play-pause" id="mc-play-btn" aria-label="Play">▶</button>
            <button type="button" data-mc-action="next" id="mc-next-btn" aria-label="Next">▶</button>
            <button type="button" data-mc-action="repeat" aria-label="Repeat">↻</button>
          </div>
          <div class="mc-progress-row"><span id="mc-position">0:00</span><input id="mc-progress" type="range" min="0" max="100" value="0" step="0.1" aria-label="Playback position"><span id="mc-duration">--:--</span></div>
        </div>
        <div class="mc-transport-side">
          <button type="button" data-mc-action="queue" aria-label="Queue">☷</button>
          <span aria-hidden="true">🔊</span><input id="mc-volume" type="range" min="0" max="100" value="80" aria-label="Volume">
          <button type="button" data-mc-action="minimize" aria-label="Minimize">⌄</button>
        </div>
      </footer>

      <nav class="mc-mobile-nav" aria-label="Music Center mobile navigation">
        <button type="button" data-mc-action="navigate" data-mc-view="home">⌂<span>Home</span></button>
        <button type="button" data-mc-action="navigate" data-mc-view="library">▦<span>Library</span></button>
        <button type="button" class="mc-mobile-add" data-mc-action="focus-add">＋<span>Add</span></button>
        <button type="button" data-mc-action="navigate" data-mc-view="favorites">♡<span>Favorites</span></button>
        <button type="button" data-mc-action="queue">☷<span>Queue</span></button>
      </nav>
    </div>`
}

function buildMiniMarkup() {
  return `
    <div class="mc-mini-shell mc-panel" aria-label="Mini music player">
      <div class="mc-mini-track"><div class="mc-mini-art" id="mc-mini-art">♫</div><div class="mc-title-copy"><div class="mc-title-viewport" id="mc-mini-title-viewport"><strong class="mc-marquee-title" id="mc-mini-title">Nothing playing</strong></div><small id="mc-mini-author">Music Center</small></div></div>
      <div class="mc-mini-controls">
        <button type="button" data-mc-action="previous" aria-label="Previous">◀</button>
        <button type="button" class="mc-play-button" data-mc-action="play-pause" id="mc-mini-play" aria-label="Play">▶</button>
        <button type="button" data-mc-action="next" aria-label="Next">▶</button>
      </div>
      <div class="mc-mini-progress"><span id="mc-mini-progress-fill"></span></div>
      <button type="button" class="mc-icon-button" data-mc-action="reopen" aria-label="Open Music Center">⌃</button>
    </div>`
}

function renderTrackCard(track, favoriteSet) {
  const id = escapeHtml(track.fingerprint || '')
  const title = escapeHtml(track.title || track.metadata?.title || track.providerLabel || 'Saved music')
  const author = escapeHtml(track.author || track.metadata?.author || track.sourceBrand || track.provider || '')
  const artwork = safeArtwork(track.artworkUrl || track.metadata?.artworkUrl || '')
  const provider = escapeHtml(track.providerLabel || (track.sourceBrand === 'youtube-music' ? 'YouTube Music' : PROVIDER_LABELS[track.provider] || track.provider || 'Music'))
  const heart = favoriteSet.has(track.fingerprint) ? '♥' : '♡'
  return `<article class="mc-track-card" data-mc-id="${id}">
    <button class="mc-track-play" type="button" data-mc-action="play-item" data-mc-id="${id}" aria-label="Play ${title}">
      ${artwork ? `<img src="${escapeHtml(artwork)}" alt="">` : `<span class="mc-card-placeholder">♫</span>`}
      <span class="mc-card-play-icon">▶</span>
    </button>
    <div class="mc-track-copy"><strong>${title}</strong><small>${author}</small><span>${provider}</span></div>
    <div class="mc-card-actions">
      <button class="mc-card-action" type="button" data-mc-action="playlist-add" data-mc-id="${id}" aria-label="Add ${title} to playlist">＋</button>
      <button class="mc-card-action" type="button" data-mc-action="favorite-item" data-mc-id="${id}" aria-label="Favorite ${title}">${heart}</button>
    </div>
  </article>`
}

function renderQueueItem(track, index, activeId, options = {}) {
  const id = escapeHtml(track.queueEntryId || track.fingerprint || '')
  const title = escapeHtml(track.title || track.metadata?.title || 'Saved music')
  const author = escapeHtml(track.author || track.metadata?.author || track.providerLabel || PROVIDER_LABELS[track.provider] || track.provider || 'Music')
  const artwork = safeArtwork(track.artworkUrl || track.metadata?.artworkUrl || '')
  const current = (track.queueEntryId || track.fingerprint) === activeId
  const queueIndex = Number.isInteger(options.queueIndex) ? options.queueIndex : index
  const position = Number.isInteger(options.position) ? options.position : index + 1
  const draggable = options.draggable !== false
  return `<article class="mc-queue-item${current ? ' is-current' : ''}${options.nested ? ' is-nested' : ''}" ${draggable ? `draggable="true" data-mc-queue-index="${queueIndex}"` : 'draggable="false"'} data-mc-id="${id}"${current ? ' aria-current="true"' : ''}>
    <button type="button" class="mc-queue-play" data-mc-action="queue-play" data-mc-id="${id}">
      <span class="mc-queue-position">${position}</span>
      <span class="mc-queue-thumb">${artwork ? `<img src="${escapeHtml(artwork)}" alt="">` : '♫'}</span>
      <span class="mc-queue-copy"><strong>${title}</strong><small>${author}</small></span>
    </button>
    <button type="button" class="mc-card-action" data-mc-action="queue-remove" data-mc-id="${id}" aria-label="Remove ${title}">×</button>
  </article>`
}

export function renderQueueMarkup(model = {}) {
  const queue = model.queue || []
  const state = model.queueState || {}
  if (!queue.length) return ''
  const activeId = Number.isInteger(state.cursor) && state.cursor >= 0 ? state.playOrder?.[state.cursor] || null : null
  if (state.shuffle) return queue.map((track, index) => renderQueueItem(track, index, activeId, { queueIndex: index, position: index + 1 })).join('')

  const groups = new Map((state.groups || []).map(group => [group.id, group]))
  const renderedGroups = new Set()
  const chunks = []
  queue.forEach((track, queueIndex) => {
    if (!track.queueGroupId) {
      chunks.push(renderQueueItem(track, queueIndex, activeId, { queueIndex, position: queueIndex + 1 }))
      return
    }
    if (renderedGroups.has(track.queueGroupId)) return
    renderedGroups.add(track.queueGroupId)
    const group = groups.get(track.queueGroupId) || { id: track.queueGroupId, title: 'Playlist', collapsed: false }
    const children = queue.filter(row => row.queueGroupId === track.queueGroupId)
    const activeChildIndex = children.findIndex(row => row.queueEntryId === activeId)
    const title = escapeHtml(group.title || 'Playlist')
    const groupId = escapeHtml(group.id)
    const collapsed = Boolean(group.collapsed)
    const playingText = activeChildIndex >= 0 ? `<span class="mc-queue-group-playing">Playing ${activeChildIndex + 1} / ${children.length}</span>` : ''
    const childMarkup = collapsed ? '' : children.map(child => {
      const actualQueueIndex = queue.findIndex(row => row.queueEntryId === child.queueEntryId)
      return renderQueueItem(child, actualQueueIndex, activeId, {
        queueIndex: actualQueueIndex,
        position: Number.isInteger(child.queueGroupIndex) ? child.queueGroupIndex + 1 : actualQueueIndex + 1,
        nested: true,
        draggable: false
      })
    }).join('')
    chunks.push(`<section class="mc-queue-group" data-mc-group-id="${groupId}">
      <div class="mc-queue-group-header">
        <button type="button" class="mc-queue-group-toggle" data-mc-action="queue-group-toggle" data-mc-id="${groupId}" aria-expanded="${collapsed ? 'false' : 'true'}">
          <span aria-hidden="true">${collapsed ? '›' : '⌄'}</span>
          <span><strong>${title}</strong><small>${children.length} track${children.length === 1 ? '' : 's'}${playingText}</small></span>
        </button>
        <button type="button" class="mc-card-action" data-mc-action="queue-group-remove" data-mc-id="${groupId}" aria-label="Remove playlist ${title}">×</button>
      </div>
      <div class="mc-queue-group-items"${collapsed ? ' hidden' : ''}>${childMarkup}</div>
    </section>`)
  })
  return chunks.join('')
}

export function selectTracksForView(activeView, model = {}) {
  const favoriteSet = new Set(model.favorites || [])
  if (activeView === 'favorites') return (model.tracks || []).filter(track => favoriteSet.has(track.fingerprint))
  if (activeView === 'recent') {
    const byId = new Map((model.tracks || []).map(track => [track.fingerprint, track]))
    return (model.history || []).map(row => byId.get(row.trackId)).filter(Boolean)
  }
  return (model.tracks || []).filter(track => track.libraryVisible !== false)
}

export function createMusicView({ overlayRoot, miniRoot, playbackHost, dispatch = () => {}, documentRef = globalThis.document } = {}) {
  if (!overlayRoot || !miniRoot || !playbackHost) throw new TypeError('Music view requires all permanent mount points')
  overlayRoot.classList?.add('mc-overlay-root')
  miniRoot.classList?.add('mc-mini-root')
  overlayRoot.innerHTML = buildMusicCenterMarkup()
  miniRoot.innerHTML = buildMiniMarkup()
  overlayRoot.hidden = true
  miniRoot.hidden = true

  const shell = overlayRoot.querySelector('.mc-shell')
  const providerStage = overlayRoot.querySelector('#mc-provider-stage')
  providerStage?.append?.(playbackHost)
  playbackHost.classList?.add('mc-playback-host')

  let activeView = 'home'
  let playerState = null
  let libraryModel = { tracks: [], favorites: [], history: [], playlists: [], queue: [] }

  const query = selector => overlayRoot.querySelector(selector)
  const miniQuery = selector => miniRoot.querySelector(selector)

  const titleViewports = [
    query('#mc-transport-title-viewport'),
    miniQuery('#mc-mini-title-viewport')
  ].filter(Boolean)

  function refreshTitleMarquee(viewport) {
    const title = viewport?.querySelector?.('.mc-marquee-title')
    if (!title) return
    const motion = calculateTitleMarquee(title.scrollWidth, viewport.clientWidth)
    viewport.classList?.toggle?.('is-marquee', motion.active)
    if (motion.active) {
      viewport.style?.setProperty?.('--mc-marquee-distance', `${motion.distance}px`)
      viewport.style?.setProperty?.('--mc-marquee-duration', `${motion.duration}s`)
    } else {
      viewport.style?.removeProperty?.('--mc-marquee-distance')
      viewport.style?.removeProperty?.('--mc-marquee-duration')
    }
  }

  function refreshTitleMarquees() {
    for (const viewport of titleViewports) refreshTitleMarquee(viewport)
  }

  const scheduleTitleMarquees = () => {
    const raf = documentRef?.defaultView?.requestAnimationFrame || globalThis.requestAnimationFrame
    if (typeof raf === 'function') raf(refreshTitleMarquees)
    else refreshTitleMarquees()
  }

  const ResizeObserverCtor = documentRef?.defaultView?.ResizeObserver || globalThis.ResizeObserver
  const titleResizeObserver = typeof ResizeObserverCtor === 'function'
    ? new ResizeObserverCtor(() => scheduleTitleMarquees())
    : null
  for (const viewport of titleViewports) titleResizeObserver?.observe?.(viewport)

  function dispatchAction(event, root) {
    const button = event.target?.closest?.('[data-mc-action]')
    if (!button || !root.contains?.(button)) return
    const action = button.dataset.mcAction
    if (action === 'focus-add') {
      query('#mc-url-input')?.focus?.()
      return
    }
    dispatch({ type: action, id: button.dataset.mcId || null, view: button.dataset.mcView || null })
  }

  const onOverlayClick = event => dispatchAction(event, overlayRoot)
  const onMiniClick = event => dispatchAction(event, miniRoot)
  overlayRoot.addEventListener('click', onOverlayClick)
  miniRoot.addEventListener('click', onMiniClick)

  const form = query('#mc-url-form')
  const onSubmit = event => {
    event.preventDefault()
    const input = query('#mc-url-input')
    const value = input?.value?.trim() || ''
    if (value) dispatch({ type: 'ADD_URL', value })
  }
  form?.addEventListener('submit', onSubmit)

  const onRange = event => {
    if (event.target?.id === 'mc-progress') dispatch({ type: 'seek', value: Number(event.target.value) })
    if (event.target?.id === 'mc-volume') dispatch({ type: 'volume', value: Number(event.target.value) / 100 })
  }
  overlayRoot.addEventListener('input', onRange)

  let draggedQueueIndex = null
  const onDragStart = event => {
    const item = event.target?.closest?.('[data-mc-queue-index]')
    if (!item) return
    draggedQueueIndex = Number(item.dataset.mcQueueIndex)
    event.dataTransfer?.setData?.('text/plain', String(draggedQueueIndex))
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
  }
  const onDragOver = event => {
    if (event.target?.closest?.('[data-mc-queue-index]')) event.preventDefault()
  }
  const onDrop = event => {
    const item = event.target?.closest?.('[data-mc-queue-index]')
    if (!item) return
    event.preventDefault()
    const from = Number.isInteger(draggedQueueIndex) ? draggedQueueIndex : Number(event.dataTransfer?.getData?.('text/plain'))
    const to = Number(item.dataset.mcQueueIndex)
    if (Number.isInteger(from) && Number.isInteger(to)) dispatch({ type: 'queue-reorder', from, to })
    draggedQueueIndex = null
  }
  overlayRoot.addEventListener('dragstart', onDragStart)
  overlayRoot.addEventListener('dragover', onDragOver)
  overlayRoot.addEventListener('drop', onDrop)

  const onKeydown = event => {
    if (overlayRoot.hidden || overlayRoot.classList?.contains?.('is-minimized')) return
    const target = event.target
    const tag = target?.tagName?.toLowerCase?.()
    if (['input', 'textarea', 'select'].includes(tag) || target?.isContentEditable) return
    if (event.key === 'Escape') dispatch({ type: 'minimize' })
    else if (event.key === ' ' || event.code === 'Space') { event.preventDefault(); dispatch({ type: 'play-pause' }) }
    else if (event.key?.toLowerCase() === 'm') dispatch({ type: 'mute-toggle' })
    else if (event.key === 'ArrowRight') dispatch({ type: 'seek-relative', value: 10 })
    else if (event.key === 'ArrowLeft') dispatch({ type: 'seek-relative', value: -10 })
  }
  documentRef?.addEventListener?.('keydown', onKeydown)

  function setText(selector, text, mini = false) {
    const element = mini ? miniQuery(selector) : query(selector)
    if (element) element.textContent = text
  }

  function renderPlayer(state) {
    playerState = state
    const model = createPlayerPresentation(state)
    setText('#mc-now-title', model.title)
    setText('#mc-now-author', model.author)
    setText('#mc-now-provider', model.provider)
    setText('#mc-transport-title', model.title)
    setText('#mc-transport-author', model.author || model.provider)
    setText('#mc-position', model.positionText)
    setText('#mc-duration', model.durationText)
    setText('#mc-mini-title', model.title, true)
    setText('#mc-mini-author', model.author || model.provider, true)
    scheduleTitleMarquees()

    const artwork = query('#mc-artwork')
    const placeholder = query('#mc-art-placeholder')
    if (artwork && placeholder) {
      if (model.artworkUrl) {
        artwork.src = model.artworkUrl
        artwork.hidden = false
        placeholder.hidden = true
      } else {
        artwork.hidden = true
        artwork.removeAttribute?.('src')
        placeholder.hidden = false
      }
    }

    const transportArt = query('#mc-transport-art')
    const miniArt = miniQuery('#mc-mini-art')
    for (const node of [transportArt, miniArt]) {
      if (!node) continue
      node.innerHTML = model.artworkUrl ? `<img src="${escapeHtml(model.artworkUrl)}" alt="">` : '♫'
    }

    const playButtons = [query('#mc-play-btn'), miniQuery('#mc-mini-play')].filter(Boolean)
    for (const button of playButtons) {
      button.disabled = model.playDisabled
      button.textContent = model.playing ? '❚❚' : '▶'
      button.setAttribute('aria-label', model.playing ? 'Pause' : 'Play')
    }
    const prev = query('#mc-prev-btn')
    const next = query('#mc-next-btn')
    if (prev) prev.disabled = model.previousDisabled
    if (next) next.disabled = model.nextDisabled

    const progress = query('#mc-progress')
    if (progress) {
      progress.disabled = model.seekDisabled
      progress.max = model.duration || 100
      progress.value = model.duration ? model.position : 0
      progress.style.setProperty('--mc-progress', `${model.progressPercent}%`)
    }
    const miniProgress = miniQuery('#mc-mini-progress-fill')
    if (miniProgress) miniProgress.style.width = `${model.progressPercent}%`

    const volume = query('#mc-volume')
    if (volume) {
      volume.disabled = model.volumeDisabled
      volume.value = model.volumePercent
    }

    const original = query('#mc-open-original')
    if (original) {
      original.hidden = !model.externalOnly
      if (model.externalOnly) original.href = model.originalUrl
    }

    const fav = query('#mc-favorite-btn')
    if (fav) {
      fav.disabled = !model.item
      fav.textContent = state?.favorite ? '♥ Favorite' : '♡ Favorite'
    }
    miniRoot.hidden = !(state?.minimized && model.item)
    overlayRoot.classList?.toggle?.('has-error', Boolean(model.error))
  }

  function renderLibrary(model = {}) {
    libraryModel = { ...libraryModel, ...model }
    const favorites = new Set(libraryModel.favorites || [])
    const tracks = selectTracksForView(activeView, libraryModel)
    const grid = query('#mc-library-grid')
    if (grid) {
      grid.innerHTML = tracks.length
        ? tracks.map(track => renderTrackCard(track, favorites)).join('')
        : `<div class="mc-empty-state"><span>♫</span><strong>No ${escapeHtml(VIEW_LABELS[activeView] || 'music')} items yet</strong><p>Add a streaming link or choose another section.</p></div>`
    }
    setText('#mc-library-count', `${tracks.length} ${tracks.length === 1 ? 'item' : 'items'}`)

    const playlists = query('#mc-playlists')
    if (playlists) playlists.innerHTML = (libraryModel.playlists || []).length
      ? libraryModel.playlists.map(list => `<button type="button" class="mc-playlist-item" data-mc-action="playlist-open" data-mc-id="${escapeHtml(list.id)}"><span>♪</span><span>${escapeHtml(list.name)}</span></button>`).join('')
      : '<p class="mc-empty-small">No local playlists yet.</p>'

    const queue = query('#mc-queue-list')
    if (queue) queue.innerHTML = (libraryModel.queue || []).length
      ? renderQueueMarkup(libraryModel)
      : '<p class="mc-empty-small">Queue is empty.</p>'
    const shuffleButton = query('#mc-shuffle-btn')
    const repeatButton = query('#mc-repeat-btn')
    if (shuffleButton) shuffleButton.classList.toggle('is-active', Boolean(libraryModel.queueState?.shuffle))
    if (repeatButton) {
      const mode = libraryModel.queueState?.repeatMode || 'off'
      repeatButton.classList.toggle('is-active', mode !== 'off')
      repeatButton.textContent = mode === 'one' ? '↻ Repeat One' : mode === 'all' ? '↻ Repeat All' : '↻ Repeat'
    }
  }

  function setActiveView(view) {
    if (!VIEW_LABELS[view]) return
    activeView = view
    for (const button of overlayRoot.querySelectorAll?.('[data-mc-view]') || []) {
      button.classList?.toggle?.('is-active', button.dataset.mcView === view)
    }
    setText('#mc-view-title', VIEW_LABELS[view])
    setText('#mc-view-kicker', view === 'home' ? 'Your music' : 'Collection')
    renderLibrary(libraryModel)
  }

  function showNotice(message, tone = 'info') {
    const notice = query('#mc-notice')
    if (!notice) return
    const text = String(message || '').trim()
    notice.textContent = text
    notice.dataset.tone = tone
    notice.hidden = !text
  }

  function setQueueOpen(open) {
    overlayRoot.classList?.toggle?.('mc-queue-open', Boolean(open))
  }

  function show() {
    overlayRoot.hidden = false
    overlayRoot.classList?.remove?.('is-minimized')
    overlayRoot.removeAttribute?.('aria-hidden')
    miniRoot.hidden = true
    documentRef?.body?.classList?.add('mc-page-open')
    shell?.focus?.({ preventScroll: true })
  }

  function minimize() {
    // Keep the provider iframe laid out so provider APIs can continue playback.
    overlayRoot.hidden = false
    overlayRoot.classList?.add?.('is-minimized')
    overlayRoot.setAttribute?.('aria-hidden', 'true')
    documentRef?.body?.classList?.remove('mc-page-open')
    miniRoot.hidden = !playerState?.currentItem
    scheduleTitleMarquees()
  }

  return {
    renderPlayer,
    renderLibrary,
    setActiveView,
    showNotice,
    setQueueOpen,
    show,
    minimize,
    destroy() {
      titleResizeObserver?.disconnect?.()
      overlayRoot.removeEventListener('click', onOverlayClick)
      miniRoot.removeEventListener('click', onMiniClick)
      overlayRoot.removeEventListener('input', onRange)
      overlayRoot.removeEventListener('dragstart', onDragStart)
      overlayRoot.removeEventListener('dragover', onDragOver)
      overlayRoot.removeEventListener('drop', onDrop)
      form?.removeEventListener('submit', onSubmit)
      documentRef?.removeEventListener?.('keydown', onKeydown)
      overlayRoot.replaceChildren?.()
      miniRoot.replaceChildren?.()
      documentRef?.body?.classList?.remove('mc-page-open')
    }
  }
}

export { formatTime }
