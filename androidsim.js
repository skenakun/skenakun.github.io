(() => {
  "use strict";

  const $ = (s, base = document) => base.querySelector(s);
  const $$ = (s, base = document) => [...base.querySelectorAll(s)];

  const dialog = $("#phoneSimDialog");
  const openBtn = $("#phoneSimBtn");
  const closeBtn = $("#closePhoneSim");
  const root = $("#androidScreenRoot");
  const phone = $("#pixelScreen");
  const statusBar = $("#androidStatusbar");
  const gesture = $("#androidGesturePill");
  const power = $("#pixelPowerButton");
  const volume = $("#pixelVolumeButton");

  if (!dialog || !openBtn || !root || !phone) return;

  const STORE = "waifuPixel10Android17VideoMatchV3";

  const wallpapers = Array.from({ length: 34 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return { id: `waifu-${n}`, src: `./assets/waifu-${n}.jpg`, label: `Waifu ${n}` };
  });

  const palettes = [
    { id: "rose", accent: "#9d5670", soft: "#f3dce6", parts: ["#9b4e65", "#f0a6bb", "#bd86b5", "#ead4de"] },
    { id: "mono", accent: "#6f747c", soft: "#e2e4e8", parts: ["#101010", "#d4d4d4", "#777b80", "#b7b9bc"] },
    { id: "mauve", accent: "#88716f", soft: "#eee0dd", parts: ["#755f5d", "#e4cdc8", "#bd90aa", "#dfc6d1"] },
    { id: "pink", accent: "#8d66df", soft: "#e7ddff", parts: ["#c80043", "#ffabc6", "#a174eb", "#efd1de"] },
    { id: "cyan", accent: "#00a9bb", soft: "#d5f2f5", parts: ["#b43750", "#7ad0d7", "#00a9bb", "#e3d4da"] },
    { id: "blue", accent: "#3f86ef", soft: "#d9e7ff", parts: ["#3f86ef", "#7caaf5", "#cfe0ff", "#a0c4fa"] },
    { id: "green", accent: "#71994b", soft: "#e2eed7", parts: ["#71994b", "#9dbc7e", "#d7e8c7", "#5d7f3e"] },
    { id: "slate", accent: "#7b8395", soft: "#e5e7ed", parts: ["#7b8395", "#a4a9b8", "#e2e5eb", "#636a78"] },
    { id: "violet", accent: "#7757c8", soft: "#e7ddff", parts: ["#7757c8", "#a48bdc", "#d9ceef", "#564096"] },
    { id: "ice", accent: "#3e8ab8", soft: "#d9eef8", parts: ["#3e8ab8", "#85bdda", "#d4ecf8", "#255e7b"] }
  ];

  const defaultState = {
    view: "home",
    previous: "home",
    locked: false,
    shade: false,
    longPressMenu: false,
    styleTab: "home",
    wallpaperTarget: "home",
    homeWallpaper: "waifu-31",
    lockWallpaper: "waifu-25",
    palette: "pink",
    colorTab: "wallpaper",
    dark: false,
    contrast: "default",
    iconStyle: "circle",
    homeCols: 5,
    layoutDraft: 5,
    clockStyle: 0,
    leftShortcut: "flashlight",
    rightShortcut: "camera",
    lockNotifications: true,
    notificationMode: "compact",
    seenNotificationIcons: true,
    silentNotifications: false,
    lockText: "",
    deviceControls: false,
    dynamicClock: true,
    nowPlaying: true,
    musicArtwork: false,
    liftToCheck: true,
    wakeForNotifications: true,
    wifi: true,
    bluetooth: true,
    airplane: false,
    flashlight: false,
    batterySaver: false,
    screenRecord: false,
    screenRecordStart: 0,
    brightness: 78,
    battery: 61,
    volume: 62,

    /* Android 17 System settings */
    deviceLanguage: "auto",
    installedLanguages: ["id"],
    region: "Indonesia",
    temperatureUnit: "default",
    measurementSystem: "default",
    firstDayOfWeek: "default",

    navigationMode: "gesture",
    navigationHint: true,
    showImeSwitcher: true,
    backGestureHeight: 100,
    backAnimation: true,
    backHaptic: true,
    assistantGesture: false,
    leftSensitivity: 52,
    rightSensitivity: 52,
    buttonOrder: "back-home-recent"
  };

  const strings = {
    id: {
      style: "Wallpaper & gaya", lock: "Layar kunci", home: "Layar utama", wallpaper: "Wallpaper",
      moreWallpaper: "Wallpaper lain", themePack: "Paket tema", noTheme: "Tanpa Tema", color: "Warna",
      contrast: "Kontras warna", contrastDefault: "Default", icons: "Ikon", iconDesc: "Default, Lingkaran",
      layout: "Tata letak", layoutSmall: "Kecil", clock: "Jam", shortcuts: "Pintasan", shortcutDesc: "Senter, Kamera",
      lockNotif: "Notifikasi di layar kunci", lockNotifDesc: "Kelola tampilan notifikasi dan informasi yang ditampilkan",
      moreLock: "Setelan layar kunci lainnya", moreLockDesc: "Privasi, Now Playing, dan lain-lain",
      addLockText: "Tambahkan teks di layar kunci", none: "Tidak ada", deviceControls: "Gunakan kontrol perangkat",
      deviceControlsDesc: "Tanpa membuka kunci ponsel", dynamicClock: "Jam dinamis",
      dynamicClockDesc: "Ukuran jam berubah menurut konten layar kunci", nowPlaying: "Now Playing",
      nowPlayingDesc: "Identifikasi lagu yang diputar di sekitar", appearanceTime: "Waktu kemunculan", musicArtwork: "Penampil musik",
      musicArtworkDesc: "Tampilkan Tampilan Ambien saat trek musik baru diputar", lift: "Angkat untuk memeriksa ponsel",
      liftDesc: "Aktif (Bangun sepenuhnya)", wake: "Aktifkan layar untuk notifikasi",
      wakeDesc: "Layar yang nonaktif akan menyala saat ada notifikasi baru", chooseColor: "Pilih warna untuk ikon, jam, dan lain-lain",
      wallpaperColor: "Warna wallpaper", otherColor: "Warna lain", darkTheme: "Tema gelap", apply: "Terapkan",
      iconDefault: "Default", iconCircle: "Lingkaran", iconMinimal: "Minimal", chooseLayout: "Tata letak",
      settings: "Setelan", searchSettings: "Telusuri setelan", aboutPhone: "Tentang ponsel",
      deviceName: "Nama perangkat", model: "Model", androidVersion: "Versi Android", build: "Nomor build simulator",
      securityUpdate: "Pembaruan keamanan", appList: "Daftar aplikasi", homeSettings: "Setelan layar utama", widgets: "Widget",
      wifi: "Wi-Fi", bluetooth: "Bluetooth", airplane: "Mode pesawat", saver: "Penghemat baterai", screenRecord: "Rekam layar",
      brightness: "Kecerahan", unlock: "Geser ke atas untuk membuka", rebooting: "Memulai ulang", volume: "Volume",
      camera: "Kamera", flashlight: "Senter", wallet: "Dompet", noShortcut: "Tidak ada", compact: "Ringkas",
      fullList: "Daftar lengkap", showOnLock: "Tampilkan di layar kunci", seenIcons: "Tampilkan ikon notifikasi yang telah dilihat",
      silent: "Tampilkan notifikasi senyap", colorUpdated: "Warna sistem diperbarui", wallpaperUpdated: "Wallpaper diterapkan",
      photoCaptured: "Foto simulasi diambil", pressHint: "Tekan lama untuk Wallpaper & gaya",

      system: "Sistem", systemDesc: "Bahasa, gestur", languageRegion: "Bahasa & wilayah",
      preferredLanguages: "Bahasa Pilihan", addLanguage: "Tambahkan bahasa", otherLanguageSettings: "Setelan bahasa lainnya",
      appLanguages: "Bahasa aplikasi", appLanguagesDesc: "Pilih bahasa untuk setiap aplikasi",
      speech: "Ucapan", speechDesc: "Kontrol pengenalan dan output ucapan", regionalPreferences: "Preferensi regional",
      region: "Wilayah", temperature: "Suhu", measurementSystem: "Sistem pengukuran",
      firstDayWeek: "Hari pertama dalam seminggu", useDefault: "Gunakan default",
      navigationMode: "Mode navigasi", gestureNavigation: "Navigasi gestur", threeButtonNavigation: "Navigasi 3 tombol",
      gestureNavigationDesc: "Geser dari bawah untuk Beranda. Geser dan tahan untuk Terbaru. Geser dari tepi untuk kembali.",
      threeButtonNavigationDesc: "Gunakan tombol di bagian bawah layar untuk Kembali, Beranda, dan Terbaru.",
      tryDemo: "Coba demo", navigationHint: "Navigation hint",
      navigationHintDesc: "Show navigation hint bar at the bottom of the screen",
      imeSwitcher: "Tampilkan ruang tombol IME",
      imeSwitcherDesc: "Aktifkan fitur peralihan cepat metode input untuk mengganti metode input atau menyembunyikan keyboard di layar.",
      backGestureHeight: "Tinggi gestur kembali", backGestureHeightDesc: "Tinggi layar berlaku untuk gestur kembali",
      full: "Penuh", bottom: "Bawah", backAnimation: "Animasi gestur kembali",
      backAnimationDesc: "Tampilkan animasi panah untuk gestur kembali", backHaptic: "Haptik gestur kembali",
      backHapticDesc: "Aktifkan efek getaran pada gestur kembali", digitalAssistant: "Asisten digital",
      assistantGesture: "Geser untuk memanggil asisten", assistantGestureDesc: "Geser ke atas dari pojok bawah untuk memanggil aplikasi asisten digital",
      backSensitivity: "Sensitivitas bagian belakang", leftEdge: "Tepi kiri", rightEdge: "Tepi kanan",
      low: "Rendah", high: "Tinggi", sensitivityNote: "Sensitivitas yang lebih tinggi mungkin memengaruhi fungsi gestur aplikasi di tepi layar.",
      buttonOrder: "Urutan tombol", backHomeRecent: "Kembali, Beranda, Terbaru", recentHomeBack: "Terbaru, Beranda, Kembali",
      selected: "Dipilih", languageAdded: "Bahasa ditambahkan", recents: "Terbaru",
      noRecentApps: "Belum ada aplikasi terbaru", systemInfo: "Setelan utama Android 17"
    },
    en: {
      style: "Wallpaper & style", lock: "Lock screen", home: "Home screen", wallpaper: "Wallpaper",
      moreWallpaper: "More wallpapers", themePack: "Theme pack", noTheme: "No theme", color: "Color",
      contrast: "Color contrast", contrastDefault: "Default", icons: "Icons", iconDesc: "Default, Circle",
      layout: "Layout", layoutSmall: "Small", clock: "Clock", shortcuts: "Shortcuts", shortcutDesc: "Flashlight, Camera",
      lockNotif: "Lock screen notifications", lockNotifDesc: "Manage notification appearance and information shown",
      moreLock: "More lock screen settings", moreLockDesc: "Privacy, Now Playing, and more",
      addLockText: "Add text on lock screen", none: "None", deviceControls: "Use device controls",
      deviceControlsDesc: "Without unlocking phone", dynamicClock: "Dynamic clock",
      dynamicClockDesc: "Clock size changes according to lock screen content", nowPlaying: "Now Playing",
      nowPlayingDesc: "Identify songs playing nearby", appearanceTime: "When to show", musicArtwork: "Music artwork",
      musicArtworkDesc: "Show Ambient Display when a new music track plays", lift: "Lift to check phone",
      liftDesc: "Active (Fully wake)", wake: "Wake screen for notifications",
      wakeDesc: "The inactive screen turns on for a new notification", chooseColor: "Choose a color for icons, clock, and more",
      wallpaperColor: "Wallpaper colors", otherColor: "Other colors", darkTheme: "Dark theme", apply: "Apply",
      iconDefault: "Default", iconCircle: "Circle", iconMinimal: "Minimal", chooseLayout: "Layout",
      settings: "Settings", searchSettings: "Search settings", aboutPhone: "About phone",
      deviceName: "Device name", model: "Model", androidVersion: "Android version", build: "Simulator build number",
      securityUpdate: "Security update", appList: "App list", homeSettings: "Home settings", widgets: "Widgets",
      wifi: "Wi-Fi", bluetooth: "Bluetooth", airplane: "Airplane mode", saver: "Battery Saver", screenRecord: "Screen record",
      brightness: "Brightness", unlock: "Swipe up to unlock", rebooting: "Restarting", volume: "Volume",
      camera: "Camera", flashlight: "Flashlight", wallet: "Wallet", noShortcut: "None", compact: "Compact",
      fullList: "Full list", showOnLock: "Show on lock screen", seenIcons: "Show icons for viewed notifications",
      silent: "Show silent notifications", colorUpdated: "System color updated", wallpaperUpdated: "Wallpaper applied",
      photoCaptured: "Simulated photo captured", pressHint: "Long press for Wallpaper & style",

      system: "System", systemDesc: "Languages, gestures", languageRegion: "Languages & region",
      preferredLanguages: "Preferred languages", addLanguage: "Add a language", otherLanguageSettings: "Other language settings",
      appLanguages: "App languages", appLanguagesDesc: "Choose a language for each app",
      speech: "Speech", speechDesc: "Control speech recognition and output", regionalPreferences: "Regional preferences",
      region: "Region", temperature: "Temperature", measurementSystem: "Measurement system",
      firstDayWeek: "First day of week", useDefault: "Use default",
      navigationMode: "Navigation mode", gestureNavigation: "Gesture navigation", threeButtonNavigation: "3-button navigation",
      gestureNavigationDesc: "Swipe up for Home. Swipe up and hold for Recents. Swipe in from either edge to go back.",
      threeButtonNavigationDesc: "Use buttons at the bottom of the screen for Back, Home, and Recents.",
      tryDemo: "Try demo", navigationHint: "Navigation hint",
      navigationHintDesc: "Show navigation hint bar at the bottom of the screen",
      imeSwitcher: "Show IME switcher button",
      imeSwitcherDesc: "Enable quick input-method switching while typing.",
      backGestureHeight: "Back gesture height", backGestureHeightDesc: "Screen height used for the back gesture",
      full: "Full", bottom: "Bottom", backAnimation: "Back gesture animation",
      backAnimationDesc: "Show the arrow animation for the back gesture", backHaptic: "Back gesture haptic",
      backHapticDesc: "Enable vibration feedback for the back gesture", digitalAssistant: "Digital assistant",
      assistantGesture: "Swipe to invoke assistant", assistantGestureDesc: "Swipe up from a bottom corner to invoke the digital assistant",
      backSensitivity: "Back sensitivity", leftEdge: "Left edge", rightEdge: "Right edge",
      low: "Low", high: "High", sensitivityNote: "Higher sensitivity may affect app gestures near the screen edge.",
      buttonOrder: "Button order", backHomeRecent: "Back, Home, Recents", recentHomeBack: "Recents, Home, Back",
      selected: "Selected", languageAdded: "Language added", recents: "Recents",
      noRecentApps: "No recent apps yet", systemInfo: "Android 17 main settings"
    }
  };

  function getLanguage() {
    if (state && state.deviceLanguage && state.deviceLanguage !== "auto") {
      return state.deviceLanguage;
    }
    return document.documentElement.lang?.toLowerCase().startsWith("en") ? "en" : "id";
  }
  function t(key) { return strings[getLanguage()][key] ?? strings.id[key] ?? key; }
  function loadState() {
    try { return { ...defaultState, ...JSON.parse(localStorage.getItem(STORE) || "{}") }; }
    catch { return { ...defaultState }; }
  }
  let state = loadState();
  let longPressTimer = null;
  let toastTimer = null;
  let volumeTimer = null;

  function save() { localStorage.setItem(STORE, JSON.stringify(state)); }
  function vibrate(ms = 5) { try { navigator.vibrate?.(ms); } catch {} }
  function wallpaperById(id) { return wallpapers.find(w => w.id === id) || wallpapers[0]; }
  function paletteById(id) { return palettes.find(p => p.id === id) || palettes[0]; }
  function currentTargetKey() { return state.styleTab === "lock" ? "lockWallpaper" : "homeWallpaper"; }
  function wallPaletteId(wallId) {
    const n = Number(wallId.split("-")[1] || 1);
    return ["violet", "mauve", "pink", "rose", "blue", "ice", "cyan", "slate", "green", "pink"][n % 10];
  }

  function formatTime() {
    return new Intl.DateTimeFormat(getLanguage() === "en" ? "en-US" : "id-ID", {
      hour: "2-digit", minute: "2-digit", hour12: false
    }).format(new Date()).replace(":", ".");
  }
  function formatDate() {
    return new Intl.DateTimeFormat(getLanguage() === "en" ? "en-US" : "id-ID", {
      weekday: "short", day: "numeric", month: "short"
    }).format(new Date());
  }
  function escapeHtml(value = "") {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  function applyTheme() {
    const p = paletteById(state.palette);
    phone.style.setProperty("--android-blue", p.accent);
    phone.style.setProperty("--android-blue-soft", p.soft);
    phone.style.setProperty("--home-wall", `url('${wallpaperById(state.homeWallpaper).src}')`);
    phone.style.setProperty("--lock-wall", `url('${wallpaperById(state.lockWallpaper).src}')`);
    phone.style.setProperty("--home-cols", String(state.homeCols));
    phone.classList.toggle("android-dark", !!state.dark);
    phone.style.opacity = String(0.68 + state.brightness / 312);

    const timeEl = $("#androidStatusTime");
    const batteryEl = $("#androidBatteryText");
    const wifiEl = $("#androidWifiIcon");
    const signalEl = $("#androidSignalIcon");
    if (timeEl) timeEl.textContent = formatTime();
    if (batteryEl) batteryEl.textContent = state.battery;
    if (wifiEl) wifiEl.style.opacity = state.wifi && !state.airplane ? "1" : ".25";
    if (signalEl) signalEl.style.opacity = state.airplane ? ".25" : "1";

    const recordPill = $("#androidRecordPill");
    if (recordPill) recordPill.hidden = !state.screenRecord;
    updateRecordingTime();
    syncSystemNavigation();
  }

  function syncSystemNavigation() {
    let buttonBar = $("#androidButtonNav", phone);
    if (!buttonBar) {
      buttonBar = document.createElement("div");
      buttonBar.id = "androidButtonNav";
      buttonBar.className = "pixel-three-button-nav";
      phone.appendChild(buttonBar);
    }

    const useButtons = state.navigationMode === "buttons";
    phone.classList.toggle("three-button-mode", useButtons);

    if (gesture) {
      gesture.hidden = useButtons || !state.navigationHint;
      gesture.setAttribute("aria-hidden", gesture.hidden ? "true" : "false");
    }

    buttonBar.hidden = !useButtons;
    if (!useButtons) return;

    const order = state.buttonOrder === "recent-home-back"
      ? ["recent", "home", "back"]
      : ["back", "home", "recent"];

    const icons = { back: "◀", home: "●", recent: "■" };
    buttonBar.innerHTML = order.map(action =>
      `<button type="button" data-system-nav="${action}" aria-label="${action}">${icons[action]}</button>`
    ).join("");

    $$("[data-system-nav]", buttonBar).forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.systemNav;
        if (action === "back") goBack();
        if (action === "home") {
          state.locked = false;
          navigate("home");
        }
        if (action === "recent") {
          state.locked = false;
          navigate("recents");
        }
      });
    });
  }

  function updateRecordingTime() {
    const el = $("#androidRecordTime");
    if (!el || !state.screenRecord) return;
    const seconds = Math.max(0, Math.floor((Date.now() - state.screenRecordStart) / 1000));
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    el.textContent = `${mm}.${ss}`;
  }

  function toast(message) {
    $(".toast", root)?.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    root.appendChild(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.remove(), 1300);
  }

  function showVolume() {
    $(".volume-toast", root)?.remove();
    const el = document.createElement("div");
    el.className = "volume-toast";
    el.innerHTML = `♫<br>${state.volume}%`;
    root.appendChild(el);
    clearTimeout(volumeTimer);
    volumeTimer = setTimeout(() => el.remove(), 1000);
  }

  function topbar(title, { back = true, apply = false, close = false } = {}) {
    return `<div class="a17-topbar ${title === t("style") ? "wallstyle-title" : ""}">
      ${back ? `<button class="a17-back" type="button" data-nav="back">‹</button>` : ""}
      ${close ? `<button class="a17-x" type="button" data-nav="back">×</button>` : ""}
      <h3>${title}</h3>
      ${apply ? `<button class="a17-apply" type="button" data-action="applyLayout">${t("apply")}</button>` : ""}
    </div>`;
  }
  function toggle(key) {
    return `<button class="a17-switch ${state[key] ? "on" : ""}" type="button" data-toggle="${key}" aria-label="${key}"></button>`;
  }
  function row({ title, desc = "", icon = "", nav = "", trailing = "" }) {
    return `<button class="a17-row" type="button" ${nav ? `data-nav="${nav}"` : ""}>
      <span class="a17-copy"><strong>${title}</strong>${desc ? `<span>${desc}</span>` : ""}</span>
      ${trailing || (icon ? `<span class="a17-trailing">${icon}</span>` : "")}
      ${nav && !icon && !trailing ? `<span class="a17-chevron">›</span>` : ""}
    </button>`;
  }

  function navigate(view, keepPrevious = true) {
    if (keepPrevious && state.view !== view) state.previous = state.view;
    state.view = view;
    state.longPressMenu = false;
    state.shade = false;
    save();
    render();
  }

  function goBack() {
    if (state.shade) {
      state.shade = false;
      render();
      return;
    }
    const parent = {
      wallpaperStyle: "home", color: "wallpaperStyle", icons: "wallpaperStyle", layout: "wallpaperStyle",
      clock: "wallpaperStyle", shortcuts: "wallpaperStyle", notifications: "wallpaperStyle", lockMore: "wallpaperStyle",
      wallpaperPicker: "wallpaperStyle", settings: "home", about: "settings", apps: "home", camera: "home",
      homeSettings: "home", system: "settings", languageRegion: "system", navigationMode: "system",
      gestureNavigation: "navigationMode", buttonNavigation: "navigationMode", recents: "home"
    };
    navigate(parent[state.view] || "home", false);
  }

  function setWallpaper(id) {
    const key = currentTargetKey();
    state[key] = id;
    state.palette = wallPaletteId(id);
    save();
    applyTheme();
    vibrate();
    toast(t("wallpaperUpdated"));
    render();
  }

  function renderHome() {
    const appIcons = [
      ["◎", "Instagram", "apps"], ["♪", "TikTok", "apps"], ["◉", "WA Busin...", "apps"], ["✦", "Nekogram", "apps"]
    ];
    root.innerHTML = `<div class="a17-page home-page" id="homePressSurface">
      <div class="home-wall"></div>
      <div class="home-content">
        <div class="home-weather"><strong>Besok 22°C / 12°C</strong><span>☀ Cerah</span></div>
        <div class="home-spacer"></div>
        <div class="home-icons">${appIcons.map(a => `<button class="home-app" type="button" data-nav="${a[2]}"><span class="home-app-icon">${a[0]}</span><small>${a[1]}</small></button>`).join("")}</div>
        <div class="home-digital-widget"><div><span>Waktu pemakaian<br>perangkat</span><strong>2 j, 18 mnt</strong></div><span>◔</span></div>
        <div class="home-dock">
          <button type="button" data-nav="apps"><span>☎</span></button><button type="button" data-nav="apps"><span>●</span></button>
          <button type="button" data-nav="apps"><span>G</span></button><button type="button" data-nav="apps"><span>♟</span></button>
          <button type="button" data-nav="camera"><span>◉</span></button>
        </div>
        <button class="home-search" type="button" data-nav="apps"><b>G</b><span>Telusuri</span><i>⌁ &nbsp; ◉</i></button>
      </div>
      ${state.longPressMenu ? renderLongPressMenu() : ""}
    </div>`;

    if (!state.longPressMenu) {
      const surface = $("#homePressSurface");
      surface?.addEventListener("pointerdown", e => {
        if (e.target.closest("button")) return;
        clearTimeout(longPressTimer);
        longPressTimer = setTimeout(() => {
          state.longPressMenu = true;
          vibrate(12);
          render();
        }, 520);
      });
      ["pointerup", "pointercancel", "pointerleave"].forEach(ev => surface?.addEventListener(ev, () => clearTimeout(longPressTimer)));
      surface?.addEventListener("contextmenu", e => {
        e.preventDefault();
        state.longPressMenu = true;
        render();
      });
    }
  }

  function renderLongPressMenu() {
    const picks = [state.homeWallpaper, "waifu-13", "waifu-20", "waifu-26"];
    return `<div class="home-menu-shade" data-action="dismissMenu"></div>
      <div class="home-longpress-menu">
        <div class="home-wall-strip">${picks.map(id => `<button class="home-wall-thumb ${id === state.homeWallpaper ? "active" : ""}" type="button" data-home-quick-wall="${id}" style="background-image:url('${wallpaperById(id).src}')"></button>`).join("")}</div>
        <button class="home-menu-item" type="button" data-action="openStyle"><span>◉</span><span>${t("style")}</span></button>
        <button class="home-menu-item" type="button" data-action="widgetToast"><span>▦</span><span>${t("widgets")}</span></button>
        <button class="home-menu-item" type="button" data-nav="apps"><span>▦</span><span>${t("appList")}</span></button>
        <button class="home-menu-item" type="button" data-nav="homeSettings"><span>⌂</span><span>${t("homeSettings")}</span></button>
      </div>`;
  }

  function previewPhone(kind, active) {
    if (kind === "lock") {
      return `<button class="phone-preview lock-preview ${active ? "" : "inactive"}" type="button" data-style-tab="lock"><span class="mini-lock-time">${formatTime().split(".").join("<br>")}</span></button>`;
    }
    return `<button class="phone-preview home-preview ${active ? "" : "inactive"}" type="button" data-style-tab="home"><span class="mini-home-ui"><span class="mini-home-spacer"></span><span class="mini-home-icons"><span></span><span></span><span></span><span></span></span><span class="mini-home-widget"></span><span class="mini-home-search"></span></span></button>`;
  }

  function renderWallpaperCarousel() {
    const base = state.styleTab === "lock" ? [state.lockWallpaper, "waifu-17", "waifu-08"] : [state.homeWallpaper, "waifu-31", "waifu-20"];
    return `<div class="wallpaper-carousel"><div class="wallpaper-carousel-track">${base.map(id => `<button class="carousel-thumb" type="button" data-carousel-wall="${id}" style="background-image:url('${wallpaperById(id).src}')"></button>`).join("")}</div>
      <button class="wallpaper-more" type="button" data-nav="wallpaperPicker">▧ ${t("moreWallpaper")}</button></div>`;
  }

  function renderWallpaperStyle() {
    const isHome = state.styleTab === "home";
    const magic = `<span class="a17-trailing"><span class="magic-wand">✣</span></span>`;
    const colorTrail = `<span class="a17-trailing"><span class="trailing-dot"></span></span>`;
    const contrastTrail = `<span class="a17-trailing">◉</span>`;
    const iconTrail = `<span class="a17-trailing"><span class="trailing-black"></span></span>`;
    const gridTrail = `<span class="a17-trailing"><span class="grid-nine">${"<i></i>".repeat(16)}</span></span>`;

    root.innerHTML = `<div class="a17-page wallstyle-page">
      ${topbar(t("style"))}
      <div class="wall-tabs"><button class="${!isHome ? "active" : ""}" data-style-tab="lock">${t("lock")}</button><button class="${isHome ? "active" : ""}" data-style-tab="home">${t("home")}</button></div>
      <div class="preview-area">${previewPhone("lock", !isHome)}${previewPhone("home", isHome)}</div>
      <button class="wallpaper-more" style="margin-top:-19px;margin-bottom:4px" type="button" data-nav="wallpaperPicker">▧ ${t("wallpaper")}</button>
      ${renderWallpaperCarousel()}
      <div class="a17-card wallstyle-list">
        ${row({ title: t("themePack"), desc: t("noTheme"), trailing: magic })}
        ${isHome ? row({ title: t("color"), nav: "color", trailing: colorTrail }) : row({ title: t("clock"), nav: "clock", trailing: `<span class="a17-trailing">8<br>30</span>` })}
        ${isHome ? row({ title: t("contrast"), desc: t("contrastDefault"), trailing: contrastTrail }) : row({ title: t("shortcuts"), desc: t("shortcutDesc"), nav: "shortcuts", trailing: `<span class="a17-trailing">▦</span>` })}
        ${isHome ? row({ title: t("icons"), desc: t("iconDesc"), nav: "icons", trailing: iconTrail }) : row({ title: t("lockNotif"), desc: t("lockNotifDesc"), nav: "notifications" })}
        ${isHome ? row({ title: t("layout"), desc: t("layoutSmall"), nav: "layout", trailing: gridTrail }) : row({ title: t("moreLock"), desc: t("moreLockDesc"), nav: "lockMore" })}
      </div>
    </div>`;
  }

  function renderColor() {
    const visible = state.colorTab === "wallpaper" ? palettes.slice(0, 5) : palettes.slice(5);
    root.innerHTML = `<div class="a17-page color-page">
      ${topbar(t("color"))}
      <div class="color-headline">${t("chooseColor")}</div>
      <div class="color-preview-phone"></div>
      <div class="color-panel">
        <div class="palette-row">${visible.map(p => `<button class="palette-choice ${state.palette === p.id ? "active" : ""}" type="button" data-palette="${p.id}" style="--c1:${p.parts[0]};--c2:${p.parts[1]};--c3:${p.parts[2]};--c4:${p.parts[3]}"></button>`).join("")}</div>
        <div class="color-dark-row"><strong>${t("darkTheme")}</strong>${toggle("dark")}</div>
      </div>
      <div class="color-segment"><button type="button" class="${state.colorTab === "wallpaper" ? "active" : ""}" data-color-tab="wallpaper">▧ ${t("wallpaperColor")}</button><button type="button" class="${state.colorTab === "other" ? "active" : ""}" data-color-tab="other">◇ ${t("otherColor")}</button></div>
    </div>`;
  }

  function renderIcons() {
    const choices = [["squircle", "▣", t("iconDefault")], ["circle", "●", t("iconCircle")], ["minimal", "○", t("iconMinimal")]];
    root.innerHTML = `<div class="a17-page color-page">${topbar(t("icons"))}<div class="choice-preview"></div><div class="choice-grid">${choices.map(c => `<button class="choice-card ${state.iconStyle === c[0] ? "active" : ""}" type="button" data-icon-style="${c[0]}"><b>${c[1]}</b><small>${c[2]}</small></button>`).join("")}</div></div>`;
  }

  function layoutDots(cols) {
    return `<span class="layout-dots" style="--layout-cols:${cols}">${"<i></i>".repeat(cols * 4)}</span>`;
  }
  function renderLayout() {
    root.innerHTML = `<div class="a17-page wallstyle-page">${topbar(t("chooseLayout"), { back: false, close: true, apply: true })}<div class="preview-area" style="height:250px">${previewPhone("lock", false)}${previewPhone("home", true)}</div><div class="choice-grid">${[4,5,6].map(cols => `<button class="choice-card layout-choice ${state.layoutDraft === cols ? "active" : ""}" type="button" data-layout-draft="${cols}"><b>${layoutDots(cols)}</b><small>${cols} × 4</small></button>`).join("")}</div></div>`;
  }

  function renderClock() {
    const samples = ["21<br>48", "21:48", "21<br><span style='font-size:13px'>48</span>", "21 48", "21<br>⁴⁸", "21·48"];
    root.innerHTML = `<div class="a17-page wallstyle-page">${topbar(t("clock"))}<div class="choice-preview" style="background-image:var(--lock-wall)"></div><div class="choice-grid">${samples.map((samp, i) => `<button class="choice-card ${state.clockStyle === i ? "active" : ""}" type="button" data-clock-style="${i}"><b>${samp}</b><small>${t("clock")} ${i + 1}</small></button>`).join("")}</div></div>`;
  }

  function shortcutName(value) {
    return { flashlight: t("flashlight"), camera: t("camera"), wallet: t("wallet"), none: t("noShortcut") }[value];
  }
  function shortcutIcon(value) {
    return { flashlight: "⌁", camera: "◉", wallet: "▣", none: "·" }[value];
  }
  function shortcutGroup(side, label) {
    const values = ["flashlight", "camera", "wallet", "none"];
    return `<div class="a17-section">${label}</div><div class="choice-grid">${values.map(v => `<button class="choice-card ${state[side] === v ? "active" : ""}" type="button" data-shortcut-side="${side}" data-shortcut-value="${v}"><b>${shortcutIcon(v)}</b><small>${shortcutName(v)}</small></button>`).join("")}</div>`;
  }
  function renderShortcuts() {
    root.innerHTML = `<div class="a17-page wallstyle-page">${topbar(t("shortcuts"))}${shortcutGroup("leftShortcut", "Kiri")}${shortcutGroup("rightShortcut", "Kanan")}</div>`;
  }

  function renderNotifications() {
    root.innerHTML = `<div class="a17-page wallstyle-page">${topbar(t("lockNotif"))}
      <div class="a17-row" style="margin-top:4px;border:0;border-radius:18px;background:var(--android-card)"><span class="a17-copy"><strong>${t("showOnLock")}</strong></span>${toggle("lockNotifications")}</div>
      <div class="notification-preview"><div class="notification-phone"><strong>09:30</strong><div class="notification-bar"></div><div class="notification-bar short"></div></div></div>
      <div class="choice-grid" style="grid-template-columns:1fr 1fr"><button class="choice-card ${state.notificationMode === "compact" ? "active" : ""}" type="button" data-notification-mode="compact"><b>☰</b><small>${t("compact")}</small></button><button class="choice-card ${state.notificationMode === "full" ? "active" : ""}" type="button" data-notification-mode="full"><b>≡</b><small>${t("fullList")}</small></button></div>
      <div class="a17-card"><div class="a17-row"><span class="a17-copy"><strong>${t("seenIcons")}</strong></span>${toggle("seenNotificationIcons")}</div><div class="a17-row"><span class="a17-copy"><strong>${t("silent")}</strong></span>${toggle("silentNotifications")}</div></div>
    </div>`;
  }

  function renderLockMore() {
    root.innerHTML = `<div class="a17-page lock-settings-page wallstyle-page">${topbar(t("lock"))}
      <div class="a17-card">
        <label class="a17-row"><span class="a17-copy"><strong>${t("addLockText")}</strong><span>${state.lockText ? escapeHtml(state.lockText) : t("none")}</span><input id="lockTextInput" class="lock-setting-text-input" value="${escapeHtml(state.lockText)}" placeholder="${t("none")}"></span></label>
        <div class="a17-row"><span class="a17-copy"><strong>${t("deviceControls")}</strong><span>${t("deviceControlsDesc")}</span></span>${toggle("deviceControls")}</div>
        <button class="a17-row" type="button" data-nav="shortcuts"><span class="a17-copy"><strong>${t("shortcuts")}</strong><span>${shortcutName(state.leftShortcut)}, ${shortcutName(state.rightShortcut)}</span></span><span class="a17-chevron">›</span></button>
        <div class="a17-row"><span class="a17-copy"><strong>${t("dynamicClock")}</strong><span>${t("dynamicClockDesc")}</span></span>${toggle("dynamicClock")}</div>
        <button class="a17-row" type="button" data-action="nowPlayingToast"><span class="a17-copy"><strong>${t("nowPlaying")}</strong><span>${t("nowPlayingDesc")}</span></span></button>
      </div>
      <div class="a17-section">${t("appearanceTime")}</div>
      <div class="a17-card">
        <div class="a17-row"><span class="a17-copy"><strong>${t("musicArtwork")}</strong><span>${t("musicArtworkDesc")}</span></span>${toggle("musicArtwork")}</div>
        <div class="a17-row"><span class="a17-copy"><strong>${t("lift")}</strong><span>${t("liftDesc")}</span></span><span class="a17-chevron">›</span>${toggle("liftToCheck")}</div>
        <div class="a17-row"><span class="a17-copy"><strong>${t("wake")}</strong><span>${t("wakeDesc")}</span></span>${toggle("wakeForNotifications")}</div>
      </div>
    </div>`;

    $("#lockTextInput")?.addEventListener("input", e => {
      state.lockText = e.target.value.slice(0, 40);
      save();
    });
  }

  function renderWallpaperPicker() {
    const current = state[currentTargetKey()];
    root.innerHTML = `<div class="a17-page wallstyle-page">${topbar(t("wallpaper"))}<div class="wallpaper-picker-grid">${wallpapers.map(w => `<button class="wallpaper-pick ${current === w.id ? "active" : ""}" type="button" data-pick-wallpaper="${w.id}" title="${w.label}" style="background-image:url('${w.src}')"></button>`).join("")}</div></div>`;
  }

  function renderHomeSettings() {
    root.innerHTML = `<div class="a17-page wallstyle-page">${topbar(t("homeSettings"))}<div class="a17-card">${[4,5,6].map(c => row({ title: `${t("layout")}: ${c} kolom`, desc: state.homeCols === c ? "Aktif" : "", trailing: `<span class="a17-trailing">${state.homeCols === c ? "✓" : layoutDots(Math.min(c,5))}</span>` })).join("")}</div></div>`;
    const buttons = $$(".a17-row", root);
    buttons.forEach((b, i) => b.addEventListener("click", () => {
      state.homeCols = [4,5,6][i]; state.layoutDraft = state.homeCols; save(); render();
    }));
  }

  function renderSettings() {
    const rows = [
      ["⌁", "Jaringan & internet", "Wi-Fi", "shade"], ["◫", "Perangkat terhubung", "Bluetooth", "shade"],
      ["▦", "Aplikasi", "Aplikasi default", "apps"], ["◉", "Notifikasi", t("lockNotifDesc"), "notifications"],
      ["▰", "Baterai", `${state.battery}%`, "shade"], ["▥", "Penyimpanan", "128 GB", "about"],
      ["✦", t("style"), "Material 3 Expressive", "wallpaperStyle"], ["▣", "Layar & sentuhan", t("darkTheme"), "color"],
      ["♫", "Suara & getaran", `${t("volume")}: ${state.volume}%`, "shade"], ["◆", "Keamanan & privasi", "Screen lock", "lockMore"],
      ["⚙", t("system"), t("systemDesc"), "system"], ["ⓘ", t("aboutPhone"), "Google Pixel 10 • Frankel", "about"]
    ];
    root.innerHTML = `<div class="a17-page wallstyle-page"><div class="a17-topbar"><h3>${t("settings")}</h3></div><div class="settings-search">⌕ ${t("searchSettings")}</div><div class="a17-card">${rows.map(r => row({ title:r[1], desc:r[2], nav:r[3], icon:r[0] })).join("")}</div></div>`;
  }


  function systemRadio(active) {
    return `<span class="system-radio ${active ? "active" : ""}" aria-hidden="true"><i></i></span>`;
  }

  function systemNavPreview(mode, order = state.buttonOrder) {
    if (mode === "gesture") {
      return `<div class="nav-preview-phone">
        <div class="nav-preview-content"><i></i><i></i><i></i><b></b><i></i><i></i><i></i></div>
        <span class="nav-preview-gesture"></span>
      </div>`;
    }
    const actions = order === "recent-home-back"
      ? ["recent", "home", "back"]
      : ["back", "home", "recent"];
    const icons = { back: "◀", home: "●", recent: "■" };
    return `<div class="nav-preview-phone">
      <div class="nav-preview-content"><i></i><i></i><i></i><b></b><i></i><i></i><i></i></div>
      <span class="nav-preview-buttons">${actions.map(a => `<em>${icons[a]}</em>`).join("")}</span>
    </div>`;
  }

  function renderSystem() {
    root.innerHTML = `<div class="a17-page system-page">
      ${topbar(t("system"))}
      <div class="system-intro">${t("systemInfo")}</div>

      <div class="a17-card system-card">
        ${row({ title: t("languageRegion"), desc: state.region, nav: "languageRegion", trailing: `<span class="a17-trailing system-icon">A</span>` })}
        ${row({ title: t("navigationMode"), desc: state.navigationMode === "gesture" ? t("gestureNavigation") : t("threeButtonNavigation"), nav: "navigationMode", trailing: `<span class="a17-trailing system-icon">◁</span>` })}
      </div>

      <div class="a17-section">${t("aboutPhone")}</div>
      <div class="a17-card system-card">
        ${row({ title: t("aboutPhone"), desc: "Google Pixel 10 • Frankel", nav: "about", trailing: `<span class="a17-trailing system-icon">ⓘ</span>` })}
      </div>
    </div>`;
  }

  function renderLanguageRegion() {
    const installed = Array.isArray(state.installedLanguages) ? state.installedLanguages : ["id"];
    const langName = code => code === "en" ? "English (United States)" : "Indonesia (Indonesia)";
    const langSub = code => code === getLanguage() ? (getLanguage() === "en" ? "System language" : "Bahasa sistem") : "";

    root.innerHTML = `<div class="a17-page system-page language-region-page">
      ${topbar(t("languageRegion"))}

      <p class="system-description">${getLanguage() === "en"
        ? "The device, apps, and websites use the first supported language in your preferred-language list."
        : "Perangkat, aplikasi, dan situs menggunakan bahasa pertama yang didukung dari daftar bahasa pilihan Anda."}</p>

      <div class="a17-section">${t("preferredLanguages")}</div>
      <div class="a17-card system-card language-list">
        ${installed.map((code, index) => `<button class="a17-row language-choice" type="button" data-device-language="${code}">
          <span class="language-index">${index + 1}</span>
          <span class="a17-copy"><strong>${langName(code)}</strong>${langSub(code) ? `<span>${langSub(code)}</span>` : ""}</span>
          ${code === getLanguage() ? `<span class="language-check">✓</span>` : ""}
        </button>`).join("")}
      </div>

      <button class="system-add-button" type="button" data-action="addLanguage"><b>＋</b>${t("addLanguage")}</button>

      <div class="a17-section">${t("otherLanguageSettings")}</div>
      <div class="a17-card system-card">
        <button class="a17-row" type="button" data-action="appLanguageToast"><span class="a17-copy"><strong>${t("appLanguages")}</strong><span>${t("appLanguagesDesc")}</span></span></button>
        <button class="a17-row" type="button" data-action="speechToast"><span class="a17-copy"><strong>${t("speech")}</strong><span>${t("speechDesc")}</span></span></button>
      </div>

      <div class="a17-section">${t("regionalPreferences")}</div>
      <div class="a17-card system-card regional-card">
        <button class="a17-row" type="button" data-cycle-setting="region"><span class="a17-copy"><strong>${t("region")}</strong><span>${state.region}</span></span></button>
        <button class="a17-row" type="button" data-cycle-setting="temperatureUnit"><span class="a17-copy"><strong>${t("temperature")}</strong><span>${state.temperatureUnit === "default" ? t("useDefault") : state.temperatureUnit}</span></span></button>
        <button class="a17-row" type="button" data-cycle-setting="measurementSystem"><span class="a17-copy"><strong>${t("measurementSystem")}</strong><span>${state.measurementSystem === "default" ? t("useDefault") : state.measurementSystem}</span></span></button>
        <button class="a17-row" type="button" data-cycle-setting="firstDayOfWeek"><span class="a17-copy"><strong>${t("firstDayWeek")}</strong><span>${state.firstDayOfWeek === "default" ? t("useDefault") : state.firstDayOfWeek}</span></span></button>
      </div>

      <div class="system-note">ⓘ <span>${getLanguage() === "en"
        ? "Apps that do not support regional preferences use their default locale settings."
        : "Jika tidak mendukung preferensi regional, aplikasi akan menggunakan setelan lokalitas defaultnya."}</span></div>
    </div>`;
  }

  function renderNavigationMode() {
    root.innerHTML = `<div class="a17-page system-page navigation-mode-page">
      ${topbar(t("navigationMode"))}

      <div class="navigation-hero">
        ${systemNavPreview(state.navigationMode)}
      </div>

      <div class="navigation-choice-stack">
        <div class="navigation-choice-card ${state.navigationMode === "gesture" ? "selected" : ""}">
          <button class="navigation-choice-main" type="button" data-nav-mode="gesture">
            ${systemRadio(state.navigationMode === "gesture")}
            <span class="navigation-choice-copy"><strong>${t("gestureNavigation")}</strong><span>${t("gestureNavigationDesc")}</span></span>
            <span class="navigation-chevron">›</span>
          </button>
          <button class="navigation-gear" type="button" data-nav="gestureNavigation" aria-label="${t("gestureNavigation")}">⚙</button>
        </div>

        <div class="navigation-choice-card ${state.navigationMode === "buttons" ? "selected" : ""}">
          <button class="navigation-choice-main" type="button" data-nav-mode="buttons">
            ${systemRadio(state.navigationMode === "buttons")}
            <span class="navigation-choice-copy"><strong>${t("threeButtonNavigation")}</strong><span>${t("threeButtonNavigationDesc")}</span></span>
            <span class="navigation-chevron">›</span>
          </button>
          <button class="navigation-gear" type="button" data-nav="buttonNavigation" aria-label="${t("threeButtonNavigation")}">⚙</button>
        </div>
      </div>
    </div>`;
  }

  function renderGestureNavigation() {
    root.innerHTML = `<div class="a17-page system-page gesture-settings-page">
      ${topbar(t("gestureNavigation"))}

      <button class="gesture-demo-button" type="button" data-action="gestureDemo">☝ ${t("tryDemo")}</button>

      <div class="a17-card system-card">
        <div class="a17-row"><span class="a17-copy"><strong>${t("navigationHint")}</strong><span>${t("navigationHintDesc")}</span></span>${toggle("navigationHint")}</div>
        <div class="a17-row"><span class="a17-copy"><strong>${t("imeSwitcher")}</strong><span>${t("imeSwitcherDesc")}</span></span>${toggle("showImeSwitcher")}</div>
        <div class="a17-row slider-row">
          <span class="a17-copy"><strong>${t("backGestureHeight")}</strong><span>${t("backGestureHeightDesc")}</span></span>
          <div class="system-slider-wrap"><input type="range" min="45" max="100" value="${state.backGestureHeight}" data-system-slider="backGestureHeight"><div><span>${t("full")}</span><span>${t("bottom")}</span></div></div>
        </div>
        <div class="a17-row"><span class="a17-copy"><strong>${t("backAnimation")}</strong><span>${t("backAnimationDesc")}</span></span>${toggle("backAnimation")}</div>
        <div class="a17-row"><span class="a17-copy"><strong>${t("backHaptic")}</strong><span>${t("backHapticDesc")}</span></span>${toggle("backHaptic")}</div>
      </div>

      <div class="a17-section">${t("digitalAssistant")}</div>
      <div class="a17-card system-card">
        <div class="a17-row"><span class="a17-copy"><strong>${t("assistantGesture")}</strong><span>${t("assistantGestureDesc")}</span></span>${toggle("assistantGesture")}</div>
      </div>

      <div class="a17-section">${t("backSensitivity")}</div>
      <div class="a17-card system-card">
        <div class="a17-row slider-row"><span class="a17-copy"><strong>${t("leftEdge")}</strong></span><div class="system-slider-wrap"><input type="range" min="20" max="100" value="${state.leftSensitivity}" data-system-slider="leftSensitivity"><div><span>${t("low")}</span><span>${t("high")}</span></div></div></div>
        <div class="a17-row slider-row"><span class="a17-copy"><strong>${t("rightEdge")}</strong></span><div class="system-slider-wrap"><input type="range" min="20" max="100" value="${state.rightSensitivity}" data-system-slider="rightSensitivity"><div><span>${t("low")}</span><span>${t("high")}</span></div></div></div>
      </div>

      <div class="system-note">ⓘ <span>${t("sensitivityNote")}</span></div>
    </div>`;
  }

  function renderButtonNavigation() {
    const orders = [
      ["back-home-recent", t("backHomeRecent")],
      ["recent-home-back", t("recentHomeBack")]
    ];
    root.innerHTML = `<div class="a17-page system-page button-navigation-page">
      ${topbar(t("threeButtonNavigation"))}
      <div class="a17-section">${t("buttonOrder")}</div>
      <div class="button-order-stack">
        ${orders.map(([value,label]) => `<button class="button-order-card ${state.buttonOrder === value ? "selected" : ""}" type="button" data-button-order="${value}">
          <span class="button-order-title">${systemRadio(state.buttonOrder === value)}<strong>${label}</strong></span>
          <span class="button-order-preview">${systemNavPreview("buttons", value)}</span>
        </button>`).join("")}
      </div>
    </div>`;
  }

  function renderRecents() {
    root.innerHTML = `<div class="a17-page system-page recents-page">
      <div class="recents-header"><strong>${t("recents")}</strong></div>
      <div class="recent-card">
        <div class="recent-app-head"><span>⚙</span><strong>${t("settings")}</strong></div>
        <div class="recent-preview">${t("system")} • Android 17</div>
        <button type="button" data-nav="settings">${t("settings")}</button>
      </div>
      <div class="recent-card">
        <div class="recent-app-head"><span>⌂</span><strong>${t("home")}</strong></div>
        <div class="recent-preview">Waifu Gallery</div>
        <button type="button" data-nav="home">${t("home")}</button>
      </div>
    </div>`;
  }

  function renderAbout() {
    const details = [[t("deviceName"), "Google Pixel 10"], [t("model"), "Frankel"], [t("androidVersion"), "17"], [t("securityUpdate"), "5 Agustus 2026"], [t("build"), "WG17.260818.2"]];
    root.innerHTML = `<div class="a17-page wallstyle-page">${topbar(t("aboutPhone"))}<div class="about-hero"><div class="about-glyph">G</div><h4>Google Pixel 10</h4><p>Android 17 • Model Frankel</p></div><div class="a17-card">${details.map(d => `<div class="a17-row"><span class="a17-copy"><strong>${d[0]}</strong><span>${d[1]}</span></span></div>`).join("")}</div></div>`;
  }

  function renderApps() {
    const apps = [["◉",t("camera"),"camera"],["◎","Chrome","home"],["◷","Clock","home"],["▥","Files","home"],["M","Gmail","home"],["⌖","Maps","home"],["✉","Messages","home"],["✿","Photos","wallpaperPicker"],["▶","Play","home"],["⚙",t("settings"),"settings"],["▷","YouTube","home"],["☀","Weather","home"]];
    root.innerHTML = `<div class="a17-page wallstyle-page">${topbar(t("appList"))}<div class="settings-search">⌕ ${t("appList")}</div><div class="home-icons" style="grid-template-columns:repeat(4,1fr);margin-top:10px;text-shadow:none">${apps.map(a => `<button class="home-app" style="color:var(--android-text);text-shadow:none" type="button" data-nav="${a[2]}"><span class="home-app-icon">${a[0]}</span><small>${a[1]}</small></button>`).join("")}</div></div>`;
  }

  function renderCamera() {
    root.innerHTML = `<div class="a17-page camera-page"><div class="camera-preview"></div><button class="camera-back" type="button" data-nav="back">‹</button><div class="camera-controls"><button class="camera-shutter" type="button" data-action="shutter"></button></div></div>`;
  }

  function lockClockMarkup() {
    const time = formatTime().replace(".", ":");
    switch (state.clockStyle) {
      case 1: return time;
      case 2: return time.slice(0,2) + `<br><span style="font-size:.45em">${time.slice(3)}</span>`;
      case 3: return time.replace(":", " ");
      case 4: return time.slice(0,2) + `<br><span style="font-size:.55em">${time.slice(3)}</span>`;
      case 5: return time.replace(":", "·");
      default: return time.slice(0,2) + `<br>${time.slice(3)}`;
    }
  }

  function renderLock() {
    root.innerHTML = `<div class="a17-page lock-page"><div class="lock-wall"></div><div class="lock-content"><div class="lock-date">${formatDate()}</div><div class="lock-time ${state.dynamicClock && state.lockNotifications ? "compact" : ""}">${lockClockMarkup()}</div>
      ${state.lockNotifications ? `<div class="lock-notifications"><div class="lock-notification"><strong>Waifu Gallery</strong><span>${state.notificationMode === "compact" ? "Galeri siap dibuka" : "Galeri siap dibuka • Mini Game dan Ponsel tersedia"}</span></div>${state.notificationMode === "full" ? `<div class="lock-notification"><strong>Now Playing</strong><span>${state.nowPlaying ? "Ambient track detected" : "Off"}</span></div>` : ""}</div>` : ""}
      <div class="lock-spacer"></div><div class="lock-text">${escapeHtml(state.lockText)}</div><div class="lock-shortcuts"><button class="lock-shortcut" type="button" data-lock-shortcut="${state.leftShortcut}">${shortcutIcon(state.leftShortcut)}</button><button class="lock-shortcut" type="button" data-lock-shortcut="${state.rightShortcut}">${shortcutIcon(state.rightShortcut)}</button></div><div class="unlock-hint">${t("unlock")}</div></div></div>`;
  }

  function renderQuickShade() {
    const tiles = [
      ["wifi", "⌁", t("wifi"), state.wifi && !state.airplane], ["bluetooth", "ᛒ", t("bluetooth"), state.bluetooth],
      ["dark", "◐", t("darkTheme"), state.dark], ["flashlight", "⌁", t("flashlight"), state.flashlight],
      ["airplane", "✈", t("airplane"), state.airplane], ["batterySaver", "▰", t("saver"), state.batterySaver],
      ["screenRecord", "●", t("screenRecord"), state.screenRecord]
    ];
    return `<div class="quick-shade"><div class="shade-time">${formatTime().replace(".", ":")}</div><div class="shade-date">${formatDate()}</div><div class="quick-grid">${tiles.map(x => `<button class="quick-tile ${x[3] ? "on" : ""}" type="button" data-quick-toggle="${x[0]}"><b>${x[1]}</b><span><strong>${x[2]}</strong><span>${x[3] ? "On" : "Off"}</span></span></button>`).join("")}</div><div class="brightness-row">☀ <input id="brightnessSlider" type="range" min="35" max="100" value="${state.brightness}"></div><button class="a17-apply" style="display:block;margin:11px auto 0" type="button" data-action="closeShade">⌃</button></div>`;
  }

  function renderBoot() {
    root.innerHTML = `<div class="boot-page"><div style="text-align:center"><div class="boot-mark">G</div><p style="font-size:8px;font-weight:900;color:#5f6368">${t("rebooting")}</p></div></div>`;
  }

  function render() {
    applyTheme();
    if (state.locked) renderLock();
    else {
      const map = {
        home: renderHome, wallpaperStyle: renderWallpaperStyle, color: renderColor, icons: renderIcons, layout: renderLayout,
        clock: renderClock, shortcuts: renderShortcuts, notifications: renderNotifications, lockMore: renderLockMore,
        wallpaperPicker: renderWallpaperPicker, homeSettings: renderHomeSettings, settings: renderSettings, system: renderSystem,
        languageRegion: renderLanguageRegion, navigationMode: renderNavigationMode, gestureNavigation: renderGestureNavigation,
        buttonNavigation: renderButtonNavigation, recents: renderRecents, about: renderAbout,
        apps: renderApps, camera: renderCamera, boot: renderBoot
      };
      (map[state.view] || renderHome)();
    }
    if (state.shade && state.view !== "boot") root.insertAdjacentHTML("beforeend", renderQuickShade());
    bindDynamic();
  }

  function bindDynamic() {
    $$('[data-nav]', root).forEach(btn => btn.addEventListener("click", () => btn.dataset.nav === "back" ? goBack() : navigate(btn.dataset.nav)));
    $$('[data-toggle]', root).forEach(btn => btn.addEventListener("click", () => {
      const key = btn.dataset.toggle; state[key] = !state[key]; save(); vibrate(); render();
    }));
    $$('[data-style-tab]', root).forEach(btn => btn.addEventListener("click", () => {
      state.styleTab = btn.dataset.styleTab; state.wallpaperTarget = state.styleTab; save(); render();
    }));
    $$('[data-carousel-wall]', root).forEach(btn => btn.addEventListener("click", () => setWallpaper(btn.dataset.carouselWall)));
    $$('[data-pick-wallpaper]', root).forEach(btn => btn.addEventListener("click", () => setWallpaper(btn.dataset.pickWallpaper)));
    $$('[data-home-quick-wall]', root).forEach(btn => btn.addEventListener("click", () => {
      state.homeWallpaper = btn.dataset.homeQuickWall; state.palette = wallPaletteId(state.homeWallpaper); state.longPressMenu = false; save(); render();
    }));
    $$('[data-palette]', root).forEach(btn => btn.addEventListener("click", () => {
      state.palette = btn.dataset.palette; save(); vibrate(); render(); toast(t("colorUpdated"));
    }));
    $$('[data-color-tab]', root).forEach(btn => btn.addEventListener("click", () => { state.colorTab = btn.dataset.colorTab; save(); render(); }));
    $$('[data-icon-style]', root).forEach(btn => btn.addEventListener("click", () => { state.iconStyle = btn.dataset.iconStyle; save(); render(); }));
    $$('[data-layout-draft]', root).forEach(btn => btn.addEventListener("click", () => { state.layoutDraft = Number(btn.dataset.layoutDraft); render(); }));
    $$('[data-clock-style]', root).forEach(btn => btn.addEventListener("click", () => { state.clockStyle = Number(btn.dataset.clockStyle); save(); render(); }));
    $$('[data-shortcut-side]', root).forEach(btn => btn.addEventListener("click", () => { state[btn.dataset.shortcutSide] = btn.dataset.shortcutValue; save(); render(); }));
    $$('[data-notification-mode]', root).forEach(btn => btn.addEventListener("click", () => { state.notificationMode = btn.dataset.notificationMode; save(); render(); }));
    $$('[data-lock-shortcut]', root).forEach(btn => btn.addEventListener("click", () => activateShortcut(btn.dataset.lockShortcut)));
    $$('[data-quick-toggle]', root).forEach(btn => btn.addEventListener("click", () => toggleQuick(btn.dataset.quickToggle)));
    $$('[data-nav-mode]', root).forEach(btn => btn.addEventListener("click", () => {
      state.navigationMode = btn.dataset.navMode;
      save(); vibrate(8); render();
    }));
    $$('[data-button-order]', root).forEach(btn => btn.addEventListener("click", () => {
      state.buttonOrder = btn.dataset.buttonOrder;
      state.navigationMode = "buttons";
      save(); vibrate(8); render();
    }));
    $$('[data-system-slider]', root).forEach(input => input.addEventListener("input", () => {
      state[input.dataset.systemSlider] = Number(input.value);
      save();
    }));
    $$('[data-device-language]', root).forEach(btn => btn.addEventListener("click", () => {
      state.deviceLanguage = btn.dataset.deviceLanguage;
      save(); vibrate(8); render();
    }));
    $$('[data-cycle-setting]', root).forEach(btn => btn.addEventListener("click", () => {
      cycleSystemSetting(btn.dataset.cycleSetting);
    }));
    $$('[data-action]', root).forEach(btn => btn.addEventListener("click", () => handleAction(btn.dataset.action)));

    $("#brightnessSlider")?.addEventListener("input", e => { state.brightness = Number(e.target.value); save(); applyTheme(); });
  }

  function cycleSystemSetting(key) {
    const options = {
      region: ["Indonesia", "United States", "Japan"],
      temperatureUnit: ["default", "Celsius", "Fahrenheit"],
      measurementSystem: ["default", "Metric", "Imperial"],
      firstDayOfWeek: ["default", "Monday", "Sunday"]
    };
    const list = options[key];
    if (!list) return;
    const current = list.indexOf(state[key]);
    state[key] = list[(current + 1) % list.length];
    save(); vibrate(5); render();
  }

  function toggleQuick(key) {
    if (key === "airplane") {
      state.airplane = !state.airplane;
      if (state.airplane) state.wifi = false;
    } else if (key === "screenRecord") {
      state.screenRecord = !state.screenRecord;
      state.screenRecordStart = state.screenRecord ? Date.now() : 0;
    } else {
      state[key] = !state[key];
    }
    save(); vibrate(); render();
  }

  function handleAction(action) {
    if (action === "dismissMenu") { state.longPressMenu = false; render(); }
    if (action === "openStyle") { state.styleTab = "home"; state.wallpaperTarget = "home"; navigate("wallpaperStyle"); }
    if (action === "widgetToast") toast(t("widgets"));
    if (action === "applyLayout") { state.homeCols = state.layoutDraft; save(); navigate("wallpaperStyle", false); }
    if (action === "closeShade") { state.shade = false; render(); }
    if (action === "shutter") toast(t("photoCaptured"));
    if (action === "nowPlayingToast") toast(t("nowPlayingDesc"));
    if (action === "addLanguage") {
      const installed = Array.isArray(state.installedLanguages) ? state.installedLanguages : ["id"];
      if (!installed.includes("en")) {
        state.installedLanguages = [...installed, "en"];
        save(); vibrate(8); render(); toast(t("languageAdded"));
      } else {
        state.deviceLanguage = state.deviceLanguage === "en" ? "id" : "en";
        save(); render();
      }
    }
    if (action === "appLanguageToast") toast(t("appLanguagesDesc"));
    if (action === "speechToast") toast(t("speechDesc"));
    if (action === "gestureDemo") showGestureDemo();
  }

  function showGestureDemo() {
    $(".gesture-demo-overlay", root)?.remove();
    const el = document.createElement("div");
    el.className = "gesture-demo-overlay";
    el.innerHTML = `<div class="gesture-demo-phone"><span class="gesture-demo-arrow">‹</span><span class="gesture-demo-line"></span></div><strong>${t("gestureNavigation")}</strong><small>${t("gestureNavigationDesc")}</small>`;
    root.appendChild(el);
    setTimeout(() => el.remove(), 2100);
  }

  function activateShortcut(value) {
    if (value === "flashlight") {
      state.flashlight = !state.flashlight; save(); toast(`${t("flashlight")}: ${state.flashlight ? "On" : "Off"}`);
    } else if (value === "camera") {
      state.locked = false; navigate("camera");
    } else if (value === "wallet") {
      toast(t("wallet"));
    }
  }

  function lockPhone() { state.locked = true; state.shade = false; save(); render(); }
  function unlockPhone() { state.locked = false; state.view = "home"; state.shade = false; save(); render(); }
  function rebootPhone() {
    state.locked = false; state.shade = false; state.view = "boot"; render();
    setTimeout(() => { state.view = "home"; state.locked = true; save(); render(); }, 1450);
  }

  openBtn.addEventListener("click", () => {
    if (!dialog.open) dialog.showModal();
    render();
  });
  closeBtn?.addEventListener("click", () => dialog.open && dialog.close());
  dialog.addEventListener("cancel", e => { e.preventDefault(); dialog.close(); });

  statusBar?.addEventListener("click", () => {
    if (state.view === "boot") return;
    state.shade = !state.shade; render();
  });
  gesture?.addEventListener("click", () => {
    if (state.navigationMode !== "gesture") return;
    state.locked ? unlockPhone() : navigate("home");
  });

  let systemGestureStart = null;
  phone.addEventListener("pointerdown", e => {
    if (state.navigationMode !== "gesture" || state.locked) return;
    if (e.target.closest("button,input,label")) return;
    const rect = phone.getBoundingClientRect();
    systemGestureStart = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      time: performance.now()
    };
  });

  phone.addEventListener("pointerup", e => {
    if (!systemGestureStart || state.navigationMode !== "gesture" || state.locked) {
      systemGestureStart = null;
      return;
    }
    const rect = phone.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    const dx = endX - systemGestureStart.x;
    const dy = endY - systemGestureStart.y;
    const elapsed = performance.now() - systemGestureStart.time;
    const fromBottom = systemGestureStart.y > systemGestureStart.height - 56;

    if (fromBottom && dy < -58) {
      const fromCorner = systemGestureStart.x < 55 || systemGestureStart.x > systemGestureStart.width - 55;
      if (fromCorner && state.assistantGesture) {
        toast(t("digitalAssistant"));
      } else if (elapsed > 360) {
        navigate("recents");
      } else {
        navigate("home");
      }
      systemGestureStart = null;
      return;
    }

    const activeHeight = systemGestureStart.height * (state.backGestureHeight / 100);
    const minY = systemGestureStart.height - activeHeight;
    const leftZone = 10 + state.leftSensitivity * 0.32;
    const rightZone = 10 + state.rightSensitivity * 0.32;

    const leftBack = systemGestureStart.x <= leftZone && dx > 42;
    const rightBack = systemGestureStart.x >= systemGestureStart.width - rightZone && dx < -42;

    if (systemGestureStart.y >= minY && (leftBack || rightBack)) {
      if (state.backHaptic) vibrate(10);
      if (state.backAnimation) {
        const indicator = document.createElement("div");
        indicator.className = `gesture-back-indicator ${leftBack ? "left" : "right"}`;
        indicator.textContent = leftBack ? "›" : "‹";
        phone.appendChild(indicator);
        setTimeout(() => indicator.remove(), 180);
      }
      goBack();
    }

    systemGestureStart = null;
  });

  phone.addEventListener("pointercancel", () => { systemGestureStart = null; });

  power?.addEventListener("click", () => state.locked ? unlockPhone() : lockPhone());
  volume?.addEventListener("click", () => {
    state.volume = state.volume >= 100 ? 20 : state.volume + 10; save(); showVolume();
  });

  $$('[data-sim-command]').forEach(btn => btn.addEventListener("click", () => {
    const cmd = btn.dataset.simCommand;
    if (cmd === "home") { state.locked = false; navigate("home"); }
    if (cmd === "lock") lockPhone();
    if (cmd === "reboot") rebootPhone();
  }));

  const languageObserver = new MutationObserver(() => { if (dialog.open) render(); });
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  setInterval(() => {
    if (!dialog.open) return;
    applyTheme();
    if (state.screenRecord) updateRecordingTime();
    if (state.locked && !state.shade) render();
  }, 1000);

  applyTheme();
  render();
})();
