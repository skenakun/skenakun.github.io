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
    cityDescription: "Jelajahi kota dari atas, ambil checkpoint, dan selesaikan rute pengantaran.",
    checkpoint: "Checkpoint",
    time: "Waktu",
    cityHelp: "Arrow / WASD untuk mengemudi. Fokus pada eksplorasi dan checkpoint.",
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
    cityDescription: "Explore a top-down city, collect checkpoints, and complete the delivery route.",
    checkpoint: "Checkpoint",
    time: "Time",
    cityHelp: "Arrow keys / WASD to drive. Focus on exploration and checkpoints.",
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
  const canvas=document.getElementById("cityCanvas"),ctx=canvas.getContext("2d");
  const scoreEl=document.getElementById("cityScore"),timeEl=document.getElementById("cityTime"),bestEl=document.getElementById("cityBest");
  const startBtn=document.getElementById("cityStartBtn");
  const BEST="cityDriveBestV1";
  const W=760,H=560;
  const roads=[
    {x:0,y:90,w:760,h:80},{x:0,y:300,w:760,h:80},
    {x:120,y:0,w:85,h:560},{x:390,y:0,w:85,h:560},{x:625,y:0,w:80,h:560}
  ];
  const buildings=[
    {x:15,y:15,w:90,h:60},{x:220,y:15,w:150,h:60},{x:490,y:15,w:115,h:60},{x:715,y:15,w:35,h:60},
    {x:15,y:185,w:90,h:95},{x:220,y:185,w:150,h:95},{x:490,y:185,w:115,h:95},{x:715,y:185,w:35,h:95},
    {x:15,y:395,w:90,h:145},{x:220,y:395,w:150,h:145},{x:490,y:395,w:115,h:145},{x:715,y:395,w:35,h:145}
  ];
  const checkpointList=[{x:165,y:125},{x:430,y:125},{x:665,y:125},{x:665,y:340},{x:430,y:340},{x:165,y:340}];
  let car={x:165,y:125,a:0,s:0},keys={},running=false,paused=true,startTime=0,elapsed=0,index=0,raf=null,last=performance.now();

  function createTraffic() {
    return [
      {x:30,y:115,v:1.5,axis:"h",c:"#fb7185"},
      {x:720,y:335,v:-1.25,axis:"h",c:"#a78bfa"},
      {x:430,y:520,v:-1.15,axis:"v",c:"#34d399"},
      {x:665,y:20,v:1.05,axis:"v",c:"#facc15"}
    ];
  }

  let traffic=createTraffic();

  function reset(){
    car={x:165,y:125,a:0,s:0};
    keys={};
    index=0;
    running=true;
    paused=false;
    startTime=performance.now();
    elapsed=0;
    last=startTime;
    traffic=createTraffic();

    updateHud();
    draw();
    loop(last);
    focusGameHub();
  }

  function onRoad(x,y){
    return roads.some(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h);
  }

  function update(dt){
    if(!running||paused)return;
    const turn=0.0032*dt;
    if(keys.left)car.a-=turn;if(keys.right)car.a+=turn;
    if(keys.up)car.s=Math.min(3.4,car.s+0.012*dt);
    else if(keys.down)car.s=Math.max(-1.8,car.s-0.012*dt);
    else car.s*=Math.pow(.985,dt/16);

    let nx=car.x+Math.cos(car.a)*car.s*dt/16;
    let ny=car.y+Math.sin(car.a)*car.s*dt/16;
    if(onRoad(nx,ny)&&nx>8&&nx<W-8&&ny>8&&ny<H-8){car.x=nx;car.y=ny;}
    else car.s*=-.2;

    traffic.forEach(t=>{
      if(t.axis==="h"){t.x+=t.v*dt/16;if(t.x>W+30)t.x=-30;if(t.x<-30)t.x=W+30;}
      else {t.y+=t.v*dt/16;if(t.y>H+30)t.y=-30;if(t.y<-30)t.y=H+30;}
      if(Math.hypot(t.x-car.x,t.y-car.y)<22){car.s*=-.25;car.x-=Math.cos(car.a)*10;car.y-=Math.sin(car.a)*10;}
    });

    const cp=checkpointList[index];
    if(cp&&Math.hypot(cp.x-car.x,cp.y-car.y)<28){
      index++;
      if(index>=checkpointList.length){
        running=false;paused=true;elapsed=(performance.now()-startTime)/1000;
        const old=Number(localStorage.getItem(BEST)||0);
        if(!old||elapsed<old)localStorage.setItem(BEST,elapsed.toFixed(1));
      }
    }
    if(running)elapsed=(performance.now()-startTime)/1000;
    updateHud();
  }

  function updateHud(){
    scoreEl.textContent=`${Math.min(index,6)}/6`;
    timeEl.textContent=`${elapsed.toFixed(1)}s`;
    const best=localStorage.getItem(BEST);bestEl.textContent=best?`${best}s`:"—";
  }

  function draw(){
    ctx.fillStyle="#172033";ctx.fillRect(0,0,W,H);
    ctx.fillStyle="#2c3444";roads.forEach(r=>ctx.fillRect(r.x,r.y,r.w,r.h));
    ctx.strokeStyle="rgba(255,255,255,.28)";ctx.lineWidth=2;ctx.setLineDash([14,12]);
    [130,340].forEach(y=>{ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();});
    [162,432,665].forEach(x=>{ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();});
    ctx.setLineDash([]);

    buildings.forEach((b,i)=>{
      ctx.fillStyle=i%2?"#5b4b74":"#40536a";ctx.fillRect(b.x,b.y,b.w,b.h);
      ctx.fillStyle="rgba(255,255,255,.12)";
      for(let x=b.x+12;x<b.x+b.w-5;x+=22)for(let y=b.y+12;y<b.y+b.h-5;y+=24)ctx.fillRect(x,y,8,10);
    });

    const cp=checkpointList[index];
    if(cp){
      const pulse=18+Math.sin(performance.now()/180)*5;
      ctx.strokeStyle="#22d3ee";ctx.lineWidth=4;ctx.beginPath();ctx.arc(cp.x,cp.y,pulse,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle="rgba(34,211,238,.18)";ctx.beginPath();ctx.arc(cp.x,cp.y,pulse-4,0,Math.PI*2);ctx.fill();
    }

    traffic.forEach(t=>{
      ctx.save();ctx.translate(t.x,t.y);ctx.fillStyle=t.c;ctx.fillRect(-12,-7,24,14);ctx.restore();
    });

    ctx.save();ctx.translate(car.x,car.y);ctx.rotate(car.a);
    ctx.fillStyle="#60a5fa";ctx.fillRect(-15,-9,30,18);ctx.fillStyle="#dbeafe";ctx.fillRect(0,-6,9,12);ctx.restore();

    if(!running&&index>=6){
      ctx.fillStyle="rgba(3,7,18,.62)";ctx.fillRect(0,0,W,H);
      ctx.fillStyle="#fff";ctx.font="800 25px Nunito";ctx.textAlign="center";ctx.fillText(tr("cityDone"),W/2,H/2);
    }
  }

  function loop(now){
    if(raf)cancelAnimationFrame(raf);
    const dt=Math.min(34,now-last||16);last=now;
    if(!paused)update(dt);draw();raf=requestAnimationFrame(loop);
  }

  function setMove(name,on=true){
    keys[name]=on;
  }
  function keydown(e){
    if(!dialog.open||activeGame!=="city")return false;
    const k=e.key.toLowerCase();
    const m={arrowleft:"left",a:"left",arrowright:"right",d:"right",arrowup:"up",w:"up",arrowdown:"down",s:"down"};
    if(!m[k])return false;e.preventDefault();setMove(m[k],true);return true;
  }
  function keyup(e){
    const k=e.key.toLowerCase();
    const m={arrowleft:"left",a:"left",arrowright:"right",d:"right",arrowup:"up",w:"up",arrowdown:"down",s:"down"};
    if(m[k])setMove(m[k],false);
  }

  startBtn.addEventListener("click",reset);
  document.querySelectorAll("[data-city-move]").forEach(btn=>{
    const dir=btn.dataset.cityMove;
    btn.addEventListener("pointerdown",e=>{e.preventDefault();setMove(dir,true);});
    ["pointerup","pointercancel","pointerleave"].forEach(evt=>btn.addEventListener(evt,()=>setMove(dir,false)));
  });
  window.addEventListener("keyup", e => {
    if (!dialog.open) return;
    keyup(e);
  }, { capture: true });
  draw();updateHud();

  return {
    keydown,
    pause(){
      paused=true;
      keys={};
    },
    resume(){
      paused=false;
      last=performance.now();
      draw();

      if (running) {
        loop(last);
      }
    },
    applyLanguage(){
      draw();
      updateHud();
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
  document.getElementById("cityScoreLabel").textContent = tr("checkpoint");
  document.getElementById("cityTimeLabel").textContent = tr("time");
  document.getElementById("cityBestLabel").textContent = tr("best");
  document.getElementById("cityStartBtn").textContent = tr("startRestart");
  document.getElementById("cityHelp").textContent = tr("cityHelp");

  Object.values(modules).forEach(m => m?.applyLanguage?.());
}

const languageObserver = new MutationObserver(applyLanguage);
languageObserver.observe(document.documentElement, {attributes:true,attributeFilter:["lang"]});

activeModule = modules.crystal;
switchGame("crystal");
applyLanguage();

})();
