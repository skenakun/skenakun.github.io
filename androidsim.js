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

  const SIM_APPS = [{"id":"youtube","name":"YouTube","glyph":"▶","tone":"red","category":"media"},{"id":"youtube-music","name":"YouTube Music","glyph":"◉","tone":"red","category":"media"},{"id":"play-store","name":"Play Store","glyph":"▶","tone":"multi","category":"store"},{"id":"translate","name":"Terjemah","glyph":"文","tone":"blue","category":"utility"},{"id":"digi-bank","name":"DIGI bank bjb","glyph":"D","tone":"blue","category":"finance"},{"id":"dana","name":"DANA","glyph":"D","tone":"blue","category":"finance"},{"id":"bcr","name":"BCR","glyph":"☎","tone":"green","category":"finance"},{"id":"brimo","name":"BRImo","glyph":"B","tone":"blue","category":"finance"},{"id":"canva","name":"Canva","glyph":"C","tone":"purple","category":"creative"},{"id":"capcut","name":"CapCut","glyph":"✂","tone":"dark","category":"creative"},{"id":"chrome","name":"Chrome","glyph":"●","tone":"multi","category":"browser"},{"id":"weather","name":"Cuaca","glyph":"☀","tone":"yellow","category":"utility"},{"id":"dolby","name":"Dolby Atmos","glyph":"D","tone":"blue","category":"utility"},{"id":"drive","name":"Drive","glyph":"▲","tone":"multi","category":"files"},{"id":"facebook","name":"Facebook","glyph":"f","tone":"blue","category":"social"},{"id":"files","name":"Files","glyph":"▤","tone":"blue","category":"files"},{"id":"photos","name":"Foto","glyph":"✿","tone":"multi","category":"files"},{"id":"gemini","name":"Gemini","glyph":"✦","tone":"multi","category":"ai"},{"id":"gmail","name":"Gmail","glyph":"M","tone":"multi","category":"mail"},{"id":"google","name":"Google","glyph":"G","tone":"multi","category":"search"},{"id":"grab","name":"Grab","glyph":"G","tone":"green","category":"maps"},{"id":"instagram","name":"Instagram","glyph":"◎","tone":"multi","category":"social"},{"id":"clock","name":"Jam","glyph":"◷","tone":"blue","category":"utility"},{"id":"calendar","name":"Kalender","glyph":"18","tone":"blue","category":"utility"},{"id":"calculator","name":"Kalkulator","glyph":"±","tone":"dark","category":"calculator"},{"id":"camera","name":"Kamera","glyph":"◉","tone":"dark","category":"camera"},{"id":"keep","name":"Keep","glyph":"●","tone":"yellow","category":"notes"},{"id":"personal-safety","name":"Keselamatan Pribadi","glyph":"✚","tone":"multi","category":"utility"},{"id":"contacts","name":"Kontak","glyph":"●","tone":"blue","category":"contacts"},{"id":"m365","name":"M365 Copilot","glyph":"M","tone":"multi","category":"ai"},{"id":"maps","name":"Maps","glyph":"⌖","tone":"multi","category":"maps"},{"id":"meet","name":"Meet","glyph":"▰","tone":"yellow","category":"communication"},{"id":"message","name":"Message","glyph":"✉","tone":"blue","category":"communication"},{"id":"messenger","name":"Messenger","glyph":"➤","tone":"blue","category":"communication"},{"id":"nekogram","name":"Nekogram","glyph":"N","tone":"blue","category":"communication"},{"id":"ovo","name":"OVO","glyph":"O","tone":"purple","category":"finance"},{"id":"recorder","name":"Perekam Suara","glyph":"▥","tone":"red","category":"utility"},{"id":"pinterest","name":"Pinterest","glyph":"P","tone":"red","category":"social"},{"id":"game-space-app","name":"Ruang Game","glyph":"🎮","tone":"yellow","category":"game"},{"id":"sandbox","name":"Sandbox","glyph":"◆","tone":"dark","category":"utility"},{"id":"settings-app","name":"Setelan","glyph":"⚙","tone":"blue","category":"settings"},{"id":"sim-toolkit","name":"SIM Toolkit","glyph":"SIM","tone":"slate","category":"utility"},{"id":"spotify","name":"Spotify","glyph":"◉","tone":"green","category":"media"},{"id":"phone","name":"Telepon","glyph":"☎","tone":"blue","category":"phone"},{"id":"threads","name":"Threads","glyph":"@","tone":"dark","category":"social"},{"id":"tiktok","name":"TikTok","glyph":"♪","tone":"dark","category":"social"},{"id":"wa-business","name":"WA Business","glyph":"W","tone":"green","category":"communication"},{"id":"x","name":"X","glyph":"X","tone":"dark","category":"social"}];
  const SYSTEM_APPS = [{"id":"sys-amplifier-suara","name":"Amplifier Suara","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-accessibility-suite","name":"Android Accessibility Suite","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-auto","name":"Android Auto","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-switch","name":"Android Switch","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-system-key-verifier","name":"Android System Key Verifier","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-system-safetycore","name":"Android System SafetyCore","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-system-webview","name":"Android System WebView","glyph":"◆","tone":"system","category":"system"},{"id":"sys-carrier-services","name":"Carrier Services","glyph":"◆","tone":"system","category":"system"},{"id":"sys-device-health-services","name":"Device Health Services","glyph":"◆","tone":"system","category":"system"},{"id":"sys-digital-wellbeing","name":"Digital Wellbeing","glyph":"◆","tone":"system","category":"system"},{"id":"sys-google-play-services","name":"Google Play services","glyph":"◆","tone":"system","category":"system"},{"id":"sys-pixel-launcher","name":"Pixel Launcher","glyph":"◆","tone":"system","category":"system"},{"id":"sys-private-compute-services","name":"Private Compute Services","glyph":"◆","tone":"system","category":"system"},{"id":"sys-system-ui","name":"System UI","glyph":"◆","tone":"system","category":"system"},{"id":"sys-permission-controller","name":"Permission Controller","glyph":"◆","tone":"system","category":"system"},{"id":"sys-settings-services","name":"Settings Services","glyph":"◆","tone":"system","category":"system"},{"id":"sys-speech-recognition-synthesis","name":"Speech Recognition & Synthesis","glyph":"◆","tone":"system","category":"system"},{"id":"sys-android-shared-library","name":"Android Shared Library","glyph":"◆","tone":"system","category":"system"},{"id":"sys-documentsui","name":"DocumentsUI","glyph":"◆","tone":"system","category":"system"},{"id":"sys-package-installer","name":"Package Installer","glyph":"◆","tone":"system","category":"system"},{"id":"sys-captiveportallogin","name":"CaptivePortalLogin","glyph":"◆","tone":"system","category":"system"},{"id":"sys-emergency-information","name":"Emergency Information","glyph":"◆","tone":"system","category":"system"},{"id":"sys-google-one-time-init","name":"Google One Time Init","glyph":"◆","tone":"system","category":"system"},{"id":"sys-google-services-framework","name":"Google Services Framework","glyph":"◆","tone":"system","category":"system"},{"id":"sys-google-partner-setup","name":"Google Partner Setup","glyph":"◆","tone":"system","category":"system"},{"id":"sys-sim-manager","name":"SIM Manager","glyph":"◆","tone":"system","category":"system"},{"id":"sys-storage-manager","name":"Storage Manager","glyph":"◆","tone":"system","category":"system"},{"id":"sys-device-policy","name":"Device Policy","glyph":"◆","tone":"system","category":"system"},{"id":"sys-download-manager","name":"Download Manager","glyph":"◆","tone":"system","category":"system"}];
  const ALL_APPS = [...SIM_APPS, ...SYSTEM_APPS];
  const SIM_BALANCE = "Rp1.000.000.000.000.000";
  const SETTINGS_SEARCH_INDEX = [
    { title:"Internet", desc:"Wi-Fi dan jaringan yang tersedia", group:"Jaringan & internet", nav:"internetSettings", keywords:"wifi wi-fi jaringan internet hotspot" },
    { title:"SIM", desc:"3, Indosat, SIM utama dan data seluler", group:"Jaringan & internet", nav:"simSettings", keywords:"sim kartu sim dual sim 3 tri indosat im3 data seluler panggilan sms" },
    { title:"Tambahkan eSIM", desc:"Siapkan SIM digital dari operator Indonesia", group:"Jaringan & internet › SIM", nav:"eSimSetup", keywords:"esim e-sim telkomsel im3 xl tri smartfren operator qr" },
    { title:"Hotspot & tethering", desc:"Bagikan koneksi internet", group:"Jaringan & internet", nav:"hotspotSettings", keywords:"hotspot tether tethering usb bluetooth ethernet" },
    { title:"Penghemat Data", desc:"Batasi penggunaan data latar belakang", group:"Jaringan & internet", nav:"dataSaverSettings", keywords:"data saver hemat kuota seluler" },
    { title:"VPN", desc:"VPN dari Google", group:"Jaringan & internet", nav:"vpnSettings", keywords:"vpn virtual private network" },
    { title:"DNS Pribadi", desc:"Atur DNS aman", group:"Jaringan & internet", nav:"privateDnsSettings", keywords:"dns private dns pribadi google dns" },

    { title:"Bluetooth", desc:"Perangkat Bluetooth dan nama perangkat", group:"Perangkat terhubung", nav:"bluetoothSettings", keywords:"bluetooth bt google pixel 10 perangkat" },
    { title:"Sambungkan perangkat baru", desc:"Cari perangkat Bluetooth di sekitar", group:"Perangkat terhubung", nav:"pairNewDevice", keywords:"pair pairing bluetooth headset perangkat baru" },
    { title:"Preferensi koneksi", desc:"Bluetooth, NFC, Cast, pencetakan", group:"Perangkat terhubung", nav:"connectionPreferences", keywords:"koneksi nfc cast printing chromebook quick share android auto" },
    { title:"NFC", desc:"Komunikasi jarak dekat dan pembayaran", group:"Perangkat terhubung", nav:"nfcSettings", keywords:"nfc pembayaran tap" },
    { title:"Google Cast", desc:"Cast layar ke perangkat lain", group:"Perangkat terhubung", nav:"castSettings", keywords:"cast chromecast screen layar" },
    { title:"Pencetakan", desc:"Layanan cetak Android", group:"Perangkat terhubung", nav:"printingSettings", keywords:"printer printing cetak pencetakan" },
    { title:"Quick Share", desc:"Kirim dan terima file", group:"Perangkat terhubung", nav:"quickShareSettings", keywords:"quick share nearby share berbagi file" },
    { title:"Android Auto", desc:"Hubungkan ke layar kendaraan", group:"Perangkat terhubung", nav:"androidAutoSettings", keywords:"android auto mobil kendaraan" },

    { title:"Semua aplikasi", desc:"Lihat aplikasi yang terinstal", group:"Aplikasi", nav:"allApps", keywords:"apps aplikasi terinstal daftar aplikasi" },
    { title:"Aplikasi default", desc:"Browser, telepon, SMS dan asisten", group:"Aplikasi", nav:"defaultApps", keywords:"default browser chrome telepon sms asisten" },
    { title:"Aplikasi Clone", desc:"Gunakan dua akun aplikasi", group:"Aplikasi", nav:"cloneApps", keywords:"clone klon aplikasi dual app" },
    { title:"Ruang Game", desc:"Optimisasi permainan", group:"Aplikasi", nav:"gameSpace", keywords:"game ruang game gaming optimisasi" },
    { title:"Asisten", desc:"Google dan Asisten digital", group:"Aplikasi", nav:"assistantSettings", keywords:"assistant asisten google gemini" },
    { title:"Waktu pemakaian perangkat", desc:"Digital Wellbeing", group:"Aplikasi", nav:"digitalWellbeing", keywords:"digital wellbeing screen time waktu pemakaian" },
    { title:"Setelan media cloud", desc:"Google Foto dan pemilih media", group:"Aplikasi", nav:"mediaCloudSettings", keywords:"media cloud google foto photos" },
    { title:"Bilah Sisi", desc:"Panel samping aplikasi", group:"Aplikasi", nav:"sideBarSettings", keywords:"sidebar bilah sisi" },
    { title:"Penyimpanan kontak", desc:"Perangkat dan Google", group:"Aplikasi", nav:"contactStorageSettings", keywords:"kontak contacts storage penyimpanan" },
    { title:"Penggunaan baterai aplikasi", desc:"Atur konsumsi baterai per aplikasi", group:"Aplikasi", nav:"appBatteryUsage", keywords:"battery baterai aplikasi background" },
    { title:"Akses aplikasi khusus", desc:"Izin khusus Android", group:"Aplikasi", nav:"specialAppAccess", keywords:"izin permission akses khusus overlay picture in picture" },

    { title:"Notifikasi aplikasi", desc:"Kontrol notifikasi setiap aplikasi", group:"Notifikasi", nav:"notificationApps", keywords:"notification notifikasi aplikasi" },
    { title:"Histori notifikasi", desc:"Riwayat notifikasi", group:"Notifikasi", nav:"notificationHistory", keywords:"history histori riwayat notifikasi" },
    { title:"Percakapan", desc:"Notifikasi percakapan", group:"Notifikasi", nav:"notificationConversations", keywords:"conversation percakapan chat" },
    { title:"Balon", desc:"Bubble notification", group:"Notifikasi", nav:"notificationBubbles", keywords:"bubble bubbles balon notifikasi" },
    { title:"Akses notifikasi", desc:"Aplikasi yang dapat membaca notifikasi", group:"Notifikasi", nav:"notificationAccess", keywords:"akses notification listener baca notifikasi" },
    { title:"Notifikasi flash", desc:"Flash kamera dan layar", group:"Notifikasi", nav:"flashNotifications", keywords:"flash notification kamera layar kedip" },
    { title:"Peringatan darurat nirkabel", desc:"Emergency alerts", group:"Notifikasi", nav:"emergencyAlerts", keywords:"emergency darurat amber alert" },

    { title:"Baterai", desc:"Penggunaan dan penghemat baterai", group:"Baterai", nav:"batterySettings", keywords:"battery baterai persen charge" },
    { title:"Penggunaan baterai", desc:"Statistik penggunaan baterai", group:"Baterai", nav:"batteryUsage", keywords:"battery usage penggunaan baterai grafik" },
    { title:"Penghemat Baterai", desc:"Standar dan ekstrem", group:"Baterai", nav:"batterySaverSettings", keywords:"battery saver penghemat baterai extreme ekstrem" },
    { title:"Pengelola Baterai", desc:"Baterai Adaptif", group:"Baterai", nav:"batteryManagerSettings", keywords:"adaptive battery baterai adaptif manager" },
    { title:"Kontrol pengisian daya", desc:"Atur perilaku charging", group:"Baterai", nav:"chargingControl", keywords:"charging charge pengisian daya" },

    { title:"Penyimpanan", desc:"256 GB • aplikasi, video, gambar dan dokumen", group:"Penyimpanan", nav:"storageSettings", keywords:"storage penyimpanan 256 gb ruang memori file" },
    { title:"Pengelola penyimpanan", desc:"Kosongkan ruang secara otomatis", group:"Penyimpanan", nav:"storageSettings", keywords:"storage manager pengelola penyimpanan kosongkan ruang" },

    { title:"Wallpaper & gaya", desc:"Wallpaper, warna dan ikon", group:"Personalisasi", nav:"wallpaperStyle", keywords:"wallpaper style gaya warna ikon tema material" },
    { title:"Layar & sentuhan", desc:"Kecerahan, tema, refresh rate dan sentuhan", group:"Layar", nav:"displaySettings", keywords:"display layar touch sentuhan brightness kecerahan" },
    { title:"Kecerahan adaptif", desc:"Sesuaikan kecerahan otomatis", group:"Layar & sentuhan", nav:"adaptiveBrightnessSettings", keywords:"brightness adaptive kecerahan otomatis" },
    { title:"Ekstra redup", desc:"Kurangi kecerahan minimum", group:"Layar & sentuhan", nav:"extraDimSettings", keywords:"extra dim ekstra redup gelap" },
    { title:"Layar always-on", desc:"Always-on display", group:"Layar & sentuhan", nav:"alwaysOnSettings", keywords:"always on aod layar selalu aktif" },
    { title:"Layar mati", desc:"Waktu tunggu layar", group:"Layar & sentuhan", nav:"screenTimeoutSettings", keywords:"screen timeout layar mati waktu tunggu" },
    { title:"Tema gelap", desc:"Dark theme", group:"Layar & sentuhan", nav:"darkThemeSettings", keywords:"dark theme tema gelap malam" },
    { title:"Ukuran tampilan & teks", desc:"Ukuran font dan tampilan", group:"Layar & sentuhan", nav:"displaySizeText", keywords:"font text teks ukuran display scale" },
    { title:"Cahaya Malam", desc:"Night Light", group:"Layar & sentuhan", nav:"nightLightSettings", keywords:"night light cahaya malam blue light" },
    { title:"Kecepatan refresh layar", desc:"Refresh rate layar", group:"Layar & sentuhan", nav:"refreshRateSettings", keywords:"refresh rate hz 60 120 layar" },
    { title:"Potongan layar", desc:"Display cutout", group:"Layar & sentuhan", nav:"cutoutSettings", keywords:"cutout punch hole potongan layar" },
    { title:"Aplikasi layar penuh", desc:"Fullscreen per aplikasi", group:"Layar & sentuhan", nav:"fullscreenApps", keywords:"fullscreen full screen layar penuh" },
    { title:"Screensaver", desc:"Screen saver", group:"Layar & sentuhan", nav:"screensaverSettings", keywords:"screensaver screen saver" },

    { title:"Suara & getaran", desc:"Volume, ringtone dan haptik", group:"Suara", nav:"soundSettings", keywords:"sound suara volume vibration getaran ringtone" },
    { title:"Getaran & haptik", desc:"Kontrol intensitas getaran", group:"Suara & getaran", nav:"vibrationHaptics", keywords:"vibration haptic getaran haptik" },
    { title:"Nada dering", desc:"Pilih ringtone", group:"Suara & getaran", nav:"ringtonePicker", keywords:"ringtone nada dering telepon" },
    { title:"Live Caption", desc:"Teks otomatis untuk audio", group:"Suara & getaran", nav:"liveCaption", keywords:"live caption subtitle teks audio" },
    { title:"Now Playing", desc:"Kenali lagu di sekitar", group:"Suara & getaran", nav:"nowPlayingSettings", keywords:"now playing lagu musik song" },
    { title:"Dolby Atmos", desc:"Profil audio Dolby", group:"Suara & getaran", nav:"dolbyAtmos", keywords:"dolby atmos audio equalizer" },
    { title:"Equalizer", desc:"Atur karakter suara", group:"Dolby Atmos", nav:"equalizer", keywords:"equalizer eq bass treble audio" },

    { title:"Keamanan & privasi", desc:"Kunci layar dan sidik jari", group:"Keamanan", nav:"securityPrivacy", keywords:"security privacy keamanan privasi lock" },
    { title:"Buka kunci perangkat", desc:"PIN, pola, sidik jari dan wajah", group:"Keamanan & privasi", nav:"deviceUnlock", keywords:"unlock buka kunci pin pola fingerprint sidik jari wajah face" },
    { title:"Sidik jari", desc:"Daftarkan fingerprint", group:"Keamanan & privasi", nav:"fingerprintSettings", keywords:"fingerprint sidik jari biometric" },
    { title:"Kunci layar", desc:"PIN atau pola", group:"Keamanan & privasi", nav:"screenLockSettings", keywords:"screen lock kunci layar pin pola password" },

    { title:"Sistem", desc:"Bahasa, gestur dan navigasi", group:"Sistem", nav:"system", keywords:"system sistem language bahasa gesture gestur navigasi" },
    { title:"Bahasa & wilayah", desc:"Bahasa dan preferensi regional", group:"Sistem", nav:"languageRegion", keywords:"language bahasa region wilayah temperature suhu" },
    { title:"Mode navigasi", desc:"Gestur atau 3 tombol", group:"Sistem", nav:"navigationMode", keywords:"navigation navigasi gesture gestur 3 tombol button" },
    { title:"Opsi developer", desc:"Debugging, jaringan, input, gambar dan rendering", group:"Sistem", nav:"developerOptions", keywords:"developer options opsi developer debug usb adb wireless oem unlock animasi gpu" },
    { title:"Pembukaan kunci OEM", desc:"Izinkan bootloader untuk dibuka kuncinya", group:"Sistem › Opsi developer", nav:"developerOptions", keywords:"oem unlock unlocking bootloader fastboot" },
    { title:"Proses debug USB", desc:"Mode debug saat USB terhubung", group:"Sistem › Opsi developer", nav:"developerOptions", keywords:"usb debugging adb debug" },
    { title:"Proses debug nirkabel", desc:"Mode debug saat Wi-Fi terhubung", group:"Sistem › Opsi developer", nav:"developerWirelessDebugging", keywords:"wireless debugging debug nirkabel wifi adb" },
    { title:"Penggunaan memori", desc:"RAM sistem dan aplikasi", group:"Sistem › Opsi developer", nav:"developerMemory", keywords:"memory memori ram penggunaan" },
    { title:"Layanan yang sedang berjalan", desc:"Proses dan layanan aktif", group:"Sistem › Opsi developer", nav:"developerRunningServices", keywords:"running services layanan berjalan proses" },
    { title:"Navigasi gestur", desc:"Sensitivitas dan animasi kembali", group:"Sistem › Mode navigasi", nav:"gestureNavigation", keywords:"gesture navigation gestur back kembali sensitivity" },
    { title:"Navigasi 3 tombol", desc:"Urutan tombol Android", group:"Sistem › Mode navigasi", nav:"buttonNavigation", keywords:"3 button tombol back home recents" },

    { title:"Tentang ponsel", desc:"Google Pixel 10 • Android 17", group:"Sistem", nav:"about", keywords:"about phone tentang ponsel model frankel android version build kernel baseband" },
    { title:"Versi kernel", desc:"6.12.25 Android 16 GKI WaifuKernel Simulator", group:"Tentang ponsel", nav:"about", keywords:"kernel gki waifukernel 6.12.25 android16" },
    { title:"Versi pita basis", desc:"Informasi baseband simulator", group:"Tentang ponsel", nav:"about", keywords:"baseband pita basis modem" },
    { title:"Pembaruan keamanan", desc:"Patch keamanan Android", group:"Tentang ponsel", nav:"about", keywords:"security update patch keamanan vendor" }
  ];
  const ESIM_PROVIDERS = [
    { id: "telkomsel", name: "Telkomsel", short: "TSEL", color: "#e60012" },
    { id: "im3", name: "IM3", short: "IM3", color: "#f3aa00" },
    { id: "xl", name: "XL Axiata", short: "XL", color: "#1767b0" },
    { id: "tri", name: "Tri (3)", short: "3", color: "#25242d" },
    { id: "smartfren", name: "Smartfren", short: "SF", color: "#d90b73" }
  ];

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
    shadePanel: "quick",
    separateQs: true,
    shadeNotificationsCleared: false,
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
    homeAppOrder: ["instagram", "tiktok", "wa-business", "nekogram"],
    homeDockOrder: ["phone", "message", "chrome", "contacts", "camera"],
    homeWidgets: ["screen-time"],
    homeWidgetActive: 0,
    homeWidgetSide: "right",
    homeWidgetSizes: { "screen-time": "medium" },
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
    alarmEnabled: false,
    caffeine: false,
    locationEnabled: true,
    doNotDisturb: false,
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
    autoDateTime: true,
    autoTimeZone: true,
    manualTime: "20:30",
    regionDetectionStatus: "idle",
    regionDetected: false,
    regionManuallySelected: false,
    detectedTimeZone: "",

    /* Pixel Developer options */
    developerOptionsEnabled: true,
    oemUnlockAllowed: false,
    bootloaderUnlocked: false,
    devUsbDebugging: false,
    devWirelessDebugging: false,
    devDisableAdbTimeout: false,
    devVerboseVendorLogging: false,
    devViewAttributeInspection: false,
    devWaitForDebugger: false,
    devVerifyAppsUsb: true,
    devVerifyDebugBytecode: true,
    devGpuDebugLayers: false,
    devExperimentalAngle: false,
    devDisableDefaultFrameRate: true,
    devShowRefreshRate: false,
    devAllowOverlaySettings: false,
    devMockModem: false,
    devWirelessDisplayCertification: false,
    devWifiVerboseLogging: false,
    devWifiScanThrottling: true,
    devWifiNonPersistentMac: false,
    devCellularAlwaysActive: true,
    devHardwareTethering: true,
    devBluetoothUnnamed: false,
    devBluetoothA2dpOffload: false,
    devBluetoothHdAudio: false,
    devNfcVerboseLogging: false,
    devNfcNciVerboseLogging: false,
    devShowTaps: false,
    devPointerLocation: false,
    devShowButtonPresses: false,
    devTouchpadPointer: false,
    devSurfaceUpdates: false,
    devLayoutBounds: false,
    devForceRtl: false,
    devTransparentNavigation: false,
    devForceGpuRendering: false,
    devDisableHwOverlays: false,
    devWindowAnimationScale: "1.0x",
    devTransitionAnimationScale: "1.0x",
    devAnimatorDurationScale: "1.0x",
    devSecondaryDisplay: "Tidak ada",
    devSmallestWidth: 392,
    devDisplayCutout: "Default perangkat",
    devLoggerBuffer: "256 KB/buffer log",
    devUsbDefault: "Tidak ada transfer data",
    devUsbFileSharing: false,
    devUsbMidiActive: false,
    devUsbAndroidAutoActive: false,
    devUsbPtpActive: false,
    devWifiRandomMac: "02:16:3E:7A:9C:41",
    devBluetoothHciPackets: 0,
    devNfcLogEntries: 0,
    devAttributeInspectCount: 0,
    devAvrcpVersion: "AVRCP 1.5 (Default)",
    devMapVersion: "MAP 1.2 (Default)",
    devBluetoothCodec: "Gunakan Pilihan Sistem (Default)",
    devBluetoothSampleRate: "Gunakan Pilihan Sistem (Default)",
    devBluetoothBits: "Gunakan Pilihan Sistem (Default)",
    devBluetoothChannel: "Gunakan Pilihan Sistem (Default)",
    devBluetoothMaxDevices: "5",
    devTextCursorBlink: 5,
    devMemoryProfiling: false,
    devMemoryInterval: 3,
    devDebugApp: "",
    devUsbAuthorizationCount: 2,
    devFeaturePredictiveBack: true,
    devFeatureDesktopWindowing: false,
    devFeatureNewMediaControls: true,
    devShowStatusHud: false,
    devGraphicsDriver: "Default sistem",
    devAppCompatMode: "Default",
    devBugReportCount: 0,
    devSystemUiDemo: false,
    devStayAwake: false,
    devBluetoothHciSnoop: false,

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
    poweredOff: false,
    lockdownActive: false,
    bootloaderSelection: 0,
    recoveryPage: "main",
    recoveryMountSystem: false,
    recoveryReadOnly: true,
    connectedWifi: "Wifi Berbagi Rezeki_5G",
    mobileData: false,
    sim1Enabled: true,
    sim2Enabled: true,
    primaryCallSim: "ask",
    primarySmsSim: "sim1",
    primaryDataSim: "sim1",
    eSimInstalled: false,
    eSimEnabled: false,
    eSimProvider: "",
    eSimPhone: "",
    eSimIccid: "",
    eSimInstalling: false,
    simToolkitSelected: "sim1",
    simToolkitRoaming: { sim1: false, sim2: false, esim: false },
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
    screenLockPin: "2580",
    screenLockPattern: [0, 1, 2, 5],
    fingerprintEnrolled: false,
    fingerprintName: "Sidik jari 1",
    fingerprintEnrollProgress: 0,
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
    spotifyClientId: "",
    googleOAuthClientId: "",
    mediaEmbedUrl: "",
    spotifyEmbedUrl: "",
    spotifyLastUrl: "",
    youtubeEmbedUrl: "",
    youtubeLastUrl: "",
    youtubeMusicEmbedUrl: "",
    youtubeMusicLastUrl: "",
    translateDirection: "id-en",
    translateText: "",
    translateResult: "",
    simContacts: [],
    activeContact: 0,
    nekogramThread: -1,
    waThread: -1,
    pinterestPin: -1,
    tiktokIndex: 0,

    /* Pixel Camera simulator */
    cameraMode: "camera",
    cameraLens: "rear",
    cameraZoom: 1,
    cameraPanelOpen: false,
    cameraFlash: false,
    cameraResolution: "FHD",
    cameraFps: 30,
    cameraVideoMode: "normal",
    cameraLocation: true,
    cameraLensSuggestions: true,
    cameraSocialShare: false,
    cameraFramingHints: true,
    cameraGrid: "Tanpa petak",
    cameraExposure: true,
    cameraFullResolution: true,
    cameraMirrorSelfie: false,
    cameraStabilization: true
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
      securityUpdate: "Pembaruan keamanan", vendorSecurityPatch: "Tingkat patch keamanan vendor", basebandVersion: "Versi pita basis", kernelVersion: "Versi kernel", buildDate: "Tanggal pembuatan", appList: "Daftar aplikasi", homeSettings: "Setelan layar utama", widgets: "Widget",
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
      securityUpdate: "Security update", vendorSecurityPatch: "Vendor security patch level", basebandVersion: "Baseband version", kernelVersion: "Kernel version", buildDate: "Build date", appList: "App list", homeSettings: "Home settings", widgets: "Widgets",
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
  {
    const languageHint = state.deviceLanguage === "en" ? "en" :
      state.deviceLanguage === "id" ? "id" :
      (document.documentElement.lang?.toLowerCase().startsWith("en") ? "en" : "id");
    if (languageHint === "id" && state.region === "United States" &&
        !state.regionManuallySelected && !state.regionDetected) {
      state.region = "Indonesia";
    }
  }
  if (!state.simPhone1) state.simPhone1 = makeRandomIndoNumber();
  if (!state.simPhone2) state.simPhone2 = makeRandomIndoNumber();
  if (state.sideKeyConfigured && !state.fingerprintEnrolled) state.fingerprintEnrolled = true;
  if (!Array.isArray(state.screenLockPattern) || state.screenLockPattern.length < 4) state.screenLockPattern = [0, 1, 2, 5];
  if (!state.screenLockPin || String(state.screenLockPin).length < 4) state.screenLockPin = "2580";
  if (!Array.isArray(state.simContacts) || !state.simContacts.length) state.simContacts = makeSimContacts();
  {
    const validApps = new Set(SIM_APPS.map(app => app.id));
    const normalize = (value, fallback, count) => {
      const out=[];
      for(const id of Array.isArray(value)?value:[]) if(validApps.has(id)&&!out.includes(id)) out.push(id);
      for(const id of fallback) if(validApps.has(id)&&!out.includes(id)) out.push(id);
      return out.slice(0,count);
    };
    state.homeAppOrder=normalize(state.homeAppOrder,["instagram","tiktok","wa-business","nekogram"],4);
    state.homeDockOrder=normalize(state.homeDockOrder,["phone","message","chrome","contacts","camera"],5);
    const validWidgets=new Set(["screen-time","at-a-glance","clock","weather","battery","calendar","photos","contacts"]);
    state.homeWidgets=(Array.isArray(state.homeWidgets)?state.homeWidgets:["screen-time"]).filter((id,i,a)=>validWidgets.has(id)&&a.indexOf(id)===i);
    if(!state.homeWidgets.length) state.homeWidgets=["screen-time"];
    state.homeWidgetActive=Math.max(0,Math.min(state.homeWidgets.length-1,Number(state.homeWidgetActive)||0));
    state.homeWidgetSide=state.homeWidgetSide==="left"?"left":"right";
    state.homeWidgetSizes=state.homeWidgetSizes&&typeof state.homeWidgetSizes==="object"?state.homeWidgetSizes:{};
    for(const id of state.homeWidgets) if(!["small","medium","large"].includes(state.homeWidgetSizes[id])) state.homeWidgetSizes[id]=(id==="battery"||id==="contacts")?"small":"medium";
  }
  localStorage.setItem(STORE, JSON.stringify(state));
  let longPressTimer = null;
  let homeEditMode = false;
  let homeDragState = null;
  let toastTimer = null;
  let volumeTimer = null;

  function save() { localStorage.setItem(STORE, JSON.stringify(state)); }

  const simulatorUsageFallbackStart = Date.now();
  function currentUsageSeconds() {
    try {
      const external = window.WaifuUsageTracker?.getSeconds?.();
      if (Number.isFinite(Number(external))) return Math.max(0, Number(external));
    } catch {}
    return Math.max(0, Math.floor((Date.now() - simulatorUsageFallbackStart) / 1000));
  }
  function formatUsageDuration(seconds = currentUsageSeconds()) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    if (getLanguage() === "en") {
      if (hours > 0) return `${hours} h, ${minutes} min`;
      return `${minutes} min`;
    }
    if (hours > 0) return `${hours} j, ${minutes} mnt`;
    return `${minutes} mnt`;
  }

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
    if (!state.autoDateTime && /^\d{2}:\d{2}$/.test(String(state.manualTime || ""))) {
      return String(state.manualTime).replace(":", ".");
    }
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

  function parseSystemBarColor(value) {
    const match = String(value || "").match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?/i);
    if (!match) return null;
    return { r:Number(match[1]), g:Number(match[2]), b:Number(match[3]), a:match[4]==null?1:Number(match[4]) };
  }
  function systemBarLuminance(color) {
    if (!color) return .5;
    const linear = value => {
      const c = Math.max(0, Math.min(255, value)) / 255;
      return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
    };
    return .2126*linear(color.r)+.7152*linear(color.g)+.0722*linear(color.b);
  }
  function setSystemBarContrast(topLuma, bottomLuma=topLuma) {
    const topDark = Number(topLuma) > .52;
    const bottomDark = Number(bottomLuma) > .52;
    phone.style.setProperty("--system-status-fg", topDark ? "#17171b" : "#ffffff");
    phone.style.setProperty("--system-status-shadow", topDark ? "rgba(255,255,255,.16)" : "rgba(0,0,0,.52)");
    phone.style.setProperty("--system-battery-bg", topDark ? "rgba(30,30,35,.92)" : "rgba(255,255,255,.94)");
    phone.style.setProperty("--system-battery-fg", topDark ? "#ffffff" : "#17171b");
    phone.style.setProperty("--system-nav-fg", bottomDark ? "#17171b" : "#ffffff");
    phone.style.setProperty("--system-nav-shadow", bottomDark ? "rgba(255,255,255,.16)" : "rgba(0,0,0,.52)");
    phone.classList.toggle("system-status-dark-icons", topDark);
    phone.classList.toggle("system-status-light-icons", !topDark);
    phone.classList.toggle("system-nav-dark-icons", bottomDark);
    phone.classList.toggle("system-nav-light-icons", !bottomDark);
  }
  function solidSystemSurfaceLuminance(element, fallback=.9) {
    let current=element;
    while(current && current!==phone){
      const color=parseSystemBarColor(getComputedStyle(current).backgroundColor);
      if(color && color.a>.72) return systemBarLuminance(color);
      current=current.parentElement;
    }
    return fallback;
  }
  function sampleWallpaperSystemBars(src) {
    const token=++systemBarContrastToken;
    const image=new Image();
    image.decoding="async";
    image.onload=()=>{
      if(token!==systemBarContrastToken)return;
      try{
        const canvas=document.createElement("canvas");
        canvas.width=18; canvas.height=36;
        const ctx=canvas.getContext("2d",{willReadFrequently:true});
        ctx.drawImage(image,0,0,canvas.width,canvas.height);
        const sample=(from,to)=>{
          const y1=Math.floor(from*canvas.height), y2=Math.ceil(to*canvas.height);
          const data=ctx.getImageData(0,y1,canvas.width,Math.max(1,y2-y1)).data;
          let r=0,g=0,b=0,count=0;
          for(let i=0;i<data.length;i+=4){
            if(data[i+3]<80)continue;
            r+=data[i];g+=data[i+1];b+=data[i+2];count++;
          }
          return count?systemBarLuminance({r:r/count,g:g/count,b:b/count,a:1}):.5;
        };
        setSystemBarContrast(sample(0,.14),sample(.86,1));
      }catch{setSystemBarContrast(.35,.35)}
    };
    image.onerror=()=>token===systemBarContrastToken&&setSystemBarContrast(.35,.35);
    image.src=src;
  }
  function syncDynamicSystemBars() {
    if(state.screenOff||state.poweredOff)return;
    if(state.view==="home"){sampleWallpaperSystemBars(wallpaperById(state.homeWallpaper).src);return}
    if(state.view==="lock"){sampleWallpaperSystemBars(wallpaperById(state.lockWallpaper).src);return}
    if(state.view==="apps"){
      /* App drawer keeps wallpaper at the status area while the sheet occupies the bottom. */
      const token=++systemBarContrastToken;
      const image=new Image();
      image.onload=()=>{
        if(token!==systemBarContrastToken)return;
        try{
          const canvas=document.createElement("canvas");canvas.width=16;canvas.height=16;
          const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(image,0,0,16,16);
          const data=ctx.getImageData(0,0,16,4).data;let r=0,g=0,b=0,c=0;
          for(let i=0;i<data.length;i+=4){r+=data[i];g+=data[i+1];b+=data[i+2];c++}
          setSystemBarContrast(systemBarLuminance({r:r/c,g:g/c,b:b/c,a:1}),state.dark?.12:.91);
        }catch{setSystemBarContrast(.35,state.dark?.12:.91)}
      };
      image.src=wallpaperById(state.homeWallpaper).src;
      return;
    }
    if(["camera","boot","recovery","bootloader"].includes(state.view)){setSystemBarContrast(.08,.08);return}
    if(state.view==="simApp"&&["youtube","youtube-music","spotify","bcr"].includes(state.activeSimApp)){setSystemBarContrast(.08,.08);return}
    const page=root.querySelector(".a17-page,.camera-pro-page,.youtube-live-app,.spotify-live-app,.recovery-screen,.bootloader-screen");
    const fallback=state.dark?.12:.91;
    const top=solidSystemSurfaceLuminance(page,fallback);
    const rect=phone.getBoundingClientRect();
    const hit=document.elementFromPoint(rect.left+rect.width/2,rect.bottom-18);
    const bottom=solidSystemSurfaceLuminance(hit&&phone.contains(hit)?hit:page,top);
    setSystemBarContrast(top,bottom);
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
    const devActive = !!state.developerOptionsEnabled;
    phone.classList.toggle("developer-show-layout-bounds", devActive && !!state.devLayoutBounds);
    phone.classList.toggle("developer-force-rtl", devActive && !!state.devForceRtl);
    phone.classList.toggle("developer-transparent-navigation", devActive && !!state.devTransparentNavigation);
    phone.classList.toggle("developer-show-refresh-rate", devActive && !!state.devShowRefreshRate);
    phone.classList.toggle("developer-force-gpu", devActive && !!state.devForceGpuRendering);
    phone.classList.toggle("developer-disable-hw-overlays", devActive && !!state.devDisableHwOverlays);
    phone.classList.toggle("developer-angle", devActive && !!state.devExperimentalAngle);
    phone.classList.toggle("developer-surface-updates", devActive && !!state.devSurfaceUpdates);
    phone.classList.toggle("developer-pointer-location", devActive && !!state.devPointerLocation);
    const scaleValue=v=>v==="Animasi nonaktif"?0:(Number.parseFloat(String(v))||1);
    phone.style.setProperty("--dev-window-scale",String(scaleValue(state.devWindowAnimationScale)));
    phone.style.setProperty("--dev-transition-scale",String(scaleValue(state.devTransitionAnimationScale)));
    phone.style.setProperty("--dev-animator-scale",String(scaleValue(state.devAnimatorDurationScale)));
    const density=Math.max(.84,Math.min(1.16,392/Math.max(320,Number(state.devSmallestWidth)||392)));
    phone.style.setProperty("--dev-density-scale",String(density));
    phone.classList.toggle("developer-custom-density",devActive&&Math.abs(density-1)>.015);
    const cutoutMap={"Render aplikasi di bawah area potongan":"developer-cutout-under","Potongan sudut":"developer-cutout-corner","Potongan ganda":"developer-cutout-double","Potongan Lubang Kertas":"developer-cutout-hole","Sembunyikan":"developer-cutout-hidden","Potongan tinggi":"developer-cutout-tall","Potongan waterfall":"developer-cutout-waterfall"};
    ["developer-cutout-under","developer-cutout-corner","developer-cutout-double","developer-cutout-hole","developer-cutout-hidden","developer-cutout-tall","developer-cutout-waterfall"].forEach(cls=>phone.classList.remove(cls));
    if(devActive&&cutoutMap[state.devDisplayCutout])phone.classList.add(cutoutMap[state.devDisplayCutout]);
    const androidSystemMode = state.poweredOff
      ? "power-off"
      : (["boot", "recovery", "bootloader"].includes(state.view) ? state.view : "");
    phone.classList.toggle("android-special-boot", !!androidSystemMode);
    if (androidSystemMode) phone.dataset.androidSystemMode = androidSystemMode;
    else phone.removeAttribute("data-android-system-mode");
    phone.style.opacity = String(0.68 + state.brightness / 312);

    const timeEl = $("#androidStatusTime");
    const batteryEl = $("#androidBatteryText");
    const wifiEl = $("#androidWifiIcon");
    const signalEl = $("#androidSignalIcon");
    if (timeEl) timeEl.textContent = devActive&&state.devSystemUiDemo?"10.00":formatTime();
    if (batteryEl) batteryEl.textContent = devActive&&state.devSystemUiDemo?"100":state.battery;
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

  let lockAuthVisible = false;
  let lockPinAttempt = "";
  let pinEnrollStage = "new";
  let pinEnrollBuffer = "";
  let pinEnrollFirst = "";
  let patternEnrollStage = "new";
  let patternEnrollFirst = [];
  let activePattern = [];
  let easterLoopToken = 0;
  let spaceGameLoopToken = 0;
  let android16AutoPilot = false;
  let settingsSearchQuery = "";
  let developerDialog = "";
  let developerPointerLast = { x: 0, y: 0, type: "mouse" };
  let developerDebuggerAttachedApp = "";
  let systemBarContrastToken = 0;

  /* Financial-app biometric session.
   * Kept outside localStorage so DIGI/BRImo/DANA/OVO request a fingerprint
   * again the next time the user leaves and re-opens the app. */
  let financialAuthSession = "";
  let financialAuthBusy = false;

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
    if (
      state.view === "simApp" &&
      view !== "simApp" &&
      ["brimo", "digi-bank", "dana", "ovo"].includes(state.activeSimApp)
    ) {
      financialAuthSession = "";
      financialAuthBusy = false;
    }
    if (keepPrevious && state.view !== view) state.previous = state.view;
    state.view = view;
    state.longPressMenu = false;
    state.shade = false;
    save();
    render();
  }

  /*
   * Public simulator navigation bridge.
   * Dynamic Island lives outside #androidScreenRoot, so it must not depend on
   * finding a launcher icon in the currently rendered screen. Open the app
   * through the same simulator state/navigation path used by launcher icons.
   */
  function openSimAppDirect(appId) {
    const id = String(appId || "").trim();
    if (!id || !SIM_APPS.some(app => app.id === id)) return false;

    if (["brimo", "digi-bank", "dana", "ovo"].includes(id)) {
      financialAuthSession = "";
      financialAuthBusy = false;
    }

    state.activeSimApp = id;
    state.recentSimApps = [
      id,
      ...(state.recentSimApps || []).filter(existingId => existingId !== id)
    ].slice(0, 8);

    save();
    vibrate(6);
    navigate("simApp");
    return true;
  }

  window.__waifuAndroidSimOpenApp = openSimAppDirect;

  function goBack() {
    if (state.shade) {
      state.shade = false;
      render();
      return;
    }
    const parent = {
      wallpaperStyle: "home", color: "wallpaperStyle", icons: "wallpaperStyle", layout: "wallpaperStyle",
      clock: "wallpaperStyle", shortcuts: "wallpaperStyle", notifications: "wallpaperStyle", lockMore: "wallpaperStyle",
      wallpaperPicker: "wallpaperStyle", settings: "home", about: "settings", apps: "home", camera: "home", cameraSettings: "camera",
      homeSettings: "home", widgetPicker: "home", system: "settings", languageRegion: "system", navigationMode: "system",
      developerOptions: "system", developerMemory: "developerOptions", developerRunningServices: "developerOptions",
      developerWirelessDebugging: "developerOptions", developerSelectDebugApp: "developerOptions",
      gestureNavigation: "navigationMode", buttonNavigation: "navigationMode", recents: "home",

      networkInternet: "settings", internetSettings: "networkInternet", simSettings: "networkInternet",
      eSimSetup: "simSettings", eSimConfirm: "eSimSetup",
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

      securityPrivacy: "settings", deviceUnlock: "securityPrivacy", fingerprintSettings: "deviceUnlock", fingerprintEnroll: "fingerprintSettings",
      screenLockSettings: "deviceUnlock", pinEnroll: "screenLockSettings", patternEnroll: "screenLockSettings",
      androidEasterEgg: "about", android16Game: "androidEasterEgg",
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

  const HOME_WIDGET_CATALOG = [
    {id:"at-a-glance",provider:"Google",name:"Sekilas Info",size:"4 × 2",desc:"Tanggal, cuaca, dan agenda Pixel."},
    {id:"clock",provider:"Jam",name:"Jam Digital",size:"2 × 2",desc:"Jam Material You."},
    {id:"weather",provider:"Cuaca",name:"Cuaca",size:"2 × 2",desc:"Suhu dan kondisi hari ini."},
    {id:"battery",provider:"Setelan",name:"Baterai",size:"2 × 1",desc:"Baterai Pixel dan perangkat tersambung."},
    {id:"calendar",provider:"Kalender",name:"Kalender",size:"2 × 2",desc:"Tanggal dan agenda berikutnya."},
    {id:"screen-time",provider:"Digital Wellbeing",name:"Waktu pemakaian perangkat",size:"2 × 2",desc:"Durasi penggunaan simulator."},
    {id:"photos",provider:"Google Foto",name:"Kenangan",size:"2 × 2",desc:"Foto dari wallpaper aktif."},
    {id:"contacts",provider:"Kontak",name:"Kontak favorit",size:"2 × 1",desc:"Pintasan kontak favorit."}
  ];
  function homeWidgetDefinition(id){return HOME_WIDGET_CATALOG.find(w=>w.id===id)||HOME_WIDGET_CATALOG[0]}
  function currentHomeWidgetId(){if(!state.homeWidgets?.length)return"screen-time";return state.homeWidgets[Math.max(0,Math.min(state.homeWidgets.length-1,Number(state.homeWidgetActive)||0))]}
  function homeWidgetSize(id=currentHomeWidgetId()){const v=state.homeWidgetSizes?.[id];return["small","medium","large"].includes(v)?v:"medium"}
  function cycleHomeWidgetSize(direction){const id=currentHomeWidgetId(),sizes=["small","medium","large"],i=sizes.indexOf(homeWidgetSize(id)),next=sizes[(i+direction+sizes.length)%sizes.length];state.homeWidgetSizes={...(state.homeWidgetSizes||{}),[id]:next};save();return next}
  function homeWidgetTarget(id){
    return ({
      "screen-time":"nav:digitalWellbeing",
      "at-a-glance":"app:weather",
      "clock":"app:clock",
      "weather":"app:weather",
      "battery":"nav:batterySettings",
      "calendar":"app:calendar",
      "photos":"app:photos",
      "contacts":"app:contacts"
    })[id] || "";
  }

  function homeWidgetActionAttributes(id) {
    const target = homeWidgetTarget(id);
    if (!target) return "";
    if (target.startsWith("nav:")) {
      return `data-nav="${target.slice(4)}"`;
    }
    if (target.startsWith("app:")) {
      return `data-open-app="${target.slice(4)}"`;
    }
    return "";
  }
  function renderHomeWidgetBody(id,preview=false){
    const now=new Date(),locale=getLanguage()==="en"?"en-US":"id-ID",date=new Intl.DateTimeFormat(locale,{weekday:"short",day:"numeric",month:"short"}).format(now),month=new Intl.DateTimeFormat(locale,{month:"short"}).format(now);
    if(id==="at-a-glance")return`<div class="pixel-widget widget-at-a-glance"><b>G</b><div><strong>${escapeHtml(date)}</strong><small>26°C • Sebagian cerah</small></div><i>☀</i></div>`;
    if(id==="clock")return`<div class="pixel-widget widget-clock"><strong>${escapeHtml(formatTime().replace(".",":"))}</strong><small>${escapeHtml(date)}</small></div>`;
    if(id==="weather")return`<div class="pixel-widget widget-weather"><i>☀</i><div><strong>26°</strong><span>Sebagian cerah</span><small>32° / 24°</small></div></div>`;
    if(id==="battery")return`<div class="pixel-widget widget-battery"><b>▰</b><div><strong>${state.battery}%</strong><small>Google Pixel 10</small></div><i style="--battery:${state.battery}%"></i></div>`;
    if(id==="calendar")return`<div class="pixel-widget widget-calendar"><b><span>${escapeHtml(month)}</span>${now.getDate()}</b><div><strong>Tidak ada acara</strong><small>Buka Kalender</small></div></div>`;
    if(id==="photos")return`<div class="pixel-widget widget-photos" style="--photo:url('${wallpaperById(state.homeWallpaper).src}')"><i></i><strong>Kenangan hari ini</strong></div>`;
    if(id==="contacts")return`<div class="pixel-widget widget-contacts"><b>S</b><div><strong>Skenakun</strong><small>Kontak favorit</small></div><i>☎</i></div>`;
    return`<div class="pixel-widget widget-screen-time"><span>Waktu pemakaian<br>perangkat</span><i>◔</i><strong${preview?"":' id="homeUsageTime"'}>${formatUsageDuration()}</strong></div>`;
  }
  function renderHomeWidgetStack(){
    const id=currentHomeWidgetId(),size=homeWidgetSize(id);
    return`<div class="record-home-widget-stack widget-size-${size} ${homeEditMode?"home-edit-draggable":""}" data-home-widget-zone="1"><button class="record-home-widget-card ${homeEditMode?"is-editing":""}" type="button" ${!homeEditMode ? homeWidgetActionAttributes(id) : ""}>${renderHomeWidgetBody(id)}</button>${state.homeWidgets.length>1?`<div class="home-widget-pager">${state.homeWidgets.map((x,i)=>`<button type="button" class="${i===Number(state.homeWidgetActive)?"active":""}" data-home-widget-index="${i}"></button>`).join("")}</div>`:""}${homeEditMode?`<div class="home-widget-edit-tools"><button data-action="home-widget-size-down">−</button><span>${size==="small"?"Kecil":size==="large"?"Besar":"Sedang"}</span><button data-action="home-widget-size-up">＋</button><button data-action="home-widget-move-side">⇄</button><button class="danger" data-action="home-widget-remove">×</button></div>`:""}</div>`;
  }
  function addHomeWidget(id){if(!HOME_WIDGET_CATALOG.some(w=>w.id===id))return;state.homeWidgets=[...(state.homeWidgets||[])];const old=state.homeWidgets.indexOf(id);if(old>=0)state.homeWidgetActive=old;else{state.homeWidgets.push(id);state.homeWidgetActive=state.homeWidgets.length-1}state.homeWidgetSizes={...(state.homeWidgetSizes||{}),[id]:state.homeWidgetSizes?.[id]||((id==="battery"||id==="contacts")?"small":"medium")};state.longPressMenu=false;save()}
  function renderWidgetPicker(){const installed=new Set(state.homeWidgets||[]),providers=[...new Set(HOME_WIDGET_CATALOG.map(w=>w.provider))];root.innerHTML=`<div class="a17-page system-page widget-picker-page">${topbar("Widget")}<div class="widget-picker-hero"><span>▦</span><div><strong>Tambahkan widget</strong><small>Widget simulasi bergaya Android 16/17.</small></div></div>${providers.map(provider=>`<section class="widget-provider-section"><div class="widget-provider-title">${escapeHtml(provider)}</div><div class="widget-picker-grid">${HOME_WIDGET_CATALOG.filter(w=>w.provider===provider).map(w=>`<article class="widget-picker-card ${installed.has(w.id)?"installed":""}"><div class="widget-picker-preview">${renderHomeWidgetBody(w.id,true)}</div><div class="widget-picker-copy"><strong>${escapeHtml(w.name)}</strong><span>${escapeHtml(w.size)} • ${escapeHtml(w.desc)}</span></div><button type="button" data-add-home-widget="${w.id}">${installed.has(w.id)?"Tampilkan":"Tambahkan"}</button></article>`).join("")}</div></section>`).join("")}<div class="system-note">ⓘ <span>Tahan aplikasi atau widget di layar utama untuk masuk mode edit, memindahkan posisi, atau mengubah ukuran widget.</span></div></div>`}

  function renderHome() {
    const homeApps=(state.homeAppOrder||[]).map(appById),dockApps=(state.homeDockOrder||[]).map(appById),now=new Date(),locale=getLanguage()==="en"?"en-US":"id-ID",dayLabel=new Intl.DateTimeFormat(locale,{weekday:"short",day:"numeric",month:"short"}).format(now);
    const appButton=(app,cls,zone,index)=>`<button class="${cls} ${homeEditMode?"home-edit-draggable":""}" type="button" data-home-slot="${zone}:${index}" data-home-app-id="${app.id}" ${homeEditMode?"":`data-open-app="${app.id}"`}><span class="record-home-icon drawer-app-icon tone-${app.tone}">${app.glyph}</span><small>${escapeHtml(app.name==="WA Business"?"WA Busin...":app.name)}</small>${homeEditMode?`<i class="home-edit-grip">⋮⋮</i>`:""}</button>`;
    root.innerHTML=`<div class="a17-page home-page record-home-page ${homeEditMode?"home-layout-editing":""}" id="homePressSurface"><div class="home-wall"></div><div class="record-home-scrim"></div><div class="home-content record-home-content"><div class="record-home-weather"><strong>${escapeHtml(dayLabel)} <span>• 26°C</span></strong><small>Hari ini 32°C / 24°C • Sebagian cerah</small></div><div class="record-home-spacer"></div><div class="record-home-main home-widget-side-${state.homeWidgetSide==="left"?"left":"right"}"><div class="record-home-apps" data-home-zone="main">${homeApps.map((a,i)=>appButton(a,"home-app","main",i)).join("")}</div>${renderHomeWidgetStack()}</div><div class="home-dock record-home-dock" data-home-zone="dock">${dockApps.map((a,i)=>appButton(a,"record-dock-app","dock",i)).join("")}</div><button class="home-search record-home-search" type="button" ${homeEditMode?"":'data-open-app="google"'}><b>G</b><span>Telusuri</span><i>⌕ &nbsp; 🎙 &nbsp; ◉</i></button><div class="record-home-gesture-hint"></div></div>${homeEditMode?`<div class="home-edit-toolbar"><button data-action="home-edit-reset">Reset</button><span><b>Edit layar utama</b><small>Geser aplikasi/widget</small></span><button class="primary" data-action="home-edit-done">Selesai</button></div>`:""}${state.longPressMenu&&!homeEditMode?renderLongPressMenu():""}</div>`;
    if(!homeEditMode&&!state.longPressMenu){const surface=$("#homePressSurface");let sx=null,sy=null,moved=false,pointer=null;surface?.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.button!==0)return;if(e.target.closest("button"))return;sx=e.clientX;sy=e.clientY;moved=false;pointer=e.pointerId;try{surface.setPointerCapture(e.pointerId)}catch{}clearTimeout(longPressTimer);longPressTimer=setTimeout(()=>{if(moved)return;state.longPressMenu=true;vibrate(12);render()},520)});surface?.addEventListener("pointermove",e=>{if(sx==null)return;if(Math.abs(e.clientX-sx)>12||Math.abs(e.clientY-sy)>12){moved=true;clearTimeout(longPressTimer)}});const finish=()=>{clearTimeout(longPressTimer);try{if(pointer!=null&&surface.hasPointerCapture?.(pointer))surface.releasePointerCapture(pointer)}catch{}sx=sy=null;pointer=null};surface?.addEventListener("pointerup",finish);surface?.addEventListener("pointercancel",finish)}
    bindHomeLayoutEditing();
  }
  function swapHomeAppSlots(sourceSlot,targetSlot){const parse=slot=>{const[zone,index]=String(slot).split(":");return{zone,index:Number(index)}};const a=parse(sourceSlot),b=parse(targetSlot);if(!["main","dock"].includes(a.zone)||!["main","dock"].includes(b.zone))return;const main=[...state.homeAppOrder],dock=[...state.homeDockOrder],list=z=>z==="main"?main:dock,la=list(a.zone),lb=list(b.zone),x=la[a.index],y=lb[b.index];if(!x||!y)return;la[a.index]=y;lb[b.index]=x;state.homeAppOrder=main;state.homeDockOrder=dock;save();vibrate(6);render()}
  function bindHomeLayoutEditing(){const items=$$("[data-home-slot]",root),widget=$("[data-home-widget-zone]",root);if(!homeEditMode){[...items,widget].filter(Boolean).forEach(el=>{let timer=null,sx=0,sy=0;el.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.button!==0)return;sx=e.clientX;sy=e.clientY;timer=setTimeout(()=>{homeEditMode=true;state.longPressMenu=false;vibrate([8,25,8]);render()},480)});el.addEventListener("pointermove",e=>{if(Math.abs(e.clientX-sx)>10||Math.abs(e.clientY-sy)>10)clearTimeout(timer)});["pointerup","pointercancel","pointerleave"].forEach(t=>el.addEventListener(t,()=>clearTimeout(timer)))});return}const begin=(e,el)=>{if(e.pointerType==="mouse"&&e.button!==0)return;if(e.target.closest(".home-widget-edit-tools"))return;homeDragState={el,pointerId:e.pointerId,x:e.clientX,y:e.clientY,moved:false};el.classList.add("home-edit-dragging");try{el.setPointerCapture(e.pointerId)}catch{}e.preventDefault()},move=e=>{if(!homeDragState)return;const dx=e.clientX-homeDragState.x,dy=e.clientY-homeDragState.y;if(Math.abs(dx)>6||Math.abs(dy)>6)homeDragState.moved=true;homeDragState.el.style.setProperty("--drag-x",`${dx}px`);homeDragState.el.style.setProperty("--drag-y",`${dy}px`)},finish=e=>{if(!homeDragState)return;const source=homeDragState.el;source.classList.remove("home-edit-dragging");source.style.removeProperty("--drag-x");source.style.removeProperty("--drag-y");if(homeDragState.moved){const hit=document.elementFromPoint(e.clientX,e.clientY),target=hit?.closest?.("[data-home-slot]"),targetWidget=hit?.closest?.("[data-home-widget-zone]"),targetZone=hit?.closest?.("[data-home-zone]");if(source.matches("[data-home-slot]")&&target&&source!==target)swapHomeAppSlots(source.dataset.homeSlot,target.dataset.homeSlot);else if(source.matches("[data-home-slot]")&&targetWidget){state.homeWidgetSide=state.homeWidgetSide==="left"?"right":"left";save();render()}else if(source.matches("[data-home-widget-zone]")&&(target||targetZone)){state.homeWidgetSide=state.homeWidgetSide==="left"?"right":"left";save();render()}}homeDragState=null};[...items,widget].filter(Boolean).forEach(el=>{el.addEventListener("pointerdown",e=>begin(e,el));el.addEventListener("pointermove",move);el.addEventListener("pointerup",finish);el.addEventListener("pointercancel",finish)})}

  function renderLongPressMenu() {
    const picks = [state.homeWallpaper, "waifu-13", "waifu-20", "waifu-26"];
    return `<div class="home-menu-shade" data-action="dismissMenu"></div>
      <div class="home-longpress-menu">
        <div class="home-wall-strip">${picks.map(id => `<button class="home-wall-thumb ${id === state.homeWallpaper ? "active" : ""}" type="button" data-home-quick-wall="${id}" style="background-image:url('${wallpaperById(id).src}')"></button>`).join("")}</div>
        <button class="home-menu-item" type="button" data-action="openStyle"><span>◉</span><span>${t("style")}</span></button>
        <button class="home-menu-item" type="button" data-nav="widgetPicker"><span>▦</span><span>${t("widgets")}</span></button>
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
    root.innerHTML=`<div class="a17-page wallstyle-page">${topbar(t("homeSettings"))}<div class="a17-card home-settings-actions"><button class="a17-row" type="button" data-action="openHomeLayoutEditor"><span class="a17-copy"><strong>Edit tata letak layar utama</strong><span>Pindahkan aplikasi dan ubah ukuran widget</span></span><span class="a17-chevron">›</span></button><button class="a17-row" type="button" data-nav="widgetPicker"><span class="a17-copy"><strong>Widget</strong><span>${state.homeWidgets.length} widget ditambahkan</span></span><span class="a17-chevron">›</span></button></div><div class="a17-section">Kisi daftar aplikasi</div><div class="a17-card home-grid-settings">${[4,5,6].map(c=>row({title:`${t("layout")}: ${c} kolom`,desc:state.homeCols===c?"Aktif":"",trailing:`<span class="a17-trailing">${state.homeCols===c?"✓":layoutDots(Math.min(c,5))}</span>`})).join("")}</div></div>`;
    $$(".home-grid-settings .a17-row",root).forEach((b,i)=>b.addEventListener("click",()=>{state.homeCols=[4,5,6][i];state.layoutDraft=state.homeCols;save();render()}));
  }

  function normalizeSettingsSearch(value = "") {
    return String(value)
      .toLocaleLowerCase("id-ID")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function matchingSettings(query) {
    const normalized = normalizeSettingsSearch(query);
    if (!normalized) return [];

    const tokens = normalized.split(/\s+/).filter(Boolean);
    return SETTINGS_SEARCH_INDEX
      .map((item, index) => {
        const haystack = normalizeSettingsSearch(
          `${item.title} ${item.desc || ""} ${item.group || ""} ${item.keywords || ""}`
        );
        if (!tokens.every(token => haystack.includes(token))) return null;

        let score = 0;
        const title = normalizeSettingsSearch(item.title);
        const group = normalizeSettingsSearch(item.group || "");
        if (title === normalized) score += 120;
        if (title.startsWith(normalized)) score += 80;
        if (title.includes(normalized)) score += 55;
        if (group.includes(normalized)) score += 20;
        tokens.forEach(token => {
          if (title.startsWith(token)) score += 16;
          else if (title.includes(token)) score += 9;
          if (haystack.includes(token)) score += 3;
        });
        return { ...item, score, index };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, 18);
  }

  function updateSettingsSearchUi(query = settingsSearchQuery) {
    settingsSearchQuery = String(query || "");
    const input = $("#settingsSearchInput", root);
    const clear = $("#settingsSearchClear", root);
    const mainRows = $("#settingsMainRows", root);
    const resultBox = $("#settingsSearchResults", root);
    if (!resultBox || !mainRows) return;

    const normalized = normalizeSettingsSearch(settingsSearchQuery);
    if (input && input.value !== settingsSearchQuery) input.value = settingsSearchQuery;
    if (clear) clear.hidden = !normalized;

    if (!normalized) {
      resultBox.hidden = true;
      resultBox.innerHTML = "";
      mainRows.hidden = false;
      return;
    }

    const results = matchingSettings(settingsSearchQuery);
    mainRows.hidden = true;
    resultBox.hidden = false;
    resultBox.innerHTML = results.length
      ? `<div class="settings-search-caption">${results.length} hasil untuk “${escapeHtml(settingsSearchQuery)}”</div>
         <div class="a17-card settings-search-card">${results.map(item => `
           <button class="a17-row settings-search-result" type="button" data-settings-result="${item.nav}">
             <span class="settings-search-result-icon">⌕</span>
             <span class="a17-copy">
               <strong>${escapeHtml(item.title)}</strong>
               <span>${escapeHtml(item.group)}${item.desc ? ` • ${escapeHtml(item.desc)}` : ""}</span>
             </span>
             <span class="a17-chevron">›</span>
           </button>`).join("")}</div>`
      : `<div class="settings-search-empty">
           <span>⌕</span>
           <strong>Tidak ada setelan yang cocok</strong>
           <small>Coba kata seperti Wi-Fi, SIM, Bluetooth, baterai, penyimpanan, kernel, atau navigasi.</small>
         </div>`;

    $$("[data-settings-result]", resultBox).forEach(button => {
      button.addEventListener("click", () => {
        settingsSearchQuery = "";
        vibrate(5);
        navigate(button.dataset.settingsResult);
      });
    });
  }

  function renderSettings() {
    const rows = [
      ["⌁", "Jaringan & internet", state.wifi ? "Wi-Fi" : "Wi-Fi nonaktif", "networkInternet"],
      ["◫", "Perangkat terhubung", state.bluetooth ? "Bluetooth" : "Bluetooth nonaktif", "connectedDevices"],
      ["▦", "Aplikasi", "Aplikasi default", "appsSettings"],
      ["◉", "Notifikasi", "Kelola notifikasi aplikasi dan sistem", "notificationsSettings"],
      ["▰", "Baterai", `${state.battery}%`, "batterySettings"],
      ["▥", "Penyimpanan", "256 GB", "storageSettings"],
      ["✦", t("style"), "Material 3 Expressive", "wallpaperStyle"],
      ["▣", "Layar & sentuhan", state.dark ? "Tema gelap" : "Tema terang", "displaySettings"],
      ["♫", "Suara & getaran", `${t("volume")}: ${state.volume}%`, "soundSettings"],
      ["◆", "Keamanan & privasi", state.screenLock, "securityPrivacy"],
      ["⚙", t("system"), t("systemDesc"), "system"],
      ["ⓘ", t("aboutPhone"), "Google Pixel 10 • Frankel", "about"]
    ];

    root.innerHTML = `<div class="a17-page wallstyle-page settings-main-page">
      <div class="a17-topbar"><h3>${t("settings")}</h3></div>
      <label class="settings-search settings-search-live" for="settingsSearchInput">
        <span class="settings-search-icon">⌕</span>
        <input id="settingsSearchInput" type="search" inputmode="search" autocomplete="off"
          spellcheck="false" placeholder="${escapeHtml(t("searchSettings"))}"
          value="${escapeHtml(settingsSearchQuery)}">
        <button id="settingsSearchClear" type="button" aria-label="Hapus pencarian" hidden>×</button>
      </label>
      <div id="settingsSearchResults" class="settings-search-results" hidden></div>
      <div id="settingsMainRows" class="a17-card settings-main-rows">
        ${rows.map(r => row({ title:r[1], desc:r[2], nav:r[3], icon:r[0] })).join("")}
      </div>
    </div>`;

    const input = $("#settingsSearchInput", root);
    input?.addEventListener("input", () => updateSettingsSearchUi(input.value));
    input?.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        settingsSearchQuery = "";
        input.value = "";
        updateSettingsSearchUi("");
        return;
      }
      if (event.key === "Enter") {
        const first = matchingSettings(input.value)[0];
        if (!first) return;
        event.preventDefault();
        settingsSearchQuery = "";
        navigate(first.nav);
      }
    });

    $("#settingsSearchClear", root)?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      settingsSearchQuery = "";
      if (input) {
        input.value = "";
        input.focus();
      }
      updateSettingsSearchUi("");
    });

    updateSettingsSearchUi(settingsSearchQuery);
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
      ${state.developerOptionsEnabled&&(state.devWifiVerboseLogging||state.devWifiNonPersistentMac||!state.devWifiScanThrottling)?`${sectionLabel("Info developer")}<div class="a17-card system-card">${state.devWifiVerboseLogging?plainRow("Logging Wi‑Fi","Panjang / verbose aktif"):""}${state.devWifiNonPersistentMac?plainRow("MAC Wi‑Fi acak",state.devWifiRandomMac):""}${!state.devWifiScanThrottling?plainRow("Pembatasan pemindaian","Nonaktif • pemindaian tanpa throttle"):""}</div>`:""}
    </div>`;
  }

  function simProviderById(id) {
    return ESIM_PROVIDERS.find(provider => provider.id === id) || null;
  }

  function simPrimaryLabel(value) {
    if (value === "sim1") return "3";
    if (value === "sim2") return "Indosat";
    if (value === "esim" && state.eSimInstalled) return simProviderById(state.eSimProvider)?.name || "eSIM";
    return "Selalu tanya";
  }

  function renderPrimarySimChoice(title, key, allowAsk = false) {
    const options = [];
    if (allowAsk) options.push(["ask", "Selalu tanya"]);
    if (state.sim1Enabled) options.push(["sim1", "3"]);
    if (state.sim2Enabled) options.push(["sim2", "Indosat"]);
    if (state.eSimInstalled && state.eSimEnabled) {
      options.push(["esim", simProviderById(state.eSimProvider)?.name || "eSIM"]);
    }

    return `<div class="sim-primary-block">
      <div class="sim-primary-copy">
        <strong>${title}</strong>
        <span>${simPrimaryLabel(state[key])}</span>
      </div>
      <div class="sim-primary-options">
        ${options.map(([value, label]) => `<button
          class="sim-primary-chip ${state[key] === value ? "active" : ""}"
          type="button"
          data-state-value-key="${key}"
          data-state-value="${value}"
        ><i></i>${escapeHtml(label)}</button>`).join("")}
      </div>
    </div>`;
  }

  function renderSimProfileCard({ label, number, enabledKey, badge, color, esim = false }) {
    return `<div class="sim-profile-card ${esim ? "is-esim" : ""}" style="--sim-card-color:${color}">
      <div class="sim-profile-head">
        <span class="sim-profile-badge">${badge}</span>
        ${toggle(enabledKey)}
      </div>
      <strong>${escapeHtml(label)}</strong>
      <small>${escapeHtml(number)}</small>
      <span class="sim-profile-status">${state[enabledKey] ? "Aktif" : "Nonaktif"}</span>
    </div>`;
  }

  function renderSimSettings() {
    const esimProvider = simProviderById(state.eSimProvider);
    const esimNumber = state.eSimPhone || "+62 8••• •••• ••••";

    root.innerHTML = `<div class="a17-page system-page sim-settings-page">${topbar("SIM")}
      ${sectionLabel("SIM terpasang")}
      <div class="sim-profile-grid">
        ${renderSimProfileCard({
          label: "3",
          number: maskSimNumber(state.simPhone1),
          enabledKey: "sim1Enabled",
          badge: "3",
          color: "#131313"
        })}
        ${renderSimProfileCard({
          label: "Indosat",
          number: "+62 857-••••-2843",
          enabledKey: "sim2Enabled",
          badge: "IM3",
          color: "#f0a900"
        })}
        ${state.eSimInstalled ? renderSimProfileCard({
          label: esimProvider?.name || "eSIM",
          number: maskSimNumber(esimNumber),
          enabledKey: "eSimEnabled",
          badge: esimProvider?.short || "eSIM",
          color: esimProvider?.color || "#6750a4",
          esim: true
        }) : ""}
      </div>

      <div class="a17-card system-card esim-add-card">
        <div class="a17-row">
          <span class="a17-trailing setting-leading-icon">＋</span>
          <span class="a17-copy">
            <strong>${state.eSimInstalled ? "eSIM terpasang" : "Tambahkan eSIM"}</strong>
            <span>${state.eSimInstalled
              ? `${escapeHtml(esimProvider?.name || "eSIM")} • SIM digital`
              : "Unduh SIM digital dari operator Indonesia"}</span>
          </span>
          <button
            class="a17-switch ${state.eSimInstalled && state.eSimEnabled ? "on" : ""}"
            type="button"
            data-action="${state.eSimInstalled ? "toggleEsim" : "beginEsimSetup"}"
            aria-label="Tambahkan eSIM"
          ></button>
        </div>
        ${state.eSimInstalled ? `<button class="sim-esim-manage" type="button" data-action="removeEsim">Hapus eSIM</button>` : ""}
      </div>

      ${sectionLabel("Data seluler")}
      <div class="a17-card system-card">
        ${switchRow("Data seluler", "Akses data menggunakan jaringan seluler", "mobileData")}
        ${switchRow("Pengalihan data otomatis", "Gunakan data dari SIM lain saat SIM utama tidak tersedia", "autoDataSwitch")}
      </div>

      ${sectionLabel("SIM utama")}
      <div class="a17-card system-card sim-primary-card">
        ${renderPrimarySimChoice("Panggilan", "primaryCallSim", true)}
        ${renderPrimarySimChoice("Pesan teks", "primarySmsSim")}
        ${renderPrimarySimChoice("Data seluler", "primaryDataSim")}
      </div>
    </div>`;
  }

  function renderEsimSetup() {
    root.innerHTML = `<div class="a17-page system-page esim-setup-page">${topbar("Tambahkan eSIM")}
      <div class="esim-setup-hero">
        <div class="esim-phone-orb">eSIM</div>
        <strong>Hubungkan ke jaringan seluler</strong>
        <span>Pilih operator untuk mengunduh profil eSIM ke Google Pixel 10.</span>
      </div>

      <div class="a17-card system-card esim-qr-card">
        <button class="a17-row" type="button" data-action="esimQrScanner">
          <span class="a17-trailing setting-leading-icon">▦</span>
          <span class="a17-copy"><strong>Pindai kode QR</strong><span>Gunakan kode aktivasi yang diberikan operator</span></span>
          <span class="a17-chevron">›</span>
        </button>
      </div>

      ${sectionLabel("Operator Indonesia")}
      <div class="a17-card system-card esim-provider-list">
        ${ESIM_PROVIDERS.map(provider => `<button
          class="a17-row esim-provider-row"
          type="button"
          data-state-value-key="eSimProvider"
          data-state-value="${provider.id}"
          data-next-after-value="eSimConfirm"
        >
          <span class="esim-provider-logo" style="--provider:${provider.color}">${provider.short}</span>
          <span class="a17-copy"><strong>${provider.name}</strong><span>Siapkan eSIM ${provider.name}</span></span>
          <span class="a17-chevron">›</span>
        </button>`).join("")}
      </div>
      ${infoNote("Ini adalah simulasi pendaftaran eSIM. Tidak ada profil operator nyata yang diunduh atau diaktifkan.")}
    </div>`;
  }

  function renderEsimConfirm() {
    const provider = simProviderById(state.eSimProvider) || ESIM_PROVIDERS[0];
    const installText = state.eSimInstalling ? "Mengunduh profil eSIM…" : `Unduh eSIM ${provider.name}`;

    root.innerHTML = `<div class="a17-page system-page esim-confirm-page">${topbar("Siapkan eSIM")}
      <div class="esim-confirm-hero">
        <span class="esim-provider-logo large" style="--provider:${provider.color}">${provider.short}</span>
        <h3>${provider.name}</h3>
        <p>Google Pixel 10 siap menambahkan paket seluler ${provider.name} sebagai eSIM.</p>
      </div>

      <div class="a17-card system-card">
        ${plainRow("Jenis SIM", "eSIM")}
        ${plainRow("Perangkat", "Google Pixel 10")}
        ${plainRow("EID", "8904 9000 4015 3826 0719 1842")}
        ${plainRow("Status", state.eSimInstalling ? "Mengunduh profil operator…" : "Siap diaktifkan")}
      </div>

      <button class="esim-install-button ${state.eSimInstalling ? "is-loading" : ""}"
        type="button"
        data-action="installEsim"
        ${state.eSimInstalling ? "disabled" : ""}
      >${installText}</button>
      <p class="esim-disclaimer">Aktivasi ini hanya simulasi dan tidak terhubung ke operator nyata.</p>
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
        ${state.developerOptionsEnabled?plainRow("Implementasi tethering",state.devHardwareTethering?"Akselerasi hardware aktif":"Jalur software"):""}
        ${state.developerOptionsEnabled&&state.usbTether?plainRow("USB developer","Tethering USB aktif dari Konfigurasi USB default"):""}
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
      <div class="a17-card system-card">${plainRow("Nama perangkat", "Google Pixel 10")}${navRow("Sambungkan perangkat baru", "", "pairNewDevice", "＋")}</div>
      ${infoNote("Jika Bluetooth aktif, perangkat Anda dapat berkomunikasi dengan perangkat Bluetooth di sekitar.")}
    </div>`;
  }

  function renderPairNewDevice() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Sambungkan perangkat baru")}
      <div class="a17-card system-card">${plainRow("Nama perangkat", "Google Pixel 10")}</div>
      ${sectionLabel("Perangkat yang tersedia")}
      <div class="scan-spinner">C</div>
      <div class="a17-card system-card"><button class="a17-row" type="button" data-action="pairI12"><span class="a17-copy"><strong>i12</strong><span>Headset Bluetooth</span></span><span class="a17-chevron">›</span></button>
        ${state.developerOptionsEnabled&&state.devBluetoothUnnamed?`<button class="a17-row" type="button" data-action="pairUnnamedBt"><span class="a17-copy"><strong>7C:91:22:AF:10:3D</strong><span>Perangkat Bluetooth tanpa nama</span></span><span class="a17-chevron">›</span></button>`:""}
      </div>
      ${infoNote(`Alamat Bluetooth ponsel: FF:DD:31:5F:XX:XX${state.devBluetoothHciSnoop?" • HCI snoop log aktif":""}`)}
    </div>`;
  }

  function renderBluetoothDeviceDetail() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Detail perangkat")}
      <div class="device-detail-hero"><h4>${state.pairedDevice || "i12"} ✎</h4><span>${state.pairedDeviceConnected ? "Menghubungkan" : "Tidak terhubung"}</span><div class="headphone-orb">◉</div><div class="device-actions"><button data-action="forgetDevice">▣<small>Lupakan</small></button><button data-action="connectDevice">＋<small>${state.pairedDeviceConnected ? "Putuskan" : "Hubungkan"}</small></button></div></div>
      <div class="a17-card system-card">${switchRow("Audio Spasial", "Audio dari perangkat media yang kompatibel menjadi lebih imersif", "spatialAudio")}${switchRow("Izinkan akses ke kontak dan histori panggilan", "Info akan digunakan untuk pengumuman panggilan", "contactHistoryAccess", true)}${plainRow("Jenis perangkat audio", "Tidak disetel")}
        ${state.developerOptionsEnabled?plainRow("Codec developer",`${state.devBluetoothCodec} • ${state.devBluetoothSampleRate} • ${state.devBluetoothBits}`):""}
        ${state.developerOptionsEnabled?plainRow("A2DP",state.devBluetoothA2dpOffload?"Offload hardware dinonaktifkan":"Hardware offload aktif"):""}
        ${state.developerOptionsEnabled?plainRow("Audio HD developer",state.devBluetoothHdAudio?"Diizinkan":"Default sistem"):""}
        ${state.developerOptionsEnabled?plainRow("AVRCP / MAP",`${state.devAvrcpVersion} • ${state.devMapVersion}`):""}
        ${state.developerOptionsEnabled?plainRow("Channel / perangkat maks",`${state.devBluetoothChannel} • maks ${state.devBluetoothMaxDevices}`):""}
        ${state.developerOptionsEnabled&&state.devBluetoothHciSnoop?plainRow("HCI snoop",`${Number(state.devBluetoothHciPackets)||0} paket simulasi tercatat`):""}</div>
    </div>`;
  }

  function renderCrossDevice() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Siapkan layanan lintas perangkat")}
      ${smallHero("network", "Perangkat yang login ke Akun Google dapat menemukan perangkat ini")}
      <button class="system-add-button" type="button" data-action="crossDeviceReady">Berikutnya</button>
    </div>`;
  }

  function renderNfcSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("NFC")}<div class="a17-card system-card">${switchRow("Gunakan NFC", "", "nfc")}${plainRow("Pembayaran nirsentuh", state.nfc ? "Pilih aplikasi pembayaran" : "Tidak tersedia karena NFC nonaktif")}
      ${state.developerOptionsEnabled&&(state.devNfcVerboseLogging||state.devNfcNciVerboseLogging)?plainRow("Log developer NFC",`${state.devNfcVerboseLogging?"Vendor verbose":""}${state.devNfcVerboseLogging&&state.devNfcNciVerboseLogging?" • ":""}${state.devNfcNciVerboseLogging?"NCI tanpa filter":""}`):""}</div></div>`;
  }

  function renderCastSettings() {
    root.innerHTML = `<div class="a17-page system-page">${topbar("Google Cast")}<div class="cast-hero">◫</div>${state.developerOptionsEnabled&&state.devWirelessDisplayCertification?`<div class="a17-card system-card">${plainRow("Sertifikasi layar nirkabel","Aktif")}${plainRow("Sesi WFD uji","1920 × 1080 • 60 Hz • simulasi")}</div>`:`<p class="empty-state-text">Tidak ditemukan perangkat di sekitar.</p>`}</div>`;
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
        ${navRow("Waktu pemakaian perangkat", `${formatUsageDuration()} hari ini`, "digitalWellbeing")}
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
    root.innerHTML=`<div class="a17-page system-page">${topbar("Detail aktivitas aplikasi")}<div class="wellbeing-summary"><strong id="wellbeingUsageTime">${formatUsageDuration()}</strong><span>Hari ini</span><div class="wellbeing-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div><div class="a17-card system-card">${plainRow("TikTok","50 menit")}${plainRow("Nekogram","10 menit")}${plainRow("Setelan","1 menit")}</div></div>`;
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
    const fpDesc = state.fingerprintEnrolled ? state.fingerprintName : "Belum ada sidik jari";
    root.innerHTML=`<div class="a17-page system-page">${topbar("Buka kunci perangkat")}<div class="unlock-hero">🔒</div><div class="a17-card system-card">${navRow("Kunci layar",state.screenLock,"screenLockSettings")}${navRow("Sidik jari",fpDesc,"fingerprintSettings")}${switchRow("Wajah",state.faceUnlock?"Wajah ditambahkan":"Tambahkan wajah", "faceUnlock")}</div><p class="system-description">Semua metode biometrik dan kredensial di halaman ini hanya simulasi lokal di browser.</p></div>`;
  }

  function renderFingerprintSettings() {
    const enrolled = !!state.fingerprintEnrolled;
    root.innerHTML=`<div class="a17-page system-page biometric-page">${topbar("Sidik jari")}<div class="fingerprint-settings-hero"><span class="fingerprint-symbol">◉</span><h4>${enrolled?"Sidik jari siap digunakan":"Siapkan buka kunci sidik jari"}</h4><p>${enrolled?"Gunakan sensor sidik jari dalam layar untuk membuka simulator.":"Daftarkan sidik jari simulasi dengan menyentuh sensor beberapa kali."}</p></div><div class="a17-card system-card">${enrolled?plainRow(state.fingerprintName,"Terdaftar"):plainRow("Belum ada sidik jari","Tambahkan satu untuk mulai")}</div><button class="system-add-button" type="button" data-action="startFingerprintEnroll">${enrolled?"Daftarkan ulang sidik jari":"Tambahkan sidik jari"}</button>${enrolled?`<button class="system-add-button danger-lite" type="button" data-action="removeFingerprint">Hapus sidik jari</button>`:""}</div>`;
  }

  function renderFingerprintEnroll() {
    const p=Math.max(0,Math.min(100,Number(state.fingerprintEnrollProgress)||0));
    root.innerHTML=`<div class="a17-page system-page fingerprint-enroll-page">${topbar("Tambahkan sidik jari")}<div class="finger-enroll-copy"><h3>${p>=100?"Selesai":"Sentuh dan tahan sensor"}</h3><p>${p>=100?"Sidik jari simulasi berhasil didaftarkan.":"Letakkan jari pada area sensor. Angkat lalu sentuh lagi hingga lingkaran penuh."}</p></div><div class="finger-enroll-ring" style="--fp-progress:${p*3.6}deg"><button class="finger-enroll-sensor" type="button" aria-label="Sensor sidik jari"><span>◉</span></button></div><strong class="finger-progress-label">${p}%</strong>${p>=100?`<button class="system-add-button" type="button" data-action="finishFingerprintEnroll">Selesai</button>`:`<small class="finger-enroll-hint">Tekan dan tahan beberapa kali</small>`}</div>`;
  }

  function renderScreenLockSettings() {
    const options=[
      ["PIN","Kode angka 4–6 digit"],
      ["Pola","Hubungkan minimal 4 titik"],
      ["Geser","Tanpa kredensial"],
      ["Tidak ada","Langsung ke layar utama"]
    ];
    root.innerHTML=`<div class="a17-page system-page">${topbar("Kunci layar")}<p class="system-description">Pilih cara membuka Google Pixel 10 simulator.</p><div class="a17-card system-card">${options.map(([name,desc])=>`<button class="a17-row" type="button" data-set-lock-type="${name}"><span class="a17-copy"><strong>${name}</strong><span>${desc}</span></span>${systemRadio(state.screenLock===name)}</button>`).join("")}</div></div>`;
  }

  function pinDots(value) {
    const len=String(value||"").length;
    return `<div class="pin-dots">${Array.from({length:6},(_,i)=>`<i class="${i<len?"filled":""}"></i>`).join("")}</div>`;
  }

  function pinPadMarkup(prefix="pin-enroll") {
    const digits=[1,2,3,4,5,6,7,8,9,"",0,"⌫"];
    return `<div class="pin-pad">${digits.map(d=>d===""?`<span></span>`:`<button type="button" data-${prefix}-key="${d}">${d}</button>`).join("")}</div>`;
  }

  function renderPinEnroll() {
    const confirm=pinEnrollStage==="confirm";
    root.innerHTML=`<div class="a17-page system-page credential-enroll-page">${topbar("Siapkan PIN")}<div class="credential-copy"><h3>${confirm?"Konfirmasi PIN":"Buat PIN"}</h3><p>${confirm?"Masukkan PIN yang sama sekali lagi.":"Masukkan 4–6 angka. PIN hanya disimpan di browser untuk simulasi ini."}</p>${pinDots(pinEnrollBuffer)}</div>${pinPadMarkup("pin-enroll")}<button class="system-add-button" type="button" data-action="pinEnrollContinue" ${pinEnrollBuffer.length<4?"disabled":""}>${confirm?"Konfirmasi":"Lanjutkan"}</button></div>`;
  }

  function patternMarkup(idPrefix="pattern", selected=[]) {
    return `<div class="pattern-board" data-pattern-board="${idPrefix}"><svg class="pattern-lines" aria-hidden="true"></svg>${Array.from({length:9},(_,i)=>`<button type="button" class="pattern-dot ${selected.includes(i)?"selected":""}" data-pattern-dot="${i}" aria-label="Titik ${i+1}"><span></span></button>`).join("")}</div>`;
  }

  function renderPatternEnroll() {
    const confirm=patternEnrollStage==="confirm";
    activePattern=[];
    root.innerHTML=`<div class="a17-page system-page credential-enroll-page">${topbar("Siapkan pola")}<div class="credential-copy"><h3>${confirm?"Konfirmasi pola":"Gambar pola"}</h3><p>${confirm?"Gambar pola yang sama sekali lagi.":"Hubungkan minimal 4 titik tanpa mengangkat jari."}</p></div>${patternMarkup("enroll")}<div class="pattern-status" id="patternEnrollStatus">${confirm?"Konfirmasi pola":"Sentuh titik pertama"}</div></div>`;
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

  function browserRegionFromCoordinates(latitude, longitude) {
    const lat = Number(latitude), lon = Number(longitude);
    if (lat >= -11.5 && lat <= 6.8 && lon >= 94 && lon <= 141.5) return "Indonesia";
    if (lat >= 24 && lat <= 46.5 && lon >= 122 && lon <= 146) return "Japan";
    if (lat >= 24 && lat <= 50 && lon >= -125 && lon <= -66) return "United States";
    if (lat >= 0.5 && lat <= 7.8 && lon >= 99 && lon <= 120) return "Malaysia";
    if (lat >= 1.1 && lat <= 1.6 && lon >= 103.5 && lon <= 104.2) return "Singapore";
    if (lat >= -44.5 && lat <= -10 && lon >= 112 && lon <= 154.5) return "Australia";
    try {
      const code = new Intl.Locale(navigator.language || "id-ID").region;
      const display = code ? new Intl.DisplayNames(["id"], { type: "region" }).of(code) : "";
      if (display) return display;
    } catch {}
    return "Wilayah browser";
  }

  function regionDetectionDescription() {
    if (state.regionDetectionStatus === "requesting") return "Menunggu izin lokasi browser…";
    if (state.regionDetectionStatus === "granted") return `${state.region} • ${state.detectedTimeZone || "zona waktu browser"}`;
    if (state.regionDetectionStatus === "denied") return "Izin lokasi ditolak browser";
    if (state.regionDetectionStatus === "unavailable") return "Lokasi browser tidak tersedia";
    return "Ketuk untuk meminta izin lokasi browser";
  }

  function detectRegionUsingBrowser() {
    if (!navigator.geolocation) {
      state.regionDetectionStatus = "unavailable";
      save(); render(); toast("Browser tidak menyediakan Geolocation API");
      return;
    }
    state.regionDetectionStatus = "requesting";
    save(); render();
    navigator.geolocation.getCurrentPosition(
      position => {
        state.region = browserRegionFromCoordinates(position.coords.latitude, position.coords.longitude);
        state.regionDetected = true;
        state.regionManuallySelected = false;
        state.regionDetectionStatus = "granted";
        state.detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        save(); vibrate(8); render(); toast(`Wilayah terdeteksi: ${state.region}`);
      },
      error => {
        state.regionDetectionStatus = error?.code === 1 ? "denied" : "unavailable";
        save(); render(); toast(error?.code === 1 ? "Izin lokasi ditolak" : "Lokasi tidak dapat dideteksi");
      },
      { enableHighAccuracy: false, timeout: 9000, maximumAge: 300000 }
    );
  }

  function renderSystem() {
    root.innerHTML = `<div class="a17-page system-page">
      ${topbar(t("system"))}
      <div class="system-intro">${t("systemInfo")}</div>

      <div class="a17-card system-card">
        ${row({ title: t("languageRegion"), desc: state.region, nav: "languageRegion", trailing: `<span class="a17-trailing system-icon">A</span>` })}
        ${row({ title: t("navigationMode"), desc: state.navigationMode === "gesture" ? t("gestureNavigation") : t("threeButtonNavigation"), nav: "navigationMode", trailing: `<span class="a17-trailing system-icon">◁</span>` })}
        ${row({ title: "Opsi developer", desc: state.developerOptionsEnabled ? "Aktif" : "Nonaktif", nav: "developerOptions", trailing: `<span class="a17-trailing system-icon">⌘</span>` })}
      </div>


    </div>`;
  }

  function renderLanguageRegion() {
    const installed = Array.isArray(state.installedLanguages) ? state.installedLanguages : ["id"];
    const langName = code => code === "en" ? "English (United States)" : "Bahasa Indonesia (Indonesia)";
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

      <div class="a17-section">Tanggal & waktu</div>
      <div class="a17-card system-card">
        ${switchRow("Atur waktu otomatis", state.autoDateTime ? `Waktu dari browser • ${formatTime().replace(".", ":")}` : "Gunakan waktu yang diatur manual", "autoDateTime")}
        ${!state.autoDateTime ? `<button class="a17-row" type="button" data-action="setManualTime"><span class="a17-copy"><strong>Waktu</strong><span>${escapeHtml(state.manualTime || "20:30")}</span></span><span class="a17-chevron">›</span></button>` : ""}
        ${switchRow("Atur zona waktu otomatis", state.autoTimeZone ? (state.detectedTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "Zona waktu browser") : "Pilih zona waktu secara manual", "autoTimeZone")}
      </div>

      <div class="a17-section">${t("regionalPreferences")}</div>
      <div class="a17-card system-card regional-card">
        <button class="a17-row" type="button" data-cycle-setting="region"><span class="a17-copy"><strong>${t("region")}</strong><span>${escapeHtml(state.region)}</span></span><span class="a17-chevron">›</span></button>
        <button class="a17-row browser-region-row" type="button" data-action="detectBrowserRegion">
          <span class="a17-trailing setting-leading-icon">⌖</span>
          <span class="a17-copy"><strong>Deteksi wilayah otomatis</strong><span>${escapeHtml(regionDetectionDescription())}</span></span>
          <span class="a17-chevron">›</span>
        </button>
        <button class="a17-row" type="button" data-cycle-setting="temperatureUnit"><span class="a17-copy"><strong>${t("temperature")}</strong><span>${state.temperatureUnit === "default" ? t("useDefault") : state.temperatureUnit}</span></span></button>
        <button class="a17-row" type="button" data-cycle-setting="measurementSystem"><span class="a17-copy"><strong>${t("measurementSystem")}</strong><span>${state.measurementSystem === "default" ? t("useDefault") : state.measurementSystem}</span></span></button>
        <button class="a17-row" type="button" data-cycle-setting="firstDayOfWeek"><span class="a17-copy"><strong>${t("firstDayWeek")}</strong><span>${state.firstDayOfWeek === "default" ? t("useDefault") : state.firstDayOfWeek}</span></span></button>
      </div>

      <div class="a17-section">${t("otherLanguageSettings")}</div>
      <div class="a17-card system-card">
        <button class="a17-row" type="button" data-action="appLanguageToast"><span class="a17-copy"><strong>${t("appLanguages")}</strong><span>${t("appLanguagesDesc")}</span></span></button>
        <button class="a17-row" type="button" data-action="speechToast"><span class="a17-copy"><strong>${t("speech")}</strong><span>${t("speechDesc")}</span></span></button>
      </div>
      <div class="system-note">ⓘ <span>Deteksi wilayah memakai Geolocation API browser. Browser akan meminta izin lokasi sebelum membaca posisi.</span></div>
    </div>`;
  }

  function developerCycleValue(key, values) {
    const list = Array.isArray(values) ? values : [];
    if (!list.length) return;
    const current = list.indexOf(state[key]);
    state[key] = list[(current + 1) % list.length];
    save(); vibrate(5); render();
  }

  function developerRow(title, desc = "", action = "", nav = "") {
    return `<button class="a17-row developer-value-row" type="button"
      ${action ? `data-action="${action}"` : ""}${nav ? ` data-nav="${nav}"` : ""}>
      <span class="a17-copy"><strong>${title}</strong>${desc ? `<span>${desc}</span>` : ""}</span>
      <span class="a17-chevron">›</span>
    </button>`;
  }

  function developerToggleRow(title, desc, key) {
    return `<div class="a17-row developer-toggle-row">
      <span class="a17-copy"><strong>${title}</strong>${desc ? `<span>${desc}</span>` : ""}</span>${toggle(key)}
    </div>`;
  }

  function renderDeveloperOptions() {
    const enabled = !!state.developerOptionsEnabled;
    root.innerHTML = `<div class="a17-page system-page developer-options-page">
      ${topbar("Opsi developer")}
      <div class="developer-master-card"><span>Gunakan opsi developer</span>${toggle("developerOptionsEnabled")}</div>

      ${enabled ? `
      <div class="developer-section-label">Umum</div>
      <div class="a17-card system-card developer-card">
        ${developerRow("Penggunaan memori", `RAM sistem dan aplikasi • interval ${Number(state.devMemoryInterval)||3} jam`, "", "developerMemory")}
        ${developerRow("Layanan yang sedang berjalan", "Lihat proses dan layanan aktif • RAM 8 GB", "", "developerRunningServices")}
        ${developerRow("Ambil laporan bug", `${Number(state.devBugReportCount)||0} laporan simulasi`, "developer-bug-report")}
        ${developerToggleRow("Mode demo UI Sistem", "Status bar bersih: 10.00, sinyal penuh, baterai 100%", "devSystemUiDemo")}
        ${developerToggleRow("Tampilkan info status opsi developer", "Tampilkan ringkasan fitur developer aktif di bagian bawah layar", "devShowStatusHud")}
        ${developerToggleRow("Tetap aktif", "Simulasikan layar tetap aktif ketika perangkat mengisi daya", "devStayAwake")}
        ${developerToggleRow("Log snoop HCI Bluetooth", "Simulasikan pencatatan paket Bluetooth HCI", "devBluetoothHciSnoop")}
        <div class="a17-row developer-toggle-row developer-oem-row">
          <span class="a17-copy"><strong>Pembukaan kunci OEM</strong><span>${state.oemUnlockAllowed ? "Bootloader diizinkan untuk dibuka kuncinya" : "Izinkan bootloader dibuka kuncinya dari Fastboot"}</span></span>
          <button class="a17-switch ${state.oemUnlockAllowed ? "on" : ""}" type="button" data-action="developer-oem-toggle"></button>
        </div>
      </div>

      <div class="developer-section-label">Proses debug</div>
      <div class="a17-card system-card developer-card">
        ${developerToggleRow("Proses debug USB", "Mode debug ketika USB terhubung", "devUsbDebugging")}
        ${developerRow(
          "Cabut otorisasi debug USB",
          Number(state.devUsbAuthorizationCount) > 0
            ? `${Number(state.devUsbAuthorizationCount)} komputer diotorisasi`
            : "Tidak ada komputer yang diotorisasi",
          "developer-revoke-usb"
        )}
        ${developerRow("Proses debug nirkabel", state.devWirelessDebugging ? "Aktif • debugging melalui Wi‑Fi" : "Mode debug saat Wi‑Fi terhubung", "", "developerWirelessDebugging")}
        ${developerToggleRow("Nonaktifkan waktu tunggu otorisasi adb", "Jangan cabut otorisasi adb otomatis", "devDisableAdbTimeout")}
        ${developerToggleRow("Logging cetak panjang", "Log debug tambahan, termasuk informasi vendor", "devVerboseVendorLogging")}
        ${developerToggleRow("Aktifkan inspeksi atribut tampilan", "Izinkan pemeriksaan atribut UI", "devViewAttributeInspection")}
        ${developerRow("Pilih aplikasi debug", state.devDebugApp ? (appById(state.devDebugApp)?.name || state.devDebugApp) : "Tidak ada aplikasi debug yang disetel", "", "developerSelectDebugApp")}
        ${developerToggleRow("Tunggu debugger", "Aplikasi debug menunggu debugger sebelum berjalan", "devWaitForDebugger")}
        ${developerToggleRow("Verifikasi aplikasi melalui USB", "Periksa aplikasi yang diinstal melalui ADB", "devVerifyAppsUsb")}
        ${developerToggleRow("Verifikasi bytecode aplikasi yang dapat di-debug", "Izinkan ART memverifikasi bytecode aplikasi debug", "devVerifyDebugBytecode")}
        ${developerRow("Ukuran buffer logger", state.devLoggerBuffer, "developer-open-logger-buffer")}
        ${developerRow("Tanda fitur", "Feature flags simulasi", "developer-feature-flags")}
        ${developerToggleRow("Aktifkan lapisan debug GPU", "Lapisan debug GPU untuk aplikasi debug", "devGpuDebugLayers")}
      </div>

      <div class="developer-section-label">Grafis dan aplikasi</div>
      <div class="a17-card system-card developer-card">
        ${developerToggleRow("Eksperimental: Aktifkan ANGLE", "Gunakan ANGLE eksperimental", "devExperimentalAngle")}
        ${developerToggleRow("Nonaktifkan kecepatan frame default untuk game", "Nonaktifkan pembatas frame default", "devDisableDefaultFrameRate")}
        ${developerRow("Preferensi Driver Grafis", "Ubah setelan driver grafis", "developer-driver-preferences")}
        ${developerRow("Perubahan Kompatibilitas Aplikasi", "Ubah kompatibilitas aplikasi", "developer-app-compat")}
        ${developerToggleRow("Tampilkan kecepatan refresh", "Tampilkan refresh rate di sudut layar", "devShowRefreshRate")}
        ${developerToggleRow("Izinkan overlay layar pada Setelan", "Izinkan overlay saat Setelan terbuka", "devAllowOverlaySettings")}
        ${developerToggleRow("Izinkan Modem Simulasi", "Jalankan layanan modem simulasi", "devMockModem")}
      </div>

      <div class="developer-section-label">Jaringan</div>
      <div class="a17-card system-card developer-card">
        ${developerToggleRow("Sertifikasi layar nirkabel", "Tampilkan opsi sertifikasi layar nirkabel", "devWirelessDisplayCertification")}
        ${developerToggleRow("Aktifkan Pencatatan Log Panjang Wi‑Fi", "Tingkatkan level log Wi‑Fi", "devWifiVerboseLogging")}
        ${developerToggleRow("Pembatasan pemindaian Wi‑Fi", "Kurangi konsumsi baterai akibat pemindaian", "devWifiScanThrottling")}
        ${developerToggleRow("Pengacakan tidak tetap MAC Wi‑Fi", "Gunakan MAC acak yang berubah", "devWifiNonPersistentMac")}
        ${developerToggleRow("Data seluler selalu aktif", "Pertahankan data seluler saat Wi‑Fi aktif", "devCellularAlwaysActive")}
        ${developerToggleRow("Akselerasi hardware tethering", "Gunakan akselerasi tethering bila tersedia", "devHardwareTethering")}
        ${developerRow("Konfigurasi USB default", state.devUsbDefault, "developer-open-usb-config")}
        ${developerToggleRow("Tampilkan perangkat Bluetooth tanpa nama", "Tampilkan perangkat dengan alamat MAC saja", "devBluetoothUnnamed")}
      </div>

      <div class="developer-section-label">Bluetooth</div>
      <div class="a17-card system-card developer-card">
        ${developerToggleRow("Nonaktifkan offload hardware Bluetooth A2DP", "Gunakan jalur audio software", "devBluetoothA2dpOffload")}
        ${developerRow("Versi AVRCP Bluetooth", state.devAvrcpVersion, "developer-open-avrcp")}
        ${developerRow("Versi MAP Bluetooth", state.devMapVersion, "developer-open-map")}
        ${developerToggleRow("Audio HD", "Gunakan audio Bluetooth HD jika tersedia", "devBluetoothHdAudio")}
        ${developerRow("Codec Audio Bluetooth", state.devBluetoothCodec, "developer-open-bt-codec")}
        ${developerRow("Frekuensi Sampel Audio Bluetooth", state.devBluetoothSampleRate, "developer-open-bt-rate")}
        ${developerRow("Bit Per Sampel Audio Bluetooth", state.devBluetoothBits, "developer-open-bt-bits")}
        ${developerRow("Mode Channel Audio Bluetooth", state.devBluetoothChannel, "developer-open-bt-channel")}
        ${developerRow("Jumlah maksimum perangkat audio Bluetooth yang terhubung", state.devBluetoothMaxDevices, "developer-open-bt-max")}
        ${developerToggleRow("Log debug vendor panjang NFC", "Log tambahan vendor NFC", "devNfcVerboseLogging")}
        ${developerToggleRow("Log tanpa filter NCI NFC", "Catat paket NFC detail", "devNfcNciVerboseLogging")}
      </div>

      <div class="developer-section-label">Input</div>
      <div class="a17-card system-card developer-card">
        ${developerToggleRow("Tampilkan ketukan", "Tampilkan efek visual untuk ketukan", "devShowTaps")}
        ${developerToggleRow("Lokasi kursor", "Overlay koordinat dan lintasan sentuh", "devPointerLocation")}
        ${developerToggleRow("Tampilkan penekanan tombol", "Tampilkan respons visual tombol fisik", "devShowButtonPresses")}
        ${developerToggleRow("Tampilkan input touchpad", "Overlay data input touchpad", "devTouchpadPointer")}
      </div>

      <div class="developer-section-label">Gambar</div>
      <div class="a17-card system-card developer-card">
        ${developerToggleRow("Tampilkan pembaruan permukaan", "Buat permukaan berkedip saat diperbarui", "devSurfaceUpdates")}
        ${developerToggleRow("Tampilkan batas tata letak", "Tampilkan batas klip, margin, dan lainnya", "devLayoutBounds")}
        ${developerToggleRow("Paksa arah tata letak RTL", "Paksa RTL untuk semua lokalitas", "devForceRtl")}
        ${developerRow("Skala animasi jendela", state.devWindowAnimationScale, "developer-open-window-scale")}
        ${developerRow("Skala animasi transisi", state.devTransitionAnimationScale, "developer-open-transition-scale")}
        ${developerRow("Skala durasi animator", state.devAnimatorDurationScale, "developer-open-animator-scale")}
        ${developerRow("Simulasikan layar sekunder", state.devSecondaryDisplay, "developer-open-secondary-display")}
        ${developerRow("Lebar terkecil", `${state.devSmallestWidth} dp`, "developer-open-smallest-width")}
        ${developerRow("Potongan layar", state.devDisplayCutout, "developer-open-display-cutout")}
        ${developerToggleRow("Menu navigasi transparan", "Buat latar navigation bar transparan secara default", "devTransparentNavigation")}
      </div>

      <div class="developer-section-label">Percepatan render oleh hardware</div>
      <div class="a17-card system-card developer-card">
        ${developerToggleRow("Paksa rendering GPU", "Gunakan akselerasi GPU untuk gambar 2D", "devForceGpuRendering")}
        ${developerToggleRow("Nonaktifkan overlay HW", "Selalu gunakan GPU untuk komposisi layar", "devDisableHwOverlays")}
      </div>
      ` : `
      <div class="developer-disabled-state"><span>⌘</span><strong>Opsi developer dinonaktifkan</strong><small>Aktifkan tombol di atas untuk menggunakan fitur debugging dan simulasi developer.</small></div>`}
      ${developerDialogMarkup()}
    </div>`;
  }

  function developerChoiceDialog(title, key, values, description = "") {
    const normalized = values.map(value => typeof value === "string" ? { value, label:value, desc:"" } : value);
    return `<div class="developer-dialog-backdrop"><section class="developer-dialog developer-dialog-tall">
      <h4>${escapeHtml(title)}</h4>
      ${description ? `<p class="developer-dialog-copy">${escapeHtml(description)}</p>` : ""}
      <div class="developer-dialog-options developer-radio-options">
        ${normalized.map(item => `<button class="${String(state[key])===String(item.value)?"active":""}" type="button"
          data-developer-value-key="${key}" data-developer-value="${escapeHtml(String(item.value))}">
          <span class="developer-choice-copy">
            <b>${escapeHtml(item.label || String(item.value))}</b>
            ${item.desc ? `<small>${escapeHtml(item.desc)}</small>` : ""}
          </span>
        </button>`).join("")}
      </div>
      <button class="developer-dialog-close" type="button" data-action="developer-dialog-close">Batal</button>
    </section></div>`;
  }

  function developerDialogMarkup() {
    const dialog = developerDialog;
    if (!dialog) return "";
    const scales = {
      "window-scale": ["devWindowAnimationScale", "Skala animasi jendela"],
      "transition-scale": ["devTransitionAnimationScale", "Skala animasi transisi"],
      "animator-scale": ["devAnimatorDurationScale", "Skala durasi animator"]
    };
    if (scales[dialog]) {
      const [key,title] = scales[dialog];
      const values = ["Animasi nonaktif","0.5x","1.0x","1.5x","2.0x","5.0x","10.0x"];
      return `<div class="developer-dialog-backdrop"><section class="developer-dialog"><h4>${title}</h4><div class="developer-dialog-options">${values.map(value=>`<button class="${state[key]===value?"active":""}" type="button" data-developer-value-key="${key}" data-developer-value="${value}">${value}</button>`).join("")}</div><button class="developer-dialog-close" type="button" data-action="developer-dialog-close">Batal</button></section></div>`;
    }
    if (dialog === "memory-period") {
      const values=[3,6,9,12];
      return `<div class="developer-dialog-backdrop"><section class="developer-dialog"><h4>Rentang penggunaan memori</h4><div class="developer-dialog-options">${values.map(value=>`<button class="${Number(state.devMemoryInterval)===value?"active":""}" type="button" data-developer-value-key="devMemoryInterval" data-developer-value="${value}">${value} jam</button>`).join("")}</div><button class="developer-dialog-close" type="button" data-action="developer-dialog-close">Batal</button></section></div>`;
    }
    if (dialog === "feature-flags") {
      return `<div class="developer-dialog-backdrop"><section class="developer-dialog developer-dialog-tall"><h4>Tanda fitur</h4><div class="developer-dialog-switches">${developerToggleRow("Predictive back","Pratinjau tujuan gestur kembali","devFeaturePredictiveBack")}${developerToggleRow("Desktop windowing","Mode jendela desktop eksperimental","devFeatureDesktopWindowing")}${developerToggleRow("Kontrol media baru","Kontrol media generasi terbaru","devFeatureNewMediaControls")}</div><button class="developer-dialog-close" type="button" data-action="developer-dialog-close">Selesai</button></section></div>`;
    }
    if (dialog === "graphics-driver") {
      const values=["Default sistem","Driver sistem","ANGLE","Driver native simulasi"];
      return `<div class="developer-dialog-backdrop"><section class="developer-dialog"><h4>Preferensi Driver Grafis</h4><div class="developer-dialog-options">${values.map(value=>`<button class="${state.devGraphicsDriver===value?"active":""}" type="button" data-developer-value-key="devGraphicsDriver" data-developer-value="${value}">${value}</button>`).join("")}</div><button class="developer-dialog-close" type="button" data-action="developer-dialog-close">Batal</button></section></div>`;
    }
    if (dialog === "app-compat") {
      const values=["Default","Perilaku Android 16","Paksa resizeable","Nonaktifkan pembatasan kompatibilitas"];
      return `<div class="developer-dialog-backdrop"><section class="developer-dialog"><h4>Perubahan Kompatibilitas Aplikasi</h4><div class="developer-dialog-options">${values.map(value=>`<button class="${state.devAppCompatMode===value?"active":""}" type="button" data-developer-value-key="devAppCompatMode" data-developer-value="${value}">${value}</button>`).join("")}</div><button class="developer-dialog-close" type="button" data-action="developer-dialog-close">Batal</button></section></div>`;
    }
    if (dialog === "bug-report") {
      return `<div class="developer-dialog-backdrop"><section class="developer-dialog"><h4>Laporan bug simulator siap</h4><p class="developer-dialog-copy">Bugreport #${Number(state.devBugReportCount)||1} • RAM 8 GB • Kernel 6.12.25-android16-GKI-waifukernel-simulator</p><div class="developer-bugreport-box">USB DEBUG: ${state.devUsbDebugging?"enabled":"disabled"}<br>WIRELESS DEBUG: ${state.devWirelessDebugging?"enabled":"disabled"}<br>OEM UNLOCK ALLOWED: ${state.oemUnlockAllowed?"yes":"no"}<br>GRAPHICS: ${escapeHtml(state.devGraphicsDriver)}</div><button class="developer-dialog-close" type="button" data-action="developer-dialog-close">Tutup</button></section></div>`;
    }
    if (dialog === "secondary-display") {
      const values=["Tidak ada","480p","480p (aman)","720p","720p (aman)","1080p","1080p (aman)","4K","4K (aman)","4K (ditingkatkan)","4K (ditingkatkan, aman)","720p, 1080p (Dual Screen)"];
      return `<div class="developer-dialog-backdrop"><section class="developer-dialog developer-dialog-tall"><h4>Simulasikan layar sekunder</h4><div class="developer-dialog-options">${values.map(value=>`<button class="${state.devSecondaryDisplay===value?"active":""}" type="button" data-developer-value-key="devSecondaryDisplay" data-developer-value="${value}">${value}</button>`).join("")}</div><button class="developer-dialog-close" type="button" data-action="developer-dialog-close">Batal</button></section></div>`;
    }
    if (dialog === "smallest-width") {
      return `<div class="developer-dialog-backdrop"><section class="developer-dialog"><h4>Lebar terkecil</h4><label class="developer-number-field"><input id="developerSmallestWidthInput" type="number" min="320" max="720" value="${Number(state.devSmallestWidth)||392}"><span>dp</span></label><div class="developer-dialog-actions"><button type="button" data-action="developer-dialog-close">Batal</button><button class="primary" type="button" data-action="developer-save-smallest-width">Oke</button></div></section></div>`;
    }
    if (dialog === "usb-config") {
      const values=[
        ["Tidak ada transfer data","Hanya pengisian daya"],
        ["File Sharing","Transfer file melalui MTP"],
        ["Tethering USB","Bagikan koneksi data melalui USB"],
        ["MIDI","Gunakan Pixel sebagai antarmuka MIDI"],
        ["Android Auto","Hubungkan ke Android Auto melalui USB"],
        ["PTP","Transfer foto sebagai kamera (PTP)"]
      ];
      return `<div class="developer-dialog-backdrop"><section class="developer-dialog developer-dialog-tall">
        <h4>Konfigurasi USB default</h4>
        <p class="developer-dialog-copy">Pilih fungsi USB default untuk Google Pixel 10.</p>
        <div class="developer-dialog-options developer-usb-options">
          ${values.map(([value,desc])=>`<button class="${state.devUsbDefault===value?"active":""}" type="button" data-developer-usb-value="${value}"><span><b>${value}</b><small>${desc}</small></span></button>`).join("")}
        </div>
        <button class="developer-dialog-close" type="button" data-action="developer-dialog-close">Batal</button>
      </section></div>`;
    }

    if (dialog === "usb-revoke-confirm") {
      return `<div class="developer-dialog-backdrop"><section class="developer-dialog">
        <h4>Cabut otorisasi debug USB?</h4>
        <p class="developer-dialog-copy">
          Semua komputer yang sebelumnya dipercaya untuk ADB melalui USB akan dilupakan.
          Saat tersambung lagi, perangkat akan meminta konfirmasi kunci RSA baru.
        </p>
        <div class="developer-dialog-actions">
          <button type="button" data-action="developer-dialog-close">Batal</button>
          <button class="primary" type="button" data-action="developer-revoke-usb-confirm">Cabut</button>
        </div>
      </section></div>`;
    }

    if (dialog === "logger-buffer") {
      return developerChoiceDialog(
        "Ukuran buffer logger",
        "devLoggerBuffer",
        [
          {value:"Nonaktif",label:"Nonaktif",desc:"Nonaktifkan buffer log persistensi simulator"},
          {value:"64 KB/buffer log",label:"64 KB/buffer log",desc:"Buffer kecil, penggunaan RAM paling rendah"},
          {value:"256 KB/buffer log",label:"256 KB/buffer log",desc:"Default simulator"},
          {value:"1 MB/buffer log",label:"1 MB/buffer log",desc:"Simpan lebih banyak log"},
          {value:"4 MB/buffer log",label:"4 MB/buffer log",desc:"Buffer besar untuk debugging"},
          {value:"16 MB/buffer log",label:"16 MB/buffer log",desc:"Buffer maksimum simulasi"}
        ],
        "Mengubah kapasitas logcat simulasi untuk setiap buffer log."
      );
    }

    if (dialog === "avrcp-version") {
      return developerChoiceDialog(
        "Versi AVRCP Bluetooth",
        "devAvrcpVersion",
        [
          {value:"AVRCP 1.3",label:"AVRCP 1.3",desc:"Kontrol media dasar"},
          {value:"AVRCP 1.4",label:"AVRCP 1.4",desc:"Browsing metadata lebih lengkap"},
          {value:"AVRCP 1.5 (Default)",label:"AVRCP 1.5 (Default)",desc:"Pilihan default Google Pixel simulator"},
          {value:"AVRCP 1.6",label:"AVRCP 1.6",desc:"Versi AVRCP terbaru pada daftar simulasi"}
        ],
        "Versi ini digunakan saat perangkat media Bluetooth terhubung kembali."
      );
    }

    if (dialog === "map-version") {
      return developerChoiceDialog(
        "Versi MAP Bluetooth",
        "devMapVersion",
        [
          {value:"MAP 1.2 (Default)",label:"MAP 1.2 (Default)",desc:"Profil pesan default"},
          {value:"MAP 1.3",label:"MAP 1.3",desc:"Kompatibilitas MAP yang lebih baru"},
          {value:"MAP 1.4",label:"MAP 1.4",desc:"Versi MAP tertinggi pada simulator"}
        ],
        "Mengatur versi Bluetooth Message Access Profile untuk sesi berikutnya."
      );
    }

    if (dialog === "bt-codec") {
      return developerChoiceDialog(
        "Codec Audio Bluetooth",
        "devBluetoothCodec",
        [
          {value:"Gunakan Pilihan Sistem (Default)",label:"Gunakan Pilihan Sistem (Default)",desc:"Negosiasikan codec terbaik yang didukung kedua perangkat"},
          {value:"SBC",label:"SBC",desc:"Codec A2DP dasar dan paling kompatibel"},
          {value:"AAC",label:"AAC",desc:"Codec audio AAC"},
          {value:"aptX",label:"aptX",desc:"Codec Qualcomm aptX simulasi"},
          {value:"aptX HD",label:"aptX HD",desc:"Codec aptX HD simulasi"},
          {value:"LDAC",label:"LDAC",desc:"Codec audio resolusi tinggi simulasi"},
          {value:"LC3",label:"LC3",desc:"Codec LC3 simulasi"}
        ],
        "Codec akan terlihat pada detail perangkat audio Bluetooth yang terhubung."
      );
    }

    if (dialog === "bt-rate") {
      return developerChoiceDialog(
        "Frekuensi Sampel Audio Bluetooth",
        "devBluetoothSampleRate",
        [
          "Gunakan Pilihan Sistem (Default)","44.1 kHz","48.0 kHz","88.2 kHz","96.0 kHz"
        ],
        "Paksa sample rate Bluetooth untuk simulasi sesi audio berikutnya."
      );
    }

    if (dialog === "bt-bits") {
      return developerChoiceDialog(
        "Bit Per Sampel Audio Bluetooth",
        "devBluetoothBits",
        [
          "Gunakan Pilihan Sistem (Default)","16 bit/sample","24 bit/sample","32 bit/sample"
        ],
        "Mengatur bit depth audio Bluetooth simulasi."
      );
    }

    if (dialog === "bt-channel") {
      return developerChoiceDialog(
        "Mode Channel Audio Bluetooth",
        "devBluetoothChannel",
        [
          "Gunakan Pilihan Sistem (Default)","Mono","Stereo"
        ],
        "Mengatur mode channel untuk audio Bluetooth simulasi."
      );
    }

    if (dialog === "bt-max") {
      return developerChoiceDialog(
        "Jumlah maksimum perangkat audio Bluetooth yang terhubung",
        "devBluetoothMaxDevices",
        [
          {value:"1",label:"1 perangkat",desc:"Hanya satu perangkat audio aktif"},
          {value:"2",label:"2 perangkat",desc:"Dua perangkat audio Bluetooth"},
          {value:"3",label:"3 perangkat",desc:"Maksimum tiga perangkat"},
          {value:"4",label:"4 perangkat",desc:"Maksimum empat perangkat"},
          {value:"5",label:"5 perangkat",desc:"Maksimum lima perangkat"}
        ],
        "Batas ini diterapkan oleh Bluetooth simulator pada sesi pairing berikutnya."
      );
    }

    if (dialog === "display-cutout") {
      const values=["Default perangkat","Render aplikasi di bawah area potongan","Potongan sudut","Potongan ganda","Potongan Lubang Kertas","Sembunyikan","Potongan tinggi","Potongan waterfall"];
      return `<div class="developer-dialog-backdrop"><section class="developer-dialog developer-dialog-tall"><h4>Potongan layar</h4><div class="developer-dialog-options">${values.map(value=>`<button class="${state.devDisplayCutout===value?"active":""}" type="button" data-developer-value-key="devDisplayCutout" data-developer-value="${value}">${value}</button>`).join("")}</div><button class="developer-dialog-close" type="button" data-action="developer-dialog-close">Batal</button></section></div>`;
    }
    if (dialog === "oem-confirm") {
      return `<div class="developer-dialog-backdrop"><section class="developer-dialog"><h4>Izinkan pembukaan kunci OEM?</h4><p class="developer-dialog-copy">Mengaktifkan opsi ini mengizinkan bootloader perangkat dibuka kuncinya dari Fastboot. Opsi ini tidak langsung membuka bootloader.</p><div class="developer-dialog-actions"><button type="button" data-action="developer-dialog-close">Batal</button><button class="primary" type="button" data-action="developer-oem-confirm">Aktifkan</button></div></section></div>`;
    }
    return "";
  }

  function developerMemoryStats(hours = Number(state.devMemoryInterval) || 3) {
    const table={
      3:{avg:3.12,used:39,free:4.88,system:2.75,apps:1.18,cached:.72},
      6:{avg:3.46,used:43,free:4.54,system:2.82,apps:1.31,cached:.76},
      9:{avg:3.71,used:46,free:4.29,system:2.86,apps:1.46,cached:.79},
      12:{avg:3.88,used:49,free:4.12,system:2.91,apps:1.59,cached:.83}
    };
    return table[hours]||table[3];
  }

  function renderDeveloperMemory() {
    const hours=[3,6,9,12].includes(Number(state.devMemoryInterval))?Number(state.devMemoryInterval):3;
    const s=developerMemoryStats(hours);
    root.innerHTML=`<div class="a17-page system-page developer-subpage">
      ${topbar("Penggunaan memori")}
      <button class="developer-memory-period" type="button" data-action="developer-memory-period">${hours} jam⌄</button>
      <div class="a17-card system-card">${developerToggleRow("Aktifkan profiling penggunaan memori","Profiling memori memerlukan resource sistem tambahan.","devMemoryProfiling")}</div>
      <div class="developer-memory-summary">
        <span>Rata-rata penggunaan memori</span>
        <strong>${s.avg.toFixed(2).replace(".",",")} GB</strong>
        <div class="developer-memory-bar"><i style="width:${s.used}%"></i></div>
        <small>Performa: Normal • Total memori: 8,00 GB • Bebas: ${s.free.toFixed(2).replace(".",",")} GB</small>
        <div class="developer-memory-detail-grid">
          <span><b>${s.system.toFixed(2).replace(".",",")} GB</b>Sistem</span>
          <span><b>${s.apps.toFixed(2).replace(".",",")} GB</b>Aplikasi</span>
          <span><b>${s.cached.toFixed(2).replace(".",",")} GB</b>Cache</span>
          <span><b>${s.free.toFixed(2).replace(".",",")} GB</b>Bebas</span>
        </div>
      </div>
      ${developerDialogMarkup()}
    </div>`;
  }

  function renderDeveloperRunningServices() {
    const s=developerMemoryStats(Number(state.devMemoryInterval)||3);
    const services=[["Setelan","6 proses dan 1 layanan","86 MB"],["com.qualcomm.qcrilmsgtunnel","1 proses dan layanan","14 MB"],["com.qualcomm.atfwd","1 proses dan layanan","11 MB"],["Gboard","1 proses dan layanan","112 MB"],["Google Play services","4 proses dan 3 layanan","286 MB"],["System UI","2 proses dan 4 layanan","194 MB"],["Pixel Launcher","1 proses dan 2 layanan","148 MB"]];
    const systemPct=Math.round(s.system/8*100), appsPct=Math.round(s.apps/8*100);
    root.innerHTML=`<div class="a17-page system-page developer-subpage">
      ${topbar("Layanan yang sedang berjalan")}
      <div class="developer-running-memory">
        <strong>Memori perangkat • Total 8,00 GB</strong>
        <div class="developer-running-bar"><i style="width:${systemPct}%"></i><i style="width:${appsPct}%"></i></div>
        <small>Sistem ${s.system.toFixed(2).replace(".",",")} GB RAM • Aplikasi ${s.apps.toFixed(2).replace(".",",")} GB RAM • Cache ${s.cached.toFixed(2).replace(".",",")} GB • Kosong ${s.free.toFixed(2).replace(".",",")} GB RAM</small>
      </div>
      <div class="developer-section-label">Penggunaan RAM aplikasi</div>
      <div class="a17-card system-card">${services.map(x=>`<div class="a17-row"><span class="a17-trailing setting-leading-icon">⚙</span><span class="a17-copy"><strong>${x[0]}</strong><span>${x[1]}</span></span><span class="developer-service-memory">${x[2]}</span></div>`).join("")}</div>
    </div>`;
  }

  function renderDeveloperWirelessDebugging() {
    const port=37100 + (Number(state.battery)||0);
    root.innerHTML=`<div class="a17-page system-page developer-subpage">${topbar("Proses debug nirkabel")}
      <div class="developer-master-card"><span>Gunakan proses debug nirkabel</span>${toggle("devWirelessDebugging")}</div>
      ${state.devWirelessDebugging?`<div class="a17-card system-card">
        ${plainRow("Nama perangkat","Google Pixel 10")}
        ${plainRow("Alamat IP & Port",`192.168.1.10:${port}`)}
        ${plainRow("Kode penyambungan","482 731")}
        ${plainRow("Perangkat tersambung","Android Studio • simulasi")}
      </div>`:""}
      <div class="system-note">ⓘ <span>${state.devWirelessDebugging?"ADB nirkabel simulasi aktif.":"Aktifkan untuk menampilkan IP, port, dan kode pairing simulasi."} Tidak ada port ADB nyata yang dibuka.</span></div>
    </div>`;
  }

  function renderDeveloperSelectDebugApp() {
    const apps=SIM_APPS.filter(app=>app.id!=="settings-app").slice(0,24);
    root.innerHTML=`<div class="a17-page system-page developer-subpage">${topbar("Pilih aplikasi")}
      <div class="a17-card system-card">
        <button class="a17-row developer-debug-app" type="button" data-developer-debug-app=""><span class="a17-copy"><strong>Tidak ada</strong><span>Jangan debug aplikasi</span></span>${!state.devDebugApp?`<span class="language-check">✓</span>`:""}</button>
        ${apps.map(app=>`<button class="a17-row developer-debug-app" type="button" data-developer-debug-app="${app.id}"><span class="sim-app-icon tone-${app.tone}">${app.glyph}</span><span class="a17-copy"><strong>${escapeHtml(app.name)}</strong><span>${state.devDebugApp===app.id?"Aplikasi debug terpilih":"Pilih untuk debug simulasi"}</span></span>${state.devDebugApp===app.id?`<span class="language-check">✓</span>`:""}</button>`).join("")}
      </div>
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
    const normal = [[t("deviceName"), "Google Pixel 10"], [t("model"), "Frankel"]];
    const buildInfo = {
      securityUpdate: "5 Agustus 2026",
      vendorSecurityPatch: "1 Agustus 2026",
      basebandVersion: "2.7.c4-wf-260818.18-1833_0710_8f29c7d5a1",
      kernelVersion: "6.12.25-android16-GKI-waifukernel-simulator",
      buildDate: "Sel 18 Agu 18:33:00 WIB 2026",
      buildNumber: "WG17.260818.2"
    };
    const detailRows = [
      [t("securityUpdate"), buildInfo.securityUpdate],
      [t("vendorSecurityPatch"), buildInfo.vendorSecurityPatch],
      [t("basebandVersion"), buildInfo.basebandVersion],
      [t("kernelVersion"), `${buildInfo.kernelVersion}<br><small>#1 ${buildInfo.buildDate}</small>`],
      [t("buildDate"), buildInfo.buildDate],
      [t("build"), buildInfo.buildNumber]
    ];
    root.innerHTML = `<div class="a17-page wallstyle-page">${topbar(t("aboutPhone"))}<div class="about-hero"><div class="about-glyph">G</div><h4>Google Pixel 10</h4><p>Android 17 • Model Frankel</p></div><div class="a17-card about-device-card">${normal.map(d => `<div class="a17-row"><span class="a17-copy"><strong>${d[0]}</strong><span>${d[1]}</span></span></div>`).join("")}<button class="a17-row android-version-entry" type="button" data-nav="androidEasterEgg"><span class="a17-copy"><strong>${t("androidVersion")}</strong><span>17</span></span><span class="a17-chevron">›</span></button>${detailRows.map(d => `<div class="a17-row about-build-row"><span class="a17-copy"><strong>${d[0]}</strong><span>${d[1]}</span></span></div>`).join("")}</div></div>`;
  }

  function renderAndroidEasterEgg() {
    easterLoopToken += 1;
    const token=easterLoopToken;
    root.innerHTML=`<div class="a17-page android17-easter-page"><canvas id="android17EasterCanvas" aria-label="Android 17 easter egg"></canvas><button class="android17-badge" id="android17Badge" type="button" aria-label="Android 17"><span>ANDROID</span><b>17</b><i></i></button><button class="easter-back" type="button" data-nav="about">‹</button><div class="easter-hint">Tekan lama logo Android 17 untuk membuka mini game</div></div>`;
    requestAnimationFrame(()=>startAndroid17EasterAnimation(token));
  }

  function startAndroid17EasterAnimation(token) {
    const canvas=$("#android17EasterCanvas",root); if(!canvas||state.view!=="androidEasterEgg") return;
    const ctx=canvas.getContext("2d");
    const rect=canvas.getBoundingClientRect(); const dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.max(1,Math.floor(rect.width*dpr)); canvas.height=Math.max(1,Math.floor(rect.height*dpr)); ctx.scale(dpr,dpr);
    const w=rect.width,h=rect.height,cx=w/2,cy=h/2;
    const rand=(seed)=>{const x=Math.sin(seed*91.17)*43758.5453;return x-Math.floor(x)};
    const stars=Array.from({length:72},(_,i)=>({x:rand(i+2)*w,y:rand(i+90)*h,s:rand(i+190)*1.5+.45}));
    const ring=Array.from({length:20},(_,i)=>{const a=i/20*Math.PI*2-.7;return{x:cx+Math.cos(a)*Math.min(w,h)*.28,y:cy+Math.sin(a)*Math.min(w,h)*.28}});
    const started=performance.now();
    const draw=(now)=>{
      if(token!==easterLoopToken||state.view!=="androidEasterEgg"||!canvas.isConnected)return;
      const t=Math.min(1,(now-started)/2600);
      ctx.fillStyle="#020306";ctx.fillRect(0,0,w,h);
      ctx.fillStyle="#fff";stars.forEach((s,i)=>{const pulse=.45+.55*Math.sin(now/620+i);ctx.globalAlpha=.35+pulse*.6;ctx.fillRect(s.x,s.y,s.s,s.s)});ctx.globalAlpha=1;
      ring.forEach((p,i)=>{ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(p.x,p.y,2.1,0,Math.PI*2);ctx.fill();});
      const shown=Math.floor(t*(ring.length-1));
      ctx.strokeStyle="#ef5bd5";ctx.lineWidth=2.2;ctx.beginPath();
      ring.slice(0,shown+1).forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
      if(t<1) requestAnimationFrame(draw); else $("#android17Badge",root)?.classList.add("show");
    };
    requestAnimationFrame(draw);
    const badge=$("#android17Badge",root); if(badge){
      let timer=null;
      const start=()=>{badge.classList.add("pressing"); timer=setTimeout(()=>{timer=null; vibrate(35); badge.classList.add("launch"); setTimeout(()=>navigate("android16Game"),380)},650)};
      const stop=()=>{badge.classList.remove("pressing"); if(timer){clearTimeout(timer);timer=null;}};
      badge.addEventListener("pointerdown",start); badge.addEventListener("pointerup",stop); badge.addEventListener("pointercancel",stop); badge.addEventListener("pointerleave",stop);
    }
  }

  function renderAndroid16Game() {
    spaceGameLoopToken += 1;
    const token=spaceGameLoopToken;
    root.innerHTML=`<div class="a17-page android16-space-page"><canvas id="android16SpaceCanvas" aria-label="Android 16 space mini game"></canvas><button class="easter-back space-back" type="button" data-nav="androidEasterEgg">‹</button><div class="space-hud" id="spaceHud"><b>STAR</b><span>RADIUS 3475</span><span>BODIES 3</span><span>THR 100%</span><span>POS 0, 0</span><span>VEL 0</span></div><button class="space-auto ${android16AutoPilot?"on":""}" id="spaceAuto" type="button">AUTO</button><div class="space-help">Sentuh untuk mengarahkan • WASD / Arrow untuk dorongan</div></div>`;
    requestAnimationFrame(()=>startAndroid16SpaceGame(token));
  }

  function startAndroid16SpaceGame(token) {
    const canvas=$("#android16SpaceCanvas",root); if(!canvas||state.view!=="android16Game")return;
    const ctx=canvas.getContext("2d"); const rect=canvas.getBoundingClientRect(); const dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.floor(rect.width*dpr);canvas.height=Math.floor(rect.height*dpr);ctx.scale(dpr,dpr);
    const w=rect.width,h=rect.height;
    let ship={x:0,y:0,vx:0,vy:0,angle:-Math.PI/2};
    let target={x:180,y:-220};
    const bodies=[{x:145,y:-180,r:9},{x:-210,y:120,r:13},{x:260,y:210,r:7}];
    const keys=new Set();
    const rand=(seed)=>{const x=Math.sin(seed*71.31)*31911.73;return x-Math.floor(x)};
    const stars=Array.from({length:115},(_,i)=>({x:rand(i+3)*w,y:rand(i+130)*h,a:.25+rand(i+300)*.7}));
    const keyDown=e=>{if(state.view!=="android16Game"||/INPUT|TEXTAREA/.test(e.target?.tagName||""))return; if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","W","A","S","D"].includes(e.key)){e.preventDefault();keys.add(e.key.toLowerCase())}};
    const keyUp=e=>keys.delete(String(e.key).toLowerCase()); window.addEventListener("keydown",keyDown);window.addEventListener("keyup",keyUp);
    canvas.addEventListener("pointerdown",e=>{const r=canvas.getBoundingClientRect(); target={x:ship.x+(e.clientX-r.left-w/2)*2,y:ship.y+(e.clientY-r.top-h/2)*2};android16AutoPilot=false;$("#spaceAuto",root)?.classList.remove("on")});
    $("#spaceAuto",root)?.addEventListener("click",()=>{android16AutoPilot=!android16AutoPilot;$("#spaceAuto",root)?.classList.toggle("on",android16AutoPilot)});
    let last=performance.now();
    const frame=now=>{
      if(token!==spaceGameLoopToken||state.view!=="android16Game"||!canvas.isConnected){window.removeEventListener("keydown",keyDown);window.removeEventListener("keyup",keyUp);return;}
      const dt=Math.min(.035,(now-last)/1000||.016);last=now;
      let ax=0,ay=0;
      if(keys.has("w")||keys.has("arrowup"))ay-=1;if(keys.has("s")||keys.has("arrowdown"))ay+=1;if(keys.has("a")||keys.has("arrowleft"))ax-=1;if(keys.has("d")||keys.has("arrowright"))ax+=1;
      if(android16AutoPilot||(!ax&&!ay)){const dx=target.x-ship.x,dy=target.y-ship.y,d=Math.hypot(dx,dy)||1;if(android16AutoPilot&&d>10){ax=dx/d;ay=dy/d}}
      const mag=Math.hypot(ax,ay)||1;if(ax||ay){ax/=mag;ay/=mag;ship.vx+=ax*78*dt;ship.vy+=ay*78*dt;ship.angle=Math.atan2(ay,ax)+Math.PI/2}
      ship.vx*=.995;ship.vy*=.995;ship.x+=ship.vx*dt;ship.y+=ship.vy*dt;
      ctx.fillStyle="#101014";ctx.fillRect(0,0,w,h);ctx.fillStyle="#d9d9df";stars.forEach(s=>{ctx.globalAlpha=s.a;ctx.fillRect(s.x,s.y,1,1)});ctx.globalAlpha=1;
      const sx=w/2,sy=h/2;
      ctx.strokeStyle="#1bc74f";ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx,sy,Math.min(w,h)*.25,0,Math.PI*2);ctx.stroke();
      bodies.forEach((b,i)=>{const x=sx+(b.x-ship.x)*.22,y=sy+(b.y-ship.y)*.22;ctx.fillStyle=i?"#9aa0a6":"#e2e6eb";ctx.beginPath();ctx.arc(x,y,b.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#46505b";ctx.stroke()});
      const tx=sx+(target.x-ship.x)*.22,ty=sy+(target.y-ship.y)*.22;ctx.strokeStyle="#174f2a";ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(tx,ty);ctx.stroke();ctx.setLineDash([]);
      ctx.save();ctx.translate(sx,sy);ctx.rotate(ship.angle);ctx.fillStyle="#f3f4f7";ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(5,6);ctx.lineTo(0,3);ctx.lineTo(-5,6);ctx.closePath();ctx.fill();if(ax||ay||android16AutoPilot){ctx.strokeStyle="#36d15c";ctx.beginPath();ctx.moveTo(0,7);ctx.lineTo(0,18);ctx.stroke()}ctx.restore();
      const hud=$("#spaceHud",root);if(hud){const sp=Math.hypot(ship.vx,ship.vy);hud.innerHTML=`<b>STAR</b><span>RADIUS 3475</span><span>BODIES ${bodies.length}</span><span>THR ${Math.round((ax||ay||android16AutoPilot)?100:0)}%</span><span>POS ${Math.round(ship.x)}, ${Math.round(ship.y)}</span><span>VEL ${sp.toFixed(1)}</span>`}
      requestAnimationFrame(frame);
    };requestAnimationFrame(frame);
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

  function financeBiometricMarkup(app) {
    return `<div class="a17-page sim-app-page finance-biometric-page tone-${app.tone}">
      ${simAppTopbar(app)}
      <div class="finance-biometric-scrim">
        <section class="finance-biometric-sheet">
          <span class="finance-auth-app-icon sim-app-icon tone-${app.tone}">${app.glyph}</span>
          <small>Keamanan ${escapeHtml(app.name)}</small>
          <h3>Verifikasi identitas</h3>
          <p>Sentuh sensor sidik jari untuk masuk ke ${escapeHtml(app.name)}.</p>

          <button class="finance-fingerprint-button ${financialAuthBusy ? "scanning" : ""}"
            type="button" data-sim-action="finance-biometric-auth"
            aria-label="Verifikasi sidik jari">
            <span class="finance-fingerprint-glyph"><i></i><i></i><i></i><i></i></span>
          </button>

          <strong class="finance-biometric-status">${financialAuthBusy ? "Memindai sidik jari…" : "Sentuh sensor sidik jari"}</strong>
          <small class="finance-biometric-device">Sidik jari tersimpan • Google Pixel 10</small>
          <button class="finance-biometric-cancel" type="button" data-sim-action="finance-biometric-cancel">Batal</button>
        </section>

        <button class="finance-display-fingerprint ${financialAuthBusy ? "scanning" : ""}"
          type="button" data-sim-action="finance-biometric-auth"
          aria-label="Sensor sidik jari di layar">
          <span class="finance-fingerprint-glyph compact"><i></i><i></i><i></i><i></i></span>
        </button>
      </div>
    </div>`;
  }

  function renderFinancialApp(app) {
    if (financialAuthSession !== app.id) {
      root.innerHTML = financeBiometricMarkup(app);
      return;
    }

    root.innerHTML = `<div class="a17-page sim-app-page finance-app tone-${app.tone}">${simAppTopbar(app)}
      <div class="finance-sim-badge">SIMULASI • bukan saldo nyata</div>
      <section class="finance-profile"><div><small>Nama akun</small><strong>Skenakun</strong></div><span>${app.glyph}</span></section>
      <section class="finance-balance"><small>Saldo tersedia</small><strong>${SIM_BALANCE}</strong><span>IDR • data demo lokal</span></section>
      <div class="finance-actions"><button data-sim-action="finance-transfer">⇄<small>Transfer</small></button><button data-sim-action="finance-pay">▣<small>Bayar</small></button><button data-sim-action="finance-topup">＋<small>Top Up</small></button><button data-sim-action="finance-history">◷<small>Riwayat</small></button></div>
      <div class="sim-card"><strong>Autentikasi berhasil</strong><p>Sidik jari terverifikasi untuk sesi ${escapeHtml(app.name)} ini. Keluar dari aplikasi akan meminta verifikasi ulang.</p></div>
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

  function mediaSafeHtml(value = "") {
    return escapeHtml(String(value || ""));
  }

  function spotifyRedirectUri() {
    return `${location.origin}${location.pathname}`;
  }

  function spotifySessionToken() {
    const token = sessionStorage.getItem("wg_spotify_access_token") || "";
    const expires = Number(sessionStorage.getItem("wg_spotify_expires_at") || 0);
    if (!token || (expires && Date.now() > expires - 15000)) return "";
    return token;
  }

  function youtubeSessionToken() {
    return sessionStorage.getItem("wg_youtube_access_token") || "";
  }

  function randomVerifier(size = 64) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const bytes = new Uint8Array(size);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => chars[b % chars.length]).join("");
  }

  async function pkceChallenge(verifier) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function spotifyEmbedFromUrl(raw) {
    const value = String(raw || "").trim();
    if (!value) return "";
    try {
      let type = "", id = "";
      const uri = value.match(/^spotify:(track|album|playlist|artist|episode|show):([A-Za-z0-9]+)$/i);
      if (uri) { type = uri[1].toLowerCase(); id = uri[2]; }
      else {
        const u = new URL(value);
        if (!/(^|\.)open\.spotify\.com$/i.test(u.hostname)) return "";
        const parts = u.pathname.split("/").filter(Boolean);
        const idx = parts.findIndex(x => ["track","album","playlist","artist","episode","show"].includes(x));
        if (idx < 0 || !parts[idx+1]) return "";
        type = parts[idx]; id = parts[idx+1];
      }
      if (!/^[A-Za-z0-9]+$/.test(id)) return "";
      return `https://open.spotify.com/embed/${type}/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
    } catch { return ""; }
  }

  function youtubeEmbedFromUrl(raw) {
    const value = String(raw || "").trim();
    if (!value) return "";
    try {
      const u = new URL(value);
      const host = u.hostname.toLowerCase().replace(/^www\./, "");
      const isYoutube = host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com" || host === "youtube-nocookie.com";
      const isShort = host === "youtu.be";
      if (!isYoutube && !isShort) return "";

      let video = "", list = u.searchParams.get("list") || "", start = 0;
      if (isShort) video = u.pathname.split("/").filter(Boolean)[0] || "";
      if (isYoutube) {
        if (u.pathname === "/watch") video = u.searchParams.get("v") || "";
        else if (u.pathname === "/playlist") list = u.searchParams.get("list") || "";
        else if (/^\/(shorts|embed|live)\//.test(u.pathname)) video = u.pathname.split("/").filter(Boolean)[1] || "";
      }

      const t = u.searchParams.get("t") || u.searchParams.get("start") || "";
      if (/^\d+$/.test(t)) start = Number(t);
      else {
        const m = String(t).match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
        if (m && m[0]) start = (Number(m[1] || 0) * 3600) + (Number(m[2] || 0) * 60) + Number(m[3] || 0);
      }

      const safe = x => /^[A-Za-z0-9_-]{6,}$/.test(x || "") ? x : "";
      video = safe(video); list = safe(list);
      if (!video && !list) return "";

      // YouTube can reject an embed with error 153 when the request does not
      // provide a referrer / equivalent client identity. Use the regular
      // youtube.com embed endpoint and explicitly identify this GitHub Pages
      // origin. Keep autoplay enabled because the iframe is created by the
      // user's Putar action; if a browser blocks autoplay the native play
      // button still works.
      const origin = location.origin && location.origin !== "null" ? location.origin : "https://skenakun.github.io";
      const referrer = location.href && /^https?:/i.test(location.href) ? location.href : `${origin}/`;
      const params = new URLSearchParams({
        playsinline: "1",
        rel: "0",
        autoplay: "1",
        controls: "1",
        enablejsapi: "1",
        origin,
        widget_referrer: referrer
      });
      if (start) params.set("start", String(start));
      if (list && video) params.set("list", list);

      if (list && !video) {
        params.set("list", list);
        return `https://www.youtube.com/embed/videoseries?${params.toString()}`;
      }
      return `https://www.youtube.com/embed/${encodeURIComponent(video)}?${params.toString()}`;
    } catch { return ""; }
  }

  function upgradeStoredYoutubeEmbed(raw) {
    const value = String(raw || "").trim();
    if (!value) return "";
    try {
      const u = new URL(value);
      const host = u.hostname.toLowerCase();
      if (!host.endsWith("youtube.com") && !host.endsWith("youtube-nocookie.com")) return "";
      u.protocol = "https:";
      u.hostname = "www.youtube.com";
      const origin = location.origin && location.origin !== "null" ? location.origin : "https://skenakun.github.io";
      const referrer = location.href && /^https?:/i.test(location.href) ? location.href : `${origin}/`;
      u.searchParams.set("playsinline", "1");
      u.searchParams.set("rel", "0");
      u.searchParams.set("controls", "1");
      u.searchParams.set("enablejsapi", "1");
      u.searchParams.set("origin", origin);
      u.searchParams.set("widget_referrer", referrer);
      return u.toString();
    } catch { return ""; }
  }

  function mediaStateForApp(appId = state.activeSimApp) {
    if (appId === "spotify") return { embedKey:"spotifyEmbedUrl", urlKey:"spotifyLastUrl", inputId:"spotifyUrlInput" };
    if (appId === "youtube-music") return { embedKey:"youtubeMusicEmbedUrl", urlKey:"youtubeMusicLastUrl", inputId:"youtubeUrlInput" };
    return { embedKey:"youtubeEmbedUrl", urlKey:"youtubeLastUrl", inputId:"youtubeUrlInput" };
  }

  function openPastedMediaLink(raw, appId = state.activeSimApp) {
    const value = String(raw || "").trim();
    const cfg = mediaStateForApp(appId);
    let embed = "";
    if (appId === "spotify") embed = spotifyEmbedFromUrl(value);
    else embed = youtubeEmbedFromUrl(value);
    if (!embed) { toast(appId === "spotify" ? "Tautan Spotify tidak dikenali" : "Tautan YouTube / YouTube Music tidak dikenali"); return false; }
    state[cfg.embedKey] = embed;
    state[cfg.urlKey] = value;
    state.mediaEmbedUrl = embed; // migrasi kompatibilitas versi lama
    save();

    /*
     * V12: media is owned by a persistent player outside #androidScreenRoot.
     * The normal Android render may replace root.innerHTML, but it must never
     * replace the active YouTube / YouTube Music / Spotify iframe.
     */
    if (window.__waifuPersistentMediaBridgeV12?.start) {
      window.__waifuPersistentMediaBridgeV12.start(appId, value, { embed });
    }

    render();
    return true;
  }

  /*
   * FIX 74abda6: one owner for media-link paste.
   *
   * Clipboard read permission is browser controlled. On Chromium/Android the
   * permission can be denied even though the user clicked "Tempel". Try the
   * modern Clipboard API first, then a legacy paste attempt, and finally show
   * a native paste box instead of silently doing nothing.
   *
   * Pasting only fills/saves the URL. Playback remains an explicit "Putar"
   * action so the iframe is created from a clear user playback gesture.
   */
  async function pasteMediaLinkFromClipboard(appId = state.activeSimApp) {
    const cfg = mediaStateForApp(appId);
    const input = $("#" + cfg.inputId, root);
    let value = "";

    try {
      if (window.isSecureContext && navigator.clipboard?.readText) {
        value = String(await navigator.clipboard.readText() || "").trim();
      }
    } catch {
      // Continue to browser-compatible fallbacks below.
    }

    if (!value) {
      const probe = document.createElement("textarea");
      probe.setAttribute("aria-hidden", "true");
      probe.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";
      document.body.appendChild(probe);
      probe.focus();
      try {
        if (document.queryCommandSupported?.("paste")) {
          document.execCommand("paste");
          value = String(probe.value || "").trim();
        }
      } catch {}
      probe.remove();
    }

    if (!value) {
      input?.focus();
      input?.select?.();
      const manual = window.prompt(
        appId === "spotify"
          ? "Browser memblokir akses clipboard otomatis. Tempel link Spotify di sini:"
          : "Browser memblokir akses clipboard otomatis. Tempel link YouTube / YouTube Music di sini:",
        input?.value || ""
      );
      if (manual === null) {
        toast("Tempel dibatalkan");
        return false;
      }
      value = String(manual || "").trim();
    }

    if (!value) {
      toast("Clipboard kosong");
      input?.focus();
      return false;
    }

    const validEmbed = appId === "spotify"
      ? spotifyEmbedFromUrl(value)
      : youtubeEmbedFromUrl(value);

    if (!validEmbed) {
      if (input) input.value = value;
      toast(appId === "spotify"
        ? "Tautan Spotify tidak dikenali"
        : "Tautan YouTube / YouTube Music tidak dikenali");
      input?.focus();
      return false;
    }

    if (input) input.value = value;
    state[cfg.urlKey] = value;
    save();
    toast("Link ditempel. Tekan Putar.");
    input?.focus();
    return true;
  }

  function renderSpotifyApp(app) {
    const connected = !!spotifySessionToken();
    const configured = !!state.spotifyClientId;
    const legacy = state.mediaEmbedUrl && state.mediaEmbedUrl.includes("open.spotify.com/embed/") ? state.mediaEmbedUrl : "";
    const embed = state.spotifyEmbedUrl || legacy || "";
    const persistentActive = !!window.__waifuPersistentMediaBridgeV12?.isActive?.("spotify");
    return `<div class="a17-page spotify-live-app">${simAppTopbar(app)}
      <div class="media-live-head"><div><h2>Spotify</h2><small>${connected ? "Akun terhubung dengan OAuth" : "Pemutar resmi Spotify"}</small></div><span class="media-security-pill">OAuth</span></div>
      <div class="media-auth-card">
        <strong>${connected ? "Spotify terhubung" : "Hubungkan Spotify"}</strong>
        <p>${connected ? "Playlist akun dimuat lewat Spotify Web API. Cookie browser tidak dibaca oleh simulator." : "Masukkan Client ID Spotify milik aplikasi web Anda. Login memakai Authorization Code + PKCE, bukan mengambil cookie browser."}</p>
        <label>Spotify Client ID<input id="spotifyClientIdInput" value="${mediaSafeHtml(state.spotifyClientId)}" placeholder="Client ID dari Spotify Developer Dashboard"></label>
        <small>Redirect URI: <code>${mediaSafeHtml(spotifyRedirectUri())}</code></small>
        <div class="media-auth-actions"><button class="sim-primary" data-sim-action="spotify-connect">${connected ? "Hubungkan ulang" : "Hubungkan Spotify"}</button>${connected ? '<button data-sim-action="spotify-disconnect">Putuskan</button>' : ""}</div>
      </div>
      <div class="media-paste-card roleplay-link-card"><div class="media-paste-title"><strong>Putar dari link</strong><span>Mode HP Roleplay</span></div><p>Tempel link Spotify publik. Tidak perlu mengambil cookie browser.</p><label class="media-paste-row"><input id="spotifyUrlInput" value="${mediaSafeHtml(state.spotifyLastUrl || "")}" placeholder="https://open.spotify.com/track/..."><button type="button" class="media-clip-btn" data-sim-action="media-paste-clipboard">Tempel</button><button type="button" data-sim-action="spotify-open-url">Putar</button></label><small>Track, album, playlist, artist, episode, show, dan URI spotify:track:... didukung.</small></div>
      <div id="spotifyAccountArea" class="media-account-area">${connected ? '<div class="media-loading">Memuat profil dan playlist…</div>' : '<div class="media-empty">Hubungkan akun untuk melihat playlist Anda.</div>'}</div>
      <div class="media-embed-shell" id="spotifyEmbedShell">${persistentActive
        ? '<div class="media-empty persistent-core-placeholder">Spotify tetap diputar di background.</div>'
        : (embed ? `<iframe src="${mediaSafeHtml(embed)}" title="Spotify player" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>` : '<div class="media-empty">Tempel tautan track, album, artist, atau playlist untuk memutar lewat embed resmi Spotify.</div>')}</div>
      <p class="sim-disclaimer">Simulator tidak menyalin cookie, password, atau sesi Spotify dari browser. Login akun dilakukan langsung oleh Spotify.</p>
    </div>`;
  }

  function renderYouTubeLiveApp(app, music = false) {
    const connected = !!youtubeSessionToken();
    const cfg = mediaStateForApp(app.id);
    const lastUrl = String(state[cfg.urlKey] || "").trim();
    const rebuilt = lastUrl ? youtubeEmbedFromUrl(lastUrl) : "";
    const legacyRaw = state[cfg.embedKey] || (state.mediaEmbedUrl && /youtube(?:-nocookie)?\.com\/embed\//.test(state.mediaEmbedUrl) ? state.mediaEmbedUrl : "");
    const migrated = upgradeStoredYoutubeEmbed(legacyRaw);
    const embed = rebuilt || migrated || "";
    const persistentActive = !!window.__waifuPersistentMediaBridgeV12?.isActive?.(app.id);
    // Migrate older youtube-nocookie/localStorage values automatically so a
    // user who already pasted a link does not stay stuck on the broken player.
    if (embed && state[cfg.embedKey] !== embed) {
      state[cfg.embedKey] = embed;
      state.mediaEmbedUrl = embed;
      save();
    }
    return `<div class="a17-page youtube-live-app ${music ? "music" : ""}">${simAppTopbar(app)}
      <div class="media-live-head"><div><h2>${music ? "YouTube Music" : "YouTube"}</h2><small>${connected ? "Akun Google terhubung dengan OAuth" : "Player YouTube realtime"}</small></div><span class="media-security-pill">Google OAuth</span></div>
      <div class="media-auth-card">
        <strong>${connected ? "Akun YouTube terhubung" : "Hubungkan YouTube"}</strong>
        <p>${connected ? "Playlist akun diambil melalui YouTube Data API dengan izin Anda." : "Masukkan OAuth Client ID untuk web. Browser tidak memberikan cookie YouTube kepada website lain, jadi akses akun dilakukan melalui OAuth."}</p>
        <label>Google OAuth Client ID<input id="googleOAuthClientIdInput" value="${mediaSafeHtml(state.googleOAuthClientId)}" placeholder="xxxx.apps.googleusercontent.com"></label>
        <div class="media-auth-actions"><button class="sim-primary" data-sim-action="youtube-connect">${connected ? "Hubungkan ulang" : "Hubungkan Google"}</button>${connected ? '<button data-sim-action="youtube-disconnect">Putuskan</button>' : ""}</div>
      </div>
      <div class="media-paste-card roleplay-link-card"><div class="media-paste-title"><strong>${music ? "Putar YouTube Music dari link" : "Putar YouTube dari link"}</strong><span>Mode HP Roleplay</span></div><p>${music ? "Tempel link music.youtube.com atau YouTube biasa. Video musik akan diputar langsung di player." : "Tempel link video, Shorts, Live, atau playlist seperti pada HP FiveM/GTA RP."}</p><label class="media-paste-row"><input id="youtubeUrlInput" value="${mediaSafeHtml(state[cfg.urlKey] || "")}" placeholder="${music ? "https://music.youtube.com/watch?v=..." : "https://youtu.be/... atau https://youtube.com/watch?v=..."}"><button type="button" class="media-clip-btn" data-sim-action="media-paste-clipboard">Tempel</button><button type="button" data-sim-action="youtube-open-url">Putar</button></label><small>Link akan disimpan hanya di simulator browser ini.</small></div>
      <div id="youtubeAccountArea" class="media-account-area">${connected ? '<div class="media-loading">Memuat playlist akun…</div>' : '<div class="media-empty">Hubungkan akun untuk memuat playlist Anda secara realtime.</div>'}</div>
      <div class="media-embed-shell youtube" id="youtubeEmbedShell">${persistentActive
        ? `<div class="media-empty persistent-core-placeholder">${music ? "YouTube Music" : "YouTube"} tetap diputar di background.</div>`
        : (embed ? `<iframe src="${mediaSafeHtml(embed)}" title="${music ? "YouTube Music" : "YouTube"} player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share" referrerpolicy="origin-when-cross-origin" loading="eager" allowfullscreen></iframe>` : '<div class="media-empty">Tempel tautan YouTube untuk mulai memutar.</div>')}</div>
      <p class="youtube-player-note">Player dibuat minimal 200 × 200 px sesuai persyaratan YouTube. Jika satu video menolak embed dari pemiliknya, coba video lain yang mengizinkan pemutaran tersemat.</p>
      <p class="sim-disclaimer">${music ? "YouTube Music di simulator memakai player dan playlist YouTube resmi." : "Video diputar lewat YouTube embedded player."} Cookie akun tidak diekstrak.</p>
    </div>`;
  }

  async function startSpotifyOAuth() {
    const input = $("#spotifyClientIdInput", root);
    const clientId = (input?.value || state.spotifyClientId || "").trim();
    if (!clientId) { toast("Masukkan Spotify Client ID terlebih dahulu"); return; }
    state.spotifyClientId = clientId; save();
    const verifier = randomVerifier(64);
    const challenge = await pkceChallenge(verifier);
    const csrf = randomVerifier(24);
    sessionStorage.setItem("wg_spotify_verifier", verifier);
    sessionStorage.setItem("wg_spotify_oauth_state", csrf);
    sessionStorage.setItem("wg_spotify_return", "1");
    const u = new URL("https://accounts.spotify.com/authorize");
    u.searchParams.set("client_id", clientId);
    u.searchParams.set("response_type", "code");
    u.searchParams.set("redirect_uri", spotifyRedirectUri());
    u.searchParams.set("code_challenge_method", "S256");
    u.searchParams.set("code_challenge", challenge);
    u.searchParams.set("state", csrf);
    u.searchParams.set("scope", "user-read-private playlist-read-private playlist-read-collaborative user-library-read");
    location.assign(u.toString());
  }

  async function completeSpotifyOAuthIfPresent() {
    const params = new URLSearchParams(location.search);
    const code = params.get("code"), returnedState = params.get("state"), err = params.get("error");
    const verifier = sessionStorage.getItem("wg_spotify_verifier") || "";
    const expectedState = sessionStorage.getItem("wg_spotify_oauth_state") || "";
    if (err && sessionStorage.getItem("wg_spotify_return")) {
      history.replaceState({}, "", spotifyRedirectUri());
      sessionStorage.removeItem("wg_spotify_return");
      return false;
    }
    if (!code || !verifier || !state.spotifyClientId || returnedState !== expectedState) return false;
    try {
      const body = new URLSearchParams({
        client_id: state.spotifyClientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: spotifyRedirectUri(),
        code_verifier: verifier
      });
      const res = await fetch("https://accounts.spotify.com/api/token", { method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body });
      if (!res.ok) throw new Error("spotify-token");
      const tok = await res.json();
      sessionStorage.setItem("wg_spotify_access_token", tok.access_token || "");
      sessionStorage.setItem("wg_spotify_expires_at", String(Date.now() + Number(tok.expires_in || 3600) * 1000));
      if (tok.refresh_token) sessionStorage.setItem("wg_spotify_refresh_token", tok.refresh_token);
      state.activeSimApp = "spotify"; state.view = "simApp"; state.locked = false; save();
      history.replaceState({}, "", spotifyRedirectUri());
      ["wg_spotify_verifier","wg_spotify_oauth_state","wg_spotify_return"].forEach(k=>sessionStorage.removeItem(k));
      return true;
    } catch {
      history.replaceState({}, "", spotifyRedirectUri());
      return false;
    }
  }

  async function hydrateSpotifyAccount() {
    const token = spotifySessionToken();
    const area = $("#spotifyAccountArea", root);
    if (!token || !area) return;
    try {
      const headers = { Authorization:`Bearer ${token}` };
      const [meRes, plRes] = await Promise.all([
        fetch("https://api.spotify.com/v1/me", {headers}),
        fetch("https://api.spotify.com/v1/me/playlists?limit=20", {headers})
      ]);
      if (!meRes.ok || !plRes.ok) throw new Error("spotify-api");
      const me = await meRes.json(), playlists = await plRes.json();
      area.innerHTML = `<div class="media-profile"><div>${me.images?.[0]?.url ? `<img src="${mediaSafeHtml(me.images[0].url)}" alt="">` : '<span>♫</span>'}</div><section><b>${mediaSafeHtml(me.display_name || "Spotify")}</b><small>${mediaSafeHtml(me.product || "akun Spotify")}</small></section></div><div class="media-list">${(playlists.items || []).map(p=>`<button type="button" data-spotify-playlist="${mediaSafeHtml(p.id)}"><span>${p.images?.[0]?.url ? `<img src="${mediaSafeHtml(p.images[0].url)}" alt="">` : "♫"}</span><div><b>${mediaSafeHtml(p.name)}</b><small>${Number(p.tracks?.total || 0)} lagu</small></div></button>`).join("") || '<div class="media-empty">Tidak ada playlist.</div>'}</div>`;
      $$("[data-spotify-playlist]", area).forEach(btn => btn.addEventListener("click", () => {
        const playlistId = btn.dataset.spotifyPlaylist || "";
        const embed = `https://open.spotify.com/embed/playlist/${encodeURIComponent(playlistId)}?utm_source=generator&theme=0`;
        state.spotifyEmbedUrl = embed;
        state.spotifyLastUrl = `https://open.spotify.com/playlist/${encodeURIComponent(playlistId)}`;
        state.mediaEmbedUrl = embed;
        save();
        window.__waifuPersistentMediaBridgeV12?.start?.("spotify", state.spotifyLastUrl, {
          embed,
          title: btn.querySelector("b")?.textContent?.trim() || "Spotify Playlist"
        });
        render();
      }));
    } catch { area.innerHTML = '<div class="media-empty">Sesi Spotify tidak dapat dimuat. Hubungkan ulang akun.</div>'; }
  }

  function loadGoogleIdentityScript() {
    if (window.google?.accounts?.oauth2) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-wg-google-oauth]');
      if (existing) { existing.addEventListener("load", resolve, {once:true}); existing.addEventListener("error", reject, {once:true}); return; }
      const sc = document.createElement("script");
      sc.src = "https://accounts.google.com/gsi/client"; sc.async = true; sc.defer = true; sc.dataset.wgGoogleOauth = "1";
      sc.onload = resolve; sc.onerror = reject; document.head.appendChild(sc);
    });
  }

  async function startYouTubeOAuth() {
    const input = $("#googleOAuthClientIdInput", root);
    const clientId = (input?.value || state.googleOAuthClientId || "").trim();
    if (!clientId) { toast("Masukkan Google OAuth Client ID terlebih dahulu"); return; }
    state.googleOAuthClientId = clientId; save();
    try {
      await loadGoogleIdentityScript();
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "https://www.googleapis.com/auth/youtube.readonly",
        callback: resp => {
          if (resp?.access_token) {
            sessionStorage.setItem("wg_youtube_access_token", resp.access_token);
            sessionStorage.setItem("wg_youtube_expires_at", String(Date.now() + Number(resp.expires_in || 3600)*1000));
            render();
          } else toast("Login Google dibatalkan");
        }
      });
      client.requestAccessToken({ prompt: youtubeSessionToken() ? "" : "consent" });
    } catch { toast("Google Identity Services gagal dimuat"); }
  }

  async function hydrateYouTubeAccount() {
    const token = youtubeSessionToken();
    const area = $("#youtubeAccountArea", root);
    if (!token || !area) return;
    try {
      const res = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&mine=true&maxResults=20", {headers:{Authorization:`Bearer ${token}`}});
      if (!res.ok) throw new Error("youtube-api");
      const data = await res.json();
      area.innerHTML = `<div class="media-list">${(data.items || []).map(p=>`<button type="button" data-youtube-playlist="${mediaSafeHtml(p.id)}"><span>${p.snippet?.thumbnails?.default?.url ? `<img src="${mediaSafeHtml(p.snippet.thumbnails.default.url)}" alt="">` : "▶"}</span><div><b>${mediaSafeHtml(p.snippet?.title || "Playlist")}</b><small>${Number(p.contentDetails?.itemCount || 0)} video</small></div></button>`).join("") || '<div class="media-empty">Tidak ada playlist pada akun ini.</div>'}</div>`;
      $$("[data-youtube-playlist]", area).forEach(btn => btn.addEventListener("click", () => {
        const playlistId = btn.dataset.youtubePlaylist || "";
        const cfg = mediaStateForApp(state.activeSimApp);
        const raw = `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`;
        const embed = youtubeEmbedFromUrl(raw);
        state[cfg.embedKey] = embed;
        state[cfg.urlKey] = raw;
        state.mediaEmbedUrl = embed;
        save();
        window.__waifuPersistentMediaBridgeV12?.start?.(state.activeSimApp, raw, {
          embed,
          title: btn.querySelector("b")?.textContent?.trim() || (state.activeSimApp === "youtube-music" ? "YouTube Music" : "YouTube")
        });
        render();
      }));
    } catch { area.innerHTML = '<div class="media-empty">Playlist YouTube tidak dapat dimuat. Coba hubungkan ulang.</div>'; }
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


  function simToolkitProfileMeta(id = state.simToolkitSelected) {
    if (id === "sim2") {
      return {
        id: "sim2",
        label: "Indosat",
        provider: "IM3 / Indosat Ooredoo Hutchison",
        number: "+62 857-••••-2843",
        type: "SIM fisik • Slot 2",
        enabledKey: "sim2Enabled",
        iccid: "8962 1000 5702 2843"
      };
    }

    if (id === "esim") {
      const provider = simProviderById(state.eSimProvider);
      return {
        id: "esim",
        label: provider?.name || "eSIM",
        provider: provider?.name || "Belum ada profil eSIM",
        number: state.eSimInstalled ? maskSimNumber(state.eSimPhone) : "Belum terpasang",
        type: "eSIM • SIM digital",
        enabledKey: "eSimEnabled",
        iccid: state.eSimInstalled ? (state.eSimIccid || "8962 0000 0000 0000") : "—"
      };
    }

    return {
      id: "sim1",
      label: "3",
      provider: "Tri Indonesia",
      number: maskSimNumber(state.simPhone1),
      type: "SIM fisik • Slot 1",
      enabledKey: "sim1Enabled",
      iccid: "8962 8901 3100 1842"
    };
  }

  function simToolkitPrimaryState(key, id) {
    return state[key] === id ? "active" : "";
  }

  function renderSimToolkitApp(app) {
    let selected = ["sim1", "sim2", "esim"].includes(state.simToolkitSelected)
      ? state.simToolkitSelected
      : "sim1";

    if (selected === "esim" && !state.eSimInstalled) {
      // Keep the eSIM card selectable so the user can start setup.
    }

    const profile = simToolkitProfileMeta(selected);
    const profileEnabled = selected === "esim"
      ? !!(state.eSimInstalled && state.eSimEnabled)
      : !!state[profile.enabledKey];

    const roamingMap = state.simToolkitRoaming && typeof state.simToolkitRoaming === "object"
      ? state.simToolkitRoaming
      : { sim1: false, sim2: false, esim: false };
    const roaming = !!roamingMap[selected];

    const profileCard = (id, title, badge, subtitle, enabled, extraClass = "") => `
      <button class="simtk-profile ${selected === id ? "active" : ""} ${extraClass}"
        type="button" data-sim-action="simtk-select-${id}">
        <span class="simtk-profile-badge">${badge}</span>
        <strong>${escapeHtml(title)}</strong>
        <small>${escapeHtml(subtitle)}</small>
        <i class="${enabled ? "on" : ""}"></i>
      </button>`;

    root.innerHTML = `<div class="a17-page sim-app-page sim-toolkit-app">
      ${simAppTopbar(app)}

      <section class="simtk-hero">
        <span class="simtk-hero-icon">SIM</span>
        <div>
          <strong>SIM Toolkit</strong>
          <small>Kelola SIM fisik dan eSIM di Google Pixel 10</small>
        </div>
      </section>

      <div class="simtk-section-label">Kartu SIM</div>
      <div class="simtk-profile-grid">
        ${profileCard("sim1", "3", "3", "SIM fisik • Slot 1", !!state.sim1Enabled)}
        ${profileCard("sim2", "Indosat", "IM3", "SIM fisik • Slot 2", !!state.sim2Enabled)}
        ${profileCard(
          "esim",
          state.eSimInstalled ? (simProviderById(state.eSimProvider)?.name || "eSIM") : "Tambahkan eSIM",
          "eSIM",
          state.eSimInstalled ? "SIM digital • Terpasang" : "SIM digital • Belum terpasang",
          !!(state.eSimInstalled && state.eSimEnabled),
          "esim"
        )}
      </div>

      <section class="simtk-card">
        <div class="simtk-profile-title">
          <span class="simtk-large-badge">${selected === "sim1" ? "3" : selected === "sim2" ? "IM3" : "eSIM"}</span>
          <div>
            <strong>${escapeHtml(profile.label)}</strong>
            <small>${escapeHtml(profile.type)}</small>
          </div>
          ${selected === "esim" && !state.eSimInstalled ? "" : `
            <button class="a17-switch ${profileEnabled ? "on" : ""}" type="button"
              data-sim-action="simtk-toggle-current" aria-label="Aktifkan SIM"></button>
          `}
        </div>

        ${selected === "esim" && !state.eSimInstalled ? `
          <div class="simtk-empty-esim">
            <p>Belum ada profil eSIM pada perangkat.</p>
            <button class="simtk-primary-action" type="button" data-sim-action="simtk-add-esim">＋ Tambahkan eSIM</button>
          </div>
        ` : `
          <div class="simtk-info-row"><span>Operator</span><strong>${escapeHtml(profile.provider)}</strong></div>
          <div class="simtk-info-row"><span>Nomor</span><strong>${escapeHtml(profile.number)}</strong></div>
          <div class="simtk-info-row"><span>ICCID</span><strong>${escapeHtml(profile.iccid)}</strong></div>

          <div class="simtk-switch-row">
            <div><strong>Roaming data</strong><small>Izinkan data saat berada di jaringan roaming</small></div>
            <button class="a17-switch ${roaming ? "on" : ""}" type="button" data-sim-action="simtk-toggle-roaming"></button>
          </div>
        `}
      </section>

      ${selected === "esim" && !state.eSimInstalled ? "" : `
        <div class="simtk-section-label">Jadikan SIM utama</div>
        <section class="simtk-card simtk-primary-settings">
          <div class="simtk-primary-row">
            <div><strong>Panggilan</strong><small>${simPrimaryLabel(state.primaryCallSim)}</small></div>
            <button class="${simToolkitPrimaryState("primaryCallSim", selected)}" type="button" data-sim-action="simtk-primary-call">Pilih</button>
          </div>
          <div class="simtk-primary-row">
            <div><strong>Pesan teks</strong><small>${simPrimaryLabel(state.primarySmsSim)}</small></div>
            <button class="${simToolkitPrimaryState("primarySmsSim", selected)}" type="button" data-sim-action="simtk-primary-sms">Pilih</button>
          </div>
          <div class="simtk-primary-row">
            <div><strong>Data seluler</strong><small>${simPrimaryLabel(state.primaryDataSim)}</small></div>
            <button class="${simToolkitPrimaryState("primaryDataSim", selected)}" type="button" data-sim-action="simtk-primary-data">Pilih</button>
          </div>
        </section>
      `}

      <div class="simtk-section-label">Jaringan</div>
      <section class="simtk-card">
        <div class="simtk-switch-row">
          <div><strong>Data seluler</strong><small>${state.mobileData ? "Aktif" : "Nonaktif"}</small></div>
          <button class="a17-switch ${state.mobileData ? "on" : ""}" type="button" data-sim-action="simtk-mobile-data"></button>
        </div>
        <div class="simtk-switch-row">
          <div><strong>Pengalihan data otomatis</strong><small>Gunakan SIM lain bila jaringan utama tidak tersedia</small></div>
          <button class="a17-switch ${state.autoDataSwitch ? "on" : ""}" type="button" data-sim-action="simtk-auto-data"></button>
        </div>
      </section>

      <button class="simtk-system-settings" type="button" data-sim-action="simtk-system-settings">⚙ Buka setelan SIM lengkap</button>
      <small class="simtk-disclaimer">Semua SIM, operator, ICCID, roaming dan aktivasi eSIM di sini hanya simulasi lokal.</small>
    </div>`;
  }

  function renderSimApp() {
    const app = appById(state.activeSimApp);
    if (
      app &&
      state.developerOptionsEnabled &&
      state.devWaitForDebugger &&
      state.devDebugApp === app.id &&
      developerDebuggerAttachedApp !== app.id
    ) {
      root.innerHTML=`<div class="a17-page sim-app-page developer-wait-debugger">${simAppTopbar(app)}
        <div class="developer-debugger-wait-card"><span>⌘</span><strong>Menunggu debugger</strong><p>${escapeHtml(app.name)} dihentikan sementara sesuai opsi developer.</p><button type="button" data-sim-action="developer-attach-debugger">Hubungkan debugger simulasi</button></div>
      </div>`;
      return;
    }
    if (["brimo","digi-bank","dana","ovo"].includes(app.id)) return renderFinancialApp(app);
    if (app.id === "sim-toolkit") { renderSimToolkitApp(app); return; }
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
    if (app.id === "youtube") { root.innerHTML = renderYouTubeLiveApp(app, false); return; }
    if (app.id === "youtube-music") { root.innerHTML = renderYouTubeLiveApp(app, true); return; }
    if (app.id === "tiktok") { root.innerHTML = renderTikTokApp(app); return; }
    if (app.id === "wa-business") { root.innerHTML = renderWhatsAppApp(app); return; }
    if (app.id === "x") { root.innerHTML = renderXApp(app); return; }

    const commonTop = simAppTopbar(app);
    const social = ["facebook","instagram","threads"].includes(app.id);
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

  function ensurePixelCameraStyles() {
    if (document.getElementById("pixelCameraSimulatorStyles")) return;
    const style = document.createElement("style");
    style.id = "pixelCameraSimulatorStyles";
    style.textContent = `
      .camera-pro-page{position:absolute;inset:0;overflow:hidden;background:#000;color:#fff;font-family:inherit;overscroll-behavior:none}
      .camera-pro-page button{font:inherit;-webkit-tap-highlight-color:transparent}
      .camera-pro-viewfinder{position:absolute;left:0;right:0;top:58px;bottom:194px;overflow:hidden;border-radius:0;background:#171717}
      .camera-pro-page.video .camera-pro-viewfinder{border-radius:14px 14px 0 0}
      .camera-pro-viewfinder::before{content:"";position:absolute;inset:0;background-image:var(--camera-feed);background-position:center;background-size:cover;background-repeat:no-repeat;transform:scale(var(--camera-zoom,1));transition:transform .2s ease,filter .18s ease}
      .camera-pro-viewfinder.front::before{background-position:center 32%}
      .camera-pro-focus{position:absolute;left:50%;top:47%;width:48px;height:48px;border:1px solid rgba(255,255,255,.72);border-radius:50%;transform:translate(-50%,-50%);pointer-events:none}
      .camera-pro-top{position:absolute;z-index:15;top:13px;left:50%;display:flex;align-items:center;gap:3px;padding:3px 5px;border-radius:24px;background:#18161f;transform:translateX(-50%)}
      .camera-pro-top button{height:37px;border:0;color:#ded8ea;background:transparent;cursor:pointer}
      .camera-pro-setting-icon{min-width:42px;padding:0 8px;border-radius:18px!important;font-size:12px;font-weight:800;background:#2b2734!important}
      .camera-pro-setting-icon.photo{font-size:15px;font-weight:500}
      .camera-pro-chevron{width:28px;font-size:20px}
      .camera-pro-hint{position:absolute;z-index:4;top:98px;left:50%;padding:7px 13px;border-radius:18px;background:rgba(31,29,32,.85);font-size:8px;transform:translateX(-50%);white-space:nowrap}
      .camera-pro-bottom{position:absolute;z-index:6;left:0;right:0;bottom:0;height:196px;overflow:visible;background:#000}
      .camera-pro-zoom{position:absolute;top:6px;left:50%;display:flex;border-radius:18px;background:#3a393a;transform:translateX(-50%);overflow:hidden}
      .camera-pro-zoom button{width:43px;height:32px;border:0;color:#fff;background:transparent;font-size:9px;cursor:pointer}
      .camera-pro-zoom button.active{color:#3e374b;background:#d4c8e9;border-radius:17px}
      .camera-pro-video-tools{position:absolute;top:43px;left:50%;width:calc(100% - 22px);display:flex;align-items:center;justify-content:center;gap:7px;transform:translateX(-50%)}
      .camera-pro-video-modes{display:flex;align-items:center;padding:2px;border-radius:19px;background:#333;white-space:nowrap;overflow:hidden}
      .camera-pro-video-modes button{border:0;padding:6px 9px;border-radius:15px;color:#fff;background:transparent;font-size:7px;cursor:pointer;white-space:nowrap}
      .camera-pro-video-modes button.active{color:#3b3544;background:#d5c9e8;font-weight:600}
      .camera-pro-stabilizer{width:35px;height:35px;flex:0 0 35px;border:2px solid rgba(214,202,232,.72);border-radius:50%;display:grid;place-items:center;color:#e6dff4;background:#443a59;font-size:11px;line-height:1;cursor:pointer;box-shadow:0 0 0 2px rgba(255,255,255,.08) inset}
      .camera-pro-stabilizer.on{background:#65558d;color:#fff;border-color:#a994d0}
      .camera-pro-main-controls{position:absolute;top:53px;left:18px;right:18px;display:flex;justify-content:space-between;align-items:center}
      .camera-pro-page.video .camera-pro-main-controls{top:87px}
      .camera-pro-switch,.camera-pro-thumb{width:43px;height:43px;border:2px solid #fff;border-radius:50%;display:grid;place-items:center;color:#fff;background:#686d72;font-size:19px;cursor:pointer}
      .camera-pro-thumb{background-image:var(--camera-last-shot,var(--camera-feed));background-size:cover;background-position:center}
      .camera-pro-shutter{width:64px;height:64px;border:4px solid #fff;border-radius:50%;display:grid;place-items:center;background:transparent;cursor:pointer}
      .camera-pro-shutter::after{content:"";width:46px;height:46px;border-radius:50%;background:#fff}
      .camera-pro-page.video .camera-pro-shutter::after{width:20px;height:20px;background:#fff}
      .camera-pro-modes{position:absolute;left:0;right:0;bottom:10px;height:38px;display:flex;align-items:center;justify-content:flex-start;gap:2px;overflow-x:auto;overflow-y:hidden;padding:0 calc(50% - 42px);scroll-padding-inline:50%;scroll-snap-type:x mandatory;scrollbar-width:none;overscroll-behavior-x:contain;touch-action:pan-x;user-select:none;-webkit-user-select:none;white-space:nowrap;cursor:grab}
      .camera-pro-modes::-webkit-scrollbar{display:none}
      .camera-pro-modes.dragging{cursor:grabbing;scroll-snap-type:none}
      .camera-pro-modes button{flex:0 0 auto;min-width:max-content;border:0;padding:7px 11px;border-radius:17px;color:#fff;background:transparent;font-size:9px;cursor:pointer;scroll-snap-align:center;scroll-snap-stop:always;white-space:nowrap}
      .camera-pro-modes button.active{color:#3d3748;background:#d5cae8}
      .camera-pro-more{position:absolute;z-index:14;left:50%;top:106px;width:calc(100% - 22px);padding:16px 15px 17px;border-radius:24px;background:rgba(43,42,40,.94);transform:translateX(-50%);backdrop-filter:blur(14px);box-shadow:0 10px 28px rgba(0,0,0,.18)}
      .camera-pro-more-grid{display:grid;grid-template-columns:minmax(0,1fr) 40px 40px;gap:12px 8px;align-items:center}
      .camera-pro-more-copy strong,.camera-pro-more-copy small{display:block}.camera-pro-more-copy strong{font-size:8px;font-weight:500}.camera-pro-more-copy small{margin-top:3px;color:#d9c9ee;font-size:9px;line-height:1.2}
      .camera-pro-more-choice{width:40px;height:40px;border:0;border-radius:50%;color:#ddd;background:#191722;font-size:8px;font-weight:800;cursor:pointer}.camera-pro-more-choice.active{color:#fff;background:#66578d}
      .camera-pro-more-settings{position:absolute;right:0;bottom:-46px;padding:9px 17px;border:0;border-radius:21px;color:#fff;background:#3b393a;font-size:9px;cursor:pointer;box-shadow:0 5px 15px rgba(0,0,0,.12)}
      .camera-pro-photo-more{position:absolute;z-index:14;left:50%;top:106px;width:calc(100% - 42px);padding:12px;border-radius:22px;background:rgba(43,42,40,.94);transform:translateX(-50%);backdrop-filter:blur(14px);box-shadow:0 10px 28px rgba(0,0,0,.18)}
      .camera-pro-photo-more-row{display:flex;align-items:center;justify-content:space-between;gap:7px}
      .camera-pro-photo-more button{min-height:38px;border:0;border-radius:19px;color:#fff;background:#1a1820;font-size:8px;cursor:pointer}
      .camera-pro-photo-flash{width:42px;font-size:14px!important}.camera-pro-photo-flash.active{background:#66578d}
      .camera-pro-photo-settings{flex:1;padding:0 13px;text-align:left;background:#3b393a!important}
      .camera-pro-photo-settings strong{display:block;font-size:9px;font-weight:500}.camera-pro-photo-settings small{display:block;margin-top:2px;color:#d8ccdf;font-size:7px}
      .camera-pro-mode-panel{position:absolute;z-index:14;left:20px;right:20px;bottom:58px;padding:17px;border-radius:25px;background:#3b393a;text-align:center;display:flex;align-items:center}.camera-pro-mode-panel button{width:50%;border:0;color:#fff;background:transparent;cursor:pointer}.camera-pro-mode-panel i{width:44px;height:44px;margin:0 auto 8px;display:grid;place-items:center;border-radius:50%;color:#41394d;background:#d4c8e8;font-style:normal;font-size:19px}.camera-pro-mode-panel span{display:block;font-size:9px}
      .camera-pro-flash{position:absolute;z-index:40;inset:0;background:#fff;animation:cameraFlash .18s ease-out forwards;pointer-events:none}@keyframes cameraFlash{from{opacity:.95}to{opacity:0}}
      .camera-settings-page{position:absolute;inset:0;overflow-y:auto;overscroll-behavior:contain;padding:16px 12px 34px;background:#fbf6ff;color:#342f3a;scrollbar-gutter:stable}
      .camera-settings-head{position:sticky;z-index:3;top:-16px;display:flex;align-items:center;gap:10px;padding:18px 0 12px;background:#fbf6ff}.camera-settings-head button{width:31px;height:31px;border:0;color:#686171;background:transparent;font-size:25px}.camera-settings-head h3{margin:0;font-size:17px;font-weight:500}
      .camera-settings-section{margin:14px 0 7px;color:#6e5d96;font-size:9px}
      .camera-settings-row{min-height:58px;display:grid;grid-template-columns:35px 1fr auto;align-items:start;padding:9px 0;border:0;color:inherit;background:transparent;text-align:left;width:100%}.camera-settings-icon{padding-top:2px;color:#6f6879;font-size:17px}.camera-settings-copy strong{display:block;font-size:12px;font-weight:500}.camera-settings-copy small{display:block;margin-top:3px;color:#716c75;font-size:9px;line-height:1.25}
      .camera-settings-switch{position:relative;width:30px;height:18px;margin-top:5px;border-radius:10px;background:#cbc6cc}.camera-settings-switch::after{content:"";position:absolute;top:-2px;left:-1px;width:22px;height:22px;border-radius:50%;background:#ecebed;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:left .18s}.camera-settings-switch.on{background:#d3c6e7}.camera-settings-switch.on::after{left:11px;background:#6a5599}
      .camera-settings-divider{height:1px;background:rgba(90,80,100,.08)}
      .camera-settings-page::-webkit-scrollbar{width:4px}.camera-settings-page::-webkit-scrollbar-thumb{background:#8d8892;border-radius:4px}
    `;
    document.head.appendChild(style);
  }

  function cameraFeedUrl() {
    return state.cameraLens === "front"
      ? "./assets/camera-front-raiden.png"
      : "./assets/camera-rear-landscape.png";
  }

  function renderCamera() {
    ensurePixelCameraStyles();
    const mode = state.cameraMode || "camera";
    const isVideo = mode === "video";
    const isMore = mode === "more";
    const videoMode = ["slow", "normal", "timelapse"].includes(state.cameraVideoMode)
      ? state.cameraVideoMode
      : "normal";
    const topBadge = isVideo
      ? state.cameraResolution
      : (mode === "night" ? "☾⚙" : (mode === "portrait" ? "▣⚙" : "▣⚙"));
    const modes = [
      ["night", "Mode Foto Malam"], ["portrait", "Potret"], ["camera", "Kamera"], ["video", "Video"], ["more", "Mode"]
    ];
    const videoModes = [
      ["slow", "Gerak Lambat"], ["normal", "Normal"], ["timelapse", "Time Lapse"]
    ];

    const videoPanel = state.cameraPanelOpen && isVideo ? `
      <div class="camera-pro-more" role="dialog" aria-label="Setelan cepat video">
        <div class="camera-pro-more-grid">
          <div class="camera-pro-more-copy"><strong>Flash</strong><small>${state.cameraFlash ? "Aktif" : "Nonaktif"}</small></div>
          <button class="camera-pro-more-choice ${!state.cameraFlash ? "active" : ""}" type="button" data-camera-flash="off" aria-label="Flash nonaktif">⚡̸</button>
          <button class="camera-pro-more-choice ${state.cameraFlash ? "active" : ""}" type="button" data-camera-flash="on" aria-label="Flash aktif">⚡</button>

          <div class="camera-pro-more-copy"><strong>Resolusi</strong><small>${state.cameraResolution === "4K" ? "4K (Resolusi sangat tinggi)" : "Full HD (1080p)"}</small></div>
          <button class="camera-pro-more-choice ${state.cameraResolution === "FHD" ? "active" : ""}" type="button" data-camera-resolution="FHD">FHD</button>
          <button class="camera-pro-more-choice ${state.cameraResolution === "4K" ? "active" : ""}" type="button" data-camera-resolution="4K">4K</button>

          <div class="camera-pro-more-copy"><strong>Frame/dtk</strong><small>${state.cameraFps}</small></div>
          <button class="camera-pro-more-choice ${state.cameraFps === 30 ? "active" : ""}" type="button" data-camera-fps="30">30</button>
          <button class="camera-pro-more-choice ${state.cameraFps === 60 ? "active" : ""}" type="button" data-camera-fps="60">60</button>
        </div>
        <button class="camera-pro-more-settings" type="button" data-camera-settings>Setelan lainnya</button>
      </div>` : "";

    const photoPanel = state.cameraPanelOpen && !isVideo && !isMore ? `
      <div class="camera-pro-photo-more" role="dialog" aria-label="Setelan cepat kamera">
        <div class="camera-pro-photo-more-row">
          <button class="camera-pro-photo-flash ${state.cameraFlash ? "active" : ""}" type="button" data-camera-flash="${state.cameraFlash ? "off" : "on"}" aria-label="${state.cameraFlash ? "Nonaktifkan flash" : "Aktifkan flash"}">⚡</button>
          <button class="camera-pro-photo-settings" type="button" data-camera-settings>
            <strong>Setelan kamera</strong>
            <small>Buka semua setelan kamera</small>
          </button>
        </div>
      </div>` : "";

    const morePanel = isMore ? `
      <div class="camera-pro-mode-panel">
        <button type="button" data-camera-extra="panorama"><i>▱</i><span>Panorama</span></button>
        <button type="button" data-camera-extra="sphere"><i>◉</i><span>Photo Sphere</span></button>
      </div>` : "";

    root.innerHTML = `
      <div class="a17-page camera-pro-page ${isVideo ? "video" : ""}" style="--camera-feed:url('${cameraFeedUrl()}');--camera-zoom:${state.cameraZoom === 2 ? 1.45 : 1}">
        ${!isMore ? `<div class="camera-pro-top">
          ${isVideo
            ? `<button class="camera-pro-setting-icon" type="button" data-camera-panel aria-label="Setelan cepat video">${topBadge}</button>`
            : `<button class="camera-pro-setting-icon photo" type="button" data-camera-settings aria-label="Setelan kamera">${topBadge}</button>`}
          <button class="camera-pro-chevron" type="button" data-camera-panel aria-label="${state.cameraPanelOpen ? "Tutup setelan cepat" : "Buka setelan cepat"}">${state.cameraPanelOpen ? "⌃" : "⌄"}</button>
        </div>` : ""}
        <div class="camera-pro-viewfinder ${state.cameraLens === "front" ? "front" : "rear"}" data-camera-focus>
          <span class="camera-pro-focus"></span>
        </div>
        ${mode === "portrait" ? `<div class="camera-pro-hint">Ketuk untuk memfokuskan</div>` : ""}
        <div class="camera-pro-bottom">
          ${!isMore ? `<div class="camera-pro-zoom"><button class="${state.cameraZoom === 1 ? "active" : ""}" type="button" data-camera-zoom="1">1×</button><button class="${state.cameraZoom === 2 ? "active" : ""}" type="button" data-camera-zoom="2">2</button></div>` : ""}
          ${isVideo ? `<div class="camera-pro-video-tools">
            <div class="camera-pro-video-modes" aria-label="Mode perekaman video">
              ${videoModes.map(([id,label]) => `<button type="button" class="${videoMode === id ? "active" : ""}" data-camera-video-mode="${id}">${label}</button>`).join("")}
            </div>
            <button class="camera-pro-stabilizer ${state.cameraStabilization ? "on" : ""}" type="button" data-camera-stabilization aria-label="Stabilisasi video">⌁✋⌁</button>
          </div>` : ""}
          ${!isMore ? `<div class="camera-pro-main-controls"><button class="camera-pro-switch" type="button" data-camera-switch aria-label="Ganti kamera">↻</button><button class="camera-pro-shutter" type="button" data-action="shutter" aria-label="${isVideo ? "Mulai rekaman" : "Ambil gambar"}"></button><button class="camera-pro-thumb" type="button" aria-label="Foto terakhir"></button></div>` : ""}
          <div class="camera-pro-modes" data-camera-mode-rail aria-label="Mode kamera">${modes.map(([id,label]) => `<button type="button" class="${mode === id ? "active" : ""}" data-camera-mode="${id}">${label}</button>`).join("")}</div>
        </div>
        ${videoPanel}${photoPanel}${morePanel}
      </div>`;
  }

  function cameraSettingsRow(icon, title, desc, key = "") {
    const switchMarkup = key ? `<span class="camera-settings-switch ${state[key] ? "on" : ""}"></span>` : "";
    return `<button class="camera-settings-row" type="button" ${key ? `data-camera-setting="${key}"` : ""}><span class="camera-settings-icon">${icon}</span><span class="camera-settings-copy"><strong>${title}</strong>${desc ? `<small>${desc}</small>` : ""}</span>${switchMarkup}</button>`;
  }

  function renderCameraSettings() {
    ensurePixelCameraStyles();
    root.innerHTML = `<div class="a17-page camera-settings-page">
      <div class="camera-settings-head"><button type="button" data-nav="back">‹</button><h3>Setelan kamera</h3></div>
      <div class="camera-settings-section">Umum</div>
      ${cameraSettingsRow("⌖","Simpan lokasi","Aplikasi lain mungkin dapat melihat info lokasi foto & video","cameraLocation")}
      ${cameraSettingsRow("◉","Saran Google Lens","Arahkan kamera untuk memindai kode QR, dokumen, dan lainnya","cameraLensSuggestions")}
      ${cameraSettingsRow("⌯","Berbagi ke media sosial",state.cameraSocialShare ? "Aktif" : "Nonaktif","cameraSocialShare")}
      ${cameraSettingsRow("☝","Gestur","Tindakan tombol volume, Tindakan ketuk dua kali")}
      ${cameraSettingsRow("☺","Wajah Favorit","Nonaktif")}
      ${cameraSettingsRow("▣","Penyimpanan perangkat","Hemat Penyimpanan, Kosongkan ruang penyimpanan")}
      ${cameraSettingsRow("•••","Lanjutan","")}
      <div class="camera-settings-section">Komposisi</div>
      ${cameraSettingsRow("⌗","Petunjuk pemberian bingkai","Tips dan alat di layar, seperti perata dan tips fokus","cameraFramingHints")}
      ${cameraSettingsRow("▦","Jenis petak",state.cameraGrid)}
      <div class="camera-settings-section">Kontrol Manual</div>
      ${cameraSettingsRow("◐","Eksposur","Menyesuaikan kecerahan dan bayangan","cameraExposure")}
      <div class="camera-settings-section">Foto</div>
      ${cameraSettingsRow("▣","Resolusi foto kamera",state.cameraFullResolution ? "Resolusi penuh" : "Resolusi standar","cameraFullResolution")}
      ${cameraSettingsRow("◫","Simpan selfie sebagai dipratinjau","Simpan foto selfie saat muncul di penampil","cameraMirrorSelfie")}
      <div class="camera-settings-section">Video</div>
      ${cameraSettingsRow("▰","Stabilisasi video","Mengurangi goyangan pada kamera agar video lebih halus","cameraStabilization")}
    </div>`;
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

  function lockCredentialMarkup() {
    if (!lockAuthVisible) return "";
    if (state.screenLock === "PIN") {
      return `<div class="lock-auth-panel"><button class="lock-auth-close" type="button" data-action="closeLockAuth">×</button><div class="lock-auth-title">Masukkan PIN</div>${pinDots(lockPinAttempt)}${pinPadMarkup("lock-pin")}</div>`;
    }
    if (state.screenLock === "Pola") {
      return `<div class="lock-auth-panel pattern-auth-panel"><button class="lock-auth-close" type="button" data-action="closeLockAuth">×</button><div class="lock-auth-title">Gambar pola untuk membuka</div>${patternMarkup("unlock")}</div>`;
    }
    return "";
  }

  function renderLock() {
    const fpClass = state.fingerprintEnrolled ? "ready" : "not-ready";
    root.innerHTML = `<div class="a17-page lock-page ${lockAuthVisible?"auth-open":""}" id="lockPage"><div class="lock-wall"></div><div class="lock-content"><div class="lock-date" id="lockDateLive">${formatDate()}</div><div class="lock-time ${state.dynamicClock && state.lockNotifications ? "compact" : ""}" id="lockClockLive">${lockClockMarkup()}</div>
      ${state.lockNotifications && !lockAuthVisible ? `<div class="lock-notifications"><div class="lock-notification"><strong>Waifu Gallery</strong><span>${state.notificationMode === "compact" ? "Galeri siap dibuka" : "Galeri siap dibuka • Mini Game dan Ponsel tersedia"}</span></div>${state.notificationMode === "full" ? `<div class="lock-notification"><strong>Now Playing</strong><span>${state.nowPlaying ? "Ambient track detected" : "Off"}</span></div>` : ""}</div>` : ""}
      <div class="lock-spacer"></div>${!lockAuthVisible?`<button class="in-display-fingerprint ${fpClass}" type="button" data-action="lockFingerprint" aria-label="Sidik jari"><span>◉</span></button>`:""}<div class="lock-text">${escapeHtml(state.lockText)}</div>${!lockAuthVisible?`<div class="lock-shortcuts"><button class="lock-shortcut" type="button" data-lock-shortcut="${state.leftShortcut}">${shortcutIcon(state.leftShortcut)}</button><button class="lock-shortcut" type="button" data-lock-shortcut="${state.rightShortcut}">${shortcutIcon(state.rightShortcut)}</button></div><div class="unlock-hint">${state.screenLock==="PIN"?"Geser ke atas untuk memasukkan PIN":state.screenLock==="Pola"?"Geser ke atas untuk menggambar pola":t("unlock")}</div>`:""}</div>${lockCredentialMarkup()}</div>`;
  }

  function quickTile(key, icon, title, subtitle, active, shape = "round") {
    return `<button class="axion-qs-tile ${shape} ${active ? "on" : ""}" type="button" data-quick-toggle="${key}">
      <span class="axion-qs-icon">${icon}</span>
      <span class="axion-qs-copy"><strong>${title}</strong><small>${subtitle}</small></span>
    </button>`;
  }

  function renderQuickShade() {
    const wifiOn = state.wifi && !state.airplane;
    const dataOn = state.mobileData && !state.airplane;
    const connectionName = wifiOn ? escapeHtml(state.connectedWifi || "Wi-Fi") : "Off";
    const dataLabel = dataOn ? "5G" : "Off";

    const mainTiles = [
      quickTile("wifi", "⌁", "Wi-Fi", connectionName, wifiOn, "wide"),
      quickTile("mobileData", "⇅", "Mobile data", dataLabel, dataOn, "wide"),
      quickTile("bluetooth", "ᛒ", "Bluetooth", state.bluetooth ? "On" : "Off", state.bluetooth),
      quickTile("airplane", "✈", "Airplane", state.airplane ? "On" : "Off", state.airplane),
      quickTile("flashlight", "ϟ", "Torch", state.flashlight ? "On" : "Off", state.flashlight, "wide"),
      quickTile("alarmEnabled", "◷", "Alarm", state.alarmEnabled ? "06:30" : "No alarm", state.alarmEnabled),
      quickTile("caffeine", "♨", "Caffeine", state.caffeine ? "Keep awake" : "Off", state.caffeine),
      quickTile("batterySaver", "▰", "Battery", state.batterySaver ? "Saver on" : `${state.battery}%`, state.batterySaver),
      quickTile("screenRecord", "▣", "Recorder", state.screenRecord ? "Recording" : "Off", state.screenRecord),
      quickTile("locationEnabled", "⌖", "Location", state.locationEnabled ? "On" : "Off", state.locationEnabled),
      quickTile("autoRotate", "⟳", "Auto rotate", state.autoRotate ? "On" : "Off", state.autoRotate),
      quickTile("doNotDisturb", "◒", "Do not disturb", state.doNotDisturb ? "On" : "Off", state.doNotDisturb),
      quickTile("hotspot", "◉", "Hotspot", state.hotspot ? "On" : "Off", state.hotspot)
    ];

    return `<div class="quick-shade axion-separate-qs">
      <div class="axion-qs-head">
        <div><strong>${formatTime().replace(".", ":")}</strong><small>${formatDate()}</small></div>
        <div class="axion-qs-status"><span>${dataOn ? "5G" : ""}</span><span>${wifiOn ? "⌁" : ""}</span><span>${state.battery}%</span></div>
      </div>
      <div class="axion-qs-grid">${mainTiles.join("")}</div>
      <label class="axion-slider-row"><span>☀</span><input id="brightnessSlider" type="range" min="35" max="100" value="${state.brightness}"></label>
      <label class="axion-slider-row volume"><span>♫</span><input id="qsVolumeSlider" type="range" min="0" max="100" value="${state.volume}"></label>
      <div class="axion-qs-footer">
        <button type="button" class="${state.separateQs ? "on" : ""}" data-quick-toggle="separateQs">▥ <span>Separate QS</span></button>
        <button type="button" data-nav="settings">⚙</button>
        <button type="button" data-action="closeShade">⌃</button>
      </div>
      ${!state.separateQs ? renderNotificationCards(true) : ""}
    </div>`;
  }

  function notificationItems() {
    const items = [];
    if (state.screenRecord) items.push({ app:"settings-app", icon:"●", title:"Perekaman layar", body:"Perekaman simulator sedang berjalan", time:"sekarang" });
    items.push(
      { app:"wa-business", icon:"W", title:"WA Business", body:"3 pesan baru dari kontak simulasi", time:"1 mnt" },
      { app:"nekogram", icon:"N", title:"Nekogram", body:"Waifu Gallery: ada pesan baru", time:"4 mnt" },
      { app:"youtube", icon:"▶", title:"YouTube", body:"Rekomendasi video baru tersedia", time:"12 mnt" },
      { app:"spotify", icon:"◉", title:"Spotify", body:"Lanjutkan musik terakhir", time:"18 mnt" }
    );
    return items;
  }

  function renderNotificationCards(compact = false) {
    if (state.shadeNotificationsCleared) {
      return `<div class="axion-notification-empty"><span>✓</span><strong>Tidak ada notifikasi baru</strong><small>Notifikasi simulasi sudah dibersihkan</small></div>`;
    }
    return `<div class="axion-notification-list ${compact ? "compact" : ""}">${notificationItems().map(n => `
      <button class="axion-notification-card" type="button" data-open-app="${n.app}">
        <span class="axion-notification-icon">${n.icon}</span>
        <span><strong>${n.title}</strong><small>${n.body}</small></span>
        <em>${n.time}</em>
      </button>`).join("")}</div>`;
  }

  function renderNotificationShade() {
    return `<div class="quick-shade axion-notification-shade">
      <div class="axion-notif-head">
        <div><strong>${formatTime().replace(".", ":")}</strong><small>${formatDate()}</small></div>
        <button type="button" data-action="closeShade">⌃</button>
      </div>
      <div class="axion-notif-title"><strong>Notifikasi</strong><span>${state.doNotDisturb ? "Jangan ganggu aktif" : "Terbaru"}</span></div>
      ${renderNotificationCards(false)}
      <div class="axion-notif-footer">
        <button type="button" data-action="clearShadeNotifications">Hapus semua</button>
        <button type="button" data-nav="notificationsSettings">Setelan notifikasi</button>
      </div>
    </div>`;
  }

  function renderShadePanel() {
    if (state.separateQs && state.shadePanel === "notifications") return renderNotificationShade();
    return renderQuickShade();
  }

  /* =========================================================
     POWER MENU / RECOVERY / BOOTLOADER SIMULATION
     ========================================================= */

  let powerMenuStage = "";
  let systemUiRestarting = false;
  let bootTransitionTimer = 0;
  let screenshotFlashTimer = 0;

  function ensurePowerModeStyles() {
    if (document.getElementById("androidPowerModeStylesV1")) return;
    const style = document.createElement("style");
    style.id = "androidPowerModeStylesV1";
    style.textContent = `
      #pixelScreen.android-special-boot #androidStatusbar,
      #pixelScreen.android-special-boot #androidGesturePill,
      #pixelScreen.android-special-boot #androidButtonNav,
      #pixelScreen[data-android-system-mode] #androidDynamicIsland,
      #pixelScreen[data-android-system-mode] #androidPersistentMediaHost,
      #pixelScreen[data-android-system-mode] #androidPersistentMediaHostV12 {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
      .android-power-overlay {
        position: absolute; inset: 0; z-index: 9800; display: grid; place-items: center;
        padding: 42px 16px 28px; box-sizing: border-box; color: #17192f;
      }
      .android-power-backdrop {
        position: absolute; inset: 0; border: 0; padding: 0;
        background: rgba(34,37,52,.48); backdrop-filter: blur(8px) saturate(.85);
        -webkit-backdrop-filter: blur(8px) saturate(.85);
      }
      .android-power-card {
        position: relative; width: min(82%, 270px); padding: 18px 16px 20px;
        border-radius: 28px; background: rgba(229,232,255,.62);
        box-shadow: 0 18px 48px rgba(14,16,28,.28), inset 0 1px rgba(255,255,255,.34);
        backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      }
      .android-power-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px 14px; }
      .android-power-action { border: 0; background: transparent; color: #17192f; padding: 0; display: grid; justify-items: center; gap: 8px; font: inherit; }
      .android-power-action .android-power-icon {
        width: 72px; height: 72px; border-radius: 50%; display: grid; place-items: center;
        background: #d9ddff; box-shadow: 0 8px 20px rgba(23,25,47,.12); font-size: 27px; font-weight: 800;
      }
      .android-power-action.danger .android-power-icon { background: #e93a32; color: #fff; }
      .android-power-action strong { font-size: 12px; line-height: 1.05; font-weight: 850; text-align: center; }
      .android-power-screenshot { grid-column: 1 / -1; margin-top: 2px; }
      .android-power-screenshot .android-power-icon { width: 72px; height: 72px; }
      .android-power-restart-card .android-power-action .android-power-icon { background: #d9ddff; }
      .android-systemui-restart {
        position: absolute; inset: 0; z-index: 9900; display: grid; place-items: center;
        background: rgba(7,8,12,.78); color: white; backdrop-filter: blur(5px);
      }
      .android-systemui-restart div { text-align: center; }
      .android-systemui-restart b { display: block; font-size: 28px; margin-bottom: 10px; }
      .android-systemui-restart span { font-size: 11px; opacity: .84; font-weight: 800; }
      .android-screenshot-flash { position: absolute; inset: 0; z-index: 9950; pointer-events: none; background: #fff; animation: androidScreenshotFlash .32s ease forwards; }
      @keyframes androidScreenshotFlash { 0%{opacity:.94} 100%{opacity:0} }

      .android-poweroff-page, .android-bootloader-page, .android-recovery-page {
        position: absolute; inset: 0; width: 100%; height: 100%; box-sizing: border-box; overflow: hidden;
      }
      .android-poweroff-page { background: #000; }
      .android-poweroff-hint { position:absolute; left:50%; bottom:24px; transform:translateX(-50%); color:#6f7278; font-size:8px; white-space:nowrap; }

      .android-bootloader-page {
        background: #07090d; color: #e7e9ed; padding: 22px 14px 18px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        display: flex; flex-direction: column;
      }
      .android-fastboot-mark { width: 54px; height: 54px; margin: 0 auto 12px; border-radius: 50%; border: 3px solid #2da66f; color:#2da66f; display:grid; place-items:center; font-size:25px; font-weight:900; }
      .android-fastboot-title { text-align:center; color:#7ddcae; font-size:13px; font-weight:900; letter-spacing:.08em; margin-bottom:14px; }
      .android-fastboot-info { border-top:1px solid #2a3138; border-bottom:1px solid #2a3138; padding:10px 0; display:grid; gap:5px; font-size:7px; line-height:1.3; color:#aeb7c0; }
      .android-fastboot-info b { color:#f1f3f4; font-weight:700; }
      .android-fastboot-options { margin-top:auto; display:grid; gap:6px; }
      .android-fastboot-option { border:1px solid #3a4149; border-radius:8px; padding:9px 10px; background:#11151b; color:#cbd1d7; text-align:left; font:700 8px ui-monospace,monospace; }
      .android-fastboot-option.active { color:#07130d; background:#71e5a8; border-color:#71e5a8; }
      .android-fastboot-help { margin-top:10px; font-size:6.5px; line-height:1.45; color:#7e8790; text-align:center; }
      .android-fastboot-hold { margin-top:6px; text-align:center; color:#e0b45b; font-size:6.5px; }

      .android-recovery-page { background:#101318; color:#e9edf3; font-family: Arial, sans-serif; display:flex; flex-direction:column; }
      .android-recovery-head { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; background:#20252c; border-bottom:1px solid #3a4149; }
      .android-recovery-head div { display:grid; }
      .android-recovery-head strong { color:#8fd5ff; font-size:10px; letter-spacing:.04em; }
      .android-recovery-head small { font-size:6.5px; color:#aab3bd; margin-top:2px; }
      .android-recovery-head span { font:700 7px ui-monospace,monospace; color:#c5ccd4; }
      .android-recovery-body { flex:1; overflow:auto; padding:12px; box-sizing:border-box; }
      .android-twrp-title { text-align:center; margin:2px 0 10px; font-size:11px; color:#fff; }
      .android-twrp-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; }
      .android-twrp-tile { min-height:58px; border:1px solid #38414b; border-radius:9px; background:linear-gradient(#242b33,#1a2027); color:#ecf1f5; display:grid; place-items:center; gap:4px; padding:7px 4px; font:700 8px Arial,sans-serif; }
      .android-twrp-tile b { color:#67c7ff; font-size:20px; line-height:1; }
      .android-twrp-panel { border:1px solid #38414b; border-radius:10px; background:#1c2229; padding:11px; }
      .android-twrp-panel h4 { margin:0 0 8px; color:#7fd2ff; font-size:10px; }
      .android-twrp-panel p { margin:5px 0; color:#b8c0c8; font-size:7px; line-height:1.45; }
      .android-twrp-list { display:grid; gap:7px; margin-top:9px; }
      .android-twrp-row { border:1px solid #3b444e; border-radius:8px; background:#272e36; color:#ecf0f3; padding:9px; text-align:left; font:700 7.5px Arial,sans-serif; }
      .android-twrp-row.active { border-color:#54bceb; color:#84d7ff; }
      .android-twrp-warning { color:#ffbe69 !important; }
      .android-twrp-actions { display:flex; gap:7px; margin-top:10px; }
      .android-twrp-actions button { flex:1; border:0; border-radius:8px; padding:9px 5px; background:#52bde9; color:#07141b; font-size:7px; font-weight:900; }
      .android-twrp-actions button.secondary { background:#343c45; color:#e1e6eb; }
      .android-recovery-nav { height:31px; background:#20252c; border-top:1px solid #3a4149; display:grid; grid-template-columns:repeat(3,1fr); gap:1px; }
      .android-recovery-nav button { border:0; background:transparent; color:#cbd2d9; font-size:12px; }
    `;
    document.head.appendChild(style);
  }

  function powerMenuMarkup() {
    if (!powerMenuStage) return "";
    const restart = powerMenuStage === "restart";
    return `<div class="android-power-overlay">
      <button class="android-power-backdrop" type="button" data-action="power-menu-dismiss" aria-label="Tutup menu daya"></button>
      <section class="android-power-card ${restart ? "android-power-restart-card" : ""}" aria-label="${restart ? "Opsi mulai ulang" : "Menu daya"}">
        ${restart ? `
          <div class="android-power-grid">
            <button class="android-power-action" type="button" data-action="power-restart-system"><span class="android-power-icon">↻</span><strong>System</strong></button>
            <button class="android-power-action" type="button" data-action="power-restart-systemui"><span class="android-power-icon">♟</span><strong>Sistem UI</strong></button>
            <button class="android-power-action" type="button" data-action="power-restart-recovery"><span class="android-power-icon">⚙</span><strong>Recovery</strong></button>
            <button class="android-power-action" type="button" data-action="power-restart-bootloader"><span class="android-power-icon">▣</span><strong>Bootloader</strong></button>
          </div>
        ` : `
          <div class="android-power-grid">
            <button class="android-power-action danger" type="button" data-action="power-emergency"><span class="android-power-icon">✱</span><strong>Darurat</strong></button>
            <button class="android-power-action" type="button" data-action="power-lockdown"><span class="android-power-icon">▣</span><strong>Kunci total</strong></button>
            <button class="android-power-action" type="button" data-action="power-off"><span class="android-power-icon">⏻</span><strong>Matikan</strong></button>
            <button class="android-power-action" type="button" data-action="power-restart"><span class="android-power-icon">↻</span><strong>Mulai ulang</strong></button>
            <button class="android-power-action android-power-screenshot" type="button" data-action="power-screenshot"><span class="android-power-icon">▣</span><strong>Screenshot</strong></button>
          </div>
        `}
      </section>
    </div>`;
  }

  function appendPowerTransientUi() {
    if (powerMenuStage && !state.poweredOff && !["bootloader", "recovery", "boot"].includes(state.view)) {
      root.insertAdjacentHTML("beforeend", powerMenuMarkup());
    }
    if (systemUiRestarting) {
      root.insertAdjacentHTML("beforeend", `<div class="android-systemui-restart"><div><b>G</b><span>Memulai ulang Sistem UI…</span></div></div>`);
    }
  }

  function renderPowerOff() {
    root.innerHTML = `<div class="android-poweroff-page"><div class="android-poweroff-hint">Tahan tombol daya untuk menyalakan</div></div>`;
  }

  const BOOTLOADER_OPTIONS = [
    { id: "start", label: "START" },
    { id: "restart", label: "RESTART BOOTLOADER" },
    { id: "recovery", label: "RECOVERY MODE" },
    { id: "poweroff", label: "POWER OFF" }
  ];

  function renderBootloader() {
    const selected = Math.max(0, Math.min(BOOTLOADER_OPTIONS.length - 1, Number(state.bootloaderSelection) || 0));
    state.bootloaderSelection = selected;
    root.innerHTML = `<div class="android-bootloader-page">
      <div class="android-fastboot-mark">▶</div>
      <div class="android-fastboot-title">FASTBOOT MODE</div>
      <div class="android-fastboot-info">
        <span>PRODUCT_NAME - <b>frankel</b></span>
        <span>VARIANT - <b>Pixel 10</b></span>
        <span>BOOTLOADER VERSION - <b>sim-17.0</b></span>
        <span>BASEBAND VERSION - <b>simulator</b></span>
        <span>SERIAL NUMBER - <b>WAIFU-P10-FRANKEL</b></span>
        <span>SECURE BOOT - <b>yes</b></span>
        <span>DEVICE STATE - <b>${state.bootloaderUnlocked ? "unlocked" : "locked"}</b></span>
        <span>OEM UNLOCKING - <b>${state.oemUnlockAllowed ? "enabled" : "disabled"}</b></span>
        <span>BATTERY - <b>${state.battery}%</b></span>
      </div>
      <div class="android-fastboot-options">
        ${BOOTLOADER_OPTIONS.map((item, index) => `<button class="android-fastboot-option ${index === selected ? "active" : ""}" type="button" data-action="bootloader-select-${item.id}">${item.label}</button>`).join("")}
      </div>
      <div class="android-fastboot-help">Tombol volume: pindah pilihan • tombol power: pilih</div>
      <div class="android-fastboot-hold">Tahan power 10 detik untuk reboot paksa ke System</div>
    </div>`;
  }

  function recoveryPanelMarkup() {
    const page = state.recoveryPage || "main";
    if (page === "main") {
      return `<h3 class="android-twrp-title">Team Win Recovery Project</h3>
        <div class="android-twrp-grid">
          <button class="android-twrp-tile" data-action="recovery-open-install"><b>⇩</b>Install</button>
          <button class="android-twrp-tile" data-action="recovery-open-wipe"><b>⌫</b>Wipe</button>
          <button class="android-twrp-tile" data-action="recovery-open-backup"><b>▣</b>Backup</button>
          <button class="android-twrp-tile" data-action="recovery-open-restore"><b>↥</b>Restore</button>
          <button class="android-twrp-tile" data-action="recovery-open-mount"><b>◫</b>Mount</button>
          <button class="android-twrp-tile" data-action="recovery-open-settings"><b>⚙</b>Settings</button>
          <button class="android-twrp-tile" data-action="recovery-open-advanced"><b>⋮</b>Advanced</button>
          <button class="android-twrp-tile" data-action="recovery-open-reboot"><b>↻</b>Reboot</button>
        </div>`;
    }
    if (page === "install") {
      return `<div class="android-twrp-panel"><h4>Install</h4><p>Pilih paket ZIP simulasi. Tidak ada file nyata yang akan diflash.</p><div class="android-twrp-list"><button class="android-twrp-row" data-action="recovery-sim-install">/sdcard/Download/update-simulator.zip</button><button class="android-twrp-row" data-action="recovery-sim-install">/sdcard/Download/module-demo.zip</button></div></div>`;
    }
    if (page === "wipe") {
      return `<div class="android-twrp-panel"><h4>Wipe</h4><p class="android-twrp-warning">Simulasi saja. Data browser tidak akan benar-benar dihapus.</p><div class="android-twrp-list"><button class="android-twrp-row" data-action="recovery-wipe-cache">Wipe Cache / Dalvik</button><button class="android-twrp-row" data-action="recovery-wipe-data">Factory Reset (simulasi)</button></div></div>`;
    }
    if (page === "backup") {
      return `<div class="android-twrp-panel"><h4>Backup</h4><p>Partisi yang dipilih: Boot, System, Data.</p><div class="android-twrp-actions"><button data-action="recovery-backup-run">Mulai Backup</button></div></div>`;
    }
    if (page === "restore") {
      return `<div class="android-twrp-panel"><h4>Restore</h4><p>Belum ada backup TWRP simulasi tersimpan.</p><div class="android-twrp-actions"><button class="secondary" data-action="recovery-home">Kembali</button></div></div>`;
    }
    if (page === "mount") {
      return `<div class="android-twrp-panel"><h4>Mount</h4><div class="android-twrp-list"><button class="android-twrp-row ${state.recoveryMountSystem ? "active" : ""}" data-action="recovery-toggle-mount-system">System ${state.recoveryMountSystem ? "• mounted" : ""}</button><button class="android-twrp-row active">Data • mounted</button><button class="android-twrp-row active">Cache • mounted</button></div></div>`;
    }
    if (page === "settings") {
      return `<div class="android-twrp-panel"><h4>Settings</h4><div class="android-twrp-list"><button class="android-twrp-row ${state.recoveryReadOnly ? "active" : ""}" data-action="recovery-toggle-readonly">Mount system partition read-only</button><button class="android-twrp-row" data-action="recovery-sim-haptics">Vibration</button><button class="android-twrp-row" data-action="recovery-sim-timezone">Time zone: Asia/Jakarta</button></div></div>`;
    }
    if (page === "advanced") {
      return `<div class="android-twrp-panel"><h4>Advanced</h4><div class="android-twrp-list"><button class="android-twrp-row" data-action="recovery-sim-terminal">Terminal</button><button class="android-twrp-row" data-action="recovery-wipe-cache">Wipe Dalvik / ART Cache</button><button class="android-twrp-row" data-action="recovery-sim-filemanager">File Manager</button></div></div>`;
    }
    return `<div class="android-twrp-panel"><h4>Reboot</h4><p>Pilih target reboot.</p><div class="android-twrp-list"><button class="android-twrp-row" data-action="power-restart-system">System</button><button class="android-twrp-row" data-action="power-restart-recovery">Recovery</button><button class="android-twrp-row" data-action="power-restart-bootloader">Bootloader</button><button class="android-twrp-row" data-action="power-off">Power Off</button></div></div>`;
  }

  function renderRecovery() {
    root.innerHTML = `<div class="android-recovery-page">
      <header class="android-recovery-head"><div><strong>TWRP 3.7.1-0</strong><small>Pixel 10 • frankel</small></div><span>${formatTime().replace(".", ":")} · ${state.battery}%</span></header>
      <main class="android-recovery-body">${recoveryPanelMarkup()}</main>
      <nav class="android-recovery-nav"><button type="button" data-action="recovery-back">‹</button><button type="button" data-action="recovery-home">⌂</button><button type="button" data-action="recovery-log">☰</button></nav>
    </div>`;
  }

  function renderBoot() {
    root.innerHTML = `<div class="boot-page"><div style="text-align:center"><div class="boot-mark">G</div><p style="font-size:8px;font-weight:900;color:#5f6368">${t("rebooting")}</p></div></div>`;
  }

  function syncDeveloperOptionEffects() {
    const active=!!state.developerOptionsEnabled;

    const ensure=(id,cls)=>{
      let node=$(`#${id}`,phone);
      if(!node){node=document.createElement("div");node.id=id;node.className=cls;phone.appendChild(node)}
      return node;
    };

    let secondary=$("#developerSecondaryDisplay",phone);
    if(active&&state.devSecondaryDisplay&&state.devSecondaryDisplay!=="Tidak ada"){
      secondary=secondary||ensure("developerSecondaryDisplay","developer-secondary-display");
      secondary.innerHTML=`<b>Layar sekunder</b><span>${escapeHtml(state.devSecondaryDisplay)}</span><small>Display #2</small>`;
    }else secondary?.remove();

    const flags=[];
    if(active&&state.devUsbDebugging)flags.push("ADB USB");
    if(active&&state.devWirelessDebugging)flags.push("ADB Wi‑Fi");
    if(active&&state.devDisableAdbTimeout)flags.push("ADB no-timeout");
    if(active&&state.devVerifyAppsUsb)flags.push("Verify USB");
    if(active&&state.devVerifyDebugBytecode)flags.push("ART verify");
    if(active&&state.devGpuDebugLayers)flags.push("GPU debug");
    if(active&&state.devExperimentalAngle)flags.push("ANGLE");
    if(active&&state.devGraphicsDriver&&state.devGraphicsDriver!=="Default sistem")flags.push(state.devGraphicsDriver);
    if(active&&state.devForceGpuRendering)flags.push("GPU 2D");
    if(active&&state.devDisableHwOverlays)flags.push("HW overlay off");
    if(active&&state.devMockModem)flags.push("Mock modem");
    if(active&&state.devFeaturePredictiveBack)flags.push("Predictive back");
    if(active&&state.devFeatureDesktopWindowing)flags.push("Desktop window");
    if(active&&state.devFeatureNewMediaControls)flags.push("Media controls v2");
    if(active&&state.devDisableDefaultFrameRate)flags.push("Game FPS bebas");
    if(active&&state.devBluetoothHciSnoop)flags.push("BT HCI log");
    if(active&&state.devWifiVerboseLogging)flags.push("Wi‑Fi verbose");
    if(active&&!state.devWifiScanThrottling)flags.push("Wi‑Fi no throttle");
    if(active&&state.devWifiNonPersistentMac)flags.push("Random MAC");
    if(active&&state.devHardwareTethering)flags.push("HW tether");
    if(active&&state.devVerboseVendorLogging)flags.push("Vendor log");
    if(active&&state.devNfcVerboseLogging)flags.push("NFC vendor log");
    if(active&&state.devNfcNciVerboseLogging)flags.push("NCI raw");
    if(active&&state.devBluetoothHdAudio)flags.push("BT HD");
    if(active&&state.devBluetoothA2dpOffload)flags.push("A2DP SW");

    let hud=$("#developerOptionHud",phone);
    if(active && state.devShowStatusHud && flags.length){
      hud=hud||ensure("developerOptionHud","developer-option-hud");
      hud.textContent=flags.join(" • ");
    } else {
      hud?.remove();
    }

    if(active&&state.devCellularAlwaysActive&&!state.airplane&&!state.mobileData){
      state.mobileData=true;save();
    }

    if(active&&state.devWifiNonPersistentMac&&state.wifi){
      const bucket=Math.floor(Date.now()/30000);
      const seed=String(bucket).slice(-6).padStart(6,"0");
      const mac=`02:${seed.slice(0,2)}:${seed.slice(2,4)}:${seed.slice(4,6)}:${String(state.battery).padStart(2,"0")}:A7`;
      if(state.devWifiRandomMac!==mac){state.devWifiRandomMac=mac;save()}
    }

    let settingsOverlay=$("#developerSettingsOverlay",phone);
    if(active&&state.devAllowOverlaySettings&&["settings","system","developerOptions"].includes(state.view)){
      settingsOverlay=settingsOverlay||ensure("developerSettingsOverlay","developer-settings-overlay");
      settingsOverlay.textContent="Overlay diizinkan";
    }else settingsOverlay?.remove();

    let awake=$("#developerStayAwakeBadge",phone);
    if(active&&state.devStayAwake){
      awake=awake||ensure("developerStayAwakeBadge","developer-stay-awake-badge");
      awake.textContent="☀ Tetap aktif";
    }else awake?.remove();

    if(!active||(!state.devPointerLocation&&!state.devTouchpadPointer))$("#developerPointerOverlay",phone)?.remove();
  }

  function render() {
    ensurePowerModeStyles();
    applyTheme();
    if (state.poweredOff) renderPowerOff();
    else if (state.screenOff) renderScreenOff();
    else if (state.locked && !["recovery", "bootloader", "boot"].includes(state.view)) renderLock();
    else {
      const map = {
        home: renderHome, wallpaperStyle: renderWallpaperStyle, color: renderColor, icons: renderIcons, layout: renderLayout,
        clock: renderClock, shortcuts: renderShortcuts, notifications: renderNotifications, lockMore: renderLockMore,
        wallpaperPicker: renderWallpaperPicker, homeSettings: renderHomeSettings, widgetPicker: renderWidgetPicker, settings: renderSettings, system: renderSystem,
        languageRegion: renderLanguageRegion, navigationMode: renderNavigationMode, gestureNavigation: renderGestureNavigation,
        developerOptions: renderDeveloperOptions, developerMemory: renderDeveloperMemory,
        developerRunningServices: renderDeveloperRunningServices, developerWirelessDebugging: renderDeveloperWirelessDebugging,
        developerSelectDebugApp: renderDeveloperSelectDebugApp,
        buttonNavigation: renderButtonNavigation, recents: renderRecents, about: renderAbout, androidEasterEgg: renderAndroidEasterEgg, android16Game: renderAndroid16Game,
        fingerprintSettings: renderFingerprintSettings, fingerprintEnroll: renderFingerprintEnroll, screenLockSettings: renderScreenLockSettings, pinEnroll: renderPinEnroll, patternEnroll: renderPatternEnroll,
        apps: renderApps, appInfo: renderAppInfo, simApp: renderSimApp, camera: renderCamera, cameraSettings: renderCameraSettings,
        boot: renderBoot, recovery: renderRecovery, bootloader: renderBootloader,

        networkInternet: renderNetworkInternet, internetSettings: renderInternetSettings, simSettings: renderSimSettings,
        eSimSetup: renderEsimSetup, eSimConfirm: renderEsimConfirm,
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
    if (state.shade && !["boot", "recovery", "bootloader"].includes(state.view) && !state.poweredOff) root.insertAdjacentHTML("beforeend", renderShadePanel());
    appendPowerTransientUi();
    bindDynamic();
    requestAnimationFrame(syncDynamicSystemBars);
    syncDeveloperOptionEffects();
    if(!state.developerOptionsEnabled||(!state.devPointerLocation&&!state.devTouchpadPointer)) $("#developerPointerOverlay",phone)?.remove();
    if(state.developerOptionsEnabled&&state.devSurfaceUpdates){
      root.classList.remove("developer-surface-flash");void root.offsetWidth;root.classList.add("developer-surface-flash");
      window.setTimeout(()=>root.classList.remove("developer-surface-flash"),150);
    }

    // V12 media bridge survives root.innerHTML replacement.
    requestAnimationFrame(() => {
      window.__waifuPersistentMediaBridgeV12?.sync?.();
    });
  }

  function bindDynamic() {
    $$('[data-nav]', root).forEach(btn => btn.addEventListener("click", () => btn.dataset.nav === "back" ? goBack() : navigate(btn.dataset.nav)));
    $$('[data-add-home-widget]', root).forEach(button => button.addEventListener("click", () => { const id=button.dataset.addHomeWidget;addHomeWidget(id);vibrate([6,18,6]);toast(`${homeWidgetDefinition(id).name} ditambahkan`);navigate("home",false); }));
    $$('[data-home-widget-index]', root).forEach(button => button.addEventListener("click", event => { event.preventDefault();event.stopPropagation();state.homeWidgetActive=Number(button.dataset.homeWidgetIndex)||0;save();vibrate(4);render(); }));

    $$('[data-open-app]', root).forEach(btn => btn.addEventListener("click", event => {
      if (state.view === "home" && homeEditMode) {
        event.preventDefault();
        return;
      }
      const id = btn.dataset.openApp;
      if (!id) return;
      if (id === "google") {
        vibrate(6);
        const opened = window.open("https://www.google.com/", "_blank", "noopener,noreferrer");
        if (!opened) toast("Izinkan pop-up untuk membuka Google");
        return;
      }
      if (["brimo", "digi-bank", "dana", "ovo"].includes(id)) {
        financialAuthSession = "";
        financialAuthBusy = false;
      }
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
    [$("#spotifyUrlInput", root), $("#youtubeUrlInput", root)].filter(Boolean).forEach(input => {
      const playFromInput = () => openPastedMediaLink(input.value, state.activeSimApp);
      input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); playFromInput(); } });
      input.addEventListener("paste", () => window.setTimeout(() => { if (input.value.trim()) playFromInput(); }, 60));
    });
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
      const key=btn.dataset.toggle;
      const label=btn.closest(".a17-row,.developer-master-card")?.querySelector("strong,span")?.textContent?.trim()||key;
      if(key==="devWaitForDebugger"&&!state.devDebugApp){toast("Pilih aplikasi debug terlebih dahulu");vibrate([8,25,8]);return;}
      state[key]=!state[key];
      if(key==="devUsbDebugging"&&state[key]&&Number(state.devUsbAuthorizationCount)===0)state.devUsbAuthorizationCount=1;
      if(key==="devBluetoothHciSnoop"&&state[key])state.devBluetoothHciPackets=0;
      if(key==="devNfcVerboseLogging"||key==="devNfcNciVerboseLogging")state.devNfcLogEntries=(Number(state.devNfcLogEntries)||0)+1;
      if(key==="devCellularAlwaysActive"&&state[key]&&!state.airplane)state.mobileData=true;
      save();vibrate();render();
      if(String(key).startsWith("dev")||key==="developerOptionsEnabled") toast(`${label}: ${state[key]?"aktif":"nonaktif"}`);
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

    $$('[data-developer-value-key]', root).forEach(btn => btn.addEventListener("click", () => {
      const key = btn.dataset.developerValueKey;
      const raw = btn.dataset.developerValue;
      state[key] = /^-?\d+(?:\.\d+)?$/.test(raw) ? Number(raw) : raw;

      const bluetoothKeys = new Set([
        "devAvrcpVersion","devMapVersion","devBluetoothCodec","devBluetoothSampleRate",
        "devBluetoothBits","devBluetoothChannel","devBluetoothMaxDevices"
      ]);

      if (bluetoothKeys.has(key) && state.pairedDeviceConnected) {
        state.devBluetoothHciPackets = (Number(state.devBluetoothHciPackets) || 0) + 6;
      }

      developerDialog = "";
      save();
      vibrate(6);
      render();

      const labels = {
        devLoggerBuffer:"Ukuran buffer logger",
        devAvrcpVersion:"Versi AVRCP",
        devMapVersion:"Versi MAP",
        devBluetoothCodec:"Codec Bluetooth",
        devBluetoothSampleRate:"Frekuensi sampel",
        devBluetoothBits:"Bit per sampel",
        devBluetoothChannel:"Mode channel",
        devBluetoothMaxDevices:"Batas perangkat Bluetooth"
      };
      if (labels[key]) toast(`${labels[key]}: ${raw}`);
    }));
    $$('[data-developer-usb-value]',root).forEach(btn=>btn.addEventListener("click",()=>{
      const value=btn.dataset.developerUsbValue||"Tidak ada transfer data";
      state.devUsbDefault=value;
      state.devUsbFileSharing=value==="File Sharing";
      state.usbTether=value==="Tethering USB";
      state.devUsbMidiActive=value==="MIDI";
      state.devUsbAndroidAutoActive=value==="Android Auto";
      state.devUsbPtpActive=value==="PTP";
      if(state.usbTether) state.mobileData=true;
      developerDialog="";
      save();vibrate([6,18,6]);render();toast(`USB default: ${value}`);
    }));

    $$('[data-developer-debug-app]', root).forEach(btn => btn.addEventListener("click", () => {
      state.devDebugApp=btn.dataset.developerDebugApp||"";
      developerDebuggerAttachedApp="";
      if(!state.devDebugApp) state.devWaitForDebugger=false;
      save(); vibrate(6); render();
      toast(state.devDebugApp?`${appById(state.devDebugApp)?.name||state.devDebugApp} dipilih untuk debug`:"Aplikasi debug dibersihkan");
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

    $$('[data-set-lock-type]', root).forEach(btn => btn.addEventListener("click", () => {
      const type=btn.dataset.setLockType;
      if(type==="PIN"){pinEnrollStage="new";pinEnrollBuffer="";pinEnrollFirst="";navigate("pinEnroll");return;}
      if(type==="Pola"){patternEnrollStage="new";patternEnrollFirst=[];activePattern=[];navigate("patternEnroll");return;}
      state.screenLock=type; save(); vibrate(8); render();
    }));

    $$('[data-pin-enroll-key]', root).forEach(btn=>btn.addEventListener("click",()=>{
      const k=btn.dataset.pinEnrollKey;
      if(k==="⌫") pinEnrollBuffer=pinEnrollBuffer.slice(0,-1); else if(pinEnrollBuffer.length<6) pinEnrollBuffer+=k;
      render();
    }));
    $$('[data-lock-pin-key]', root).forEach(btn=>btn.addEventListener("click",()=>{
      const k=btn.dataset.lockPinKey;
      if(k==="⌫") lockPinAttempt=lockPinAttempt.slice(0,-1); else if(lockPinAttempt.length<6) lockPinAttempt+=k;
      if(lockPinAttempt.length>=4 && lockPinAttempt===String(state.screenLockPin||"2580")){vibrate(22);unlockPhone();return;}
      render();
    }));
    bindPatternBoard();
    const fpSensor=$('.finger-enroll-sensor',root);
    if(fpSensor){
      let fpTimer=null;
      const pulse=()=>{if(state.fingerprintEnrollProgress>=100)return;state.fingerprintEnrollProgress=Math.min(100,(Number(state.fingerprintEnrollProgress)||0)+17);save();fpSensor.classList.add('scanning');vibrate(10);setTimeout(()=>fpSensor.classList.remove('scanning'),180);if(state.fingerprintEnrollProgress>=100){setTimeout(render,220);}else{const ring=$('.finger-enroll-ring',root);if(ring)ring.style.setProperty('--fp-progress',`${state.fingerprintEnrollProgress*3.6}deg`);const label=$('.finger-progress-label',root);if(label)label.textContent=`${state.fingerprintEnrollProgress}%`;}};
      fpSensor.addEventListener('pointerdown',()=>{pulse();fpTimer=setInterval(pulse,520)});
      ['pointerup','pointercancel','pointerleave'].forEach(ev=>fpSensor.addEventListener(ev,()=>{if(fpTimer){clearInterval(fpTimer);fpTimer=null;}}));
    }

    $$('[data-action]', root).forEach(btn => btn.addEventListener("click", () => handleAction(btn.dataset.action)));

    $$('[data-camera-mode]', root).forEach(btn => btn.addEventListener("click", () => {
      state.cameraMode = btn.dataset.cameraMode || "camera";
      state.cameraPanelOpen = false;
      save(); vibrate(5); render();
    }));
    $$('[data-camera-zoom]', root).forEach(btn => btn.addEventListener("click", () => {
      state.cameraZoom = Number(btn.dataset.cameraZoom) === 2 ? 2 : 1;
      save(); vibrate(4); render();
    }));
    $$('[data-camera-panel]', root).forEach(btn => btn.addEventListener("click", () => {
      state.cameraPanelOpen = !state.cameraPanelOpen;
      save(); vibrate(4); render();
    }));
    $('[data-camera-switch]', root)?.addEventListener("click", () => {
      state.cameraLens = state.cameraLens === "front" ? "rear" : "front";
      save(); vibrate(8); render();
    });
    $$('[data-camera-flash]', root).forEach(btn => btn.addEventListener("click", () => {
      state.cameraFlash = btn.dataset.cameraFlash === "on";
      save(); render();
    }));
    $$('[data-camera-resolution]', root).forEach(btn => btn.addEventListener("click", () => {
      state.cameraResolution = btn.dataset.cameraResolution === "4K" ? "4K" : "FHD";
      save(); render();
    }));
    $$('[data-camera-fps]', root).forEach(btn => btn.addEventListener("click", () => {
      state.cameraFps = Number(btn.dataset.cameraFps) === 60 ? 60 : 30;
      save(); render();
    }));
    $$('[data-camera-video-mode]', root).forEach(btn => btn.addEventListener("click", () => {
      const next = btn.dataset.cameraVideoMode;
      state.cameraVideoMode = ["slow", "normal", "timelapse"].includes(next) ? next : "normal";
      save(); vibrate(4); render();
    }));
    $('[data-camera-stabilization]', root)?.addEventListener("click", () => {
      state.cameraStabilization = !state.cameraStabilization;
      save(); vibrate(4); render();
    });

    const cameraModeRail = $('[data-camera-mode-rail]', root);
    if (cameraModeRail instanceof HTMLElement) {
      const modeButtons = () => [...cameraModeRail.querySelectorAll('[data-camera-mode]')];
      const centerModeButton = (button, behavior = "smooth") => {
        if (!(button instanceof HTMLElement) || !cameraModeRail.isConnected) return;
        const left = button.offsetLeft - (cameraModeRail.clientWidth - button.offsetWidth) / 2;
        cameraModeRail.scrollTo({ left: Math.max(0, left), behavior });
      };
      const activateNearestCameraMode = () => {
        if (!cameraModeRail.isConnected) return;
        const buttons = modeButtons();
        if (!buttons.length) return;
        const railRect = cameraModeRail.getBoundingClientRect();
        const centerX = railRect.left + railRect.width / 2;
        const nearest = buttons.reduce((best, button) => {
          const rect = button.getBoundingClientRect();
          const distance = Math.abs((rect.left + rect.width / 2) - centerX);
          return !best || distance < best.distance ? { button, distance } : best;
        }, null)?.button;
        if (!(nearest instanceof HTMLElement)) return;
        const nextMode = nearest.dataset.cameraMode || "camera";
        if (nextMode === state.cameraMode) {
          centerModeButton(nearest);
          return;
        }
        state.cameraMode = nextMode;
        state.cameraPanelOpen = false;
        save();
        vibrate(5);
        render();
      };

      const activeMode = cameraModeRail.querySelector('[data-camera-mode].active');
      requestAnimationFrame(() => centerModeButton(activeMode, "auto"));

      let mouseDrag = null;
      let suppressModeClick = false;
      let settleTimer = 0;
      const queueNearestMode = (delay = 90) => {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(activateNearestCameraMode, delay);
      };

      cameraModeRail.addEventListener("pointerdown", event => {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        mouseDrag = { x: event.clientX, scrollLeft: cameraModeRail.scrollLeft, moved: false, pointerId: event.pointerId };
        cameraModeRail.classList.add("dragging");
        try { cameraModeRail.setPointerCapture(event.pointerId); } catch {}
      });
      cameraModeRail.addEventListener("pointermove", event => {
        if (!mouseDrag || event.pointerId !== mouseDrag.pointerId) return;
        const dx = event.clientX - mouseDrag.x;
        if (Math.abs(dx) > 4) mouseDrag.moved = true;
        cameraModeRail.scrollLeft = mouseDrag.scrollLeft - dx;
        if (mouseDrag.moved) event.preventDefault();
      });
      const finishCameraModeDrag = event => {
        if (!mouseDrag || (event.pointerId != null && event.pointerId !== mouseDrag.pointerId)) return;
        const moved = !!mouseDrag.moved;
        suppressModeClick = moved;
        try { cameraModeRail.releasePointerCapture(mouseDrag.pointerId); } catch {}
        mouseDrag = null;
        cameraModeRail.classList.remove("dragging");
        if (moved) queueNearestMode(20);
        if (suppressModeClick) setTimeout(() => { suppressModeClick = false; }, 0);
      };
      cameraModeRail.addEventListener("pointerup", finishCameraModeDrag);
      cameraModeRail.addEventListener("pointercancel", finishCameraModeDrag);
      cameraModeRail.addEventListener("click", event => {
        if (!suppressModeClick) return;
        event.preventDefault();
        event.stopImmediatePropagation();
      }, true);
      cameraModeRail.addEventListener("scroll", () => queueNearestMode(120), { passive: true });
      if ("onscrollend" in cameraModeRail) {
        cameraModeRail.addEventListener("scrollend", activateNearestCameraMode, { passive: true });
      }
      cameraModeRail.addEventListener("wheel", event => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        cameraModeRail.scrollLeft += event.deltaY;
        queueNearestMode(140);
        event.preventDefault();
      }, { passive: false });
    }
    $$('[data-camera-settings]', root).forEach(btn => btn.addEventListener("click", () => {
      state.cameraPanelOpen = false; save(); navigate("cameraSettings");
    }));
    $$('[data-camera-setting]', root).forEach(btn => btn.addEventListener("click", () => {
      const key = btn.dataset.cameraSetting;
      if (!(key in state)) return;
      state[key] = !state[key]; save(); vibrate(4); render();
    }));
    $$('[data-camera-extra]', root).forEach(btn => btn.addEventListener("click", () => {
      toast(btn.dataset.cameraExtra === "sphere" ? "Photo Sphere simulator" : "Panorama simulator");
      vibrate(5);
    }));
    $('[data-camera-focus]', root)?.addEventListener("click", event => {
      const area = event.currentTarget;
      const dot = area?.querySelector('.camera-pro-focus');
      if (!dot || !(area instanceof HTMLElement)) return;
      const r = area.getBoundingClientRect();
      dot.style.left = `${event.clientX - r.left}px`;
      dot.style.top = `${event.clientY - r.top}px`;
      vibrate(3);
    });

    $("#brightnessSlider")?.addEventListener("input", e => { state.brightness = Number(e.target.value); save(); applyTheme(); });
    $("#qsVolumeSlider")?.addEventListener("input", e => { state.volume = Number(e.target.value); save(); });

    if (state.view === "simApp" && state.activeSimApp === "spotify") hydrateSpotifyAccount();
    if (state.view === "simApp" && ["youtube","youtube-music"].includes(state.activeSimApp)) hydrateYouTubeAccount();

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
        if (dy < -42) {
          if (state.screenLock === "PIN" || state.screenLock === "Pola") { lockAuthVisible = true; lockPinAttempt = ""; activePattern = []; render(); }
          else unlockPhone();
        }
      });
      lockPage.addEventListener("pointercancel", () => { lockStartY = null; });
    }
  }

  function showDeveloperTapIndicator(event) {
    if (!state.developerOptionsEnabled || !state.devShowTaps) return;
    if (!(phone instanceof HTMLElement)) return;
    const rect=phone.getBoundingClientRect();
    const dot=document.createElement("span");
    dot.className="developer-tap-indicator";
    dot.style.left=`${event.clientX-rect.left}px`;
    dot.style.top=`${event.clientY-rect.top}px`;
    phone.appendChild(dot);
    window.setTimeout(()=>dot.remove(),420);
  }
  phone.addEventListener("pointerdown",showDeveloperTapIndicator,{passive:true});
  phone.addEventListener("pointermove",event=>{
    if(!state.developerOptionsEnabled)return;
    const use=state.devPointerLocation||(state.devTouchpadPointer&&event.pointerType==="mouse");
    if(!use)return;
    const rect=phone.getBoundingClientRect();
    developerPointerLast={x:event.clientX-rect.left,y:event.clientY-rect.top,type:event.pointerType||"mouse"};
    let overlay=$("#developerPointerOverlay",phone);
    if(!overlay){overlay=document.createElement("div");overlay.id="developerPointerOverlay";overlay.className="developer-pointer-overlay";phone.appendChild(overlay);}
    overlay.style.setProperty("--pointer-x",`${developerPointerLast.x}px`);
    overlay.style.setProperty("--pointer-y",`${developerPointerLast.y}px`);
    overlay.innerHTML=`<span>X:${Math.round(developerPointerLast.x)} Y:${Math.round(developerPointerLast.y)} ${developerPointerLast.type}</span><i></i><b></b>`;
  },{passive:true});

  phone.addEventListener("click",event=>{
    if(!state.developerOptionsEnabled||!state.devViewAttributeInspection)return;
    if(event.target.closest(".pixel-statusbar,#androidGesturePill,.pixel-three-button-nav"))return;
    const target=event.target instanceof Element?event.target:null;if(!target)return;
    state.devAttributeInspectCount=(Number(state.devAttributeInspectCount)||0)+1;
    const label=target.getAttribute("aria-label")||target.textContent?.trim()?.replace(/\s+/g," ").slice(0,28)||target.tagName;
    toast(`Inspect: ${target.tagName.toLowerCase()} • ${label}`);
  },true);

  function bindPatternBoard() {
    const board=$('[data-pattern-board]',root); if(!board) return;
    const mode=board.dataset.patternBoard;
    let drawing=false; activePattern=[];
    const svg=$('.pattern-lines',board);
    const dots=$$('[data-pattern-dot]',board);
    const centers=()=>dots.map(d=>{const br=board.getBoundingClientRect(),r=d.getBoundingClientRect();return{x:r.left-br.left+r.width/2,y:r.top-br.top+r.height/2}});
    const redraw=(pointer=null)=>{
      dots.forEach((d,i)=>d.classList.toggle('selected',activePattern.includes(i)));
      if(!svg)return; const pts=centers(); let html='';
      for(let i=1;i<activePattern.length;i++){const a=pts[activePattern[i-1]],b=pts[activePattern[i]];html+=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;}
      if(pointer&&activePattern.length){const a=pts[activePattern[activePattern.length-1]];html+=`<line class="ghost" x1="${a.x}" y1="${a.y}" x2="${pointer.x}" y2="${pointer.y}"/>`;}
      svg.innerHTML=html;
    };
    const addFromPoint=(clientX,clientY)=>{const br=board.getBoundingClientRect(),pts=centers();const x=clientX-br.left,y=clientY-br.top;let best=-1,dist=28;pts.forEach((p,i)=>{const d=Math.hypot(p.x-x,p.y-y);if(d<dist&&!activePattern.includes(i)){best=i;dist=d}});if(best>=0){activePattern.push(best);vibrate(5);redraw({x,y});}};
    board.addEventListener('pointerdown',e=>{if(e.target.closest('.lock-auth-close'))return;drawing=true;activePattern=[];board.setPointerCapture?.(e.pointerId);addFromPoint(e.clientX,e.clientY);e.preventDefault()});
    board.addEventListener('pointermove',e=>{if(!drawing)return;addFromPoint(e.clientX,e.clientY);const br=board.getBoundingClientRect();redraw({x:e.clientX-br.left,y:e.clientY-br.top});e.preventDefault()});
    const finish=()=>{
      if(!drawing)return;drawing=false;redraw();
      if(mode==='enroll'){
        const status=$('#patternEnrollStatus',root);
        if(activePattern.length<4){if(status)status.textContent='Hubungkan minimal 4 titik';vibrate([20,40,20]);return;}
        if(patternEnrollStage==='new'){patternEnrollFirst=[...activePattern];patternEnrollStage='confirm';setTimeout(render,220);return;}
        if(activePattern.join('-')===patternEnrollFirst.join('-')){state.screenLock='Pola';state.screenLockPattern=[...activePattern];save();vibrate(25);toast('Pola berhasil disimpan');setTimeout(()=>navigate('deviceUnlock',false),280);}else{if(status)status.textContent='Pola tidak cocok. Coba lagi.';vibrate([20,40,20]);}
      } else if(mode==='unlock'){
        const saved=Array.isArray(state.screenLockPattern)?state.screenLockPattern:[0,1,2,5];
        if(activePattern.join('-')===saved.join('-')){vibrate(22);unlockPhone();}else{vibrate([20,45,20]);toast('Pola salah');setTimeout(()=>{activePattern=[];redraw()},240);}
      }
    };
    board.addEventListener('pointerup',finish);board.addEventListener('pointercancel',finish);
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
    if (key === "region") {
      state.regionManuallySelected = true;
      state.regionDetected = false;
      state.regionDetectionStatus = "idle";
    }
    save(); vibrate(5); render();
  }

  function toggleQuick(key) {
    if (key === "airplane") {
      state.airplane = !state.airplane;
      if (state.airplane) {
        state.wifi = false;
        state.mobileData = false;
      }
    } else if (key === "screenRecord") {
      state.screenRecord = !state.screenRecord;
      state.screenRecordStart = state.screenRecord ? Date.now() : 0;
    } else if (key === "separateQs") {
      state.separateQs = !state.separateQs;
      state.shadePanel = "quick";
    } else if (key === "mobileData") {
      if (state.airplane) state.airplane = false;
      state.mobileData = !state.mobileData;
    } else if (key === "wifi") {
      if (state.airplane) state.airplane = false;
      state.wifi = !state.wifi;
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

    if(action==="developer-attach-debugger"){
      developerDebuggerAttachedApp=app?.id||"";
      vibrate([8,20,8]);render();toast(`Debugger terhubung ke ${app?.name||"aplikasi"}`);return;
    }

    if (action === "finance-biometric-auth") {
      if (financialAuthBusy) return;
      financialAuthBusy = true;
      vibrate(18);
      render();

      window.setTimeout(() => {
        financialAuthBusy = false;
        financialAuthSession = app.id;
        vibrate([18, 45, 18]);
        render();
        toast(`Sidik jari terverifikasi • ${app.name}`);
      }, 720);
      return;
    }

    if (action === "finance-biometric-cancel") {
      financialAuthBusy = false;
      financialAuthSession = "";
      navigate("apps", false);
      return;
    }

    if (action?.startsWith("simtk-select-")) {
      const id = action.replace("simtk-select-", "");
      if (["sim1", "sim2", "esim"].includes(id)) {
        state.simToolkitSelected = id;
        save();
        vibrate(5);
        render();
      }
      return;
    }

    if (action === "simtk-toggle-current") {
      const profile = simToolkitProfileMeta(state.simToolkitSelected);
      if (profile.id === "esim") {
        if (!state.eSimInstalled) {
          navigate("eSimSetup");
          return;
        }
        state.eSimEnabled = !state.eSimEnabled;
      } else {
        state[profile.enabledKey] = !state[profile.enabledKey];
      }
      save();
      vibrate(7);
      render();
      return;
    }

    if (action === "simtk-toggle-roaming") {
      const id = state.simToolkitSelected || "sim1";
      const roaming = state.simToolkitRoaming && typeof state.simToolkitRoaming === "object"
        ? { ...state.simToolkitRoaming }
        : { sim1: false, sim2: false, esim: false };
      roaming[id] = !roaming[id];
      state.simToolkitRoaming = roaming;
      save();
      vibrate(5);
      render();
      return;
    }

    if (["simtk-primary-call", "simtk-primary-sms", "simtk-primary-data"].includes(action)) {
      const id = state.simToolkitSelected || "sim1";
      const profile = simToolkitProfileMeta(id);
      const enabled = id === "esim" ? state.eSimInstalled && state.eSimEnabled : !!state[profile.enabledKey];
      if (!enabled) {
        toast("Aktifkan SIM ini terlebih dahulu");
        vibrate([12, 35, 12]);
        return;
      }

      if (action === "simtk-primary-call") state.primaryCallSim = id;
      if (action === "simtk-primary-sms") state.primarySmsSim = id;
      if (action === "simtk-primary-data") state.primaryDataSim = id;
      save();
      vibrate(6);
      render();
      toast(`${profile.label} dijadikan SIM utama`);
      return;
    }

    if (action === "simtk-mobile-data") {
      state.mobileData = !state.mobileData;
      save(); vibrate(5); render();
      return;
    }

    if (action === "simtk-auto-data") {
      state.autoDataSwitch = !state.autoDataSwitch;
      save(); vibrate(5); render();
      return;
    }

    if (action === "simtk-add-esim") {
      navigate("eSimSetup");
      return;
    }

    if (action === "simtk-system-settings") {
      navigate("simSettings");
      return;
    }

    if (action === "spotify-connect") { startSpotifyOAuth(); return; }
    if (action === "spotify-disconnect") {
      ["wg_spotify_access_token","wg_spotify_expires_at","wg_spotify_refresh_token"].forEach(k=>sessionStorage.removeItem(k));
      render(); return;
    }
    if (action === "spotify-open-url") { openPastedMediaLink($("#spotifyUrlInput", root)?.value || "", "spotify"); return; }
    if (action === "youtube-connect") { startYouTubeOAuth(); return; }
    if (action === "youtube-disconnect") { sessionStorage.removeItem("wg_youtube_access_token"); sessionStorage.removeItem("wg_youtube_expires_at"); render(); return; }
    if (action === "youtube-open-url") { openPastedMediaLink($("#youtubeUrlInput", root)?.value || "", state.activeSimApp); return; }
    if (action === "media-paste-clipboard") {
      pasteMediaLinkFromClipboard(state.activeSimApp);
      return;
    }
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
    if (action === "startFingerprintEnroll") { state.fingerprintEnrollProgress=0; save(); navigate("fingerprintEnroll"); return; }
    if (action === "finishFingerprintEnroll") { state.fingerprintEnrolled=true; state.sideKeyConfigured=true; state.fingerprintEnrollProgress=100; save(); navigate("fingerprintSettings",false); toast("Sidik jari ditambahkan"); return; }
    if (action === "removeFingerprint") { state.fingerprintEnrolled=false; state.sideKeyConfigured=false; state.fingerprintEnrollProgress=0; save(); render(); toast("Sidik jari dihapus"); return; }
    if (action === "pinEnrollContinue") {
      if(pinEnrollBuffer.length<4)return;
      if(pinEnrollStage==="new"){pinEnrollFirst=pinEnrollBuffer;pinEnrollBuffer="";pinEnrollStage="confirm";render();return;}
      if(pinEnrollBuffer===pinEnrollFirst){state.screenLock="PIN";state.screenLockPin=pinEnrollBuffer;save();pinEnrollBuffer="";pinEnrollFirst="";pinEnrollStage="new";toast("PIN berhasil disimpan");setTimeout(()=>navigate("deviceUnlock",false),260);}else{pinEnrollBuffer="";toast("PIN tidak cocok. Coba lagi.");vibrate([20,40,20]);render();}
      return;
    }
    if (action === "closeLockAuth") { lockAuthVisible=false;lockPinAttempt="";activePattern=[];render();return; }
    if (action === "lockFingerprint") {
      const sensor=$('.in-display-fingerprint',root);
      if(state.lockdownActive){toast('Kunci total aktif • gunakan PIN atau pola');vibrate([18,35,18]);return;}
      if(!state.fingerprintEnrolled){toast('Daftarkan sidik jari di Setelan');vibrate(6);return;}
      sensor?.classList.add('scanning');vibrate(18);setTimeout(()=>{if(state.locked)unlockPhone();},520);return;
    }
    if (action === "power-menu-dismiss") { powerMenuStage = ""; render(); return; }
    if (action === "power-emergency") {
      powerMenuStage = "";
      state.poweredOff = false; state.screenOff = false; state.locked = false; state.shade = false;
      save();
      openSimAppDirect("phone");
      return;
    }
    if (action === "power-lockdown") {
      powerMenuStage = "";
      state.lockdownActive = true; state.poweredOff = false; state.screenOff = false; state.locked = true; state.shade = false;
      save(); vibrate(18); render();
      return;
    }
    if (action === "power-off") { powerMenuStage = ""; shutdownPhone(); return; }
    if (action === "power-restart") { powerMenuStage = "restart"; vibrate(5); render(); return; }
    if (action === "power-screenshot") { powerMenuStage = ""; takeSimulatorScreenshot(); return; }
    if (action === "power-restart-system") { powerMenuStage = ""; rebootPhone("system"); return; }
    if (action === "power-restart-systemui") { powerMenuStage = ""; restartSystemUi(); return; }
    if (action === "power-restart-recovery") { powerMenuStage = ""; rebootPhone("recovery"); return; }
    if (action === "power-restart-bootloader") { powerMenuStage = ""; rebootPhone("bootloader"); return; }

    if (action?.startsWith("bootloader-select-")) {
      const id = action.slice("bootloader-select-".length);
      const index = BOOTLOADER_OPTIONS.findIndex(item => item.id === id);
      if (index >= 0) { state.bootloaderSelection = index; save(); vibrate(5); handleBootloaderSelection(); }
      return;
    }

    if (action?.startsWith("recovery-open-")) {
      state.recoveryPage = action.slice("recovery-open-".length) || "main";
      save(); vibrate(4); render(); return;
    }
    if (action === "recovery-home") { state.recoveryPage = "main"; save(); render(); return; }
    if (action === "recovery-back") { state.recoveryPage = state.recoveryPage === "main" ? "main" : "main"; save(); render(); return; }
    if (action === "recovery-log") { toast("TWRP log • simulasi recovery aktif"); return; }
    if (action === "recovery-toggle-mount-system") { state.recoveryMountSystem = !state.recoveryMountSystem; save(); vibrate(4); render(); return; }
    if (action === "recovery-toggle-readonly") { state.recoveryReadOnly = !state.recoveryReadOnly; save(); vibrate(4); render(); return; }
    if (action === "recovery-sim-install") { toast("ZIP simulasi berhasil diverifikasi • tidak ada flash nyata"); vibrate(8); return; }
    if (action === "recovery-wipe-cache") { toast("Cache / Dalvik dibersihkan dalam simulasi"); vibrate(8); return; }
    if (action === "recovery-wipe-data") { toast("Factory Reset simulasi selesai • data website tetap aman"); vibrate([12,30,12]); return; }
    if (action === "recovery-backup-run") { toast("Backup TWRP simulasi selesai"); vibrate(8); return; }
    if (action === "recovery-sim-terminal") { toast("Terminal recovery simulasi dibuka"); return; }
    if (action === "recovery-sim-filemanager") { toast("File Manager recovery simulasi dibuka"); return; }
    if (action === "recovery-sim-haptics") { vibrate([15,40,15]); toast("Getaran recovery diuji"); return; }
    if (action === "recovery-sim-timezone") { toast("Zona waktu: Asia/Jakarta"); return; }

    if (action === "dismissMenu") { state.longPressMenu = false; render(); }
    if (action === "extractSimWallpaperPalette") { applyWallpaperColorBurst(); }
    if (action === "openStyle") { state.styleTab = "home"; state.wallpaperTarget = "home"; navigate("wallpaperStyle"); }
    if (action === "openHomeLayoutEditor") { homeEditMode=true;state.longPressMenu=false;navigate("home",false);return; }
    if (action === "widgetToast") { state.longPressMenu=false; navigate("widgetPicker"); return; }
    if (action === "home-edit-done") { homeEditMode=false;homeDragState=null;save();vibrate(6);render();return; }
    if (action === "home-edit-reset") { state.homeAppOrder=["instagram","tiktok","wa-business","nekogram"];state.homeDockOrder=["phone","message","chrome","contacts","camera"];state.homeWidgets=["screen-time"];state.homeWidgetActive=0;state.homeWidgetSide="right";state.homeWidgetSizes={"screen-time":"medium"};save();vibrate([8,20,8]);render();toast("Tata letak layar utama direset");return; }
    if (action === "home-widget-size-down") { const s=cycleHomeWidgetSize(-1);vibrate(5);render();toast(`Ukuran widget: ${s}`);return; }
    if (action === "home-widget-size-up") { const s=cycleHomeWidgetSize(1);vibrate(5);render();toast(`Ukuran widget: ${s}`);return; }
    if (action === "home-widget-move-side") { state.homeWidgetSide=state.homeWidgetSide==="left"?"right":"left";save();vibrate(5);render();return; }
    if (action === "home-widget-remove") { if(state.homeWidgets.length<=1){toast("Sisakan minimal satu widget");return;}const id=currentHomeWidgetId();state.homeWidgets=state.homeWidgets.filter(x=>x!==id);state.homeWidgetActive=Math.max(0,Math.min(state.homeWidgets.length-1,state.homeWidgetActive));save();vibrate(6);render();toast("Widget dihapus");return; }
    if (action === "applyLayout") {
      state.homeCols = Math.max(4, Math.min(6, Number(state.layoutDraft) || 5));
      state.layoutDraft = state.homeCols;
      save();
      applyTheme();
      vibrate(8);
      navigate("wallpaperStyle", false);
    }
    if (action === "closeShade") { state.shade = false; render(); }
    if (action === "clearShadeNotifications") { state.shadeNotificationsCleared = true; save(); vibrate(6); render(); return; }
    if (action === "shutter") {
      const page = root.querySelector(".camera-pro-page");
      if (page) {
        const flash = document.createElement("div");
        flash.className = "camera-pro-flash";
        page.appendChild(flash);
        window.setTimeout(() => flash.remove(), 220);
      }
      vibrate(12);
      toast(state.cameraMode === "video" ? "Rekaman video simulasi dimulai" : t("photoCaptured"));
    }
    if (action === "nowPlayingToast") toast(t("nowPlayingDesc"));
    if (action === "detectBrowserRegion") {
      detectRegionUsingBrowser();
      return;
    }
    if (action === "setManualTime") {
      const current = String(state.manualTime || "20:30");
      const value = window.prompt("Atur waktu manual (HH:MM)", current);
      if (value === null) return;
      const normalized = String(value).trim();
      if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(normalized)) {
        toast("Format waktu harus HH:MM");
        return;
      }
      state.manualTime = normalized;
      save(); vibrate(5); render();
      return;
    }

    if (action === "developer-oem-toggle") {
      if (state.oemUnlockAllowed) {
        state.oemUnlockAllowed = false;
        save(); vibrate(8); render(); toast("Pembukaan kunci OEM dinonaktifkan");
        return;
      }
      developerDialog = "oem-confirm";
      render();
      return;
    }
    if (action === "developer-oem-confirm") {
      state.oemUnlockAllowed = true;
      developerDialog = "";
      save(); vibrate([12,35,12]); render(); toast("Pembukaan kunci OEM diizinkan");
      return;
    }
    if (action === "developer-dialog-close") { developerDialog=""; render(); return; }
    if (action === "developer-save-smallest-width") {
      const input=$("#developerSmallestWidthInput",root);
      state.devSmallestWidth=Math.max(320,Math.min(720,Number(input?.value)||392));
      developerDialog=""; save(); vibrate(5); render(); return;
    }
    if (action === "developer-memory-period") { developerDialog="memory-period"; render(); return; }
    if (action === "developer-revoke-usb") {
      if (Number(state.devUsbAuthorizationCount) <= 0) {
        toast("Tidak ada komputer USB yang diotorisasi");
        vibrate(5);
        return;
      }
      developerDialog="usb-revoke-confirm";
      render();
      return;
    }
    if (action === "developer-revoke-usb-confirm") {
      state.devUsbAuthorizationCount=0;
      developerDialog="";
      save();
      vibrate([8,24,8]);
      render();
      toast("Semua otorisasi debug USB telah dicabut");
      return;
    }
    if (action === "developer-bug-report") { state.devBugReportCount=(Number(state.devBugReportCount)||0)+1; developerDialog="bug-report"; save(); vibrate(8); render(); return; }
    if (action === "developer-feature-flags") { developerDialog="feature-flags"; render(); return; }
    if (action === "developer-driver-preferences") { developerDialog="graphics-driver"; render(); return; }
    if (action === "developer-app-compat") { developerDialog="app-compat"; render(); return; }
    if (action === "developer-open-logger-buffer") { developerDialog="logger-buffer"; render(); return; }
    if (action === "developer-open-usb-config") { developerDialog="usb-config"; render(); return; }
    if (action === "developer-open-avrcp") { developerDialog="avrcp-version"; render(); return; }
    if (action === "developer-open-map") { developerDialog="map-version"; render(); return; }
    if (action === "developer-open-bt-codec") { developerDialog="bt-codec"; render(); return; }
    if (action === "developer-open-bt-rate") { developerDialog="bt-rate"; render(); return; }
    if (action === "developer-open-bt-bits") { developerDialog="bt-bits"; render(); return; }
    if (action === "developer-open-bt-channel") { developerDialog="bt-channel"; render(); return; }
    if (action === "developer-open-bt-max") { developerDialog="bt-max"; render(); return; }
    if (action === "developer-open-window-scale") { developerDialog="window-scale"; render(); return; }
    if (action === "developer-open-transition-scale") { developerDialog="transition-scale"; render(); return; }
    if (action === "developer-open-animator-scale") { developerDialog="animator-scale"; render(); return; }
    if (action === "developer-open-secondary-display") { developerDialog="secondary-display"; render(); return; }
    if (action === "developer-open-smallest-width") { developerDialog="smallest-width"; render(); return; }
    if (action === "developer-open-display-cutout") { developerDialog="display-cutout"; render(); return; }

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
    if (action === "beginEsimSetup") {
      state.eSimInstalling = false;
      save(); vibrate(7); navigate("eSimSetup");
      return;
    }
    if (action === "toggleEsim") {
      if (!state.eSimInstalled) { navigate("eSimSetup"); return; }
      state.eSimEnabled = !state.eSimEnabled;
      if (!state.eSimEnabled) {
        if (state.primaryDataSim === "esim") state.primaryDataSim = state.sim1Enabled ? "sim1" : "sim2";
        if (state.primarySmsSim === "esim") state.primarySmsSim = state.sim1Enabled ? "sim1" : "sim2";
        if (state.primaryCallSim === "esim") state.primaryCallSim = "ask";
      }
      save(); vibrate(7); render();
      toast(state.eSimEnabled ? "eSIM diaktifkan" : "eSIM dinonaktifkan");
      return;
    }
    if (action === "esimQrScanner") {
      toast("Pemindai QR eSIM simulasi dibuka • pilih operator di bawah");
      vibrate(5);
      return;
    }
    if (action === "installEsim") {
      if (state.eSimInstalling) return;
      const provider = simProviderById(state.eSimProvider) || ESIM_PROVIDERS[0];
      state.eSimProvider = provider.id;
      state.eSimInstalling = true;
      save(); vibrate(10); render();
      window.setTimeout(() => {
        state.eSimInstalled = true;
        state.eSimEnabled = true;
        state.eSimInstalling = false;
        if (!state.eSimPhone) state.eSimPhone = makeRandomIndoNumber();
        if (!state.eSimIccid) state.eSimIccid = `8962${String(Date.now()).slice(-15)}`;
        save();
        navigate("simSettings", false);
        toast(`eSIM ${provider.name} berhasil ditambahkan`);
      }, 1100);
      return;
    }
    if (action === "removeEsim") {
      state.eSimInstalled = false;
      state.eSimEnabled = false;
      state.eSimProvider = "";
      state.eSimPhone = "";
      state.eSimIccid = "";
      state.eSimInstalling = false;
      if (state.primaryDataSim === "esim") state.primaryDataSim = state.sim1Enabled ? "sim1" : "sim2";
      if (state.primarySmsSim === "esim") state.primarySmsSim = state.sim1Enabled ? "sim1" : "sim2";
      if (state.primaryCallSim === "esim") state.primaryCallSim = "ask";
      save(); vibrate(8); render(); toast("eSIM dihapus dari simulator");
      return;
    }
    if(action==="pairUnnamedBt"){
      state.pairedDevice="7C:91:22:AF:10:3D";state.pairedDeviceConnected=true;
      if(state.devBluetoothHciSnoop)state.devBluetoothHciPackets=(Number(state.devBluetoothHciPackets)||0)+42;
      save();vibrate(8);navigate("bluetoothDeviceDetail");toast("Perangkat tanpa nama terhubung");return;
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
    if (action === "addBatteryWidget") { addHomeWidget("battery");toast("Widget baterai ditambahkan");setTimeout(()=>navigate("home"),240); }
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

  function lockPhone() {
    lockAuthVisible=false; lockPinAttempt=""; activePattern=[];
    state.screenOff = false; state.locked = true; state.shade = false;
    save(); render();
  }
  function unlockPhone() {
    lockAuthVisible=false; lockPinAttempt=""; activePattern=[];
    state.screenOff = false; state.locked = false; state.lockdownActive = false;
    state.view = "home"; state.shade = false;
    save(); render();
  }

  function showPowerMenu() {
    if (state.poweredOff) return;
    if (state.screenOff) { state.screenOff = false; state.locked = true; save(); }
    if (["bootloader", "recovery", "boot"].includes(state.view)) return;
    powerMenuStage = "main";
    vibrate(12);
    render();
  }

  function togglePower() {
    if (state.poweredOff) return;
    if (state.view === "bootloader") { handleBootloaderSelection(); return; }
    if (state.view === "recovery") {
      state.screenOff = !state.screenOff;
      state.locked = false;
      save(); render();
      return;
    }
    powerMenuStage = "";
    if (state.screenOff) {
      state.screenOff = false;
      state.locked = true;
    } else {
      state.screenOff = true;
      state.locked = true;
      state.shade = false;
    }
    save(); render();
  }

  function shutdownPhone() {
    clearTimeout(bootTransitionTimer);
    powerMenuStage = "";
    systemUiRestarting = false;
    state.poweredOff = true;
    state.screenOff = false;
    state.locked = false;
    state.shade = false;
    state.view = "powerOff";
    save(); vibrate(22); render();
  }

  function completeSystemBoot() {
    state.poweredOff = false;
    state.screenOff = false;
    state.view = "home";
    state.locked = true;
    state.shade = false;
    state.recoveryPage = "main";
    save(); render();
  }

  function rebootPhone(target = "system") {
    clearTimeout(bootTransitionTimer);
    powerMenuStage = "";
    systemUiRestarting = false;
    state.poweredOff = false;
    state.screenOff = false;
    state.locked = false;
    state.shade = false;
    state.view = "boot";
    save(); render();

    bootTransitionTimer = window.setTimeout(() => {
      if (target === "recovery") {
        state.view = "recovery";
        state.recoveryPage = "main";
        state.locked = false;
        save(); render();
        return;
      }
      if (target === "bootloader") {
        state.view = "bootloader";
        state.bootloaderSelection = 0;
        state.locked = false;
        save(); render();
        return;
      }
      completeSystemBoot();
    }, target === "system" ? 1450 : 850);
  }

  function restartSystemUi() {
    if (state.poweredOff || ["bootloader", "recovery"].includes(state.view)) return;
    systemUiRestarting = true;
    state.shade = false;
    save(); render(); vibrate(10);
    window.setTimeout(() => {
      systemUiRestarting = false;
      render();
      toast("Sistem UI berhasil dimulai ulang");
    }, 950);
  }

  function takeSimulatorScreenshot() {
    clearTimeout(screenshotFlashTimer);
    render();
    const flash = document.createElement("div");
    flash.className = "android-screenshot-flash";
    root.appendChild(flash);
    vibrate(8);
    screenshotFlashTimer = window.setTimeout(() => {
      flash.remove();
      toast("Screenshot simulator disimpan");
    }, 320);
  }

  function handleBootloaderSelection() {
    const item = BOOTLOADER_OPTIONS[Math.max(0, Math.min(BOOTLOADER_OPTIONS.length - 1, Number(state.bootloaderSelection) || 0))];
    if (!item) return;
    if (item.id === "start") { rebootPhone("system"); return; }
    if (item.id === "restart") { rebootPhone("bootloader"); return; }
    if (item.id === "recovery") { rebootPhone("recovery"); return; }
    if (item.id === "poweroff") { shutdownPhone(); }
  }

  openBtn.addEventListener("click", () => {
    if (!dialog.open) dialog.showModal();
    render();
  });
  closeBtn?.addEventListener("click", () => dialog.open && dialog.close());
  dialog.addEventListener("cancel", e => { e.preventDefault(); dialog.close(); });

  statusBar?.addEventListener("click", e => {
    if (state.poweredOff || ["boot", "recovery", "bootloader"].includes(state.view)) return;
    const rect = statusBar.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    if (state.separateQs) {
      state.shadePanel = localX < rect.width / 2 ? "quick" : "notifications";
    } else {
      state.shadePanel = "quick";
    }
    state.shade = true;
    save();
    render();
  });
  /* Mobile-safe Android system gesture handling.
     The navigation pill is itself a <button>, so it must be allowed to start
     the launcher gesture. Pointer capture keeps the swipe alive on mobile
     browsers even when the finger leaves the pill element. */
  let systemGestureStart = null;
  let systemGestureConsumedAt = 0;

  gesture?.addEventListener("click", event => {
    if (performance.now() - systemGestureConsumedAt < 450) {
      event.preventDefault();
      return;
    }
    if (state.navigationMode !== "gesture") return;
    state.locked ? unlockPhone() : navigate("home");
  });

  /*
   * A completed Home swipe can be followed by a browser-generated click on
   * the element where the gesture started. Consume only that post-swipe click.
   * Ordinary app/widget taps never set systemGestureConsumedAt and therefore
   * continue to the normal data-open-app/data-nav handlers.
   */
  phone.addEventListener("click", event => {
    if (performance.now() - systemGestureConsumedAt >= 360) return;
    const target = event.target instanceof Element
      ? event.target.closest(
          '[data-open-app],[data-nav],[data-home-widget-index],.record-home-widget-card,.record-home-search'
        )
      : null;
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  phone.addEventListener("pointerdown", e => {
    if (state.navigationMode !== "gesture" || state.locked) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const interactive = e.target instanceof Element
      ? e.target.closest("button,input,label")
      : null;
    const onGesturePill = e.target instanceof Element
      ? !!e.target.closest("#androidGesturePill")
      : false;
    const launcherSwipeEligible = state.view === "home" && !homeEditMode && !state.longPressMenu;
    if (interactive && !onGesturePill && !launcherSwipeEligible) return;

    const rect = phone.getBoundingClientRect();
    systemGestureStart = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      time: performance.now(),
      pointerId: e.pointerId,
      view: state.view,
      onGesturePill
    };

    /*
     * FIX b10e8cf:
     * Never capture a normal Home tap at #pixelScreen.
     *
     * Capturing every launcher pointer retargets the pointer/click sequence
     * away from [data-open-app] / widget buttons in Chromium-family browsers.
     * The global listener still receives bubbling pointerup events, so Home
     * swipe-up remains detectable without stealing normal taps.
     */
    if (onGesturePill) {
      try { phone.setPointerCapture(e.pointerId); } catch {}
    }
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

    /* Navigation-pill tap fallback. Pointer capture keeps mobile swipe gestures
       reliable, but some browsers retarget the generated click to #pixelScreen.
       Handle a short stationary tap here so the pill always returns Home. */
    if (
      systemGestureStart.onGesturePill &&
      Math.abs(dx) < 18 &&
      Math.abs(dy) < 18 &&
      elapsed < 520
    ) {
      systemGestureConsumedAt = performance.now();
      vibrate(4);
      navigate("home");

      try {
        if (phone.hasPointerCapture?.(e.pointerId)) phone.releasePointerCapture(e.pointerId);
      } catch {}
      systemGestureStart = null;
      return;
    }

    const verticalSwipe = Math.abs(dy) > Math.abs(dx) * 1.18;
    const homeAllAppsSwipe =
      systemGestureStart.view === "home" &&
      verticalSwipe &&
      dy < -46 &&
      elapsed < 980;

    if (homeAllAppsSwipe) {
      systemGestureConsumedAt = performance.now();
      clearTimeout(longPressTimer);
      vibrate(5);
      navigate("apps");
      try {
        if (phone.hasPointerCapture?.(e.pointerId)) phone.releasePointerCapture(e.pointerId);
      } catch {}
      systemGestureStart = null;
      return;
    }

    if (fromBottom && dy < -58) {
      const fromCorner = systemGestureStart.x < 55 || systemGestureStart.x > systemGestureStart.width - 55;
      systemGestureConsumedAt = performance.now();

      if (fromCorner && state.assistantGesture) {
        toast(t("digitalAssistant"));
      } else if (systemGestureStart.view === "home" && elapsed <= 480) {
        /* Pixel Launcher: a quick upward swipe from Home opens All apps. */
        vibrate(5);
        navigate("apps");
      } else if (elapsed > 360) {
        navigate("recents");
      } else {
        navigate("home");
      }

      try {
        if (phone.hasPointerCapture?.(e.pointerId)) phone.releasePointerCapture(e.pointerId);
      } catch {}
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

    try {
      if (phone.hasPointerCapture?.(e.pointerId)) phone.releasePointerCapture(e.pointerId);
    } catch {}
    systemGestureStart = null;
  });

  phone.addEventListener("pointercancel", e => {
    try {
      if (phone.hasPointerCapture?.(e.pointerId)) phone.releasePointerCapture(e.pointerId);
    } catch {}
    systemGestureStart = null;
  });

  let powerPressTimer = 0;
  let powerPressLong = false;
  let powerPressPointerId = null;

  function cancelPowerPress() {
    clearTimeout(powerPressTimer);
    powerPressTimer = 0;
    powerPressPointerId = null;
  }

  [power,volume].filter(Boolean).forEach(button=>{
    button.addEventListener("pointerdown",()=>{
      if(!state.developerOptionsEnabled||!state.devShowButtonPresses)return;
      phone.dataset.developerPressedKey=button===power?"POWER":"VOLUME";
      phone.classList.add("developer-show-hardware-key");
    });
    ["pointerup","pointercancel","pointerleave"].forEach(type=>button.addEventListener(type,()=>{
      phone.classList.remove("developer-show-hardware-key");delete phone.dataset.developerPressedKey;
    }));
  });

  power?.addEventListener("pointerdown", event => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    cancelPowerPress();
    powerPressLong = false;
    powerPressPointerId = event.pointerId;
    try { power.setPointerCapture(event.pointerId); } catch {}

    const holdMs = state.view === "bootloader"
      ? 10000
      : (state.poweredOff ? 3000 : 5000);

    powerPressTimer = window.setTimeout(() => {
      powerPressLong = true;
      if (state.view === "bootloader") {
        vibrate([20,35,20]);
        rebootPhone("system");
      } else if (state.poweredOff) {
        vibrate(18);
        rebootPhone("system");
      } else {
        showPowerMenu();
      }
    }, holdMs);
  });

  power?.addEventListener("pointerup", event => {
    if (powerPressPointerId != null && event.pointerId !== powerPressPointerId) return;
    clearTimeout(powerPressTimer);
    powerPressTimer = 0;
    try { power.releasePointerCapture(event.pointerId); } catch {}
    powerPressPointerId = null;
    if (!powerPressLong) togglePower();
    powerPressLong = false;
  });

  power?.addEventListener("pointercancel", () => {
    cancelPowerPress();
    powerPressLong = false;
  });
  power?.addEventListener("contextmenu", event => event.preventDefault());
  power?.addEventListener("click", event => event.preventDefault());

  volume?.addEventListener("click", () => {
    if (state.view === "bootloader" && !state.poweredOff) {
      state.bootloaderSelection = ((Number(state.bootloaderSelection) || 0) + 1) % BOOTLOADER_OPTIONS.length;
      save(); vibrate(4); render();
      return;
    }
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
    const usageClock = $("#homeUsageTime", root);
    const wellbeingUsage = $("#wellbeingUsageTime", root);
    if (usageClock) usageClock.textContent = formatUsageDuration();
    if (wellbeingUsage) wellbeingUsage.textContent = formatUsageDuration();
    if (lockClock) lockClock.innerHTML = lockClockMarkup();
    if (lockDate) lockDate.textContent = formatDate();
    if (ambientClock) ambientClock.textContent = formatTime().replace(".", ":");
    if (ambientDate) ambientDate.textContent = formatDate();
    if (appClock) appClock.textContent = formatTime().replace(".", ":");
    updateSpotifyPlayback();
    updateRecorderSim();
  }, 1000);

  completeSpotifyOAuthIfPresent().then(done => {
    applyTheme();
    render();
    if (done && !dialog.open) { try { dialog.showModal(); } catch {} }
  });
})();
