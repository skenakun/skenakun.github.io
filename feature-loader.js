(() => {
  "use strict";

  /*
   * Stability hotfix
   * Baseline: 3695b75b5ecbd94a9e5adb49ffb41e9183488ca5
   *
   * Goals:
   * - no stuck loading on Ponsel / Mini Game
   * - Mode Ringan stays synchronized with script.js
   * - enhancer is optional and never blocks the Android core
   */

  const loadedScripts = new Map();
  const loadedCss = new Set();
  const optionalStarted = new Set();

  const PERFORMANCE_MODE_KEY = "waifuPerformanceMode";
  const RESOURCE_TIMEOUT = 8000;

  function timeout(promise, ms, label) {
    let timer = null;
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timeout`)), ms);
      })
    ]).finally(() => {
      if (timer) clearTimeout(timer);
    });
  }

  function loadCss(href) {
    if (loadedCss.has(href)) return Promise.resolve();

    const existing = [...document.querySelectorAll("link[rel='stylesheet']")]
      .find(link => link.getAttribute("href") === href || link.dataset.lazyHref === href);

    if (existing) {
      loadedCss.add(href);
      return Promise.resolve();
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.lazyHref = href;

    const task = new Promise((resolve, reject) => {
      link.onload = () => {
        loadedCss.add(href);
        resolve();
      };
      link.onerror = () => reject(new Error(`CSS gagal dimuat: ${href}`));
    });

    document.head.appendChild(link);

    // CSS must not be allowed to block feature opening forever.
    return timeout(task, RESOURCE_TIMEOUT, href).catch(error => {
      console.warn(error.message);
    });
  }

  function loadScript(src) {
    if (loadedScripts.has(src)) return loadedScripts.get(src);

    const existing = [...document.scripts]
      .find(script => script.getAttribute("src") === src || script.dataset.lazySrc === src);

    if (existing?.dataset.lazyLoaded === "1") {
      return Promise.resolve();
    }

    const task = new Promise((resolve, reject) => {
      const script = existing || document.createElement("script");

      if (!existing) {
        script.src = src;
        script.defer = true;
        script.dataset.lazySrc = src;
        document.body.appendChild(script);
      }

      const done = () => {
        cleanup();
        script.dataset.lazyLoaded = "1";
        resolve();
      };

      const fail = () => {
        cleanup();
        reject(new Error(`Script gagal dimuat: ${src}`));
      };

      const cleanup = () => {
        script.removeEventListener("load", done);
        script.removeEventListener("error", fail);
      };

      script.addEventListener("load", done, { once: true });
      script.addEventListener("error", fail, { once: true });

      if (script.dataset.lazyLoaded === "1") {
        cleanup();
        resolve();
      }
    });

    const wrapped = timeout(task, RESOURCE_TIMEOUT, src).catch(error => {
      loadedScripts.delete(src);
      throw error;
    });

    loadedScripts.set(src, wrapped);
    return wrapped;
  }

  function clearLoading(button) {
    button?.classList.remove("feature-loading");
    button?.removeAttribute("aria-busy");
  }

  function beginLoading(button) {
    button?.classList.add("feature-loading");
    button?.setAttribute("aria-busy", "true");
  }

  function loadOptionalAssets(key, cssList, jsList) {
    if (optionalStarted.has(key)) return;
    optionalStarted.add(key);

    (async () => {
      try {
        for (const css of cssList) await loadCss(css);
        for (const js of jsList) await loadScript(js);
      } catch (error) {
        // The Android core must stay usable even if an optional enhancer fails.
        console.warn(`Optional feature "${key}" dilewati`, error);
      }
    })();
  }

  function prepareFeature({ buttonId, css, js, optionalCss = [], optionalJs = [] }) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    clearLoading(button);

    const ensureCore = async () => {
      loadCss(css);
      await loadScript(js);
    };

    const warmup = () => {
      ensureCore()
        .then(() => loadOptionalAssets(buttonId, optionalCss, optionalJs))
        .catch(() => {});
    };

    button.addEventListener("pointerenter", warmup, { once: true, passive: true });
    button.addEventListener("focus", warmup, { once: true, passive: true });

    button.addEventListener("click", async event => {
      if (button.dataset.featureReady === "1") return;

      event.preventDefault();
      event.stopImmediatePropagation();

      beginLoading(button);

      try {
        await ensureCore();

        button.dataset.featureReady = "1";
        clearLoading(button);

        // Optional assets load after the base simulator has become usable.
        loadOptionalAssets(buttonId, optionalCss, optionalJs);

        queueMicrotask(() => button.click());
      } catch (error) {
        clearLoading(button);
        console.error(error);
        button.title = "Fitur gagal dimuat. Muat ulang halaman lalu coba lagi.";
      }
    }, true);
  }

  /* =========================================================
     MODE RINGAN
     ========================================================= */

  function getLiteEnabled() {
    try {
      return localStorage.getItem(PERFORMANCE_MODE_KEY) === "lite";
    } catch {
      return document.documentElement.classList.contains("performance-lite");
    }
  }

  function currentLanguage() {
    try {
      return localStorage.getItem("waifuLanguage") === "en" ? "en" : "id";
    } catch {
      return document.documentElement.lang === "en" ? "en" : "id";
    }
  }

  function syncLiteButton(button) {
    if (!button) return;

    const enabled = getLiteEnabled();
    const en = currentLanguage() === "en";

    button.classList.toggle("is-active", enabled);
    button.setAttribute("aria-pressed", String(enabled));
    button.title = enabled
      ? (en ? "Disable Lite Mode" : "Nonaktifkan Mode Ringan")
      : (en ? "Enable Lite Mode" : "Aktifkan Mode Ringan");

    const label = button.querySelector("[data-lite-label]");
    if (label) label.textContent = en ? "Lite Mode" : "Mode Ringan";
  }

  function ensureLiteButton() {
    let button = document.getElementById("performanceToggle");
    if (button) {
      syncLiteButton(button);
      return;
    }

    const actions = document.querySelector(".top-actions");
    const languageToggle = document.getElementById("languageToggle");
    if (!actions) return;

    button = document.createElement("button");
    button.type = "button";
    button.id = "performanceToggle";
    button.className = "icon-button performance-toggle";
    button.innerHTML = `
      <span class="performance-toggle-icon" aria-hidden="true">⚡</span>
      <span class="desktop-only" data-lite-label>Mode Ringan</span>
    `;

    if (languageToggle) actions.insertBefore(button, languageToggle);
    else actions.appendChild(button);

    button.addEventListener("click", () => {
      const enabled = !getLiteEnabled();

      /*
       * IMPORTANT:
       * script.js owns the in-memory `performanceLite` state.
       * Calling its global function keeps localStorage, gallery rendering,
       * and the in-memory state synchronized.
       */
      if (typeof window.applyPerformanceMode === "function") {
        window.applyPerformanceMode(enabled, { announce: true });
      } else {
        try {
          localStorage.setItem(PERFORMANCE_MODE_KEY, enabled ? "lite" : "full");
        } catch {}
        document.documentElement.classList.toggle("performance-lite", enabled);
      }

      syncLiteButton(button);
    });

    languageToggle?.addEventListener("click", () => {
      setTimeout(() => syncLiteButton(button), 0);
    });

    syncLiteButton(button);
  }

  ensureLiteButton();

  /* =========================================================
     LAZY FEATURES
     ========================================================= */

  prepareFeature({
    buttonId: "miniGameBtn",
    css: "./minigame.css",
    js: "./minigame.js"
  });

  /* =========================================================
     ANDROID SIMULATOR V7 VISUAL BOOT
     ========================================================= */
  const ANDROID_CORE_STATE_KEY = "waifuPixel10Android17VideoMatchV3";
  const ANDROID_ENHANCER_STATE_KEY = "waifuAndroidEnhancerStableV2";
  const PHONE_RECOVERY_STAGE_KEY = "waifuPhoneBlankRecoveryV7";
  const PHONE_AUTO_OPEN_KEY = "waifuPhoneAutoOpenV7";

  function getPhoneRootStatus() {
    const root = document.getElementById("androidScreenRoot");
    if (!root) return { root: null, hasDom: false, visible: false, page: null };

    const page = root.firstElementChild;
    const hasDom = !!page && root.childElementCount > 0;

    if (!hasDom) {
      return { root, hasDom: false, visible: false, page: null };
    }

    const style = getComputedStyle(page);
    const rootStyle = getComputedStyle(root);
    const rect = page.getBoundingClientRect();

    const hiddenByCss =
      style.display === "none" ||
      style.visibility === "hidden" ||
      Number(style.opacity || "1") <= 0.01 ||
      rootStyle.display === "none" ||
      rootStyle.visibility === "hidden" ||
      Number(rootStyle.opacity || "1") <= 0.01;

    const hasGeometry = rect.width > 20 && rect.height > 20;
    const hasMeaningfulUi =
      page.matches(".a17-page, .home-page, .lock-page, .screen-off-page, .boot-page") ||
      page.querySelector("button, input, .home-content, .a17-topbar, .sim-app-content");

    return {
      root,
      page,
      hasDom,
      visible: !hiddenByCss && hasGeometry && !!hasMeaningfulUi
    };
  }

  function phoneRootHasContent() {
    return getPhoneRootStatus().visible;
  }

  function rescueVisibleAndroidRoot() {
    const status = getPhoneRootStatus();
    if (!status.root || !status.hasDom || status.visible) return status.visible;

    /*
     * V6 only checked childElementCount. That allowed a DOM tree that existed
     * but was visually hidden/collapsed to be treated as a healthy boot.
     * V7 repairs only the presentation layer. It does not rebuild the Android UI.
     */
    const { root, page } = status;

    root.hidden = false;
    root.removeAttribute("aria-hidden");
    root.style.setProperty("display", "block", "important");
    root.style.setProperty("visibility", "visible", "important");
    root.style.setProperty("opacity", "1", "important");
    root.style.setProperty("position", "relative", "important");
    root.style.setProperty("z-index", "1", "important");
    root.style.setProperty("min-height", "100%", "important");
    root.style.setProperty("overflow", "hidden", "important");

    page.hidden = false;
    page.removeAttribute("aria-hidden");
    page.style.setProperty("display", "block", "important");
    page.style.setProperty("visibility", "visible", "important");
    page.style.setProperty("opacity", "1", "important");
    page.style.setProperty("position", "relative", "important");
    page.style.setProperty("z-index", "2", "important");
    page.style.setProperty("width", "100%", "important");
    page.style.setProperty("min-height", "100%", "important");

    const after = getPhoneRootStatus();
    return after.visible;
  }

  function repairAndroidState(fullReset = false) {
    try {
      if (fullReset) {
        localStorage.removeItem(ANDROID_CORE_STATE_KEY);
        localStorage.removeItem(ANDROID_ENHANCER_STATE_KEY);
        return;
      }
      const raw = localStorage.getItem(ANDROID_CORE_STATE_KEY);
      const state = raw ? JSON.parse(raw) : {};
      state.view = "home";
      state.previous = "home";
      state.locked = false;
      state.screenOff = false;
      state.shade = false;
      state.shadePanel = "quick";
      state.longPressMenu = false;
      state.activeSimApp = "youtube";
      state.appInfoId = "youtube";
      state.screenRecord = false;
      state.screenRecordStart = 0;
      if (!["auto", "id", "en"].includes(state.deviceLanguage)) state.deviceLanguage = "auto";
      if (!Number.isFinite(Number(state.brightness))) state.brightness = 78;
      if (![4,5,6].includes(Number(state.homeCols))) state.homeCols = 5;
      if (![4,5,6].includes(Number(state.layoutDraft))) state.layoutDraft = Number(state.homeCols) || 5;
      if (typeof state.homeWallpaper !== "string" || !/^waifu-\d{2}$/.test(state.homeWallpaper)) state.homeWallpaper = "waifu-31";
      if (typeof state.lockWallpaper !== "string" || !/^waifu-\d{2}$/.test(state.lockWallpaper)) state.lockWallpaper = "waifu-25";
      localStorage.setItem(ANDROID_CORE_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Android state repair gagal, state akan direset.", error);
      try { localStorage.removeItem(ANDROID_CORE_STATE_KEY); } catch {}
    }
  }

  function renderPhoneRecoveryMessage() {
    const root = document.getElementById("androidScreenRoot");
    if (!root || root.childElementCount > 0) return;
    root.innerHTML = `<div style="height:100%;display:grid;place-items:center;padding:22px;text-align:center;font-family:inherit;color:#292631;background:#eef0ff"><div><div style="font-size:28px;margin-bottom:10px">G</div><strong style="display:block;font-size:14px;margin-bottom:6px">Simulator gagal memulai</strong><small style="display:block;line-height:1.45;opacity:.72;margin-bottom:14px">State simulator sudah diperbaiki. Muat ulang halaman satu kali untuk menjalankan Android.</small><button id="androidRecoveryReload" type="button" style="border:0;border-radius:999px;padding:10px 16px;font-weight:800;background:#6750a4;color:white">Muat ulang</button></div></div>`;
    root.querySelector("#androidRecoveryReload")?.addEventListener("click", () => location.reload());
  }

  function preparePhoneFeature({ buttonId, css, js, optionalCss = [], optionalJs = [] }) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    clearLoading(button);
    let optionalScheduled = false;

    const ensureCore = async () => {
      loadCss(css);
      await loadScript(js);
      button.dataset.featureReady = "1";
      clearLoading(button);
    };

    const startOptionalAfterHealthyRender = () => {
      if (optionalScheduled || !phoneRootHasContent()) return;
      optionalScheduled = true;
      window.setTimeout(() => loadOptionalAssets(buttonId, optionalCss, optionalJs), 220);
      try { sessionStorage.removeItem(PHONE_RECOVERY_STAGE_KEY); } catch {}
    };

    const verifyBoot = () => {
      const dialog = document.getElementById("phoneSimDialog");
      if (!dialog?.open) return;

      if (phoneRootHasContent()) {
        startOptionalAfterHealthyRender();
        return;
      }

      // Important: a DOM tree can exist while the page is visually blank.
      if (rescueVisibleAndroidRoot()) {
        startOptionalAfterHealthyRender();
        return;
      }

      const home = document.querySelector('[data-sim-command="home"]');
      if (home instanceof HTMLElement) {
        try { home.click(); } catch {}
      }

      window.setTimeout(() => {
        if (phoneRootHasContent() || rescueVisibleAndroidRoot()) {
          startOptionalAfterHealthyRender();
          return;
        }

        let stage = 0;
        try {
          stage = Number(sessionStorage.getItem(PHONE_RECOVERY_STAGE_KEY) || "0");
        } catch {}

        if (stage < 1) {
          repairAndroidState(false);
          try {
            sessionStorage.setItem(PHONE_RECOVERY_STAGE_KEY, "1");
            sessionStorage.setItem(PHONE_AUTO_OPEN_KEY, "1");
          } catch {}
          location.reload();
          return;
        }

        if (stage < 2) {
          repairAndroidState(true);
          try {
            sessionStorage.setItem(PHONE_RECOVERY_STAGE_KEY, "2");
            sessionStorage.setItem(PHONE_AUTO_OPEN_KEY, "1");
          } catch {}
          location.reload();
          return;
        }

        renderPhoneRecoveryMessage();
      }, 360);
    };
    const openAfterCore = async () => {
      beginLoading(button);
      try {
        await ensureCore();
        queueMicrotask(() => {
          button.click();
          window.setTimeout(verifyBoot, 80);
          window.setTimeout(verifyBoot, 320);
          window.setTimeout(verifyBoot, 900);
        });
      } catch (error) {
        clearLoading(button);
        console.error(error);
        button.title = "Simulator Android gagal dimuat. Muat ulang halaman lalu coba lagi.";
      }
    };

    const warmCore = () => ensureCore().catch(() => {});
    button.addEventListener("pointerenter", warmCore, {once:true, passive:true});
    button.addEventListener("pointerdown", warmCore, {once:true, passive:true});
    button.addEventListener("focus", warmCore, {once:true, passive:true});

    button.addEventListener("click", event => {
      if (button.dataset.featureReady === "1") {
        window.setTimeout(verifyBoot, 80);
        window.setTimeout(verifyBoot, 320);
        window.setTimeout(verifyBoot, 900);
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      openAfterCore();
    }, true);

    let autoOpen = false;
    try { autoOpen = sessionStorage.getItem(PHONE_AUTO_OPEN_KEY) === "1"; if (autoOpen) sessionStorage.removeItem(PHONE_AUTO_OPEN_KEY); } catch {}
    if (autoOpen) {
      window.setTimeout(async () => {
        try {
          await ensureCore();
          button.click();
          window.setTimeout(verifyBoot, 100);
          window.setTimeout(verifyBoot, 380);
          window.setTimeout(verifyBoot, 950);
        }
        catch (error) { console.error(error); }
      }, 100);
    }
  }

  preparePhoneFeature({
    buttonId: "phoneSimBtn",
    css: "./androidsim.css",
    js: "./androidsim.js",
    optionalCss: [
      "./androidsim-enhancer.css?v=785-blank-v7",
      "./androidsim-media-persistence.css?v=785-blank-v7",
      "./androidsim-blank-rescue.css?v=785-blank-v7"
    ],
    optionalJs: ["./androidsim-enhancer.js?v=785-blank-v7"]
  });
})();