
(() => {
  "use strict";

  const $ = s => document.querySelector(s);
  const dialog = $("#phoneSimDialog");
  const openBtn = $("#phoneSimBtn");
  const closeBtn = $("#closePhoneSim");
  const root = $("#androidScreenRoot");
  const phone = $("#pixelScreen");
  const status = $("#androidStatusbar");
  const gesture = $("#androidGesturePill");
  const power = $("#pixelPowerButton");
  const volume = $("#pixelVolumeButton");

  if (!dialog || !openBtn || !root || !phone) return;

  const STORE = "android17Pixel10FrankelSimV1";
  const walls = [
    ["violet","Violet Night","./assets/waifu-07.jpg"],
    ["frost","Frostlight","./assets/waifu-11.jpg"],
    ["moon","Moon Garden","./assets/waifu-20.jpg"],
    ["blue","Blue Moon","./assets/waifu-21.jpg"],
    ["bride","Blooming Bride","./assets/waifu-31.jpg"],
    ["rose","Purple Rose","./assets/waifu-34.jpg"]
  ];
  const palettes = [
    ["p1","#578bf0","#dbe7ff",["#974d5b","#f3b1be","#bc86c0","#ead2da"]],
    ["p2","#607077","#e1e8ea",["#111","#d5d5d5","#82908d","#cbd0d0"]],
    ["p3","#8d7771","#eee0dc",["#7e6060","#ead2cb","#bd8aa5","#dfc5d1"]],
    ["p4","#9066df","#e8dcff",["#ca0043","#ffadc6","#a178ed","#efd4df"]],
    ["p5","#00a8b8","#d7f3f7",["#b53851","#7dd0d5","#00a8b8","#e5d4d9"]],
    ["blue","#4389f0","#d8e8ff",["#4389f0","#7aa9f5","#cfe0ff","#a1c4fb"]],
    ["green","#719b4b","#e3efd7",["#719b4b","#9dbd7f","#d7e8c7","#5c7f3d"]]
  ];

  const defaults = {
    view:"home", prev:"home", locked:false, shade:false, sheet:false,
    styleTab:"home", wallpaper:"violet", palette:"p1", dark:false,
    icon:"squircle", cols:5, clock:0,
    left:"flashlight", right:"camera",
    lockNotif:true, notifMode:"compact", seen:true, silent:false,
    lockText:"", controls:false, dynamicClock:true, nowPlaying:true,
    musicArt:false, lift:true, wake:true,
    wifi:true, bluetooth:true, airplane:false, flashlight:false,
    saver:false, brightness:76, battery:61, volume:62
  };

  function load(){
    try { return {...defaults,...JSON.parse(localStorage.getItem(STORE)||"{}")}; }
    catch { return {...defaults}; }
  }
  let s = load();

  const lang = () => document.documentElement.lang?.startsWith("en") ? "en" : "id";
  const text = {
    id:{
      home:"Beranda",settings:"Setelan",style:"Wallpaper & gaya",lock:"Layar kunci",
      homeScreen:"Layar utama",theme:"Paket tema",noneTheme:"Tanpa Tema",color:"Warna",
      contrast:"Kontras warna",icons:"Ikon",layout:"Tata letak",clock:"Jam",shortcuts:"Pintasan",
      notif:"Notifikasi di layar kunci",notifDesc:"Kelola tampilan notifikasi dan informasi yang ditampilkan",
      moreLock:"Setelan layar kunci lainnya",moreLockDesc:"Privasi, Now Playing, dan lain-lain",
      otherWall:"Wallpaper lain",dark:"Tema gelap",apply:"Terapkan",default:"Default",
      circle:"Lingkaran",minimal:"Minimal",left:"Pintasan kiri",right:"Pintasan kanan",
      flashlight:"Senter",camera:"Kamera",wallet:"Dompet",nothing:"Tidak ada",
      showLock:"Tampilkan di layar kunci",compact:"Ringkas",full:"Daftar lengkap",
      seen:"Tampilkan ikon notifikasi yang telah dilihat",silent:"Tampilkan notifikasi senyap",
      addText:"Tambahkan teks di layar kunci",deviceControls:"Gunakan kontrol perangkat",
      dynamic:"Jam dinamis",now:"Now Playing",music:"Penampil musik",lift:"Angkat untuk memeriksa ponsel",
      wake:"Aktifkan layar untuk notifikasi",search:"Telusuri setelan",about:"Tentang ponsel",
      device:"Nama perangkat",model:"Model",android:"Versi Android",security:"Pembaruan keamanan",
      build:"Nomor build simulator",wallpaper:"Wallpaper",apps:"Daftar aplikasi",homeSettings:"Setelan layar utama",
      widget:"Widget",wifi:"Wi-Fi",bluetooth:"Bluetooth",airplane:"Mode pesawat",saver:"Penghemat baterai",
      unlock:"Geser ke atas untuk membuka",restarting:"Memulai ulang",volume:"Volume",wallApplied:"Wallpaper diterapkan"
    },
    en:{
      home:"Home",settings:"Settings",style:"Wallpaper & style",lock:"Lock screen",
      homeScreen:"Home screen",theme:"Theme pack",noneTheme:"No theme",color:"Color",
      contrast:"Color contrast",icons:"Icons",layout:"Layout",clock:"Clock",shortcuts:"Shortcuts",
      notif:"Lock screen notifications",notifDesc:"Manage notification appearance and lock-screen information",
      moreLock:"More lock screen settings",moreLockDesc:"Privacy, Now Playing and more",
      otherWall:"More wallpapers",dark:"Dark theme",apply:"Apply",default:"Default",
      circle:"Circle",minimal:"Minimal",left:"Left shortcut",right:"Right shortcut",
      flashlight:"Flashlight",camera:"Camera",wallet:"Wallet",nothing:"None",
      showLock:"Show on lock screen",compact:"Compact",full:"Full list",
      seen:"Show icons for viewed notifications",silent:"Show silent notifications",
      addText:"Add text on lock screen",deviceControls:"Use device controls",
      dynamic:"Dynamic clock",now:"Now Playing",music:"Music artwork",lift:"Lift to check phone",
      wake:"Wake screen for notifications",search:"Search settings",about:"About phone",
      device:"Device name",model:"Model",android:"Android version",security:"Security update",
      build:"Simulator build number",wallpaper:"Wallpaper",apps:"App list",homeSettings:"Home settings",
      widget:"Widgets",wifi:"Wi-Fi",bluetooth:"Bluetooth",airplane:"Airplane mode",saver:"Battery Saver",
      unlock:"Swipe up to unlock",restarting:"Restarting",volume:"Volume",wallApplied:"Wallpaper applied"
    }
  };
  const t = k => text[lang()][k] || text.id[k] || k;

  function save(){ localStorage.setItem(STORE,JSON.stringify(s)); }
  function wall(){ return walls.find(x=>x[0]===s.wallpaper)||walls[0]; }
  function pal(){ return palettes.find(x=>x[0]===s.palette)||palettes[0]; }
  function time(){
    return new Intl.DateTimeFormat(lang()==="en"?"en-US":"id-ID",{hour:"2-digit",minute:"2-digit",hour12:false})
      .format(new Date()).replace(":",".");
  }
  function date(){
    return new Intl.DateTimeFormat(lang()==="en"?"en-US":"id-ID",{weekday:"short",month:"short",day:"numeric"}).format(new Date());
  }
  function esc(v=""){ return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"); }

  function apply(){
    const p=pal();
    phone.style.setProperty("--wall",`url("${wall()[2]}")`);
    phone.style.setProperty("--a",p[1]);
    phone.style.setProperty("--a2",p[2]);
    phone.style.setProperty("--cols",String(s.cols));
    phone.classList.toggle("dark",s.dark);
    phone.classList.toggle("icons-circle",s.icon==="circle");
    phone.classList.toggle("icons-minimal",s.icon==="minimal");
    phone.style.filter=s.flashlight?"brightness(1.12)":"";
    $("#androidStatusTime").textContent=time();
    $("#androidBatteryText").textContent=s.battery;
    $("#androidWifiIcon").style.opacity=s.wifi&&!s.airplane?"1":".25";
    $("#androidSignalIcon").style.opacity=!s.airplane?"1":".25";
  }

  const top = title => `<div class="a-top"><button class="a-back" data-nav="back">‹</button><h3>${title}</h3><span class="a-spacer"></span></div>`;
  const toggle = key => `<button class="a-toggle ${s[key]?"on":""}" data-toggle="${key}" type="button"></button>`;
  const row = (icon,title,desc="",nav="") => `<button class="a-row" ${nav?`data-nav="${nav}"`:""} type="button"><span class="a-icon">${icon}</span><span class="a-row-copy"><strong>${title}</strong>${desc?`<span>${desc}</span>`:""}</span>${nav?'<b>›</b>':""}</button>`;

  function shortcutName(v){ return ({flashlight:t("flashlight"),camera:t("camera"),wallet:t("wallet"),none:t("nothing")})[v]; }
  function shortcutIcon(v){ return ({flashlight:"⌁",camera:"◉",wallet:"▣",none:"·"})[v]; }

  function home(){
    const apps=[["◉","Camera","camera"],["✿","Photos","wallpaper"],["✉","Messages","apps"],["◎","Chrome","apps"],["⚙",t("settings"),"settings"]];
    root.innerHTML=`<div class="a-page home" id="homeSurface"><div class="home-overlay">
      <div class="home-weather"><strong>Besok 22°C / 12°C</strong><span>☀ Cerah</span></div>
      <div class="home-space"></div>
      <div class="app-grid">${apps.map(a=>`<button class="app" data-nav="${a[2]}"><span class="app-icon">${a[0]}</span><small>${a[1]}</small></button>`).join("")}</div>
      <div class="home-widget"><div><strong>Waktu penggunaan perangkat</strong><span>2 j, 18 mnt</span></div><strong>◔</strong></div>
      <div class="search-pill"><b>G</b><span>Telusuri</span><strong>⌕</strong></div>
    </div>${s.sheet?homeSheet():""}</div>`;

    const surface=$("#homeSurface");
    if(surface&&!s.sheet){
      let timer;
      surface.addEventListener("pointerdown",e=>{
        if(e.target.closest("button"))return;
        timer=setTimeout(()=>{s.sheet=true;render()},520);
      });
      ["pointerup","pointerleave","pointercancel"].forEach(n=>surface.addEventListener(n,()=>clearTimeout(timer)));
      surface.addEventListener("contextmenu",e=>{e.preventDefault();s.sheet=true;render()});
    }
  }

  function homeSheet(){
    return `<div class="home-sheet">
      <div class="wall-strip">${walls.slice(0,4).map(w=>`<button class="wall-thumb" data-wall="${w[0]}" style="background-image:url('${w[2]}')"></button>`).join("")}</div>
      <button class="sheet-row" data-nav="style">◉ ${t("style")}</button>
      <button class="sheet-row" data-action="widget">▦ ${t("widget")}</button>
      <button class="sheet-row" data-nav="apps">▦ ${t("apps")}</button>
      <button class="sheet-row" data-nav="homeSettings">⌂ ${t("homeSettings")}</button>
    </div>`;
  }

  function previews(){
    return `<div class="preview-tabs">
      <button data-style-tab="lock" class="${s.styleTab==="lock"?"active":""}">${t("lock")}</button>
      <button data-style-tab="home" class="${s.styleTab==="home"?"active":""}">${t("homeScreen")}</button>
    </div>
    <div class="preview-pair">
      <button class="preview-phone ${s.styleTab==="home"?"dim":""}" data-style-tab="lock"><span class="preview-clock">${time().replace(".","<br>")}</span></button>
      <button class="preview-phone ${s.styleTab==="lock"?"dim":""}" data-style-tab="home"><span class="preview-icons"><span></span><span></span><span></span><span></span></span></button>
    </div>
    <button class="wall-button" data-nav="wallpaper">▧ ${t("otherWall")}</button>`;
  }

  function style(){
    const homeRows=`${row("✣",t("theme"),t("noneTheme"))}${row("●",t("color"),"", "color")}${row("◉",t("contrast"),t("default"))}${row("●",t("icons"),s.icon==="circle"?t("circle"):s.icon==="minimal"?t("minimal"):t("default"),"icons")}${row("⠿",t("layout"),s.cols+" kolom","homeSettings")}`;
    const lockRows=`${row("✣",t("theme"),t("noneTheme"))}${row("8",t("clock"),"", "clock")}${row("◫",t("shortcuts"),`${shortcutName(s.left)}, ${shortcutName(s.right)}`,"shortcuts")}${row("",t("notif"),t("notifDesc"),"notif")}${row("",t("moreLock"),t("moreLockDesc"),"lockmore")}`;
    root.innerHTML=`<div class="a-page style-page">${top(t("style"))}${previews()}<div class="a-card settings-stack">${s.styleTab==="home"?homeRows:lockRows}</div></div>`;
  }

  function colors(){
    root.innerHTML=`<div class="a-page style-page">${top(t("color"))}<div class="color-preview"></div>
      <div class="a-card color-box"><div class="palette-grid">${palettes.map(p=>`<button class="palette ${s.palette===p[0]?"active":""}" data-palette="${p[0]}" style="--p1:${p[3][0]};--p2:${p[3][1]};--p3:${p[3][2]};--p4:${p[3][3]}"></button>`).join("")}</div>
      <div class="a-row"><span class="a-row-copy"><strong>${t("dark")}</strong></span>${toggle("dark")}</div></div></div>`;
  }

  function icons(){
    const choices=[["squircle","▣",t("default")],["circle","●",t("circle")],["minimal","○",t("minimal")]];
    root.innerHTML=`<div class="a-page style-page">${top(t("icons"))}<div class="color-preview"></div><div class="choice-grid">${choices.map(c=>`<button class="choice ${s.icon===c[0]?"active":""}" data-icon="${c[0]}"><b>${c[1]}</b><small>${c[2]}</small></button>`).join("")}</div></div>`;
  }

  function clock(){
    const samples=["21<br>48","21:48","21<br><small>48</small>","21 48","21<br>⁴⁸","21·48"];
    root.innerHTML=`<div class="a-page style-page">${top(t("clock"))}<div class="color-preview"></div><div class="choice-grid">${samples.map((x,i)=>`<button class="choice ${s.clock===i?"active":""}" data-clock="${i}"><b>${x}</b><small>${t("clock")} ${i+1}</small></button>`).join("")}</div></div>`;
  }

  function shortcuts(){
    const vals=["flashlight","camera","wallet","none"];
    const group=(side,label)=>`<p style="font-size:9px;color:var(--muted);font-weight:900">${label}</p><div class="choice-grid">${vals.map(v=>`<button class="choice ${s[side]===v?"active":""}" data-short="${side}" data-short-val="${v}"><b>${shortcutIcon(v)}</b><small>${shortcutName(v)}</small></button>`).join("")}</div>`;
    root.innerHTML=`<div class="a-page style-page">${top(t("shortcuts"))}${group("left",t("left"))}${group("right",t("right"))}</div>`;
  }

  function notif(){
    root.innerHTML=`<div class="a-page style-page">${top(t("notif"))}
      <div class="a-row" style="border:0;background:var(--a2);border-radius:18px;margin:6px 0 10px"><span class="a-row-copy"><strong>${t("showLock")}</strong></span>${toggle("lockNotif")}</div>
      <div class="notif-preview"><div class="notif-phone"><strong>09:30</strong><div class="notif-bar"></div><div class="notif-bar short"></div></div></div>
      <div class="choice-grid" style="grid-template-columns:1fr 1fr"><button class="choice ${s.notifMode==="compact"?"active":""}" data-notif-mode="compact"><b>☰</b><small>${t("compact")}</small></button><button class="choice ${s.notifMode==="full"?"active":""}" data-notif-mode="full"><b>≡</b><small>${t("full")}</small></button></div>
      <div class="a-card" style="margin-top:10px"><div class="a-row"><span class="a-row-copy"><strong>${t("seen")}</strong></span>${toggle("seen")}</div><div class="a-row"><span class="a-row-copy"><strong>${t("silent")}</strong></span>${toggle("silent")}</div></div></div>`;
  }

  function lockMore(){
    root.innerHTML=`<div class="a-page style-page">${top(t("lock"))}<div class="a-card">
      <label class="a-row"><span class="a-row-copy"><strong>${t("addText")}</strong><input id="lockText" value="${esc(s.lockText)}" style="width:100%;margin-top:5px;padding:6px;border:1px solid var(--line);border-radius:9px;background:var(--surf);color:var(--txt)"></span></label>
      <div class="a-row"><span class="a-row-copy"><strong>${t("deviceControls")}</strong></span>${toggle("controls")}</div>
      ${row("",t("shortcuts"),`${shortcutName(s.left)}, ${shortcutName(s.right)}`,"shortcuts")}
      <div class="a-row"><span class="a-row-copy"><strong>${t("dynamic")}</strong></span>${toggle("dynamicClock")}</div>
      <div class="a-row"><span class="a-row-copy"><strong>${t("now")}</strong></span>${toggle("nowPlaying")}</div>
      <div class="a-row"><span class="a-row-copy"><strong>${t("music")}</strong></span>${toggle("musicArt")}</div>
      <div class="a-row"><span class="a-row-copy"><strong>${t("lift")}</strong></span>${toggle("lift")}</div>
      <div class="a-row"><span class="a-row-copy"><strong>${t("wake")}</strong></span>${toggle("wake")}</div>
    </div></div>`;
    $("#lockText")?.addEventListener("input",e=>{s.lockText=e.target.value.slice(0,40);save()});
  }

  function wallpaper(){
    root.innerHTML=`<div class="a-page style-page">${top(t("wallpaper"))}<div class="wall-gallery">${walls.map(w=>`<button class="wall-choice ${s.wallpaper===w[0]?"active":""}" data-wall="${w[0]}" style="background-image:url('${w[2]}')" title="${w[1]}"></button>`).join("")}</div></div>`;
  }

  function homeSettings(){
    root.innerHTML=`<div class="a-page style-page">${top(t("homeSettings"))}<div class="a-card">${[4,5,6].map(n=>`<button class="a-row" data-cols="${n}"><span class="a-row-copy"><strong>${t("layout")}: ${n} kolom</strong></span><span class="a-icon">${s.cols===n?"✓":"⠿"}</span></button>`).join("")}</div></div>`;
  }

  function settings(){
    const rs=[
      ["⌁","Jaringan & internet","Wi-Fi","shade"],["◫","Perangkat terhubung","Bluetooth","shade"],
      ["▦","Aplikasi","Aplikasi default","apps"],["◉","Notifikasi",t("notifDesc"),"notif"],
      ["▰","Baterai",s.battery+"%","shade"],["▥","Penyimpanan","128 GB","about"],
      ["✦",t("style"),"Material 3 Expressive","style"],["▣","Layar & sentuhan",t("dark"),"color"],
      ["♫","Suara & getaran",t("volume")+": "+s.volume+"%","shade"],["◆","Keamanan & privasi","Screen lock","lockmore"],
      ["⚙","Sistem","Bahasa, gestur","about"],["ⓘ",t("about"),"Google Pixel 10 • Frankel","about"]
    ];
    root.innerHTML=`<div class="a-page style-page"><div class="a-top"><h3>${t("settings")}</h3></div><div class="settings-search">⌕ ${t("search")}</div><div class="a-card">${rs.map(x=>row(x[0],x[1],x[2],x[3])).join("")}</div></div>`;
  }

  function about(){
    const rs=[[t("device"),"Google Pixel 10"],[t("model"),"Frankel"],[t("android"),"17"],[t("security"),"5 Agustus 2026"],[t("build"),"WG17.260818.1"]];
    root.innerHTML=`<div class="a-page style-page">${top(t("about"))}<div class="device-hero"><div class="device-glyph">G</div><h4>Google Pixel 10</h4><p>Android 17 • Model Frankel</p></div><div class="a-card">${rs.map(x=>`<div class="a-row"><span class="a-row-copy"><strong>${x[0]}</strong><span>${x[1]}</span></span></div>`).join("")}</div></div>`;
  }

  function apps(){
    const labels=["Camera","Chrome","Clock","Files","Gmail","Maps","Messages","Photos","Play",t("settings"),"YouTube","Weather"];
    const icons=["◉","◎","◷","▥","M","⌖","✉","✿","▶","⚙","▷","☀"];
    root.innerHTML=`<div class="a-page style-page">${top(t("apps"))}<div class="settings-search">⌕ ${t("apps")}</div><div class="app-grid" style="--cols:4;margin-top:12px">${labels.map((x,i)=>`<button class="app" style="color:var(--txt);text-shadow:none" data-nav="${x===t("settings")?"settings":x==="Camera"?"camera":"home"}"><span class="app-icon">${icons[i]}</span><small>${x}</small></button>`).join("")}</div></div>`;
  }

  function camera(){
    root.innerHTML=`<div class="a-page camera-page"><div class="camera-preview"></div><button class="camera-close" data-nav="back">‹</button><div class="camera-controls"><button class="shutter" data-action="shutter"></button></div></div>`;
  }

  function lock(){
    root.innerHTML=`<div class="a-page lock"><div class="lock-overlay"><div class="lock-date">${date()}</div><div class="lock-clock ${s.dynamicClock&&s.lockNotif?"small":""}">${time().replace(".",":")}</div>
      ${s.lockNotif?`<div class="lock-notifs"><div class="lock-notif"><strong>Waifu Gallery</strong><span>${s.notifMode==="compact"?"Galeri siap dibuka":"Galeri siap dibuka • Mini Game dan Ponsel tersedia"}</span></div>${s.notifMode==="full"?`<div class="lock-notif"><strong>Now Playing</strong><span>${s.nowPlaying?"Ambient track detected":"Off"}</span></div>`:""}</div>`:""}
      <div class="lock-space"></div><small>${esc(s.lockText)}</small><div class="lock-shortcuts"><button class="lock-shortcut" data-lock="${s.left}">${shortcutIcon(s.left)}</button><button class="lock-shortcut" data-lock="${s.right}">${shortcutIcon(s.right)}</button></div><div class="lock-hint">${t("unlock")}</div>
    </div></div>`;
  }

  function shade(){
    const tiles=[["wifi","⌁",t("wifi"),s.wifi&&!s.airplane],["bluetooth","ᛒ",t("bluetooth"),s.bluetooth],["dark","◐",t("dark"),s.dark],["flashlight","⌁",t("flashlight"),s.flashlight],["airplane","✈",t("airplane"),s.airplane],["saver","▰",t("saver"),s.saver]];
    return `<div class="quick-shade"><div class="shade-clock">${time().replace(".",":")}</div><div class="shade-date">${date()}</div><div class="quick-grid">${tiles.map(x=>`<button class="quick-tile ${x[3]?"on":""}" data-quick="${x[0]}"><b>${x[1]}</b><span><strong>${x[2]}</strong><span>${x[3]?"On":"Off"}</span></span></button>`).join("")}</div><div class="brightness">☀ <input id="brightness" type="range" min="20" max="100" value="${s.brightness}"></div><button class="wall-button" style="margin-top:12px" data-action="closeShade">⌃</button></div>`;
  }

  function boot(){ root.innerHTML=`<div class="boot"><div style="text-align:center"><div class="bootmark">G</div><p style="font-size:9px">${t("restarting")}</p></div></div>`; }

  function render(){
    apply();
    if(s.locked) lock();
    else {
      ({home,style,color:colors,icons,clock,shortcuts,notif,lockmore:lockMore,wallpaper,homeSettings,settings,about,apps,camera,boot}[s.view]||home)();
    }
    if(s.shade&&s.view!=="boot") root.insertAdjacentHTML("beforeend",shade());
    bind();
  }

  function nav(v){
    if(v==="back"){
      const p={style:"home",color:"style",icons:"style",clock:"style",shortcuts:"style",notif:"style",lockmore:"style",wallpaper:"style",homeSettings:"home",settings:"home",about:"settings",apps:"home",camera:"home",shade:"home"};
      v=p[s.view]||"home";
    }
    if(v==="shade"){s.shade=true;render();return}
    s.prev=s.view;s.view=v;s.sheet=false;s.shade=false;save();render();
  }

  function activate(v){
    if(v==="flashlight"){s.flashlight=!s.flashlight;save();render()}
    else if(v==="camera"){s.locked=false;s.view="camera";save();render()}
  }

  function bind(){
    root.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>nav(b.dataset.nav));
    root.querySelectorAll("[data-toggle]").forEach(b=>b.onclick=()=>{s[b.dataset.toggle]=!s[b.dataset.toggle];save();render()});
    root.querySelectorAll("[data-wall]").forEach(b=>b.onclick=()=>{s.wallpaper=b.dataset.wall;s.sheet=false;save();render()});
    root.querySelectorAll("[data-style-tab]").forEach(b=>b.onclick=()=>{s.styleTab=b.dataset.styleTab;save();render()});
    root.querySelectorAll("[data-palette]").forEach(b=>b.onclick=()=>{s.palette=b.dataset.palette;save();render()});
    root.querySelectorAll("[data-icon]").forEach(b=>b.onclick=()=>{s.icon=b.dataset.icon;save();render()});
    root.querySelectorAll("[data-clock]").forEach(b=>b.onclick=()=>{s.clock=+b.dataset.clock;save();render()});
    root.querySelectorAll("[data-short]").forEach(b=>b.onclick=()=>{s[b.dataset.short]=b.dataset.shortVal;save();render()});
    root.querySelectorAll("[data-notif-mode]").forEach(b=>b.onclick=()=>{s.notifMode=b.dataset.notifMode;save();render()});
    root.querySelectorAll("[data-cols]").forEach(b=>b.onclick=()=>{s.cols=+b.dataset.cols;save();render()});
    root.querySelectorAll("[data-lock]").forEach(b=>b.onclick=()=>activate(b.dataset.lock));
    root.querySelectorAll("[data-quick]").forEach(b=>b.onclick=()=>{const k=b.dataset.quick;if(k==="airplane"){s.airplane=!s.airplane;if(s.airplane)s.wifi=false}else s[k]=!s[k];save();render()});
    root.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>{const a=b.dataset.action;if(a==="closeShade"){s.shade=false;render()}if(a==="widget")alert(t("widget"));if(a==="shutter")alert("Simulated photo captured")});
    $("#brightness")?.addEventListener("input",e=>{s.brightness=+e.target.value;save()});
  }

  function open(){ if(!dialog.open)dialog.showModal();render() }
  function close(){ if(dialog.open)dialog.close() }
  function lockPhone(){s.locked=true;s.shade=false;save();render()}
  function unlock(){s.locked=false;s.view="home";save();render()}
  function reboot(){s.locked=false;s.shade=false;s.view="boot";render();setTimeout(()=>{s.view="home";s.locked=true;save();render()},1500)}

  openBtn.onclick=open; closeBtn.onclick=close;
  dialog.addEventListener("cancel",e=>{e.preventDefault();close()});
  status.onclick=()=>{if(s.view!=="boot"){s.shade=!s.shade;render()}};
  gesture.onclick=()=>s.locked?unlock():nav("home");
  power.onclick=()=>s.locked?unlock():lockPhone();
  volume.onclick=()=>{s.volume=s.volume>=100?20:s.volume+10;save();alert(`${t("volume")}: ${s.volume}%`)};

  document.querySelectorAll("[data-external-action]").forEach(b=>b.onclick=()=>{
    const a=b.dataset.externalAction;
    if(a==="home"){s.locked=false;nav("home")}
    if(a==="lock")lockPhone();
    if(a==="settings"){s.locked=false;nav("settings")}
    if(a==="style"){s.locked=false;nav("style")}
    if(a==="about"){s.locked=false;nav("about")}
    if(a==="reboot")reboot();
  });

  const obs=new MutationObserver(()=>{if(dialog.open)render()});
  obs.observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  setInterval(()=>{if(dialog.open){apply();if(s.locked||s.shade)render()}},30000);

  apply(); render();
})();
