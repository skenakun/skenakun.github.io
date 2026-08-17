
(() => {
  "use strict";

  const LEVELS = [
    {
      names: { id: "Pemanasan", en: "Warm-up" },
      map: [
        "###########",
        "#P..G....E#",
        "#.........#",
        "#..###....#",
        "#.........#",
        "#....G....#",
        "#.........#",
        "#..G......#",
        "###########"
      ]
    },
    {
      names: { id: "Jalan Berbahaya", en: "Hazard Path" },
      map: [
        "###########",
        "#P.G...#E##",
        "#...^..#..#",
        "#..###.#..#",
        "#G.....#..#",
        "#.#####...#",
        "#....G....#",
        "#..^......#",
        "###########"
      ]
    },
    {
      names: { id: "Kunci Violet", en: "Violet Key" },
      map: [
        "###########",
        "#P.G..#E###",
        "#.....#D###",
        "#..K..#..##",
        "#.....#..##",
        "#G....#..##",
        "#.....#..##",
        "#..G.....##",
        "###########"
      ]
    },
    {
      names: { id: "Taman Duri", en: "Thorn Garden" },
      map: [
        "###########",
        "#P..G....E#",
        "#.^###.^..#",
        "#...G.....#",
        "###...###.#",
        "#.....G...#",
        "#.^.......#",
        "#....^....#",
        "###########"
      ]
    },
    {
      names: { id: "Batu Kristal", en: "Crystal Boulder" },
      map: [
        "###########",
        "#P.G......#",
        "#..B..#..E#",
        "#.....#...#",
        "#..G..#...#",
        "#.....#...#",
        "#.....#...#",
        "#..G......#",
        "###########"
      ]
    },
    {
      names: { id: "Gerbang Bulan", en: "Moon Gate" },
      map: [
        "###########",
        "#P..G.#E###",
        "#.^...#D###",
        "#..K..#..##",
        "#..###...##",
        "#G.....^.##",
        "#..###...##",
        "#....G...##",
        "###########"
      ]
    },
    {
      names: { id: "Lorong Misteri", en: "Mystery Passage" },
      map: [
        "###########",
        "#P.G...#E##",
        "#..B...#D##",
        "#......#..#",
        "#..G...#..#",
        "#..###.#..#",
        "#K....G...#",
        "#..^......#",
        "###########"
      ]
    },
    {
      names: { id: "Labirin Bintang", en: "Star Maze" },
      map: [
        "###########",
        "#P#G......#",
        "#.#.#####.#",
        "#.#.....#.#",
        "#.#.^G.#.E#",
        "#...##.#..#",
        "###....#..#",
        "#G..^.....#",
        "###########"
      ]
    },
    {
      names: { id: "Ruang Batu", en: "Boulder Chamber" },
      map: [
        "###########",
        "#P.G...#E##",
        "#..B...#D##",
        "#......#..#",
        "#..###.#..#",
        "#G.K...#..#",
        "#..B...#..#",
        "#....G....#",
        "###########"
      ]
    },
    {
      names: { id: "Mahkota Kristal", en: "Crystal Crown" },
      map: [
        "###########",
        "#P.G..#E###",
        "#.^...#D###",
        "#..B..#..##",
        "#G....#..##",
        "#..###...##",
        "#K..^..G.##",
        "#..B......#",
        "###########"
      ]
    }
  ];

  const TEXT = {
    id: {
      title: "Crystal Trail",
      subtitle: "Kumpulkan semua kristal, hindari jebakan, lalu temukan pintu keluar.",
      openTitle: "Buka Mini Game",
      closeTitle: "Tutup Mini Game",
      selectLevel: "Pilih Level",
      progress: "{open} / 10 terbuka",
      legend: "Petunjuk",
      gem: "Kristal",
      player: "Penjelajah",
      exit: "Pintu keluar",
      trap: "Jebakan",
      key: "Kunci",
      rock: "Batu dorong",
      hudLevel: "Level",
      hudGem: "Kristal",
      hudMove: "Langkah",
      hudBest: "Terbaik",
      goal: "Ambil semua kristal untuk membuka pintu keluar.",
      controls: "Kontrol",
      controlsText: "Keyboard: Arrow / WASD. Ponsel: gunakan tombol arah.",
      resetProgress: "Reset progres game",
      resetConfirm: "Reset semua progres Crystal Trail?",
      ready: "Level siap. Jangan terburu-buru.",
      lockedExit: "Pintu keluar masih terkunci. Ambil semua kristal.",
      needKey: "Gerbang terkunci. Cari kunci dahulu.",
      gotKey: "Kunci ditemukan. Gerbang sekarang bisa dilewati.",
      gotGem: "Kristal ditemukan.",
      pushedRock: "Batu berhasil didorong.",
      blockedRock: "Batu tidak bisa didorong ke arah itu.",
      trapHit: "Kena jebakan. Level diulang.",
      complete: "Level Selesai",
      completeText: "Selesai dalam {moves} langkah.",
      newBest: " Rekor baru!",
      replay: "Ulangi",
      next: "Level Berikutnya",
      finishTitle: "10 Level Selesai",
      finishText: "Semua level Crystal Trail sudah kamu selesaikan.",
      playAgain: "Main Lagi",
      lockedLevel: "Level ini belum terbuka.",
      resetDone: "Progres game direset."
    },
    en: {
      title: "Crystal Trail",
      subtitle: "Collect every crystal, avoid traps, then find the exit.",
      openTitle: "Open Mini Game",
      closeTitle: "Close Mini Game",
      selectLevel: "Choose Level",
      progress: "{open} / 10 unlocked",
      legend: "Guide",
      gem: "Crystal",
      player: "Explorer",
      exit: "Exit",
      trap: "Trap",
      key: "Key",
      rock: "Pushable boulder",
      hudLevel: "Level",
      hudGem: "Crystals",
      hudMove: "Moves",
      hudBest: "Best",
      goal: "Collect every crystal to unlock the exit.",
      controls: "Controls",
      controlsText: "Keyboard: Arrow / WASD. Mobile: use the direction buttons.",
      resetProgress: "Reset game progress",
      resetConfirm: "Reset all Crystal Trail progress?",
      ready: "Level ready. Take your time.",
      lockedExit: "The exit is still locked. Collect every crystal.",
      needKey: "The gate is locked. Find the key first.",
      gotKey: "Key found. The gate can now be crossed.",
      gotGem: "Crystal collected.",
      pushedRock: "Boulder pushed.",
      blockedRock: "The boulder cannot move that way.",
      trapHit: "You hit a trap. Restarting the level.",
      complete: "Level Complete",
      completeText: "Finished in {moves} moves.",
      newBest: " New best!",
      replay: "Replay",
      next: "Next Level",
      finishTitle: "All 10 Levels Complete",
      finishText: "You completed every Crystal Trail level.",
      playAgain: "Play Again",
      lockedLevel: "This level is still locked.",
      resetDone: "Game progress reset."
    }
  };

  const STORAGE_KEY = "crystalTrailProgressV1";

  const els = {
    button: document.getElementById("miniGameBtn"),
    dialog: document.getElementById("miniGameDialog"),
    close: document.getElementById("closeMiniGame"),
    title: document.getElementById("gameTitle"),
    subtitle: document.getElementById("gameSubtitle"),
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
    levelSelectLabel: document.getElementById("levelSelectLabel"),
    legendTitle: document.getElementById("legendTitle"),
    legendGem: document.getElementById("legendGem"),
    legendPlayer: document.getElementById("legendPlayer"),
    legendExit: document.getElementById("legendExit"),
    legendTrap: document.getElementById("legendTrap"),
    legendKey: document.getElementById("legendKey"),
    legendRock: document.getElementById("legendRock"),
    hudLevelLabel: document.getElementById("hudLevelLabel"),
    hudGemLabel: document.getElementById("hudGemLabel"),
    hudMoveLabel: document.getElementById("hudMoveLabel"),
    hudBestLabel: document.getElementById("hudBestLabel"),
    controlsTitle: document.getElementById("controlsTitle"),
    controlsText: document.getElementById("controlsText")
  };

  if (!els.button || !els.dialog || !els.board) return;

  let currentLevel = 0;
  let state = null;
  let resultOpen = false;
  let progress = loadProgress();

  function lang() {
    return document.documentElement.lang?.toLowerCase().startsWith("en") ? "en" : "id";
  }

  function tr(key, vars = {}) {
    let value = TEXT[lang()][key] ?? TEXT.id[key] ?? key;
    Object.entries(vars).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, String(replacement));
    });
    return value;
  }

  function loadProgress() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return {
        maxUnlocked: Math.min(10, Math.max(1, Number(parsed.maxUnlocked || 1))),
        completed: Array.isArray(parsed.completed) ? parsed.completed.filter(Boolean).slice(0, 10) : [],
        best: Array.isArray(parsed.best) ? parsed.best.slice(0, 10) : []
      };
    } catch {
      return { maxUnlocked: 1, completed: [], best: [] };
    }
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function posKey(r, c) {
    return `${r},${c}`;
  }

  function parseKey(key) {
    return key.split(",").map(Number);
  }

  function buildLevel(index) {
    const level = LEVELS[index];
    const gems = new Set();
    const boulders = new Set();
    let player = { r: 1, c: 1 };
    let keyPosition = null;

    level.map.forEach((row, r) => {
      [...row].forEach((tile, c) => {
        if (tile === "P") player = { r, c };
        if (tile === "G") gems.add(posKey(r, c));
        if (tile === "B") boulders.add(posKey(r, c));
        if (tile === "K") keyPosition = posKey(r, c);
      });
    });

    return {
      player,
      gems,
      totalGems: gems.size,
      boulders,
      hasKey: false,
      keyPosition,
      moves: 0,
      dead: false
    };
  }

  function setMessage(text, type = "") {
    els.message.textContent = text;
    els.message.className = `game-message${type ? ` ${type}` : ""}`;
  }

  function staticTileAt(r, c) {
    return LEVELS[currentLevel].map[r]?.[c] || "#";
  }

  function isBoulderAt(r, c) {
    return state.boulders.has(posKey(r, c));
  }

  function canBoulderMoveTo(r, c) {
    const tile = staticTileAt(r, c);
    if (tile === "#" || tile === "^" || tile === "D" || tile === "G" || tile === "K" || tile === "E") {
      return false;
    }
    return !isBoulderAt(r, c);
  }

  function renderLevelButtons() {
    els.levelGrid.innerHTML = "";

    LEVELS.forEach((_, index) => {
      const number = index + 1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "game-level-btn";
      button.textContent = number;

      const unlocked = number <= progress.maxUnlocked;
      button.disabled = !unlocked;

      if (index === currentLevel) button.classList.add("active");
      if (progress.completed[index]) button.classList.add("completed");

      button.title = unlocked
        ? `${tr("hudLevel")} ${number}`
        : tr("lockedLevel");

      button.addEventListener("click", () => {
        if (!unlocked) {
          setMessage(tr("lockedLevel"), "warning");
          return;
        }
        loadLevel(index);
      });

      els.levelGrid.appendChild(button);
    });

    els.progress.textContent = tr("progress", { open: progress.maxUnlocked });
  }

  function renderBoard() {
    const map = LEVELS[currentLevel].map;
    els.board.style.setProperty("--board-cols", map[0].length);
    els.board.innerHTML = "";

    const exitLocked = state.gems.size > 0;

    map.forEach((row, r) => {
      [...row].forEach((baseTile, c) => {
        const tile = document.createElement("div");
        tile.className = "game-tile";

        if (baseTile === "#") {
          tile.classList.add("tile-wall");
        } else {
          tile.classList.add("tile-floor");
        }

        const key = posKey(r, c);

        if (baseTile === "E") {
          tile.classList.add("tile-exit");
          if (exitLocked) tile.classList.add("exit-locked");
        }

        if (baseTile === "^") tile.classList.add("tile-trap");

        if (baseTile === "D") {
          tile.classList.add("tile-door");
          if (state.hasKey) tile.classList.add("door-open");
        }

        if (baseTile === "K" && !state.hasKey && state.keyPosition === key) {
          tile.classList.add("tile-key");
        }

        if (state.gems.has(key)) tile.classList.add("tile-gem");
        if (state.boulders.has(key)) tile.classList.add("tile-boulder");

        if (state.player.r === r && state.player.c === c) {
          tile.classList.add("tile-player");
        }

        els.board.appendChild(tile);
      });
    });

    const collected = state.totalGems - state.gems.size;
    els.levelValue.textContent = currentLevel + 1;
    els.gemValue.textContent = `${collected}/${state.totalGems}`;
    els.moveValue.textContent = state.moves;
    els.bestValue.textContent = progress.best[currentLevel] || "—";
    els.levelName.textContent = LEVELS[currentLevel].names[lang()];
    els.goal.textContent = tr("goal");
  }

  function loadLevel(index) {
    if (index + 1 > progress.maxUnlocked) {
      setMessage(tr("lockedLevel"), "warning");
      return;
    }

    currentLevel = index;
    state = buildLevel(index);
    resultOpen = false;
    els.result.hidden = true;
    setMessage(tr("ready"));
    renderLevelButtons();
    renderBoard();
  }

  function tryMove(dr, dc) {
    if (!state || resultOpen || state.dead) return;

    const nr = state.player.r + dr;
    const nc = state.player.c + dc;
    const baseTile = staticTileAt(nr, nc);

    if (baseTile === "#") return;

    if (baseTile === "D" && !state.hasKey) {
      setMessage(tr("needKey"), "warning");
      return;
    }

    if (isBoulderAt(nr, nc)) {
      const br = nr + dr;
      const bc = nc + dc;

      if (!canBoulderMoveTo(br, bc)) {
        setMessage(tr("blockedRock"), "warning");
        return;
      }

      state.boulders.delete(posKey(nr, nc));
      state.boulders.add(posKey(br, bc));
      setMessage(tr("pushedRock"));
    }

    state.player = { r: nr, c: nc };
    state.moves += 1;

    const currentKey = posKey(nr, nc);

    if (state.gems.has(currentKey)) {
      state.gems.delete(currentKey);
      setMessage(tr("gotGem"), "success");
    }

    if (baseTile === "K" && !state.hasKey) {
      state.hasKey = true;
      setMessage(tr("gotKey"), "success");
    }

    if (baseTile === "^") {
      state.dead = true;
      renderBoard();
      setMessage(tr("trapHit"), "danger");
      window.setTimeout(() => loadLevel(currentLevel), 520);
      return;
    }

    if (baseTile === "E") {
      if (state.gems.size > 0) {
        setMessage(tr("lockedExit"), "warning");
      } else {
        completeLevel();
        return;
      }
    }

    renderBoard();
  }

  function completeLevel() {
    resultOpen = true;

    const oldBest = Number(progress.best[currentLevel] || 0);
    const isNewBest = !oldBest || state.moves < oldBest;

    if (isNewBest) progress.best[currentLevel] = state.moves;
    progress.completed[currentLevel] = true;

    if (currentLevel < LEVELS.length - 1) {
      progress.maxUnlocked = Math.max(progress.maxUnlocked, currentLevel + 2);
    }

    saveProgress();
    renderLevelButtons();
    renderBoard();

    const isFinal = currentLevel === LEVELS.length - 1;

    els.resultTitle.textContent = isFinal ? tr("finishTitle") : tr("complete");

    if (isFinal) {
      els.resultText.textContent = tr("finishText");
      els.next.textContent = tr("playAgain");
    } else {
      els.resultText.textContent =
        tr("completeText", { moves: state.moves }) +
        (isNewBest ? tr("newBest") : "");
      els.next.textContent = tr("next");
    }

    els.replay.textContent = tr("replay");
    els.result.hidden = false;
    setMessage("", "success");
  }

  function applyLanguage() {
    els.title.textContent = tr("title");
    els.subtitle.textContent = tr("subtitle");
    els.button.title = tr("openTitle");
    els.button.setAttribute("aria-label", tr("openTitle"));
    els.close.setAttribute("aria-label", tr("closeTitle"));

    els.levelSelectLabel.textContent = tr("selectLevel");
    els.legendTitle.textContent = tr("legend");
    els.legendGem.textContent = tr("gem");
    els.legendPlayer.textContent = tr("player");
    els.legendExit.textContent = tr("exit");
    els.legendTrap.textContent = tr("trap");
    els.legendKey.textContent = tr("key");
    els.legendRock.textContent = tr("rock");

    els.hudLevelLabel.textContent = tr("hudLevel");
    els.hudGemLabel.textContent = tr("hudGem");
    els.hudMoveLabel.textContent = tr("hudMove");
    els.hudBestLabel.textContent = tr("hudBest");
    els.controlsTitle.textContent = tr("controls");
    els.controlsText.textContent = tr("controlsText");
    els.resetProgress.textContent = tr("resetProgress");

    if (state) {
      renderLevelButtons();
      renderBoard();

      if (resultOpen) {
        const isFinal = currentLevel === LEVELS.length - 1;
        els.resultTitle.textContent = isFinal ? tr("finishTitle") : tr("complete");
        els.replay.textContent = tr("replay");
        els.next.textContent = isFinal ? tr("playAgain") : tr("next");
      }
    }
  }

  function openGame() {
    if (!state) loadLevel(Math.min(progress.maxUnlocked - 1, LEVELS.length - 1));
    applyLanguage();
    els.dialog.showModal();
  }

  function closeGame() {
    if (els.dialog.open) els.dialog.close();
  }

  els.button.addEventListener("click", openGame);
  els.close.addEventListener("click", closeGame);

  els.dialog.addEventListener("click", (event) => {
    if (event.target === els.dialog) closeGame();
  });

  els.dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeGame();
  });

  document.querySelectorAll("[data-move]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.move;
      if (direction === "up") tryMove(-1, 0);
      if (direction === "down") tryMove(1, 0);
      if (direction === "left") tryMove(0, -1);
      if (direction === "right") tryMove(0, 1);
    });
  });

  els.resetLevel.addEventListener("click", () => loadLevel(currentLevel));
  els.replay.addEventListener("click", () => loadLevel(currentLevel));

  els.next.addEventListener("click", () => {
    if (currentLevel === LEVELS.length - 1) {
      loadLevel(0);
    } else {
      loadLevel(currentLevel + 1);
    }
  });

  els.resetProgress.addEventListener("click", () => {
    if (!window.confirm(tr("resetConfirm"))) return;

    progress = {
      maxUnlocked: 1,
      completed: [],
      best: []
    };

    saveProgress();
    loadLevel(0);
    setMessage(tr("resetDone"), "success");
  });

  document.addEventListener("keydown", (event) => {
    if (!els.dialog.open) return;

    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;

    const key = event.key.toLowerCase();
    const movements = {
      arrowup: [-1, 0],
      w: [-1, 0],
      arrowdown: [1, 0],
      s: [1, 0],
      arrowleft: [0, -1],
      a: [0, -1],
      arrowright: [0, 1],
      d: [0, 1]
    };

    if (movements[key]) {
      event.preventDefault();
      tryMove(...movements[key]);
    }

    if (key === "r") {
      event.preventDefault();
      loadLevel(currentLevel);
    }
  });

  const languageObserver = new MutationObserver(() => applyLanguage());
  languageObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"]
  });

  loadLevel(0);
  applyLanguage();
})();
