/* ===========================
   PERFORMANCE PROFILE
   =========================== */
const PERFORMANCE_MODE_KEY = "waifuPerformanceMode";
let performanceLite = false;
try {
  performanceLite = localStorage.getItem(PERFORMANCE_MODE_KEY) === "lite";
} catch (_) {
  performanceLite = document.documentElement.classList.contains("performance-lite");
}
document.documentElement.classList.toggle("performance-lite", performanceLite);

const seedPhotos = [
  { id: "seed-1", src: "./assets/waifu-01.jpg", thumb: "./thumbs/waifu-01.webp", title: "Purple Serenity", category: "classic", uploaded: false },
  { id: "seed-2", src: "./assets/waifu-02.jpg", thumb: "./thumbs/waifu-02.webp", title: "Quiet Garden", category: "classic", uploaded: false },
  { id: "seed-3", src: "./assets/waifu-03.jpg", thumb: "./thumbs/waifu-03.webp", title: "Soft Smile", category: "portrait", uploaded: false },
  { id: "seed-4", src: "./assets/waifu-04.jpg", thumb: "./thumbs/waifu-04.webp", title: "Lavender Casual", category: "casual", uploaded: false },
  { id: "seed-5", src: "./assets/waifu-05.jpg", thumb: "./thumbs/waifu-05.webp", title: "Elegant Violet", category: "portrait", uploaded: false },
  { id: "seed-6", src: "./assets/waifu-06.jpg", thumb: "./thumbs/waifu-06.webp", title: "Wisteria Day", category: "casual", uploaded: false },
  { id: "seed-7", src: "./assets/waifu-07.jpg", thumb: "./thumbs/waifu-07.webp", title: "Sakura Bride", category: "wedding", uploaded: false },
  { id: "seed-8", src: "./assets/waifu-08.jpg", thumb: "./thumbs/waifu-08.webp", title: "Violet Bride", category: "wedding", uploaded: false },
  { id: "seed-9", src: "./assets/waifu-09.jpg", thumb: "./thumbs/waifu-09.webp", title: "Moonlight Bride", category: "wedding", uploaded: false },
  { id: "seed-10", src: "./assets/waifu-10.jpg", thumb: "./thumbs/waifu-10.webp", title: "Sunny Street", category: "casual", uploaded: false },
  { id: "seed-11", src: "./assets/waifu-11.jpg", thumb: "./thumbs/waifu-11.webp", title: "Frostlight Portrait", category: "portrait", uploaded: false },
  { id: "seed-12", src: "./assets/waifu-12.jpg", thumb: "./thumbs/waifu-12.webp", title: "Gentle Afternoon", category: "casual", uploaded: false },
  { id: "seed-13", src: "./assets/waifu-13.jpg", thumb: "./thumbs/waifu-13.webp", title: "Moonlit Blossom", category: "classic", uploaded: false },
  { id: "seed-14", src: "./assets/waifu-14.jpg", thumb: "./thumbs/waifu-14.webp", title: "Lavender Stage", category: "classic", uploaded: false },
  { id: "seed-15", src: "./assets/waifu-15.jpg", thumb: "./thumbs/waifu-15.webp", title: "Twilight Reflection", category: "classic", uploaded: false },
  { id: "seed-16", src: "./assets/waifu-16.jpg", thumb: "./thumbs/waifu-16.webp", title: "Feather Moon", category: "portrait", uploaded: false },
  { id: "seed-17", src: "./assets/waifu-17.jpg", thumb: "./thumbs/waifu-17.webp", title: "Starlit Water", category: "classic", uploaded: false },
  { id: "seed-18", src: "./assets/waifu-18.jpg", thumb: "./thumbs/waifu-18.webp", title: "White Dress Portrait", category: "portrait", uploaded: false },
  { id: "seed-19", src: "./assets/waifu-19.jpg", thumb: "./thumbs/waifu-19.webp", title: "Featherfall Garden", category: "classic", uploaded: false },
  { id: "seed-20", src: "./assets/waifu-20.jpg", thumb: "./thumbs/waifu-20.webp", title: "Blue Moon Garden", category: "wedding", uploaded: false },
  { id: "seed-21", src: "./assets/waifu-21.jpg", thumb: "./thumbs/waifu-21.webp", title: "Azure Flower Night", category: "wedding", uploaded: false },
  { id: "seed-22", src: "./assets/waifu-22.jpg", thumb: "./thumbs/waifu-22.webp", title: "Violet Close-up", category: "portrait", uploaded: false },
  { id: "seed-23", src: "./assets/waifu-23.jpg", thumb: "./thumbs/waifu-23.webp", title: "Winter Crown", category: "portrait", uploaded: false },
  { id: "seed-24", src: "./assets/waifu-24.jpg", thumb: "./thumbs/waifu-24.webp", title: "Crystal Reverie", category: "portrait", uploaded: false },
  { id: "seed-25", src: "./assets/waifu-25.jpg", thumb: "./thumbs/waifu-25.webp", title: "Ice Throne", category: "classic", uploaded: false },
  { id: "seed-26", src: "./assets/waifu-26.jpg", thumb: "./thumbs/waifu-26.webp", title: "Frost Scepter", category: "classic", uploaded: false },
  { id: "seed-27", src: "./assets/waifu-27.jpg", thumb: "./thumbs/waifu-27.webp", title: "Blue Palace", category: "classic", uploaded: false },
  { id: "seed-28", src: "./assets/waifu-28.jpg", thumb: "./thumbs/waifu-28.webp", title: "Snow Festival", category: "casual", uploaded: false },
  { id: "seed-29", src: "./assets/waifu-29.jpg", thumb: "./thumbs/waifu-29.webp", title: "Cozy Winter", category: "casual", uploaded: false },
  { id: "seed-30", src: "./assets/waifu-30.jpg", thumb: "./thumbs/waifu-30.webp", title: "Snow Clinic", category: "casual", uploaded: false },
  { id: "seed-31", src: "./assets/waifu-31.jpg", thumb: "./thumbs/waifu-31.webp", title: "Blooming Bride", category: "wedding", uploaded: false },
  { id: "seed-32", src: "./assets/waifu-32.jpg", thumb: "./thumbs/waifu-32.webp", title: "Soft Bridal Moment", category: "wedding", uploaded: false },
  { id: "seed-33", src: "./assets/waifu-33.jpg", thumb: "./thumbs/waifu-33.webp", title: "Casual Violet", category: "casual", uploaded: false },
  { id: "seed-34", src: "./assets/waifu-34.jpg", thumb: "./thumbs/waifu-34.webp", title: "Purple Rose Garden", category: "classic", uploaded: false },
  { id: "seed-35", src: "./assets/waifu-35.jpg", thumb: "./thumbs/waifu-35.webp", title: "Neko Violet Wink", category: "portrait", uploaded: false },
  { id: "seed-36", src: "./assets/waifu-36.jpg", thumb: "./thumbs/waifu-36.webp", title: "Gentle Violet Smile", category: "portrait", uploaded: false },
  { id: "seed-37", src: "./assets/waifu-37.jpg", thumb: "./thumbs/waifu-37.webp", title: "Midnight Traveler", category: "casual", uploaded: false },
  { id: "seed-38", src: "./assets/waifu-38.jpg", thumb: "./thumbs/waifu-38.webp", title: "Violet Morning", category: "portrait", uploaded: false },
  { id: "seed-39", src: "./assets/waifu-39.jpg", thumb: "./thumbs/waifu-39.webp", title: "Sleepy Violet", category: "casual", uploaded: false },
  { id: "seed-40", src: "./assets/waifu-40.jpg", thumb: "./thumbs/waifu-40.webp", title: "Crystal Princess", category: "portrait", uploaded: false },
  { id: "seed-41", src: "./assets/waifu-41.jpg", thumb: "./thumbs/waifu-41.webp", title: "Azure Wedding", category: "wedding", uploaded: false },
  { id: "seed-42", src: "./assets/waifu-42.jpg", thumb: "./thumbs/waifu-42.webp", title: "Starlit Crystal", category: "classic", uploaded: false },
  { id: "seed-43", src: "./assets/waifu-43.jpg", thumb: "./thumbs/waifu-43.webp", title: "Icebound Elegance", category: "portrait", uploaded: false }
];

const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const filterChips = document.getElementById("filterChips");
const emptyState = document.getElementById("emptyState");
const resultInfo = document.getElementById("resultInfo");
const photoCount = document.getElementById("photoCount");
const photoInput = document.getElementById("photoInput");
const shuffleBtn = document.getElementById("shuffleBtn");
const themeBurstBtn = document.getElementById("themeBurstBtn");
const toast = document.getElementById("toast");
const languageToggle = document.getElementById("languageToggle");
const performanceToggle = document.getElementById("performanceToggle");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxMeta = document.getElementById("lightboxMeta");
const closeLightbox = document.getElementById("closeLightbox");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const deleteUploadedBtn = document.getElementById("deleteUploadedBtn");

let uploadedPhotos = [];
let activeFilter = "all";
let currentList = [];
let currentIndex = 0;



/* ===========================
   LANGUAGE / I18N
   =========================== */

const translations = {
  id: {
    metaDescription: "Waifu Gallery, galeri anime colorful dan responsif untuk GitHub Pages.",
    languageToggleToEnglish: "Ganti bahasa ke Inggris",
    languageToggleToIndonesian: "Switch language to Indonesian",
    languageChanged: "Bahasa diubah ke Indonesia.",
    themeButtonTitle: "Buka pengaturan tema",
    liteMode: "Mode Ringan",
    liteModeEnable: "Aktifkan Mode Ringan",
    liteModeDisable: "Nonaktifkan Mode Ringan",
    liteModeEnabled: "Mode Ringan aktif. Efek visual dikurangi agar lebih ringan.",
    liteModeDisabled: "Mode Ringan nonaktif. Tampilan penuh dipulihkan.",
    addPhoto: "Tambah Foto",
    heroKicker: "KOLEKSI WAIFU PRIBADI",
    heroTitle: "Galeri waifu yang",
    heroAccent: "penuh warna.",
    heroDescription: "Simpan koleksi favoritmu dalam satu galeri yang bersih, colorful, responsif, dan nyaman dibuka dari ponsel maupun laptop.",
    viewGallery: "Lihat Galeri",
    shufflePhotos: "Acak Foto",
    totalPhotos: "Total Foto",
    responsive: "Responsif",
    pagesReady: "Siap di Pages",
    myCollection: "KOLEKSI SAYA",
    searchPlaceholder: "Cari foto...",
    searchAria: "Cari foto",
    filterAll: "Semua",
    filterUploaded: "Upload Saya",
    emptyTitle: "Belum ada foto yang cocok.",
    emptyDescription: "Coba kata pencarian atau kategori lain.",
    footerDescription: "Galeri waifu penuh warna untuk koleksi pribadi.",
    imageCredit: "Kredit gambar:",
    displaySettings: "Setelan tampilan",
    displaySettingsDescription: "Atur gaya warna seperti Material U atau gunakan tampilan default website.",
    closeSettings: "Tutup pengaturan",
    chooseDisplayStyle: "Pilih gaya tampilan",
    themeElementsFollow: "Ikon, teks, dan elemen mengikuti warna tema",
    themeChooseColor: "Pilih warna dari gambar atau gunakan warna lain.",
    wallpaperColor: "Warna wallpaper",
    otherColor: "Warna lain",
    extractFromImage: "Ambil warna dari gambar",
    extractFromImageHelp: "Pilih gambar dari perangkat. Browser tidak membaca wallpaper sistem secara langsung.",
    customColor: "Warna khusus",
    darkTheme: "Tema gelap",
    darkThemeDescription: "Gunakan palet gelap dengan warna aksen yang sama.",
    settingsSaved: "Pengaturan tersimpan otomatis di browser ini.",
    closePhoto: "Tutup foto",
    previousPhoto: "Foto sebelumnya",
    nextPhoto: "Foto berikutnya",
    deleteUpload: "Hapus upload",
    colorPurple: "Ungu",
    colorPink: "Pink",
    colorBlue: "Biru",
    colorTeal: "Toska",
    colorGreen: "Hijau",
    colorYellow: "Kuning",
    colorOrange: "Oranye",
    colorRed: "Merah",
    categoryUploaded: "Upload Saya",
    openPhoto: "Buka {title}",
    uploadBadge: "Upload Saya",
    showingAll: "Menampilkan semua {count} foto",
    showingFiltered: "Menampilkan {count} dari {total} foto",
    localUploadMeta: "Upload lokal • tersimpan di browser",
    storageUnavailable: "Penyimpanan lokal tidak tersedia di browser ini.",
    shuffled: "Urutan galeri sudah diacak.",
    storageFull: "Penyimpanan browser penuh atau upload gagal.",
    photosAdded: "{count} foto berhasil ditambahkan.",
    uploadDeleted: "Foto upload dihapus.",
    deleteFailed: "Foto gagal dihapus.",
    materialActive: "Gaya Material U aktif.",
    defaultActive: "Gaya default website aktif.",
    wallpaperApplied: "Warna wallpaper diterapkan.",
    colorApplied: "Warna tema diterapkan.",
    darkActive: "Mode gelap aktif.",
    lightActive: "Mode terang aktif.",
    paletteExtracted: "Palet berhasil diambil dari gambar.",
    paletteFailed: "Warna dari gambar gagal dibaca.",
    paletteNumber: "Palet {number}"
  },
  en: {
    metaDescription: "Waifu Gallery, a colorful and responsive anime gallery for GitHub Pages.",
    languageToggleToEnglish: "Switch language to English",
    languageToggleToIndonesian: "Ganti bahasa ke Indonesia",
    languageChanged: "Language changed to English.",
    themeButtonTitle: "Open theme settings",
    liteMode: "Lite Mode",
    liteModeEnable: "Enable Lite Mode",
    liteModeDisable: "Disable Lite Mode",
    liteModeEnabled: "Lite Mode is on. Heavy visual effects are reduced.",
    liteModeDisabled: "Lite Mode is off. Full visuals are restored.",
    addPhoto: "Add Photo",
    heroKicker: "PERSONAL WAIFU COLLECTION",
    heroTitle: "A waifu gallery",
    heroAccent: "full of color.",
    heroDescription: "Keep your favorite collection in one clean, colorful, responsive gallery that feels great on both phones and laptops.",
    viewGallery: "View Gallery",
    shufflePhotos: "Shuffle Photos",
    totalPhotos: "Total Photos",
    responsive: "Responsive",
    pagesReady: "Pages Ready",
    myCollection: "MY COLLECTION",
    searchPlaceholder: "Search photos...",
    searchAria: "Search photos",
    filterAll: "All",
    filterUploaded: "My Uploads",
    emptyTitle: "No matching photos found.",
    emptyDescription: "Try another search term or category.",
    footerDescription: "A colorful waifu gallery for your personal collection.",
    imageCredit: "Image credit:",
    displaySettings: "Display settings",
    displaySettingsDescription: "Use Material U color styling or switch back to the website's default look.",
    closeSettings: "Close settings",
    chooseDisplayStyle: "Choose display style",
    themeElementsFollow: "Icons, text, and interface elements follow the theme colors",
    themeChooseColor: "Choose colors from an image or use a different color.",
    wallpaperColor: "Wallpaper colors",
    otherColor: "Other colors",
    extractFromImage: "Get colors from an image",
    extractFromImageHelp: "Choose an image from your device. Browsers cannot directly read your system wallpaper.",
    customColor: "Custom color",
    darkTheme: "Dark theme",
    darkThemeDescription: "Use a dark palette while keeping the same accent colors.",
    settingsSaved: "Settings are saved automatically in this browser.",
    closePhoto: "Close photo",
    previousPhoto: "Previous photo",
    nextPhoto: "Next photo",
    deleteUpload: "Delete upload",
    colorPurple: "Purple",
    colorPink: "Pink",
    colorBlue: "Blue",
    colorTeal: "Teal",
    colorGreen: "Green",
    colorYellow: "Yellow",
    colorOrange: "Orange",
    colorRed: "Red",
    categoryUploaded: "My Uploads",
    openPhoto: "Open {title}",
    uploadBadge: "My Upload",
    showingAll: "Showing all {count} photos",
    showingFiltered: "Showing {count} of {total} photos",
    localUploadMeta: "Local upload • saved in this browser",
    storageUnavailable: "Local storage is not available in this browser.",
    shuffled: "Gallery order has been shuffled.",
    storageFull: "Browser storage is full or the upload failed.",
    photosAdded: "{count} photo(s) added successfully.",
    uploadDeleted: "Uploaded photo deleted.",
    deleteFailed: "Could not delete the photo.",
    materialActive: "Material U style is active.",
    defaultActive: "The website's default style is active.",
    wallpaperApplied: "Wallpaper colors applied.",
    colorApplied: "Theme color applied.",
    darkActive: "Dark mode is on.",
    lightActive: "Light mode is on.",
    paletteExtracted: "Palette extracted from the image.",
    paletteFailed: "Could not extract colors from the image.",
    paletteNumber: "Palette {number}"
  }
};

let currentLanguage = localStorage.getItem("waifuLanguage") === "en" ? "en" : "id";

function t(key, variables = {}) {
  let text = translations[currentLanguage]?.[key] ?? translations.id[key] ?? key;

  Object.entries(variables).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });

  return text;
}

function applyLanguage(language, options = {}) {
  const previousLanguage = currentLanguage;
  currentLanguage = language === "en" ? "en" : "id";
  localStorage.setItem("waifuLanguage", currentLanguage);

  document.documentElement.lang = currentLanguage;
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("metaDescription"));

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });

  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.setAttribute("title", t(element.dataset.i18nTitle));
  });

  languageToggle.classList.toggle("is-en", currentLanguage === "en");
  const nextLanguageKey = currentLanguage === "en"
    ? "languageToggleToIndonesian"
    : "languageToggleToEnglish";
  languageToggle.dataset.i18nAria = nextLanguageKey;
  languageToggle.dataset.i18nTitle = nextLanguageKey;
  languageToggle.setAttribute("aria-label", t(nextLanguageKey));
  languageToggle.setAttribute("title", t(nextLanguageKey));
  languageToggle.setAttribute("aria-pressed", String(currentLanguage === "en"));
  syncPerformanceToggle();

  if (typeof renderGallery === "function") renderGallery();
  if (typeof updateLightbox === "function" && lightbox?.open) updateLightbox();
  if (typeof renderPresetPalettes === "function" && wallpaperPaletteRow) renderPresetPalettes();

  if (options.announce && previousLanguage !== currentLanguage) {
    showToast(t("languageChanged"));
  }
}

function syncPerformanceToggle() {
  if (!performanceToggle) return;
  performanceToggle.classList.toggle("is-active", performanceLite);
  performanceToggle.setAttribute("aria-pressed", String(performanceLite));
  const key = performanceLite ? "liteModeDisable" : "liteModeEnable";
  performanceToggle.setAttribute("title", t(key));
  performanceToggle.setAttribute("aria-label", t(key));
}

function applyPerformanceMode(enabled, options = {}) {
  performanceLite = Boolean(enabled);
  document.documentElement.classList.toggle("performance-lite", performanceLite);
  try {
    localStorage.setItem(PERFORMANCE_MODE_KEY, performanceLite ? "lite" : "full");
  } catch (_) {}
  syncPerformanceToggle();

  // Re-render the gallery so the selected image source/batch size is applied immediately.
  if (typeof renderGallery === "function") renderGallery();
  if (options.announce) showToast(t(performanceLite ? "liteModeEnabled" : "liteModeDisabled"));
}

performanceToggle?.addEventListener("click", () => {
  applyPerformanceMode(!performanceLite, { announce: true });
});

languageToggle.addEventListener("click", () => {
  applyLanguage(currentLanguage === "id" ? "en" : "id", { announce: true });
});

syncPerformanceToggle();


const DB_NAME = "waifuGalleryPagesDB";
const STORE_NAME = "photos";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB tidak tersedia"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadUploads() {
  try {
    const db = await openDB();

    uploadedPhotos = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    db.close();
  } catch {
    uploadedPhotos = [];
    showToast(t("storageUnavailable"));
  }
}

async function saveUpload(photo) {
  const db = await openDB();

  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(photo);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  db.close();
}

async function deleteUpload(id) {
  const db = await openDB();

  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  db.close();
}

function getAllPhotos() {
  return [...seedPhotos, ...uploadedPhotos];
}

function prettyCategory(category) {
  const labels = {
    portrait: "Portrait",
    casual: "Casual",
    wedding: "Wedding",
    classic: "Classic",
    uploaded: t("categoryUploaded")
  };

  return labels[category] || "Gallery";
}

function getFilteredPhotos() {
  const term = searchInput.value.trim().toLowerCase();

  return getAllPhotos().filter((photo) => {
    const categoryMatch =
      activeFilter === "all" ||
      (activeFilter === "uploaded" && photo.uploaded) ||
      photo.category === activeFilter;

    const searchMatch =
      !term ||
      photo.title.toLowerCase().includes(term) ||
      prettyCategory(photo.category).toLowerCase().includes(term);

    return categoryMatch && searchMatch;
  });
}

function galleryInitialBatchSize() { return performanceLite ? 6 : 8; }
function galleryBatchSize() { return performanceLite ? 6 : 8; }
let galleryRenderedCount = 0;
let galleryObserver = null;

/*
 * The gallery already lazy-renders items in small DOM batches. Native
 * loading="lazy" is intentionally NOT used here because Chromium can
 * postpone zero-height images inside a CSS multi-column container. That
 * creates a deadlock where the masonry has no height, the images are judged
 * off-screen, and the gallery looks completely empty.
 */
function createGalleryItem(photo, itemIndex = 0) {
  const button = document.createElement("button");
  button.className = "gallery-item";
  button.type = "button";
  button.dataset.id = photo.id;
  button.setAttribute("aria-label", t("openPhoto", { title: photo.title }));

  const img = document.createElement("img");
  const preferredSource = performanceLite && photo.thumb ? photo.thumb : photo.src;
  img.src = preferredSource;
  img.alt = photo.title;
  // Items are inserted only when their batch is needed, so eager loading here
  // is safe and prevents Chromium masonry/lazy-loading collapse.
  img.loading = "eager";
  img.decoding = "async";
  img.fetchPriority = itemIndex < 2 ? "high" : "auto";
  img.addEventListener("error", () => {
    // If an optimized thumbnail is unavailable on GitHub Pages, fall back to the original image.
    if (img.dataset.fallbackApplied === "1" || !photo.src || img.src.endsWith(photo.src.replace(/^\.\//, ""))) return;
    img.dataset.fallbackApplied = "1";
    img.src = photo.src;
  }, { once: true });

  const overlay = document.createElement("span");
  overlay.className = "gallery-overlay";

  // Build overlay text with DOM nodes instead of an undefined escapeHTML helper.
  // textContent safely escapes text and prevents gallery rendering from throwing.
  const overlayTitle = document.createElement("strong");
  overlayTitle.textContent = photo.title;
  const overlayCategory = document.createElement("span");
  overlayCategory.textContent = prettyCategory(photo.category);
  overlay.append(overlayTitle, overlayCategory);

  button.append(img, overlay);
  return button;
}

function appendGalleryBatch() {
  const end = Math.min(currentList.length, galleryRenderedCount + (galleryRenderedCount ? galleryBatchSize() : galleryInitialBatchSize()));
  const fragment = document.createDocumentFragment();
  for (let i = galleryRenderedCount; i < end; i += 1) {
    fragment.appendChild(createGalleryItem(currentList[i], i));
  }
  gallery.appendChild(fragment);
  galleryRenderedCount = end;

  const oldSentinel = document.getElementById("galleryLoadSentinel");
  oldSentinel?.remove();
  galleryObserver?.disconnect();

  if (galleryRenderedCount < currentList.length) {
    const sentinel = document.createElement("div");
    sentinel.id = "galleryLoadSentinel";
    sentinel.className = "gallery-load-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    gallery.after(sentinel);

    if ("IntersectionObserver" in window) {
      galleryObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) appendGalleryBatch();
      }, { rootMargin: performanceLite ? "260px" : "600px" });
      galleryObserver.observe(sentinel);
      // A small safety batch prevents an empty-looking gallery if an observer is delayed.
      if (!performanceLite) window.setTimeout(() => {
        if (galleryRenderedCount < currentList.length && sentinel.isConnected) appendGalleryBatch();
      }, 500);
    } else {
      // Old browsers: load the rest without blocking first paint.
      setTimeout(() => {
        while (galleryRenderedCount < currentList.length) appendGalleryBatch();
      }, 60);
    }
  }
}

function renderGallery() {
  currentList = getFilteredPhotos();
  galleryObserver?.disconnect();
  galleryRenderedCount = 0;
  gallery.innerHTML = "";
  document.getElementById("galleryLoadSentinel")?.remove();

  photoCount.textContent = getAllPhotos().length;
  emptyState.hidden = currentList.length !== 0;
  gallery.hidden = currentList.length === 0;

  if (activeFilter === "all" && !searchInput.value.trim()) {
    resultInfo.textContent = t("showingAll", { count: currentList.length });
  } else {
    resultInfo.textContent = t("showingFiltered", {
      count: currentList.length,
      total: getAllPhotos().length
    });
  }

  if (currentList.length) appendGalleryBatch();
}

function updateLightbox() {
  const photo = currentList[currentIndex];
  if (!photo) return;

  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.title;
  lightboxTitle.textContent = photo.title;
  lightboxMeta.textContent = photo.uploaded
    ? t("localUploadMeta")
    : prettyCategory(photo.category);

  deleteUploadedBtn.hidden = !photo.uploaded;

  const hideNav = currentList.length <= 1;
  prevBtn.hidden = hideNav;
  nextBtn.hidden = hideNav;
}

function moveLightbox(direction) {
  if (!currentList.length) return;

  currentIndex =
    (currentIndex + direction + currentList.length) % currentList.length;

  updateLightbox();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

function shuffleGallery() {
  const list = getFilteredPhotos();
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  currentList = list;
  galleryObserver?.disconnect();
  galleryRenderedCount = 0;
  gallery.innerHTML = "";
  document.getElementById("galleryLoadSentinel")?.remove();
  if (currentList.length) appendGalleryBatch();
  showToast(t("shuffled"));
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

filterChips.addEventListener("click", (event) => {
  const chip = event.target.closest(".chip");
  if (!chip) return;

  filterChips.querySelectorAll(".chip").forEach((item) => {
    item.classList.remove("active");
  });

  chip.classList.add("active");
  activeFilter = chip.dataset.filter;
  renderGallery();
});

let searchRenderTimer = 0;
searchInput.addEventListener("input", () => {
  clearTimeout(searchRenderTimer);
  searchRenderTimer = window.setTimeout(renderGallery, performanceLite ? 180 : 100);
});

shuffleBtn.addEventListener("click", shuffleGallery);


photoInput.addEventListener("change", async (event) => {
  const files = [...event.target.files].filter((file) =>
    file.type.startsWith("image/")
  );

  if (!files.length) return;

  let saved = 0;

  for (const file of files) {
    const uniqueId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    const photo = {
      id: `upload-${Date.now()}-${uniqueId}`,
      src: await fileToDataURL(file),
      title: file.name.replace(/\.[^.]+$/, "") || "My Waifu",
      category: "uploaded",
      uploaded: true,
      createdAt: Date.now()
    };

    try {
      await saveUpload(photo);
      uploadedPhotos.push(photo);
      saved += 1;
    } catch {
      showToast(t("storageFull"));
      break;
    }
  }

  event.target.value = "";
  renderGallery();

  if (saved) {
    showToast(t("photosAdded", { count: saved }));
  }
});

if (deleteUploadedBtn) {
  deleteUploadedBtn.addEventListener("click", async () => {
    const photo = currentList[currentIndex];

    if (!photo?.uploaded) return;

    try {
      await deleteUpload(photo.id);
      uploadedPhotos = uploadedPhotos.filter((item) => item.id !== photo.id);

      lightbox.close();
      renderGallery();
      showToast(t("uploadDeleted"));
    } catch {
      showToast(t("deleteFailed"));
    }
  });
}

/*
 * Lightbox controls use event delegation.
 * This keeps Close / Previous / Next working even if optional
 * lightbox elements change or an upload-only control is missing.
 */
function handleLightboxControl(event) {
  const control = event.target.closest("#closeLightbox, #prevBtn, #nextBtn");

  if (!control || !lightbox.contains(control)) return;

  event.preventDefault();
  event.stopPropagation();

  if (control.id === "closeLightbox") {
    if (lightbox.open) lightbox.close();
    return;
  }

  if (control.id === "prevBtn") {
    moveLightbox(-1);
    return;
  }

  if (control.id === "nextBtn") {
    moveLightbox(1);
  }
}

lightbox.addEventListener("click", handleLightboxControl, true);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

lightbox.addEventListener("cancel", (event) => {
  event.preventDefault();
  lightbox.close();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;

  if (event.key === "Escape") {
    event.preventDefault();
    lightbox.close();
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveLightbox(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveLightbox(1);
  }
});

(function init() {
  renderGallery();
  const loadLocalUploads = async () => {
    await loadUploads();
    if (uploadedPhotos.length) renderGallery();
  };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadLocalUploads, { timeout: 1200 });
  } else {
    setTimeout(loadLocalUploads, 120);
  }
})();


/* ===========================
   COLOR BURST / MATERIAL U
   =========================== */

const themeDialog = document.getElementById("themeDialog");
const closeThemeDialog = document.getElementById("closeThemeDialog");
const darkModeToggle = document.getElementById("darkModeToggle");
const wallpaperInput = document.getElementById("wallpaperInput");
const wallpaperPaletteRow = document.getElementById("wallpaperPaletteRow");
const customColor = document.getElementById("customColor");

const styleOptions = [...document.querySelectorAll(".style-option")];
const paletteModes = [...document.querySelectorAll(".palette-mode")];
const palettePanels = {
  wallpaper: document.getElementById("wallpaperPalettePanel"),
  manual: document.getElementById("manualPalettePanel")
};

const defaultThemeState = {
  style: "material",
  dark: false,
  source: "wallpaper",
  palette: {
    primary: "#7c3aed",
    secondary: "#ec4899",
    tertiary: "#22d3ee"
  }
};

const presetPalettes = [
  { primary: "#9f4f5d", secondary: "#f7b2ba", tertiary: "#c58bb8" },
  { primary: "#111111", secondary: "#bcbcbc", tertiary: "#6f6f6f" },
  { primary: "#7d6969", secondary: "#e7d6d2", tertiary: "#c78fad" },
  { primary: "#cc004b", secondary: "#ffb3cb", tertiary: "#a77df2" },
  { primary: "#b53651", secondary: "#8bd5df", tertiary: "#00b8c4" },
  { primary: "#7350a7", secondary: "#d69ac2", tertiary: "#8c7ae6" },
  { primary: "#5a5d9d", secondary: "#b7bdf8", tertiary: "#92d5d6" },
  { primary: "#6f7f4b", secondary: "#c4d7aa", tertiary: "#9b8dbd" }
];

function getThemeState() {
  try {
    const saved = JSON.parse(localStorage.getItem("waifuThemeState") || "{}");
    const state = {
      ...defaultThemeState,
      ...saved,
      palette: {
        ...defaultThemeState.palette,
        ...(saved.palette || {})
      }
    };

    /*
     * Only two display styles are valid. This prevents stale/old browser
     * state from accidentally keeping Material U behavior active.
     */
    state.style = state.style === "default" ? "default" : "material";

    return state;
  } catch {
    return {
      ...defaultThemeState,
      palette: { ...defaultThemeState.palette }
    };
  }
}

function saveThemeState(state) {
  localStorage.setItem("waifuThemeState", JSON.stringify(state));
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;

  const number = parseInt(full, 16);

  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255
  };
}

function rgbToHex(r, g, b) {
  const toHex = (v) => Math.max(0, Math.min(255, Math.round(v)))
    .toString(16)
    .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mix(hexA, hexB, weight = 0.5) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);

  return rgbToHex(
    a.r * (1 - weight) + b.r * weight,
    a.g * (1 - weight) + b.g * weight,
    a.b * (1 - weight) + b.b * weight
  );
}

function rotateHue(hex, degrees) {
  const { r, g, b } = hexToRgb(hex);
  let rr = r / 255;
  let gg = g / 255;
  let bb = b / 255;

  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > .5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rr: h = (gg - bb) / d + (gg < bb ? 6 : 0); break;
      case gg: h = (bb - rr) / d + 2; break;
      default: h = (rr - gg) / d + 4;
    }

    h /= 6;
  }

  h = (h * 360 + degrees) % 360;
  if (h < 0) h += 360;

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r2;
  let g2;
  let b2;

  if (s === 0) {
    r2 = g2 = b2 = l;
  } else {
    const q = l < .5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const hn = h / 360;

    r2 = hue2rgb(p, q, hn + 1 / 3);
    g2 = hue2rgb(p, q, hn);
    b2 = hue2rgb(p, q, hn - 1 / 3);
  }

  return rgbToHex(r2 * 255, g2 * 255, b2 * 255);
}

function createPaletteFromPrimary(primary) {
  return {
    primary,
    secondary: rotateHue(primary, 48),
    tertiary: rotateHue(primary, 112)
  };
}

function applyPalette(palette, darkMode) {
  const root = document.documentElement;

  const primaryContainer = darkMode
    ? mix(palette.primary, "#111015", .58)
    : mix(palette.primary, "#ffffff", .83);

  const secondaryContainer = darkMode
    ? mix(palette.secondary, "#111015", .6)
    : mix(palette.secondary, "#ffffff", .84);

  const tertiaryContainer = darkMode
    ? mix(palette.tertiary, "#111015", .6)
    : mix(palette.tertiary, "#ffffff", .84);

  const primaryOnContainer = darkMode
    ? mix(palette.primary, "#ffffff", .78)
    : mix(palette.primary, "#000000", .55);

  /*
   * Material U only owns the --mu-* token family.
   * Do not write --purple/--violet/--pink/--cyan directly on :root:
   * those are the website's native Default palette and inline overrides
   * would survive after body.material-u is removed.
   */
  root.style.setProperty("--mu-primary", palette.primary);
  root.style.setProperty("--mu-secondary", palette.secondary);
  root.style.setProperty("--mu-tertiary", palette.tertiary);
  root.style.setProperty("--mu-primary-container", primaryContainer);
  root.style.setProperty("--mu-secondary-container", secondaryContainer);
  root.style.setProperty("--mu-tertiary-container", tertiaryContainer);
  root.style.setProperty("--mu-on-primary-container", primaryOnContainer);
}

const materialInlineProperties = [
  "--mu-primary",
  "--mu-secondary",
  "--mu-tertiary",
  "--mu-primary-container",
  "--mu-secondary-container",
  "--mu-tertiary-container",
  "--mu-on-primary-container",

  /*
   * Compatibility cleanup for users who previously ran the buggy build.
   * Older builds stored Material U colors directly in these website tokens.
   */
  "--purple",
  "--violet",
  "--pink",
  "--cyan"
];

function restoreDefaultWebsitePalette() {
  const root = document.documentElement;

  materialInlineProperties.forEach((property) => {
    root.style.removeProperty(property);
  });
}

function applyThemeState(state) {
  const materialActive = state.style === "material";

  document.body.classList.toggle("material-u", materialActive);
  document.body.classList.toggle("default-style", !materialActive);
  document.body.classList.toggle("dark-mode", !!state.dark);

  if (materialActive) {
    applyPalette(state.palette, !!state.dark);
  } else {
    /*
     * Default means the original website palette from styles.css.
     * The selected Material U palette remains saved in localStorage so
     * switching back to Material U restores the user's chosen color.
     */
    restoreDefaultWebsitePalette();
  }

  darkModeToggle.checked = !!state.dark;

  styleOptions.forEach((button) => {
    button.classList.toggle("active", button.dataset.style === state.style);
  });

  paletteModes.forEach((button) => {
    button.classList.toggle("active", button.dataset.paletteMode === state.source);
  });

  Object.entries(palettePanels).forEach(([key, panel]) => {
    panel.classList.toggle("active", key === state.source);
  });

  customColor.value = state.palette.primary;
}

function renderPresetPalettes() {
  wallpaperPaletteRow.innerHTML = "";

  presetPalettes.forEach((palette, index) => {
    const button = document.createElement("button");
    button.className = "palette-swatch";
    button.type = "button";
    button.dataset.index = index;
    button.setAttribute("aria-label", t("paletteNumber", { number: index + 1 }));

    button.innerHTML = `
      <span>
        <i style="background:${palette.primary}"></i>
        <i style="background:${palette.secondary}"></i>
        <i style="background:${palette.tertiary}"></i>
      </span>
    `;

    button.addEventListener("click", () => {
      const state = getThemeState();
      state.source = "wallpaper";
      state.palette = palette;
      saveThemeState(state);
      applyThemeState(state);

      wallpaperPaletteRow.querySelectorAll(".palette-swatch").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
      showToast(t("wallpaperApplied"));
    });

    wallpaperPaletteRow.appendChild(button);
  });
}

async function extractPaletteFromImage(file) {
  const imageURL = URL.createObjectURL(file);

  try {
    const image = new Image();

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = imageURL;
    });

    const canvas = document.createElement("canvas");
    const size = 72;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, size, size);

    const { data } = ctx.getImageData(0, 0, size, size);
    const buckets = new Map();

    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < 200) continue;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max - min;
      const brightness = (r + g + b) / 3;

      if (brightness < 30 || brightness > 235) continue;
      if (saturation < 18) continue;

      const qr = Math.round(r / 32) * 32;
      const qg = Math.round(g / 32) * 32;
      const qb = Math.round(b / 32) * 32;
      const key = `${qr},${qg},${qb}`;

      buckets.set(key, (buckets.get(key) || 0) + 1);
    }

    const ranked = [...buckets.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([key]) => key.split(",").map(Number));

    if (!ranked.length) {
      return createPaletteFromPrimary("#7c3aed");
    }

    const colors = ranked.map(([r, g, b]) => rgbToHex(r, g, b));

    const primary = colors[0];
    const secondary = colors.find((color) => {
      const a = hexToRgb(primary);
      const b = hexToRgb(color);
      return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b) > 100;
    }) || rotateHue(primary, 50);

    const tertiary = colors.find((color) => {
      const a = hexToRgb(primary);
      const b = hexToRgb(color);
      const c = hexToRgb(secondary);

      const d1 = Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
      const d2 = Math.abs(c.r - b.r) + Math.abs(c.g - b.g) + Math.abs(c.b - b.b);

      return d1 > 90 && d2 > 90;
    }) || rotateHue(primary, 112);

    return { primary, secondary, tertiary };
  } finally {
    URL.revokeObjectURL(imageURL);
  }
}

themeBurstBtn.addEventListener("click", () => {
  applyThemeState(getThemeState());
  themeDialog.showModal();
});

closeThemeDialog.addEventListener("click", () => {
  themeDialog.close();
});

themeDialog.addEventListener("click", (event) => {
  if (event.target === themeDialog) {
    themeDialog.close();
  }
});

styleOptions.forEach((button) => {
  button.addEventListener("click", () => {
    const state = getThemeState();
    state.style = button.dataset.style;
    saveThemeState(state);
    applyThemeState(state);

    showToast(
      state.style === "material"
        ? t("materialActive")
        : t("defaultActive")
    );
  });
});

paletteModes.forEach((button) => {
  button.addEventListener("click", () => {
    const state = getThemeState();
    state.source = button.dataset.paletteMode;
    saveThemeState(state);
    applyThemeState(state);
  });
});

darkModeToggle.addEventListener("change", () => {
  const state = getThemeState();
  state.dark = darkModeToggle.checked;
  saveThemeState(state);
  applyThemeState(state);

  showToast(state.dark ? t("darkActive") : t("lightActive"));
});

document.querySelectorAll(".manual-color").forEach((button) => {
  button.addEventListener("click", () => {
    const color = button.dataset.color;
    const state = getThemeState();

    state.source = "manual";
    state.palette = createPaletteFromPrimary(color);

    saveThemeState(state);
    applyThemeState(state);

    document.querySelectorAll(".manual-color").forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    showToast(t("colorApplied"));
  });
});

customColor.addEventListener("input", () => {
  const state = getThemeState();

  state.source = "manual";
  state.palette = createPaletteFromPrimary(customColor.value);

  saveThemeState(state);
  applyThemeState(state);
});

wallpaperInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const palette = await extractPaletteFromImage(file);
    const state = getThemeState();

    state.source = "wallpaper";
    state.palette = palette;

    saveThemeState(state);
    applyThemeState(state);

    presetPalettes.unshift(palette);
    renderPresetPalettes();

    const first = wallpaperPaletteRow.querySelector(".palette-swatch");
    if (first) first.classList.add("active");

    showToast(t("paletteExtracted"));
  } catch {
    showToast(t("paletteFailed"));
  } finally {
    wallpaperInput.value = "";
  }
});

renderPresetPalettes();
applyThemeState(getThemeState());
applyLanguage(currentLanguage);


/* ===== Realtime active usage tracker for Android Simulator widget ===== */
(() => {
  "use strict";
  if (window.WaifuUsageTracker) return;

  const STORAGE_KEY = "waifuGalleryActiveUsageV1";
  const dayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  let record = { day: dayKey(), milliseconds: 0 };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (saved && saved.day === record.day && Number.isFinite(Number(saved.milliseconds))) {
      record.milliseconds = Math.max(0, Number(saved.milliseconds));
    }
  } catch {}

  let lastTick = performance.now();
  let dirtyTicks = 0;

  const ensureToday = () => {
    const today = dayKey();
    if (record.day !== today) {
      record = { day: today, milliseconds: 0 };
      dirtyTicks = 0;
      persist();
    }
  };

  const persist = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(record)); } catch {}
  };

  const tick = () => {
    ensureToday();
    const now = performance.now();
    const elapsed = Math.max(0, Math.min(2000, now - lastTick));
    lastTick = now;

    if (document.visibilityState === "visible") {
      record.milliseconds += elapsed;
      dirtyTicks += 1;
      if (dirtyTicks >= 5) {
        dirtyTicks = 0;
        persist();
      }
    }
  };

  const timer = window.setInterval(tick, 1000);

  document.addEventListener("visibilitychange", () => {
    tick();
    persist();
    lastTick = performance.now();
  });

  window.addEventListener("pagehide", persist);
  window.addEventListener("beforeunload", persist);

  window.WaifuUsageTracker = Object.freeze({
    getSeconds() {
      ensureToday();
      return Math.max(0, Math.floor(record.milliseconds / 1000));
    },
    getMilliseconds() {
      ensureToday();
      return Math.max(0, record.milliseconds);
    },
    resetToday() {
      record = { day: dayKey(), milliseconds: 0 };
      persist();
      return 0;
    },
    stop() {
      window.clearInterval(timer);
      persist();
    }
  });
})();
