(() => {
  "use strict";

  if (window.__waifuPersistentMediaBridgeV12) return;

  const phone = document.getElementById("pixelScreen");
  const root = document.getElementById("androidScreenRoot");
  const dialog = document.getElementById("phoneSimDialog");

  if (!phone || !root) return;

  const session = {
    active: false,
    app: "",
    raw: "",
    embed: "",
    title: "",
    subtitle: "",
    artwork: "",
    startedAt: 0,
    expanded: false
  };

  const appMeta = app => ({
    spotify: { label: "Spotify", glyph: "●" },
    youtube: { label: "YouTube", glyph: "▶" },
    "youtube-music": { label: "YouTube Music", glyph: "♫" }
  }[app] || { label: "Media", glyph: "♪" });

  function esc(value = "") {
    return String(value).replace(/[&<>"']/g, c => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[c]));
  }

  function youtubeInfo(raw) {
    const value = String(raw || "").trim();
    if (!value) return null;
    try {
      const u = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      const host = u.hostname.replace(/^www\./, "").toLowerCase();
      let video = "";
      let list = u.searchParams.get("list") || "";

      if (host === "youtu.be") {
        video = u.pathname.split("/").filter(Boolean)[0] || "";
      } else if (host.endsWith("youtube.com")) {
        if (u.pathname === "/watch") video = u.searchParams.get("v") || "";
        const parts = u.pathname.split("/").filter(Boolean);
        if (["shorts", "live", "embed"].includes(parts[0])) video = parts[1] || "";
        if (parts[0] === "playlist") list = u.searchParams.get("list") || list;
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

  function youtubeEmbed(raw) {
    const info = youtubeInfo(raw);
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

  function spotifyEmbed(raw) {
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
        const u = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
        if (!u.hostname.toLowerCase().endsWith("spotify.com")) return "";
        const parts = u.pathname.split("/").filter(Boolean);
        const idx = parts.findIndex(x => ["track","album","playlist","artist","episode","show"].includes(x));
        if (idx >= 0) {
          type = parts[idx];
          id = parts[idx + 1] || "";
        }
      } catch {
        return "";
      }
    }
    if (!type || !id) return "";
    return `https://open.spotify.com/embed/${encodeURIComponent(type)}/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
  }

  function embedFor(app, raw) {
    return app === "spotify" ? spotifyEmbed(raw) : youtubeEmbed(raw);
  }

  function fallbackArtwork(app) {
    const bg = app === "spotify" ? "#1ed760" : "#ff0033";
    const fg = app === "spotify" ? "#08150d" : "#ffffff";
    const text = app === "spotify" ? "S" : (app === "youtube-music" ? "M" : "▶");
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <rect width="120" height="120" rx="28" fill="${bg}"/>
        <text x="60" y="73" text-anchor="middle" font-size="54" font-family="sans-serif" font-weight="700" fill="${fg}">${text}</text>
      </svg>`
    );
  }

  function ensureHost() {
    let host = document.getElementById("androidPersistentMediaHostV12");
    if (!host) {
      host = document.createElement("div");
      host.id = "androidPersistentMediaHostV12";
      host.className = "android-persistent-media-v12 is-parked";
      host.setAttribute("aria-label", "Persistent media player");
      phone.appendChild(host);
    }
    return host;
  }

  function frame() {
    return ensureHost().querySelector("iframe");
  }

  function sameFrame(embed, app) {
    const host = ensureHost();
    return !!frame() &&
      host.dataset.mediaApp === app &&
      host.dataset.mediaSrc === embed;
  }

  function createFrame(embed, app) {
    const host = ensureHost();
    if (sameFrame(embed, app)) return frame();

    host.replaceChildren();

    const iframe = document.createElement("iframe");
    iframe.src = embed;
    iframe.title = `${appMeta(app).label} player`;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share";
    iframe.referrerPolicy = "origin-when-cross-origin";
    iframe.loading = "eager";
    iframe.setAttribute("allowfullscreen", "");

    host.dataset.mediaApp = app;
    host.dataset.mediaSrc = embed;
    host.appendChild(iframe);
    phone.dataset.persistentMediaV12 = "1";
    return iframe;
  }

  function currentMediaApp() {
    if (root.querySelector(".spotify-live-app")) return "spotify";
    const yt = root.querySelector(".youtube-live-app");
    if (!yt) return "";
    return yt.classList.contains("music") ? "youtube-music" : "youtube";
  }

  function shellFor(app) {
    if (app === "spotify") return root.querySelector("#spotifyEmbedShell");
    if (app === "youtube" || app === "youtube-music") return root.querySelector("#youtubeEmbedShell");
    return null;
  }

  /*
   * A stored media URL is rendered by androidsim.js as a normal iframe before
   * the user presses controls inside the embedded player. Those controls live
   * in a cross-origin iframe, so the parent page cannot reliably observe the
   * internal Play click. If that iframe stays inside #androidScreenRoot it is
   * destroyed as soon as Android navigates Home/QS/Notifications, and the
   * media bridge never owns an active session (therefore no Dynamic Island).
   *
   * Adopt the iframe as soon as a supported media app renders it. From that
   * point the same persistent bridge owns YouTube, YouTube Music and Spotify,
   * including media that came from a URL saved in localStorage.
   */
  function adoptRenderedMedia() {
    const app = currentMediaApp();
    if (!app) return false;

    const shell = shellFor(app);
    const renderedFrame = shell?.querySelector("iframe");
    if (!(renderedFrame instanceof HTMLIFrameElement)) return false;

    const source = String(
      renderedFrame.getAttribute("src") || renderedFrame.src || ""
    ).trim();
    if (!source || source === "about:blank") return false;

    const input = app === "spotify"
      ? root.querySelector("#spotifyUrlInput")
      : root.querySelector("#youtubeUrlInput");
    const raw = String(input?.value || source).trim();
    const info = app === "spotify" ? null : youtubeInfo(raw || source);
    const meta = appMeta(app);

    createFrame(source, app);
    session.active = true;
    session.app = app;
    session.raw = raw;
    session.embed = source;
    session.title = meta.label;
    session.subtitle = "Sedang diputar";
    session.artwork = info?.artwork || fallbackArtwork(app);
    session.startedAt = Date.now();
    session.expanded = false;

    ensurePlaceholder(shell);
    return true;
  }

  function shadeOpen() {
    return !!root.querySelector(".quick-shade, .axion-notification-shade, .axion-separate-qs");
  }

  function ensurePlaceholder(shell) {
    if (!shell) return;

    /*
     * The patched androidsim.js should already avoid generating a duplicate
     * iframe. Remove one defensively if an older cached core briefly renders it.
     */
    shell.querySelectorAll("iframe").forEach(node => node.remove());

    if (shell.querySelector(".persistent-core-placeholder")) return;

    shell.replaceChildren();
    const el = document.createElement("div");
    el.className = "media-empty persistent-core-placeholder";
    el.textContent = `${appMeta(session.app).label} sedang diputar. Player tetap aktif saat membuka Home, QS, atau Notifikasi.`;
    shell.appendChild(el);
  }

  function showAtShell(shell) {
    const host = ensureHost();
    if (!frame() || !shell) return park();

    const phoneRect = phone.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();
    if (shellRect.width < 40 || shellRect.height < 40) return park();

    host.style.setProperty("--pm-left", `${shellRect.left - phoneRect.left}px`);
    host.style.setProperty("--pm-top", `${shellRect.top - phoneRect.top}px`);
    host.style.setProperty("--pm-width", `${shellRect.width}px`);
    host.style.setProperty("--pm-height", `${shellRect.height}px`);

    host.classList.remove("is-parked");
    host.classList.add("is-visible");
  }

  function park() {
    const host = ensureHost();
    if (!frame()) return;
    /*
     * Do NOT hide, detach, resize, change src, or set display:none.
     * It stays fully rendered behind #androidScreenRoot.
     */
    host.classList.add("is-parked");
    host.classList.remove("is-visible");
  }

  function ensureIsland() {
    let island = document.getElementById("androidDynamicIsland");
    if (!island) {
      island = document.createElement("div");
      island.id = "androidDynamicIsland";
      phone.appendChild(island);
    }
    return island;
  }

  function renderIsland() {
    if (!session.active) return;

    const island = ensureIsland();
    const meta = appMeta(session.app);
    island.className = `android-dynamic-island media-v12 has-activity ${session.expanded ? "expanded" : ""}`;

    if (!session.expanded) {
      island.innerHTML = `
        <button type="button" class="media-v12-compact" data-media-v12-action="toggle">
          <img src="${esc(session.artwork || fallbackArtwork(session.app))}" alt="">
          <span><strong>${esc(session.title || meta.label)}</strong><small>${esc(meta.label)}</small></span>
          <i class="media-v12-wave"><b></b><b></b><b></b><b></b></i>
        </button>
      `;
      return;
    }

    island.innerHTML = `
      <div class="media-v12-expanded">
        <button type="button" class="media-v12-now" data-media-v12-action="toggle">
          <img src="${esc(session.artwork || fallbackArtwork(session.app))}" alt="">
          <span><strong>${esc(session.title || meta.label)}</strong><small>${esc(meta.label)}</small></span>
          <i class="media-v12-wave"><b></b><b></b><b></b><b></b></i>
        </button>
        <div class="media-v12-progress"><i></i></div>
        <div class="media-v12-actions">
          <button type="button" data-media-v12-action="open">Buka aplikasi</button>
          <button type="button" data-media-v12-action="stop">Hentikan</button>
        </div>
      </div>
    `;
  }

  function notificationMarkup() {
    const meta = appMeta(session.app);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "axion-notification-card enhancer-media-notification media-v12-notification";
    button.dataset.mediaV12Action = "open";
    button.innerHTML = `
      <span class="axion-notification-icon">${meta.glyph}</span>
      <span>
        <strong>${esc(session.title || meta.label)}</strong>
        <small>${esc(meta.label)} • sedang diputar</small>
        <span class="media-v12-mini-wave"><i></i><i></i><i></i><i></i></span>
      </span>
      <em>sekarang</em>
    `;
    return button;
  }

  function syncNotification() {
    if (!session.active) return;
    const containers = [
      root.querySelector(".axion-notification-shade"),
      root.querySelector(".axion-separate-qs"),
      root.querySelector(".quick-shade")
    ].filter(Boolean);

    for (const container of containers) {
      const existing = container.querySelector(".media-v12-notification");
      if (existing) continue;

      let list = container.querySelector(".axion-notification-list");
      if (!list) {
        list = document.createElement("div");
        list.className = "axion-notification-list";
        container.querySelector(".axion-notification-empty")?.remove();
        const footer = container.querySelector(".axion-notif-footer");
        if (footer) container.insertBefore(list, footer);
        else container.appendChild(list);
      }
      list.prepend(notificationMarkup());
    }
  }

  function sync() {
    // Recover media that androidsim.js rendered from a previously saved URL.
    // This is also the path used when the user presses Play inside the
    // cross-origin YouTube / Spotify iframe instead of the outer "Putar" button.
    if ((!session.active || !frame()) && !adoptRenderedMedia()) return;

    const app = currentMediaApp();
    if (!shadeOpen() && app === session.app) {
      const shell = shellFor(app);
      ensurePlaceholder(shell);
      showAtShell(shell);
    } else {
      park();
    }

    renderIsland();
    syncNotification();
  }

  function start(app, raw, options = {}) {
    const source = String(options.embed || embedFor(app, raw) || "").trim();
    if (!source) return false;

    if (!sameFrame(source, app)) {
      createFrame(source, app);
      session.startedAt = Date.now();
    }

    const info = app === "spotify" ? null : youtubeInfo(raw);
    const meta = appMeta(app);

    session.active = true;
    session.app = app;
    session.raw = String(raw || "");
    session.embed = source;
    session.title = String(options.title || meta.label);
    session.subtitle = String(options.subtitle || "Sedang diputar");
    session.artwork = String(options.artwork || info?.artwork || fallbackArtwork(app));
    session.expanded = false;

    sync();
    return true;
  }

  function stop() {
    const host = ensureHost();
    host.replaceChildren();
    host.removeAttribute("data-media-app");
    host.removeAttribute("data-media-src");
    phone.removeAttribute("data-persistent-media-v12");

    session.active = false;
    session.app = "";
    session.raw = "";
    session.embed = "";
    session.title = "";
    session.subtitle = "";
    session.artwork = "";
    session.startedAt = 0;
    session.expanded = false;

    const island = document.getElementById("androidDynamicIsland");
    if (island) {
      island.className = "android-dynamic-island island-idle";
      island.innerHTML = "";
    }
    root.querySelectorAll(".media-v12-notification").forEach(n => n.remove());
  }

  async function openMediaApp() {
    const target = session.app;
    if (!target) return;

    if (currentMediaApp() === target) {
      sync();
      return;
    }

    let button = root.querySelector(`[data-open-app="${CSS.escape(target)}"]`);
    if (button instanceof HTMLElement) {
      button.click();
      requestAnimationFrame(sync);
      return;
    }

    document.querySelector('[data-sim-command="home"]')?.click();
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    button = root.querySelector(`[data-open-app="${CSS.escape(target)}"]`);
    if (button instanceof HTMLElement) {
      button.click();
      requestAnimationFrame(sync);
    }
  }

  document.addEventListener("click", event => {
    const target = event.target instanceof Element ? event.target : null;
    const action = target?.closest("[data-media-v12-action]")?.dataset.mediaV12Action;
    if (!action) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (action === "toggle") {
      session.expanded = !session.expanded;
      renderIsland();
    } else if (action === "stop") {
      stop();
    } else if (action === "open") {
      session.expanded = false;
      renderIsland();
      void openMediaApp();
    }
  }, true);

  /*
   * Synchronize only after root-level Android navigation.
   * This observer never touches the iframe source.
   */
  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      sync();
    });
  });
  observer.observe(root, { childList: true, subtree: false });

  const timer = window.setInterval(() => {
    if (!session.active) return;
    if (dialog && !dialog.open) {
      park();
      return;
    }
    sync();
  }, 600);

  window.addEventListener("resize", () => session.active && sync(), { passive:true });

  window.__waifuPersistentMediaBridgeV12 = {
    version: "12",
    start,
    stop,
    sync,
    renderIsland,
    syncNotification,
    isActive(app = "") {
      return !!session.active && (!app || session.app === app) && !!frame();
    },
    getState() {
      return { ...session, iframeAlive: !!frame() };
    }
  };
})();

(() => {
  "use strict";

  /*
   * Stable Android Simulator enhancer
   * Replaces the previous enhancer that could create recursive MutationObserver
   * updates and eventually freeze Chromium.
   *
   * Baseline: 3695b75b5ecbd94a9e5adb49ffb41e9183488ca5
   */

  if (window.__waifuAndroidEnhancerMediaV12) return;
  window.__waifuAndroidEnhancerMediaV12 = true;
  window.__waifuChromeStaticV1 = true;

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

  function mediaBridgeV12() {
    return window.__waifuPersistentMediaBridgeV12 || null;
  }


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
    const bridge = mediaBridgeV12();
    if (bridge?.isActive?.()) {
      bridge.renderIsland?.();
      return;
    }
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
          <button
            class="island-media-now island-expanded-toggle"
            type="button"
            data-stable-action="toggle-island"
            aria-label="Perkecil Dynamic Island"
          >
            <img src="${esc(artwork)}" alt="">
            <span>
              <strong>${esc(title)}</strong>
              <small>${esc(meta.label)}</small>
            </span>
            <span class="island-big-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
          </button>
          <div class="island-media-progress"><span id="stableIslandMediaProgress"></span></div>
          <div class="island-media-actions">
            <button type="button" data-stable-action="open-media" data-media-app="${esc(state.media.app)}">Buka aplikasi</button>
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

    /*
     * V11 media continuity:
     * Do not move, detach, resize or rebuild the iframe when Android
     * switches to Home, Quick Settings or Notifications.
     * Only change presentation state.
     */
    host.classList.add("is-parked");
    host.classList.remove("is-visible");
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

    /*
     * If media is already playing, Android navigation must never replace
     * its iframe. A different source is only allowed when the user starts
     * a new URL explicitly through startPersistentMedia().
     */
    if (
      current &&
      state.media.playing &&
      host.dataset.mediaApp === appId
    ) {
      return current;
    }

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

  function replacePersistentMediaForUserAction(embed, appId) {
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
    const bridge = mediaBridgeV12();
    if (bridge?.start) {
      return bridge.start(appId, rawUrl, options);
    }
    const raw = String(rawUrl || "").trim();
    const embed = String(options.embed || mediaEmbedFromRaw(appId, raw) || "").trim();
    if (!embed) return false;

    const sameMedia =
      state.media.playing &&
      state.media.app === appId &&
      state.media.embed === embed &&
      !!persistentMediaFrame();

    if (!sameMedia) {
      // Only a direct user playback action may replace the persistent iframe.
      replacePersistentMediaForUserAction(embed, appId);
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
    if (shell && !root.querySelector(".quick-shade, .axion-notification-shade")) {
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

    if (root.querySelector(".quick-shade, .axion-notification-shade")) {
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
    const bridge = mediaBridgeV12();
    if (bridge?.sync) {
      bridge.sync();
      return;
    }
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
      renderIsland(true);
      syncMediaNotification();
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
    const bridge = mediaBridgeV12();
    if (bridge?.isActive?.()) {
      bridge.stop?.();
    }
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
    const bridge = mediaBridgeV12();
    if (bridge?.syncNotification) {
      bridge.syncNotification();
      return;
    }
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
     GitHub Pages only / no self-hosted backend

     Important browser-security constraint:
     arbitrary sites cannot be embedded reliably in a third-party iframe.
     The default compatibility view therefore uses Jina Reader/Search for
     public pages. The user can still switch to the site's original iframe
     when the destination explicitly allows framing, or open it externally.
     ========================================================= */

  const MOBILE_BROWSER_WIDTH = 412;
  let browserResizeTimer = 0;
  let browserCompatRequestToken = 0;
  const browserCompatCache = new Map();

  function googleHomeUrl() {
    return "https://www.google.com/webhp?hl=id&gl=id";
  }

  function normalizeUrl(raw, searchText = true) {
    const value = String(raw || "").trim();
    if (!value) return googleHomeUrl();

    const isProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(value);
    if (searchText && !isProtocol && !value.includes(".")) {
      return `https://www.google.com/search?hl=id&gl=id&q=${encodeURIComponent(value)}`;
    }

    try {
      const url = new URL(isProtocol ? value : `https://${value}`);
      if (!["http:", "https:"].includes(url.protocol)) return googleHomeUrl();
      return url.toString();
    } catch {
      return `https://www.google.com/search?hl=id&gl=id&q=${encodeURIComponent(value)}`;
    }
  }

  function displayUrl(url) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.delete("igu");
      return parsed.toString();
    } catch {
      return String(url || "");
    }
  }

  function browserLabel(url, fallback = "Chrome") {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      if (host.startsWith("scholar.google.")) return "Google Scholar";
      if (host === "google.com" || host.endsWith(".google.com")) return "Google";
      return host || fallback;
    } catch {
      return fallback;
    }
  }

  function googleQueryFromUrl(url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
      if (host !== "google.com" && !host.endsWith(".google.com")) return "";
      if (parsed.pathname !== "/search") return "";
      return String(parsed.searchParams.get("q") || "").trim();
    } catch {
      return "";
    }
  }

  function isGoogleHome(url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
      return (host === "google.com" || host.endsWith(".google.com")) &&
        (parsed.pathname === "/" || parsed.pathname === "/webhp") &&
        !parsed.searchParams.get("q");
    } catch {
      return false;
    }
  }

  function isGoogleScholar(url) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
      return host.startsWith("scholar.google.");
    } catch {
      return false;
    }
  }

  function scholarQueryFromUrl(url) {
    try {
      const parsed = new URL(url);
      if (!isGoogleScholar(parsed.toString())) return "";
      return String(parsed.searchParams.get("q") || "").trim();
    } catch {
      return "";
    }
  }

  // Google normally blocks ordinary third-party framing. The `igu=1` flag is
  // Google's embeddable search variant and is required when we intentionally
  // fall back from the local/compatibility UI to the real Google results page.
  function originalEmbeddableUrl(url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
      if (host === "google.com" || host.endsWith(".google.com")) {
        if (["/", "/webhp", "/search"].includes(parsed.pathname)) {
          parsed.searchParams.set("igu", "1");
        }
      }
      return parsed.toString();
    } catch {
      return String(url || "");
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

  function browserMode() {
    return String(state.browser.viewMode || "compat");
  }

  function setBrowserMode(mode) {
    state.browser.viewMode = mode === "original" ? "original" : "compat";
    saveState();
  }

  function escapeAttribute(value = "") {
    return esc(value).replace(/`/g, "&#96;");
  }

  function browserReaderStyles() {
    return `
      <style>
        .sim-browser-compat {
          position:absolute; inset:0; overflow:auto; background:#fff; color:#202124;
          font-family:Arial,Helvetica,sans-serif; overscroll-behavior:contain;
        }
        .sim-browser-compat * { box-sizing:border-box; }
        .sim-browser-loading, .sim-browser-error {
          min-height:100%; display:grid; place-items:center; padding:28px; text-align:center;
        }
        .sim-browser-loading > div, .sim-browser-error > div { max-width:330px; }
        .sim-browser-spinner {
          width:34px; height:34px; margin:0 auto 14px; border:4px solid #dfe3eb;
          border-top-color:#4285f4; border-radius:50%; animation:simBrowserSpin .8s linear infinite;
        }
        @keyframes simBrowserSpin { to { transform:rotate(360deg); } }
        .sim-browser-error button, .sim-browser-reader button, .sim-browser-search-results button {
          border:0; border-radius:18px; padding:9px 14px; cursor:pointer;
        }
        .sim-browser-google-home {
          min-height:100%; display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
          padding:76px 24px 30px; background:#fff;
        }
        .sim-browser-google-logo { font-size:54px; font-weight:600; letter-spacing:-5px; margin-bottom:26px; }
        .sim-browser-google-logo span:nth-child(1), .sim-browser-google-logo span:nth-child(4) { color:#4285f4; }
        .sim-browser-google-logo span:nth-child(2), .sim-browser-google-logo span:nth-child(6) { color:#ea4335; }
        .sim-browser-google-logo span:nth-child(3) { color:#fbbc05; }
        .sim-browser-google-logo span:nth-child(5) { color:#34a853; }
        .sim-browser-google-search {
          width:100%; display:flex; align-items:center; gap:8px; border:1px solid #dfe1e5;
          border-radius:24px; padding:5px 7px 5px 15px; box-shadow:0 1px 6px rgba(32,33,36,.14);
        }
        .sim-browser-google-search input { flex:1; min-width:0; border:0; outline:0; font-size:16px; padding:8px 0; }
        .sim-browser-google-search button { width:38px; height:38px; border:0; border-radius:50%; background:#4285f4; color:#fff; }
        .sim-browser-google-hint { margin-top:28px; color:#5f6368; font-size:12px; text-align:center; line-height:1.5; }
        .sim-browser-search-results { min-height:100%; padding:18px 16px 34px; background:#fff; }
        .sim-browser-search-head { display:flex; align-items:center; gap:10px; padding:5px 0 14px; border-bottom:1px solid #eceff3; margin-bottom:12px; }
        .sim-browser-search-g { color:#4285f4; font-size:24px; font-weight:700; }
        .sim-browser-search-head strong { font-size:15px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .sim-browser-search-result { padding:12px 2px 15px; border-bottom:1px solid #eef0f2; }
        .sim-browser-search-result small { display:block; color:#4d5156; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:4px; }
        .sim-browser-search-result a { color:#1a0dab; text-decoration:none; font-size:18px; line-height:1.3; display:block; margin-bottom:5px; }
        .sim-browser-search-result p { margin:0; color:#4d5156; font-size:13px; line-height:1.45; }
        .sim-browser-reader { min-height:100%; padding:18px 18px 36px; background:#fff; }
        .sim-browser-reader-head { border-bottom:1px solid #eceff3; padding-bottom:12px; margin-bottom:16px; }
        .sim-browser-reader-head small { color:#5f6368; display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
        .sim-browser-reader h1 { font-size:25px; line-height:1.2; margin:8px 0 12px; }
        .sim-browser-reader h2 { font-size:20px; margin:22px 0 9px; }
        .sim-browser-reader h3 { font-size:17px; margin:18px 0 7px; }
        .sim-browser-reader p, .sim-browser-reader li { font-size:14px; line-height:1.6; }
        .sim-browser-reader a { color:#1967d2; text-decoration:none; overflow-wrap:anywhere; }
        .sim-browser-reader img { max-width:100%; height:auto; border-radius:10px; }
        .sim-browser-reader pre { white-space:pre-wrap; overflow-wrap:anywhere; background:#f6f8fa; border-radius:10px; padding:12px; }
        .sim-browser-reader code { background:#f1f3f4; border-radius:4px; padding:1px 4px; }
        .sim-browser-reader blockquote { margin:12px 0; padding:8px 12px; border-left:3px solid #dadce0; color:#5f6368; }
        .sim-browser-reader-note {
          margin:16px 0 0; padding:10px 12px; border-radius:12px; background:#eef4ff; color:#35517b; font-size:12px; line-height:1.45;
        }
        .sim-browser-scholar { min-height:100%; background:#fff; color:#202124; padding:24px 16px 40px; }
        .sim-browser-scholar-brand { display:flex; align-items:center; gap:10px; margin:18px 0 22px; color:#4285f4; }
        .sim-browser-scholar-brand b { font-size:32px; font-weight:500; letter-spacing:-1px; }
        .sim-browser-scholar-brand small { color:#5f6368; font-size:12px; }
        .sim-browser-scholar-search { display:flex; align-items:center; gap:8px; border:1px solid #dadce0; border-radius:24px; padding:5px 6px 5px 14px; box-shadow:0 1px 4px rgba(60,64,67,.12); }
        .sim-browser-scholar-search input { flex:1; min-width:0; border:0; outline:0; font-size:15px; padding:9px 0; }
        .sim-browser-scholar-search button { width:38px; height:38px; border:0; border-radius:50%; background:#4285f4; color:#fff; cursor:pointer; }
        .sim-browser-scholar-result { padding:15px 2px; border-bottom:1px solid #edf0f3; }
        .sim-browser-scholar-result a { color:#1a0dab; font-size:17px; line-height:1.35; text-decoration:none; display:block; }
        .sim-browser-scholar-result small { display:block; color:#137333; margin:5px 0; overflow-wrap:anywhere; }
        .sim-browser-scholar-result p { margin:5px 0 0; color:#4d5156; font-size:13px; line-height:1.5; }
        .sim-browser-source-badge { display:inline-flex; align-items:center; border-radius:999px; padding:4px 8px; margin:0 0 10px; background:#f1f3f4; color:#5f6368; font-size:11px; }
      </style>
    `;
  }

  function renderBrowserChrome(content, safe, label = "Chrome", mode = browserMode()) {
    root.innerHTML = `
      <div class="a17-page sim-browser-page">
        ${browserReaderStyles()}
        <div class="sim-browser-toolbar">
          <button type="button" data-stable-action="browser-exit" aria-label="Kembali">‹</button>

          <form id="stableBrowserForm" class="sim-browser-address">
            <span class="sim-browser-google-mark">G</span>
            <input
              id="stableBrowserAddress"
              value="${escapeAttribute(displayUrl(safe))}"
              autocomplete="off"
              inputmode="url"
              spellcheck="false"
              aria-label="Alamat website atau pencarian">
            <button type="submit" aria-label="Buka">➜</button>
          </form>

          <button
            type="button"
            data-stable-action="browser-toggle-mode"
            aria-label="${mode === "original" ? "Gunakan mode kompatibilitas" : "Coba tampilan website asli"}">
            ${mode === "original" ? "▤" : "◎"}
          </button>
          <button type="button" data-stable-action="browser-external" aria-label="Buka situs penuh">↗</button>
        </div>

        <div class="sim-browser-nav">
          <button type="button" data-stable-action="browser-back" ${state.browser.index <= 0 ? "disabled" : ""}>‹</button>
          <button type="button" data-stable-action="browser-forward" ${state.browser.index >= state.browser.history.length - 1 ? "disabled" : ""}>›</button>
          <button type="button" data-stable-action="browser-home">⌂</button>
          <strong>${esc(browserLabel(safe, label))} • ${mode === "original" ? "asli" : "kompatibel"}</strong>
        </div>

        <div class="sim-browser-frame-wrap">${content}</div>
      </div>
    `;

    root.querySelector("#stableBrowserForm")?.addEventListener("submit", event => {
      event.preventDefault();
      const input = root.querySelector("#stableBrowserAddress");
      navigateBrowser(input?.value || "");
    });
  }

  function renderBrowserLoading(safe, label = "Chrome", message = "Membuka halaman…") {
    renderBrowserChrome(`
      <div class="sim-browser-compat sim-browser-loading">
        <div><div class="sim-browser-spinner"></div><strong>${esc(message)}</strong><p>Mohon tunggu.</p></div>
      </div>
    `, safe, label, "compat");
  }

  function renderBrowserError(safe, message, label = "Chrome") {
    renderBrowserChrome(`
      <div class="sim-browser-compat sim-browser-error">
        <div>
          <strong>Halaman tidak dapat dimuat</strong>
          <p>${esc(message)}</p>
          <button type="button" data-stable-action="browser-retry">Coba lagi</button>
          <button type="button" data-stable-action="browser-toggle-mode">Coba tampilan asli</button>
          <button type="button" data-stable-action="browser-external">Buka di browser</button>
        </div>
      </div>
    `, safe, label, "compat");
  }

  function renderLocalGoogleHome(safe) {
    renderBrowserChrome(`
      <div class="sim-browser-compat sim-browser-google-home">
        <div class="sim-browser-google-logo" aria-label="Google"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></div>
        <form id="simGoogleSearchForm" class="sim-browser-google-search">
          <span>⌕</span>
          <input id="simGoogleSearchInput" type="search" autocomplete="off" placeholder="Telusuri Google atau ketik URL">
          <button type="submit" aria-label="Cari">➜</button>
        </form>
        <div class="sim-browser-google-hint">Pencarian ditampilkan dalam mode kompatibilitas agar hasil dapat dibuka di dalam Android Simulator.</div>
      </div>
    `, safe, "Google", "compat");

    root.querySelector("#simGoogleSearchForm")?.addEventListener("submit", event => {
      event.preventDefault();
      navigateBrowser(root.querySelector("#simGoogleSearchInput")?.value || "");
    });
  }

  function renderLocalScholarHome(safe, query = "") {
    renderBrowserChrome(`
      <div class="sim-browser-compat sim-browser-scholar">
        <div class="sim-browser-scholar-brand"><b>Google Scholar</b><small>mode kompatibilitas</small></div>
        <form id="simScholarSearchForm" class="sim-browser-scholar-search">
          <span>⌕</span>
          <input id="simScholarSearchInput" type="search" autocomplete="off" value="${escapeAttribute(query)}" placeholder="Telusuri artikel ilmiah">
          <button type="submit" aria-label="Cari">➜</button>
        </form>
        ${query ? `<div class="sim-browser-reader-note">Menyiapkan hasil untuk “${esc(query)}”…</div>` : `<div class="sim-browser-google-hint">Google Scholar asli menolak embedding pada banyak halaman. Mode ini mempertahankan pencarian di dalam simulator dan membuka hasil publik dengan fallback kompatibilitas.</div>`}
      </div>
    `, safe, "Google Scholar", "compat");

    root.querySelector("#simScholarSearchForm")?.addEventListener("submit", event => {
      event.preventDefault();
      const q = String(root.querySelector("#simScholarSearchInput")?.value || "").trim();
      if (!q) return;
      navigateBrowser(`https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`);
    });
  }

  async function renderScholarCompat(safe) {
    const query = scholarQueryFromUrl(safe);
    if (!query) {
      renderLocalScholarHome(safe);
      return;
    }
    const requestToken = ++browserCompatRequestToken;
    renderLocalScholarHome(safe, query);
    try {
      const endpoint = `https://s.jina.ai/?q=${encodeURIComponent(query + " research paper journal DOI")}`;
      const markdown = await fetchCompatText(endpoint);
      if (requestToken !== browserCompatRequestToken || state.browser.current !== safe || browserMode() !== "compat") return;
      const results = searchResultsFromMarkdown(markdown).slice(0, 10);
      if (!results.length) throw new Error("Hasil akademik tidak terbaca");
      const cards = results.map(item => {
        let host = item.url;
        try { host = new URL(item.url).hostname.replace(/^www\./, ""); } catch {}
        return `<article class="sim-browser-scholar-result"><a href="#" data-browser-url="${escapeAttribute(item.url)}">${esc(item.title)}</a><small>${esc(host)}</small>${item.snippet ? `<p>${esc(item.snippet)}</p>` : ""}</article>`;
      }).join("");
      renderBrowserChrome(`
        <div class="sim-browser-compat sim-browser-scholar">
          <div class="sim-browser-scholar-brand"><b>Google Scholar</b><small>fallback publik</small></div>
          <form id="simScholarSearchForm" class="sim-browser-scholar-search"><span>⌕</span><input id="simScholarSearchInput" type="search" autocomplete="off" value="${escapeAttribute(query)}"><button type="submit">➜</button></form>
          <div class="sim-browser-source-badge">Hasil akademik kompatibel</div>${cards}
          <div class="sim-browser-reader-note">Google Scholar asli dapat menolak embedding/reader. Hasil ini adalah fallback pencarian web akademik; tautan publik tetap dibuka di dalam simulator bila dapat dibaca.</div>
        </div>
      `, safe, "Google Scholar", "compat");
      root.querySelector("#simScholarSearchForm")?.addEventListener("submit", event => {
        event.preventDefault();
        const q = String(root.querySelector("#simScholarSearchInput")?.value || "").trim();
        if (q) navigateBrowser(`https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`);
      });
    } catch {
      if (requestToken !== browserCompatRequestToken || state.browser.current !== safe) return;
      renderBrowserError(safe, "Google Scholar asli menolak embedding dan fallback pencarian sedang tidak tersedia. Coba lagi atau buka Scholar penuh lewat ↗.", "Google Scholar");
    }
  }

  function normalizeReaderUrl(raw, baseUrl = "") {
    const value = String(raw || "").trim();
    if (!value) return "";
    try {
      const resolved = new URL(value, baseUrl || undefined);
      if (!["http:", "https:"].includes(resolved.protocol)) return "";
      return resolved.toString();
    } catch {
      return "";
    }
  }

  function inlineMarkdown(text, baseUrl = "") {
    let safe = esc(String(text || ""));

    safe = safe.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g, (_, alt, url) => {
      const resolved = normalizeReaderUrl(url, baseUrl);
      return resolved ? `<img src="${escapeAttribute(resolved)}" alt="${alt}" loading="lazy">` : alt;
    });

    safe = safe.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_, label, url) => {
      const resolved = normalizeReaderUrl(url.replaceAll("&amp;", "&"), baseUrl);
      return resolved
        ? `<a href="#" data-browser-url="${escapeAttribute(resolved)}">${label}</a>`
        : label;
    });

    safe = safe.replace(/`([^`]+)`/g, "<code>$1</code>");
    safe = safe.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    safe = safe.replace(/(^|\s)(https?:\/\/[^\s<]+)/g, (match, prefix, url) => {
      const clean = url.replace(/[.,;:!?]+$/, "");
      const suffix = url.slice(clean.length);
      return `${prefix}<a href="#" data-browser-url="${escapeAttribute(clean)}">${clean}</a>${suffix}`;
    });
    return safe;
  }

  function markdownToReaderHtml(markdown, baseUrl = "") {
    const source = String(markdown || "").replace(/\r/g, "");
    const lines = source.split("\n");
    const out = [];
    let listOpen = false;
    let paragraph = [];
    let codeOpen = false;
    let codeLines = [];

    const flushParagraph = () => {
      if (!paragraph.length) return;
      out.push(`<p>${inlineMarkdown(paragraph.join(" "), baseUrl)}</p>`);
      paragraph = [];
    };
    const closeList = () => {
      if (!listOpen) return;
      out.push("</ul>");
      listOpen = false;
    };
    const flushCode = () => {
      if (!codeOpen) return;
      out.push(`<pre>${esc(codeLines.join("\n"))}</pre>`);
      codeLines = [];
      codeOpen = false;
    };

    for (const line of lines) {
      if (/^```/.test(line.trim())) {
        flushParagraph(); closeList();
        if (codeOpen) flushCode();
        else { codeOpen = true; codeLines = []; }
        continue;
      }
      if (codeOpen) { codeLines.push(line); continue; }

      const trimmed = line.trim();
      if (!trimmed) { flushParagraph(); closeList(); continue; }

      const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushParagraph(); closeList();
        const level = heading[1].length;
        out.push(`<h${level}>${inlineMarkdown(heading[2], baseUrl)}</h${level}>`);
        continue;
      }

      const bullet = trimmed.match(/^[-*+]\s+(.+)$/);
      if (bullet) {
        flushParagraph();
        if (!listOpen) { out.push("<ul>"); listOpen = true; }
        out.push(`<li>${inlineMarkdown(bullet[1], baseUrl)}</li>`);
        continue;
      }

      if (trimmed.startsWith(">")) {
        flushParagraph(); closeList();
        out.push(`<blockquote>${inlineMarkdown(trimmed.replace(/^>\s?/, ""), baseUrl)}</blockquote>`);
        continue;
      }

      paragraph.push(trimmed);
    }

    flushParagraph(); closeList(); flushCode();
    return out.join("\n");
  }

  function cleanReaderMarkdown(text) {
    const value = String(text || "");
    const marker = value.indexOf("Markdown Content:");
    if (marker >= 0) return value.slice(marker + "Markdown Content:".length).trim();
    return value.trim();
  }

  function searchResultsFromMarkdown(markdown) {
    const lines = String(markdown || "").replace(/\r/g, "").split("\n");
    const results = [];
    let current = null;

    const pushCurrent = () => {
      if (current?.url && current?.title) results.push(current);
      current = null;
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      const mdLink = line.match(/^#{0,3}\s*\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
      if (mdLink) {
        pushCurrent();
        current = { title: mdLink[1].trim(), url: mdLink[2].trim(), snippet: "" };
        continue;
      }

      const numbered = line.match(/^\d+[.)]\s+(.+?)\s+-\s+(https?:\/\/\S+)$/);
      if (numbered) {
        pushCurrent();
        current = { title: numbered[1].trim(), url: numbered[2].trim(), snippet: "" };
        continue;
      }

      const plainUrl = line.match(/^(https?:\/\/\S+)$/);
      if (plainUrl && !current) {
        current = { title: plainUrl[1], url: plainUrl[1], snippet: "" };
        continue;
      }

      if (current && !current.snippet && !/^Title:|^URL Source:/i.test(line)) {
        current.snippet = line.replace(/^[-*]\s*/, "");
      }
    }
    pushCurrent();

    // Fallback: collect any markdown links if the result format changed.
    if (!results.length) {
      const rx = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
      let match;
      while ((match = rx.exec(String(markdown || ""))) && results.length < 12) {
        results.push({ title: match[1], url: match[2], snippet: "" });
      }
    }

    const seen = new Set();
    return results.filter(item => {
      const url = normalizeReaderUrl(item.url);
      if (!url || seen.has(url)) return false;
      seen.add(url);
      item.url = url;
      return true;
    }).slice(0, 12);
  }

  async function fetchCompatText(endpoint, extraHeaders = {}) {
    const cacheKey = endpoint + "|" + JSON.stringify(extraHeaders);
    const cached = browserCompatCache.get(cacheKey);
    if (cached && Date.now() - cached.time < 5 * 60 * 1000) return cached.text;
    const response = await fetch(endpoint, {
      method: "GET", mode: "cors", credentials: "omit", redirect: "follow", cache: "no-store",
      headers: { "Accept": "text/plain, text/markdown, application/json;q=0.5, */*;q=0.1", ...extraHeaders }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    browserCompatCache.set(cacheKey, { time: Date.now(), text });
    return text;
  }

  async function fetchReaderWithFallback(safe) {
    const endpoint = `https://r.jina.ai/${safe}`;
    try {
      return { source: "Reader", text: await fetchCompatText(endpoint) };
    } catch (firstError) {
      try {
        const text = await fetchCompatText(endpoint, { "X-Engine": "browser", "X-Timeout": "15", "X-With-Iframe": "true" });
        return { source: "Reader browser", text };
      } catch { throw firstError; }
    }
  }

  function htmlToCompatHtml(rawHtml, baseUrl) {
    const doc = new DOMParser().parseFromString(String(rawHtml || ""), "text/html");
    doc.querySelectorAll("script,style,noscript,template,svg,canvas,iframe,object,embed,form,input,button,select,textarea").forEach(node => node.remove());
    const source = doc.querySelector("article, main, [role='main']") || doc.body;
    if (!source) return "";
    const nodes = [...source.querySelectorAll("h1,h2,h3,p,blockquote,pre,li,a,img")].slice(0, 450);
    const out = [];
    for (const node of nodes) {
      const tag = node.tagName.toLowerCase();
      if (tag === "img") {
        const src = normalizeReaderUrl(node.getAttribute("src") || node.getAttribute("data-src") || "", baseUrl);
        if (src) out.push(`<img src="${escapeAttribute(src)}" alt="${escapeAttribute(node.getAttribute("alt") || "")}" loading="lazy">`);
        continue;
      }
      if (tag === "a") {
        const href = normalizeReaderUrl(node.getAttribute("href") || "", baseUrl);
        const text = String(node.textContent || "").trim();
        if (href && text) out.push(`<p><a href="#" data-browser-url="${escapeAttribute(href)}">${esc(text)}</a></p>`);
        continue;
      }
      const text = String(node.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) continue;
      if (tag === "h1") out.push(`<h1>${esc(text)}</h1>`);
      else if (tag === "h2") out.push(`<h2>${esc(text)}</h2>`);
      else if (tag === "h3") out.push(`<h3>${esc(text)}</h3>`);
      else if (tag === "blockquote") out.push(`<blockquote>${esc(text)}</blockquote>`);
      else if (tag === "pre") out.push(`<pre>${esc(text)}</pre>`);
      else if (tag === "li") out.push(`<p>• ${esc(text)}</p>`);
      else out.push(`<p>${esc(text)}</p>`);
    }
    return out.join("\n");
  }

  async function fetchAllOriginsCompat(safe) {
    const endpoint = `https://api.allorigins.win/raw?url=${encodeURIComponent(safe)}`;
    const raw = await fetchCompatText(endpoint, { "Accept": "text/html,application/xhtml+xml,text/plain;q=0.8,*/*;q=0.1" });
    const html = htmlToCompatHtml(raw, safe);
    if (!html) throw new Error("Konten HTML kosong");
    return html;
  }

  async function renderSearchCompat(safe, query) {
    const requestToken = ++browserCompatRequestToken;
    renderBrowserLoading(safe, "Google", `Mencari “${query}”…`);

    try {
      // Search API expects the query in ?q=. The old path-style URL
      // (`s.jina.ai/<query>`) returns an error and caused every Google search
      // in the simulator to end on “Halaman tidak dapat dimuat”.
      const endpoint = `https://s.jina.ai/?q=${encodeURIComponent(query)}`;
      const markdown = await fetchCompatText(endpoint);
      if (requestToken !== browserCompatRequestToken || state.browser.current !== safe || browserMode() !== "compat") return;
      const results = searchResultsFromMarkdown(markdown);
      if (!results.length) throw new Error("Hasil pencarian tidak terbaca");

      const cards = results.map(item => {
        let host = item.url;
        try { host = new URL(item.url).hostname.replace(/^www\./, ""); } catch {}
        return `
          <article class="sim-browser-search-result">
            <small>${esc(host)}</small>
            <a href="#" data-browser-url="${escapeAttribute(item.url)}">${esc(item.title)}</a>
            ${item.snippet ? `<p>${esc(item.snippet)}</p>` : ""}
          </article>
        `;
      }).join("");

      renderBrowserChrome(`
        <div class="sim-browser-compat sim-browser-search-results">
          <div class="sim-browser-search-head"><span class="sim-browser-search-g">G</span><strong>${esc(query)}</strong></div>
          ${cards}
          <div class="sim-browser-reader-note">Hasil ditampilkan melalui layanan pencarian kompatibilitas karena browser web tidak mengizinkan halaman induk menangkap klik di dalam Google iframe lintas-origin.</div>
        </div>
      `, safe, "Google", "compat");
    } catch (error) {
      if (requestToken !== browserCompatRequestToken || state.browser.current !== safe) return;

      renderBrowserError(safe, "Layanan pencarian kompatibilitas sedang tidak tersedia. Tekan Coba lagi; tampilan Google asli tetap tersedia melalui tombol ◎.", "Google");
    } finally {
      // A newer navigation invalidates this response through requestToken.
    }
  }

  async function renderReaderCompat(safe, label = "Chrome") {
    const requestToken = ++browserCompatRequestToken;
    renderBrowserLoading(safe, label, `Membuka ${browserLabel(safe, label)}…`);
    try {
      const reader = await fetchReaderWithFallback(safe);
      if (requestToken !== browserCompatRequestToken || state.browser.current !== safe || browserMode() !== "compat") return;
      const markdown = cleanReaderMarkdown(reader.text);
      if (!markdown) throw new Error("Dokumen kosong");
      let title = browserLabel(safe, label);
      const titleMatch = reader.text.match(/^Title:\s*(.+)$/mi);
      if (titleMatch?.[1]) title = titleMatch[1].trim();
      renderBrowserChrome(`<div class="sim-browser-compat sim-browser-reader"><div class="sim-browser-source-badge">${esc(reader.source)}</div><header class="sim-browser-reader-head"><small>${esc(browserLabel(safe, label))}</small><h1>${esc(title)}</h1></header>${markdownToReaderHtml(markdown, safe)}<div class="sim-browser-reader-note">Konten ditampilkan dalam mode kompatibilitas. Jika Reader utama ditolak, Chrome Simulator otomatis mencoba fallback HTML publik.</div></div>`, safe, label, "compat");
      return;
    } catch {
      try {
        const html = await fetchAllOriginsCompat(safe);
        if (requestToken !== browserCompatRequestToken || state.browser.current !== safe || browserMode() !== "compat") return;
        renderBrowserChrome(`<div class="sim-browser-compat sim-browser-reader"><div class="sim-browser-source-badge">Fallback HTML</div><header class="sim-browser-reader-head"><small>${esc(browserLabel(safe, label))}</small><h1>${esc(browserLabel(safe, label))}</h1></header>${html}<div class="sim-browser-reader-note">Halaman ini memakai fallback HTML publik. Script, login, dan session situs asli tidak dijalankan di mode ini.</div></div>`, safe, label, "compat");
        return;
      } catch {
        if (requestToken !== browserCompatRequestToken || state.browser.current !== safe) return;
        renderBrowserError(safe, "Website menolak Reader dan fallback HTML publik. Coba lagi, tampilan asli (◎), atau buka situs penuh (↗).", label);
      }
    }
  }

  function renderOriginalBrowser(safe, label = "Chrome", options = {}) {
    const frameUrl = originalEmbeddableUrl(safe);
    const note = String(options.note || "Jika halaman menampilkan ‘refused to connect’, tekan ▤ untuk kembali ke mode kompatibilitas.");
    renderBrowserChrome(`
      <iframe
        id="stableBrowserFrame"
        src="${escapeAttribute(frameUrl)}"
        title="Chrome Android Simulator"
        referrerpolicy="origin-when-cross-origin"
        allow="clipboard-read; clipboard-write; autoplay; fullscreen; geolocation; camera; microphone">
      </iframe>
      <div class="sim-browser-note sim-browser-static-help">${esc(note)}</div>
    `, safe, label, "original");
    requestAnimationFrame(fitBrowserMobileViewport);
    setTimeout(fitBrowserMobileViewport, 120);
  }

  function bindBrowserCompatNavigation() {
    const host = root.querySelector(".sim-browser-frame-wrap");
    if (!host || host.dataset.compatNavBound === "1") return;
    host.dataset.compatNavBound = "1";
    host.addEventListener("click", event => {
      const link = event.target instanceof Element
        ? event.target.closest("[data-browser-url]")
        : null;
      if (!link) return;
      const target = String(link.dataset.browserUrl || "");
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      navigateBrowser(target);
    });
  }

  function renderBrowser(url = state.browser.current, label = "Chrome", options = {}) {
    const safe = normalizeUrl(url, false);
    state.browser.current = safe;
    if (options.mode) setBrowserMode(options.mode);
    if (!state.browser.viewMode) state.browser.viewMode = "compat";
    saveState();

    if (browserMode() === "original") {
      renderOriginalBrowser(safe, label);
      return;
    }

    if (isGoogleHome(safe)) {
      renderLocalGoogleHome(safe);
      bindBrowserCompatNavigation();
      return;
    }

    if (isGoogleScholar(safe)) {
      void renderScholarCompat(safe).then(bindBrowserCompatNavigation);
      return;
    }

    const query = googleQueryFromUrl(safe);
    if (query) {
      void renderSearchCompat(safe, query).then(bindBrowserCompatNavigation);
      return;
    }

    void renderReaderCompat(safe, label).then(bindBrowserCompatNavigation);
  }

  function navigateBrowser(raw) {
    const next = normalizeUrl(raw, true);
    state.browser.history = state.browser.history.slice(0, state.browser.index + 1);
    state.browser.history.push(next);
    state.browser.index = state.browser.history.length - 1;
    state.browser.current = next;
    state.browser.viewMode = "compat";
    saveState();
    renderBrowser(next, browserLabel(next));
  }

  function browserStep(direction) {
    const nextIndex = state.browser.index + direction;
    if (nextIndex < 0 || nextIndex >= state.browser.history.length) return;

    state.browser.index = nextIndex;
    state.browser.current = state.browser.history[nextIndex];
    state.browser.viewMode = "compat";
    saveState();
    renderBrowser(state.browser.current, browserLabel(state.browser.current));
  }

  function openBrowser(url = googleHomeUrl(), label = "Chrome") {
    const normalized = normalizeUrl(url, false);
    if (state.browser.history[state.browser.index] !== normalized) {
      state.browser.history = state.browser.history.slice(0, state.browser.index + 1);
      state.browser.history.push(normalized);
      state.browser.index = state.browser.history.length - 1;
    }

    state.browser.current = normalized;
    state.browser.viewMode = "compat";
    saveState();
    renderBrowser(normalized, label);
  }

  /* =========================================================
     OPEN CORE APP
     ========================================================= */

  function nextFrame() {
    return new Promise(resolve => requestAnimationFrame(resolve));
  }

  async function openCoreApp(appId) {
    const targetApp = String(appId || "").trim();
    if (!targetApp) return false;

    const mediaVisible =
      targetApp === "spotify"
        ? !!root.querySelector(".spotify-live-app")
        : (
            targetApp === "youtube"
              ? !!root.querySelector(".youtube-live-app:not(.music)")
              : (
                  targetApp === "youtube-music"
                    ? !!root.querySelector(".youtube-live-app.music")
                    : false
                )
          );

    if (mediaVisible) {
      const shell = mediaShellForApp(targetApp);
      ensureMediaPlaceholder(shell, targetApp);
      positionPersistentMedia(shell);
      return true;
    }

    let button = root.querySelector(`[data-open-app="${CSS.escape(targetApp)}"]`);
    if (button instanceof HTMLElement) {
      button.click();
      await nextFrame();
      return true;
    }

    const home = document.querySelector('[data-sim-command="home"]');
    if (home instanceof HTMLElement) home.click();

    await nextFrame();
    await nextFrame();

    button = root.querySelector(`[data-open-app="${CSS.escape(targetApp)}"]`);
    if (button instanceof HTMLElement) {
      button.click();
      await nextFrame();
      return true;
    }

    /*
     * Do not keep forcing Home if the app is not present on the current
     * page. Media must continue in the persistent iframe regardless.
     */
    return false;
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
      const mediaApp = state.media.app || "spotify";
      state.islandExpanded = false;
      saveState();
      renderIsland(true);
      void openCoreApp(mediaApp);
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

    if (action === "browser-retry") {
      state.browser.viewMode = "compat";
      saveState();
      renderBrowser(state.browser.current || googleHomeUrl(), browserLabel(state.browser.current || googleHomeUrl()), { mode: "compat" });
      return;
    }

    if (action === "browser-toggle-mode" || action === "browser-static-reader") {
      const nextMode = browserMode() === "original" ? "compat" : "original";
      setBrowserMode(nextMode);
      renderBrowser(state.browser.current || googleHomeUrl(), browserLabel(state.browser.current || googleHomeUrl()), { mode: nextMode });
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
    event.stopImmediatePropagation();

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
    if (state.media.playing && !document.getElementById("androidDynamicIsland")) {
      renderIsland(true);
    }

    if (dialog && !dialog.open) return;

    if (state.stopwatch.running || root.querySelector(".enhancer-stopwatch")) {
      syncStopwatchUi();
      updateIslandTime();
    }

    if (state.media.playing) {
      const appId = appIdFromCurrentMediaView();

      if (root.querySelector(".quick-shade, .axion-notification-shade")) {
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

  const simulatorOpenButton = document.getElementById("phoneSimBtn");

  simulatorOpenButton?.addEventListener("click", event => {
    if (dialog?.open || !root.firstElementChild) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    try {
      dialog.showModal();
    } catch {
      dialog.setAttribute("open", "");
    }

    renderIsland(true);
    syncMediaNotification();

    if (state.media.playing) {
      const appId = appIdFromCurrentMediaView();

      if (appId === state.media.app && !root.querySelector(".quick-shade, .axion-notification-shade")) {
        ensureMediaPlaceholder(mediaShellForApp(appId), appId);
        positionPersistentMedia(mediaShellForApp(appId));
      } else {
        parkPersistentMedia();
      }
    }
  }, true);

  window.__waifuMediaV11 = {
    version: "12",
    active() {
      return !!state.media.playing;
    },
    app() {
      return state.media.app || "";
    },
    iframeAlive() {
      return !!persistentMediaFrame();
    }
  };

  ensureIsland();
  ensurePersistentMediaHost();
  enhanceCurrentView();
})();