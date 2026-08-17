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

  const SIM_APPS = [{"id":"youtube","name":"YouTube","glyph":"▶","tone":"red","category":"media"},{"id":"play-store","name":"Play Store","glyph":"▶","tone":"multi","category":"store"},{"id":"translate","name":"Terjemah","glyph":"文","tone":"blue","category":"utility"},{"id":"digi-bank","name":"DIGI bank bjb","glyph":"D","tone":"blue","category":"finance"},{"id":"dana","name":"DANA","glyph":"D","tone":"blue","category":"finance"},{"id":"bcr","name":"BCR","glyph":"☎","tone":"green","category":"finance"},{"id":"brimo","name":"BRImo","glyph":"B","tone":"blue","category":"finance"},{"id":"canva","name":"Canva","glyph":"C","tone":"purple","category":"creative"},{"id":"capcut","name":"CapCut","glyph":"✂","tone":"dark","category":"creative"},{"id":"chrome","name":"Chrome","glyph":"●","tone":"multi","category":"browser"},{"id":"weather","name":"Cuaca","glyph":"☀","tone":"yellow","category":"utility"},{"id":"dolby","name":"Dolby Atmos","glyph":"D","tone":"blue","category":"utility"},{"id":"drive","name":"Drive","glyph":"▲","tone":"multi","category":"files"},{"id":"facebook","name":"Facebook","glyph":"f","tone":"blue","category":"social"},{"id":"files","name":"Files","glyph":"▤","tone":"blue","category":"files"},{"id":"photos","name":"Foto","glyph":"✿","tone":"multi","category":"files"},{"id":"gamebar","name":"GameBar","glyph":"🎮","tone":"blue","category":"game"},{"id":"gemini","name":"Gemini","glyph":"✦","tone":"multi","category":"ai"},{"id":"gmail","name":"Gmail","glyph":"M","tone":"multi","category":"mail"},{"id":"google","name":"Google","glyph":"G","tone":"multi","category":"search"},{"id":"grab","name":"Grab","glyph":"G","tone":"green","category":"maps"},{"id":"instagram","name":"Instagram","glyph":"◎","tone":"multi","category":"social"},{"id":"clock","name":"Jam","glyph":"◷","tone":"blue","category":"utility"},{"id":"calendar","name":"Kalender","glyph":"18","tone":"blue","category":"utility"},{"id":"calculator","name":"Kalkulator","glyph":"±","tone":"dark","category":"calculator"},{"id":"camera","name":"Kamera","glyph":"◉","tone":"dark","category":"camera"},{"id":"keep","name":"Keep","glyph":"●","tone":"yellow","category":"notes"},{"id":"personal-safety","name":"Keselamatan Pribadi","glyph":"✚","tone":"multi","category":"utility"},{"id":"contacts","name":"Kontak","glyph":"●","tone":"blue","category":"contacts"},{"id":"m365","name":"M365 Copilot","glyph":"M","tone":"multi","category":"ai"},{"id":"maps","name":"Maps","glyph":"⌖","tone":"multi","category":"maps"},{"id":"meet","name":"Meet","glyph":"▰","tone":"yellow","category":"communication"},{"id":"message","name":"Message","glyph":"✉","tone":"blue","category":"communication"},{"id":"messenger","name":"Messenger","glyph":"➤","tone":"blue","category":"communication"},{"id":"nekogram","name":"Nekogram","glyph":"N","tone":"blue","category":"communication"},{"id":"ovo","name":"OVO","glyph":"O","tone":"purple","category":"finance"},{"id":"recorder","name":"Perekam Suara","glyph":"▥","tone":"red","category":"utility"},{"id":"pinterest","name":"Pinterest","glyph":"P","tone":"red","category":"social"},{"id":"game-space-app","name":"Ruang Game","glyph":"🎮","tone":"yellow","category":"game"},{"id":"sandbox","name":"Sandbox","glyph":"◆","tone":"dark","category":"utility"},{"id":"settings-app","name":"Setelan","glyph":"⚙","tone":"blue","category":"settings"},{"id":"sim-toolkit","name":"SIM Toolkit","glyph":"SIM","tone":"slate","category":"utility"},{"id":"spotify","name":"Spotify","glyph":"◉","tone":"green","category":"media"},{"id":"phone","name":"Telepon","glyph":"☎","tone":"blue","category":"phone"},{"id":"threads","name":"Threads","glyph":"@","tone":"dark","category":"social"},{"id":"tiktok","name":"TikTok","glyph":"♪","tone":"dark","category":"social"},{"id":"wa-business","name":"WA Business","glyph":"W","tone":"green","category":"communication"},{"id":"x","name":"X","glyph":"X","tone":"dark","category":"social"}];
  const SYSTEM_APPS = [{"id":"sys-amplifier-suara","name":"Amplifier Suara","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-accessibility-suite","name":"Android Accessibility Suite","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-auto","name":"Android Auto","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-switch","name":"Android Switch","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-system-key-verifier","name":"Android System Key Verifier","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-system-safetycore","name":"Android System SafetyCore","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-system-webview","name":"Android System WebView","glyph":"◆","tone":"system","category":"system"},{"id":"sys-carrier-services","name":"Carrier Services","glyph":"◆","tone":"system","category":"system"},{"id":"sys-device-health-services","name":"Device Health Services","glyph":"◆","tone":"system","category":"system"},{"id":"sys-digital-wellbeing","name":"Digital Wellbeing","glyph":"◆","tone":"system","category":"system"},{"id":"sys-google-play-services","name":"Google Play services","glyph":"◆","tone":"system","category":"system"},{"id":"sys-pixel-launcher","name":"Pixel Launcher","glyph":"◆","tone":"system","category":"system"},{"id":"sys-private-compute-services","name":"Private Compute Services","glyph":"◆","tone":"system","category":"system"},{"id":"sys-system-ui","name":"System UI","glyph":"◆","tone":"system","category":"system"},{"id":"sys-permission-controller","name":"Permission Controller","glyph":"◆","tone":"system","category":"system"},{"id":"sys-settings-services","name":"Settings Services","glyph":"◆","tone":"system","category":"system"},{"id":"sys-speech-recognition-synthesis","name":"Speech Recognition & Synthesis","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-shared-library","name":"Android Shared Library","glyph":"◆","tone":"system","category":"system"},{"id":"sys-documentsui","name":"DocumentsUI","glyph":"◆","tone":"system","category":"system"},{"id":"sys-package-installer","name":"Package Installer","glyph":"◆","tone":"system","category":"system"},{"id":"sys-captiveportallogin","name":"CaptivePortalLogin","glyph":"◆","tone":"system","category":"system"},{"id":"sys-emergency-information","name":"Emergency Information","glyph":"◆","tone":"system","category":"system"},{"id":"sys-google-one-time-init","name":"Google One Time Init","glyph":"◆","tone":"system","category":"system"},{"id":"sys-google-services-framework","name":"Google Services Framework","glyph":"◆","tone":"system","category":"system"},{"id":"sys-google-partner-setup","name":"Google Partner Setup","glyph":"◆","tone":"system","category":"system"},{"id":"sys-sim-manager","name":"SIM Manager","glyph":"◆","tone":"system","category":"system"},{"id":"sys-storage-manager","name":"Storage Manager","glyph":"◆","tone":"system","category":"system"},{"id":"sys-device-policy","name":"Device Policy","glyph":"◆","tone":"system","category":"system"},{"id":"sys-download-manager","name":"Download Manager","glyph":"◆","tone":"system","category":"system"}];
  const ALL_APPS = [...SIM_APPS, ...SYSTEM_APPS];
  const SIM_BALANCE = "Rp1.000.000.000.000.000";

  function appById(id) { return ALL_APPS.find(app => app.id === id) || SIM_APPS[0]; }
  function makeRandomIndoNumber() {
    const prefixes = ["812","813","821","822","852","853","855","856","857","858","877","878","895","896","897","898","899"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const tail = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join("");
    return `+62${prefix}${tail}`;
  }
  function maskSimNumber(value) {
    const digits = String(value || "").replace(/\D/g, "");
    const last = digits.slice(-4) || "0000";
    return `+62 8••• •••• ${last}`;
  }

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
    simColorSource: "wallpaper",
    simCustomColor: "#7c3aed",
    simExtractedPalette: null,
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
    activeSimApp: "youtube",
    appInfoId: "youtube",
    recentSimApps: [],
    simPhone1: "",
    simPhone2: "",
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
    buttonOrder: "back-home-recent",

    /* Android 17 interactive settings referenced by the supplied screenshots */
    screenOff: false,
    connectedWifi: "Wifi Berbagi Rezeki_5G",
    mobileData: false,
    sim1Enabled: true,
    sim2Enabled: true,
    autoDataSwitch: false,
    hotspot: false,
    usbTether: false,
    bluetoothTether: false,
    ethernetTether: false,
    hotspotUseVpn: false,
    dataSaver: false,
    vpnEnabled: false,
    privateDns: "off",
    privateDnsForVpn: false,

    pairedDevice: "i12",
    pairedDeviceConnected: true,
    contactHistoryAccess: false,
    spatialAudio: true,
    nfc: false,
    printingService: true,
    quickShareVisible: true,
    crossDeviceReady: false,

    cloneApps: ["BRImo"],
    gameBrightnessLock: true,
    gameKeepAwake: false,
    gameDnd: true,
    gameHaptic: true,
    gameOverlay: true,
    gameTouchBoost: false,
    mediaCloud: "google",
    sideBar: false,
    contactStorage: "google",

    notificationHistory: false,
    notificationFlashCamera: false,
    notificationFlashScreen: true,
    emergencyAlerts: true,
    alertExtreme: true,
    alertSevere: true,
    alertAmber: true,
    alertTest: false,
    bubbles: false,
    notificationAccess: ["Android Auto", "Dolby Atmos", "Pixel Launcher", "Android System Intelligence"],
    notificationAppStates: { "Nekogram": true, "Threads": true, "OVO": true, "YouTube": true, "Grab": true, "X": true, "WhatsApp Business": true, "Google Play Store": true, "Facebook": true },

    batteryManager: true,
    batteryAdaptive: true,
    batterySaverExtreme: false,
    chargingControl: false,
    storageManager: false,

    adaptiveBrightness: true,
    hdrBrightness: true,
    extraDim: false,
    alwaysOn: false,
    screenTimeout: "30 detik",
    darkSchedule: "Tidak ada",
    nightLight: false,
    colorMode: "Vivid",
    autoRotate: true,
    refreshRate: 120,
    screenCutout: "default",
    fullscreenAppStates: { "BCR": false, "BRImo": false, "Canva": false, "CapCut": false, "Chrome": true, "DANA": false, "DIGI bank bjb": false, "Dolby Atmos": false, "Drive": false, "Facebook": false },
    screensaver: false,
    windowBlur: true,
    blurStrength: 100,
    vehicleMotionCues: false,
    touchBoost: false,
    antiFlicker: false,
    highBrightness: false,
    displaySaturation: 100,
    fontScale: 100,
    displayScale: 100,

    vibrationEnabled: true,
    callVolume: 54,
    ringVolume: 62,
    notificationVolume: 58,
    alarmVolume: 72,
    assistantVolume: 42,
    ringVibration: 72,
    notificationVibration: 62,
    alarmVibration: 72,
    touchVibration: 54,
    mediaVibration: 54,
    keyboardVibration: true,
    vibrateWhenConnected: true,
    vibrateWaitingCall: true,
    ringtonePattern: "dzzz-dzzz",
    ringtone: "Petualangan Berikutnya",
    notificationSound: "Biji Jagung Meletup",
    alarmSound: "Pagi yang Sejuk",
    liveCaption: false,
    autoText: false,
    mediaResumption: true,
    showMediaOnLock: true,
    defaultMusicPlayer: "Tidak ada",
    miSoundEnhancer: false,
    cleanSpeaker: false,
    dolbyAtmos: true,
    dolbyProfile: "Kerja",
    equalizerPreset: "Datar",

    securityCheck: true,
    screenLock: "Pola",
    faceUnlock: false,
    sideKeyConfigured: false,
    /* Simulated application state */
    bcrCallRecording: false,
    bcrWriteMetadata: false,
    bcrTelecomCalls: false,
    bcrBeforeConnect: false,
    bcrOpenDirectory: false,
    bcrShowLauncher: true,
    bcrAutoRules: "Semua panggilan",
    bcrOutputFormat: "OGG/Opus, 48 kbps, 16000 Hz, Combined (Mono)",
    bcrMinimumDuration: "Durasi apa pun",
    canvaText: "Waifu Gallery",
    canvaImage: "waifu-31",
    capcutPlaying: false,
    capcutPosition: 34,
    keepNotes: [],
    recorderActive: false,
    recorderStartedAt: 0,
    recorderItems: [],
    sandboxTab: "apps",
    sandboxUnlocked: false,
    sandboxShowSystem: false,
    spotifyTrack: 0,
    spotifyPlaying: false,
    spotifyProgress: 0,
    spotifyStartedAt: 0,
    translateDirection: "id-en",
    translateText: "",
    translateResult: "",
    simContacts: [],
    activeContact: 0,
    nekogramThread: -1,
    waThread: -1,
    pinterestPin: -1,
    tiktokIndex: 0
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
  if (!state.simPhone1) state.simPhone1 = makeRandomIndoNumber();
  if (!state.simPhone2) state.simPhone2 = makeRandomIndoNumber();
  if (!Array.isArray(state.simContacts) || !state.simContacts.length) state.simContacts = makeSimContacts();
  localStorage.setItem(STORE, JSON.stringify(state));
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


  /* Simulator-only Color Burst helpers. These never write website theme variables. */
  function simHexToRgb(hex) {
    const clean = String(hex || "#7c3aed").replace("#", "");
    const full = clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean.padEnd(6, "0").slice(0, 6);
    const n = parseInt(full, 16) || 0;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function simRgbToHex(r, g, b) {
    const h = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
    return `#${h(r)}${h(g)}${h(b)}`;
  }
  function simMix(a, b, weight = .5) {
    const x = simHexToRgb(a), y = simHexToRgb(b);
    return simRgbToHex(x.r * (1 - weight) + y.r * weight, x.g * (1 - weight) + y.g * weight, x.b * (1 - weight) + y.b * weight);
  }
  function simRotateHue(hex, degrees) {
    const { r, g, b } = simHexToRgb(hex);
    let rr = r / 255, gg = g / 255, bb = b / 255;
    const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
    let h = 0, sat = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      sat = l > .5 ? d / (2 - max - min) : d / (max + min);
      if (max === rr) h = (gg - bb) / d + (gg < bb ? 6 : 0);
      else if (max === gg) h = (bb - rr) / d + 2;
      else h = (rr - gg) / d + 4;
      h /= 6;
    }
    h = ((h * 360 + degrees) % 360 + 360) % 360;
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    if (!sat) return simRgbToHex(l * 255, l * 255, l * 255);
    const q = l < .5 ? l * (1 + sat) : l + sat - l * sat;
    const p = 2 * l - q, hn = h / 360;
    return simRgbToHex(hue2rgb(p, q, hn + 1/3) * 255, hue2rgb(p, q, hn) * 255, hue2rgb(p, q, hn - 1/3) * 255);
  }
  function createSimulatorPalette(primary) {
    return { primary, secondary: simRotateHue(primary, 48), tertiary: simRotateHue(primary, 112) };
  }
  function paletteToSimulatorColors(p) {
    const primary = p.primary || p.accent || "#7c3aed";
    return {
      primary,
      secondary: p.secondary || p.parts?.[1] || simRotateHue(primary, 48),
      tertiary: p.tertiary || p.parts?.[2] || simRotateHue(primary, 112)
    };
  }
  function activeSimulatorPalette() {
    if (state.simExtractedPalette && typeof state.simExtractedPalette === "object") {
      return paletteToSimulatorColors(state.simExtractedPalette);
    }
    const p = paletteById(state.palette);
    return paletteToSimulatorColors({ primary: p.accent, secondary: p.parts?.[1], tertiary: p.parts?.[2] });
  }
  function simColorText(id, en) { return getLanguage() === "en" ? en : id; }
  function simColorDistance(a, b) {
    const x = simHexToRgb(a), y = simHexToRgb(b);
    return Math.abs(x.r-y.r)+Math.abs(x.g-y.g)+Math.abs(x.b-y.b);
  }
  async function extractSimulatorPaletteFromWallpaper(wallId = state.homeWallpaper) {
    const image = new Image();
    image.decoding = "async";
    const src = wallpaperById(wallId).src;
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = src; });
    const canvas = document.createElement("canvas"), size = 72;
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    const buckets = new Map();
    for (let i = 0; i < data.length; i += 16) {
      const r=data[i], g=data[i+1], b=data[i+2], a=data[i+3];
      if (a < 200) continue;
      const max=Math.max(r,g,b), min=Math.min(r,g,b), saturation=max-min, brightness=(r+g+b)/3;
      if (brightness < 30 || brightness > 235 || saturation < 18) continue;
      const qr=Math.min(255,Math.round(r/32)*32), qg=Math.min(255,Math.round(g/32)*32), qb=Math.min(255,Math.round(b/32)*32);
      const key=`${qr},${qg},${qb}`; buckets.set(key,(buckets.get(key)||0)+1);
    }
    const colors=[...buckets.entries()].sort((a,b)=>b[1]-a[1]).slice(0,14).map(([k])=>k.split(",").map(Number)).map(v=>simRgbToHex(...v));
    if (!colors.length) return createSimulatorPalette("#7c3aed");
    const primary=colors[0];
    const secondary=colors.find(c=>simColorDistance(primary,c)>100) || simRotateHue(primary,48);
    const tertiary=colors.find(c=>simColorDistance(primary,c)>90 && simColorDistance(secondary,c)>90) || simRotateHue(primary,112);
    return {primary,secondary,tertiary};
  }
  async function applyWallpaperColorBurst() {
    try {
      const palette = await extractSimulatorPaletteFromWallpaper(state.homeWallpaper);
      state.simColorSource = "wallpaper";
      state.simExtractedPalette = palette;
      state.simCustomColor = palette.primary;
      save(); applyTheme(); render(); vibrate(7);
      toast(simColorText("Warna wallpaper diterapkan", "Wallpaper colors applied"));
    } catch {
      state.simExtractedPalette = null;
      state.palette = wallPaletteId(state.homeWallpaper);
      save(); applyTheme(); render();
      toast(simColorText("Palet wallpaper gagal dibaca", "Could not read wallpaper colors"));
    }
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
    const burst = activeSimulatorPalette();
    const soft = state.dark ? simMix(burst.primary, "#16151c", .74) : simMix(burst.primary, "#ffffff", .82);
    phone.style.setProperty("--android-blue", burst.primary);
    phone.style.setProperty("--android-blue-soft", soft);
    phone.style.setProperty("--android-secondary", burst.secondary);
    phone.style.setProperty("--android-tertiary", burst.tertiary);
    phone.style.setProperty("--home-wall", `url('${wallpaperById(state.homeWallpaper).src}')`);
    phone.style.setProperty("--lock-wall", `url('${wallpaperById(state.lockWallpaper).src}')`);
    phone.style.setProperty("--home-cols", String(state.homeCols));
    phone.style.setProperty("--drawer-cols", String(state.homeCols));
    phone.classList.toggle("android-dark", !!state.dark);
    phone.classList.toggle("screen-off-active", !!state.screenOff);
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

    const useButtons = state.navigationMode === "buttons" && !state.screenOff;
    phone.classList.toggle("three-button-mode", useButtons);

    if (gesture) {
      gesture.hidden = state.screenOff || useButtons || !state.navigationHint;
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
      gestureNavigation: "navigationMode", buttonNavigation: "navigationMode", recents: "home",

      networkInternet: "settings", internetSettings: "networkInternet", simSettings: "networkInternet",
      hotspotSettings: "networkInternet", dataSaverSettings: "networkInternet", vpnSettings: "networkInternet",
      privateDnsSettings: "networkInternet",

      connectedDevices: "settings", connectionPreferences: "connectedDevices", bluetoothSettings: "connectionPreferences",
      pairNewDevice: "connectedDevices", bluetoothDeviceDetail: "connectedDevices", crossDevice: "connectionPreferences",
      nfcSettings: "connectionPreferences", castSettings: "connectionPreferences", printingSettings: "connectionPreferences",
      chromebookSettings: "connectionPreferences", quickShareSettings: "connectionPreferences", androidAutoSettings: "connectionPreferences",

      appsSettings: "settings", allApps: "appsSettings", defaultApps: "appsSettings", cloneApps: "appsSettings",
      gameSpace: "appsSettings", assistantSettings: "appsSettings", digitalWellbeing: "appsSettings",
      mediaCloudSettings: "appsSettings", sideBarSettings: "appsSettings", contactStorageSettings: "appsSettings",
      unusedApps: "appsSettings", appBatteryUsage: "appsSettings", specialAppAccess: "appsSettings",

      notificationsSettings: "settings", notificationApps: "notificationsSettings", notificationHistory: "notificationsSettings",
      notificationConversations: "notificationsSettings", notificationBubbles: "notificationsSettings", notificationAccess: "notificationsSettings",
      notificationSoundSettings: "notificationsSettings", flashNotifications: "notificationsSettings", emergencyAlerts: "notificationsSettings",

      batterySettings: "settings", batteryUsage: "batterySettings", batterySaverSettings: "batterySettings",
      batteryManagerSettings: "batterySettings", batteryWidget: "batterySettings", chargingControl: "batterySettings",
      storageSettings: "settings",

      displaySettings: "settings", adaptiveBrightnessSettings: "displaySettings", hdrBrightnessSettings: "displaySettings",
      extraDimSettings: "displaySettings", lockScreenDisplay: "displaySettings", alwaysOnSettings: "displaySettings",
      screenTimeoutSettings: "displaySettings", darkThemeSettings: "displaySettings", displaySizeText: "displaySettings",
      liveDisplay: "displaySettings", nightLightSettings: "displaySettings", displayColorSettings: "displaySettings",
      rotationSettings: "displaySettings", refreshRateSettings: "displaySettings", cutoutSettings: "displaySettings",
      fullscreenApps: "displaySettings", screensaverSettings: "displaySettings", blurSettings: "displaySettings",
      vehicleMotionCues: "displaySettings", refreshRateApps: "displaySettings", touchResponsiveness: "displaySettings",
      antiFlicker: "displaySettings", highBrightness: "displaySettings", displaySaturation: "displaySettings",

      soundSettings: "settings", vibrationHaptics: "soundSettings", ringtonePattern: "soundSettings",
      ringtonePicker: "soundSettings", liveCaption: "soundSettings", spatialAudioSettings: "soundSettings",
      nowPlayingSettings: "soundSettings", nowPlayingHistory: "nowPlayingSettings", defaultMusicPlayer: "nowPlayingSettings",
      mediaSettings: "soundSettings", cleanSpeaker: "soundSettings", dolbyAtmos: "soundSettings", equalizer: "dolbyAtmos",
      appAudioProfiles: "dolbyAtmos",

      securityPrivacy: "settings", deviceUnlock: "securityPrivacy",
      appInfo: "allApps", simApp: "apps"
    };
    navigate(parent[state.view] || "home", false);
  }

  function setWallpaper(id) {
    const key = currentTargetKey();
    state[key] = id;
    if (key === "homeWallpaper") {
      state.palette = wallPaletteId(id);
      state.simColorSource = "wallpaper";
      state.simExtractedPalette = null;
    }
    save();
    applyTheme();
    vibrate();
    toast(t("wallpaperUpdated"));
    render();
    if (key === "homeWallpaper") applyWallpaperColorBurst();
  }

  function renderHome() {
    const homeApps = [
      appById("instagram"), appById("tiktok"), appById("wa-business"), appById("nekogram")
    ];
    const dockApps = [
      appById("phone"), appById("message"), appById("chrome"), appById("contacts"), appById("camera")
    ];
    const now = new Date();
    const locale = getLanguage() === "en" ? "en-US" : "id-ID";
    const dayLabel = new Intl.DateTimeFormat(locale, { weekday:"short", day:"numeric", month:"short" }).format(now);
    const appButton = (app, cls="home-app") => `<button class="${cls}" type="button" data-open-app="${app.id}" aria-label="${escapeHtml(app.name)}"><span class="record-home-icon drawer-app-icon tone-${app.tone}">${app.glyph}</span><small>${escapeHtml(app.name === "WA Business" ? "WA Busin..." : app.name)}</small></button>`;

    root.innerHTML = `<div class="a17-page home-page record-home-page" id="homePressSurface">
      <div class="home-wall"></div>
      <div class="record-home-scrim"></div>
      <div class="home-content record-home-content">
        <div class="record-home-weather">
          <strong>${escapeHtml(dayLabel)} <span>• 26°C</span></strong>
          <small>Hari ini 32°C / 24°C • Sebagian cerah</small>
        </div>
        <div class="record-home-spacer"></div>
        <div class="record-home-main">
          <div class="record-home-apps">${homeApps.map(a => appButton(a)).join("")}</div>
          <button class="record-screen-time" type="button" data-nav="settings" aria-label="Waktu pemakaian perangkat">
            <span>Waktu pemakaian<br>perangkat</span><i>◔</i><strong>1 j, 34 mnt</strong>
          </button>
        </div>
        <div class="home-dock record-home-dock">${dockApps.map(a => appButton(a,"record-dock-app")).join("")}</div>
        <button class="home-search record-home-search" type="button" data-open-app="google" aria-label="Google Search"><b>G</b><span>Telusuri</span><i>⌕ &nbsp; 🎙 &nbsp; ◉</i></button>
        <div class="record-home-gesture-hint"></div>
      </div>
      ${state.longPressMenu ? renderLongPressMenu() : ""}
    </div>`;

    if (!state.longPressMenu) {
      const surface = $("#homePressSurface");
      let startY = null;
      let startX = null;
      let moved = false;
      surface?.addEventListener("pointerdown", e => {
        if (e.target.closest("button")) return;
        startY = e.clientY;
        startX = e.clientX;
        moved = false;
        clearTimeout(longPressTimer);
        longPressTimer = setTimeout(() => {
          if (moved) return;
          state.longPressMenu = true;
          vibrate(12);
          render();
        }, 520);
      });
      surface?.addEventListener("pointermove", e => {
        if (startY == null) return;
        if (Math.abs(e.clientY - startY) > 12 || Math.abs(e.clientX - startX) > 12) {
          moved = true;
          clearTimeout(longPressTimer);
        }
      });
      surface?.addEventListener("pointerup", e => {
        clearTimeout(longPressTimer);
        if (startY == null) return;
        const dy = e.clientY - startY;
        startY = null;
        startX = null;
        if (dy < -44) {
          vibrate(5);
          navigate("apps");
        }
      });
      ["pointercancel", "pointerleave"].forEach(ev => surface?.addEventListener(ev, () => {
        clearTimeout(longPressTimer); startY = null; startX = null;
      }));
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
    const burst = activeSimulatorPalette();
    const wallpaperPresets = palettes.slice(0, 8);
    const manualColors = ["#7c3aed", "#ec4899", "#3b82f6", "#06b6d4", "#22c55e", "#eab308", "#f97316", "#ef4444"];
    const wallpaperActive = state.colorTab === "wallpaper";
    const previewStyle = `--burst-primary:${burst.primary};--burst-secondary:${burst.secondary};--burst-tertiary:${burst.tertiary}`;
    root.innerHTML = `<div class="a17-page color-page color-burst-sim-page" style="${previewStyle}">
      ${topbar(t("color"))}
      <div class="sim-burst-intro">
        <strong>${simColorText("Warna Android", "Android colors")}</strong>
        <span>${simColorText("Ikon, jam, tombol dan kartu simulator mengikuti palet ini.", "Simulator icons, clock, buttons and cards follow this palette.")}</span>
      </div>
      <div class="sim-burst-preview-wrap">
        <div class="color-preview-phone sim-burst-preview"><div class="sim-burst-preview-clock">12<br>48</div><div class="sim-burst-preview-dots"><i></i><i></i><i></i><i></i></div></div>
        <div class="sim-burst-live-palette"><i style="--dot:${burst.primary}"></i><i style="--dot:${burst.secondary}"></i><i style="--dot:${burst.tertiary}"></i></div>
      </div>

      <div class="sim-burst-card">
        <div class="sim-burst-tabs">
          <button type="button" class="${wallpaperActive ? "active" : ""}" data-color-tab="wallpaper">▧ ${t("wallpaperColor")}</button>
          <button type="button" class="${!wallpaperActive ? "active" : ""}" data-color-tab="other">◇ ${t("otherColor")}</button>
        </div>

        ${wallpaperActive ? `
          <button type="button" class="sim-burst-extract" data-action="extractSimWallpaperPalette">
            <span class="sim-burst-extract-icon">✦</span>
            <span><strong>${simColorText("Ambil warna dari wallpaper", "Get colors from wallpaper")}</strong><small>${simColorText("Gunakan foto waifu yang sedang dipakai di layar utama", "Use the waifu photo currently set on the home screen")}</small></span>
          </button>
          <div class="sim-burst-section-title">${simColorText("Palet wallpaper", "Wallpaper palettes")}</div>
          <div class="sim-burst-palette-row">${wallpaperPresets.map(p => `<button class="sim-burst-swatch ${!state.simExtractedPalette && state.palette === p.id ? "active" : ""}" type="button" data-palette="${p.id}" title="${p.id}" style="--p1:${p.accent};--p2:${p.parts[1]};--p3:${p.parts[2]}"><span><i></i><i></i><i></i></span></button>`).join("")}</div>
        ` : `
          <div class="sim-burst-section-title">${simColorText("Warna lain", "Other colors")}</div>
          <div class="sim-manual-colors">${manualColors.map(c => `<button type="button" class="sim-manual-color ${state.simColorSource === "manual" && state.simCustomColor?.toLowerCase() === c.toLowerCase() ? "active" : ""}" data-sim-manual-color="${c}" style="--manual:${c}" aria-label="${c}"></button>`).join("")}</div>
          <label class="sim-custom-color-row"><span><strong>${simColorText("Warna khusus", "Custom color")}</strong><small>${simColorText("Pilih warna dasar sendiri", "Choose your own base color")}</small></span><input id="simCustomColor" type="color" value="${escapeHtml(state.simCustomColor || burst.primary)}"></label>
        `}

        <div class="sim-burst-dark-row"><span><strong>${t("darkTheme")}</strong><small>${simColorText("Palet gelap menggunakan aksen yang sama", "Dark palette keeps the same accent colors")}</small></span>${toggle("dark")}</div>
      </div>
      <div class="sim-burst-scope-note">ⓘ ${simColorText("Perubahan warna hanya berlaku di simulator Android. Tampilan website tidak ikut berubah.", "Color changes apply only inside the Android simulator. The website theme is not changed.")}</div>
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
    const previewApps = Array.from({ length: Math.min(state.layoutDraft * 4, 24) }, (_, i) => `<i style="--preview-i:${i}"></i>`).join("");
    root.innerHTML = `<div class="a17-page wallstyle-page">${topbar(t("chooseLayout"), { back: false, close: true, apply: true })}
      <div class="layout-live-preview">
        <div class="layout-preview-lock"><span>${formatTime().replace(".", "<br>")}</span></div>
        <div class="layout-preview-home" style="--layout-preview-cols:${state.layoutDraft}"><div class="layout-preview-apps">${previewApps}</div><div class="layout-preview-search"></div></div>
      </div>
      <div class="choice-grid">${[4,5,6].map(cols => `<button class="choice-card layout-choice ${state.layoutDraft === cols ? "active" : ""}" type="button" data-layout-draft="${cols}"><b>${layoutDots(cols)}</b><small>${cols} × 4</small></button>`).join("")}</div>
      <p class="layout-helper">Pilihan ini mengatur jumlah kolom di layar utama dan daftar aplikasi.</p>
    </div>`;
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
      ["⌁", "Jaringan & internet", state.wifi ? "Wi-Fi" : "Wi-Fi nonaktif", "networkInternet"],
      ["◫", "Perangkat terhubung", state.bluetooth ? "Bluetooth" : "Bluetooth nonaktif", "connectedDevices"],
      ["▦", "Aplikasi", "Aplikasi default", "appsSettings"],
      ["◉", "Notifikasi", "Kelola notifikasi aplikasi dan sistem", "notificationsSettings"],
      ["▰", "Baterai", `${state.battery}%`, "batterySettings"],
      ["▥", "Penyimpanan", "128 GB", "storageSettings"],
      ["✦", t("style"), "Material 3 Expressive", "wallpaperStyle"],
      ["▣", "Layar & sentuhan", state.dark ? "Tema gelap" : "Tema terang", "displaySettings"],
      ["♫", "Suara & getaran", `${t("volume")}: ${state.volume}%`, "soundSettings"],
      ["◆", "Keamanan & privasi", state.screenLock, "securityPrivacy"],
      ["⚙", t("system"), t("systemDesc"), "system"],
      ["ⓘ", t("aboutPhone"), "Google Pixel 10 • Frankel", "about"]
    ];
    root.innerHTML = `<div class="a17-page wallstyle-page settings-main-page"><div class="a17-topbar"><h3>${t("settings")}</h3></div><div class="settings-search">⌕ ${t("searchSettings")}</div><div class="a17-card">${rows.map(r => row({ title:r[1], desc:r[2], nav:r[3], icon:r[0] })).join("")}</div></div>`;
  }

  function sectionLabel(text) {
    return `<div class="a17-section settings-section-label">${text}</div>`;
  }

  function plainRow(title, desc = "", trailing = "") {
    return `<div class="a17-row"><span class="a17-copy"><strong>${title}</strong>${desc ? `<span>${desc}</span>` : ""}</span>${trailing}</div>`;
  }

  function switchRow(title, desc, key, disabled = false) {
    return `<div class="a17-row ${disabled ? "is-disabled" : ""}"><span class="a17-copy"><strong>${title}</strong>${desc ? `<span>${desc}</span>` : ""}</span>${disabled ? `<button class="a17-switch ${state[key] ? "on" : ""}" type="button" disabled></button>` : toggle(key)}</div>`;
  }

  function navRow(title, desc, nav, icon = "") {
    return row({ title, desc, nav, trailing: icon ? `<span class="a17-trailing setting-leading-icon">${icon}</span>` : "" });
  }

  function rangeRow(title, desc, key, min = 0, max = 100, suffix = "%") {
    return `<div class="a17-row settings-range-row"><span class="a17-copy"><strong>${title}</strong>${desc ? `<span>${desc}</span>` : ""}</span><div class="settings-inline-range"><input type="range" min="${min}" max="${max}" value="${Number(state[key])}" data-setting-range="${key}"><output>${Number(state[key])}${suffix}</output></div></div>`;
  }

  function choiceRow(title, desc, key, value, nav = "") {
    const selected = state[key] === value;
    return `<button class="a17-row setting-choice-row" type="button" data-state-value-key="${key}" data-state-value="${escapeHtml(value)}" ${nav ? `data-next-after-value="${nav}"` : ""}><span class="system-radio ${selected ? "active" : ""}"><i></i></span><span class="a17-copy"><strong>${title}</strong>${desc ? `<span>${desc}</span>` : ""}</span></button>`;
  }

  function infoNote(text) {
    return `<div class="settings-info-note"><span>ⓘ</span><p>${text}</p></div>`;
  }

  function smallHero(type, label = "") {
    const icon = { battery:"▰", storage:"▥", display:"▣", network:"⌁", sound:"♫", security:"◆", apps:"▦", notifications:"◉" }[type] || "●";
    return `<div class="settings-mini-hero ${type}"><span>${icon}</span>${label ? `<strong>${label}</strong>` : ""}</div>`;
  }

  function renderNetworkInternet() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Jaringan & internet")}
      <div class="a17-card system-card">
        ${navRow("Internet", state.connectedWifi, "internetSettings", "⌁")}
        ${navRow("SIM", "3, Indosat Ooredoo", "simSettings", "▦")}
        ${switchRow("Mode pesawat", "", "airplane")}
        ${navRow("Hotspot & tethering", state.hotspot ? "Aktif" : "Nonaktif", "hotspotSettings", "◉")}
        ${navRow("Penghemat Data", state.dataSaver ? "Aktif" : "Nonaktif", "dataSaverSettings", "◔")}
        ${navRow("VPN", state.vpnEnabled ? "VPN dari Google" : "Tidak ada", "vpnSettings", "⚿")}
        ${navRow("DNS Pribadi", state.privateDns === "off" ? "Nonaktif" : state.privateDns, "privateDnsSettings", "▤")}
      </div>
    </div>`;
  }

  function renderInternetSettings() {
    const networks = [state.connectedWifi, "Wifi Berbagi Rezeki", "A2 Digitall", "POCO ang", "SDN KARYA MULYA KEPSEK", "TP-Link_D368"];
    root.innerHTML = `<div class="a17-page system-page">${topbar("Internet")}
      ${sectionLabel("Data seluler")}
      <div class="a17-card system-card">${navRow("3", state.mobileData ? "Data seluler aktif" : "Data seluler tidak akan terhubung otomatis", "simSettings", "▮")}</div>
      ${sectionLabel("Wi-Fi")}
      <div class="a17-card system-card">${switchRow("Gunakan Wi-Fi", "", "wifi")}
        ${state.wifi ? `<button class="a17-row" type="button" data-wifi-network="${escapeHtml(state.connectedWifi)}"><span class="a17-trailing setting-leading-icon">⌁</span><span class="a17-copy"><strong>${state.connectedWifi}</strong><span>Terhubung</span></span><span class="a17-chevron">⚙</span></button>` : ""}
      </div>
      ${state.wifi ? `${sectionLabel("Jaringan")}<div class="a17-card system-card">${networks.slice(1).map(n => `<button class="a17-row" type="button" data-wifi-network="${escapeHtml(n)}"><span class="a17-trailing setting-leading-icon">⌁</span><span class="a17-copy"><strong>${n}</strong></span><span class="a17-chevron">▣</span></button>`).join("")}</div>` : infoNote("Aktifkan Wi-Fi untuk melihat jaringan yang tersedia.")}
    </div>`;
  }

  function renderSimSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("SIM")}
      <div class="a17-card system-card">
        ${switchRow("3", maskSimNumber(state.simPhone1), "sim1Enabled")}
        ${switchRow("Indosat Ooredoo", "+62 857-****-2843", "sim2Enabled")}
      </div>
      ${sectionLabel("Data seluler")}
      <div class="a17-card system-card">
        ${switchRow("Data seluler", "Akses data menggunakan jaringan seluler", "mobileData")}
        ${switchRow("Pengalihan data otomatis", "Gunakan data dari salah satu SIM tergantung jangkauan dan ketersediaan", "autoDataSwitch")}
      </div>
      ${sectionLabel("SIM utama")}
      <div class="a17-card system-card">
        ${plainRow("Panggilan", "Selalu tanya", `<span class="a17-chevron">›</span>`)}
        ${plainRow("Pesan teks", "3", `<span class="a17-chevron">›</span>`)}
        ${plainRow("Data seluler", "3", `<span class="a17-chevron">›</span>`)}
      </div>
    </div>`;
  }

  function renderHotspotSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Hotspot & tethering")}
      <p class="system-description">Gunakan hotspot dan tethering untuk menyediakan koneksi internet bagi perangkat lain melalui Wi-Fi, Bluetooth, atau data seluler.</p>
      <div class="a17-card system-card">
        ${switchRow("Hotspot Wi-Fi", state.hotspot ? "Berbagi koneksi internet" : "Tidak berbagi koneksi internet atau konten dengan perangkat lain", "hotspot")}
        ${switchRow("Tethering USB", "Bagikan koneksi internet ponsel melalui USB", "usbTether", true)}
        ${switchRow("Tethering bluetooth", "Bagikan koneksi internet ponsel melalui Bluetooth", "bluetoothTether")}
        ${switchRow("Tethering Ethernet", "Bagikan koneksi internet ponsel melalui Ethernet", "ethernetTether", true)}
        ${switchRow("Use VPN for connected devices", "When this device is using a VPN, connected devices use the same VPN", "hotspotUseVpn")}
      </div>
    </div>`;
  }

  function renderDataSaverSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Penghemat Data")}
      <div class="data-saver-hero">${switchRow("Gunakan Penghemat Data", "", "dataSaver")}</div>
      <div class="a17-card system-card">${navRow("Data seluler tak terbatas", "1 aplikasi diizinkan menggunakan data seluler tak terbatas saat Penghemat Data aktif", "appBatteryUsage")}</div>
      ${infoNote("Untuk membantu mengurangi penggunaan data, Penghemat Data mencegah beberapa aplikasi mengirim atau menerima data di latar belakang. Aplikasi yang sedang digunakan tetap dapat mengakses data.")}
    </div>`;
  }

  function renderVpnSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("VPN")}<button class="settings-plus" type="button" data-action="toggleVpn">＋</button>
      ${sectionLabel("Built-in")}
      <div class="a17-card system-card"><button class="a17-row" type="button" data-action="toggleVpn"><span class="vpn-shield">G</span><span class="a17-copy"><strong>VPN dari Google</strong><span>${state.vpnEnabled ? "Terhubung" : "Ketuk untuk terhubung"}</span></span>${state.vpnEnabled ? `<span class="status-ok">✓</span>` : ""}</button></div>
    </div>`;
  }

  function renderPrivateDnsSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("DNS Pribadi")}
      <div class="a17-card system-card">
        ${choiceRow("Nonaktif", "", "privateDns", "off")}
        ${choiceRow("Otomatis", "Gunakan DNS aman jika tersedia", "privateDns", "auto")}
        ${choiceRow("Nama host penyedia DNS pribadi", "dns.google", "privateDns", "dns.google")}
      </div>
      <div class="a17-card system-card muted-card">${switchRow("Nonaktifkan untuk VPN", "Nonaktifkan DNS pribadi saat terhubung ke VPN", "privateDnsForVpn", !state.vpnEnabled)}</div>
    </div>`;
  }

  function renderConnectedDevices() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Perangkat terhubung")}
      ${state.pairedDevice ? `<div class="a17-card system-card">${navRow(state.pairedDevice, state.pairedDeviceConnected ? "Terhubung" : "Tersimpan", "bluetoothDeviceDetail", "◉")}</div>` : ""}
      <div class="a17-card system-card">${navRow("Sambungkan perangkat baru", state.bluetooth ? "Bluetooth aktif" : "Aktifkan Bluetooth", "pairNewDevice", "＋")}${navRow("Preferensi koneksi", "Bluetooth, NFC, Cast, pencetakan", "connectionPreferences")}</div>
    </div>`;
  }

  function renderConnectionPreferences() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Preferensi koneksi")}<div class="a17-card system-card">
      ${navRow("Bluetooth", state.bluetooth ? "Aktif" : "Nonaktif", "bluetoothSettings", "ᛒ")}
      ${navRow("Layanan lintas perangkat", state.crossDeviceReady ? "Siap" : "Transfer panggilan, berbagi internet", "crossDevice", "▣")}
      ${navRow("NFC", state.nfc ? "Aktif" : "Nonaktif", "nfcSettings", "N")}
      ${navRow("Google Cast", "Tidak terhubung", "castSettings", "◫")}
      ${navRow("Pencetakan", state.printingService ? "1 layanan cetak aktif" : "Nonaktif", "printingSettings", "▤")}
      ${navRow("Chromebook", "Perangkat Chromebook", "chromebookSettings", "▱")}
      ${navRow("Quick Share", state.quickShareVisible ? "Dapat dilihat kontak" : "Tidak terlihat", "quickShareSettings", "◇")}
      ${navRow("Android Auto", "Gunakan aplikasi di layar kendaraan", "androidAutoSettings", "△")}
    </div></div>`;
  }

  function renderBluetoothSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Bluetooth")}
      <div class="bluetooth-hero-switch">${switchRow("Gunakan Bluetooth", "", "bluetooth")}</div>
      <div class="a17-card system-card">${plainRow("Nama perangkat", "POCO F3")}${navRow("Sambungkan perangkat baru", "", "pairNewDevice", "＋")}</div>
      ${infoNote("Jika Bluetooth aktif, perangkat Anda dapat berkomunikasi dengan perangkat Bluetooth di sekitar.")}
    </div>`;
  }

  function renderPairNewDevice() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Sambungkan perangkat baru")}
      <div class="a17-card system-card">${plainRow("Nama perangkat", "POCO F3")}</div>
      ${sectionLabel("Perangkat yang tersedia")}
      <div class="scan-spinner">C</div>
      <div class="a17-card system-card"><button class="a17-row" type="button" data-action="pairI12"><span class="a17-copy"><strong>i12</strong><span>Headset Bluetooth</span></span><span class="a17-chevron">›</span></button></div>
      ${infoNote("Alamat Bluetooth ponsel: FF:DD:31:5F:XX:XX")}
    </div>`;
  }

  function renderBluetoothDeviceDetail() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Detail perangkat")}
      <div class="device-detail-hero"><h4>${state.pairedDevice || "i12"} ✎</h4><span>${state.pairedDeviceConnected ? "Menghubungkan" : "Tidak terhubung"}</span><div class="headphone-orb">◉</div><div class="device-actions"><button data-action="forgetDevice">▣<small>Lupakan</small></button><button data-action="connectDevice">＋<small>${state.pairedDeviceConnected ? "Putuskan" : "Hubungkan"}</small></button></div></div>
      <div class="a17-card system-card">${switchRow("Audio Spasial", "Audio dari perangkat media yang kompatibel menjadi lebih imersif", "spatialAudio")}${switchRow("Izinkan akses ke kontak dan histori panggilan", "Info akan digunakan untuk pengumuman panggilan", "contactHistoryAccess", true)}${plainRow("Jenis perangkat audio", "Tidak disetel")}</div>
    </div>`;
  }

  function renderCrossDevice() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Siapkan layanan lintas perangkat")}
      ${smallHero("network", "Perangkat yang login ke Akun Google dapat menemukan perangkat ini")}
      <button class="system-add-button" type="button" data-action="crossDeviceReady">Berikutnya</button>
    </div>`;
  }

  function renderNfcSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("NFC")}<div class="a17-card system-card">${switchRow("Gunakan NFC", "", "nfc")}${plainRow("Pembayaran nirsentuh", state.nfc ? "Pilih aplikasi pembayaran" : "Tidak tersedia karena NFC nonaktif")}</div></div>`;
  }

  function renderCastSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Google Cast")}<div class="cast-hero">◫</div><p class="empty-state-text">Tidak ditemukan perangkat di sekitar.</p></div>`;
  }

  function renderPrintingSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Pencetakan")}${sectionLabel("Layanan cetak")}<div class="a17-card system-card">${switchRow("Layanan Cetak Default", state.printingService ? "Aktif" : "Nonaktif", "printingService")}<button class="a17-row" type="button" data-action="addPrinter"><span class="a17-copy"><strong>＋ Tambahkan layanan</strong></span></button></div></div>`;
  }

  function renderChromebookSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Chromebook")}<p class="system-description">Perangkat Xiaomi M2012K11AG Anda tidak ditautkan ke Chromebook. Tautkan perangkat untuk mengirim pesan teks, mengaktifkan hotspot, dan membuka kunci.</p><div class="a17-card system-card">${plainRow("Akun", "pixel.demo@example.com")}</div></div>`;
  }

  function renderQuickShareSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Quick Share")}<div class="quick-share-orbs"><span>↓<small>Terima</small></span><span>↑<small>Kirim</small></span></div><div class="a17-card system-card">${plainRow("Akun", "pixel.demo@example.com")}${plainRow("Nama perangkat", "Naufal Marian Syahad - ponsel")}${plainRow("Yang dapat berbagi dengan Anda", "Kontak")}${switchRow("Gunakan data seluler", "Lanjutkan berbagi meskipun Wi-Fi tidak tersedia", "quickShareVisible")}</div></div>`;
  }

  function renderAndroidAutoSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Android Auto")}<div class="android-auto-hero">A</div><div class="a17-card system-card">${plainRow("Hubungkan mobil", "Gunakan kabel USB atau koneksi nirkabel")}${plainRow("Mulai Android Auto otomatis", "Saat ponsel terhubung ke kendaraan")}</div></div>`;
  }

  function renderAppsSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Aplikasi")}
      <div class="recent-apps-block"><strong>Aplikasi yang baru dibuka</strong><div class="a17-card system-card">${["Nekogram","Chrome","TikTok","YouTube"].map((n,i)=>plainRow(n, `${[19,29,46,70][i]} menit yang lalu`)).join("")}${navRow(`Lihat semua ${ALL_APPS.length} aplikasi`, "", "allApps")}</div></div>
      ${sectionLabel("Umum")}<div class="a17-card system-card">
        ${navRow("Aplikasi default", "Chrome, Telepon, dan Message", "defaultApps")}
        ${navRow("Aplikasi Clone", `${state.cloneApps.length} aplikasi di-clone`, "cloneApps")}
        ${navRow("Ruang Game", "Tingkatkan pengalaman bermain game Anda", "gameSpace")}
        ${navRow("Asisten", "OK Google dan setelan Asisten lainnya", "assistantSettings")}
        ${navRow("Waktu pemakaian perangkat", "1 j, 17 mnt hari ini", "digitalWellbeing")}
        ${navRow("Setelan media cloud", state.mediaCloud === "google" ? "Google Foto" : "Tidak ada", "mediaCloudSettings")}
        ${navRow("Bilah Sisi", state.sideBar ? "Aktif" : "Tidak aktif", "sideBarSettings")}
        ${navRow("Penyimpanan kontak", state.contactStorage === "google" ? "Perangkat & Google" : "Perangkat saja", "contactStorageSettings")}
        ${navRow("Aplikasi yang tidak digunakan", "0 aplikasi tidak digunakan", "unusedApps")}
        ${navRow("Penggunaan baterai aplikasi", "Setel penggunaan baterai untuk aplikasi", "appBatteryUsage")}
        ${navRow("Akses aplikasi khusus", "", "specialAppAccess")}
      </div>
    </div>`;
  }

  function renderAllApps() {
    root.innerHTML = `<div class="a17-page system-page all-apps-page">${topbar("Semua aplikasi")}
      <label class="all-apps-search"><span>⌕</span><input id="allAppsSearch" type="search" placeholder="Telusuri aplikasi" autocomplete="off"><small>${ALL_APPS.length}</small></label>
      <div class="all-apps-count" id="allAppsCount">${ALL_APPS.length} aplikasi terinstal</div>
      <div class="a17-card system-card app-list-card">${ALL_APPS.map(app => `<button class="a17-row installed-app-row" type="button" data-app-info="${app.id}" data-app-search="${app.name.toLowerCase()}"><span class="sim-app-icon tone-${app.tone}">${app.glyph}</span><span class="a17-copy"><strong>${app.name}</strong><span>${app.category === "system" ? "Sistem" : "Terinstal"}</span></span><span class="a17-chevron">›</span></button>`).join("")}</div>
      <div class="all-apps-empty" id="allAppsEmpty" hidden>Tidak ada aplikasi yang cocok.</div>
    </div>`;
  }

  function renderDefaultApps() {
    const items=[["Aplikasi asisten digital","Google"],["Aplikasi browser","Chrome"],["Aplikasi dompet","Google Wallet"],["Aplikasi ID penelepon & spam","Tidak ada"],["Aplikasi layar","Peluncur Pixel"],["Aplikasi SMS","Message"],["Aplikasi telepon","Telepon"]];
    root.innerHTML=`<div class="a17-page system-page">${topbar("Aplikasi default")}<div class="a17-card system-card">${items.map(x=>plainRow(x[0],x[1],`<span class="a17-chevron">›</span>`)).join("")}</div></div>`;
  }

  function renderCloneApps() {
    const candidates=["Android System Key Verifier","Android System SafetyCore","BRImo","Canva","CapCut"];
    root.innerHTML=`<div class="a17-page system-page">${topbar("Aplikasi Clone")}<p class="system-description">Buat instance aplikasi kedua agar Anda dapat menggunakan dua akun bersamaan.</p><div class="clone-illustration">◉ ◉</div><div class="a17-card system-card">${candidates.map(a=>`<button class="a17-row" type="button" data-clone-app="${a}"><span class="a17-copy"><strong>${a}</strong></span><span class="a17-switch ${state.cloneApps.includes(a)?"on":""}"></span></button>`).join("")}</div></div>`;
  }

  function renderGameSpace() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Ruang Game")}<div class="game-space-hero">▦</div>${sectionLabel("Optimisasi Peluncur")}<div class="a17-card system-card">${switchRow("Manajemen Memori Cerdas","Secara otomatis menghapus aplikasi latar belakang saat meluncurkan game","gameTouchBoost")}${switchRow("Manajemen Cache","Optimalkan cache game untuk waktu pemuatan yang lebih cepat","gameOverlay")}</div>${sectionLabel("Opsi dalam game")}<div class="a17-card system-card">${switchRow("Nonaktifkan kecerahan otomatis","Pertahankan kecerahan tetap saat dalam game","gameBrightnessLock")}${switchRow("Tetap terjaga","Jaga agar layar tetap aktif saat bermain game","gameKeepAwake")}${switchRow("Mode Pemberitahuan Darurat","Tampilkan notifikasi sebagai gelembung","gameDnd")}${switchRow("Notifikasi dengan haptik besar","Getar saat notifikasi muncul","gameHaptic")}</div></div>`;
  }

  function renderAssistantSettings() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Asisten")}<div class="assistant-orb">G</div><div class="a17-card system-card">${plainRow("Aplikasi asisten digital","Google")}${switchRow("Hai Google","Aktifkan dengan suara","assistantGesture")}</div></div>`;
  }

  function renderDigitalWellbeing() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Detail aktivitas aplikasi")}<div class="wellbeing-summary"><strong>1 j, 17 mnt</strong><span>Hari ini</span><div class="wellbeing-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div><div class="a17-card system-card">${plainRow("TikTok","50 menit")}${plainRow("Nekogram","10 menit")}${plainRow("Setelan","1 menit")}</div></div>`;
  }

  function renderMediaCloudSettings() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Setelan media cloud")}<p class="system-description">Akses media cloud saat aplikasi atau situs meminta Anda memilih foto atau video.</p><div class="a17-card system-card">${choiceRow("Google Foto","pixel.demo@example.com","mediaCloud","google")}${choiceRow("Tidak ada","","mediaCloud","none")}</div></div>`;
  }

  function renderSideBarSettings() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Bilah Sisi")}<div class="side-bar-switch">${switchRow("Gunakan Bilah Sisi","", "sideBar")}</div><p class="system-description">Aktifkan otomatis bilah sisi untuk aplikasi yang dipilih dan tampilkan bilah sisi secara otomatis saat aplikasi membentang.</p></div>`;
  }

  function renderContactStorageSettings() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Penyimpanan kontak")}<p class="system-description">Kontak akan disimpan ke perangkat dan disinkronkan ke akun sesuai default.</p><div class="a17-card system-card">${choiceRow("Perangkat & Google","pixel.demo@example.com","contactStorage","google")}${choiceRow("Perangkat saja","Kontak mungkin tidak disinkronkan","contactStorage","device")}</div></div>`;
  }

  function renderUnusedApps() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Aplikasi yang tidak digunakan")}<div class="empty-apps-icon">⠿</div><p class="empty-state-text">Tidak ada aplikasi</p></div>`;
  }

  function renderAppBatteryUsage() {
    const apps=["Amplifier Suara","Android Accessibility Suite","Android Auto","Android Switch","Android System Key Verifier","Android System SafetyCore","Android System WebView","BCR","BRImo"];
    root.innerHTML=`<div class="a17-page system-page">${topbar("Penggunaan baterai aplikasi")}<div class="a17-card system-card">${apps.map(a=>plainRow(a,"Optimalkan")).join("")}</div></div>`;
  }

  function renderSpecialAppAccess() {
    const items=["Akses semua file","Admin perangkat","Tampilkan menindih aplikasi lain","Akses Mode","Aplikasi pengelolaan media","Ubah setelan sistem","Membaca, membalas & mengontrol notifikasi","Picture-in-picture","Ubah output media","SMS Premium"];
    root.innerHTML=`<div class="a17-page system-page">${topbar("Akses aplikasi khusus")}<div class="a17-card system-card">${items.map(x=>plainRow(x,"",`<span class="a17-chevron">›</span>`)).join("")}</div></div>`;
  }

  function renderNotificationsSettings() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Notifikasi")}
      ${sectionLabel("Kelola")}<div class="a17-card system-card">${navRow("Notifikasi aplikasi","Kontrol notifikasi dari setiap aplikasi","notificationApps")}${navRow("Histori notifikasi",state.notificationHistory?"Aktif":"Nonaktif","notificationHistory")}</div>
      ${sectionLabel("Percakapan")}<div class="a17-card system-card">${navRow("Percakapan","Tidak ada percakapan prioritas","notificationConversations")}${navRow("Balon",state.bubbles?"Aktif":"Nonaktif","notificationBubbles")}</div>
      ${sectionLabel("Privasi")}<div class="a17-card system-card">${navRow("Membaca, membalas & mengontrol notifikasi","Kontrol aplikasi dan perangkat yang dapat membaca notifikasi","notificationAccess")}${navRow("Notifikasi di layar kunci","", "notifications")}</div>
      ${sectionLabel("Umum")}<div class="a17-card system-card">${navRow("Pengurangan suara dan getaran notifikasi","", "notificationSoundSettings")}${navRow("Notifikasi flash","Kamera / layar","flashNotifications")}${navRow("Peringatan darurat nirkabel","", "emergencyAlerts")}</div>
    </div>`;
  }

  function renderNotificationApps() {
    const apps=["Nekogram","Threads","OVO","YouTube","Grab","X","WhatsApp Business","Google Play Store","Facebook"];
    const map = state.notificationAppStates || {};
    root.innerHTML=`<div class="a17-page system-page">${topbar("Notifikasi aplikasi")}<div class="a17-card system-card">${apps.map(a=>`<button class="a17-row" type="button" data-map-toggle="notificationAppStates" data-map-key="${a}"><span class="a17-copy"><strong>${a}</strong><span>Terbaru</span></span><span class="a17-switch ${map[a]!==false?"on":""}"></span></button>`).join("")}</div></div>`;
  }

  function renderNotificationHistory() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Histori notifikasi")}<div class="history-switch">${switchRow("Gunakan histori notifikasi","", "notificationHistory")}</div><div class="history-orb">↶</div><p class="empty-state-text">${state.notificationHistory?"Belum ada notifikasi yang tersimpan":"Histori notifikasi dinonaktifkan"}</p></div>`;
  }

  function renderNotificationConversations() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Percakapan")}${sectionLabel("Percakapan terbaru")}<button class="system-add-button" data-action="clearConversations">Hapus percakapan terbaru</button><div class="a17-card system-card">${["99910","accestore","Advan XII","Afterlife Project","BAHTERA roleplay"].map(n=>plainRow(n,"Internal notifications",`<span class="a17-chevron">×</span>`)).join("")}</div></div>`;
  }

  function renderNotificationBubbles() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Balon")}<p class="system-description">Beberapa percakapan akan muncul sebagai ikon mengambang di atas aplikasi lain.</p><div class="bubble-illustration">◌</div><div class="a17-card system-card">${switchRow("Izinkan aplikasi menampilkan balon","", "bubbles")}</div></div>`;
  }

  function renderNotificationAccess() {
    const enabled = new Set(state.notificationAccess || []);
    const apps=["Android Auto","Dolby Atmos","Layanan Google Play Protect","Peluncur Pixel","Android System Intelligence","Layanan Google Play","Layanan Konektivitas Perangkat","Ruang Game","Kontak"];
    root.innerHTML=`<div class="a17-page system-page">${topbar("Membaca, membalas & mengontrol notifikasi")}<div class="a17-card system-card">${apps.map(a=>`<button class="a17-row" type="button" data-notification-access="${a}"><span class="a17-copy"><strong>${a}</strong><span>${enabled.has(a)?"Diizinkan":"Tidak diizinkan"}</span></span><span class="a17-switch ${enabled.has(a)?"on":""}"></span></button>`).join("")}</div></div>`;
  }

  function renderNotificationSoundSettings() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Pengurangan suara dan getaran notifikasi")}<p class="system-description">Saat Anda menerima banyak notifikasi dalam waktu singkat, perangkat akan mengurangi volume dan meminimalkan notifikasi.</p><div class="a17-card system-card">${switchRow("Gunakan pengurangan suara dan getaran notifikasi","", "gameDnd")}</div></div>`;
  }

  function renderFlashNotifications() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Notifikasi flash")}<div class="flash-illustration">◉ ✦</div><div class="a17-card system-card">${switchRow("Flash kamera","", "notificationFlashCamera")}${switchRow("Flash layar","Kuning", "notificationFlashScreen")}</div></div>`;
  }

  function renderEmergencyAlerts() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Peringatan darurat nirkabel")}<div class="a17-card system-card">${switchRow("Izinkan peringatan","Terima peringatan darurat nirkabel", "emergencyAlerts")}</div>${sectionLabel("Peringatan")}<div class="a17-card system-card">${switchRow("Ancaman ekstrem","Ancaman ekstrem terhadap nyawa dan harta", "alertExtreme")}${switchRow("Ancaman berat","Ancaman berat terhadap nyawa dan harta", "alertSevere")}${switchRow("Peringatan AMBER","Pesan darurat penculikan anak", "alertAmber")}${switchRow("Peringatan uji coba","Pesan pengujian operator dan sistem", "alertTest")}</div></div>`;
  }

  function renderBatterySettings() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Baterai")}<div class="battery-gauge"><strong>${state.battery}<small>%</small></strong><div><i style="width:${state.battery}%"></i></div><span>1 hr, 2 j</span></div><div class="a17-card system-card">${navRow("Penggunaan baterai","Lihat penggunaan sejak terakhir penuh","batteryUsage")}${navRow("Penghemat Baterai",state.batterySaver?"Aktif":"Nonaktif","batterySaverSettings")}${navRow("Pengelola Baterai",state.batteryManager?"Aktif":"Nonaktif","batteryManagerSettings")}${navRow("Penggunaan baterai aplikasi","", "appBatteryUsage")}${navRow("Widget baterai","Tambahkan ke layar utama", "batteryWidget")}${navRow("Kontrol pengisian daya",state.chargingControl?"Diaktifkan":"Dimatikan","chargingControl")}${plainRow("Informasi baterai","Kesehatan: Baik")}</div></div>`;
  }

  function renderBatteryUsage() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Penggunaan baterai")}<div class="battery-chart"><strong>100%</strong><svg viewBox="0 0 300 110"><polyline points="0,18 75,45 150,35 225,60 300,72" fill="none" stroke="currentColor" stroke-width="3"/></svg><span>Min &nbsp;&nbsp; Sen &nbsp;&nbsp; Sel</span></div><p class="system-description">Waktu pemakaian perangkat sejak terakhir kali baterai terisi penuh.</p></div>`;
  }

  function renderBatterySaverSettings() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Penghemat Baterai")}<div class="battery-saver-hero">${switchRow("Gunakan Penghemat Baterai","", "batterySaver")}</div><div class="a17-card system-card">${choiceRow("Penghemat Baterai Standar","Membatasi efek visual dan aktivitas latar belakang","batterySaverExtreme",false)}${choiceRow("Penghemat Baterai Ekstrem","Menjeda sebagian besar aplikasi","batterySaverExtreme",true)}${plainRow("Jadwal dan pengingat","Atur kapan Penghemat Baterai diaktifkan")}${switchRow("Baterai Adaptif","", "batteryAdaptive")}</div></div>`;
  }

  function renderBatteryManagerSettings() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Pengelola Baterai")}<div class="battery-manager-art">▰</div><div class="a17-card system-card">${switchRow("Baterai Adaptif","Batasi baterai untuk aplikasi yang tidak sering digunakan","batteryAdaptive")}</div>${infoNote("Pengelola Baterai mendeteksi aplikasi yang menggunakan baterai berlebihan dan dapat membatasi aktivitasnya.")}</div>`;
  }

  function renderBatteryWidget() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Baterai")}<div class="battery-widget-preview"><strong>Pixel</strong><span>100%</span><span>i12 &nbsp; 55%</span><span>Pixel Buds &nbsp; 90%</span></div><div class="widget-actions"><button data-nav="batterySettings">Batal</button><button data-action="addBatteryWidget">Tambahkan ke layar utama</button></div></div>`;
  }

  function renderChargingControl() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Kontrol pengisian daya")}<div class="charging-hero">${switchRow("Aktifkan kontrol pengisian daya","", "chargingControl")}</div><div class="a17-card system-card is-disabled">${plainRow("Mode pengisian daya","Pengisian akan diatur berdasarkan kebiasaan Anda")}</div></div>`;
  }

  function renderStorageSettings() {
    const used = 57;
    root.innerHTML=`<div class="a17-page system-page">${topbar("Penyimpanan")}<div class="storage-summary"><strong>${used}<small> GB digunakan</small></strong><span>Total 256 GB</span><div><i style="width:${used/2.56}%"></i></div></div><div class="a17-card system-card">${switchRow("Pengelola penyimpanan","Kosongkan ruang secara otomatis", "storageManager")}${plainRow("Aplikasi","27 GB")}${plainRow("Lainnya","9,7 GB")}${plainRow("Video","1,3 GB")}${plainRow("Gambar","343 MB")}${plainRow("Sampah","42 MB")}${plainRow("Dokumen","36 MB")}</div><button class="system-add-button" data-action="cleanStorage">Kosongkan ruang penyimpanan</button></div>`;
  }

  function renderDisplaySettings() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Layar")}
      ${sectionLabel("Kecerahan")}<div class="a17-card system-card">${rangeRow("Tingkat kecerahan","", "brightness",35,100,"%")}${navRow("Kecerahan adaptif",state.adaptiveBrightness?"Aktif":"Nonaktif","adaptiveBrightnessSettings")}${navRow("Kecerahan HDR yang ditingkatkan",state.hdrBrightness?"Aktif":"Nonaktif","hdrBrightnessSettings")}${navRow("Ekstra redup",state.extraDim?"Aktif":"Nonaktif","extraDimSettings")}</div>
      ${sectionLabel("Tampilan layar kunci")}<div class="a17-card system-card">${navRow("Layar kunci","Sesuaikan layar kunci", "lockScreenDisplay")}${navRow("Layar always-on",state.alwaysOn?"Aktif":"Nonaktif", "alwaysOnSettings")}${navRow("Layar mati",state.screenTimeout,"screenTimeoutSettings")}</div>
      ${sectionLabel("Warna")}<div class="a17-card system-card">${navRow("Tema gelap",state.dark?"Aktif":"Nonaktif","darkThemeSettings")}${navRow("Ukuran tampilan & teks",`Font ${state.fontScale}% • Tampilan ${state.displayScale}%`,"displaySizeText")}${navRow("LiveDisplay","Optimalkan layar berdasarkan waktu","liveDisplay")}${navRow("Cahaya Malam",state.nightLight?"Aktif":"Nonaktif","nightLightSettings")}${navRow("Warna",state.colorMode,"displayColorSettings")}</div>
      ${sectionLabel("Kontrol tampilan lain")}<div class="a17-card system-card">${navRow("Setelan rotasi",state.autoRotate?"Rotasi otomatis":"Potret","rotationSettings")}${navRow("Kecepatan refresh layar",`${state.refreshRate} Hz`,"refreshRateSettings")}${navRow("Potongan layar",state.screenCutout,"cutoutSettings")}${navRow("Aplikasi layar penuh","", "fullscreenApps")}${navRow("Screensaver",state.screensaver?"Aktif":"Nonaktif","screensaverSettings")}${navRow("Izinkan buram level jendela",state.windowBlur?"Aktif":"Nonaktif","blurSettings")}${navRow("Vehicle Motion Cues",state.vehicleMotionCues?"Aktif":"Nonaktif","vehicleMotionCues")}${navRow("Kecepatan refresh per aplikasi","", "refreshRateApps")}${navRow("Increase Touch Responsiveness",state.touchBoost?"Aktif":"Nonaktif","touchResponsiveness")}${navRow("Anti kerlip",state.antiFlicker?"Aktif":"Nonaktif","antiFlicker")}${navRow("High brightness mode",state.highBrightness?"Aktif":"Nonaktif","highBrightness")}${navRow("Display Saturation",`${state.displaySaturation}%`,"displaySaturation")}</div>
    </div>`;
  }

  function renderAdaptiveBrightness() { root.innerHTML=`<div class="a17-page system-page">${topbar("Kecerahan adaptif")}<div class="brightness-preview">☀</div><div class="a17-card system-card">${switchRow("Gunakan kecerahan adaptif","One shot auto-brightness", "adaptiveBrightness")}</div></div>`; }
  function renderHdrBrightness() { root.innerHTML=`<div class="a17-page system-page">${topbar("Kecerahan HDR yang ditingkatkan")}<div class="hdr-preview"><span>Gambar standar</span><span>Gambar HDR</span></div><div class="a17-card system-card">${switchRow("Gunakan kecerahan HDR yang ditingkatkan","", "hdrBrightness")}${rangeRow("Intensitas","", "displaySaturation",50,120,"")}</div></div>`; }
  function renderExtraDim() { root.innerHTML=`<div class="a17-page system-page">${topbar("Ekstra redup")}<div class="extra-dim-preview">▥</div><div class="a17-card system-card">${switchRow("Buat layar ekstra redup","Membaca dengan lebih nyaman", "extraDim")}${rangeRow("Intensitas","", "brightness",35,100,"")}</div></div>`; }

  function renderLockScreenDisplay() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Layar kunci")}${sectionLabel("Yang ditampilkan")}<div class="a17-card system-card">${navRow("Notifikasi di layar kunci","", "notifications")}${switchRow("Widget di layar kunci","", "deviceControls")}${switchRow("Tambahkan pengguna dari layar kunci","", "contactHistoryAccess")}${plainRow("Tambahkan teks di layar kunci",state.lockText||"Tidak ada")}${switchRow("Gunakan kontrol perangkat","Tanpa membuka kunci ponsel", "deviceControls")}${plainRow("Pintasan",`${shortcutName(state.leftShortcut)}, ${shortcutName(state.rightShortcut)}`,`<span class="a17-chevron">›</span>`)}${switchRow("Jam dinamis","Ukuran jam berubah menurut konten layar kunci", "dynamicClock")}${plainRow("Now Playing","Identifikasi lagu yang diputar di sekitar",`<span class="a17-chevron">›</span>`)}</div>${sectionLabel("Waktu kemunculan")}<div class="a17-card system-card">${switchRow("Penampil musik","Tampilkan Tampilan Ambien saat trek musik baru diputar", "musicArtwork")}${switchRow("Angkat untuk memeriksa ponsel","Aktif", "liftToCheck")}${switchRow("Aktifkan layar untuk notifikasi","", "wakeForNotifications")}</div></div>`;
  }

  function renderAlwaysOnSettings() { root.innerHTML=`<div class="a17-page system-page">${topbar("Layar always-on")}<div class="always-on-preview">05:14</div><div class="a17-card system-card">${switchRow("Layar always-on","Menampilkan waktu, tanggal, dan lainnya saat layar nonaktif", "alwaysOn")}${switchRow("Wallpaper ambient","Tampilkan wallpaper saat always-on", "musicArtwork", !state.alwaysOn)}</div></div>`; }

  function renderScreenTimeoutSettings() {
    const opts=["15 detik","30 detik","1 menit","2 menit","5 menit","10 menit","30 menit"];
    root.innerHTML=`<div class="a17-page system-page">${topbar("Layar mati")}<div class="a17-card system-card">${opts.map(o=>choiceRow(o,"","screenTimeout",o)).join("")}${switchRow("Fokus ke layar","Cegah layar mati jika Anda sedang melihatnya", "liftToCheck")}</div></div>`;
  }

  function renderDarkThemeSettings() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Tema gelap")}<p class="system-description">Gunakan latar belakang gelap untuk membuat layar lebih nyaman dilihat.</p><div class="dark-theme-hero">${switchRow("Gunakan tema gelap","", "dark")}</div><div class="a17-card system-card">${choiceRow("Standar","Mengaktifkan tema gelap untuk perangkat dan aplikasi","darkSchedule","Tidak ada")}${choiceRow("Diperluas","Optimasi tambahan untuk tampilan gelap","darkSchedule","Diperluas")}</div></div>`;
  }

  function renderDisplaySizeText() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Ukuran tampilan & teks")}<div class="display-size-preview">Preview layar utama</div><div class="a17-card system-card">${rangeRow("Ukuran font","Perbesar atau perkecil teks", "fontScale",80,130,"%")}${rangeRow("Ukuran tampilan","Perbesar atau perkecil semuanya", "displayScale",80,130,"%")}${switchRow("Teks tebal","", "highBrightness")}${switchRow("Teks bergaris tepi","Tambahkan latar belakang hitam atau putih", "antiFlicker")}</div><button class="system-add-button" data-action="resetDisplaySize">Reset setelan</button></div>`;
  }

  function renderLiveDisplay() { root.innerHTML=`<div class="a17-page system-page">${topbar("LiveDisplay")}<div class="landscape-preview"></div><div class="a17-card system-card">${switchRow("Modus membaca","Analisis semua suhu gambar menjadi panjang", "extraDim")}${plainRow("Kalibrasi warna","Kalibrasi warna layar")}</div></div>`; }
  function renderNightLightSettings() { root.innerHTML=`<div class="a17-page system-page">${topbar("Cahaya Malam")}<p class="system-description">Cahaya Malam memberi warna kuning pada layar untuk membantu tidur.</p><div class="a17-card system-card">${switchRow("Gunakan Cahaya Malam","", "nightLight")}${plainRow("Jadwal","Tidak ada")}${rangeRow("Intensitas","", "displaySaturation",0,100,"")}</div></div>`; }
  function renderDisplayColorSettings() { const opts=["Vivid","Saturated","Standard","P3","sRGB"]; root.innerHTML=`<div class="a17-page system-page">${topbar("Warna")}<div class="landscape-preview warm"></div><div class="a17-card system-card">${opts.map(o=>choiceRow(o,"","colorMode",o)).join("")}</div></div>`; }
  function renderRotationSettings() { root.innerHTML=`<div class="a17-page system-page">${topbar("Setelan rotasi")}<div class="a17-card system-card">${switchRow("Rotasi otomatis","", "autoRotate")}${plainRow("0 derajat","✓")}${plainRow("90 derajat","✓")}${plainRow("180 derajat","")}${plainRow("270 derajat","✓")}</div></div>`; }
  function renderRefreshRateSettings() { root.innerHTML=`<div class="a17-page system-page">${topbar("Kecepatan refresh layar")}<div class="refresh-preview"><span></span><span></span></div><div class="a17-card system-card">${choiceRow("60 Hz","Hemat daya","refreshRate",60)}${choiceRow("120 Hz","Lebih mulus","refreshRate",120)}${switchRow("Kecepatan refresh ekstrem","Aktifkan kecepatan refresh tertinggi untuk semua aplikasi", "highBrightness")}</div></div>`; }
  function renderCutoutSettings() { const opts=["Default perangkat","Render aplikasi di bawah area potongan","Potongan sudut","Potongan ganda","Potongan Lubang Kertas","Sembunyikan","notchbarkiller","Potongan tinggi","Potongan waterfall","Potongan lebar"]; root.innerHTML=`<div class="a17-page system-page">${topbar("Potongan layar")}<div class="a17-card system-card">${opts.map(o=>choiceRow(o,"","screenCutout",o)).join("")}</div></div>`; }
  function renderFullscreenApps() { const apps=["BCR","BRImo","Canva","CapCut","Chrome","DANA","DIGI bank bjb","Dolby Atmos","Drive","Facebook"]; const map=state.fullscreenAppStates||{}; root.innerHTML=`<div class="a17-page system-page">${topbar("Aplikasi layar penuh")}<div class="settings-search">⌕ Search apps</div><div class="a17-card system-card">${apps.map(a=>`<button class="a17-row" type="button" data-map-toggle="fullscreenAppStates" data-map-key="${a}"><span class="a17-copy"><strong>${a}</strong></span><span class="a17-switch ${map[a]?"on":""}"></span></button>`).join("")}</div></div>`; }
  function renderScreensaverSettings() { root.innerHTML=`<div class="a17-page system-page">${topbar("Screensaver")}<div class="screensaver-hero">Screensaver</div><div class="a17-card system-card">${switchRow("Gunakan screensaver","", "screensaver")}${plainRow("Waktu kemunculan","Saat mengisi daya")}${plainRow("Pilih screensaver","Jam")}</div></div>`; }
  function renderBlurSettings() { root.innerHTML=`<div class="a17-page system-page">${topbar("Izinkan buram level jendela")}<div class="blur-preview">Blur</div><div class="a17-card system-card">${switchRow("Izinkan buram level jendela","", "windowBlur")}${rangeRow("Blur Strength","", "blurStrength",0,100,"%")}</div></div>`; }
  function renderVehicleMotionCues() { root.innerHTML=`<div class="a17-page system-page">${topbar("Vehicle Motion Cues")}<div class="motion-cues-preview">••••<br>••••</div><div class="a17-card system-card">${switchRow("Vehicle Motion Cues","Show animated dots on screen edges that move with vehicle motion", "vehicleMotionCues")}</div></div>`; }
  function renderRefreshRateApps() { const apps=["BCR","BRImo","Canva","CapCut","Chrome","DANA","DIGI bank bjb","Dolby Atmos"]; root.innerHTML=`<div class="a17-page system-page">${topbar("Kecepatan refresh per aplikasi")}<div class="a17-card system-card">${apps.map(a=>plainRow(a,`${state.refreshRate}Hz`, `<span class="a17-chevron">⌄</span>`)).join("")}</div></div>`; }
  function renderTouchResponsiveness() { root.innerHTML=`<div class="a17-page system-page">${topbar("Increase Touch Responsiveness")}<div class="a17-card system-card">${switchRow("Increase Touch Responsiveness","Increases touch polling rate to decrease latency", "touchBoost")}</div></div>`; }
  function renderAntiFlicker() { root.innerHTML=`<div class="a17-page system-page">${topbar("Anti kerlip")}<p class="system-description">Mode anti kerlip membantu mengurangi kelelahan mata dalam kondisi cahaya rendah.</p><div class="a17-card system-card">${switchRow("Anti kerlip","", "antiFlicker")}</div></div>`; }
  function renderHighBrightness() { root.innerHTML=`<div class="a17-page system-page">${topbar("High brightness mode")}<div class="a17-card system-card">${switchRow("HBM","Static peak luminance", "highBrightness")}${switchRow("Automatic HBM","Enable peak luminance based on sunlight", "adaptiveBrightness")}${rangeRow("threshold (lux)","Value: 700", "brightness",35,100,"")}</div></div>`; }
  function renderDisplaySaturation() { root.innerHTML=`<div class="a17-page system-page">${topbar("Display Saturation")}<div class="landscape-preview sunset"></div><div class="a17-card system-card">${rangeRow("Value","100 by default", "displaySaturation",50,130,"%")}</div></div>`; }

  function renderSoundSettings() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Suara & getaran")}<div class="sound-volume-card">${rangeRow("Volume media","", "volume",0,100,"%")}${rangeRow("Volume panggilan","", "callVolume",0,100,"%")}${rangeRow("Volume dering","", "ringVolume",0,100,"%")}${rangeRow("Volume notifikasi","", "notificationVolume",0,100,"%")}${rangeRow("Volume alarm","", "alarmVolume",0,100,"%")}${rangeRow("Volume Asisten","", "assistantVolume",0,100,"%")}</div><div class="a17-card system-card">${navRow("Getaran & haptik",state.vibrationEnabled?"Aktif":"Nonaktif","vibrationHaptics")}${navRow("Pola getaran nada dering",state.ringtonePattern,"ringtonePattern")}${navRow("Nada dering ponsel",state.ringtone,"ringtonePicker")}${plainRow("Suara notifikasi default",state.notificationSound,`<span class="a17-chevron">›</span>`)}${plainRow("Suara alarm default",state.alarmSound,`<span class="a17-chevron">›</span>`)}${switchRow("Kontrol volume per aplikasi","", "gameOverlay")}${switchRow("Fokus audio multi","", "gameKeepAwake")}${navRow("Teks Otomatis",state.liveCaption?"Aktif":"Nonaktif","liveCaption")}${navRow("Audio Spasial","Aktif / Headphone berkabel","spatialAudioSettings")}${navRow("Now Playing",state.nowPlaying?"Aktif":"Nonaktif","nowPlayingSettings")}${navRow("Media","Tampilan pemutar","mediaSettings")}</div><div class="a17-card system-card">${switchRow("Mi Sound Enhancer","", "miSoundEnhancer")}${navRow("Bersihkan Speaker",state.cleanSpeaker?"Aktif":"Nonaktif","cleanSpeaker")}${navRow("Dolby Atmos",state.dolbyAtmos?"Aktif":"Nonaktif","dolbyAtmos")}</div></div>`;
  }

  function renderVibrationHaptics() { root.innerHTML=`<div class="a17-page system-page">${topbar("Getaran & haptik")}<div class="vibration-hero">${switchRow("Gunakan getaran & haptik","", "vibrationEnabled")}</div>${sectionLabel("Panggilan telepon")}<div class="a17-card system-card">${rangeRow("Getaran dering","", "ringVibration",0,100,"%")}${switchRow("Getar lalu dering bertahap","", "vibrateWhenConnected")}</div>${sectionLabel("Notifikasi dan alarm")}<div class="a17-card system-card">${rangeRow("Getaran notifikasi","", "notificationVibration",0,100,"%")}${rangeRow("Getaran alarm","", "alarmVibration",0,100,"%")}</div>${sectionLabel("Haptik interaksi")}<div class="a17-card system-card">${rangeRow("Respons sentuhan","", "touchVibration",0,100,"%")}${rangeRow("Getaran media","", "mediaVibration",0,100,"%")}${switchRow("Getaran keyboard","", "keyboardVibration")}</div></div>`; }
  function renderRingtonePattern() { const opts=["dzzz-dzzz","dzzz-da","mm-mm-mm","do-da-dzzz","do-dzzz-da","Kustom"]; root.innerHTML=`<div class="a17-page system-page">${topbar("Pola getaran nada dering")}<div class="a17-card system-card">${opts.map(o=>choiceRow(o,"","ringtonePattern",o)).join("")}</div></div>`; }
  function renderRingtonePicker() { const tones=["Petualangan Berikutnya","Biji Jagung Meletup","Pagi yang Sejuk","Suara Saya","Suara Pixel","Suara Eksosistem","Permata","Unsur Alam","Nada Material You","Harmoni Klasik"]; root.innerHTML=`<div class="a17-page system-page">${topbar("Nada dering ponsel")}<div class="ringtone-hero">♫</div><div class="ringtone-grid">${tones.map(o=>`<button class="ringtone-card ${state.ringtone===o?"active":""}" type="button" data-state-value-key="ringtone" data-state-value="${o}"><span>♫</span><small>${o}</small></button>`).join("")}</div></div>`; }
  function renderLiveCaption() { root.innerHTML=`<div class="a17-page system-page">${topbar("Teks Otomatis")}<div class="caption-hero">▰</div><div class="a17-card system-card">${switchRow("Gunakan Teks Otomatis","Mendeteksi ucapan di perangkat dan otomatis membuat teks", "liveCaption")}${plainRow("Bahasa","Teks dalam 1 bahasa")}${plainRow("Preferensi Teks","Setel ukuran dan gaya teks")}${switchRow("Sembunyikan kata-kata tidak sopan","", "silentNotifications")}</div></div>`; }
  function renderSpatialAudio() { root.innerHTML=`<div class="a17-page system-page">${topbar("Audio Spasial")}<p class="system-description">Audio dari perangkat media yang kompatibel menjadi lebih imersif.</p><div class="a17-card system-card">${switchRow("Speaker ponsel","", "spatialAudio")}${switchRow("Headphone berkabel","", "spatialAudio")}</div></div>`; }
  function renderNowPlayingSettings() { root.innerHTML=`<div class="a17-page system-page">${topbar("Now Playing")}<div class="now-playing-hero">♫</div><div class="a17-card system-card">${switchRow("Identifikasi lagu yang diputar di sekitar","", "nowPlaying")}${navRow("Histori Now Playing","Belum ada lagu yang dikenal","nowPlayingHistory")}${navRow("Pemutar musik default",state.defaultMusicPlayer,"defaultMusicPlayer")}</div></div>`; }
  function renderNowPlayingHistory() { root.innerHTML=`<div class="a17-page system-page">${topbar("Histori Now Playing")}<div class="history-orb">↶</div><p class="empty-state-text">Belum ada lagu yang dikenal</p></div>`; }
  function renderDefaultMusicPlayer() { root.innerHTML=`<div class="a17-page system-page">${topbar("Pemutar musik default")}<div class="a17-card system-card">${choiceRow("YouTube","","defaultMusicPlayer","YouTube")}${choiceRow("Spotify","","defaultMusicPlayer","Spotify")}${choiceRow("Tidak ada","","defaultMusicPlayer","Tidak ada")}</div></div>`; }
  function renderMediaSettings() { root.innerHTML=`<div class="a17-page system-page">${topbar("Media")}<div class="a17-card system-card">${switchRow("Sematkan pemutar media","Untuk melanjutkan pemutaran dengan cepat", "mediaResumption")}${switchRow("Tampilkan media di layar kunci","", "showMediaOnLock")}</div></div>`; }
  function renderCleanSpeaker() { root.innerHTML=`<div class="a17-page system-page">${topbar("Bersihkan Speaker")}<div class="a17-card system-card">${switchRow("Bersihkan Speaker","Putar audio 30 detik untuk membersihkan speaker", "cleanSpeaker")}</div><p class="system-description">Jalankan fitur ini satu atau dua kali jika speaker terhalang debu.</p></div>`; }
  function renderDolbyAtmos() { const profiles=["Kerja","Dinamis","Film/Video","Musik","Permainan","Santai","Suasana"]; root.innerHTML=`<div class="a17-page system-page dolby-page">${topbar("Dolby Atmos")}<div class="dolby-wave">▥▥▥</div><div class="dolby-switch">${switchRow("Gunakan Dolby Atmos","", "dolbyAtmos")}</div><div class="dolby-profiles">${profiles.map(p=>`<button class="dolby-profile ${state.dolbyProfile===p?"active":""}" type="button" data-state-value-key="dolbyProfile" data-state-value="${p}">${p}</button>`).join("")}</div><div class="a17-card system-card">${navRow("Intelligent Equalizer","Equalizer cerdas","equalizer")}${navRow("Profil Audio Per Aplikasi","Tetapkan profil audio berbeda", "appAudioProfiles")}</div></div>`; }
  function renderEqualizer() { const presets=["Datar","Rock","Jazz","Pop","Klasik","Hip Hop","Blues","Elektronik","Metal","Akustik","Peningkat Bass","Penuh"]; root.innerHTML=`<div class="a17-page system-page">${topbar("Equalizer")}<div class="a17-card system-card">${plainRow("Preset",state.equalizerPreset,`<span class="a17-chevron">⌄</span>`)}</div><div class="equalizer-bars">${[42,75,55,82,60,35,68,50,77,47].map(h=>`<i style="height:${h}%"></i>`).join("")}</div><div class="preset-grid">${presets.map(p=>`<button class="choice-chip ${state.equalizerPreset===p?"active":""}" type="button" data-state-value-key="equalizerPreset" data-state-value="${p}">${p}</button>`).join("")}</div></div>`; }
  function renderAppAudioProfiles() { root.innerHTML=`<div class="a17-page system-page">${topbar("Profil Audio Per Aplikasi")}<div class="a17-card system-card">${switchRow("Ganti profil otomatis","Tetapkan profil berdasarkan aplikasi yang aktif", "gameDnd")}${plainRow("Kelola Profil Aplikasi","Chrome → Dinamis, YouTube → Film/Video",`<span class="a17-chevron">›</span>`)}</div></div>`; }

  function renderSecurityPrivacy() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Keamanan & privasi")}<div class="security-status"><span>◆</span><strong>${state.securityCheck?"Sepertinya semua aman":"Periksa keamanan"}</strong><small>Memeriksa setelan perangkat...</small></div>${sectionLabel("Keamanan")}<div class="a17-card system-card">${navRow("Buka kunci perangkat",state.screenLock,"deviceUnlock")}</div>${sectionLabel("Privasi")}<div class="a17-card system-card">${plainRow("Kontrol privasi","Izin, kontrol")}${plainRow("Dasbor privasi","Aktivitas privasi & asisten AI")}${plainRow("Ruang privasi","Kunci dan sembunyikan aplikasi pribadi")}</div>${sectionLabel("Setelan lainnya")}<div class="a17-card system-card">${plainRow("Keamanan & privasi lain","Isi otomatis, notifikasi, dan lainnya")}</div></div>`;
  }

  function renderDeviceUnlock() {
    root.innerHTML=`<div class="a17-page system-page">${topbar("Buka kunci perangkat")}<div class="unlock-hero">🔒</div><div class="a17-card system-card">${plainRow("Kunci layar",state.screenLock,`<span class="a17-chevron">›</span>`)}${switchRow("Sidik jari","Sidik jari ditambahkan", "sideKeyConfigured")}${switchRow("Wajah","Tambahkan wajah", "faceUnlock")}</div></div>`;
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
    root.innerHTML = `<div class="a17-page app-drawer-page launcher-drawer-page" id="launcherDrawer">
      <div class="launcher-drawer-wall"></div>
      <div class="launcher-drawer-sheet">
        <div class="launcher-drawer-handle" aria-hidden="true"></div>
        <label class="drawer-search launcher-search"><span class="launcher-google-g">G</span><input id="drawerSearch" type="search" placeholder="Telusuri aplikasi" autocomplete="off"><b>🎙 &nbsp; ◉</b></label>
        <div class="drawer-grid launcher-drawer-grid" id="drawerGrid" data-drawer-cols="${state.homeCols}" style="--drawer-cols:${state.homeCols}">${SIM_APPS.map(app => `<button class="drawer-app" type="button" data-open-app="${app.id}" data-drawer-search="${app.name.toLowerCase()}"><span class="drawer-app-icon tone-${app.tone}">${app.glyph}</span><small>${app.name}</small></button>`).join("")}</div>
        <div class="drawer-empty" id="drawerEmpty" hidden>Tidak ada aplikasi yang cocok.</div>
        <div class="launcher-drawer-gesture"></div>
      </div>
    </div>`;

    const drawer = $("#launcherDrawer");
    let startY = null;
    drawer?.addEventListener("pointerdown", e => {
      if (e.target.closest("button,input,label")) return;
      startY = e.clientY;
    });
    drawer?.addEventListener("pointerup", e => {
      if (startY == null) return;
      const dy = e.clientY - startY;
      startY = null;
      if (dy > 46) {
        vibrate(5);
        navigate("home");
      }
    });
    drawer?.addEventListener("pointercancel", () => { startY = null; });
  }

  function renderAppInfo() {
    const app = appById(state.appInfoId);
    const isSystem = app.category === "system";
    root.innerHTML = `<div class="a17-page system-page app-info-page">${topbar("Info aplikasi")}
      <div class="app-info-hero"><span class="drawer-app-icon tone-${app.tone}">${app.glyph}</span><h3>${app.name}</h3><small>${isSystem ? "Aplikasi sistem" : "Aplikasi terinstal"}</small></div>
      <div class="app-info-actions">${isSystem ? "" : `<button type="button" data-open-app="${app.id}">Buka</button>`}<button type="button" data-sim-action="app-force-stop">Paksa berhenti</button></div>
      <div class="a17-card system-card">${plainRow("Notifikasi", "Diizinkan", `<span class="a17-chevron">›</span>`)}${plainRow("Izin", isSystem ? "Izin sistem" : "Tidak ada izin yang digunakan", `<span class="a17-chevron">›</span>`)}${plainRow("Penyimpanan & cache", isSystem ? "36 MB digunakan" : `${20 + app.name.length * 4} MB digunakan`, `<span class="a17-chevron">›</span>`)}${plainRow("Data seluler & Wi‑Fi", "Penggunaan simulasi", `<span class="a17-chevron">›</span>`)}</div>
    </div>`;
  }

  function renderFinancialApp(app) {
    root.innerHTML = `<div class="a17-page sim-app-page finance-app tone-${app.tone}">${simAppTopbar(app)}
      <div class="finance-sim-badge">SIMULASI • bukan saldo nyata</div>
      <section class="finance-profile"><div><small>Nama akun</small><strong>Skenakun</strong></div><span>${app.glyph}</span></section>
      <section class="finance-balance"><small>Saldo tersedia</small><strong>${SIM_BALANCE}</strong><span>IDR • data demo lokal</span></section>
      <div class="finance-actions"><button data-sim-action="finance-transfer">⇄<small>Transfer</small></button><button data-sim-action="finance-pay">▣<small>Bayar</small></button><button data-sim-action="finance-topup">＋<small>Top Up</small></button><button data-sim-action="finance-history">◷<small>Riwayat</small></button></div>
      <div class="sim-card"><strong>Aktivitas simulasi</strong><p>Tidak ada transaksi nyata. Semua tombol hanya menampilkan demo antarmuka.</p></div>
    </div>`;
  }

  function simAppTopbar(app) {
    return `<div class="sim-app-top"><button type="button" data-nav="back">‹</button><span class="sim-app-mini-icon tone-${app.tone}">${app.glyph}</span><div><strong>${app.name}</strong><small>Simulasi aplikasi</small></div></div>`;
  }


  const INDONESIAN_TRACKS = [
    { title: "Hati-Hati di Jalan", artist: "Tulus", duration: 242 },
    { title: "Secukupnya", artist: "Hindia", duration: 213 },
    { title: "Sial", artist: "Mahalini", duration: 243 },
    { title: "Komang", artist: "Raim Laode", duration: 222 },
    { title: "Satu Bulan", artist: "Bernadya", duration: 201 },
    { title: "Penjaga Hati", artist: "Nadhif Basalamah", duration: 261 }
  ];

  const NEKOGRAM_CHATS = [
    { name: "Genshin Indonesia", avatar: "GI", preview: "Ada event baru malam ini ✨", unread: 12, messages: ["Ada yang sudah update?", "Sudah, map barunya bagus.", "Nanti mabar jam 8 ya."] },
    { name: "Waifu Gallery Dev", avatar: "WG", preview: "Build GitHub Pages sudah online", unread: 3, messages: ["Build terakhir sudah online.", "Aku cek simulator dulu.", "Oke, bagian aplikasi kelihatan rapi."] },
    { name: "Android 17 Lab", avatar: "A17", preview: "Dynamic Color sudah sinkron", unread: 0, messages: ["Dynamic Color sudah sinkron.", "Gesture juga sudah berfungsi."] },
    { name: "Kelas Coding", avatar: "KC", preview: "Besok bahas JavaScript", unread: 5, messages: ["Besok bahas JavaScript ya.", "Siap, jam berapa?", "Jam 10 pagi."] }
  ];

  const WA_CHATS = [
    { name: "Alya", avatar: "A", preview: "Nanti kabari kalau sudah selesai ya", time: "06.41", messages: ["Pagi", "Nanti kabari kalau sudah selesai ya", "Siap 👍"] },
    { name: "Tim Waifu Gallery", avatar: "WG", preview: "Update simulator sudah dicoba", time: "06.33", messages: ["Update simulator sudah dicoba", "Bagian aplikasi lanjut ya", "Oke, aku cek lagi."] },
    { name: "Raka", avatar: "R", preview: "Mabar nanti malam?", time: "Kemarin", messages: ["Mabar nanti malam?", "Boleh, sekitar jam 8."] },
    { name: "Toko Komputer", avatar: "TK", preview: "Pesanan sudah siap", time: "Kemarin", messages: ["Pesanan sudah siap", "Baik, terima kasih."] }
  ];

  const X_POSTS = [
    { user: "@pixel_lab", name: "Pixel Lab", text: "Menguji simulator Android 17 di browser. Dynamic Color terasa makin konsisten.", stats: "18 balasan · 74 repost · 532 suka" },
    { user: "@genshin_daily", name: "Genshin Daily", text: "Wallpaper hari ini: nuansa ungu dan biru. Cocok untuk tema Pixel.", stats: "31 balasan · 120 repost · 1,2 rb suka" },
    { user: "@webdev_id", name: "WebDev ID", text: "Tip: simpan state UI ke localStorage agar prototipe tetap konsisten setelah refresh.", stats: "9 balasan · 42 repost · 301 suka" }
  ];

  const TRANSLATE_PHRASES = {
    "halo":"hello","dunia":"world","selamat":"congratulations","pagi":"morning","siang":"afternoon","malam":"night","terima":"thank","kasih":"you",
    "apa":"what","kabar":"news","saya":"i","aku":"i","kamu":"you","anda":"you","baik":"good","sangat":"very","senang":"happy","belajar":"study",
    "bahasa":"language","indonesia":"indonesia","inggris":"english","hari":"day","ini":"this","besok":"tomorrow","kemarin":"yesterday","makan":"eat",
    "minum":"drink","rumah":"home","sekolah":"school","teman":"friend","cinta":"love","cantik":"beautiful","bagus":"good","cepat":"fast","lambat":"slow",
    "hello":"halo","world":"dunia","good":"baik","morning":"pagi","afternoon":"siang","night":"malam","thank":"terima","you":"kamu","what":"apa",
    "i":"saya","happy":"senang","study":"belajar","language":"bahasa","today":"hari ini","tomorrow":"besok","yesterday":"kemarin","eat":"makan",
    "drink":"minum","home":"rumah","school":"sekolah","friend":"teman","love":"cinta","beautiful":"cantik","fast":"cepat","slow":"lambat"
  };

  function makeSimContacts() {
    const names = ["Alya Putri","Raka Pratama","Nadia","Dimas","Salsa","Fajar","Maya","Rizky","Naufal","Citra","Dewi","Bagas","Ardi","Nisa","Kevin","Aurel"];
    return names.map((name, i) => ({
      name,
      number: `+62 8${[12,13,21,22,52,53,55,56][i % 8]}-${String(1000 + ((i * 791) % 8999)).padStart(4,"0")}-${String(1000 + ((i * 431) % 8999)).padStart(4,"0")}`,
      color: ["#5b8def","#11a37f","#8b5cf6","#ef6c63","#f5a623"][i % 5]
    }));
  }

  function fmtDuration(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;
  }

  function weatherCodeLabel(code) {
    const map = {0:["☀","Cerah"],1:["🌤","Cerah berawan"],2:["⛅","Berawan sebagian"],3:["☁","Berawan"],45:["🌫","Berkabut"],48:["🌫","Kabut beku"],51:["🌦","Gerimis"],53:["🌦","Gerimis"],55:["🌧","Gerimis lebat"],61:["🌧","Hujan ringan"],63:["🌧","Hujan"],65:["🌧","Hujan lebat"],80:["🌦","Hujan lokal"],81:["🌧","Hujan lokal"],82:["⛈","Hujan lebat"],95:["⛈","Badai petir"]};
    return map[Number(code)] || ["🌤","Cuaca berubah"];
  }

  function localTranslate(text, direction) {
    const source = String(text || "").trim();
    if (!source) return "";
    const phraseMap = {
      "halo dunia":"hello world","selamat pagi":"good morning","selamat malam":"good night","apa kabar":"how are you","terima kasih":"thank you",
      "saya baik":"i am good","aku senang":"i am happy","saya sedang belajar":"i am studying","hari ini cerah":"today is sunny",
      "kucing":"cat","anjing":"dog","rumah":"house","sekolah":"school","teman":"friend","makanan":"food","minuman":"drink","mobil":"car","buku":"book",
      "hello world":"halo dunia","good morning":"selamat pagi","good night":"selamat malam","how are you":"apa kabar","thank you":"terima kasih",
      "i am good":"saya baik","i am happy":"saya senang","i am studying":"saya sedang belajar","today is sunny":"hari ini cerah",
      "cat":"kucing","dog":"anjing","house":"rumah","school":"sekolah","friend":"teman","food":"makanan","drink":"minuman","car":"mobil","book":"buku"
    };
    const low = source.toLowerCase();
    if (phraseMap[low]) return phraseMap[low];
    const words = source.split(/(\s+|[,.!?;:]+)/);
    return words.map(part => {
      const key = part.toLowerCase();
      const hit = TRANSLATE_PHRASES[key] || phraseMap[key];
      if (!hit) return part;
      return part[0] === part[0]?.toUpperCase() ? hit.charAt(0).toUpperCase()+hit.slice(1) : hit;
    }).join("");
  }

  const realtimeTranslateCache = new Map();
  let realtimeTranslateTimer = 0;
  let realtimeTranslateAbort = null;
  let realtimeTranslateRequest = 0;

  function translateLangPair(direction = state.translateDirection) {
    return direction === "en-id"
      ? { source: "en", target: "id", sourceLabel: "English", targetLabel: "Indonesia", speech: "id-ID" }
      : { source: "id", target: "en", sourceLabel: "Indonesia", targetLabel: "English", speech: "en-US" };
  }

  function splitTranslateText(text, maxBytes = 460) {
    const input = String(text || "").trim();
    if (!input) return [];
    const encoder = new TextEncoder();
    const paragraphs = input.split(/(\n+)/);
    const chunks = [];
    let current = "";
    const pushCurrent = () => {
      if (current.trim()) chunks.push(current.trim());
      current = "";
    };
    for (const part of paragraphs) {
      if (!part) continue;
      if (/^\n+$/.test(part)) {
        if (current && encoder.encode(current + part).length <= maxBytes) current += part;
        else { pushCurrent(); chunks.push(part); }
        continue;
      }
      const sentences = part.match(/[^.!?。！？]+[.!?。！？]*\s*|\S+/g) || [part];
      for (const sentence of sentences) {
        const candidate = current + sentence;
        if (encoder.encode(candidate).length <= maxBytes) { current = candidate; continue; }
        pushCurrent();
        if (encoder.encode(sentence).length <= maxBytes) { current = sentence; continue; }
        let piece = "";
        for (const char of sentence) {
          if (encoder.encode(piece + char).length > maxBytes) {
            if (piece) chunks.push(piece);
            piece = char;
          } else piece += char;
        }
        current = piece;
      }
    }
    pushCurrent();
    return chunks;
  }

  async function translateSegmentOnline(segment, pair, signal) {
    if (/^\n+$/.test(segment)) return segment;
    const key = `${pair.source}|${pair.target}|${segment}`;
    if (realtimeTranslateCache.has(key)) return realtimeTranslateCache.get(key);
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", segment);
    url.searchParams.set("langpair", `${pair.source}|${pair.target}`);
    url.searchParams.set("mt", "1");
    const response = await fetch(url.toString(), {
      method: "GET",
      mode: "cors",
      cache: "no-store",
      signal,
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const translated = String(data?.responseData?.translatedText || "").trim();
    if (!translated) throw new Error("EMPTY_TRANSLATION");
    realtimeTranslateCache.set(key, translated);
    if (realtimeTranslateCache.size > 120) {
      const first = realtimeTranslateCache.keys().next().value;
      realtimeTranslateCache.delete(first);
    }
    return translated;
  }

  function setTranslateUi({ text, status = "", busy = false, offline = false } = {}) {
    const result = $("#translateResult", root);
    const statusEl = $("#translateStatus", root);
    const loader = $("#translateLoader", root);
    if (typeof text === "string" && result) result.textContent = text;
    if (statusEl) {
      statusEl.textContent = status;
      statusEl.classList.toggle("error", offline);
    }
    if (loader) loader.hidden = !busy;
  }

  async function runRealtimeTranslation({ immediate = false } = {}) {
    window.clearTimeout(realtimeTranslateTimer);
    const input = $("#translateInput", root);
    if (!input) return;
    const sourceText = input.value.trim();
    state.translateText = input.value;
    if (!sourceText) {
      if (realtimeTranslateAbort) realtimeTranslateAbort.abort();
      state.translateResult = "";
      save();
      setTranslateUi({ text: "", status: "Ketik teks untuk menerjemahkan otomatis." });
      return;
    }
    if (!immediate) {
      setTranslateUi({ status: "Menunggu teks…" });
      realtimeTranslateTimer = window.setTimeout(() => runRealtimeTranslation({ immediate: true }), 420);
      return;
    }
    const requestId = ++realtimeTranslateRequest;
    if (realtimeTranslateAbort) realtimeTranslateAbort.abort();
    realtimeTranslateAbort = new AbortController();
    const pair = translateLangPair();
    setTranslateUi({ status: "Menerjemahkan…", busy: true });
    try {
      const chunks = splitTranslateText(sourceText);
      const output = [];
      for (const chunk of chunks) {
        if (requestId !== realtimeTranslateRequest) return;
        output.push(await translateSegmentOnline(chunk, pair, realtimeTranslateAbort.signal));
      }
      if (requestId !== realtimeTranslateRequest) return;
      const translated = output.join("").trim();
      state.translateResult = translated;
      save();
      setTranslateUi({ text: translated, status: "Diterjemahkan secara realtime", busy: false });
    } catch (error) {
      if (error?.name === "AbortError") return;
      const fallback = localTranslate(sourceText, state.translateDirection);
      state.translateResult = fallback;
      save();
      const changed = fallback && fallback.toLowerCase() !== sourceText.toLowerCase();
      setTranslateUi({
        text: fallback,
        status: changed ? "Mode offline. Hasil memakai kamus simulator." : "Terjemahan online tidak tersedia. Periksa koneksi internet.",
        busy: false,
        offline: true
      });
    }
  }

  function bcrSwitch(key) {
    return `<button class="bcr-switch ${state[key] ? "on" : ""}" type="button" data-toggle="${key}"><span>${state[key] ? "✓" : "×"}</span></button>`;
  }

  function renderBcrApp(app) {
    const settingRow = (title, desc, right = "", extra = "") => `<div class="bcr-row"><div><strong>${title}</strong>${desc ? `<p>${desc}</p>` : ""}${extra}</div>${right}</div>`;
    return `<div class="a17-page bcr-app-page">${simAppTopbar(app)}<div class="bcr-title">Basic Call Recorder</div><div class="bcr-section-title">General</div><div class="bcr-card">
      ${settingRow("Call recording","Record incoming and outgoing phone calls. Microphone and notification permissions are required for recording in the background.", bcrSwitch("bcrCallRecording"))}
      ${settingRow("Auto-record rules","Configure which calls should be automatically recorded.", `<button class="bcr-value" data-sim-action="bcr-cycle-rules">${state.bcrAutoRules}</button>`)}
      ${settingRow("Output directory","Pick a directory to store recordings. Long press to open in file manager.", "", `<p class="bcr-path">/storage/emulated/0/Android/data/com.chiller3.bcr/files, Keep all</p>`)}
      ${settingRow("Output format","Select an encoding format for the recordings.", `<button class="bcr-value" data-sim-action="bcr-cycle-format">›</button>`, `<p>${state.bcrOutputFormat}</p>`)}
      ${settingRow("Minimum recording duration","Keep recordings of any length.", `<button class="bcr-value" data-sim-action="bcr-cycle-min">›</button>`)}
      ${settingRow("Write metadata file","Create a JSON file containing details about the call next to the audio file.", bcrSwitch("bcrWriteMetadata"))}
      ${settingRow("Record telecom-integrated calls","Record calls from third-party apps that use the Android telecom framework. Recordings may contain incomplete or unusable audio.", bcrSwitch("bcrTelecomCalls"))}
      ${settingRow("Record calls before connection","For outgoing calls, start recording as soon as dialing begins instead of waiting until the call connects.", bcrSwitch("bcrBeforeConnect"))}
      ${settingRow("Open directory from notification","Open the output directory instead of the recording file when tapping the recording completed notification.", bcrSwitch("bcrOpenDirectory"))}
      ${settingRow("Show launcher icon","When the launcher icon is hidden, dial *#*#BCR#*#* to open the app.", bcrSwitch("bcrShowLauncher"))}
    </div><div class="bcr-section-title">About</div><div class="bcr-card">${settingRow("Version","3.5 (release)")}</div><p class="sim-disclaimer">Simulasi saja. Browser tidak merekam panggilan telepon asli.</p></div>`;
  }

  function renderCanvaApp(app) {
    const img = wallpaperById(state.canvaImage).src;
    return `<div class="a17-page canva-app">${simAppTopbar(app)}<div class="canva-head"><b>Desain baru</b><button data-sim-action="canva-save">Bagikan</button></div><div class="canva-stage"><div class="canva-canvas" style="background-image:url('${img}')"><span id="canvaOverlayText">${escapeHtml(state.canvaText)}</span></div></div><div class="canva-editor"><label>Teks<input id="canvaTextInput" value="${escapeHtml(state.canvaText)}" maxlength="40"></label><div class="canva-thumbs">${[3,12,20,31].map(n=>`<button data-sim-action="canva-image-${n}" style="background-image:url('./assets/waifu-${String(n).padStart(2,"0")}.jpg')"></button>`).join("")}</div><div class="canva-tools"><button data-sim-action="canva-apply-text">Teks</button><button data-sim-action="canva-filter">Filter</button><button data-sim-action="canva-save">Simpan</button></div></div></div>`;
  }

  function renderCapcutApp(app) {
    const img = wallpaperById(state.canvaImage).src;
    return `<div class="a17-page capcut-app">${simAppTopbar(app)}<div class="capcut-header"><b>Proyek baru</b><button data-sim-action="capcut-export">Ekspor</button></div><div class="capcut-preview" style="background-image:url('${img}')"><button class="capcut-play" data-sim-action="capcut-play">${state.capcutPlaying ? "Ⅱ" : "▶"}</button></div><div class="capcut-time"><span>${Math.round(state.capcutPosition)}%</span><input type="range" min="0" max="100" value="${state.capcutPosition}" data-setting-range="capcutPosition"><span>00:15</span></div><div class="capcut-timeline">${[31,20,7,12,25,3].map((n,i)=>`<i style="background-image:url('./assets/waifu-${String(n).padStart(2,"0")}.jpg')"></i>`).join("")}</div><div class="capcut-tools"><button data-sim-action="capcut-tool">Edit</button><button data-sim-action="capcut-tool">Audio</button><button data-sim-action="capcut-tool">Teks</button><button data-sim-action="capcut-tool">Efek</button><button data-sim-action="capcut-tool">Filter</button></div><p class="sim-disclaimer">Editor video simulasi. Tidak mengekspor video sungguhan.</p></div>`;
  }

  function renderWeatherApp(app) {
    return `<div class="a17-page weather-live-app">${simAppTopbar(app)}<div class="weather-hero-live" id="weatherHero"><span id="weatherIcon">⌖</span><strong id="weatherTemp">--°</strong><small id="weatherLabel">Izinkan lokasi untuk memuat cuaca</small></div><button class="weather-location-btn" data-sim-action="weather-location">⌖ Gunakan lokasi browser</button><div class="weather-live-grid"><div><small>Terasa seperti</small><b id="weatherFeels">--°</b></div><div><small>Kelembapan</small><b id="weatherHumidity">--%</b></div><div><small>Angin</small><b id="weatherWind">-- km/j</b></div></div><div class="sim-card"><strong>Prakiraan hari ini</strong><p id="weatherForecast">Data akan diambil setelah izin lokasi diberikan.</p><small id="weatherCoords"></small></div></div>`;
  }

  function renderTranslateApp(app) {
    const pair = translateLangPair();
    const sourceValue = escapeHtml(state.translateText || "");
    const resultValue = escapeHtml(state.translateResult || "");
    return `<div class="a17-page translate-app">${simAppTopbar(app)}
      <div class="translate-langbar">
        <button data-sim-action="translate-swap">${pair.sourceLabel}</button>
        <button class="translate-swap-button" data-sim-action="translate-swap" aria-label="Tukar bahasa">⇄</button>
        <button data-sim-action="translate-swap">${pair.targetLabel}</button>
      </div>
      <div class="translate-panel source">
        <textarea id="translateInput" maxlength="2000" spellcheck="true" autocomplete="off" placeholder="Masukkan teks">${sourceValue}</textarea>
        <button data-sim-action="translate-clear" aria-label="Hapus teks">×</button>
        <small class="translate-count" id="translateCharCount">${String(state.translateText || "").length}/2000</small>
      </div>
      <div class="translate-panel result" aria-live="polite">
        <span id="translateResult">${resultValue}</span>
        <div class="translate-result-actions">
          <button data-sim-action="translate-copy">Salin</button>
          <button data-sim-action="translate-speak">Dengar</button>
          <i id="translateLoader" class="translate-loader" hidden aria-hidden="true"></i>
        </div>
        <small id="translateStatus" class="translate-status">${resultValue ? "Siap" : "Ketik teks untuk menerjemahkan otomatis."}</small>
      </div>
      <button class="sim-primary translate-go" data-sim-action="translate">Terjemahkan sekarang</button>
      <p class="sim-disclaimer">Terjemahan realtime menggunakan layanan terjemahan online. Teks yang diketik dikirim ke layanan tersebut. Jika koneksi gagal, simulator memakai kamus offline terbatas.</p>
    </div>`;
  }

  function renderKeepApp(app) {
    const notes = Array.isArray(state.keepNotes) ? state.keepNotes : [];
    return `<div class="a17-page keep-app">${simAppTopbar(app)}<div class="keep-search">☰ <span>Telusuri catatan</span> ⟳</div><div class="keep-notes">${notes.length ? notes.map((n,i)=>`<article><b>${escapeHtml(n.title || "Catatan")}</b><p>${escapeHtml(n.body)}</p><small>${escapeHtml(n.time)}</small><button data-sim-action="keep-delete-${i}">×</button></article>`).join("") : `<div class="keep-empty">💡<b>Belum ada catatan</b><span>Tekan + untuk membuat catatan.</span></div>`}</div><div class="keep-compose"><input id="keepTitle" placeholder="Judul"><textarea id="keepBody" placeholder="Tulis catatan..."></textarea><button data-sim-action="keep-add">＋ Simpan catatan</button></div></div>`;
  }

  function renderContactsApp(app) {
    const contacts = state.simContacts || [];
    if (state.activeContact >= 0 && state.activeContact < contacts.length && state.contactDetailOpen) {
      const c = contacts[state.activeContact];
      return `<div class="a17-page contacts-app">${simAppTopbar(app)}<button class="contact-back" data-sim-action="contacts-list">‹ Kontak</button><div class="contact-detail"><span style="background:${c.color}">${c.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</span><h2>${c.name}</h2><p>${c.number}</p><div><button data-sim-action="contact-call">☎<small>Telepon</small></button><button data-sim-action="contact-message">✉<small>Pesan</small></button></div></div><p class="sim-disclaimer">Kontak dan nomor dibuat acak khusus simulator.</p></div>`;
    }
    return `<div class="a17-page contacts-app">${simAppTopbar(app)}<label class="contacts-search">⌕ <input id="contactSearch" placeholder="Cari kontak"></label><div class="contact-list">${contacts.map((c,i)=>`<button data-sim-action="contact-open-${i}" data-contact-search="${c.name.toLowerCase()}"><span style="background:${c.color}">${c.name[0]}</span><div><b>${c.name}</b><small>${c.number}</small></div></button>`).join("")}</div><p class="sim-disclaimer">Semua kontak adalah data acak simulasi.</p></div>`;
  }

  function renderNekogramApp(app) {
    const idx = Number(state.nekogramThread);
    if (idx >= 0 && NEKOGRAM_CHATS[idx]) {
      const chat = NEKOGRAM_CHATS[idx];
      const extra = (state.nekogramExtra?.[idx] || []);
      return `<div class="a17-page telegram-app">${simAppTopbar(app)}<div class="tg-chat-head"><button data-sim-action="nekogram-list">‹</button><span>${chat.avatar}</span><div><b>${chat.name}</b><small>online</small></div></div><div class="tg-messages">${[...chat.messages,...extra].map((m,i)=>`<p class="${i%2?"out":"in"}">${escapeHtml(m)}<small>${i%2?"06.48 ✓✓":"06.47"}</small></p>`).join("")}</div><label class="tg-compose"><input id="nekogramMessage" placeholder="Pesan"><button data-sim-action="nekogram-send">➤</button></label></div>`;
    }
    return `<div class="a17-page telegram-app">${simAppTopbar(app)}<div class="tg-brand">Nekogram <button>⌕</button></div><div class="tg-list">${NEKOGRAM_CHATS.map((c,i)=>`<button data-sim-action="nekogram-chat-${i}"><span>${c.avatar}</span><div><b>${c.name}</b><small>${c.preview}</small></div><i>${c.unread||""}</i></button>`).join("")}</div></div>`;
  }

  function renderRecorderApp(app) {
    const items = Array.isArray(state.recorderItems) ? state.recorderItems : [];
    return `<div class="a17-page recorder-app">${simAppTopbar(app)}<div class="recorder-head"><h2>Perekam</h2><button>⌕</button></div><div class="recorder-wave ${state.recorderActive?"active":""}" id="recorderWave">${Array.from({length:34},(_,i)=>`<i style="--h:${18+(i*17)%70}%"></i>`).join("")}</div><div class="recorder-clock" id="recorderClock">${state.recorderActive?"00:00":"Siap merekam"}</div><button class="recorder-main ${state.recorderActive?"stop":""}" data-sim-action="recorder-toggle">${state.recorderActive?"■":"●"}</button><div class="recorder-tabs"><b>Rekaman</b><span>Transkrip</span></div><div class="recorder-list">${items.length?items.map((r,i)=>`<button data-sim-action="recorder-play-${i}"><span>▶</span><div><b>${r.name}</b><small>${r.duration} • ${r.time}</small></div></button>`).join(""):`<p>Belum ada rekaman simulasi.</p>`}</div><p class="sim-disclaimer">Tidak mengakses mikrofon. Gelombang dan audio hanya simulasi.</p></div>`;
  }

  function renderPinterestApp(app) {
    const pin = Number(state.pinterestPin);
    if (pin >= 0) {
      const n = (pin % 34) + 1;
      return `<div class="a17-page pinterest-app">${simAppTopbar(app)}<button class="pin-back" data-sim-action="pinterest-list">‹</button><img class="pin-detail" src="./assets/waifu-${String(n).padStart(2,"0")}.jpg" alt="Wallpaper waifu"><h3>Wallpaper Waifu ${String(n).padStart(2,"0")}</h3><button class="pin-save" data-sim-action="pinterest-save">Simpan</button><p class="sim-disclaimer">Gambar berasal dari koleksi lokal Waifu Gallery.</p></div>`;
    }
    const pins = [31,20,7,12,25,3,33,11,23,30,5,18,27,9,15,1];
    return `<div class="a17-page pinterest-app">${simAppTopbar(app)}<div class="pin-search">⌕ Cari inspirasi</div><div class="pin-masonry">${pins.map((n,i)=>`<button data-sim-action="pinterest-open-${i}"><img src="./assets/waifu-${String(n).padStart(2,"0")}.jpg" alt="Waifu ${n}"><span>Wallpaper ${n}</span></button>`).join("")}</div></div>`;
  }

  function renderSandboxApp(app) {
    const tab = state.sandboxTab || "apps";
    const visibleApps = state.sandboxShowSystem ? ALL_APPS : SIM_APPS;
    let main = "";
    if (tab === "apps") {
      main = `<div class="sandbox-app-title"><h1>Sandbox</h1><div><button>⌕</button><button data-sim-action="sandbox-tab-notifications">♧</button><button>⚙</button></div></div><div class="sandbox-list-head"><b>▦ &nbsp; All Apps <small>(${visibleApps.length})</small></b><button data-sim-action="sandbox-system">${state.sandboxShowSystem?"Hide":"Show"} System Apps</button></div><div class="sandbox-grid">${visibleApps.map(a=>`<button data-open-app="${a.id}"><span class="drawer-app-icon tone-${a.tone}">${a.glyph}</span><small>${a.name}</small></button>`).join("")}</div>`;
    } else if (!state.sandboxUnlocked) {
      main = `<div class="sandbox-app-title"><h1>Sandbox</h1><div><button>⌕</button><button>♧</button><button>⚙</button></div></div><div class="sandbox-locked"><span>▣</span><h2>${tab==="vault"?"Vault Locked":"Notifications Locked"}</h2><p>Unlock the private area to ${tab==="vault"?"access your secure vault":"view notifications"}</p><button data-sim-action="sandbox-unlock">▣ &nbsp; Unlock</button></div>`;
    } else if (tab === "notifications") {
      main = `<div class="sandbox-app-title"><h1>Notifications</h1></div><div class="sandbox-notifs">${["Nekogram: 3 pesan baru","Spotify: Hati-Hati di Jalan","Waifu Gallery: simulator diperbarui"].map(x=>`<div>${x}<small>simulasi</small></div>`).join("")}</div>`;
    } else {
      main = `<div class="sandbox-app-title"><h1>Vault</h1></div><div class="sandbox-vault"><span>▣</span><h2>Private Vault</h2><p>Area lokal simulator. Tidak menyembunyikan file perangkat asli.</p><button data-sim-action="sandbox-lock">Kunci kembali</button></div>`;
    }
    return `<div class="a17-page sandbox-app">${simAppTopbar(app)}${main}<nav class="sandbox-nav"><button class="${tab==="apps"?"active":""}" data-sim-action="sandbox-tab-apps">▦<small>Apps</small></button><button class="${tab==="notifications"?"active":""}" data-sim-action="sandbox-tab-notifications">♧<small>Notifications</small></button><button class="${tab==="vault"?"active":""}" data-sim-action="sandbox-tab-vault">▤<small>Vault</small></button></nav></div>`;
  }

  function renderSpotifyApp(app) {
    const idx = Math.max(0, Math.min(INDONESIAN_TRACKS.length-1, Number(state.spotifyTrack)||0));
    const track = INDONESIAN_TRACKS[idx];
    const progress = Math.min(track.duration, Number(state.spotifyProgress)||0);
    return `<div class="a17-page spotify-app">${simAppTopbar(app)}<div class="spotify-top"><h2>Selamat pagi</h2><button>⚙</button></div><div class="spotify-section"><h3>Lagu Indonesia pilihan</h3><div class="spotify-list">${INDONESIAN_TRACKS.map((x,i)=>`<button class="${i===idx?"active":""}" data-sim-action="spotify-track-${i}"><span>${i+1}</span><div><b>${x.title}</b><small>${x.artist}</small></div><i>⋮</i></button>`).join("")}</div></div><div class="spotify-player"><div><b id="spotifyTitle">${track.title}</b><small>${track.artist} • audio simulasi</small></div><button data-sim-action="spotify-prev">◀</button><button class="play" data-sim-action="spotify-toggle">${state.spotifyPlaying?"Ⅱ":"▶"}</button><button data-sim-action="spotify-next">▶</button><input id="spotifyProgress" type="range" min="0" max="${track.duration}" value="${progress}" disabled><span id="spotifyTime">${fmtDuration(progress)} / ${fmtDuration(track.duration)}</span></div></div>`;
  }

  function renderTikTokApp(app) {
    const imgs = [31,20,7,12,25,3,33,11,23,30];
    const idx = ((Number(state.tiktokIndex)||0)%imgs.length+imgs.length)%imgs.length;
    const n = imgs[idx];
    return `<div class="a17-page tiktok-app">${simAppTopbar(app)}<div class="tiktok-tabs"><b>Mengikuti</b><b>Untuk Anda</b></div><div class="tiktok-video" style="background-image:url('./assets/waifu-${String(n).padStart(2,"0")}.jpg')"><div class="tiktok-copy"><b>@genshin_gallery</b><p>Wallpaper Genshin-style random dari Waifu Gallery ✨ #GenshinImpact #Wallpaper</p><small>♫ Original sound • simulasi</small></div><div class="tiktok-actions"><button data-sim-action="like">♡<small>${1200+idx*147}</small></button><button data-sim-action="comment">◯<small>${40+idx*3}</small></button><button data-sim-action="share">↗</button></div></div><div class="tiktok-nav"><button data-sim-action="tiktok-prev">‹</button><span>${idx+1}/${imgs.length}</span><button data-sim-action="tiktok-next">›</button></div></div>`;
  }

  function renderWhatsAppApp(app) {
    const idx = Number(state.waThread);
    if (idx >= 0 && WA_CHATS[idx]) {
      const chat = WA_CHATS[idx];
      const extra = state.waExtra?.[idx] || [];
      return `<div class="a17-page whatsapp-app">${simAppTopbar(app)}<div class="wa-chat-head"><button data-sim-action="wa-list">‹</button><span>${chat.avatar}</span><div><b>${chat.name}</b><small>online</small></div><button>☎</button></div><div class="wa-wall">${[...chat.messages,...extra].map((m,i)=>`<p class="${i%2?"out":"in"}">${escapeHtml(m)}<small>${i%2?"06.52 ✓✓":"06.51"}</small></p>`).join("")}</div><label class="wa-compose"><span>☺</span><input id="waMessage" placeholder="Pesan"><button data-sim-action="wa-send">➤</button></label></div>`;
    }
    return `<div class="a17-page whatsapp-app">${simAppTopbar(app)}<div class="wa-brand"><h2>WhatsApp Business</h2><div>⌕ ⋮</div></div><div class="wa-tabs"><b>Chat</b><span>Pembaruan</span><span>Panggilan</span></div><div class="wa-list">${WA_CHATS.map((c,i)=>`<button data-sim-action="wa-chat-${i}"><span>${c.avatar}</span><div><b>${c.name}</b><small>${c.preview}</small></div><i>${c.time}</i></button>`).join("")}</div></div>`;
  }

  function renderXApp(app) {
    return `<div class="a17-page x-app">${simAppTopbar(app)}<div class="x-head"><b>𝕏</b><span>Untuk Anda</span><button>⚙</button></div><div class="x-feed">${X_POSTS.map((p,i)=>`<article><span class="x-avatar">${p.name[0]}</span><div><b>${p.name}</b><small>${p.user} · ${i+1}j</small><p>${p.text}</p>${i===1?`<img src="./assets/waifu-20.jpg" alt="Wallpaper waifu">`:""}<footer><button data-sim-action="x-reply-${i}">◯</button><button data-sim-action="x-repost-${i}">↻</button><button data-sim-action="x-like-${i}">♡</button><button data-sim-action="share">↗</button></footer><small>${p.stats}</small></div></article>`).join("")}</div></div>`;
  }

  async function loadRealtimeWeather() {
    const label = $("#weatherLabel", root);
    if (!navigator.geolocation) { if (label) label.textContent = "Geolocation tidak didukung browser"; return; }
    if (label) label.textContent = "Meminta izin lokasi…";
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=3`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("weather");
        const data = await res.json();
        const current = data.current || {};
        const [icon, desc] = weatherCodeLabel(current.weather_code);
        const set = (id, value) => { const el=$(id,root); if(el) el.textContent=value; };
        set("#weatherIcon", icon); set("#weatherTemp", `${Math.round(current.temperature_2m)}°`); set("#weatherLabel", `${desc} • realtime`);
        set("#weatherFeels", `${Math.round(current.apparent_temperature)}°`); set("#weatherHumidity", `${current.relative_humidity_2m}%`); set("#weatherWind", `${Math.round(current.wind_speed_10m)} km/j`);
        const daily = data.daily || {};
        const text = (daily.time || []).map((d,i)=>`${i===0?"Hari ini":i===1?"Besok":"Lusa"}: ${Math.round(daily.temperature_2m_max?.[i])}° / ${Math.round(daily.temperature_2m_min?.[i])}°`).join(" • ");
        set("#weatherForecast", text || desc); set("#weatherCoords", `Lokasi browser: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
      } catch { if (label) label.textContent = "Gagal mengambil cuaca. Coba lagi."; }
    }, err => { if (label) label.textContent = err.code === 1 ? "Izin lokasi ditolak" : "Lokasi tidak tersedia"; }, { enableHighAccuracy:false, timeout:10000, maximumAge:300000 });
  }

  function updateSpotifyPlayback() {
    if (!state.spotifyPlaying || state.activeSimApp !== "spotify" || state.view !== "simApp") return;
    const track = INDONESIAN_TRACKS[state.spotifyTrack] || INDONESIAN_TRACKS[0];
    const elapsed = state.spotifyStartedAt ? (Date.now()-state.spotifyStartedAt)/1000 : 0;
    const p = Math.min(track.duration, (state.spotifyProgress||0) + elapsed);
    const slider = $("#spotifyProgress", root); const label=$("#spotifyTime", root);
    if (slider) slider.value = p; if (label) label.textContent = `${fmtDuration(p)} / ${fmtDuration(track.duration)}`;
    if (p >= track.duration) { state.spotifyPlaying=false; state.spotifyProgress=0; state.spotifyStartedAt=0; save(); render(); }
  }

  function updateRecorderSim() {
    if (!state.recorderActive || state.activeSimApp !== "recorder" || state.view !== "simApp") return;
    const sec = Math.max(0,(Date.now()-state.recorderStartedAt)/1000);
    const el = $("#recorderClock", root); if(el) el.textContent = fmtDuration(sec);
  }


  function renderSimApp() {
    const app = appById(state.activeSimApp);
    if (["brimo","digi-bank","dana","ovo"].includes(app.id)) return renderFinancialApp(app);
    if (app.id === "bcr") { root.innerHTML = renderBcrApp(app); return; }
    if (app.id === "dolby") { navigate("dolbyAtmos", false); return; }
    if (app.id === "settings-app") { navigate("settings", false); return; }
    if (app.id === "game-space-app") { navigate("gameSpace", false); return; }
    if (app.id === "camera") { navigate("camera", false); return; }

    if (app.id === "canva") { root.innerHTML = renderCanvaApp(app); return; }
    if (app.id === "capcut") { root.innerHTML = renderCapcutApp(app); return; }
    if (app.id === "weather") { root.innerHTML = renderWeatherApp(app); return; }
    if (app.id === "translate") { root.innerHTML = renderTranslateApp(app); return; }
    if (app.id === "keep") { root.innerHTML = renderKeepApp(app); return; }
    if (app.id === "contacts") { root.innerHTML = renderContactsApp(app); return; }
    if (app.id === "nekogram") { root.innerHTML = renderNekogramApp(app); return; }
    if (app.id === "recorder") { root.innerHTML = renderRecorderApp(app); return; }
    if (app.id === "pinterest") { root.innerHTML = renderPinterestApp(app); return; }
    if (app.id === "sandbox") { root.innerHTML = renderSandboxApp(app); return; }
    if (app.id === "spotify") { root.innerHTML = renderSpotifyApp(app); return; }
    if (app.id === "tiktok") { root.innerHTML = renderTikTokApp(app); return; }
    if (app.id === "wa-business") { root.innerHTML = renderWhatsAppApp(app); return; }
    if (app.id === "x") { root.innerHTML = renderXApp(app); return; }

    const commonTop = simAppTopbar(app);
    const social = ["facebook","instagram","threads","youtube"].includes(app.id);
    const communication = ["message","messenger","meet","phone","gmail"].includes(app.id);
    const files = ["files","drive","photos"].includes(app.id);
    let body = "";

    if (app.id === "calculator") {
      body = `<div class="calc-display" id="calcDisplay">0</div><div class="calc-grid">${["7","8","9","÷","4","5","6","×","1","2","3","−","0",".","=","+"].map(k=>`<button type="button" data-calc-key="${k}">${k}</button>`).join("")}</div>`;
    } else if (app.id === "chrome" || app.id === "google") {
      body = `<label class="sim-search"><span>G</span><input id="simSearchInput" placeholder="Telusuri atau ketik alamat"><button data-sim-action="search">⌕</button></label><div class="sim-card"><strong>Halaman awal</strong><p>Pencarian berlangsung di dalam simulator dan tidak membuka situs eksternal.</p></div>`;
    } else if (app.id === "gemini" || app.id === "m365") {
      body = `<div class="assistant-sim"><div class="assistant-orb">${app.glyph}</div><h3>Apa yang bisa saya bantu?</h3><label class="sim-search"><input id="assistantPrompt" placeholder="Tulis pesan"><button data-sim-action="assistant-send">➤</button></label><div class="sim-result" id="assistantResult">Respons demo akan muncul di sini.</div></div>`;
    } else if (app.id === "maps" || app.id === "grab") {
      body = `<label class="sim-search"><input placeholder="Cari lokasi"><button data-sim-action="map-search">⌕</button></label><div class="mock-map"><i></i><i></i><i></i><span>⌖</span></div><div class="sim-card"><strong>Lokasi simulasi</strong><p>Gunakan aplikasi Cuaca untuk contoh geolocation browser.</p></div>`;
    } else if (app.id === "clock") {
      body = `<div class="clock-sim"><strong id="appClockLive">${formatTime().replace(".",":")}</strong><span>${formatDate()}</span></div><button class="sim-primary" data-sim-action="add-alarm">＋ Tambah alarm</button>`;
    } else if (app.id === "calendar") {
      body = `<div class="calendar-sim"><strong>18</strong><span>Agustus 2026</span></div><div class="sim-card"><strong>Hari ini</strong><p>Belum ada acara simulasi.</p><button class="sim-primary" data-sim-action="add-event">＋ Tambah acara</button></div>`;
    } else if (app.id === "phone") {
      body = `<div class="phone-number" id="phoneNumber"> </div><div class="dial-grid">${[1,2,3,4,5,6,7,8,9,"*",0,"#"].map(k=>`<button data-dial-key="${k}">${k}</button>`).join("")}</div><button class="call-button" data-sim-action="call">☎</button>`;
    } else if (app.id === "play-store") {
      body = `<div class="sim-card"><strong>Direkomendasikan</strong>${["Editor Foto","Game Puzzle","Pemutar Musik"].map(x=>`<div class="store-row"><span>◆</span><b>${x}</b><button data-sim-action="install">Instal</button></div>`).join("")}</div>`;
    } else if (files) {
      body = `<div class="file-grid">${["Foto","Dokumen","Video","Download"].map((x,i)=>`<button data-sim-action="open-file"><span>${["▧","▤","▶","↓"][i]}</span><small>${x}</small></button>`).join("")}</div>`;
    } else if (communication) {
      body = `<div class="sim-card"><strong>Percakapan</strong>${["Skenakun","Waifu Gallery","Android 17"].map((x,i)=>`<button class="chat-row" data-sim-action="chat"><span>${x[0]}</span><div><b>${x}</b><small>${["Pesan demo","Terakhir aktif 06.20","Simulasi"][i]}</small></div></button>`).join("")}</div>`;
    } else if (social) {
      body = `<div class="sim-feed">${[1,2,3].map(i=>`<article><div class="feed-head"><span>${app.glyph}</span><b>${app.name}</b></div><div class="feed-media" style="background-image:url('./assets/waifu-${String([31,20,7][i-1]).padStart(2,"0")}.jpg')"></div><p>Konten simulasi ${i}. Tidak terhubung ke akun asli.</p><div><button data-sim-action="like">♡</button><button data-sim-action="comment">◯</button><button data-sim-action="share">↗</button></div></article>`).join("")}</div>`;
    } else {
      body = `<div class="sim-app-hero"><span class="drawer-app-icon tone-${app.tone}">${app.glyph}</span><h3>${app.name}</h3><p>Simulator aplikasi aktif.</p></div><div class="sim-card"><button class="sim-primary" data-sim-action="generic">Jalankan fitur demo</button></div>`;
    }

    root.innerHTML = `<div class="a17-page sim-app-page">${commonTop}<div class="sim-app-content">${body}</div></div>`;
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

  function renderScreenOff() {
    const ambient = state.alwaysOn
      ? `<div class="screen-off-ambient"><span id="ambientDateLive">${formatDate()}</span><strong id="ambientClockLive">${formatTime().replace(".", ":")}</strong><small>${state.battery}%</small></div>`
      : "";
    root.innerHTML = `<div class="a17-page screen-off-page" id="screenOffPage">${ambient}</div>`;
  }

  function renderLock() {
    root.innerHTML = `<div class="a17-page lock-page" id="lockPage"><div class="lock-wall"></div><div class="lock-content"><div class="lock-date" id="lockDateLive">${formatDate()}</div><div class="lock-time ${state.dynamicClock && state.lockNotifications ? "compact" : ""}" id="lockClockLive">${lockClockMarkup()}</div>
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
    if (state.screenOff) renderScreenOff();
    else if (state.locked) renderLock();
    else {
      const map = {
        home: renderHome, wallpaperStyle: renderWallpaperStyle, color: renderColor, icons: renderIcons, layout: renderLayout,
        clock: renderClock, shortcuts: renderShortcuts, notifications: renderNotifications, lockMore: renderLockMore,
        wallpaperPicker: renderWallpaperPicker, homeSettings: renderHomeSettings, settings: renderSettings, system: renderSystem,
        languageRegion: renderLanguageRegion, navigationMode: renderNavigationMode, gestureNavigation: renderGestureNavigation,
        buttonNavigation: renderButtonNavigation, recents: renderRecents, about: renderAbout,
        apps: renderApps, appInfo: renderAppInfo, simApp: renderSimApp, camera: renderCamera, boot: renderBoot,

        networkInternet: renderNetworkInternet, internetSettings: renderInternetSettings, simSettings: renderSimSettings,
        hotspotSettings: renderHotspotSettings, dataSaverSettings: renderDataSaverSettings, vpnSettings: renderVpnSettings,
        privateDnsSettings: renderPrivateDnsSettings,

        connectedDevices: renderConnectedDevices, connectionPreferences: renderConnectionPreferences,
        bluetoothSettings: renderBluetoothSettings, pairNewDevice: renderPairNewDevice, bluetoothDeviceDetail: renderBluetoothDeviceDetail,
        crossDevice: renderCrossDevice, nfcSettings: renderNfcSettings, castSettings: renderCastSettings,
        printingSettings: renderPrintingSettings, chromebookSettings: renderChromebookSettings, quickShareSettings: renderQuickShareSettings,
        androidAutoSettings: renderAndroidAutoSettings,

        appsSettings: renderAppsSettings, allApps: renderAllApps, defaultApps: renderDefaultApps, cloneApps: renderCloneApps,
        gameSpace: renderGameSpace, assistantSettings: renderAssistantSettings, digitalWellbeing: renderDigitalWellbeing,
        mediaCloudSettings: renderMediaCloudSettings, sideBarSettings: renderSideBarSettings,
        contactStorageSettings: renderContactStorageSettings, unusedApps: renderUnusedApps,
        appBatteryUsage: renderAppBatteryUsage, specialAppAccess: renderSpecialAppAccess,

        notificationsSettings: renderNotificationsSettings, notificationApps: renderNotificationApps,
        notificationHistory: renderNotificationHistory, notificationConversations: renderNotificationConversations,
        notificationBubbles: renderNotificationBubbles, notificationAccess: renderNotificationAccess,
        notificationSoundSettings: renderNotificationSoundSettings, flashNotifications: renderFlashNotifications,
        emergencyAlerts: renderEmergencyAlerts,

        batterySettings: renderBatterySettings, batteryUsage: renderBatteryUsage, batterySaverSettings: renderBatterySaverSettings,
        batteryManagerSettings: renderBatteryManagerSettings, batteryWidget: renderBatteryWidget, chargingControl: renderChargingControl,
        storageSettings: renderStorageSettings,

        displaySettings: renderDisplaySettings, adaptiveBrightnessSettings: renderAdaptiveBrightness,
        hdrBrightnessSettings: renderHdrBrightness, extraDimSettings: renderExtraDim, lockScreenDisplay: renderLockScreenDisplay,
        alwaysOnSettings: renderAlwaysOnSettings, screenTimeoutSettings: renderScreenTimeoutSettings,
        darkThemeSettings: renderDarkThemeSettings, displaySizeText: renderDisplaySizeText, liveDisplay: renderLiveDisplay,
        nightLightSettings: renderNightLightSettings, displayColorSettings: renderDisplayColorSettings,
        rotationSettings: renderRotationSettings, refreshRateSettings: renderRefreshRateSettings, cutoutSettings: renderCutoutSettings,
        fullscreenApps: renderFullscreenApps, screensaverSettings: renderScreensaverSettings, blurSettings: renderBlurSettings,
        vehicleMotionCues: renderVehicleMotionCues, refreshRateApps: renderRefreshRateApps,
        touchResponsiveness: renderTouchResponsiveness, antiFlicker: renderAntiFlicker, highBrightness: renderHighBrightness,
        displaySaturation: renderDisplaySaturation,

        soundSettings: renderSoundSettings, vibrationHaptics: renderVibrationHaptics, ringtonePattern: renderRingtonePattern,
        ringtonePicker: renderRingtonePicker, liveCaption: renderLiveCaption, spatialAudioSettings: renderSpatialAudio,
        nowPlayingSettings: renderNowPlayingSettings, nowPlayingHistory: renderNowPlayingHistory,
        defaultMusicPlayer: renderDefaultMusicPlayer, mediaSettings: renderMediaSettings, cleanSpeaker: renderCleanSpeaker,
        dolbyAtmos: renderDolbyAtmos, equalizer: renderEqualizer, appAudioProfiles: renderAppAudioProfiles,

        securityPrivacy: renderSecurityPrivacy, deviceUnlock: renderDeviceUnlock
      };
      (map[state.view] || renderHome)();
    }
    if (state.shade && state.view !== "boot") root.insertAdjacentHTML("beforeend", renderQuickShade());
    bindDynamic();
  }

  function bindDynamic() {
    $$('[data-nav]', root).forEach(btn => btn.addEventListener("click", () => btn.dataset.nav === "back" ? goBack() : navigate(btn.dataset.nav)));
    $$('[data-open-app]', root).forEach(btn => btn.addEventListener("click", () => {
      const id = btn.dataset.openApp;
      state.activeSimApp = id;
      state.recentSimApps = [id, ...(state.recentSimApps || []).filter(x => x !== id)].slice(0, 8);
      save(); vibrate(6); navigate("simApp");
    }));
    $$('[data-app-info]', root).forEach(btn => btn.addEventListener("click", () => {
      state.appInfoId = btn.dataset.appInfo; save(); navigate("appInfo");
    }));
    const drawerSearch = $("#drawerSearch", root);
    drawerSearch?.addEventListener("input", () => {
      const q = drawerSearch.value.trim().toLowerCase(); let visible = 0;
      $$("[data-drawer-search]", root).forEach(el => { const show = !q || el.dataset.drawerSearch.includes(q); el.hidden = !show; if (show) visible++; });
      const empty = $("#drawerEmpty", root); if (empty) empty.hidden = visible !== 0;
    });
    const allAppsSearch = $("#allAppsSearch", root);
    allAppsSearch?.addEventListener("input", () => {
      const q = allAppsSearch.value.trim().toLowerCase(); let visible = 0;
      $$("[data-app-search]", root).forEach(el => { const show = !q || el.dataset.appSearch.includes(q); el.hidden = !show; if (show) visible++; });
      const count = $("#allAppsCount", root); if (count) count.textContent = `${visible} dari ${ALL_APPS.length} aplikasi`;
      const empty = $("#allAppsEmpty", root); if (empty) empty.hidden = visible !== 0;
    });
    $$('[data-sim-action]', root).forEach(btn => btn.addEventListener("click", () => handleSimAppAction(btn.dataset.simAction)));
    const translateInput = $("#translateInput", root);
    if (translateInput) {
      const syncTranslateInput = () => {
        state.translateText = translateInput.value;
        const count = $("#translateCharCount", root);
        if (count) count.textContent = `${translateInput.value.length}/2000`;
        save();
        runRealtimeTranslation();
      };
      translateInput.addEventListener("input", syncTranslateInput);
      translateInput.addEventListener("paste", () => window.setTimeout(syncTranslateInput, 0));
      if (translateInput.value.trim() && !state.translateResult) runRealtimeTranslation();
    }
    const contactSearch = $("#contactSearch", root);
    contactSearch?.addEventListener("input", () => {
      const q=contactSearch.value.trim().toLowerCase();
      $$('[data-contact-search]',root).forEach(el=>el.hidden=!!q&&!el.dataset.contactSearch.includes(q));
    });
    $$('[data-calc-key]', root).forEach(btn => btn.addEventListener("click", () => handleCalculator(btn.dataset.calcKey)));
    $$('[data-dial-key]', root).forEach(btn => btn.addEventListener("click", () => {
      const display = $("#phoneNumber", root); if (display) display.textContent = (display.textContent + btn.dataset.dialKey).slice(0, 18);
    }));
    $$('[data-toggle]', root).forEach(btn => btn.addEventListener("click", () => {
      const key = btn.dataset.toggle; state[key] = !state[key]; save(); vibrate(); render();
    }));
    $$('[data-style-tab]', root).forEach(btn => btn.addEventListener("click", () => {
      state.styleTab = btn.dataset.styleTab; state.wallpaperTarget = state.styleTab; save(); render();
    }));
    $$('[data-carousel-wall]', root).forEach(btn => btn.addEventListener("click", () => setWallpaper(btn.dataset.carouselWall)));
    $$('[data-pick-wallpaper]', root).forEach(btn => btn.addEventListener("click", () => setWallpaper(btn.dataset.pickWallpaper)));
    $$('[data-home-quick-wall]', root).forEach(btn => btn.addEventListener("click", () => {
      state.homeWallpaper = btn.dataset.homeQuickWall; state.palette = wallPaletteId(state.homeWallpaper); state.simColorSource = "wallpaper"; state.simExtractedPalette = null; state.longPressMenu = false; save(); render(); applyWallpaperColorBurst();
    }));
    $$('[data-palette]', root).forEach(btn => btn.addEventListener("click", () => {
      state.palette = btn.dataset.palette;
      state.simColorSource = "wallpaper";
      state.simExtractedPalette = null;
      save(); applyTheme(); vibrate(); render(); toast(t("colorUpdated"));
    }));
    $$('[data-color-tab]', root).forEach(btn => btn.addEventListener("click", () => { state.colorTab = btn.dataset.colorTab; save(); render(); }));
    $$('[data-sim-manual-color]', root).forEach(btn => btn.addEventListener("click", () => {
      const primary = btn.dataset.simManualColor;
      state.simColorSource = "manual";
      state.simCustomColor = primary;
      state.simExtractedPalette = createSimulatorPalette(primary);
      save(); applyTheme(); vibrate(6); render(); toast(t("colorUpdated"));
    }));
    $("#simCustomColor", root)?.addEventListener("input", e => {
      const primary = e.target.value;
      state.simColorSource = "manual";
      state.simCustomColor = primary;
      state.simExtractedPalette = createSimulatorPalette(primary);
      save(); applyTheme();
      const page = $(".color-burst-sim-page", root);
      if (page) {
        const p = activeSimulatorPalette();
        page.style.setProperty("--burst-primary", p.primary);
        page.style.setProperty("--burst-secondary", p.secondary);
        page.style.setProperty("--burst-tertiary", p.tertiary);
      }
    });
    $("#simCustomColor", root)?.addEventListener("change", () => { vibrate(6); render(); toast(t("colorUpdated")); });
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

    $$('[data-state-value-key]', root).forEach(btn => btn.addEventListener("click", () => {
      const key = btn.dataset.stateValueKey;
      let value = btn.dataset.stateValue;
      if (value === "true") value = true;
      else if (value === "false") value = false;
      else if (/^-?\d+(?:\.\d+)?$/.test(value)) value = Number(value);
      state[key] = value;
      save(); vibrate(6);
      const next = btn.dataset.nextAfterValue;
      next ? navigate(next) : render();
    }));

    $$('[data-setting-range]', root).forEach(input => {
      const update = () => {
        const key = input.dataset.settingRange;
        state[key] = Number(input.value);
        const output = input.parentElement?.querySelector('output');
        if (output) {
          const suffix = output.textContent?.trim().endsWith('%') ? '%' : '';
          output.textContent = `${state[key]}${suffix}`;
        }
        save();
        if (key === "brightness") applyTheme();
        if (key === "volume") showVolume();
      };
      input.addEventListener("input", update);
      input.addEventListener("change", () => { update(); vibrate(4); });
    });

    $$('[data-wifi-network]', root).forEach(btn => btn.addEventListener("click", () => {
      state.wifi = true;
      state.airplane = false;
      state.connectedWifi = btn.dataset.wifiNetwork;
      save(); vibrate(8); toast(`Terhubung ke ${state.connectedWifi}`); render();
    }));

    $$('[data-clone-app]', root).forEach(btn => btn.addEventListener("click", () => {
      const app = btn.dataset.cloneApp;
      const list = new Set(state.cloneApps || []);
      list.has(app) ? list.delete(app) : list.add(app);
      state.cloneApps = [...list];
      save(); vibrate(8); render();
    }));

    $$('[data-notification-access]', root).forEach(btn => btn.addEventListener("click", () => {
      const app = btn.dataset.notificationAccess;
      const list = new Set(state.notificationAccess || []);
      list.has(app) ? list.delete(app) : list.add(app);
      state.notificationAccess = [...list];
      save(); vibrate(8); render();
    }));

    $$('[data-map-toggle]', root).forEach(btn => btn.addEventListener("click", () => {
      const mapKey = btn.dataset.mapToggle;
      const itemKey = btn.dataset.mapKey;
      const currentMap = { ...(state[mapKey] || {}) };
      currentMap[itemKey] = !currentMap[itemKey];
      state[mapKey] = currentMap;
      save(); vibrate(6); render();
    }));

    $$('[data-action]', root).forEach(btn => btn.addEventListener("click", () => handleAction(btn.dataset.action)));

    $("#brightnessSlider")?.addEventListener("input", e => { state.brightness = Number(e.target.value); save(); applyTheme(); });

    const lockPage = $("#lockPage", root);
    if (lockPage) {
      let lockStartY = null;
      lockPage.addEventListener("pointerdown", e => {
        if (e.target.closest("button")) return;
        lockStartY = e.clientY;
      });
      lockPage.addEventListener("pointerup", e => {
        if (lockStartY == null) return;
        const dy = e.clientY - lockStartY;
        lockStartY = null;
        if (dy < -42) unlockPhone();
      });
      lockPage.addEventListener("pointercancel", () => { lockStartY = null; });
    }
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

  function handleCalculator(key) {
    const display = $("#calcDisplay", root); if (!display) return;
    let value = display.textContent === "0" ? "" : display.textContent;
    if (key === "=") {
      try {
        const safe = value.replaceAll("×","*").replaceAll("÷","/").replaceAll("−","-");
        if (!/^[0-9+\-*/. ()]+$/.test(safe)) throw new Error("invalid");
        const result = Function(`"use strict"; return (${safe || 0})`)();
        display.textContent = Number.isFinite(result) ? String(result) : "Error";
      } catch { display.textContent = "Error"; }
      return;
    }
    if (display.textContent === "Error") value = "";
    display.textContent = (value + key).slice(0, 22) || "0";
  }

  function handleSimAppAction(action) {
    const app = appById(state.activeSimApp);
    if (action && action.startsWith("finance-")) { toast(`SIMULASI ${app.name}: transaksi tidak dikirim`); vibrate(8); return; }

    if (action === "weather-location") { loadRealtimeWeather(); return; }
    if (action === "translate-swap") {
      const input = $("#translateInput", root)?.value || state.translateText || "";
      const result = $("#translateResult", root)?.textContent || state.translateResult || "";
      state.translateDirection = state.translateDirection === "id-en" ? "en-id" : "id-en";
      state.translateText = result || input;
      state.translateResult = result ? input : "";
      save(); render();
      window.setTimeout(() => runRealtimeTranslation({ immediate: true }), 0);
      return;
    }
    if (action === "translate-clear") {
      if (realtimeTranslateAbort) realtimeTranslateAbort.abort();
      window.clearTimeout(realtimeTranslateTimer);
      state.translateText = "";
      state.translateResult = "";
      save();
      const el = $("#translateInput", root); if (el) el.value = "";
      const count = $("#translateCharCount", root); if (count) count.textContent = "0/2000";
      setTranslateUi({ text: "", status: "Ketik teks untuk menerjemahkan otomatis.", busy: false });
      return;
    }
    if (action === "translate") { runRealtimeTranslation({ immediate: true }); return; }
    if (action === "translate-copy") {
      const txt = $("#translateResult", root)?.textContent || "";
      if (!txt) { toast("Belum ada hasil terjemahan"); return; }
      navigator.clipboard?.writeText(txt).then(() => toast("Hasil disalin")).catch(() => toast("Tidak dapat menyalin"));
      return;
    }
    if (action === "translate-speak") {
      const txt = $("#translateResult", root)?.textContent || "";
      if (!txt) return;
      try {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(txt);
        utterance.lang = translateLangPair().speech;
        speechSynthesis.speak(utterance);
      } catch {}
      return;
    }

    if (action === "keep-add") { const title=$("#keepTitle",root)?.value.trim()||"Catatan"; const body=$("#keepBody",root)?.value.trim()||""; if(!body){toast("Tulis isi catatan");return;} state.keepNotes=[{title,body,time:new Date().toLocaleString("id-ID")},...(state.keepNotes||[])].slice(0,30); save(); render(); toast("Catatan tersimpan"); return; }
    if (action?.startsWith("keep-delete-")) { const i=Number(action.split("-").pop()); state.keepNotes=(state.keepNotes||[]).filter((_,x)=>x!==i); save(); render(); return; }

    if (action?.startsWith("contact-open-")) { state.activeContact=Number(action.split("-").pop()); state.contactDetailOpen=true; save(); render(); return; }
    if (action === "contacts-list") { state.contactDetailOpen=false; save(); render(); return; }
    if (action === "contact-call") { toast("Panggilan kontak simulasi"); vibrate(10); return; }
    if (action === "contact-message") { toast("Pesan kontak simulasi"); return; }

    if (action?.startsWith("nekogram-chat-")) { state.nekogramThread=Number(action.split("-").pop()); save(); render(); return; }
    if (action === "nekogram-list") { state.nekogramThread=-1; save(); render(); return; }
    if (action === "nekogram-send") { const msg=$("#nekogramMessage",root)?.value.trim(); if(!msg)return; const idx=Number(state.nekogramThread); const extra={...(state.nekogramExtra||{})}; extra[idx]=[...(extra[idx]||[]),msg]; state.nekogramExtra=extra; save(); render(); return; }

    if (action === "recorder-toggle") { if(state.recorderActive){ const sec=Math.max(1,Math.round((Date.now()-state.recorderStartedAt)/1000)); state.recorderItems=[{name:`Rekaman ${new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})}`,duration:fmtDuration(sec),time:"Baru saja"},...(state.recorderItems||[])]; state.recorderActive=false; state.recorderStartedAt=0; } else { state.recorderActive=true; state.recorderStartedAt=Date.now(); } save(); render(); return; }
    if (action?.startsWith("recorder-play-")) { toast("Memutar rekaman simulasi"); return; }

    if (action?.startsWith("pinterest-open-")) { state.pinterestPin=Number(action.split("-").pop()); save(); render(); return; }
    if (action === "pinterest-list") { state.pinterestPin=-1; save(); render(); return; }
    if (action === "pinterest-save") { toast("Pin disimpan di simulator"); return; }

    if (action === "sandbox-system") { state.sandboxShowSystem=!state.sandboxShowSystem; save(); render(); return; }
    if (action?.startsWith("sandbox-tab-")) { state.sandboxTab=action.replace("sandbox-tab-",""); save(); render(); return; }
    if (action === "sandbox-unlock") { state.sandboxUnlocked=true; save(); vibrate(10); render(); toast("Private area simulator dibuka"); return; }
    if (action === "sandbox-lock") { state.sandboxUnlocked=false; save(); render(); return; }

    if (action?.startsWith("spotify-track-")) { state.spotifyTrack=Number(action.split("-").pop()); state.spotifyProgress=0; state.spotifyPlaying=true; state.spotifyStartedAt=Date.now(); save(); render(); return; }
    if (action === "spotify-toggle") { if(state.spotifyPlaying){ const elapsed=state.spotifyStartedAt?(Date.now()-state.spotifyStartedAt)/1000:0; state.spotifyProgress=(state.spotifyProgress||0)+elapsed; state.spotifyPlaying=false; state.spotifyStartedAt=0; } else { state.spotifyPlaying=true; state.spotifyStartedAt=Date.now(); } save(); render(); return; }
    if (action === "spotify-next" || action === "spotify-prev") { const dir=action.endsWith("next")?1:-1; state.spotifyTrack=(Number(state.spotifyTrack)+dir+INDONESIAN_TRACKS.length)%INDONESIAN_TRACKS.length; state.spotifyProgress=0; state.spotifyStartedAt=state.spotifyPlaying?Date.now():0; save(); render(); return; }

    if (action === "tiktok-next" || action === "tiktok-prev") { state.tiktokIndex=(Number(state.tiktokIndex)||0)+(action.endsWith("next")?1:-1); save(); render(); return; }

    if (action?.startsWith("wa-chat-")) { state.waThread=Number(action.split("-").pop()); save(); render(); return; }
    if (action === "wa-list") { state.waThread=-1; save(); render(); return; }
    if (action === "wa-send") { const msg=$("#waMessage",root)?.value.trim(); if(!msg)return; const idx=Number(state.waThread); const extra={...(state.waExtra||{})}; extra[idx]=[...(extra[idx]||[]),msg]; state.waExtra=extra; save(); render(); return; }

    if (action?.startsWith("x-like-") || action?.startsWith("x-repost-") || action?.startsWith("x-reply-")) { toast(action.includes("like")?"Disukai":"Interaksi X simulasi"); return; }

    if (action === "bcr-cycle-rules") { const vals=["Semua panggilan","Hanya kontak","Nomor tertentu","Manual"]; state.bcrAutoRules=vals[(vals.indexOf(state.bcrAutoRules)+1)%vals.length]; save(); render(); return; }
    if (action === "bcr-cycle-format") { const vals=["OGG/Opus, 48 kbps, 16000 Hz, Combined (Mono)","M4A/AAC, 96 kbps, 44100 Hz, Stereo","WAV/PCM, 44100 Hz, Mono"]; state.bcrOutputFormat=vals[(vals.indexOf(state.bcrOutputFormat)+1)%vals.length]; save(); render(); return; }
    if (action === "bcr-cycle-min") { state.bcrMinimumDuration=state.bcrMinimumDuration==="Durasi apa pun"?"5 detik":"Durasi apa pun"; save(); render(); return; }

    if (action?.startsWith("canva-image-")) { state.canvaImage=`waifu-${String(Number(action.split("-").pop())).padStart(2,"0")}`; save(); render(); return; }
    if (action === "canva-apply-text") { state.canvaText=$("#canvaTextInput",root)?.value||"Waifu Gallery"; save(); render(); return; }
    if (action === "canva-filter") { toast("Filter simulasi diterapkan"); return; }
    if (action === "canva-save") { state.canvaText=$("#canvaTextInput",root)?.value||state.canvaText; save(); toast("Desain disimpan di simulator"); return; }

    if (action === "capcut-play") { state.capcutPlaying=!state.capcutPlaying; save(); render(); return; }
    if (action === "capcut-export") { toast("Ekspor simulasi selesai"); return; }
    if (action === "capcut-tool") { toast("Tool editor simulasi aktif"); return; }

    if (action === "search") { toast("Pencarian simulasi dijalankan"); return; }
    if (action === "assistant-send") { const prompt=$("#assistantPrompt",root)?.value?.trim()||""; const result=$("#assistantResult",root); if(result) result.textContent=prompt?`Respons simulasi untuk: ${prompt}`:"Tulis pesan terlebih dahulu."; return; }
    if (action === "call") { toast("Panggilan simulasi • tidak melakukan panggilan nyata"); vibrate(12); return; }
    if (action === "install") { toast("Aplikasi demo dipasang"); return; }
    if (action === "app-force-stop") { toast("Aplikasi dihentikan dalam simulator"); return; }
    const labels={"map-search":"Lokasi simulasi ditemukan","add-alarm":"Alarm simulasi ditambahkan","add-event":"Acara simulasi ditambahkan","open-file":"Membuka item simulasi","chat":"Percakapan simulasi dibuka","like":"Disukai","comment":"Komentar simulasi","share":"Dibagikan secara simulasi","generic":"Fitur simulasi dijalankan"};
    toast(labels[action]||"Aksi simulasi dijalankan"); vibrate(5);
  }

  function handleAction(action) {
    if (action === "dismissMenu") { state.longPressMenu = false; render(); }
    if (action === "extractSimWallpaperPalette") { applyWallpaperColorBurst(); }
    if (action === "openStyle") { state.styleTab = "home"; state.wallpaperTarget = "home"; navigate("wallpaperStyle"); }
    if (action === "widgetToast") toast(t("widgets"));
    if (action === "applyLayout") {
      state.homeCols = Math.max(4, Math.min(6, Number(state.layoutDraft) || 5));
      state.layoutDraft = state.homeCols;
      save();
      applyTheme();
      vibrate(8);
      navigate("wallpaperStyle", false);
    }
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

    if (action === "toggleVpn") {
      state.vpnEnabled = !state.vpnEnabled;
      save(); vibrate(8); render(); toast(state.vpnEnabled ? "VPN tersambung" : "VPN terputus");
    }
    if (action === "pairI12") {
      state.bluetooth = true; state.pairedDevice = "i12"; state.pairedDeviceConnected = true;
      save(); vibrate(12); navigate("bluetoothDeviceDetail");
    }
    if (action === "forgetDevice") {
      state.pairedDeviceConnected = false; state.pairedDevice = "";
      save(); vibrate(8); navigate("connectedDevices", false); toast("Perangkat dilupakan");
    }
    if (action === "connectDevice") {
      state.pairedDeviceConnected = !state.pairedDeviceConnected;
      save(); vibrate(8); render(); toast(state.pairedDeviceConnected ? "Perangkat terhubung" : "Perangkat terputus");
    }
    if (action === "crossDeviceReady") { state.crossDeviceReady = true; save(); render(); toast("Layanan lintas perangkat siap"); }
    if (action === "addPrinter") toast("Layanan Cetak Default tersedia");
    if (action === "clearConversations") toast("Percakapan terbaru dibersihkan");
    if (action === "addBatteryWidget") { toast("Widget baterai ditambahkan"); setTimeout(() => navigate("home"), 450); }
    if (action === "cleanStorage") { toast("Pembersihan simulasi selesai"); }
    if (action === "resetDisplaySize") { state.fontScale = 100; state.displayScale = 100; save(); render(); }
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

  function lockPhone() { state.screenOff = false; state.locked = true; state.shade = false; save(); render(); }
  function unlockPhone() { state.screenOff = false; state.locked = false; state.view = "home"; state.shade = false; save(); render(); }
  function togglePower() {
    if (state.screenOff) {
      state.screenOff = false;
      state.locked = true;
    } else {
      state.screenOff = true;
      state.locked = true;
      state.shade = false;
    }
    save();
    render();
  }
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

  power?.addEventListener("click", togglePower);
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

    const lockClock = $("#lockClockLive", root);
    const lockDate = $("#lockDateLive", root);
    const ambientClock = $("#ambientClockLive", root);
    const ambientDate = $("#ambientDateLive", root);
    const appClock = $("#appClockLive", root);
    if (lockClock) lockClock.innerHTML = lockClockMarkup();
    if (lockDate) lockDate.textContent = formatDate();
    if (ambientClock) ambientClock.textContent = formatTime().replace(".", ":");
    if (ambientDate) ambientDate.textContent = formatDate();
    if (appClock) appClock.textContent = formatTime().replace(".", ":");
    updateSpotifyPlayback();
    updateRecorderSim();
  }, 1000);

  applyTheme();
  render();
})();
