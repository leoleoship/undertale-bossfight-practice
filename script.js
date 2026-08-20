const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const roster = document.getElementById("bossRoster");
const bossName = document.getElementById("bossName");
const waveName = document.getElementById("waveName");
const timeLeft = document.getElementById("timeLeft");
const hpFill = document.getElementById("hpFill");
const hpText = document.getElementById("hpText");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const difficultyEl = document.getElementById("difficulty");
const commandPanel = document.getElementById("commandPanel");
const commandText = document.getElementById("commandText");
const turnInfo = document.getElementById("turnInfo");

const arena = { x: 250, y: 292, w: 460, h: 238 };
const maxHp = 92;
const pixel = 6;
const bossImagePaths = {
  undyne: "assets/bosses/undyne.png",
  asgore: "assets/bosses/asgore.png",
  disbelief: "assets/bosses/disbelief.png",
  btt: "assets/bosses/btt.png",
  sans: "assets/bosses/sans.png",
  undying: "assets/bosses/undying.png",
  omega: "assets/bosses/omega.png",
  asriel: "assets/bosses/asriel.png",
  mettaton: "assets/bosses/mettaton.png",
};
const bossImages = {};

const bosses = [
  {
    id: "undyne",
    name: "Undyne",
    icon: "U",
    color: "#57d6ff",
    note: "Spears, side pressure, fast dodges",
    waves: ["Spear Rain", "Cross Lances", "Cyclone Guard"],
    heartModes: ["green", "red", "green"],
    acts: ["Challenge", "Plead", "Fake Out"],
    items: [
      { name: "Crab Apple", heal: 18 },
      { name: "Cinnamon Bunny", heal: 22 },
      { name: "Astronaut Food", heal: 21 },
    ],
  },
  {
    id: "asgore",
    name: "Asgore",
    icon: "A",
    color: "#ffd166",
    note: "Fire rings, trident sweeps, heavy reads",
    waves: ["Fire Rings", "Trident Sweep", "Royal Furnace"],
    heartModes: ["red", "yellow", "red"],
    acts: ["Talk", "Remember", "Stand Firm"],
    items: [
      { name: "Butterscotch Pie", heal: 60 },
      { name: "Legendary Hero", heal: 40 },
      { name: "Instant Noodles", heal: 45 },
    ],
  },
  {
    id: "disbelief",
    name: "Disbelief Papyrus",
    icon: "P",
    color: "#ffffff",
    note: "Bones, blue stops, sudden lanes",
    waves: ["Bone Lanes", "Blue Patience", "Final Rattle"],
    heartModes: ["blue", "blue", "yellow"],
    acts: ["Joke", "Endure", "Believe"],
    items: [
      { name: "Spaghetti", heal: 20 },
      { name: "Snowman Piece", heal: 45 },
      { name: "Bisicle", heal: 22 },
    ],
  },
  {
    id: "btt",
    name: "Bad Time Trio",
    icon: "T",
    color: "#c77dff",
    note: "Mixed AU pressure and layered attacks",
    waves: ["Triple Trouble", "Blaster Net", "Last Corridor"],
    heartModes: ["red", "blue", "yellow"],
    acts: ["Analyze", "Dodge Prep", "Hold On"],
    items: [
      { name: "Face Steak", heal: 60 },
      { name: "Legendary Hero", heal: 40 },
      { name: "Snowman Piece", heal: 45 },
    ],
  },
  {
    id: "sans",
    name: "Sans",
    icon: "S",
    color: "#ffffff",
    note: "Bones, gravity, blaster lanes",
    waves: ["Bone Shuffle", "Gravity Drop", "Blaster Hall"],
    heartModes: ["blue", "blue", "yellow"],
    acts: ["Check", "Joke", "Stay Still"],
    items: [
      { name: "Hot Dog...?", heal: 20 },
      { name: "Face Steak", heal: 60 },
      { name: "Instant Noodles", heal: 45 },
    ],
  },
  {
    id: "undying",
    name: "Undyne the Undying",
    icon: "U",
    color: "#80ed99",
    note: "Dense spears and green-heart guards",
    waves: ["Heroic Spears", "Undying Guard", "Final Salvo"],
    heartModes: ["green", "green", "red"],
    acts: ["Challenge", "Refuse", "Hold Ground"],
    items: [
      { name: "Sea Tea", heal: 10 },
      { name: "Cinnamon Bunny", heal: 22 },
      { name: "Snowman Piece", heal: 45 },
    ],
  },
  {
    id: "omega",
    name: "Omega Flowey",
    icon: "F",
    color: "#ff7a1a",
    note: "Petals, vines, screen pressure",
    waves: ["Petal Burst", "Vine Cage", "Soul Storm"],
    heartModes: ["yellow", "red", "yellow"],
    acts: ["Call", "Resist", "Save"],
    items: [
      { name: "Junk Food", heal: 17 },
      { name: "Steak in the Shape of Mettaton's Face", heal: 60 },
      { name: "Instant Noodles", heal: 45 },
    ],
  },
  {
    id: "asriel",
    name: "Asriel",
    icon: "A",
    color: "#c77dff",
    note: "Stars, arcs, rainbow pressure",
    waves: ["Starfall", "Chaos Saber", "Hope Break"],
    heartModes: ["red", "yellow", "blue"],
    acts: ["Hope", "Dream", "Save"],
    items: [
      { name: "Dream", heal: 35 },
      { name: "Last Dream", heal: 70 },
      { name: "Legendary Hero", heal: 40 },
    ],
  },
  {
    id: "mettaton",
    name: "Mettaton",
    icon: "M",
    color: "#ff8bd1",
    note: "Drama beams, bombs, yellow shots",
    waves: ["Spotlight", "Leg Day", "Ratings Rush"],
    heartModes: ["yellow", "yellow", "red"],
    acts: ["Pose", "Boast", "Heel Turn"],
    items: [
      { name: "Glamburger", heal: 27 },
      { name: "Legendary Hero", heal: 40 },
      { name: "Face Steak", heal: 60 },
    ],
  },
];

const heartColors = {
  red: "#ff3855",
  blue: "#4ea1ff",
  green: "#80ed99",
  yellow: "#ffd166",
};

const difficulty = {
  normal: { damage: 5, rate: 0.62, speed: 0.82, cap: 24 },
  hard: { damage: 8, rate: 0.9, speed: 1 },
  insane: { damage: 11, rate: 1.15, speed: 1.12 },
};

let selectedBoss = bosses[0];
let difficultyKey = "normal";
let state = makeState();
let keys = new Set();
let lastTime = performance.now();
let music = {
  ctx: null,
  gain: null,
  playing: false,
  currentBoss: null,
  nextTime: 0,
  step: 0,
};

const chipTunes = {
  undyne: {
    bpm: 172,
    lead: [659, 740, 784, 740, 659, 587, 659, 880, 784, 740, 659, 587, 523, 587, 659, 740],
    bass: [165, 165, 196, 196, 147, 147, 196, 196],
  },
  asgore: {
    bpm: 136,
    lead: [392, 440, 523, 587, 659, 587, 523, 440, 349, 392, 440, 523, 587, 523, 440, 392],
    bass: [98, 131, 147, 131, 87, 117, 131, 117],
  },
  disbelief: {
    bpm: 188,
    lead: [523, 0, 523, 587, 622, 587, 523, 392, 466, 0, 466, 523, 587, 523, 466, 392],
    bass: [131, 131, 117, 117, 98, 98, 117, 117],
  },
  btt: {
    bpm: 198,
    lead: [784, 740, 659, 587, 659, 740, 784, 988, 880, 784, 740, 659, 587, 659, 740, 784],
    bass: [196, 147, 165, 196, 220, 165, 147, 196],
  },
  sans: {
    bpm: 184,
    lead: [392, 392, 587, 523, 0, 392, 349, 330, 294, 294, 440, 392, 0, 330, 349, 392],
    bass: [98, 98, 147, 147, 87, 87, 131, 131],
  },
  undying: {
    bpm: 204,
    lead: [740, 784, 880, 988, 880, 784, 740, 659, 784, 880, 988, 1175, 988, 880, 784, 740],
    bass: [185, 185, 220, 220, 247, 247, 220, 220],
  },
  omega: {
    bpm: 152,
    lead: [523, 659, 622, 523, 466, 523, 622, 659, 698, 659, 622, 523, 466, 392, 466, 523],
    bass: [131, 117, 98, 87, 131, 117, 98, 87],
  },
  asriel: {
    bpm: 168,
    lead: [659, 784, 988, 880, 784, 659, 587, 659, 740, 880, 1175, 988, 880, 740, 659, 587],
    bass: [165, 196, 247, 220, 165, 196, 247, 220],
  },
  mettaton: {
    bpm: 176,
    lead: [880, 0, 880, 988, 1047, 988, 880, 784, 740, 0, 740, 880, 988, 880, 740, 659],
    bass: [220, 220, 196, 196, 165, 165, 196, 196],
  },
};

const bossSprites = {
  undyne: [
    "....BBBB....",
    "...BCCCB...",
    "..BCCCCCB..",
    "..BCCWCCB..",
    "...BYYB....",
    "..BYYYYB...",
    ".BYYBBYYB..",
    "BYYB..BYYB.",
    "...BSSB....",
    "..BSSSSB...",
    ".BB....BB..",
  ],
  asgore: [
    "..GG....GG..",
    ".GYG....GYG.",
    ".GYYYYYYYYG.",
    "..GWWYYWWG..",
    "...GYYYYG...",
    "..RYYYYYYR..",
    ".RRYRRYYRR..",
    "RR.RYYYYR.R.",
    "...GSSSSG...",
    "..GSS..SSG..",
    ".GG......GG.",
  ],
  disbelief: [
    "...WWWWWW...",
    "..WKKWWKKW..",
    "..WWWWWWWW..",
    "...WMMMMW...",
    "....WBBW....",
    "..WWBBBBWW..",
    ".WBBWWWWBBW.",
    "WBB.WBBW.BBW",
    "...WBBBBW...",
    "..WW....WW..",
    ".WW......WW.",
  ],
  btt: [
    "WWWW..BBBB..GGGG",
    "WKKW.BCCCCB.GYYG",
    "WWWW.BCWWCB.GWWG",
    ".WW...BYYB...GG.",
    "BBBB.BYYYYB.RRRR",
    "BWWB.BYBBYB.RYYR",
    "BBBB.BYYYYB.RRRR",
    ".BB...BSSB...GG.",
    "BBBB.BSSSSB.GSSG",
  ],
  sans: [
    "...WWWWWW...",
    "..WKKWWKKW..",
    "..WWWWWWWW..",
    "...WKKKKW...",
    "....WWWW....",
    "..BBBBBBBB..",
    ".BBWBWWBWB.",
    "BBBBBBBBBBBB",
    "..BB....BB..",
    ".WW......WW.",
  ],
  undying: [
    "....GGGG....",
    "...GBBBG...",
    "..GBBBBGG..",
    "..GBBWGBG..",
    "...GYYG....",
    "..GYYYYG...",
    ".GYYGGYYG..",
    "GYYG..GYYG.",
    "..GSSSSG...",
    ".GGSGGSGG..",
    "GGG....GGG.",
  ],
  omega: [
    "....OOOO....",
    "..OOYYYYOO..",
    ".OYGGYYGGYO.",
    "OYGYKKKKYGYO",
    "OYGYKMMKYGYO",
    ".OYGGYYGGYO.",
    "..OOYYYYOO..",
    ".G..OOOO..G.",
    "GGG..YY..GGG",
    ".G..YYYY..G.",
  ],
  asriel: [
    "W..W....W..W",
    ".W.WWWWWW.W.",
    "..WPPWWPPW..",
    "..WWWWWWWW..",
    "...WYYYYW...",
    "..PPYYYYPP..",
    ".PPWPPPPWPP.",
    "PPW.WYYW.WPP",
    "...WSSSSW...",
    "..WW....WW..",
  ],
  mettaton: [
    "...PPPPPP...",
    "..PWWPPWWP..",
    "..PPPPPPPP..",
    "...PKKKKP...",
    "..PPMMMMPP..",
    ".PMPPPPPMP.",
    "PPM.PPPP.MPP",
    "...PYYYYP...",
    "..PY....YP..",
    ".PP......PP.",
  ],
};

const spriteColors = {
  ".": null,
  B: "#57d6ff",
  C: "#2f8de4",
  W: "#ffffff",
  Y: "#ffd166",
  S: "#8a8f99",
  G: "#f6d28a",
  R: "#d94f45",
  K: "#111118",
  M: "#ff3855",
  O: "#ff7a1a",
  P: "#ff8bd1",
};

function makeState() {
  return {
    running: false,
    phase: "ready",
    over: false,
    won: false,
    hp: maxHp,
    t: 0,
    waveT: 0,
    wave: 0,
    turn: 1,
    mercy: 0,
    pressure: 1,
    enemyTurnLength: 12,
    heartMode: "red",
    message: "Choose an action.",
    itemIndex: 0,
    shotTimer: 0,
    player: {
      x: arena.x + arena.w / 2,
      y: arena.y + arena.h / 2,
      r: 8,
      inv: 0,
      vy: 0,
      grounded: false,
      shieldDir: "up",
    },
    bullets: [],
    shots: [],
    effects: [],
    spawnTimers: {},
  };
}

function selectBoss(boss) {
  selectedBoss = boss;
  bossName.textContent = boss.name;
  loadBossImage(boss.id);
  if (music.playing) restartMusicForBoss();
  resetGame(false);
  renderRoster();
}

function renderRoster() {
  roster.innerHTML = "";
  for (const boss of bosses) {
    const card = document.createElement("button");
    card.className = `boss-card${boss.id === selectedBoss.id ? " active" : ""}`;
    card.innerHTML = `
      <div class="boss-icon" style="color:${boss.color}">${boss.icon}</div>
      <div>
        <h2>${boss.name}</h2>
        <span>${boss.note}</span>
      </div>
    `;
    card.addEventListener("click", () => selectBoss(boss));
    roster.append(card);
  }
}

function loadBossImage(id) {
  if (bossImages[id] || !bossImagePaths[id]) return;
  const image = new Image();
  image.onload = () => {
    bossImages[id] = { image, ok: true };
  };
  image.onerror = () => {
    bossImages[id] = { image: null, ok: false };
  };
  bossImages[id] = { image, ok: false };
  image.src = bossImagePaths[id];
}

function resetGame(autoStart = true) {
  state = makeState();
  state.running = autoStart;
  state.phase = autoStart ? "menu" : "ready";
  state.heartMode = selectedBoss.heartModes[0];
  waveName.textContent = selectedBoss.waves[0];
  timeLeft.textContent = "MENU";
  syncHp();
  syncTurnUi();
  if (autoStart && music.ctx) {
    restartMusicForBoss();
    startMusic();
  }
}

function syncHp() {
  hpFill.style.width = `${Math.max(0, state.hp / maxHp) * 100}%`;
  hpText.textContent = `${Math.max(0, Math.ceil(state.hp))} / ${maxHp}`;
}

function syncTurnUi() {
  turnInfo.textContent = `${state.turn} / ${titleCase(state.heartMode)}`;
  commandText.textContent = state.message;
  commandPanel.classList.toggle("disabled", state.phase !== "menu");
  commandPanel.querySelectorAll("button").forEach((button) => {
    button.disabled = state.phase !== "menu" || state.over || !state.running;
  });
}

function spawn(kind, data) {
  const cap = difficulty[difficultyKey].cap || (difficultyKey === "hard" ? 34 : 46);
  if (state.bullets.length >= cap && kind !== "beam" && kind !== "vine") return;
  state.bullets.push({ kind, age: 0, hit: false, ...data });
}

function every(key, interval, dt) {
  state.spawnTimers[key] = (state.spawnTimers[key] || 0) - dt;
  if (state.spawnTimers[key] <= 0) {
    state.spawnTimers[key] += interval / (difficulty[difficultyKey].rate * state.pressure);
    return true;
  }
  return false;
}

function startEnemyTurn(message, pressure = 1) {
  state.phase = "enemy";
  state.message = message;
  state.pressure = pressure;
  state.waveT = 0;
  state.bullets = [];
  state.shots = [];
  state.spawnTimers = {};
  state.wave = (state.turn - 1) % selectedBoss.waves.length;
  state.heartMode = selectedBoss.heartModes[state.wave];
  state.player.x = arena.x + arena.w / 2;
  state.player.y = state.heartMode === "blue" ? arena.y + arena.h - state.player.r : arena.y + arena.h / 2;
  state.player.vy = 0;
  state.player.grounded = state.heartMode === "blue";
  waveName.textContent = selectedBoss.waves[state.wave];
  syncTurnUi();
}

function endEnemyTurn() {
  state.phase = "menu";
  state.turn++;
  state.waveT = 0;
  state.bullets = [];
  state.shots = [];
  state.spawnTimers = {};
  state.message = `Turn ${state.turn}. Mercy: ${Math.min(100, state.mercy)}%.`;
  syncTurnUi();
}

function chooseCommand(command) {
  if (!state.running || state.phase !== "menu" || state.over) return;
  if (command === "fight") {
    state.mercy = clamp(state.mercy + 18, 0, 100);
    startEnemyTurn(`You attack. ${selectedBoss.name} gets serious.`, 1.14);
  }
  if (command === "act") {
    const act = selectedBoss.acts[(state.turn - 1) % selectedBoss.acts.length];
    state.mercy = clamp(state.mercy + 24, 0, 100);
    startEnemyTurn(`${act}. ${selectedBoss.name} hesitates.`, 0.88);
  }
  if (command === "item") {
    const item = selectedBoss.items[state.itemIndex % selectedBoss.items.length];
    state.itemIndex++;
    state.hp = clamp(state.hp + item.heal, 0, maxHp);
    state.mercy = clamp(state.mercy + 8, 0, 100);
    syncHp();
    startEnemyTurn(`You used ${item.name}. +${item.heal} HP.`, 1);
  }
  if (command === "spare") {
    if (state.mercy >= 100 || state.turn >= 6) {
      state.over = true;
      state.won = true;
      state.running = false;
      state.message = "You spared the boss.";
      stopMusic();
      syncTurnUi();
      return;
    }
    state.mercy = clamp(state.mercy + 12, 0, 100);
    startEnemyTurn("Not enough mercy yet.", 1.05);
  }
}

function firePlayerShot() {
  if (state.shotTimer > 0 || state.phase !== "enemy") return;
  state.shotTimer = 0.22;
  state.shots.push({ x: state.player.x, y: state.player.y - 22, vy: -420, hit: false });
}

function updateShots(dt) {
  for (const shot of state.shots) {
    shot.y += shot.vy * dt;
    for (const b of state.bullets) {
      if (b.kind === "beam" || b.kind === "vine" || shot.hit) continue;
      if (Math.hypot(shot.x - b.x, shot.y - b.y) < (b.r || 18) + 5) {
        b.y = arena.y - 200;
        shot.hit = true;
        state.mercy = clamp(state.mercy + 1, 0, 100);
      }
    }
  }
}

function update(dt) {
  if (!state.running || state.over) return;
  const d = difficulty[difficultyKey];
  state.t += dt;
  state.player.inv = Math.max(0, state.player.inv - dt);

  if (state.phase === "menu") {
    timeLeft.textContent = "MENU";
    syncTurnUi();
    return;
  }

  state.waveT += dt;
  state.shotTimer = Math.max(0, state.shotTimer - dt);

  if (state.waveT >= state.enemyTurnLength) {
    endEnemyTurn();
    return;
  }

  movePlayer(dt);
  updateShots(dt);
  runPattern(dt);

  for (const b of state.bullets) {
    b.age += dt;
    b.x += (b.vx || 0) * dt * d.speed * state.pressure;
    b.y += (b.vy || 0) * dt * d.speed * state.pressure;
    if (b.spin) b.angle = (b.angle || 0) + b.spin * dt;
    if (touching(b) && state.player.inv <= 0) {
      state.hp -= d.damage;
      state.player.inv = 1.0;
      state.effects.push({ x: state.player.x, y: state.player.y, age: 0 });
      syncHp();
      if (state.hp <= 0) {
        state.over = true;
        state.running = false;
        stopMusic();
      }
    }
  }

  state.effects.forEach((e) => (e.age += dt));
  state.effects = state.effects.filter((e) => e.age < 0.45);
  state.bullets = state.bullets.filter((b) => !outside(b));
  state.shots = state.shots.filter((s) => s.y > arena.y - 70 && !s.hit);
  timeLeft.textContent = Math.max(0, state.enemyTurnLength - state.waveT).toFixed(1);
  syncTurnUi();
}

function movePlayer(dt) {
  const slow = keys.has("Shift") ? 0.45 : 1;
  const speed = (state.heartMode === "green" ? 150 : 245) * slow;
  const p = state.player;
  let dx = 0;
  let dy = 0;
  if (keys.has("ArrowLeft") || keys.has("a")) dx -= 1;
  if (keys.has("ArrowRight") || keys.has("d")) dx += 1;
  if (keys.has("ArrowUp") || keys.has("w")) dy -= 1;
  if (keys.has("ArrowDown") || keys.has("s")) dy += 1;

  if (state.heartMode === "green") {
    if (Math.abs(dx) > Math.abs(dy)) p.shieldDir = dx < 0 ? "left" : "right";
    else if (dy !== 0) p.shieldDir = dy < 0 ? "up" : "down";
  }

  if (state.heartMode === "blue") {
    p.x = clamp(p.x + dx * speed * dt, arena.x + p.r, arena.x + arena.w - p.r);
    p.vy += 760 * dt;
    if (dy < 0 && p.grounded) {
      p.vy = -365;
      p.grounded = false;
    }
    p.y += p.vy * dt;
    if (p.y >= arena.y + arena.h - p.r) {
      p.y = arena.y + arena.h - p.r;
      p.vy = 0;
      p.grounded = true;
    }
    p.y = clamp(p.y, arena.y + p.r, arena.y + arena.h - p.r);
    return;
  }

  if (state.heartMode === "yellow" && (keys.has(" ") || keys.has("Space"))) firePlayerShot();

  const len = Math.hypot(dx, dy) || 1;
  p.x = clamp(p.x + (dx / len) * speed * dt, arena.x + p.r, arena.x + arena.w - p.r);
  p.y = clamp(p.y + (dy / len) * speed * dt, arena.y + p.r, arena.y + arena.h - p.r);
  p.vy = 0;
  p.grounded = false;
}

function runPattern(dt) {
  if (selectedBoss.id === "undyne") undynePattern(dt);
  if (selectedBoss.id === "asgore") asgorePattern(dt);
  if (selectedBoss.id === "disbelief") disbeliefPattern(dt);
  if (selectedBoss.id === "btt") bttPattern(dt);
  if (selectedBoss.id === "sans") sansPattern(dt);
  if (selectedBoss.id === "undying") undyingPattern(dt);
  if (selectedBoss.id === "omega") omegaPattern(dt);
  if (selectedBoss.id === "asriel") asrielPattern(dt);
  if (selectedBoss.id === "mettaton") mettatonPattern(dt);
}

function undynePattern(dt) {
  if (state.wave === 0 && every("spear-rain", 0.28, dt)) {
    const lane = Math.floor(rand(0, 4));
    const x = lane === 0 ? arena.x - 36 : lane === 1 ? arena.x + arena.w + 36 : rand(arena.x, arena.x + arena.w);
    const y = lane === 2 ? arena.y - 36 : lane === 3 ? arena.y + arena.h + 36 : rand(arena.y, arena.y + arena.h);
    const a = Math.atan2(state.player.y - y, state.player.x - x);
    spawn("spear", { x, y, vx: Math.cos(a) * 245, vy: Math.sin(a) * 245, r: 13, angle: a });
  }
  if (state.wave === 1 && every("cross-lances", 0.42, dt)) {
    const fromLeft = Math.random() > 0.5;
    spawn("spear", { x: fromLeft ? arena.x - 35 : arena.x + arena.w + 35, y: rand(arena.y + 20, arena.y + arena.h - 20), vx: fromLeft ? 330 : -330, vy: 0, r: 13, angle: fromLeft ? 0 : Math.PI });
    spawn("spear", { x: rand(arena.x + 20, arena.x + arena.w - 20), y: arena.y - 35, vx: 0, vy: 285, r: 13, angle: Math.PI / 2 });
  }
  if (state.wave === 2 && every("cyclone", 0.18, dt)) {
    const angle = state.t * 3.2;
    const x = arena.x + arena.w / 2 + Math.cos(angle) * 230;
    const y = arena.y + arena.h / 2 + Math.sin(angle) * 165;
    const toward = Math.atan2(state.player.y - y, state.player.x - x);
    spawn("spear", { x, y, vx: Math.cos(toward) * 220, vy: Math.sin(toward) * 220, r: 12, angle: toward });
  }
}

function asgorePattern(dt) {
  if (every("embers", 0.22, dt)) {
    const side = Math.random() > 0.5 ? -1 : 1;
    spawn("fire", { x: arena.x + arena.w / 2 + side * 245, y: rand(arena.y, arena.y + arena.h), vx: -side * rand(160, 230), vy: Math.sin(state.t * 2) * 45, r: rand(9, 15) });
  }
  if (state.wave >= 1 && every("sweep", 1.5, dt)) {
    const y = rand(arena.y + 34, arena.y + arena.h - 34);
    spawn("trident", { x: arena.x - 60, y, vx: 380, vy: 0, r: 22, angle: 0 });
  }
  if (state.wave === 2 && every("ring", 1.1, dt)) {
    for (let i = 0; i < 18; i++) {
      const a = (Math.PI * 2 * i) / 18 + state.t;
      spawn("fire", { x: arena.x + arena.w / 2, y: arena.y + arena.h / 2, vx: Math.cos(a) * 145, vy: Math.sin(a) * 145, r: 8 });
    }
  }
}

function disbeliefPattern(dt) {
  if (every("bones", state.wave === 0 ? 0.32 : 0.22, dt)) {
    const gap = rand(arena.y + 70, arena.y + arena.h - 70);
    const fromLeft = Math.random() > 0.5;
    spawn("bone", { x: fromLeft ? arena.x - 30 : arena.x + arena.w + 30, y: gap - 72, vx: fromLeft ? 235 : -235, vy: 0, r: 16, h: 86 });
    spawn("bone", { x: fromLeft ? arena.x - 30 : arena.x + arena.w + 30, y: gap + 72, vx: fromLeft ? 235 : -235, vy: 0, r: 16, h: 86 });
  }
  if (state.wave >= 1 && every("blue", 0.85, dt)) {
    spawn("blueBone", { x: rand(arena.x + 15, arena.x + arena.w - 15), y: arena.y - 28, vx: 0, vy: 230, r: 14, h: 58 });
  }
  if (state.wave === 2 && every("slam", 1.2, dt)) {
    for (let i = 0; i < 7; i++) {
      spawn("bone", { x: arena.x + i * 74, y: arena.y + arena.h + 34, vx: 0, vy: -250, r: 13, h: 74 });
    }
  }
}

function bttPattern(dt) {
  undynePattern(dt);
  if (every("small-fire", 0.55, dt)) {
    const side = Math.floor(rand(0, 4));
    const x = side === 0 ? arena.x - 20 : side === 1 ? arena.x + arena.w + 20 : rand(arena.x, arena.x + arena.w);
    const y = side === 2 ? arena.y - 20 : side === 3 ? arena.y + arena.h + 20 : rand(arena.y, arena.y + arena.h);
    const a = Math.atan2(state.player.y - y, state.player.x - x);
    spawn("fire", { x, y, vx: Math.cos(a) * 185, vy: Math.sin(a) * 185, r: 9 });
  }
  if (state.wave >= 1) spawnBlasterLine("blaster", 1.35, dt, 0.5);
  if (state.wave === 2 && every("btt-bones", 0.52, dt)) {
    const x = rand(arena.x + 20, arena.x + arena.w - 20);
    spawn("blueBone", { x, y: arena.y - 34, vx: 0, vy: 270, r: 15, h: 70 });
  }
}

function spawnBlasterLine(key, interval, dt, biasHorizontal = 0.5) {
  if (!every(key, interval, dt)) return;
  spawnBlaster(biasHorizontal);
}

function spawnBlaster(biasHorizontal = 0.5) {
  const horizontal = Math.random() < biasHorizontal;
  spawn("beam", {
    x: horizontal ? arena.x : rand(arena.x + 30, arena.x + arena.w - 30),
    y: horizontal ? rand(arena.y + 30, arena.y + arena.h - 30) : arena.y,
    vx: 0,
    vy: 0,
    r: 24,
    horizontal,
    warn: 0.5,
    life: 1.0,
  });
}

function sansPattern(dt) {
  if (every("sans-bones", state.wave === 0 ? 0.26 : 0.2, dt)) {
    const h = rand(54, 116);
    spawn("bone", { x: arena.x + arena.w + 28, y: arena.y + arena.h - h / 2, vx: -260, vy: 0, r: 14, h });
    if (state.wave === 0 && Math.random() > 0.55) {
      spawn("bone", { x: arena.x - 28, y: arena.y + h / 2, vx: 260, vy: 0, r: 14, h: h * 0.8 });
    }
  }
  if (state.wave >= 1 && every("sans-blue", 0.7, dt)) {
    spawn("blueBone", { x: rand(arena.x + 20, arena.x + arena.w - 20), y: arena.y - 34, vx: 0, vy: 255, r: 14, h: 70 });
  }
  if (state.wave === 2 && every("sans-beam", 1.05, dt)) {
    spawnBlaster(0.65);
  }
}

function undyingPattern(dt) {
  if (every("undying-aimed", 0.22, dt)) {
    const edge = Math.floor(rand(0, 4));
    const x = edge === 0 ? arena.x - 36 : edge === 1 ? arena.x + arena.w + 36 : rand(arena.x, arena.x + arena.w);
    const y = edge === 2 ? arena.y - 36 : edge === 3 ? arena.y + arena.h + 36 : rand(arena.y, arena.y + arena.h);
    const a = Math.atan2(state.player.y - y, state.player.x - x);
    spawn("spear", { x, y, vx: Math.cos(a) * 275, vy: Math.sin(a) * 275, r: 12, angle: a });
  }
  if (state.wave >= 1 && every("undying-cross", 0.46, dt)) {
    spawn("spear", { x: rand(arena.x, arena.x + arena.w), y: arena.y - 35, vx: 0, vy: 325, r: 12, angle: Math.PI / 2 });
    spawn("spear", { x: arena.x - 35, y: rand(arena.y, arena.y + arena.h), vx: 335, vy: 0, r: 12, angle: 0 });
  }
}

function omegaPattern(dt) {
  if (every("omega-petal", 0.18, dt)) {
    const a = state.t * 4 + rand(-0.7, 0.7);
    const x = arena.x + arena.w / 2 + Math.cos(a) * 245;
    const y = arena.y + arena.h / 2 + Math.sin(a) * 180;
    const toward = Math.atan2(state.player.y - y, state.player.x - x);
    spawn("petal", { x, y, vx: Math.cos(toward) * 190, vy: Math.sin(toward) * 190, r: 12, angle: toward, spin: 2.2 });
  }
  if (state.wave >= 1 && every("omega-vine", 1.0, dt)) {
    const horizontal = Math.random() > 0.5;
    spawn("vine", {
      x: horizontal ? arena.x : rand(arena.x + 20, arena.x + arena.w - 20),
      y: horizontal ? rand(arena.y + 20, arena.y + arena.h - 20) : arena.y,
      vx: 0,
      vy: 0,
      r: 24,
      horizontal,
      warn: 0.62,
      life: 1.18,
    });
  }
  if (state.wave === 2 && every("omega-ring", 1.2, dt)) {
    for (let i = 0; i < 14; i++) {
      const a = (Math.PI * 2 * i) / 14 + state.t;
      spawn("petal", { x: arena.x + arena.w / 2, y: arena.y + arena.h / 2, vx: Math.cos(a) * 155, vy: Math.sin(a) * 155, r: 9, angle: a, spin: -2.5 });
    }
  }
}

function asrielPattern(dt) {
  if (every("asriel-starfall", 0.2, dt)) {
    spawn("star", { x: rand(arena.x, arena.x + arena.w), y: arena.y - 24, vx: rand(-55, 55), vy: rand(190, 275), r: 12, spin: 3.2 });
  }
  if (state.wave >= 1 && every("asriel-saber", 0.95, dt)) {
    const fromLeft = Math.random() > 0.5;
    spawn("saber", { x: fromLeft ? arena.x - 58 : arena.x + arena.w + 58, y: rand(arena.y + 30, arena.y + arena.h - 30), vx: fromLeft ? 410 : -410, vy: 0, r: 22, angle: fromLeft ? 0 : Math.PI });
  }
  if (state.wave === 2 && every("asriel-hope", 1.15, dt)) {
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 * i) / 10 - state.t;
      spawn("star", { x: arena.x + arena.w / 2, y: arena.y + arena.h / 2, vx: Math.cos(a) * 170, vy: Math.sin(a) * 170, r: 10, spin: -4 });
    }
  }
}

function mettatonPattern(dt) {
  if (every("mettaton-spot", 0.75, dt)) {
    spawn("beam", {
      x: rand(arena.x + 25, arena.x + arena.w - 25),
      y: arena.y,
      vx: 0,
      vy: 0,
      r: 24,
      horizontal: false,
      warn: 0.5,
      life: 1.0,
    });
  }
  if (state.wave >= 1 && every("mettaton-bombs", 0.28, dt)) {
    spawn("bomb", { x: rand(arena.x, arena.x + arena.w), y: arena.y - 24, vx: Math.sin(state.t * 5) * 75, vy: rand(210, 285), r: 13, spin: 5 });
  }
  if (state.wave === 2 && every("mettaton-rush", 0.5, dt)) {
    const y = rand(arena.y + 25, arena.y + arena.h - 25);
    spawn("leg", { x: arena.x + arena.w + 45, y, vx: -360, vy: 0, r: 22, angle: Math.PI });
  }
}

function touching(b) {
  const p = state.player;
  if (state.heartMode === "green" && shieldBlocks(b)) return false;
  if (b.kind === "beam" || b.kind === "vine") {
    if (b.age < b.warn) return false;
    return b.horizontal ? Math.abs(p.y - b.y) < 18 : Math.abs(p.x - b.x) < 18;
  }
  if (b.kind === "bone" || b.kind === "blueBone") {
    const moving = keys.has("ArrowLeft") || keys.has("ArrowRight") || keys.has("ArrowUp") || keys.has("ArrowDown") || keys.has("a") || keys.has("d") || keys.has("w") || keys.has("s");
    if (b.kind === "blueBone" && !moving) {
      return false;
    }
    return rectCircle(b.x - 9, b.y - b.h / 2, 18, b.h, p.x, p.y, p.r);
  }
  if (b.kind === "leg" || b.kind === "saber") {
    return rectCircle(b.x - 28, b.y - 10, 56, 20, p.x, p.y, p.r);
  }
  return Math.hypot(p.x - b.x, p.y - b.y) < p.r + b.r;
}

function shieldBlocks(b) {
  const p = state.player;
  const dx = b.x - p.x;
  const dy = b.y - p.y;
  const close = Math.hypot(dx, dy) < 48;
  if (!close) return false;
  if (p.shieldDir === "up") return dy < 0 && Math.abs(dx) < 36;
  if (p.shieldDir === "down") return dy > 0 && Math.abs(dx) < 36;
  if (p.shieldDir === "left") return dx < 0 && Math.abs(dy) < 36;
  if (p.shieldDir === "right") return dx > 0 && Math.abs(dy) < 36;
  return false;
}

function outside(b) {
  if (b.kind === "beam" || b.kind === "vine") return b.age > b.life;
  return b.x < arena.x - 120 || b.x > arena.x + arena.w + 120 || b.y < arena.y - 120 || b.y > arena.y + arena.h + 120;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackdrop();
  drawBoss();
  drawArena();
  drawBullets();
  drawShots();
  drawPlayer();
  drawOverlay();
}

function drawBackdrop() {
  ctx.fillStyle = "#050507";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  for (let x = 0; x < canvas.width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
}

function drawBoss() {
  ctx.save();
  ctx.translate(canvas.width / 2, 130 + Math.sin(state.t * 4) * 2);
  if (!drawBossImage(selectedBoss.id)) drawTileBoss(selectedBoss.id);
  ctx.restore();
}

function drawBossImage(id) {
  const entry = bossImages[id];
  if (!entry || !entry.ok || !entry.image) return false;
  const image = entry.image;
  const maxW = id === "omega" ? 245 : id === "btt" ? 260 : 170;
  const maxH = id === "omega" ? 155 : 175;
  const scale = Math.min(maxW / image.naturalWidth, maxH / image.naturalHeight);
  const w = Math.round(image.naturalWidth * scale);
  const h = Math.round(image.naturalHeight * scale);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, -w / 2, -h / 2, w, h);
  ctx.imageSmoothingEnabled = true;
  return true;
}

const tile = 5;

function tileRect(x, y, w, h, color = "#ffffff") {
  px(x * tile, y * tile, w * tile, h * tile, color);
}

function tileLine(x1, y1, x2, y2, color = "#ffffff") {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (let i = 0; i <= steps; i++) {
    const x = Math.round(x1 + ((x2 - x1) * i) / steps);
    const y = Math.round(y1 + ((y2 - y1) * i) / steps);
    tileRect(x, y, 1, 1, color);
  }
}

function tileSkull(cx, y, wide = false, eyeColor = "#050507") {
  const hw = wide ? 8 : 7;
  tileRect(cx - hw + 1, y, hw * 2 - 2, 1);
  tileRect(cx - hw, y + 1, hw * 2, 6);
  tileRect(cx - hw + 2, y + 7, hw * 2 - 4, 3);
  tileRect(cx - 5, y + 3, 3, 2, eyeColor);
  tileRect(cx + 2, y + 3, 3, 2, eyeColor);
  tileRect(cx - 1, y + 5, 2, 2, "#050507");
  tileRect(cx - 4, y + 8, 8, 1, "#050507");
  for (let x = -3; x <= 3; x += 2) tileRect(cx + x, y + 8, 1, 2);
}

function drawTileBoss(id) {
  if (id === "sans") drawTileSans(1.1);
  else if (id === "disbelief") drawTilePapyrus(1.04);
  else if (id === "btt") drawTileTrio();
  else if (id === "undyne") drawTileUndyne(false);
  else if (id === "undying") drawTileUndyne(true);
  else if (id === "asgore") drawTileAsgore();
  else if (id === "omega") drawTileOmega();
  else if (id === "asriel") drawTileAsriel();
  else if (id === "mettaton") drawTileMettaton();
  else {
    const sprite = bossSprites[id];
    const scale = sprite[0].length > 14 ? 5 : 7;
    const w = sprite[0].length * scale;
    drawPixelSprite(sprite, -w / 2, -60, scale);
  }
}

function drawTileSans(scale = 1) {
  ctx.save();
  ctx.scale(scale, scale);
  tileSkull(0, -23, true, "#050507");
  tileRect(-8, -12, 16, 3);
  tileRect(-11, -9, 4, 11);
  tileRect(7, -9, 4, 11);
  tileRect(-7, -9, 14, 11, "#57d6ff");
  tileRect(-5, -8, 10, 10, "#050507");
  tileRect(-2, -6, 4, 7);
  tileRect(-10, 2, 7, 8);
  tileRect(3, 2, 7, 8);
  tileRect(-12, 10, 8, 2);
  tileRect(4, 10, 8, 2);
  tileRect(-14, -8, 3, 10);
  tileRect(11, -8, 3, 10);
  ctx.restore();
}

function drawTilePapyrus(scale = 1) {
  ctx.save();
  ctx.scale(scale, scale);
  tileSkull(0, -25, false, "#050507");
  tileLine(0, -24, 16, -28, "#ffd166");
  tileRect(15, -29, 2, 2, "#ffd166");
  tileRect(-5, -13, 10, 3);
  tileRect(-10, -10, 20, 4);
  tileRect(-7, -6, 14, 12);
  tileRect(-4, -4, 8, 8, "#050507");
  tileRect(-14, -8, 4, 7);
  tileRect(10, -8, 4, 7);
  tileLine(-14, -1, -23, 13);
  tileLine(14, -1, 23, 13);
  tileRect(-8, 6, 5, 12);
  tileRect(3, 6, 5, 12);
  tileRect(-11, 17, 8, 2);
  tileRect(3, 17, 8, 2);
  ctx.restore();
}

function drawTileTrio() {
  ctx.save();
  ctx.translate(-95, 4);
  drawTilePapyrus(0.74);
  ctx.translate(95, 9);
  drawTileSans(0.74);
  ctx.translate(95, -8);
  drawTileUndyne(true, 0.72);
  ctx.restore();
}

function drawTileUndyne(undying, scale = 1) {
  ctx.save();
  ctx.scale(scale, scale);
  const accent = undying ? "#80ed99" : "#57d6ff";
  tileRect(-7, -27, 14, 3, accent);
  tileRect(-9, -24, 18, 8);
  tileRect(-7, -22, 14, 6, "#050507");
  tileRect(-6, -23, 4, 2);
  tileRect(2, -23, 4, 2);
  tileRect(-1, -20, 3, 2);
  tileRect(-13, -20, 5, 5);
  tileRect(8, -20, 5, 5);
  tileRect(-14, -14, 28, 3);
  tileRect(-9, -11, 18, 11);
  tileRect(-5, -8, 10, 6, "#050507");
  tileRect(-15, -10, 5, 12);
  tileRect(10, -10, 5, 12);
  tileRect(-17, 0, 5, 11);
  tileRect(12, 0, 5, 11);
  tileRect(-7, 0, 5, 15);
  tileRect(2, 0, 5, 15);
  tileRect(-10, 14, 8, 2);
  tileRect(2, 14, 8, 2);
  tileLine(-20, -7, -24, 16, accent);
  tileLine(-25, 16, -17, 16, accent);
  if (undying) {
    tileRect(-12, -12, 24, 2, accent);
    tileRect(-10, -3, 20, 2, accent);
    tileRect(-4, -19, 8, 2, accent);
  }
  ctx.restore();
}

function drawTileAsgore(scale = 1) {
  ctx.save();
  ctx.scale(scale, scale);
  tileLine(-9, -24, -17, -32);
  tileLine(9, -24, 17, -32);
  tileRect(-11, -25, 22, 8);
  tileRect(-8, -19, 16, 5);
  tileRect(-5, -22, 3, 2, "#050507");
  tileRect(2, -22, 3, 2, "#050507");
  tileRect(-2, -18, 4, 2, "#050507");
  tileRect(-14, -12, 28, 5);
  tileRect(-11, -7, 22, 16);
  tileRect(-1, -5, 2, 13, "#ffd166");
  tileRect(-17, -6, 5, 15);
  tileRect(12, -6, 5, 15);
  tileRect(-8, 9, 6, 10);
  tileRect(2, 9, 6, 10);
  tileRect(-11, 18, 9, 2);
  tileRect(2, 18, 9, 2);
  ctx.restore();
}

function drawTileOmega(scale = 1) {
  ctx.save();
  ctx.scale(scale, scale);
  tileRect(-16, -25, 32, 4);
  tileRect(-13, -30, 26, 6);
  tileRect(-10, -22, 20, 10);
  tileRect(-6, -19, 3, 3, "#050507");
  tileRect(3, -19, 3, 3, "#050507");
  tileRect(-5, -13, 10, 2, "#050507");
  tileRect(-18, -24, 5, 4);
  tileRect(13, -24, 5, 4);
  tileRect(-6, -9, 12, 11, "#ff7a1a");
  tileRect(-2, -5, 4, 5, "#050507");
  for (let x = -13; x <= 13; x += 5) tileRect(x, -10, 2, 21, "#f6d28a");
  tileLine(-20, -8, -31, 9, "#80ed99");
  tileLine(20, -8, 31, 9, "#80ed99");
  tileLine(-28, 9, -36, 16, "#80ed99");
  tileLine(28, 9, 36, 16, "#80ed99");
  ctx.restore();
}

function drawTileAsriel(scale = 1) {
  ctx.save();
  ctx.scale(scale, scale);
  tileLine(-10, -24, -18, -31);
  tileLine(10, -24, 18, -31);
  tileRect(-11, -25, 22, 8);
  tileRect(-8, -19, 16, 5);
  tileRect(-5, -22, 3, 2, "#050507");
  tileRect(2, -22, 3, 2, "#050507");
  tileRect(-3, -18, 6, 2, "#050507");
  tileLine(-15, -13, -27, -5);
  tileLine(15, -13, 27, -5);
  tileRect(-15, -11, 30, 4);
  tileRect(-10, -7, 20, 14);
  tileRect(-3, -3, 6, 6, "#050507");
  tileRect(-18, -6, 5, 13);
  tileRect(13, -6, 5, 13);
  tileRect(-7, 7, 5, 12);
  tileRect(2, 7, 5, 12);
  tileRect(-10, 18, 8, 2);
  tileRect(2, 18, 8, 2);
  ctx.restore();
}

function drawTileMettaton(scale = 1) {
  ctx.save();
  ctx.scale(scale, scale);
  tileRect(-8, -28, 11, 3);
  tileLine(-8, -28, -14, -32);
  tileRect(-11, -25, 22, 8);
  tileRect(-9, -18, 18, 5);
  tileRect(-5, -22, 3, 2, "#050507");
  tileRect(2, -21, 3, 2, "#050507");
  tileRect(-3, -17, 8, 1, "#050507");
  tileRect(-20, -13, 40, 3);
  tileRect(-12, -10, 24, 13);
  tileRect(-3, -5, 6, 5, "#ff8bd1");
  tileLine(-17, -9, -31, 12);
  tileLine(17, -9, 31, 12);
  tileRect(-9, 3, 5, 16);
  tileRect(4, 3, 5, 16);
  tileRect(-13, 18, 9, 2);
  tileRect(4, 18, 9, 2);
  ctx.restore();
}

function px(x, y, w, h, color = "#ffffff") {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function outlineBox(x, y, w, h, color = "#ffffff") {
  px(x, y, w, 4, color);
  px(x, y + h - 4, w, 4, color);
  px(x, y, 4, h, color);
  px(x + w - 4, y, 4, h, color);
}

function line(points, color = "#ffffff", width = 4) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.stroke();
}

function poly(points, color = "#ffffff") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function ellipseStroke(x, y, rx, ry, color = "#ffffff", width = 4) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawSkullHead(x, y, s, wink = false) {
  ellipseStroke(x, y - 18 * s, 40 * s, 36 * s, "#ffffff", 5 * s);
  line([[x - 28 * s, y + 10 * s], [x - 22 * s, y + 30 * s], [x + 22 * s, y + 30 * s], [x + 28 * s, y + 10 * s]], "#ffffff", 5 * s);
  px(x - 23 * s, y - 20 * s, 17 * s, 16 * s, "#ffffff");
  px(x + 6 * s, y - 20 * s, 17 * s, 16 * s, wink ? "#57d6ff" : "#ffffff");
  px(x - 17 * s, y - 15 * s, 8 * s, 8 * s, "#050507");
  px(x + 12 * s, y - 15 * s, 8 * s, 8 * s, "#050507");
  poly([[x, y - 2 * s], [x - 7 * s, y + 12 * s], [x + 7 * s, y + 12 * s]], "#ffffff");
  line([[x - 22 * s, y + 18 * s], [x - 10 * s, y + 25 * s], [x + 8 * s, y + 25 * s], [x + 22 * s, y + 18 * s]], "#ffffff", 4 * s);
  for (let i = -14; i <= 14; i += 7) px(x + i * s, y + 18 * s, 3 * s, 10 * s, "#ffffff");
}

function drawSansPortrait(s) {
  ctx.save();
  ctx.scale(s, s);
  drawSkullHead(0, -70, 1.05, true);
  line([[-44, -30], [-64, 6], [-58, 64], [-30, 78]], "#ffffff", 5);
  line([[44, -30], [64, 6], [58, 64], [30, 78]], "#ffffff", 5);
  outlineBox(-38, -20, 76, 76);
  px(-24, -8, 48, 56, "#050507");
  line([[-26, 48], [-38, 110], [-14, 110]], "#ffffff", 5);
  line([[26, 48], [38, 110], [14, 110]], "#ffffff", 5);
  line([[-52, 112], [-22, 108], [-4, 116]], "#ffffff", 5);
  line([[52, 112], [22, 108], [4, 116]], "#ffffff", 5);
  ctx.restore();
}

function drawPapyrusPortrait(s) {
  ctx.save();
  ctx.scale(s, s);
  drawSkullHead(0, -82, 0.78, false);
  line([[-10, -102], [78, -118], [88, -108]], "#ffd166", 4);
  line([[74, -116], [78, -98], [91, -103]], "#ffd166", 3);
  line([[-38, -40], [-60, -10], [-48, 42], [-24, 74]], "#ffffff", 5);
  line([[38, -40], [62, -6], [72, 38], [92, 80]], "#ffffff", 5);
  line([[-40, -36], [0, -52], [40, -36], [34, 48], [0, 70], [-34, 48], [-40, -36]], "#ffffff", 5);
  outlineBox(-22, -20, 44, 52);
  line([[-68, 20], [-102, 90], [-126, 112]], "#ffffff", 5);
  line([[-112, 104], [-142, 100]], "#ffffff", 4);
  line([[-32, 70], [-44, 118], [-14, 118]], "#ffffff", 5);
  line([[32, 70], [44, 118], [14, 118]], "#ffffff", 5);
  ctx.restore();
}

function drawTrioPortrait(s) {
  ctx.save();
  ctx.scale(s, s);
  ctx.translate(-98, 8);
  drawPapyrusPortrait(0.68);
  ctx.translate(98, 8);
  drawSansPortrait(0.68);
  ctx.translate(98, -6);
  drawUndynePortrait(0.64, true);
  ctx.restore();
}

function drawUndynePortrait(s, undying) {
  ctx.save();
  ctx.scale(s, s);
  const accent = undying ? "#80ed99" : "#57d6ff";
  line([[-64, -112], [-22, -128], [34, -118], [54, -92], [36, -58], [-28, -52], [-58, -76], [-64, -112]], "#ffffff", 5);
  line([[-78, -102], [-126, -118], [-142, -112]], accent, 4);
  line([[42, -96], [74, -112], [88, -96], [54, -70]], "#ffffff", 5);
  px(-28, -92, 16, 10, "#050507");
  px(10, -88, 18, 10, "#050507");
  line([[-14, -68], [8, -64], [26, -70]], "#050507", 4);
  line([[-70, -40], [-42, -58], [0, -48], [42, -58], [70, -40]], "#ffffff", 6);
  line([[-50, -36], [-34, 58], [0, 78], [34, 58], [50, -36]], "#ffffff", 5);
  line([[-88, -28], [-126, 42], [-140, 112]], "#ffffff", 5);
  line([[-144, 104], [-108, 104]], accent, 5);
  line([[70, -30], [92, 42], [110, 90]], "#ffffff", 5);
  line([[-34, 60], [-52, 122], [-20, 122]], "#ffffff", 5);
  line([[34, 60], [52, 122], [20, 122]], "#ffffff", 5);
  if (undying) {
    line([[-78, -26], [0, -2], [78, -26]], accent, 5);
    line([[-52, 12], [52, 12]], accent, 5);
  }
  ctx.restore();
}

function drawAsgorePortrait(s) {
  ctx.save();
  ctx.scale(s, s);
  line([[-52, -98], [-86, -130], [-78, -78]], "#ffffff", 6);
  line([[52, -98], [86, -130], [78, -78]], "#ffffff", 6);
  line([[-56, -96], [-34, -118], [34, -118], [56, -96], [48, -58], [0, -42], [-48, -58], [-56, -96]], "#ffffff", 5);
  px(-24, -86, 16, 10, "#050507");
  px(8, -86, 16, 10, "#050507");
  line([[-18, -62], [0, -54], [18, -62]], "#050507", 4);
  line([[-82, -28], [-48, -58], [48, -58], [82, -28]], "#ffffff", 6);
  line([[-60, -22], [-48, 74], [0, 104], [48, 74], [60, -22]], "#ffffff", 5);
  line([[-4, -18], [-4, 82]], "#ffd166", 5);
  line([[-76, -8], [-104, 72]], "#ffffff", 5);
  line([[76, -8], [104, 72]], "#ffffff", 5);
  line([[-42, 78], [-58, 124], [-18, 124]], "#ffffff", 5);
  line([[42, 78], [58, 124], [18, 124]], "#ffffff", 5);
  ctx.restore();
}

function drawOmegaPortrait(s) {
  ctx.save();
  ctx.scale(s, s);
  line([[-116, -16], [-156, 42], [-146, 112]], "#80ed99", 8);
  line([[116, -16], [156, 42], [146, 112]], "#80ed99", 8);
  line([[-112, 68], [-166, 96], [-130, 124]], "#80ed99", 8);
  line([[112, 68], [166, 96], [130, 124]], "#80ed99", 8);
  ellipseStroke(0, -66, 72, 50, "#ffffff", 6);
  px(-74, -118, 148, 22);
  px(-26, -132, 52, 18);
  px(-44, -82, 20, 18, "#050507");
  px(24, -82, 20, 18, "#050507");
  line([[-34, -38], [-14, -24], [14, -24], [34, -38]], "#050507", 5);
  for (let i = -54; i <= 54; i += 27) line([[i, -16], [i - 16, 84]], "#f6d28a", 7);
  ellipseStroke(0, 72, 36, 38, "#ff7a1a", 7);
  px(-12, 58, 24, 26, "#050507");
  ellipseStroke(-98, -92, 20, 14, "#ffffff", 5);
  ellipseStroke(98, -92, 20, 14, "#ffffff", 5);
  ctx.restore();
}

function drawAsrielPortrait(s) {
  ctx.save();
  ctx.scale(s, s);
  line([[-52, -104], [-86, -130], [-70, -82]], "#ffffff", 5);
  line([[52, -104], [86, -130], [70, -82]], "#ffffff", 5);
  line([[-52, -100], [-28, -120], [28, -120], [52, -100], [44, -64], [0, -48], [-44, -64], [-52, -100]], "#ffffff", 5);
  px(-24, -88, 16, 10, "#050507");
  px(8, -88, 16, 10, "#050507");
  line([[-18, -66], [0, -58], [18, -66]], "#050507", 4);
  line([[-104, -44], [-58, -70], [-40, -34], [-96, 4]], "#ffffff", 5);
  line([[104, -44], [58, -70], [40, -34], [96, 4]], "#ffffff", 5);
  line([[-70, -26], [0, -58], [70, -26]], "#ffffff", 6);
  line([[-50, -20], [-30, 58], [0, 84], [30, 58], [50, -20]], "#ffffff", 5);
  poly([[-16, -2], [0, 28], [16, -2], [0, -12]], "#ffffff");
  line([[-82, -4], [-114, 56]], "#ffffff", 5);
  line([[82, -4], [114, 56]], "#ffffff", 5);
  line([[-34, 62], [-52, 122], [-14, 122]], "#ffffff", 5);
  line([[34, 62], [52, 122], [14, 122]], "#ffffff", 5);
  ctx.restore();
}

function drawMettatonPortrait(s) {
  ctx.save();
  ctx.scale(s, s);
  line([[-26, -128], [22, -128], [50, -104], [40, -76], [4, -62], [-38, -78], [-52, -106], [-26, -128]], "#ffffff", 5);
  line([[-6, -128], [-42, -150], [-62, -130]], "#ffffff", 4);
  px(-22, -106, 14, 10, "#050507");
  px(10, -100, 14, 10, "#050507");
  line([[-18, -78], [10, -72], [28, -82]], "#050507", 4);
  line([[-106, -56], [-52, -68], [52, -68], [106, -56]], "#ffffff", 6);
  line([[-58, -54], [-40, 32], [0, 62], [40, 32], [58, -54]], "#ffffff", 5);
  ellipseStroke(0, -14, 18, 18, "#ff8bd1", 5);
  line([[-86, -42], [-132, 28], [-164, 78]], "#ffffff", 5);
  line([[86, -42], [132, 28], [164, 78]], "#ffffff", 5);
  line([[-46, 32], [-72, 118], [-32, 118]], "#ffffff", 5);
  line([[46, 32], [72, 118], [32, 118]], "#ffffff", 5);
  ctx.restore();
}

function drawArena() {
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.strokeRect(arena.x, arena.y, arena.w, arena.h);
}

function drawBullets() {
  for (const b of state.bullets) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle || 0);
    if (b.kind === "spear") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-22, -8, 42, 16);
      ctx.fillStyle = selectedBoss.color;
      ctx.fillRect(-18, -3, 30, 6);
      ctx.fillRect(12, -9, 8, 18);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(20, -3, 12, 6);
    } else if (b.kind === "fire") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-b.r, -b.r, b.r * 2, b.r * 2);
      ctx.fillStyle = "#ff7a1a";
      ctx.fillRect(-b.r + 2, -b.r + 4, b.r * 2 - 4, b.r * 2 - 6);
      ctx.fillRect(-b.r / 2, -b.r - 4, b.r, b.r);
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(-4, -4, 8, 12);
    } else if (b.kind === "trident") {
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(-34, -3, 62, 6);
      ctx.fillRect(20, -18, 7, 36);
      ctx.fillRect(30, -22, 7, 12);
      ctx.fillRect(30, -6, 7, 12);
      ctx.fillRect(30, 10, 7, 12);
    } else if (b.kind === "saber") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-38, -13, 76, 26);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-34, -4, 54, 8);
      ctx.fillStyle = "#c77dff";
      ctx.fillRect(18, -13, 10, 26);
      ctx.fillRect(28, -7, 12, 14);
    } else if (b.kind === "star") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-15, -15, 30, 30);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-4, -16, 8, 32);
      ctx.fillRect(-16, -4, 32, 8);
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(-8, -8, 16, 16);
      ctx.fillRect(-2, -22, 4, 8);
      ctx.fillRect(-2, 14, 4, 8);
      ctx.fillRect(-22, -2, 8, 4);
      ctx.fillRect(14, -2, 8, 4);
    } else if (b.kind === "petal") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-15, -10, 30, 20);
      ctx.fillStyle = "#ff7a1a";
      ctx.fillRect(-12, -7, 24, 14);
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(-4, -4, 8, 8);
      ctx.fillStyle = "#80ed99";
      ctx.fillRect(10, -2, 10, 4);
    } else if (b.kind === "bomb") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-14, -14, 28, 28);
      ctx.fillStyle = "#ff8bd1";
      ctx.fillRect(-10, -8, 20, 18);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-4, -14, 8, 8);
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(8, -16, 10, 6);
    } else if (b.kind === "leg") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-34, -13, 68, 26);
      ctx.fillStyle = "#ff8bd1";
      ctx.fillRect(-28, -7, 46, 14);
      ctx.fillRect(12, -18, 12, 36);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(20, 8, 18, 8);
    } else if (b.kind === "bone" || b.kind === "blueBone") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-12, -b.h / 2 - 10, 24, b.h + 20);
      ctx.fillStyle = b.kind === "blueBone" ? "#57d6ff" : "#ffffff";
      ctx.fillRect(-7, -b.h / 2, 14, b.h);
      ctx.fillRect(-13, -b.h / 2 - 8, 26, 16);
      ctx.fillRect(-13, b.h / 2 - 8, 26, 16);
      ctx.fillRect(-19, -b.h / 2 - 2, 8, 8);
      ctx.fillRect(11, -b.h / 2 - 2, 8, 8);
      ctx.fillRect(-19, b.h / 2 - 6, 8, 8);
      ctx.fillRect(11, b.h / 2 - 6, 8, 8);
    } else if (b.kind === "beam" || b.kind === "vine") {
      const active = b.age >= b.warn;
      ctx.globalAlpha = active ? 0.82 : 0.35;
      ctx.fillStyle = b.kind === "vine" ? (active ? "#80ed99" : "#2f6f35") : (active ? "#ffffff" : "#57d6ff");
      if (b.horizontal) {
        for (let x = -10; x < arena.w + 20; x += 18) {
          ctx.fillRect(x, -14, 12, 28);
          if (b.kind === "vine") ctx.fillRect(x + 4, -22, 4, 12);
        }
      } else {
        for (let y = -10; y < arena.h + 20; y += 18) {
          ctx.fillRect(-14, y, 28, 12);
          if (b.kind === "vine") ctx.fillRect(-22, y + 4, 12, 4);
        }
      }
    }
    ctx.restore();
  }
}

function drawPlayer() {
  const p = state.player;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.globalAlpha = p.inv > 0 ? 0.45 + Math.sin(state.t * 32) * 0.25 : 1;
  drawPixelHeart(-21, -18, pixel, heartColors[state.heartMode]);
  if (state.heartMode === "green") drawShield(p.shieldDir);
  ctx.restore();
}

function drawShots() {
  ctx.save();
  ctx.fillStyle = "#ffd166";
  for (const shot of state.shots) {
    ctx.fillRect(shot.x - 3, shot.y - 12, 6, 18);
    ctx.fillRect(shot.x - 8, shot.y - 6, 16, 6);
  }
  ctx.restore();
}

function drawShield(dir) {
  ctx.fillStyle = "#80ed99";
  if (dir === "up") ctx.fillRect(-18, -34, 36, 6);
  if (dir === "down") ctx.fillRect(-18, 30, 36, 6);
  if (dir === "left") ctx.fillRect(-34, -14, 6, 36);
  if (dir === "right") ctx.fillRect(30, -14, 6, 36);
}

function drawPixelHeart(x, y, size, color) {
  const map = [
    ".XX.XX.",
    "XXXXXXX",
    "XXXXXXX",
    ".XXXXX.",
    "..XXX..",
    "...X...",
  ];
  ctx.fillStyle = "#111118";
  ctx.fillRect(x - 2, y - 2, map[0].length * size + 4, map.length * size + 4);
  ctx.fillStyle = color;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === "X") ctx.fillRect(x + col * size, y + row * size, size, size);
    }
  }
}

function drawPixelSprite(sprite, x, y, size) {
  for (let row = 0; row < sprite.length; row++) {
    for (let col = 0; col < sprite[row].length; col++) {
      const color = spriteColors[sprite[row][col]];
      if (!color) continue;
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(x + col * size - 1, y + row * size - 1, size + 2, size + 2);
      ctx.fillStyle = color;
      ctx.fillRect(x + col * size, y + row * size, size, size);
    }
  }
}

function drawOverlay() {
  if (state.running && !state.over) return;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(arena.x + 20, arena.y + 76, arena.w - 40, 150);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(arena.x + 20, arena.y + 76, arena.w - 40, 150);
  ctx.fillStyle = state.won ? "#80ed99" : state.over ? "#ff3855" : "#ffd166";
  ctx.font = "bold 30px Courier New";
  ctx.textAlign = "center";
  ctx.fillText(state.won ? "PRACTICE CLEAR" : state.over ? "GAME OVER" : "READY?", arena.x + arena.w / 2, arena.y + 132);
  ctx.fillStyle = "#ffffff";
  ctx.font = "18px Courier New";
  ctx.fillText(state.message || "Press Start or R", arena.x + arena.w / 2, arena.y + 176);
  ctx.restore();
}

function rectCircle(rx, ry, rw, rh, cx, cy, cr) {
  const tx = clamp(cx, rx, rx + rw);
  const ty = clamp(cy, ry, ry + rh);
  return Math.hypot(cx - tx, cy - ty) <= cr;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  updateMusic();
  draw();
  requestAnimationFrame(loop);
}

function initAudio() {
  if (music.ctx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  music.ctx = new AudioContext();
  music.gain = music.ctx.createGain();
  music.gain.gain.value = 0.13;
  music.gain.connect(music.ctx.destination);
}

function startMusic() {
  initAudio();
  if (!music.ctx) return;
  if (music.ctx.state === "suspended") music.ctx.resume();
  if (music.currentBoss !== selectedBoss.id) restartMusicForBoss();
  music.playing = true;
  music.nextTime = Math.max(music.ctx.currentTime, music.nextTime || 0);
}

function stopMusic() {
  music.playing = false;
}

function restartMusicForBoss() {
  music.currentBoss = selectedBoss.id;
  music.step = 0;
  music.nextTime = music.ctx ? music.ctx.currentTime : 0;
}

function updateMusic() {
  if (!music.playing || !music.ctx || !state.running || state.over) return;
  const tune = chipTunes[selectedBoss.id];
  const beat = 60 / tune.bpm;
  while (music.nextTime < music.ctx.currentTime + 0.18) {
    const lead = tune.lead[music.step % tune.lead.length];
    const bass = tune.bass[Math.floor(music.step / 2) % tune.bass.length];
    if (lead) playTone(lead, music.nextTime, beat * 0.42, "square", 0.08);
    if (music.step % 2 === 0) playTone(bass, music.nextTime, beat * 0.8, "triangle", 0.055);
    if (music.step % 4 === 2) playNoiseHat(music.nextTime, beat * 0.12);
    music.step++;
    music.nextTime += beat / 2;
  }
}

function playTone(freq, start, duration, type, volume) {
  const osc = music.ctx.createOscillator();
  const gain = music.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(music.gain);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function playNoiseHat(start, duration) {
  const sampleRate = music.ctx.sampleRate;
  const buffer = music.ctx.createBuffer(1, Math.ceil(sampleRate * duration), sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = music.ctx.createBufferSource();
  const gain = music.ctx.createGain();
  gain.gain.setValueAtTime(0.025, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.buffer = buffer;
  source.connect(gain);
  gain.connect(music.gain);
  source.start(start);
  source.stop(start + duration);
}

window.addEventListener("keydown", (event) => {
  keys.add(event.key.length === 1 ? event.key.toLowerCase() : event.key);
  if (event.key.toLowerCase() === "r") resetGame(true);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key);
});

document.querySelectorAll("[data-touch-key]").forEach((button) => {
  const key = button.dataset.touchKey;
  const press = (event) => {
    event.preventDefault();
    keys.add(key);
  };
  const release = (event) => {
    event.preventDefault();
    keys.delete(key);
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
});

startBtn.addEventListener("click", () => {
  if (state.over || !state.running || state.phase === "ready") resetGame(true);
  else state.phase = "menu";
  startMusic();
  syncTurnUi();
});

restartBtn.addEventListener("click", () => {
  resetGame(true);
  startMusic();
});

commandPanel.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-command]");
  if (!button) return;
  chooseCommand(button.dataset.command);
});

difficultyEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-difficulty]");
  if (!button) return;
  difficultyKey = button.dataset.difficulty;
  difficultyEl.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === button));
  resetGame(false);
});

renderRoster();
selectBoss(selectedBoss);
requestAnimationFrame(loop);
