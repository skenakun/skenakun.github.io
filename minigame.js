(() => {
"use strict";

const CRYSTAL_LEVELS = [{"number":1,"names":{"id":"Langkah Pertama","en":"First Steps"},"map":["###########","#P........#","#..###G...#","#.........#","#....#...G#","#....G....#","#....###..#","#.........#","#..#......#","#........E#","###########"],"movingTraps":[{"r":4,"c":2,"dr":0,"dc":1,"min":1,"max":4,"axis":"h"}],"trapSpeed":820},{"number":2,"names":{"id":"Kristal Bergerak","en":"Moving Crystals"},"map":["###########","#P........#","#..###G...#","#.........#","#....#...G#","#....G....#","#....###..#","#.........#","#..#......#","#........E#","###########"],"movingTraps":[{"r":6,"c":3,"dr":0,"dc":1,"min":1,"max":4,"axis":"h"}],"trapSpeed":801},{"number":3,"names":{"id":"Lorong Cepat","en":"Swift Corridor"},"map":["###########","#P........#","#..###G...#","#.........#","#....#...G#","#....G....#","#....###..#","#.........#","#..#......#","#........E#","###########"],"movingTraps":[{"r":9,"c":4,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"}],"trapSpeed":782},{"number":4,"names":{"id":"Taman Violet","en":"Violet Garden"},"map":["###########","#P........#","#..###G...#","#.........#","#....#...G#","#....G....#","#....###..#","#.........#","#..#......#","#........E#","###########"],"movingTraps":[{"r":7,"c":3,"dr":1,"dc":0,"min":3,"max":7,"axis":"v"}],"trapSpeed":763},{"number":5,"names":{"id":"Jejak Bulan","en":"Moon Trail"},"map":["###########","#P........#","#..###G...#","#.........#","#....#...G#","#....G....#","#....###..#","#.........#","#..#......#","#........E#","###########"],"movingTraps":[{"r":1,"c":7,"dr":1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":8,"c":8,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"}],"trapSpeed":744},{"number":6,"names":{"id":"Pilar Berkilau","en":"Shining Pillars"},"map":["###########","#P........#","#.###.###.#","#......G..#","###.....###","#.......G.#","#G.#####..#","#.........#","#.###.###.#","#........E#","###########"],"movingTraps":[{"r":1,"c":8,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":3,"c":1,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"}],"trapSpeed":725},{"number":7,"names":{"id":"Simpang Kristal","en":"Crystal Crossing"},"map":["###########","#P........#","#.###.###.#","#...G...G.#","###..G..###","#.........#","#..#####..#","#.........#","#.###.###.#","#...G....E#","###########"],"movingTraps":[{"r":5,"c":8,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":7,"c":1,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"}],"trapSpeed":706},{"number":8,"names":{"id":"Gerbang Senja","en":"Dusk Gate"},"map":["###########","#P........#","#.###.###.#","#...G...GD#","###..G..###","#.........#","#.K#####..#","#.........#","#.###.###.#","#...G....E#","###########"],"movingTraps":[{"r":8,"c":1,"dr":1,"dc":0,"min":5,"max":9,"axis":"v"},{"r":3,"c":5,"dr":-1,"dc":0,"min":1,"max":5,"axis":"v"}],"trapSpeed":687},{"number":9,"names":{"id":"Ritme Jebakan","en":"Trap Rhythm"},"map":["###########","#P........#","#.###.###.#","#...G...GD#","###..G..###","#.........#","#.K#####..#","#.........#","#.###.###.#","#...G....E#","###########"],"movingTraps":[{"r":1,"c":3,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":3,"c":7,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"},{"r":4,"c":4,"dr":0,"dc":1,"min":3,"max":7,"axis":"h"}],"trapSpeed":668},{"number":10,"names":{"id":"Kunci Pertama","en":"First Key"},"map":["###########","#P........#","#.###.###.#","#...G...GD#","###..G..###","#.........#","#.K#####..#","#.........#","#.###.###.#","#...G....E#","###########"],"movingTraps":[{"r":5,"c":2,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":7,"c":4,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"},{"r":9,"c":1,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"}],"trapSpeed":649},{"number":11,"names":{"id":"Labirin Ungu","en":"Purple Maze"},"map":["###########","#P....#...#","#.###.#.#.#","#.#.G.#.#.#","#.#.###.#.#","#.#.....#G#","#.#####.#.#","#KG.GD#.#.#","#.###.#...#","#........E#","###########"],"movingTraps":[{"r":3,"c":7,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":8,"c":9,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":5,"dr":0,"dc":1,"min":1,"max":5,"axis":"h"}],"trapSpeed":630},{"number":12,"names":{"id":"Jalur Berlapis","en":"Layered Route"},"map":["###########","#P....#...#","#.###.#.#.#","#.#.G.#.#.#","#.#.###.#.#","#.#.....#G#","#.#####.#.#","#KG.GD#.#.#","#.###.#...#","#........E#","###########"],"movingTraps":[{"r":5,"c":5,"dr":0,"dc":1,"min":3,"max":7,"axis":"h"},{"r":9,"c":7,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"},{"r":4,"c":1,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"}],"trapSpeed":611},{"number":13,"names":{"id":"Batu dan Cahaya","en":"Stone and Light"},"map":["###########","#P....#.G.#","#.###.#.#.#","#.#...#.#.#","#.#.###.#.#","#G#....G#.#","#.#####.#.#","#K.G.D#.#.#","#.###.#...#","#B...G...E#","###########"],"movingTraps":[{"r":6,"c":1,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":9,"c":7,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":2,"c":9,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":5,"dr":0,"dc":-1,"min":1,"max":5,"axis":"h"}],"trapSpeed":592},{"number":14,"names":{"id":"Koridor Rembulan","en":"Moonlit Corridor"},"map":["###########","#P....#.G.#","#.###.#.#.#","#.#...#.#.#","#.#.###.#.#","#G#....G#.#","#.#####.#.#","#K.G.D#.#.#","#.###.#...#","#B...G...E#","###########"],"movingTraps":[{"r":1,"c":4,"dr":0,"dc":1,"min":1,"max":5,"axis":"h"},{"r":5,"c":3,"dr":0,"dc":-1,"min":3,"max":7,"axis":"h"},{"r":9,"c":2,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":2,"c":1,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"}],"trapSpeed":573},{"number":15,"names":{"id":"Lintasan Cepat","en":"Fast Track"},"map":["###########","#P....#.G.#","#.###.#.#.#","#.#...#.#.#","#.#.###.#.#","#G#....G#.#","#.#####.#.#","#K.G.D#.#.#","#.###.#...#","#B...G...E#","###########"],"movingTraps":[{"r":9,"c":6,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":4,"c":1,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":4,"c":7,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":6,"c":9,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"}],"trapSpeed":554},{"number":16,"names":{"id":"Ruang Kunci","en":"Key Chamber"},"map":["###########","#P..#...G.#","#.#.#.###.#","#.#.#.....#","#.#.#####.#","#G#....G..#","#.#######.#","#K.G.D....#","#.#####.#.#","#B...G...E#","###########"],"movingTraps":[{"r":1,"c":5,"dr":0,"dc":1,"min":5,"max":9,"axis":"h"},{"r":3,"c":8,"dr":0,"dc":-1,"min":5,"max":9,"axis":"h"},{"r":5,"c":5,"dr":0,"dc":1,"min":3,"max":9,"axis":"h"},{"r":7,"c":8,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"}],"trapSpeed":535},{"number":17,"names":{"id":"Taman Berputar","en":"Turning Garden"},"map":["###########","#P..#...G.#","#.#.#.###.#","#.#.#.....#","#.#.#####.#","#G#....G..#","#.#######.#","#K.G.D....#","#.#####.#.#","#B...G...E#","###########"],"movingTraps":[{"r":7,"c":9,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":9,"c":3,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"},{"r":3,"c":1,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":4,"c":3,"dr":-1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":2,"c":9,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"}],"trapSpeed":516},{"number":18,"names":{"id":"Gerbang Kristal","en":"Crystal Gate"},"map":["###########","#P..#...G.#","#.#.#.###.#","#.#.#.....#","#.#.#####.#","#G#....G..#","#.#######.#","#K.G.D....#","#.#####.#.#","#B...G...E#","###########"],"movingTraps":[{"r":4,"c":3,"dr":1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":5,"c":9,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":7,"dr":0,"dc":1,"min":5,"max":9,"axis":"h"},{"r":3,"c":9,"dr":0,"dc":-1,"min":5,"max":9,"axis":"h"},{"r":5,"c":5,"dr":0,"dc":1,"min":3,"max":9,"axis":"h"}],"trapSpeed":497},{"number":19,"names":{"id":"Bayangan Bergerak","en":"Moving Shadows"},"map":["###########","#P..#...K.#","#.#.#.###.#","#.#G#G....#","#.#.#####G#","#.#...G...#","#.#######G#","#..B.D....#","#G#####.#.#","#........E#","###########"],"movingTraps":[{"r":3,"c":9,"dr":0,"dc":1,"min":5,"max":9,"axis":"h"},{"r":5,"c":7,"dr":0,"dc":-1,"min":3,"max":9,"axis":"h"},{"r":7,"c":4,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":9,"c":2,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"},{"r":9,"c":1,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"}],"trapSpeed":478},{"number":20,"names":{"id":"Pilar Tengah Malam","en":"Midnight Pillars"},"map":["###########","#P..#...K.#","#.#.#.###.#","#.#G#G....#","#.#.#####G#","#.#...GB..#","#.#######G#","#..B.D....#","#G#####.#.#","#........E#","###########"],"movingTraps":[{"r":9,"c":5,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":3,"c":1,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":3,"dr":1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":3,"c":9,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":5,"dr":0,"dc":1,"min":5,"max":9,"axis":"h"}],"trapSpeed":459},{"number":21,"names":{"id":"Rute Berbahaya","en":"Danger Route"},"map":["###########","#P..#...K.#","#.#.#.###.#","#.#G.G#...#","#.#####G#G#","#.....#B#.#","###.#.#.#G#","#..B#D..#.#","#G#####...#","#........E#","###########"],"movingTraps":[{"r":3,"c":1,"dr":1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":8,"c":7,"dr":-1,"dc":0,"min":3,"max":9,"axis":"v"},{"r":2,"c":9,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":9,"dr":0,"dc":-1,"min":5,"max":9,"axis":"h"},{"r":5,"c":5,"dr":0,"dc":1,"min":1,"max":5,"axis":"h"},{"r":9,"c":8,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"}],"trapSpeed":440},{"number":22,"names":{"id":"Lorong Es","en":"Ice Corridor"},"map":["###########","#P..#...K.#","#.#.#.###.#","#.#G.G#...#","#.#####G#G#","#.....#B#.#","###.#.#.#G#","#..B#D..#.#","#G#####...#","#........E#","###########"],"movingTraps":[{"r":1,"c":7,"dr":0,"dc":1,"min":5,"max":9,"axis":"h"},{"r":5,"c":5,"dr":0,"dc":-1,"min":1,"max":5,"axis":"h"},{"r":9,"c":3,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":2,"c":1,"dr":-1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":3,"c":7,"dr":1,"dc":0,"min":3,"max":9,"axis":"v"},{"r":3,"c":9,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"}],"trapSpeed":421},{"number":23,"names":{"id":"Batu Penjaga","en":"Guardian Stones"},"map":["###########","#P..#...K.#","#.#.#.###.#","#.#G.G#...#","#.#####G#G#","#.....#B#.#","###.#.#.#G#","#..B#D..#.#","#G#####...#","#........E#","###########"],"movingTraps":[{"r":5,"c":1,"dr":1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":3,"c":7,"dr":-1,"dc":0,"min":3,"max":9,"axis":"v"},{"r":5,"c":9,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":6,"dr":0,"dc":-1,"min":5,"max":9,"axis":"h"},{"r":5,"c":2,"dr":0,"dc":1,"min":1,"max":5,"axis":"h"},{"r":9,"c":2,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"}],"trapSpeed":402},{"number":24,"names":{"id":"Gerbang Ganda","en":"Twin Gate"},"map":["###########","#P..#...K.#","#.#.#.###.#","#.#G.G#...#","#.#####G#G#","#.....#B#.#","###.#.#.#G#","#..B#D..#.#","#G#####...#","#........E#","###########"],"movingTraps":[{"r":1,"c":5,"dr":0,"dc":1,"min":5,"max":9,"axis":"h"},{"r":5,"c":2,"dr":0,"dc":-1,"min":1,"max":5,"axis":"h"},{"r":9,"c":5,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":4,"c":1,"dr":-1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":7,"c":7,"dr":1,"dc":0,"min":3,"max":9,"axis":"v"},{"r":7,"c":9,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"}],"trapSpeed":383},{"number":25,"names":{"id":"Labirin Aurora","en":"Aurora Maze"},"map":["###########","#P..#G....#","#.#.#.###.#","#.#...#...#","#.#####.#.#","#.G...#.#.#","###G#.#.#.#","#K.G#DG.#.#","#.#####G..#","#BGB.....E#","###########"],"movingTraps":[{"r":3,"c":1,"dr":1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":6,"c":7,"dr":-1,"dc":0,"min":3,"max":9,"axis":"v"},{"r":6,"c":9,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":9,"dr":0,"dc":-1,"min":5,"max":9,"axis":"h"},{"r":5,"c":3,"dr":0,"dc":1,"min":1,"max":5,"axis":"h"},{"r":9,"c":4,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"},{"r":3,"c":1,"dr":1,"dc":0,"min":1,"max":5,"axis":"v"}],"trapSpeed":364},{"number":26,"names":{"id":"Jejak Tanpa Henti","en":"Endless Trail"},"map":["###########","#P..#G....#","#.#.#.###.#","#.#...#...#","#.###G#.#.#","#.G.#G#D#.#","###.#.#G#G#","#K.B#B..#.#","#.#####.#.#","#.G......E#","###########"],"movingTraps":[{"r":1,"c":8,"dr":0,"dc":1,"min":5,"max":9,"axis":"h"},{"r":9,"c":1,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"},{"r":4,"c":1,"dr":1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":6,"c":5,"dr":-1,"dc":0,"min":1,"max":7,"axis":"v"},{"r":9,"c":7,"dr":1,"dc":0,"min":3,"max":9,"axis":"v"},{"r":2,"c":9,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":8,"dr":0,"dc":1,"min":5,"max":9,"axis":"h"}],"trapSpeed":345},{"number":27,"names":{"id":"Ruang Bintang","en":"Star Chamber"},"map":["###########","#P..#G....#","#.#.#.###.#","#.#...#...#","#.###G#.#.#","#.G.#G#D#.#","###.#.#G#G#","#K.B#B..#.#","#.#####.#.#","#.G..B...E#","###########"],"movingTraps":[{"r":2,"c":5,"dr":1,"dc":0,"min":1,"max":7,"axis":"v"},{"r":9,"c":7,"dr":-1,"dc":0,"min":3,"max":9,"axis":"v"},{"r":4,"c":9,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":7,"dr":0,"dc":-1,"min":5,"max":9,"axis":"h"},{"r":9,"c":8,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":3,"c":1,"dr":-1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":2,"c":5,"dr":1,"dc":0,"min":1,"max":7,"axis":"v"}],"trapSpeed":326},{"number":28,"names":{"id":"Mahkota Jebakan","en":"Trap Crown"},"map":["###########","#P..#G....#","#.#.#.###.#","#.#...#...#","#.###G#.#.#","#.G.#G#D#.#","###.#.#G#G#","#K.B#B..#.#","#.#####.#.#","#.G..B...E#","###########"],"movingTraps":[{"r":1,"c":6,"dr":0,"dc":1,"min":5,"max":9,"axis":"h"},{"r":9,"c":1,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"},{"r":2,"c":1,"dr":1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":3,"c":5,"dr":-1,"dc":0,"min":1,"max":7,"axis":"v"},{"r":4,"c":7,"dr":1,"dc":0,"min":3,"max":9,"axis":"v"},{"r":4,"c":9,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":6,"dr":0,"dc":1,"min":5,"max":9,"axis":"h"}],"trapSpeed":307},{"number":29,"names":{"id":"Ujian Kristal","en":"Crystal Trial"},"map":["###########","#P..#G....#","#.#.#.###.#","#.#...#...#","#.###G#.#.#","#.G.#G#D#.#","###.#.#G#G#","#K.B#B..#.#","#.#####.#.#","#.G..B...E#","###########"],"movingTraps":[{"r":6,"c":5,"dr":1,"dc":0,"min":1,"max":7,"axis":"v"},{"r":4,"c":7,"dr":-1,"dc":0,"min":3,"max":9,"axis":"v"},{"r":7,"c":9,"dr":1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":9,"dr":0,"dc":-1,"min":5,"max":9,"axis":"h"},{"r":9,"c":3,"dr":0,"dc":1,"min":1,"max":9,"axis":"h"},{"r":5,"c":1,"dr":-1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":6,"c":5,"dr":1,"dc":0,"min":1,"max":7,"axis":"v"},{"r":8,"c":7,"dr":-1,"dc":0,"min":3,"max":9,"axis":"v"}],"trapSpeed":288},{"number":30,"names":{"id":"Final Aurora","en":"Aurora Finale"},"map":["###########","#P..#G....#","#.#.#.###.#","#.#...#...#","#.###G#.#.#","#.G.#G#D#.#","###.#.#G#G#","#K.B#B..#.#","#.#####.#.#","#.G..B...E#","###########"],"movingTraps":[{"r":1,"c":8,"dr":0,"dc":1,"min":5,"max":9,"axis":"h"},{"r":9,"c":4,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"},{"r":4,"c":1,"dr":1,"dc":0,"min":1,"max":5,"axis":"v"},{"r":2,"c":5,"dr":-1,"dc":0,"min":1,"max":7,"axis":"v"},{"r":8,"c":7,"dr":1,"dc":0,"min":3,"max":9,"axis":"v"},{"r":7,"c":9,"dr":-1,"dc":0,"min":1,"max":9,"axis":"v"},{"r":1,"c":8,"dr":0,"dc":1,"min":5,"max":9,"axis":"h"},{"r":9,"c":4,"dr":0,"dc":-1,"min":1,"max":9,"axis":"h"}],"trapSpeed":269}];

const UI = {
  id: {
    hubTitle: "Mini Game",
    hubSubtitle: "Pilih game, lalu mainkan langsung tanpa meninggalkan galeri.",
    crystalPicker: "Puzzle 30 level",
    blocksPicker: "Susun blok",
    mazePicker: "Kejar skor",
    cityPicker: "Jelajah kota",
    selectLevel: "Pilih Level",
    progress: "{open} / 30 terbuka",
    legend: "Petunjuk",
    gem: "Kristal",
    player: "Penjelajah",
    exit: "Pintu keluar",
    trap: "Jebakan bergerak",
    key: "Kunci",
    rock: "Batu dorong",
    level: "Level",
    moves: "Langkah",
    best: "Terbaik",
    goal: "Ambil semua kristal dan hindari jebakan yang bergerak.",
    controls: "Kontrol",
    controlsText: "Keyboard: Arrow / WASD. Ponsel: gunakan tombol arah.",
    resetProgress: "Reset progres Crystal Trail",
    ready: "Level siap. Jebakan bergerak terus, perhatikan waktunya.",
    lockedExit: "Pintu keluar masih terkunci. Ambil semua kristal.",
    needKey: "Gerbang terkunci. Cari kunci dahulu.",
    gotKey: "Kunci ditemukan. Gerbang sekarang bisa dilewati.",
    gotGem: "Kristal ditemukan.",
    pushedRock: "Batu berhasil didorong.",
    blockedRock: "Batu tidak bisa didorong ke arah itu.",
    trapHit: "Jebakan bergerak mengenai penjelajah. Level diulang.",
    complete: "Level Selesai",
    completeText: "Selesai dalam {moves} langkah.",
    newBest: " Rekor baru!",
    replay: "Ulangi",
    next: "Level Berikutnya",
    finishTitle: "30 Level Selesai",
    finishText: "Semua 30 level Crystal Trail sudah selesai.",
    playAgain: "Main Lagi",
    lockedLevel: "Level ini belum terbuka.",
    resetDone: "Progres Crystal Trail direset.",
    resetConfirm: "Reset semua progres Crystal Trail?",
    blockDescription: "Susun blok, selesaikan garis, dan kejar skor tertinggi.",
    score: "Skor",
    lines: "Garis",
    blockLevel: "Level",
    startRestart: "Mulai / Ulangi",
    blockHelp: "← → gerak, ↑ putar, ↓ turun, Space jatuhkan.",
    mazeDescription: "Kumpulkan semua cahaya sambil menghindari para pengejar.",
    lives: "Nyawa",
    dots: "Cahaya",
    mazeHelp: "Gunakan Arrow / WASD untuk bergerak.",
    cityDescription: "Jelajahi 30 area kota yang semakin sulit, ambil checkpoint, dan buka area berikutnya.",
    checkpoint: "Checkpoint",
    time: "Waktu",
    cityHelp: "Arrow / WASD untuk mengemudi. Setiap level memiliki area, traffic, dan rute berbeda.",
    cityArea: "Area",
    cityDifficulty: "Kesulitan {level}/30",
    cityChooseLevel: "Pilih Level",
    cityProgress: "{open} / 30 terbuka",
    cityNext: "Level Berikutnya",
    cityLocked: "Level City Drive ini belum terbuka.",
    cityLevelComplete: "Area selesai!",
    cityLevelCompleteText: "Level {level} selesai dalam {time}s.",
    cityFinalComplete: "Semua 30 area City Drive selesai!",
    gameOver: "Game selesai. Tekan mulai untuk mencoba lagi.",
    mazeWin: "Semua cahaya terkumpul. Arena baru dibuat.",
    cityDone: "Semua checkpoint selesai.",
  },
  en: {
    hubTitle: "Mini Games",
    hubSubtitle: "Choose a game and play without leaving the gallery.",
    crystalPicker: "30-level puzzle",
    blocksPicker: "Stack blocks",
    mazePicker: "Chase a high score",
    cityPicker: "Explore the city",
    selectLevel: "Choose Level",
    progress: "{open} / 30 unlocked",
    legend: "Guide",
    gem: "Crystal",
    player: "Explorer",
    exit: "Exit",
    trap: "Moving trap",
    key: "Key",
    rock: "Pushable boulder",
    level: "Level",
    moves: "Moves",
    best: "Best",
    goal: "Collect every crystal and avoid the moving traps.",
    controls: "Controls",
    controlsText: "Keyboard: Arrow / WASD. Mobile: use the direction buttons.",
    resetProgress: "Reset Crystal Trail progress",
    ready: "Level ready. Moving traps never stop, so watch the timing.",
    lockedExit: "The exit is locked. Collect every crystal.",
    needKey: "The gate is locked. Find the key first.",
    gotKey: "Key found. The gate can now be crossed.",
    gotGem: "Crystal collected.",
    pushedRock: "Boulder pushed.",
    blockedRock: "The boulder cannot move that way.",
    trapHit: "A moving trap hit the explorer. Restarting the level.",
    complete: "Level Complete",
    completeText: "Finished in {moves} moves.",
    newBest: " New best!",
    replay: "Replay",
    next: "Next Level",
    finishTitle: "All 30 Levels Complete",
    finishText: "You completed all 30 Crystal Trail levels.",
    playAgain: "Play Again",
    lockedLevel: "This level is still locked.",
    resetDone: "Crystal Trail progress reset.",
    resetConfirm: "Reset all Crystal Trail progress?",
    blockDescription: "Stack blocks, clear lines, and chase a high score.",
    score: "Score",
    lines: "Lines",
    blockLevel: "Level",
    startRestart: "Start / Restart",
    blockHelp: "← → move, ↑ rotate, ↓ soft drop, Space hard drop.",
    mazeDescription: "Collect every light while avoiding the chasers.",
    lives: "Lives",
    dots: "Lights",
    mazeHelp: "Use Arrow keys or WASD to move.",
    cityDescription: "Explore 30 increasingly difficult city areas, collect checkpoints, and unlock the next area.",
    checkpoint: "Checkpoint",
    time: "Time",
    cityHelp: "Arrow keys / WASD to drive. Every level has a different area, traffic pattern, and route.",
    cityArea: "Area",
    cityDifficulty: "Difficulty {level}/30",
    cityChooseLevel: "Choose Level",
    cityProgress: "{open} / 30 unlocked",
    cityNext: "Next Level",
    cityLocked: "This City Drive level is still locked.",
    cityLevelComplete: "Area Complete!",
    cityLevelCompleteText: "Level {level} completed in {time}s.",
    cityFinalComplete: "All 30 City Drive areas completed!",
    gameOver: "Game over. Press start to try again.",
    mazeWin: "All lights collected. A new arena is ready.",
    cityDone: "All checkpoints completed.",
  }
};

function lang() {
  return document.documentElement.lang?.toLowerCase().startsWith("en") ? "en" : "id";
}

function tr(key, vars={}) {
  let text = UI[lang()][key] ?? UI.id[key] ?? key;
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, String(value));
  }
  return text;
}

const dialog = document.getElementById("miniGameDialog");
const openBtn = document.getElementById("miniGameBtn");
const closeBtn = document.getElementById("closeMiniGame");
if (!dialog || !openBtn || !closeBtn) return;

dialog.tabIndex = -1;

function focusGameHub() {
  window.requestAnimationFrame(() => {
    try {
      dialog.focus({ preventScroll: true });
    } catch {
      dialog.focus();
    }
  });
}

let activeGame = "crystal";
let activeModule = null;
const modules = {};

function switchGame(name) {
  if (activeModule?.pause) activeModule.pause();
  activeGame = name;

  document.querySelectorAll("[data-game-target]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.gameTarget === name);
  });
  document.querySelectorAll("[data-game-view]").forEach(view => {
    view.classList.toggle("active", view.dataset.gameView === name);
  });

  activeModule = modules[name] || null;
  activeModule?.resume?.();

  if (dialog.open) {
    focusGameHub();
  }
}

document.querySelectorAll("[data-game-target]").forEach(btn => {
  btn.addEventListener("click", () => switchGame(btn.dataset.gameTarget));
});

openBtn.addEventListener("click", () => {
  applyLanguage();

  if (!dialog.open) {
    dialog.showModal();
  }

  activeModule?.resume?.();
  focusGameHub();
});

function closeHub() {
  activeModule?.pause?.();
  if (dialog.open) dialog.close();
}

closeBtn.addEventListener("click", closeHub);
dialog.addEventListener("click", e => {
  if (e.target === dialog) closeHub();
});
dialog.addEventListener("cancel", e => {
  e.preventDefault();
  closeHub();
});

/* ---------------------------------------------------------
   CRYSTAL TRAIL
   --------------------------------------------------------- */

modules.crystal = (() => {
  const STORAGE = "crystalTrailProgressV2_30";
  const els = {
    levelGrid: document.getElementById("gameLevelGrid"),
    progress: document.getElementById("progressLabel"),
    board: document.getElementById("gameBoard"),
    levelValue: document.getElementById("gameLevelValue"),
    gemValue: document.getElementById("gameGemValue"),
    moveValue: document.getElementById("gameMoveValue"),
    bestValue: document.getElementById("gameBestValue"),
    levelName: document.getElementById("gameLevelName"),
    goal: document.getElementById("gameGoalText"),
    message: document.getElementById("gameMessage"),
    result: document.getElementById("gameResult"),
    resultTitle: document.getElementById("gameResultTitle"),
    resultText: document.getElementById("gameResultText"),
    replay: document.getElementById("replayLevelBtn"),
    next: document.getElementById("nextLevelBtn"),
    resetLevel: document.getElementById("resetLevelBtn"),
    resetProgress: document.getElementById("resetGameProgressBtn"),
  };

  let currentLevel = 0;
  let state = null;
  let progress = loadProgress();
  let trapTimer = null;
  let paused = true;
  let resultOpen = false;

  function loadProgress() {
    try {
      const p = JSON.parse(localStorage.getItem(STORAGE) || "{}");
      return {
        maxUnlocked: Math.min(30, Math.max(1, Number(p.maxUnlocked || 1))),
        completed: Array.isArray(p.completed) ? p.completed.slice(0,30) : [],
        best: Array.isArray(p.best) ? p.best.slice(0,30) : []
      };
    } catch {
      return {maxUnlocked:1, completed:[], best:[]};
    }
  }

  function saveProgress() {
    localStorage.setItem(STORAGE, JSON.stringify(progress));
  }

  function posKey(r,c) { return `${r},${c}`; }

  function buildState(index) {
    const level = CRYSTAL_LEVELS[index];
    const gems = new Set();
    const boulders = new Set();
    let player = {r:1,c:1};
    let keyPosition = null;

    level.map.forEach((row,r) => {
      [...row].forEach((tile,c) => {
        if (tile === "P") player = {r,c};
        if (tile === "G") gems.add(posKey(r,c));
        if (tile === "B") boulders.add(posKey(r,c));
        if (tile === "K") keyPosition = posKey(r,c);
      });
    });

    return {
      player,
      gems,
      totalGems: gems.size,
      boulders,
      keyPosition,
      hasKey:false,
      moves:0,
      dead:false,
      movingTraps: level.movingTraps.map(t => ({...t}))
    };
  }

  function staticTileAt(r,c) {
    return CRYSTAL_LEVELS[currentLevel].map[r]?.[c] || "#";
  }

  function setMessage(text, type="") {
    els.message.textContent = text;
    els.message.className = `game-message${type ? ` ${type}` : ""}`;
  }

  function trapAt(r,c) {
    return state?.movingTraps?.some(t => t.r === r && t.c === c);
  }

  function renderButtons() {
    els.levelGrid.innerHTML = "";
    CRYSTAL_LEVELS.forEach((level,index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "game-level-btn";
      btn.textContent = index + 1;
      const unlocked = index + 1 <= progress.maxUnlocked;
      btn.disabled = !unlocked;
      if (index === currentLevel) btn.classList.add("active");
      if (progress.completed[index]) btn.classList.add("completed");
      btn.title = unlocked ? `${tr("level")} ${index+1}` : tr("lockedLevel");
      btn.addEventListener("click", () => unlocked ? loadLevel(index) : setMessage(tr("lockedLevel"),"warning"));
      els.levelGrid.appendChild(btn);
    });
    els.progress.textContent = tr("progress", {open:progress.maxUnlocked});
  }

  function renderBoard() {
    if (!state) return;
    const level = CRYSTAL_LEVELS[currentLevel];
    els.board.style.setProperty("--board-cols", level.map[0].length);
    els.board.innerHTML = "";
    const exitLocked = state.gems.size > 0;

    level.map.forEach((row,r) => {
      [...row].forEach((base,c) => {
        const tile = document.createElement("div");
        tile.className = "game-tile";
        tile.classList.add(base === "#" ? "tile-wall" : "tile-floor");
        const key = posKey(r,c);

        if (base === "E") {
          tile.classList.add("tile-exit");
          if (exitLocked) tile.classList.add("exit-locked");
        }
        if (base === "D") {
          tile.classList.add("tile-door");
          if (state.hasKey) tile.classList.add("door-open");
        }
        if (base === "K" && !state.hasKey && state.keyPosition === key) tile.classList.add("tile-key");
        if (state.gems.has(key)) tile.classList.add("tile-gem");
        if (state.boulders.has(key)) tile.classList.add("tile-boulder");
        if (trapAt(r,c)) tile.classList.add("tile-moving-trap");
        if (state.player.r === r && state.player.c === c) tile.classList.add("tile-player");

        els.board.appendChild(tile);
      });
    });

    els.levelValue.textContent = currentLevel+1;
    els.gemValue.textContent = `${state.totalGems-state.gems.size}/${state.totalGems}`;
    els.moveValue.textContent = state.moves;
    els.bestValue.textContent = progress.best[currentLevel] || "—";
    els.levelName.textContent = level.names[lang()];
    els.goal.textContent = tr("goal");
  }

  function stopTrapTimer() {
    if (trapTimer) {
      clearInterval(trapTimer);
      trapTimer = null;
    }
  }

  function startTrapTimer() {
    stopTrapTimer();
    if (paused || resultOpen || !dialog.open || activeGame !== "crystal") return;
    const speed = CRYSTAL_LEVELS[currentLevel].trapSpeed;
    trapTimer = setInterval(moveTraps, speed);
  }

  function moveTraps() {
    if (!state || state.dead || resultOpen || paused) return;

    for (const trap of state.movingTraps) {
      let nr = trap.r + trap.dr;
      let nc = trap.c + trap.dc;

      if (trap.axis === "h") {
        if (nc < trap.min || nc > trap.max || staticTileAt(nr,nc) === "#") {
          trap.dc *= -1;
          nc = trap.c + trap.dc;
        }
      } else {
        if (nr < trap.min || nr > trap.max || staticTileAt(nr,nc) === "#") {
          trap.dr *= -1;
          nr = trap.r + trap.dr;
        }
      }

      trap.r = nr;
      trap.c = nc;

      if (state.player.r === nr && state.player.c === nc) {
        hitTrap();
        return;
      }
    }
    renderBoard();
  }

  function hitTrap() {
    if (state.dead) return;
    state.dead = true;
    stopTrapTimer();
    renderBoard();
    setMessage(tr("trapHit"),"danger");
    setTimeout(() => loadLevel(currentLevel), 560);
  }

  function isBoulderAt(r,c) {
    return state.boulders.has(posKey(r,c));
  }

  function canBoulderMoveTo(r,c) {
    const tile = staticTileAt(r,c);
    if (["#","D","G","K","E"].includes(tile)) return false;
    if (trapAt(r,c)) return false;
    return !isBoulderAt(r,c);
  }

  function tryMove(dr,dc) {
    if (!state || resultOpen || state.dead || paused) return;
    const nr = state.player.r + dr;
    const nc = state.player.c + dc;
    const base = staticTileAt(nr,nc);

    if (base === "#") return;
    if (base === "D" && !state.hasKey) {
      setMessage(tr("needKey"),"warning");
      return;
    }

    if (isBoulderAt(nr,nc)) {
      const br = nr+dr, bc = nc+dc;
      if (!canBoulderMoveTo(br,bc)) {
        setMessage(tr("blockedRock"),"warning");
        return;
      }
      state.boulders.delete(posKey(nr,nc));
      state.boulders.add(posKey(br,bc));
      setMessage(tr("pushedRock"));
    }

    state.player = {r:nr,c:nc};
    state.moves += 1;

    if (trapAt(nr,nc)) {
      hitTrap();
      return;
    }

    const key = posKey(nr,nc);
    if (state.gems.has(key)) {
      state.gems.delete(key);
      setMessage(tr("gotGem"),"success");
    }
    if (base === "K" && !state.hasKey) {
      state.hasKey = true;
      setMessage(tr("gotKey"),"success");
    }

    if (base === "E") {
      if (state.gems.size > 0) setMessage(tr("lockedExit"),"warning");
      else {
        completeLevel();
        return;
      }
    }

    renderBoard();
  }

  function loadLevel(index) {
    if (index+1 > progress.maxUnlocked) return;
    currentLevel = index;
    state = buildState(index);
    resultOpen = false;
    els.result.hidden = true;
    setMessage(tr("ready"));
    renderButtons();
    renderBoard();
    startTrapTimer();
  }

  function completeLevel() {
    resultOpen = true;
    stopTrapTimer();
    const oldBest = Number(progress.best[currentLevel] || 0);
    const newBest = !oldBest || state.moves < oldBest;
    if (newBest) progress.best[currentLevel] = state.moves;
    progress.completed[currentLevel] = true;
    if (currentLevel < 29) progress.maxUnlocked = Math.max(progress.maxUnlocked,currentLevel+2);
    saveProgress();
    renderButtons();

    const final = currentLevel === 29;
    els.resultTitle.textContent = final ? tr("finishTitle") : tr("complete");
    els.resultText.textContent = final
      ? tr("finishText")
      : tr("completeText",{moves:state.moves}) + (newBest ? tr("newBest") : "");
    els.replay.textContent = tr("replay");
    els.next.textContent = final ? tr("playAgain") : tr("next");
    els.result.hidden = false;
  }

  document.querySelectorAll("[data-crystal-move]").forEach(btn => {
    btn.addEventListener("click", () => {
      const d = btn.dataset.crystalMove;
      if (d==="up") tryMove(-1,0);
      if (d==="down") tryMove(1,0);
      if (d==="left") tryMove(0,-1);
      if (d==="right") tryMove(0,1);
    });
  });

  els.resetLevel.addEventListener("click", () => loadLevel(currentLevel));
  els.replay.addEventListener("click", () => loadLevel(currentLevel));
  els.next.addEventListener("click", () => loadLevel(currentLevel===29 ? 0 : currentLevel+1));
  els.resetProgress.addEventListener("click", () => {
    if (!confirm(tr("resetConfirm"))) return;
    progress = {maxUnlocked:1,completed:[],best:[]};
    saveProgress();
    loadLevel(0);
    setMessage(tr("resetDone"),"success");
  });

  function keydown(e) {
    if (!dialog.open || activeGame !== "crystal") return false;
    const key = e.key.toLowerCase();
    const dirs = {
      arrowup:[-1,0],w:[-1,0],arrowdown:[1,0],s:[1,0],
      arrowleft:[0,-1],a:[0,-1],arrowright:[0,1],d:[0,1]
    };
    if (dirs[key]) {
      e.preventDefault();
      tryMove(...dirs[key]);
      return true;
    }
    if (key==="r") {
      e.preventDefault();
      loadLevel(currentLevel);
      return true;
    }
    return false;
  }

  loadLevel(0);

  return {
    keydown,
    pause() { paused=true; stopTrapTimer(); },
    resume() { paused=false; startTrapTimer(); },
    applyLanguage() {
      renderButtons();
      renderBoard();
      els.resetProgress.textContent = tr("resetProgress");
      setMessage(tr("ready"));
    }
  };
})();

/* ---------------------------------------------------------
   BLOCK DROP
   Original falling-block game
   --------------------------------------------------------- */

modules.blocks = (() => {
  const canvas = document.getElementById("blockCanvas");
  const ctx = canvas.getContext("2d");
  const COLS=10, ROWS=20, SIZE=30;
  const scoreEl=document.getElementById("blockScore");
  const linesEl=document.getElementById("blockLines");
  const levelEl=document.getElementById("blockLevel");
  const bestEl=document.getElementById("blockBest");
  const startBtn=document.getElementById("blockStartBtn");
  const BEST_KEY="blockDropBestV1";

  const SHAPES = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]],
    [[0,1,1],[1,1,0]],
    [[1,1,0],[0,1,1]]
  ];
  const COLORS=["#6ee7f9","#f472b6","#a78bfa","#fb923c","#34d399","#facc15","#60a5fa"];

  let board, piece, score=0, lines=0, running=false, paused=true;
  let lastDrop=0, raf=null;

  function resetBoard() {
    board=Array.from({length:ROWS},()=>Array(COLS).fill(null));
    score=0; lines=0; running=true; paused=false;
    spawn();
    updateHud();
    lastDrop=performance.now();
    loop(lastDrop);
  }

  function spawn() {
    const idx=Math.floor(Math.random()*SHAPES.length);
    piece={shape:SHAPES[idx].map(r=>[...r]),color:COLORS[idx],x:Math.floor(COLS/2)-2,y:0};
    if (collides(piece.x,piece.y,piece.shape)) {
      running=false;
      paused=true;
      const best=Math.max(Number(localStorage.getItem(BEST_KEY)||0),score);
      localStorage.setItem(BEST_KEY,best);
      updateHud();
    }
  }

  function collides(x,y,shape) {
    return shape.some((row,ry)=>row.some((cell,rx)=>cell && (
      x+rx<0 || x+rx>=COLS || y+ry>=ROWS || (y+ry>=0 && board[y+ry][x+rx])
    )));
  }

  function merge() {
    piece.shape.forEach((row,ry)=>row.forEach((cell,rx)=>{
      if (cell && piece.y+ry>=0) board[piece.y+ry][piece.x+rx]=piece.color;
    }));
    clearLines();
    spawn();
  }

  function clearLines() {
    let cleared=0;
    for (let y=ROWS-1;y>=0;y--) {
      if (board[y].every(Boolean)) {
        board.splice(y,1);
        board.unshift(Array(COLS).fill(null));
        cleared++; y++;
      }
    }
    if (cleared) {
      lines+=cleared;
      score += [0,100,300,500,800][cleared] * (1+Math.floor(lines/10));
      updateHud();
    }
  }

  function rotate() {
    if (!running || paused) return;
    const rotated=piece.shape[0].map((_,i)=>piece.shape.map(row=>row[i]).reverse());
    if (!collides(piece.x,piece.y,rotated)) piece.shape=rotated;
  }

  function move(dx) {
    if (!running || paused) return;
    if (!collides(piece.x+dx,piece.y,piece.shape)) piece.x+=dx;
  }

  function down() {
    if (!running || paused) return;
    if (!collides(piece.x,piece.y+1,piece.shape)) {
      piece.y++;
      score++;
    } else merge();
    updateHud();
  }

  function hardDrop() {
    if (!running || paused) return;
    let dist=0;
    while (!collides(piece.x,piece.y+1,piece.shape)) {
      piece.y++; dist++;
    }
    score += dist*2;
    merge(); updateHud();
  }

  function updateHud() {
    scoreEl.textContent=score;
    linesEl.textContent=lines;
    levelEl.textContent=1+Math.floor(lines/10);
    bestEl.textContent=Math.max(Number(localStorage.getItem(BEST_KEY)||0),score);
  }

  function drawCell(x,y,color) {
    ctx.fillStyle=color;
    ctx.fillRect(x*SIZE+1,y*SIZE+1,SIZE-2,SIZE-2);
    ctx.fillStyle="rgba(255,255,255,.18)";
    ctx.fillRect(x*SIZE+4,y*SIZE+4,SIZE-8,4);
  }

  function draw() {
    ctx.fillStyle="#0b1020";ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle="rgba(255,255,255,.045)";
    for(let x=0;x<=COLS;x++){ctx.beginPath();ctx.moveTo(x*SIZE,0);ctx.lineTo(x*SIZE,canvas.height);ctx.stroke();}
    for(let y=0;y<=ROWS;y++){ctx.beginPath();ctx.moveTo(0,y*SIZE);ctx.lineTo(canvas.width,y*SIZE);ctx.stroke();}
    board?.forEach((row,y)=>row.forEach((cell,x)=>cell&&drawCell(x,y,cell)));
    if(piece && running) piece.shape.forEach((row,ry)=>row.forEach((cell,rx)=>cell&&drawCell(piece.x+rx,piece.y+ry,piece.color)));
    if(!running){
      ctx.fillStyle="rgba(7,10,20,.72)";ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle="#fff";ctx.font="700 22px Nunito";ctx.textAlign="center";
      ctx.fillText(tr("gameOver"),canvas.width/2,canvas.height/2);
    }
  }

  function loop(now) {
    if (raf) cancelAnimationFrame(raf);
    if (!running) { draw(); return; }
    if (!paused) {
      const interval=Math.max(120,700-(1+Math.floor(lines/10))*55);
      if(now-lastDrop>interval){down();lastDrop=now;}
      draw();
    }
    raf=requestAnimationFrame(loop);
  }

  function keydown(e) {
    if(!dialog.open || activeGame!=="blocks") return false;
    const k=e.key.toLowerCase();
    if(["arrowleft","a"].includes(k)){e.preventDefault();move(-1);}
    else if(["arrowright","d"].includes(k)){e.preventDefault();move(1);}
    else if(["arrowdown","s"].includes(k)){e.preventDefault();down();}
    else if(["arrowup","w"].includes(k)){e.preventDefault();rotate();}
    else if(k===" "){e.preventDefault();hardDrop();}
    else return false;
    draw(); return true;
  }

  startBtn.addEventListener("click",resetBoard);
  document.querySelectorAll("[data-block-action]").forEach(btn=>btn.addEventListener("click",()=>{
    const a=btn.dataset.blockAction;
    if(a==="left")move(-1); if(a==="right")move(1); if(a==="rotate")rotate(); if(a==="down")down(); if(a==="drop")hardDrop();
    draw();
  }));

  running=false; updateHud(); draw();

  return {
    keydown,
    pause(){paused=true;},
    resume(){paused=false;if(running)loop(performance.now());},
    applyLanguage(){}
  };
})();

/* ---------------------------------------------------------
   MAZE CHASER
   Original dot-collection maze
   --------------------------------------------------------- */

modules.maze = (() => {
  const canvas=document.getElementById("mazeCanvas"),ctx=canvas.getContext("2d");
  const scoreEl=document.getElementById("mazeScore"),livesEl=document.getElementById("mazeLives"),dotsEl=document.getElementById("mazeDots");
  const startBtn=document.getElementById("mazeStartBtn");
  const MAP=[
    "###############",
    "#.............#",
    "#.###.###.###.#",
    "#.............#",
    "#.#.#######.#.#",
    "#.#.........#.#",
    "#.###.###.###.#",
    "#.............#",
    "#.###.#.#.###.#",
    "#.....#.#.....#",
    "###.#.....#.###",
    "#...#.###.#...#",
    "#.###.....###.#",
    "#.............#",
    "###############"
  ];
  const N=15, SIZE=40;
  let player=null,chasers=[],dots=new Set(),score=0,lives=3,running=false,paused=true,lastMove=0,raf=null;
  let dir={x:0,y:0};

  function cellKey(x,y){return `${x},${y}`;}
  function open(x,y){return MAP[y]?.[x] && MAP[y][x]!=="#";}

  function reset() {
    dots=new Set();
    for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(open(x,y))dots.add(cellKey(x,y));
    player={x:1,y:1};dots.delete(cellKey(1,1));
    chasers=[{x:13,y:13,c:"#fb7185"},{x:13,y:1,c:"#a78bfa"},{x:1,y:13,c:"#22d3ee"}];
    chasers.forEach(c=>dots.delete(cellKey(c.x,c.y)));
    score=0;lives=3;running=true;paused=false;dir={x:0,y:0};lastMove=performance.now();update();loop(lastMove);
  }

  function update(){
    scoreEl.textContent=score;livesEl.textContent=lives;dotsEl.textContent=dots.size;
  }

  function chooseChaserMove(c){
    const options=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>open(c.x+dx,c.y+dy));
    options.sort((a,b)=>{
      const da=Math.abs(c.x+a[0]-player.x)+Math.abs(c.y+a[1]-player.y);
      const db=Math.abs(c.x+b[0]-player.x)+Math.abs(c.y+b[1]-player.y);
      return da-db+(Math.random()-.5)*2;
    });
    return Math.random()<.72?options[0]:options[Math.floor(Math.random()*options.length)];
  }

  function hit(){
    lives--;update();
    if(lives<=0){running=false;paused=true;draw();return;}
    player={x:1,y:1};dir={x:0,y:0};
  }

  function tick(){
    if(!running||paused)return;
    const nx=player.x+dir.x,ny=player.y+dir.y;
    if(open(nx,ny)){player.x=nx;player.y=ny;}
    const key=cellKey(player.x,player.y);
    if(dots.delete(key)){score+=10;}
    chasers.forEach(c=>{
      const mv=chooseChaserMove(c);if(mv){c.x+=mv[0];c.y+=mv[1];}
      if(c.x===player.x&&c.y===player.y)hit();
    });
    if(dots.size===0){score+=500;running=false;setTimeout(reset,900);}
    update();
  }

  function draw(){
    ctx.fillStyle="#07111b";ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let y=0;y<N;y++)for(let x=0;x<N;x++){
      if(MAP[y][x]==="#"){
        ctx.fillStyle="#342753";ctx.fillRect(x*SIZE+2,y*SIZE+2,SIZE-4,SIZE-4);
      } else {
        ctx.fillStyle="#0d1726";ctx.fillRect(x*SIZE,y*SIZE,SIZE,SIZE);
        if(dots?.has(cellKey(x,y))){
          ctx.fillStyle="#fde68a";ctx.beginPath();ctx.arc(x*SIZE+SIZE/2,y*SIZE+SIZE/2,4,0,Math.PI*2);ctx.fill();
        }
      }
    }
    if(player){
      ctx.fillStyle="#facc15";ctx.beginPath();ctx.arc(player.x*SIZE+20,player.y*SIZE+20,13,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(player.x*SIZE+24,player.y*SIZE+15,3,0,Math.PI*2);ctx.fill();
    }
    chasers?.forEach(c=>{
      ctx.fillStyle=c.c;ctx.beginPath();ctx.arc(c.x*SIZE+20,c.y*SIZE+20,13,Math.PI,0);ctx.lineTo(c.x*SIZE+33,c.y*SIZE+31);ctx.lineTo(c.x*SIZE+7,c.y*SIZE+31);ctx.closePath();ctx.fill();
    });
    if(!running){
      ctx.fillStyle="rgba(3,7,18,.68)";ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle="#fff";ctx.font="700 20px Nunito";ctx.textAlign="center";ctx.fillText(tr("gameOver"),300,300);
    }
  }

  function loop(now){
    if(raf)cancelAnimationFrame(raf);
    if(!paused&&running&&now-lastMove>145){tick();lastMove=now;}
    draw();
    raf=requestAnimationFrame(loop);
  }

  function setDir(name){
    if(name==="left")dir={x:-1,y:0};
    if(name==="right")dir={x:1,y:0};
    if(name==="up")dir={x:0,y:-1};
    if(name==="down")dir={x:0,y:1};
  }
  function keydown(e){
    if(!dialog.open||activeGame!=="maze")return false;
    const k=e.key.toLowerCase();
    const map={arrowleft:"left",a:"left",arrowright:"right",d:"right",arrowup:"up",w:"up",arrowdown:"down",s:"down"};
    if(!map[k])return false;e.preventDefault();setDir(map[k]);return true;
  }
  startBtn.addEventListener("click",reset);
  document.querySelectorAll("[data-maze-move]").forEach(btn=>btn.addEventListener("click",()=>setDir(btn.dataset.mazeMove)));
  draw();update();
  return {
    keydown,
    pause(){paused=true;},
    resume(){paused=false;loop(performance.now());},
    applyLanguage(){}
  };
})();

/* ---------------------------------------------------------
   CITY DRIVE
   Original top-down open-city driving and checkpoint game.
   No combat, weapons, crime, or violent mechanics.
   --------------------------------------------------------- */

modules.city = (() => {
  const canvas = document.getElementById("cityCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("cityScore");
  const timeEl = document.getElementById("cityTime");
  const bestEl = document.getElementById("cityBest");
  const levelEl = document.getElementById("cityLevelValue");
  const areaNameEl = document.getElementById("cityAreaName");
  const difficultyEl = document.getElementById("cityDifficultyText");
  const levelGridEl = document.getElementById("cityLevelGrid");
  const progressEl = document.getElementById("cityProgressLabel");
  const startBtn = document.getElementById("cityStartBtn");
  const nextBtn = document.getElementById("cityNextBtn");

  const W = 760, H = 560;
  const STORAGE = "cityDriveProgressV2_30";

  const AREA_NAMES = [
    "Sakura Avenue","Lavender Square","Bluebell District","Moonlight Market","Wisteria Cross",
    "Crystal Boulevard","Aurora Junction","Violet Harbor","Starlight Center","Rosewood Heights",
    "Azure Riverside","Celestia Gate","Orchid Downtown","Snowdrop Terrace","Iris Loop",
    "Prism Quarter","Lotus Interchange","Nebula Park","Amethyst Mile","Frostlight Ward",
    "Mirage Terminal","Eclipse Boulevard","Starfall Harbor","Lumina Heights","Galaxy Crossing",
    "Astral Ring","Radiant Core","Midnight Circuit","Aurora Capital","Celestial Finale"
  ];

  const PALETTES = [
    ["#172033","#2c3444","#40536a","#5b4b74","#60a5fa"],
    ["#211a2d","#42364d","#665070","#825d86","#c084fc"],
    ["#102336","#24465f","#3b6680","#557f91","#38bdf8"],
    ["#1c1830","#30294d","#51466e","#6e5b86","#818cf8"],
    ["#172a2c","#315053","#476d70","#5d898b","#2dd4bf"],
    ["#22212a","#3c3d4b","#555b6b","#748091","#a5b4fc"]
  ];

  function loadProgress() {
    try {
      const p = JSON.parse(localStorage.getItem(STORAGE) || "{}");
      return {
        maxUnlocked: Math.min(30, Math.max(1, Number(p.maxUnlocked || 1))),
        completed: Array.isArray(p.completed) ? p.completed.slice(0, 30) : [],
        best: Array.isArray(p.best) ? p.best.slice(0, 30) : []
      };
    } catch {
      return { maxUnlocked: 1, completed: [], best: [] };
    }
  }

  function saveProgress() {
    localStorage.setItem(STORAGE, JSON.stringify(progress));
  }

  function seeded(seed) {
    let value = seed >>> 0;
    return () => {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function shuffle(array, rand) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function makeLevel(index) {
    const number = index + 1;
    const rand = seeded(7000 + number * 973);
    const tier = Math.floor(index / 5);

    const roadWidth = Math.max(58, 92 - tier * 6);
    const verticalCount = 2 + Math.min(2, Math.floor(index / 8));
    const horizontalCount = 2 + Math.min(2, Math.floor(index / 10));

    const xs = shuffle([115,245,390,520,645], rand)
      .slice(0, verticalCount)
      .sort((a,b)=>a-b)
      .map(x => clamp(x + Math.round((rand() - .5) * 28), 90, 670));

    const ys = shuffle([90,200,310,425], rand)
      .slice(0, horizontalCount)
      .sort((a,b)=>a-b)
      .map(y => clamp(y + Math.round((rand() - .5) * 22), 70, 455));

    const roads = [];
    ys.forEach(y => roads.push({
      x:0, y:y-roadWidth/2, w:W, h:roadWidth, axis:"h", center:y
    }));
    xs.forEach(x => roads.push({
      x:x-roadWidth/2, y:0, w:roadWidth, h:H, axis:"v", center:x
    }));

    const intersections = [];
    ys.forEach(y => xs.forEach(x => intersections.push({x,y})));

    const start = intersections[0] || {x:160,y:130};
    const checkpointCount = Math.min(12, 4 + Math.floor(index / 3));

    const candidates = shuffle([
      ...intersections.filter(p => Math.hypot(p.x-start.x,p.y-start.y)>55),
      ...ys.flatMap(y => [{x:35,y},{x:W-35,y}]),
      ...xs.flatMap(x => [{x,y:35},{x,y:H-35}])
    ], rand);

    const checkpoints = [];
    for (const p of candidates) {
      if (checkpoints.length >= checkpointCount) break;
      if (!checkpoints.some(cp => Math.hypot(cp.x-p.x,cp.y-p.y)<62)) {
        checkpoints.push({...p});
      }
    }
    while (checkpoints.length < checkpointCount && candidates.length) {
      checkpoints.push({...candidates[checkpoints.length % candidates.length]});
    }

    const buildings = [];
    const xCuts = [0, ...xs.flatMap(x=>[x-roadWidth/2,x+roadWidth/2]), W].sort((a,b)=>a-b);
    const yCuts = [0, ...ys.flatMap(y=>[y-roadWidth/2,y+roadWidth/2]), H].sort((a,b)=>a-b);

    for (let xi=0; xi<xCuts.length-1; xi++) {
      for (let yi=0; yi<yCuts.length-1; yi++) {
        const left=xCuts[xi], right=xCuts[xi+1], top=yCuts[yi], bottom=yCuts[yi+1];
        if (right-left<32 || bottom-top<32) continue;
        const cx=(left+right)/2, cy=(top+bottom)/2;
        const onRoad = roads.some(r => cx>=r.x && cx<=r.x+r.w && cy>=r.y && cy<=r.y+r.h);
        if (onRoad) continue;
        const m=10+Math.round(rand()*7);
        buildings.push({x:left+m,y:top+m,w:Math.max(12,right-left-2*m),h:Math.max(12,bottom-top-2*m)});
      }
    }

    const trafficCount = Math.min(16, 2 + Math.floor(index / 2));
    const baseSpeed = .82 + index * .035;
    const traffic = [];
    for (let i=0; i<trafficCount; i++) {
      const horizontal = (i%2===0 && ys.length) || !xs.length;
      if (horizontal) {
        const y=ys[i%ys.length]+(i%3-1)*Math.min(16,roadWidth*.18);
        traffic.push({
          x:rand()*W,y,v:(i%4<2?1:-1)*(baseSpeed+rand()*.85),axis:"h",
          c:["#fb7185","#a78bfa","#34d399","#facc15","#38bdf8","#f97316"][i%6]
        });
      } else {
        const x=xs[i%xs.length]+(i%3-1)*Math.min(16,roadWidth*.18);
        traffic.push({
          x,y:rand()*H,v:(i%4<2?1:-1)*(baseSpeed+rand()*.85),axis:"v",
          c:["#fb7185","#a78bfa","#34d399","#facc15","#38bdf8","#f97316"][i%6]
        });
      }
    }

    const slowZones = [];
    const slowCount = Math.min(7, Math.floor(index / 5));
    for (let i=0; i<slowCount; i++) {
      const road=roads[(i*3+number)%roads.length];
      slowZones.push(road.axis==="h"
        ? {x:110+rand()*530,y:road.center,r:24+rand()*10}
        : {x:road.center,y:95+rand()*375,r:24+rand()*10});
    }

    return {
      number,
      name: AREA_NAMES[index],
      palette: PALETTES[index%PALETTES.length],
      roads, buildings, checkpoints, start, traffic, slowZones,
      checkpointRadius: Math.max(18, 30-Math.floor(index/5)),
      maxSpeed: 3.15 + Math.min(.65,index*.018)
    };
  }

  const LEVELS = Array.from({length:30}, (_,i)=>makeLevel(i));

  let progress=loadProgress();
  let currentLevel=Math.min(progress.maxUnlocked-1,29);
  let level=LEVELS[currentLevel];
  let car={x:level.start.x,y:level.start.y,a:0,s:0};
  let keys={},running=false,paused=true,completedCurrentRun=false;
  let startTime=0,elapsed=0,checkpointIndex=0,raf=null,last=performance.now();
  let traffic=level.traffic.map(t=>({...t}));

  function onRoad(x,y) {
    return level.roads.some(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h);
  }

  function inSlowZone(x,y) {
    return level.slowZones.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r);
  }

  function renderLevelButtons() {
    levelGridEl.innerHTML="";
    LEVELS.forEach((item,i)=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="city-level-btn";
      b.textContent=i+1;
      const unlocked=i+1<=progress.maxUnlocked;
      b.disabled=!unlocked;
      if(i===currentLevel)b.classList.add("active");
      if(progress.completed[i])b.classList.add("completed");
      b.title=unlocked?`${tr("level")} ${i+1} • ${item.name}`:tr("cityLocked");
      b.addEventListener("click",()=>{if(unlocked)selectLevel(i);});
      levelGridEl.appendChild(b);
    });
    progressEl.textContent=tr("cityProgress",{open:progress.maxUnlocked});
  }

  function selectLevel(i) {
    if(i+1>progress.maxUnlocked)return;
    currentLevel=i;
    level=LEVELS[i];
    running=false;paused=false;completedCurrentRun=false;elapsed=0;checkpointIndex=0;keys={};
    car={x:level.start.x,y:level.start.y,a:0,s:0};
    traffic=level.traffic.map(t=>({...t}));
    nextBtn.hidden=true;
    renderLevelButtons();updateHud();draw();focusGameHub();
  }

  function reset() {
    level=LEVELS[currentLevel];
    car={x:level.start.x,y:level.start.y,a:0,s:0};
    keys={};checkpointIndex=0;running=true;paused=false;completedCurrentRun=false;
    startTime=performance.now();elapsed=0;last=startTime;
    traffic=level.traffic.map(t=>({...t}));
    nextBtn.hidden=true;
    updateHud();draw();loop(last);focusGameHub();
  }

  function completeLevel() {
    running=false;paused=true;completedCurrentRun=true;
    elapsed=(performance.now()-startTime)/1000;
    const old=Number(progress.best[currentLevel]||0);
    if(!old||elapsed<old)progress.best[currentLevel]=Number(elapsed.toFixed(1));
    progress.completed[currentLevel]=true;
    if(currentLevel<29){
      progress.maxUnlocked=Math.max(progress.maxUnlocked,currentLevel+2);
      nextBtn.hidden=false;
    } else nextBtn.hidden=true;
    saveProgress();renderLevelButtons();updateHud();draw();
  }

  function update(dt) {
    if(!running||paused)return;
    const turn=(.0032+currentLevel*.000012)*dt;
    if(keys.left)car.a-=turn;
    if(keys.right)car.a+=turn;
    if(keys.up)car.s=Math.min(level.maxSpeed,car.s+.012*dt);
    else if(keys.down)car.s=Math.max(-1.75,car.s-.012*dt);
    else car.s*=Math.pow(.985,dt/16);
    if(inSlowZone(car.x,car.y))car.s*=Math.pow(.965,dt/16);

    const nx=car.x+Math.cos(car.a)*car.s*dt/16;
    const ny=car.y+Math.sin(car.a)*car.s*dt/16;
    if(onRoad(nx,ny)&&nx>7&&nx<W-7&&ny>7&&ny<H-7){car.x=nx;car.y=ny;}
    else car.s*=-.18;

    traffic.forEach(v=>{
      if(v.axis==="h"){
        v.x+=v.v*dt/16;
        if(v.x>W+32)v.x=-32;
        if(v.x<-32)v.x=W+32;
      } else {
        v.y+=v.v*dt/16;
        if(v.y>H+32)v.y=-32;
        if(v.y<-32)v.y=H+32;
      }
      if(Math.hypot(v.x-car.x,v.y-car.y)<21){
        car.s*=-.22;
        car.x-=Math.cos(car.a)*8;
        car.y-=Math.sin(car.a)*8;
      }
    });

    const cp=level.checkpoints[checkpointIndex];
    if(cp&&Math.hypot(cp.x-car.x,cp.y-car.y)<level.checkpointRadius){
      checkpointIndex++;
      if(checkpointIndex>=level.checkpoints.length){completeLevel();return;}
    }
    elapsed=(performance.now()-startTime)/1000;
    updateHud();
  }

  function updateHud() {
    levelEl.textContent=currentLevel+1;
    areaNameEl.textContent=level.name;
    difficultyEl.textContent=tr("cityDifficulty",{level:currentLevel+1});
    scoreEl.textContent=`${Math.min(checkpointIndex,level.checkpoints.length)}/${level.checkpoints.length}`;
    timeEl.textContent=`${elapsed.toFixed(1)}s`;
    const best=Number(progress.best[currentLevel]||0);
    bestEl.textContent=best?`${best.toFixed(1)}s`:"—";
    startBtn.textContent=tr("startRestart");
    nextBtn.textContent=tr("cityNext");
  }

  function drawRoadMarkings() {
    ctx.save();
    ctx.strokeStyle="rgba(255,255,255,.26)";
    ctx.lineWidth=2;
    ctx.setLineDash([13,12]);
    level.roads.forEach(r=>{
      ctx.beginPath();
      if(r.axis==="h"){ctx.moveTo(0,r.center);ctx.lineTo(W,r.center);}
      else{ctx.moveTo(r.center,0);ctx.lineTo(r.center,H);}
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawBuildings() {
    const p=level.palette;
    level.buildings.forEach((b,i)=>{
      ctx.fillStyle=i%2?p[2]:p[3];
      ctx.fillRect(b.x,b.y,b.w,b.h);
      ctx.fillStyle="rgba(255,255,255,.11)";
      for(let x=b.x+10;x<b.x+b.w-5;x+=20)
        for(let y=b.y+10;y<b.y+b.h-5;y+=22)ctx.fillRect(x,y,7,9);
    });
  }

  function drawSlowZones() {
    level.slowZones.forEach(z=>{
      ctx.save();
      ctx.strokeStyle="rgba(250,204,21,.55)";
      ctx.fillStyle="rgba(250,204,21,.08)";
      ctx.lineWidth=2;ctx.setLineDash([6,5]);
      ctx.beginPath();ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.restore();
    });
  }

  function draw() {
    const p=level.palette;
    ctx.fillStyle=p[0];ctx.fillRect(0,0,W,H);
    ctx.fillStyle=p[1];level.roads.forEach(r=>ctx.fillRect(r.x,r.y,r.w,r.h));
    drawRoadMarkings();drawBuildings();drawSlowZones();

    const cp=level.checkpoints[checkpointIndex];
    if(cp){
      const pulse=level.checkpointRadius+Math.sin(performance.now()/180)*4;
      ctx.strokeStyle=p[4];ctx.lineWidth=4;
      ctx.beginPath();ctx.arc(cp.x,cp.y,pulse,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle=p[4]+"2b";
      ctx.beginPath();ctx.arc(cp.x,cp.y,Math.max(8,pulse-5),0,Math.PI*2);ctx.fill();
    }

    traffic.forEach(v=>{
      ctx.save();ctx.translate(v.x,v.y);
      ctx.fillStyle=v.c;ctx.fillRect(-12,-7,24,14);
      ctx.fillStyle="rgba(255,255,255,.55)";
      if(v.axis==="h")ctx.fillRect(2,-5,7,10);else ctx.fillRect(-7,1,14,5);
      ctx.restore();
    });

    ctx.save();ctx.translate(car.x,car.y);ctx.rotate(car.a);
    ctx.fillStyle=p[4];ctx.fillRect(-15,-9,30,18);
    ctx.fillStyle="#eaf6ff";ctx.fillRect(0,-6,9,12);ctx.restore();

    ctx.fillStyle="rgba(4,8,18,.48)";ctx.fillRect(10,10,220,47);
    ctx.fillStyle="#fff";ctx.font="800 15px Nunito, sans-serif";ctx.textAlign="left";
    ctx.fillText(`${currentLevel+1}. ${level.name}`,20,29);
    ctx.fillStyle="rgba(255,255,255,.72)";ctx.font="700 11px Nunito, sans-serif";
    ctx.fillText(`${tr("checkpoint")}: ${Math.min(checkpointIndex,level.checkpoints.length)}/${level.checkpoints.length}`,20,45);

    if(completedCurrentRun){
      ctx.fillStyle="rgba(3,7,18,.66)";ctx.fillRect(0,0,W,H);
      ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 28px Nunito, sans-serif";
      ctx.fillText(currentLevel===29?tr("cityFinalComplete"):tr("cityLevelComplete"),W/2,H/2-18);
      ctx.font="700 15px Nunito, sans-serif";ctx.fillStyle="rgba(255,255,255,.82)";
      ctx.fillText(tr("cityLevelCompleteText",{level:currentLevel+1,time:elapsed.toFixed(1)}),W/2,H/2+14);
    }
  }

  function loop(now) {
    if(raf)cancelAnimationFrame(raf);
    const dt=Math.min(34,now-last||16);last=now;
    if(!paused)update(dt);
    draw();
    if(running||!paused)raf=requestAnimationFrame(loop);
  }

  function setMove(name,on=true){keys[name]=on;}

  function keydown(e){
    if(!dialog.open||activeGame!=="city")return false;
    const k=e.key.toLowerCase();
    const m={arrowleft:"left",a:"left",arrowright:"right",d:"right",arrowup:"up",w:"up",arrowdown:"down",s:"down"};
    if(!m[k])return false;
    e.preventDefault();setMove(m[k],true);return true;
  }

  function keyup(e){
    const k=e.key.toLowerCase();
    const m={arrowleft:"left",a:"left",arrowright:"right",d:"right",arrowup:"up",w:"up",arrowdown:"down",s:"down"};
    if(m[k])setMove(m[k],false);
  }

  startBtn.addEventListener("click",reset);
  nextBtn.addEventListener("click",()=>{
    if(currentLevel<29&&currentLevel+2<=progress.maxUnlocked){
      selectLevel(currentLevel+1);reset();
    }
  });

  document.querySelectorAll("[data-city-move]").forEach(btn=>{
    const d=btn.dataset.cityMove;
    btn.addEventListener("pointerdown",e=>{e.preventDefault();setMove(d,true);});
    ["pointerup","pointercancel","pointerleave"].forEach(evt=>btn.addEventListener(evt,()=>setMove(d,false)));
  });

  window.addEventListener("keyup",e=>{
    if(!dialog.open)return;
    keyup(e);
  },{capture:true});

  renderLevelButtons();updateHud();draw();

  return {
    keydown,
    pause(){
      paused=true;keys={};
      if(raf){cancelAnimationFrame(raf);raf=null;}
    },
    resume(){
      paused=false;last=performance.now();
      renderLevelButtons();updateHud();draw();
      if(running)loop(last);
    },
    applyLanguage(){
      renderLevelButtons();updateHud();draw();
    }
  };
})();
/* Global keyboard routing
 * Capture phase keeps Arrow / WASD controls active after clicking
 * game tabs, Start buttons, or touch controls.
 */
window.addEventListener("keydown", e => {
  if (!dialog.open) return;

  const target = e.target;
  const isTyping =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable;

  if (isTyping) return;

  activeModule?.keydown?.(e);
}, { capture: true });

/* Language integration */
function applyLanguage() {
  document.getElementById("gameHubTitle").textContent = UI[lang()].hubTitle;
  document.getElementById("gameHubSubtitle").textContent = UI[lang()].hubSubtitle;
  document.getElementById("crystalPickerText").textContent = tr("crystalPicker");
  document.getElementById("blocksPickerText").textContent = tr("blocksPicker");
  document.getElementById("mazePickerText").textContent = tr("mazePicker");
  document.getElementById("cityPickerText").textContent = tr("cityPicker");

  document.getElementById("levelSelectLabel").textContent = tr("selectLevel");
  document.getElementById("legendTitle").textContent = tr("legend");
  document.getElementById("legendGem").textContent = tr("gem");
  document.getElementById("legendPlayer").textContent = tr("player");
  document.getElementById("legendExit").textContent = tr("exit");
  document.getElementById("legendTrap").textContent = tr("trap");
  document.getElementById("legendKey").textContent = tr("key");
  document.getElementById("legendRock").textContent = tr("rock");
  document.getElementById("hudLevelLabel").textContent = tr("level");
  document.getElementById("hudGemLabel").textContent = tr("gem");
  document.getElementById("hudMoveLabel").textContent = tr("moves");
  document.getElementById("hudBestLabel").textContent = tr("best");
  document.getElementById("controlsTitle").textContent = tr("controls");
  document.getElementById("controlsText").textContent = tr("controlsText");

  document.getElementById("blockDescription").textContent = tr("blockDescription");
  document.getElementById("blockScoreLabel").textContent = tr("score");
  document.getElementById("blockLinesLabel").textContent = tr("lines");
  document.getElementById("blockLevelLabel").textContent = tr("blockLevel");
  document.getElementById("blockBestLabel").textContent = tr("best");
  document.getElementById("blockStartBtn").textContent = tr("startRestart");
  document.getElementById("blockHelp").textContent = tr("blockHelp");

  document.getElementById("mazeDescription").textContent = tr("mazeDescription");
  document.getElementById("mazeScoreLabel").textContent = tr("score");
  document.getElementById("mazeLivesLabel").textContent = tr("lives");
  document.getElementById("mazeDotsLabel").textContent = tr("dots");
  document.getElementById("mazeStartBtn").textContent = tr("startRestart");
  document.getElementById("mazeHelp").textContent = tr("mazeHelp");

  document.getElementById("cityDescription").textContent = tr("cityDescription");
  document.getElementById("cityAreaLabel").textContent = tr("cityArea");
  document.getElementById("cityLevelLabel").textContent = tr("level");
  document.getElementById("cityScoreLabel").textContent = tr("checkpoint");
  document.getElementById("cityTimeLabel").textContent = tr("time");
  document.getElementById("cityBestLabel").textContent = tr("best");
  document.getElementById("cityLevelSelectLabel").textContent = tr("cityChooseLevel");
  document.getElementById("cityStartBtn").textContent = tr("startRestart");
  document.getElementById("cityNextBtn").textContent = tr("cityNext");
  document.getElementById("cityHelp").textContent = tr("cityHelp");

  Object.values(modules).forEach(m => m?.applyLanguage?.());
}

const languageObserver = new MutationObserver(applyLanguage);
languageObserver.observe(document.documentElement, {attributes:true,attributeFilter:["lang"]});

activeModule = modules.crystal;
switchGame("crystal");
applyLanguage();

})();
