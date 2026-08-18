(() => {
  "use strict";

  /*
   * Stable Android Simulator enhancer
   * Replaces the previous enhancer that could create recursive MutationObserver
   * updates and eventually freeze Chromium.
   *
   * Baseline: 3695b75b5ecbd94a9e5adb49ffb41e9183488ca5
   */

  if (window.__waifuAndroidEnhancerMediaV7) return;
  window.__waifuAndroidEnhancerMediaV7 = true;

  const phone = document.getElementById("pixelScreen");
  const root = document.getElementById("androidScreenRoot");
  const dialog = document.getElementById("phoneSimDialog");

  if (!phone || !root) return;

  const STORAGE_KEY = "waifuAndroidEnhancerStableV2";

  const defaults = {
    stopwatch: {
      running: false,
      startedAt: 0,
      elapsedMs: 0,
      laps: []
    },
    media: {
      app: "",
      url: "",
      embed: "",
      title: "",
      subtitle: "",
      artwork: "",
      startedAt: 0,
      playing: false
    },
    browser: {
      current: "https://www.google.com/webhp?igu=1",
      history: ["https://www.google.com/webhp?igu=1"],
      index: 0
    },
    islandExpanded: false
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadState() {
    const base = clone(defaults);

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

      return {
        ...base,
        ...saved,
        stopwatch: {
          ...base.stopwatch,
          ...(saved.stopwatch || {})
        },
        media: {
          ...base.media,
          ...(saved.media || {}),
          // An iframe player does not automatically resume after a real reload.
          playing: false
        },
        browser: {
          ...base.browser,
          ...(saved.browser || {})
        }
      };
    } catch {
      return base;
    }
  }

  const state = loadState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  function esc(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function vibrate(pattern = 7) {
    try {
      navigator.vibrate?.(pattern);
    } catch {}
  }

  function currentStopwatchMs() {
    if (!state.stopwatch.running) {
      return Math.max(0, Number(state.stopwatch.elapsedMs) || 0);
    }

    return Math.max(
      0,
      (Number(state.stopwatch.elapsedMs) || 0) +
      (Date.now() - Number(state.stopwatch.startedAt || Date.now()))
    );
  }

  function formatStopwatch(ms, compact = false) {
    const value = Math.max(0, Math.floor(ms));
    const hours = Math.floor(value / 3600000);
    const minutes = Math.floor((value % 3600000) / 60000);
    const seconds = Math.floor((value % 60000) / 1000);
    const centiseconds = Math.floor((value % 1000) / 10);

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    if (compact) {
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
  }

  function mediaMeta(appId) {
    const map = {
      spotify: {
        label: "Spotify",
        icon: "◉",
        className: "spotify"
      },
      youtube: {
        label: "YouTube",
        icon: "▶",
        className: "youtube"
      },
      "youtube-music": {
        label: "YouTube Music",
        icon: "♫",
        className: "youtube-music"
      }
    };

    return map[appId] || {
      label: "Media",
      icon: "♪",
      className: "media"
    };
  }

  function mediaArtworkFallback(appId) {
    if (appId === "spotify") {
      return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
          <rect width="160" height="160" rx="34" fill="#1ed760"/>
          <circle cx="80" cy="80" r="58" fill="#0b0b0d"/>
          <path d="M42 64c28-8 61-5 83 8" fill="none" stroke="#1ed760" stroke-width="10" stroke-linecap="round"/>
          <path d="M46 84c25-7 52-3 73 7" fill="none" stroke="#1ed760" stroke-width="9" stroke-linecap="round"/>
          <path d="M51 103c19-5 40-2 58 6" fill="none" stroke="#1ed760" stroke-width="8" stroke-linecap="round"/>
        </svg>`
      );
    }

    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="34" fill="#ff0033"/>
        <rect x="31" y="49" width="98" height="62" rx="23" fill="#fff"/>
        <path d="M70 64l34 16-34 16z" fill="#ff0033"/>
      </svg>`
    );
  }

  function youtubeInfoFromRaw(raw) {
    const value = String(raw || "").trim();
    if (!value) return null;

    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      const host = url.hostname.replace(/^www\./, "").toLowerCase();
      let video = "";
      let list = url.searchParams.get("list") || "";

      if (host === "youtu.be") {
        video = url.pathname.split("/").filter(Boolean)[0] || "";
      } else if (host.endsWith("youtube.com")) {
        if (url.pathname === "/watch") {
          video = url.searchParams.get("v") || "";
        } else {
          const parts = url.pathname.split("/").filter(Boolean);
          if (["shorts", "live", "embed"].includes(parts[0])) {
            video = parts[1] || "";
          }
          if (parts[0] === "playlist") {
            list = url.searchParams.get("list") || list;
          }
        }
      }

      if (!video && !list) return null;

      return {
        video,
        list,
        artwork: video ? `https://i.ytimg.com/vi/${encodeURIComponent(video)}/hqdefault.jpg` : ""
      };
    } catch {
      return null;
    }
  }

  function youtubeEmbedFromRaw(raw) {
    const info = youtubeInfoFromRaw(raw);
    if (!info) return "";

    const origin = location.origin && location.origin !== "null"
      ? location.origin
      : "https://skenakun.github.io";

    const params = new URLSearchParams({
      playsinline: "1",
      rel: "0",
      autoplay: "1",
      controls: "1",
      enablejsapi: "1",
      origin,
      widget_referrer: location.href
    });

    if (info.list) params.set("list", info.list);

    if (!info.video && info.list) {
      return `https://www.youtube.com/embed/videoseries?${params.toString()}`;
    }

    return `https://www.youtube.com/embed/${encodeURIComponent(info.video)}?${params.toString()}`;
  }

  function spotifyEmbedFromRaw(raw) {
    const value = String(raw || "").trim();
    if (!value) return "";

    let type = "";
    let id = "";

    const uri = value.match(/^spotify:(track|album|playlist|artist|episode|show):([A-Za-z0-9]+)$/i);

    if (uri) {
      type = uri[1].toLowerCase();
      id = uri[2];
    } else {
      try {
        const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
        if (!url.hostname.toLowerCase().endsWith("spotify.com")) return "";

        const parts = url.pathname.split("/").filter(Boolean);
        const typeIndex = parts.findIndex(part =>
          ["track", "album", "playlist", "artist", "episode", "show"].includes(part)
        );

        if (typeIndex >= 0) {
          type = parts[typeIndex];
          id = parts[typeIndex + 1] || "";
        }
      } catch {
        return "";
      }
    }

    if (!type || !id) return "";
    return `https://open.spotify.com/embed/${encodeURIComponent(type)}/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
  }

  function mediaEmbedFromRaw(appId, raw) {
    return appId === "spotify"
      ? spotifyEmbedFromRaw(raw)
      : youtubeEmbedFromRaw(raw);
  }

  /* =========================================================
     SCREEN RECORD INDICATOR
     ========================================================= */

  function hideRecorderPillOnce() {
    const pill = document.getElementById("androidRecordPill");
    if (!pill) return;

    // One write only. No attribute observer is used.
    pill.hidden = true;
    pill.setAttribute("aria-hidden", "true");
  }

  /* =========================================================
     DYNAMIC ISLAND
     ========================================================= */

  function ensureIsland() {
    let island = document.getElementById("androidDynamicIsland");

    if (!island) {
      island = document.createElement("div");
      island.id = "androidDynamicIsland";
      island.className = "android-dynamic-island island-idle";
      island.setAttribute("aria-live", "polite");
      phone.appendChild(island);
    }

    return island;
  }

  function islandMarkupKey() {
    return JSON.stringify({
      sw: state.stopwatch.running,
      media: state.media.playing,
      app: state.media.app,
      expanded: state.islandExpanded
    });
  }

  function renderIsland(force = false) {
    const island = ensureIsland();
    const key = islandMarkupKey();

    if (!force && island.dataset.renderKey === key) return;
    island.dataset.renderKey = key;

    const stopwatchActive = state.stopwatch.running;
    const mediaActive = state.media.playing;

    if (!stopwatchActive && !mediaActive) {
      island.className = "android-dynamic-island island-idle";
      island.innerHTML = "";
      return;
    }

    const expanded = state.islandExpanded;

    if (stopwatchActive) {
      const media = mediaActive ? mediaMeta(state.media.app) : null;

      island.className = `android-dynamic-island has-activity activity-stopwatch ${expanded ? "expanded" : ""}`;
      island.innerHTML = `
        <button class="island-main" type="button" data-stable-action="toggle-island">
          <span class="island-activity-icon stopwatch">◷</span>
          <span class="island-activity-copy">
            <strong>Stopwatch</strong>
            <small id="stableIslandStopwatch">${formatStopwatch(currentStopwatchMs(), true)}</small>
          </span>
          ${media ? `<span class="island-secondary ${media.className}">${media.icon}</span>` : ""}
        </button>
        ${expanded ? `
          <div class="island-expanded-panel">
            <button type="button" data-stable-action="stopwatch-pause">Jeda</button>
            <button type="button" data-stable-action="stopwatch-lap">Lap</button>
            <button type="button" data-stable-action="open-clock">Jam</button>
          </div>
        ` : ""}
      `;
      return;
    }

    const meta = mediaMeta(state.media.app);
    const title = state.media.title || meta.label;
    const subtitle = state.media.subtitle || "Sedang diputar";
    const artwork = state.media.artwork || mediaArtworkFallback(state.media.app);

    island.className = `android-dynamic-island has-activity activity-media ${expanded ? "expanded" : ""}`;
    island.innerHTML = `
      <button class="island-main" type="button" data-stable-action="toggle-island">
        <span class="island-media-art"><img src="${esc(artwork)}" alt=""></span>
        <span class="island-activity-copy">
          <strong>${esc(title)}</strong>
          <small>${esc(subtitle)}</small>
        </span>
        <span class="island-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      </button>
      ${expanded ? `
        <div class="island-media-player">
          <div class="island-media-now">
            <img src="${esc(artwork)}" alt="">
            <span>
              <strong>${esc(title)}</strong>
              <small>${esc(meta.label)}</small>
            </span>
            <span class="island-big-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
          </div>
          <div class="island-media-progress"><span id="stableIslandMediaProgress"></span></div>
          <div class="island-media-actions">
            <button type="button" data-stable-action="open-media">Buka aplikasi</button>
            <button type="button" class="danger" data-stable-action="media-dismiss">Hentikan</button>
          </div>
        </div>
      ` : ""}
    `;
    updateIslandMediaProgress();
  }

  function updateIslandTime() {
    if (!state.stopwatch.running) return;

    const el = document.getElementById("stableIslandStopwatch");
    if (el) el.textContent = formatStopwatch(currentStopwatchMs(), true);
  }

  function updateIslandMediaProgress() {
    if (!state.media.playing) return;

    const progress = document.getElementById("stableIslandMediaProgress");
    if (!progress) return;

    const startedAt = Number(state.media.startedAt || Date.now());
    const elapsed = Math.max(0, Date.now() - startedAt);
    const cycle = 180000;
    const pct = Math.max(3, Math.min(96, ((elapsed % cycle) / cycle) * 100));
    progress.style.width = `${pct}%`;
  }


  /* =========================================================
     STOPWATCH
     ========================================================= */

  function syncStopwatchUi() {
    const display = root.querySelector("#stableStopwatchDisplay");

    if (display) {
      display.textContent = formatStopwatch(currentStopwatchMs());
    }

    const startPause = root.querySelector("[data-stable-stopwatch-main]");

    if (startPause) {
      startPause.dataset.stableAction = state.stopwatch.running
        ? "stopwatch-pause"
        : "stopwatch-start";

      startPause.textContent = state.stopwatch.running
        ? "Jeda"
        : (currentStopwatchMs() > 0 ? "Lanjut" : "Mulai");
    }

    const lapButton = root.querySelector('[data-stable-action="stopwatch-lap"]');
    if (lapButton) lapButton.disabled = !state.stopwatch.running;

    const laps = root.querySelector("#stableStopwatchLaps");

    if (laps) {
      laps.innerHTML = state.stopwatch.laps.length
        ? state.stopwatch.laps.map((lap, index) => `
            <div>
              <span>Lap ${state.stopwatch.laps.length - index}</span>
              <strong>${formatStopwatch(lap)}</strong>
            </div>
          `).join("")
        : `<p>Belum ada lap.</p>`;
    }
  }

  function injectStopwatch() {
    const clock = root.querySelector("#appClockLive");
    const content = root.querySelector(".sim-app-content");

    if (!clock || !content) return;
    if (content.querySelector(".enhancer-stopwatch")) {
      syncStopwatchUi();
      return;
    }

    const section = document.createElement("section");
    section.className = "enhancer-stopwatch";
    section.innerHTML = `
      <div class="enhancer-clock-tabs">
        <span>Jam</span>
        <strong>Stopwatch</strong>
      </div>

      <div class="stopwatch-display" id="stableStopwatchDisplay">
        ${formatStopwatch(currentStopwatchMs())}
      </div>

      <div class="stopwatch-actions">
        <button class="secondary" type="button" data-stable-action="stopwatch-reset">Reset</button>

        <button
          class="primary"
          type="button"
          data-stable-stopwatch-main
          data-stable-action="${state.stopwatch.running ? "stopwatch-pause" : "stopwatch-start"}">
          ${state.stopwatch.running ? "Jeda" : (currentStopwatchMs() > 0 ? "Lanjut" : "Mulai")}
        </button>

        <button
          class="secondary"
          type="button"
          data-stable-action="stopwatch-lap"
          ${state.stopwatch.running ? "" : "disabled"}>
          Lap
        </button>
      </div>

      <div class="stopwatch-laps" id="stableStopwatchLaps"></div>
    `;

    content.appendChild(section);
    syncStopwatchUi();
  }

  function startStopwatch() {
    if (state.stopwatch.running) return;

    state.stopwatch.running = true;
    state.stopwatch.startedAt = Date.now();
    saveState();
    vibrate();
    syncStopwatchUi();
    renderIsland(true);
  }

  function pauseStopwatch() {
    if (!state.stopwatch.running) return;

    state.stopwatch.elapsedMs = currentStopwatchMs();
    state.stopwatch.startedAt = 0;
    state.stopwatch.running = false;
    saveState();
    vibrate();
    syncStopwatchUi();
    renderIsland(true);
  }

  function resetStopwatch() {
    state.stopwatch.running = false;
    state.stopwatch.startedAt = 0;
    state.stopwatch.elapsedMs = 0;
    state.stopwatch.laps = [];
    saveState();
    vibrate();
    syncStopwatchUi();
    renderIsland(true);
  }

  function addLap() {
    if (!state.stopwatch.running) return;

    state.stopwatch.laps.unshift(currentStopwatchMs());
    state.stopwatch.laps = state.stopwatch.laps.slice(0, 20);
    saveState();
    vibrate(5);
    syncStopwatchUi();
  }

  /* =========================================================
     MEDIA ACTIVITY
     Persistent Spotify / YouTube / YouTube Music player
     ========================================================= */

  let pendingMediaStart = null;

  function ensurePersistentMediaHost() {
    let host = document.getElementById("androidPersistentMediaHost");

    if (!host) {
      host = document.createElement("div");
      host.id = "androidPersistentMediaHost";
      host.className = "android-persistent-media-host is-parked";
      host.setAttribute("aria-label", "Pemutar media latar belakang");
      phone.appendChild(host);
    }

    return host;
  }

  function persistentMediaFrame() {
    return ensurePersistentMediaHost().querySelector("iframe");
  }

  function stopPersistentMedia() {
    const host = ensurePersistentMediaHost();
    host.replaceChildren();
    host.classList.add("is-parked");
    host.classList.remove("is-visible");
    host.removeAttribute("data-media-app");
    host.removeAttribute("data-media-src");
    phone.removeAttribute("data-persistent-media-active");
  }

  function parkPersistentMedia() {
    const host = ensurePersistentMediaHost();

    if (!host.querySelector("iframe")) return;

    host.classList.add("is-parked");
    host.classList.remove("is-visible");
    host.style.removeProperty("--media-left");
    host.style.removeProperty("--media-top");
    host.style.removeProperty("--media-width");
    host.style.removeProperty("--media-height");
  }

  function mediaShellForApp(appId) {
    if (appId === "spotify") {
      return root.querySelector("#spotifyEmbedShell");
    }

    if (appId === "youtube" || appId === "youtube-music") {
      return root.querySelector("#youtubeEmbedShell");
    }

    return null;
  }

  function appIdFromCurrentMediaView() {
    if (root.querySelector(".spotify-live-app")) return "spotify";

    const youtube = root.querySelector(".youtube-live-app");
    if (youtube) {
      return youtube.classList.contains("music")
        ? "youtube-music"
        : "youtube";
    }

    return "";
  }

  function inputValueForMedia(appId) {
    if (appId === "spotify") {
      return root.querySelector("#spotifyUrlInput")?.value || state.media.url || "";
    }

    return root.querySelector("#youtubeUrlInput")?.value || state.media.url || "";
  }

  function ensureMediaPlaceholder(shell, appId) {
    if (!shell) return;

    shell.querySelector("iframe")?.remove();

    if (shell.querySelector(".persistent-media-slot")) return;

    const placeholder = document.createElement("div");
    placeholder.className = "persistent-media-slot";
    placeholder.innerHTML = `
      <span>♪</span>
      <strong>${esc(mediaMeta(appId).label)}</strong>
      <small>Player aktif di latar belakang. Beranda, aplikasi lain, dan Quick Settings tidak akan mengulang media.</small>
    `;
    shell.appendChild(placeholder);
  }

  function createPersistentFrameFromEmbed(embed, appId) {
    const host = ensurePersistentMediaHost();
    const source = String(embed || "").trim();
    if (!source) return null;

    const current = host.querySelector("iframe");
    if (
      current &&
      host.dataset.mediaApp === appId &&
      host.dataset.mediaSrc === source
    ) {
      return current;
    }

    host.replaceChildren();

    const frame = document.createElement("iframe");
    frame.src = source;
    frame.title = `${mediaMeta(appId).label} player`;
    frame.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    frame.referrerPolicy = "origin-when-cross-origin";
    frame.loading = "eager";
    frame.setAttribute("allowfullscreen", "");

    host.dataset.mediaApp = appId;
    host.dataset.mediaSrc = source;
    host.appendChild(frame);
    phone.dataset.persistentMediaActive = "1";

    return frame;
  }

  function startPersistentMedia(appId, rawUrl, options = {}) {
    const raw = String(rawUrl || "").trim();
    const embed = String(options.embed || mediaEmbedFromRaw(appId, raw) || "").trim();
    if (!embed) return false;

    const sameMedia =
      state.media.playing &&
      state.media.app === appId &&
      state.media.embed === embed &&
      !!persistentMediaFrame();

    if (!sameMedia) {
      createPersistentFrameFromEmbed(embed, appId);
      state.media.startedAt = Date.now();
    }

    const info = appId === "spotify" ? null : youtubeInfoFromRaw(raw);
    const meta = mediaMeta(appId);

    state.media.app = appId;
    state.media.url = raw;
    state.media.embed = embed;
    state.media.title = String(options.title || meta.label);
    state.media.subtitle = String(options.subtitle || "Sedang diputar");
    state.media.artwork = String(options.artwork || info?.artwork || mediaArtworkFallback(appId));
    state.media.playing = true;
    state.islandExpanded = false;

    saveState();

    const shell = mediaShellForApp(appId);
    if (shell && !root.querySelector(".quick-shade")) {
      ensureMediaPlaceholder(shell, appId);
      positionPersistentMedia(shell);
    } else {
      parkPersistentMedia();
    }

    renderIsland(true);
    syncMediaNotification();
    return true;
  }

  function createPersistentFrameFrom(sourceFrame, appId) {
    const host = ensurePersistentMediaHost();
    const source = String(sourceFrame?.src || sourceFrame?.getAttribute("src") || "").trim();

    if (!source || source === "about:blank") return null;

    const current = host.querySelector("iframe");

    if (
      current &&
      host.dataset.mediaApp === appId &&
      host.dataset.mediaSrc === source
    ) {
      return current;
    }

    host.replaceChildren();

    const frame = document.createElement("iframe");
    frame.src = source;
    frame.title = sourceFrame?.title || `${mediaMeta(appId).label} player`;
    frame.allow = sourceFrame?.getAttribute("allow")
      || "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    frame.referrerPolicy = sourceFrame?.referrerPolicy || "origin-when-cross-origin";
    frame.loading = "eager";
    frame.setAttribute("allowfullscreen", "");

    host.dataset.mediaApp = appId;
    host.dataset.mediaSrc = source;
    host.appendChild(frame);
    phone.dataset.persistentMediaActive = "1";

    return frame;
  }

  function positionPersistentMedia(shell) {
    const host = ensurePersistentMediaHost();

    if (root.querySelector(".quick-shade")) {
      parkPersistentMedia();
      return;
    }

    if (!host.querySelector("iframe") || !shell) {
      parkPersistentMedia();
      return;
    }

    const phoneRect = phone.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();

    if (
      shellRect.width < 30 ||
      shellRect.height < 30 ||
      shellRect.bottom <= phoneRect.top ||
      shellRect.top >= phoneRect.bottom
    ) {
      parkPersistentMedia();
      return;
    }

    const left = shellRect.left - phoneRect.left;
    const top = shellRect.top - phoneRect.top;

    host.style.setProperty("--media-left", `${left}px`);
    host.style.setProperty("--media-top", `${top}px`);
    host.style.setProperty("--media-width", `${shellRect.width}px`);
    host.style.setProperty("--media-height", `${shellRect.height}px`);

    host.classList.remove("is-parked");
    host.classList.add("is-visible");
  }

  function replaceCoreFrameWithPersistent(shell, appId) {
    if (!shell) return;

    const frame = shell.querySelector("iframe");
    const host = ensurePersistentMediaHost();
    const existing = host.querySelector("iframe");

    if (!frame) {
      if (existing && host.dataset.mediaApp === appId) {
        positionPersistentMedia(shell);
      }
      return;
    }

    const source = String(frame.src || frame.getAttribute("src") || "").trim();
    const shouldStart =
      !!pendingMediaStart &&
      pendingMediaStart.app === appId &&
      Date.now() <= pendingMediaStart.expiresAt;

    if (!state.media.playing && !shouldStart) {
      // A stored URL may render an iframe when the app is merely opened.
      // Do not claim playback until the user pressed Putar.
      return;
    }

    const persistent = createPersistentFrameFrom(frame, appId);
    if (!persistent) return;

    // Remove the duplicate core iframe so only one official player exists.
    frame.remove();

    ensureMediaPlaceholder(shell, appId);

    const url = pendingMediaStart?.url || inputValueForMedia(appId);

    state.media.app = appId;
    state.media.url = String(url || "");
    state.media.embed = host.dataset.mediaSrc || source;
    state.media.title = mediaMeta(appId).label;
    state.media.subtitle = "Sedang diputar";
    state.media.artwork = appId === "spotify"
      ? mediaArtworkFallback(appId)
      : (youtubeInfoFromRaw(url)?.artwork || mediaArtworkFallback(appId));
    state.media.startedAt = Date.now();
    state.media.playing = true;
    state.islandExpanded = false;

    pendingMediaStart = null;
    saveState();

    positionPersistentMedia(shell);
    renderIsland(true);
    syncMediaNotification();
  }

  function syncPersistentMediaFromCurrentView() {
    const appId = appIdFromCurrentMediaView();

    if (!appId) {
      parkPersistentMedia();
      return;
    }

    const shell = mediaShellForApp(appId);
    if (!shell) {
      parkPersistentMedia();
      return;
    }

    // If playback was already running, keep the same persistent iframe and
    // suppress the newly rendered duplicate iframe.
    if (
      state.media.playing &&
      state.media.app === appId &&
      persistentMediaFrame()
    ) {
      const duplicate = shell.querySelector("iframe");
      if (duplicate) duplicate.remove();

      ensureMediaPlaceholder(shell, appId);
      positionPersistentMedia(shell);
      return;
    }

    replaceCoreFrameWithPersistent(shell, appId);
  }

  function markMediaPending(appId, url = "") {
    pendingMediaStart = {
      app: appId,
      url: String(url || ""),
      expiresAt: Date.now() + 5000
    };

    // Core Android rerenders synchronously after Putar. The observer normally
    // catches it, but two queued passes make this resilient on slower phones.
    setTimeout(() => {
      syncPersistentMediaFromCurrentView();
      renderIsland(true);
      syncMediaNotification();
    }, 0);

    setTimeout(() => {
      syncPersistentMediaFromCurrentView();
      renderIsland(true);
      syncMediaNotification();
    }, 120);
  }

  function markMediaPlaying(appId, url = "", embed = "") {
    state.media.app = appId;
    state.media.url = String(url || "");
    state.media.embed = String(embed || state.media.embed || "");
    state.media.title = mediaMeta(appId).label;
    state.media.subtitle = "Sedang diputar";
    state.media.artwork = appId === "spotify"
      ? mediaArtworkFallback(appId)
      : (youtubeInfoFromRaw(url)?.artwork || mediaArtworkFallback(appId));
    state.media.startedAt = state.media.startedAt || Date.now();
    state.media.playing = true;
    state.islandExpanded = false;

    saveState();
    renderIsland(true);
    syncMediaNotification();
  }

  function dismissMedia() {
    state.media.playing = false;
    state.media.embed = "";
    state.media.title = "";
    state.media.subtitle = "";
    state.media.artwork = "";
    state.media.startedAt = 0;
    state.islandExpanded = false;
    pendingMediaStart = null;

    stopPersistentMedia();
    saveState();
    renderIsland(true);
    syncMediaNotification();
  }

  function createMediaNotification() {
    const meta = mediaMeta(state.media.app);
    const card = document.createElement("button");

    card.type = "button";
    card.className = "axion-notification-card enhancer-media-notification";
    card.dataset.stableAction = "open-media";
    card.dataset.mediaApp = state.media.app;

    card.innerHTML = `
      <span class="axion-notification-icon enhancer-${meta.className}">${meta.icon}</span>
      <span>
        <strong>${esc(state.media.title || meta.label)}</strong>
        <small>${esc(meta.label)} • tetap aktif di latar belakang</small>
        <span class="enhancer-notification-wave" aria-hidden="true">
          <i></i><i></i><i></i><i></i>
        </span>
      </span>
      <em>sekarang</em>
    `;

    return card;
  }

  function ensureNotificationList(container) {
    if (!container) return null;

    let list = container.querySelector(".axion-notification-list");
    if (list) return list;

    // In Separate QS mode the notification page can be empty. Create the list
    // there. In combined Quick Settings, only inject when the core list exists.
    if (!container.classList.contains("axion-notification-shade")) return null;

    list = document.createElement("div");
    list.className = "axion-notification-list";

    container.querySelector(".axion-notification-empty")?.remove();

    const footer = container.querySelector(".axion-notif-footer");
    if (footer) container.insertBefore(list, footer);
    else container.appendChild(list);

    return list;
  }

  function syncMediaNotification() {
    const containers = [
      root.querySelector(".axion-notification-shade"),
      root.querySelector(".axion-separate-qs")
    ].filter(Boolean);

    if (!containers.length) return;

    containers.forEach(container => {
      const existing = container.querySelector(".enhancer-media-notification");

      if (!state.media.playing) {
        existing?.remove();
        return;
      }

      if (existing?.dataset.mediaApp === state.media.app) return;

      existing?.remove();

      const list = ensureNotificationList(container);
      if (!list) return;

      list.prepend(createMediaNotification());
    });
  }

  /* =========================================================
     IN-SIMULATOR BROWSER
     Mobile virtual viewport
     ========================================================= */

  const MOBILE_BROWSER_WIDTH = 412;
  let browserResizeTimer = 0;

  function googleHomeUrl() {
    return "https://www.google.com/webhp?igu=1&hl=id&gl=id";
  }

  function normalizeUrl(raw, searchText = true) {
    const value = String(raw || "").trim();

    if (!value) return googleHomeUrl();

    const isProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(value);

    if (searchText && !isProtocol && !value.includes(".")) {
      return `https://www.google.com/search?igu=1&hl=id&gl=id&q=${encodeURIComponent(value)}`;
    }

    try {
      const url = new URL(isProtocol ? value : `https://${value}`);

      if (!["http:", "https:"].includes(url.protocol)) {
        return googleHomeUrl();
      }

      if (url.hostname === "google.com" || url.hostname === "www.google.com") {
        if (!url.searchParams.has("igu")) url.searchParams.set("igu", "1");
        if (!url.searchParams.has("hl")) url.searchParams.set("hl", "id");
        if (!url.searchParams.has("gl")) url.searchParams.set("gl", "id");
      }

      return url.toString();
    } catch {
      return `https://www.google.com/search?igu=1&hl=id&gl=id&q=${encodeURIComponent(value)}`;
    }
  }

  function displayUrl(url) {
    try {
      const parsed = new URL(url);

      if (parsed.hostname.endsWith("google.com")) {
        parsed.searchParams.delete("igu");
        parsed.searchParams.delete("hl");
        parsed.searchParams.delete("gl");
      }

      return parsed.toString();
    } catch {
      return url;
    }
  }

  function fitBrowserMobileViewport() {
    const wrap = root.querySelector(".sim-browser-frame-wrap");
    const frame = root.querySelector("#stableBrowserFrame");

    if (!wrap || !frame) return;

    const visibleWidth = Math.max(1, wrap.clientWidth);
    const visibleHeight = Math.max(1, wrap.clientHeight);
    const scale = Math.min(1, visibleWidth / MOBILE_BROWSER_WIDTH);
    const virtualHeight = Math.ceil(visibleHeight / scale);

    frame.style.width = `${MOBILE_BROWSER_WIDTH}px`;
    frame.style.height = `${virtualHeight}px`;
    frame.style.transformOrigin = "0 0";
    frame.style.transform = `scale(${scale})`;
    frame.style.position = "absolute";
    frame.style.left = "0";
    frame.style.top = "0";

    wrap.dataset.mobileScale = scale.toFixed(4);
  }

  function scheduleBrowserFit() {
    clearTimeout(browserResizeTimer);
    browserResizeTimer = window.setTimeout(() => {
      requestAnimationFrame(fitBrowserMobileViewport);
    }, 30);
  }

  function renderBrowser(url = state.browser.current, label = "Google") {
    const safe = normalizeUrl(url, false);

    state.browser.current = safe;
    saveState();

    root.innerHTML = `
      <div class="a17-page sim-browser-page">
        <div class="sim-browser-toolbar">
          <button type="button" data-stable-action="browser-exit" aria-label="Kembali">‹</button>

          <form id="stableBrowserForm" class="sim-browser-address">
            <span class="sim-browser-google-mark">G</span>

            <input
              id="stableBrowserAddress"
              value="${esc(displayUrl(safe))}"
              autocomplete="off"
              inputmode="url"
              spellcheck="false"
              aria-label="Alamat website">

            <button type="submit" aria-label="Buka">➜</button>
          </form>

          <button type="button" data-stable-action="browser-external" aria-label="Buka di tab baru">↗</button>
        </div>

        <div class="sim-browser-nav">
          <button
            type="button"
            data-stable-action="browser-back"
            ${state.browser.index <= 0 ? "disabled" : ""}>
            ‹
          </button>

          <button
            type="button"
            data-stable-action="browser-forward"
            ${state.browser.index >= state.browser.history.length - 1 ? "disabled" : ""}>
            ›
          </button>

          <button type="button" data-stable-action="browser-home">⌂</button>
          <strong>${esc(label)} • mode ponsel</strong>
        </div>

        <div class="sim-browser-frame-wrap">
          <iframe
            id="stableBrowserFrame"
            src="${esc(safe)}"
            title="Browser simulator mode ponsel"
            referrerpolicy="origin-when-cross-origin"
            allow="clipboard-read; clipboard-write; autoplay; fullscreen">
          </iframe>

          <div class="sim-browser-note">
            Viewport virtual ${MOBILE_BROWSER_WIDTH}px. Situs yang melarang iframe tetap perlu dibuka dengan tombol ↗.
          </div>
        </div>
      </div>
    `;

    root.querySelector("#stableBrowserForm")?.addEventListener("submit", event => {
      event.preventDefault();

      const input = root.querySelector("#stableBrowserAddress");
      navigateBrowser(input?.value || "");
    });

    requestAnimationFrame(fitBrowserMobileViewport);
    setTimeout(fitBrowserMobileViewport, 120);
  }

  function navigateBrowser(raw) {
    const next = normalizeUrl(raw, true);

    state.browser.history = state.browser.history.slice(0, state.browser.index + 1);
    state.browser.history.push(next);
    state.browser.index = state.browser.history.length - 1;
    state.browser.current = next;

    saveState();
    renderBrowser(next, "Google");
  }

  function browserStep(direction) {
    const nextIndex = state.browser.index + direction;

    if (nextIndex < 0 || nextIndex >= state.browser.history.length) return;

    state.browser.index = nextIndex;
    state.browser.current = state.browser.history[nextIndex];

    saveState();
    renderBrowser(state.browser.current, "Google");
  }

  function openBrowser(url = googleHomeUrl(), label = "Google") {
    const normalized = normalizeUrl(url, false);

    if (state.browser.history[state.browser.index] !== normalized) {
      state.browser.history = state.browser.history.slice(0, state.browser.index + 1);
      state.browser.history.push(normalized);
      state.browser.index = state.browser.history.length - 1;
    }

    state.browser.current = normalized;
    saveState();
    renderBrowser(normalized, label);
  }

  /* =========================================================
     OPEN CORE APP
     ========================================================= */

  function openCoreApp(appId) {
    const current = root.querySelector(`[data-open-app="${CSS.escape(appId)}"]`);

    if (current) {
      current.click();
      return;
    }

    document.querySelector('[data-sim-command="home"]')?.click();

    requestAnimationFrame(() => {
      const next = root.querySelector(`[data-open-app="${CSS.escape(appId)}"]`);
      next?.click();
    });
  }

  /* =========================================================
     EVENT HANDLERS
     ========================================================= */

  function handleStableAction(action) {
    if (action === "toggle-island") {
      state.islandExpanded = !state.islandExpanded;
      saveState();
      renderIsland(true);
      return;
    }

    if (action === "stopwatch-start") {
      startStopwatch();
      return;
    }

    if (action === "stopwatch-pause") {
      pauseStopwatch();
      return;
    }

    if (action === "stopwatch-reset") {
      resetStopwatch();
      return;
    }

    if (action === "stopwatch-lap") {
      addLap();
      return;
    }

    if (action === "media-dismiss") {
      dismissMedia();
      return;
    }

    if (action === "open-media") {
      state.islandExpanded = false;
      saveState();
      openCoreApp(state.media.app || "spotify");
      renderIsland(true);
      return;
    }

    if (action === "open-clock") {
      state.islandExpanded = false;
      saveState();
      openCoreApp("clock");
      renderIsland(true);
      return;
    }

    if (action === "browser-exit") {
      document.querySelector('[data-sim-command="home"]')?.click();
      return;
    }

    if (action === "browser-back") {
      browserStep(-1);
      return;
    }

    if (action === "browser-forward") {
      browserStep(1);
      return;
    }

    if (action === "browser-home") {
      navigateBrowser(googleHomeUrl());
      return;
    }

    if (action === "browser-external") {
      window.open(
        state.browser.current || googleHomeUrl(),
        "_blank",
        "noopener,noreferrer"
      );
    }
  }

  document.addEventListener("click", event => {
    const target = event.target instanceof Element ? event.target : null;
    const action = target?.closest("[data-stable-action]");

    if (!action) return;

    event.preventDefault();
    event.stopPropagation();

    handleStableAction(action.dataset.stableAction || "");
  }, true);

  root.addEventListener("click", event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const appButton = target.closest("[data-open-app]");

    if (appButton && ["google", "chrome"].includes(appButton.dataset.openApp)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      openBrowser(
        googleHomeUrl(),
        appButton.dataset.openApp === "chrome" ? "Chrome" : "Google"
      );

      return;
    }

    const simAction = target.closest("[data-sim-action]")?.dataset.simAction;

    if (simAction === "spotify-open-url") {
      const input = root.querySelector("#spotifyUrlInput");
      if (startPersistentMedia("spotify", input?.value || "")) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
      return;
    }

    if (simAction === "youtube-open-url") {
      const input = root.querySelector("#youtubeUrlInput");
      const appId = root.querySelector(".youtube-live-app.music")
        ? "youtube-music"
        : "youtube";

      if (startPersistentMedia(appId, input?.value || "")) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
      return;
    }

    const spotifyPlaylist = target.closest("[data-spotify-playlist]");
    if (spotifyPlaylist) {
      const id = spotifyPlaylist.dataset.spotifyPlaylist || "";
      const title = spotifyPlaylist.querySelector("b")?.textContent?.trim() || "Spotify Playlist";
      const artwork = spotifyPlaylist.querySelector("img")?.src || mediaArtworkFallback("spotify");
      const embed = `https://open.spotify.com/embed/playlist/${encodeURIComponent(id)}?utm_source=generator&theme=0`;

      startPersistentMedia("spotify", `spotify:playlist:${id}`, {
        embed,
        title,
        subtitle: "Playlist Spotify",
        artwork
      });

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return;
    }

    const youtubePlaylist = target.closest("[data-youtube-playlist]");
    if (youtubePlaylist) {
      const id = youtubePlaylist.dataset.youtubePlaylist || "";
      const title = youtubePlaylist.querySelector("b")?.textContent?.trim() || "YouTube Playlist";
      const artwork = youtubePlaylist.querySelector("img")?.src || mediaArtworkFallback("youtube");
      const appId = root.querySelector(".youtube-live-app.music")
        ? "youtube-music"
        : "youtube";
      const origin = location.origin && location.origin !== "null"
        ? location.origin
        : "https://skenakun.github.io";
      const params = new URLSearchParams({
        list: id,
        playsinline: "1",
        rel: "0",
        autoplay: "1",
        controls: "1",
        enablejsapi: "1",
        origin,
        widget_referrer: location.href
      });

      startPersistentMedia(
        appId,
        `https://www.youtube.com/playlist?list=${encodeURIComponent(id)}`,
        {
          embed: `https://www.youtube.com/embed/videoseries?${params.toString()}`,
          title,
          subtitle: appId === "youtube-music" ? "Playlist YouTube Music" : "Playlist YouTube",
          artwork
        }
      );

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return;
    }

    if (simAction === "media-paste-clipboard" && navigator.clipboard?.readText) {
      const appId = root.querySelector(".spotify-live-app")
        ? "spotify"
        : (root.querySelector(".youtube-live-app.music") ? "youtube-music" : "youtube");
      const input = appId === "spotify"
        ? root.querySelector("#spotifyUrlInput")
        : root.querySelector("#youtubeUrlInput");

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      navigator.clipboard.readText().then(text => {
        const value = String(text || "").trim();
        if (input) input.value = value;
        startPersistentMedia(appId, value);
      }).catch(() => {});
    }
  }, true);

  root.addEventListener("keydown", event => {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    if (!input || event.key !== "Enter") return;
    if (!["spotifyUrlInput", "youtubeUrlInput"].includes(input.id)) return;

    const appId = input.id === "spotifyUrlInput"
      ? "spotify"
      : (root.querySelector(".youtube-live-app.music") ? "youtube-music" : "youtube");

    if (!startPersistentMedia(appId, input.value)) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }, true);

  root.addEventListener("paste", event => {
    const input = event.target instanceof HTMLInputElement ? event.target : null;
    if (!input || !["spotifyUrlInput", "youtubeUrlInput"].includes(input.id)) return;

    const pasted = event.clipboardData?.getData("text")?.trim();
    if (!pasted) return;

    const appId = input.id === "spotifyUrlInput"
      ? "spotify"
      : (root.querySelector(".youtube-live-app.music") ? "youtube-music" : "youtube");

    if (!mediaEmbedFromRaw(appId, pasted)) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    input.value = pasted;
    startPersistentMedia(appId, pasted);
  }, true);

  /* =========================================================
     SAFE RENDER WATCHER
     ========================================================= */

  let renderQueued = false;

  function enhanceCurrentView() {
    hideRecorderPillOnce();
    injectStopwatch();
    syncPersistentMediaFromCurrentView();
    syncMediaNotification();
    renderIsland();
    fitBrowserMobileViewport();
  }

  function queueEnhance() {
    if (renderQueued) return;
    renderQueued = true;

    requestAnimationFrame(() => {
      renderQueued = false;
      enhanceCurrentView();
    });
  }

  /*
   * CRITICAL FIX:
   * Observe only direct children of root.
   * androidsim.js replaces root.innerHTML when it navigates.
   * We intentionally DO NOT observe subtree mutations made by the enhancer.
   */
  const rootObserver = new MutationObserver(queueEnhance);
  rootObserver.observe(root, {
    childList: true,
    subtree: false
  });

  const mediaDuplicateObserver = new MutationObserver(records => {
    if (!state.media.playing || !persistentMediaFrame()) return;

    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;

        const frames = [];

        if (node.matches?.("#spotifyEmbedShell iframe, #youtubeEmbedShell iframe")) {
          frames.push(node);
        }

        node.querySelectorAll?.("#spotifyEmbedShell iframe, #youtubeEmbedShell iframe")
          .forEach(frame => frames.push(frame));

        frames.forEach(frame => frame.remove());
      }
    }
  });

  mediaDuplicateObserver.observe(root, {
    childList: true,
    subtree: true
  });


  /*
   * No MutationObserver is attached to #androidRecordPill.
   * The previous version observed attributes and then modified those same
   * attributes inside its callback, which could create a recursive loop.
   */

  const liveTimer = window.setInterval(() => {
    if (dialog && !dialog.open) return;

    if (state.stopwatch.running || root.querySelector(".enhancer-stopwatch")) {
      syncStopwatchUi();
      updateIslandTime();
    }

    if (state.media.playing) {
      const appId = appIdFromCurrentMediaView();

      if (root.querySelector(".quick-shade")) {
        parkPersistentMedia();
      } else if (appId === state.media.app) {
        ensureMediaPlaceholder(mediaShellForApp(appId), appId);
        positionPersistentMedia(mediaShellForApp(appId));
      } else {
        parkPersistentMedia();
      }

      updateIslandMediaProgress();
      syncMediaNotification();
    }
  }, 350);

  window.addEventListener("resize", scheduleBrowserFit, { passive: true });

  phone.addEventListener("scroll", () => {
    const appId = appIdFromCurrentMediaView();
    if (appId && state.media.playing) {
      positionPersistentMedia(mediaShellForApp(appId));
    }
  }, true);

  window.addEventListener("pagehide", () => {
    clearInterval(liveTimer);
    clearTimeout(browserResizeTimer);
    rootObserver.disconnect();
    mediaDuplicateObserver.disconnect();
  }, { once: true });

  /* V6: boot/recovery is owned by feature-loader.js. */

  ensureIsland();
  ensurePersistentMediaHost();
  enhanceCurrentView();
})();