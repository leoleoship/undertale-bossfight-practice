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

const arena = { x: 260, y: 174, w: 440, h: 310 };
const maxHp = 92;

const bosses = [
  {
    id: "undyne",
    name: "Undyne",
    icon: "U",
    color: "#57d6ff",
    note: "Spears, side pressure, fast dodges",
    waves: ["Spear Rain", "Cross Lances", "Cyclone Guard"],
  },
  {
    id: "asgore",
    name: "Asgore",
    icon: "A",
    color: "#ffd166",
    note: "Fire rings, trident sweeps, heavy reads",
    waves: ["Fire Rings", "Trident Sweep", "Royal Furnace"],
  },
  {
    id: "disbelief",
    name: "Disbelief Papyrus",
    icon: "P",
    color: "#ffffff",
    note: "Bones, blue stops, sudden lanes",
    waves: ["Bone Lanes", "Blue Patience", "Final Rattle"],
  },
  {
    id: "btt",
    name: "Bad Time Trio",
    icon: "T",
    color: "#c77dff",
    note: "Mixed AU pressure and layered attacks",
    waves: ["Triple Trouble", "Blaster Net", "Last Corridor"],
  },
];

const difficulty = {
  normal: { damage: 8, rate: 1, speed: 1 },
  hard: { damage: 11, rate: 1.25, speed: 1.18 },
  insane: { damage: 15, rate: 1.55, speed: 1.35 },
};

let selectedBoss = bosses[0];
let difficultyKey = "normal";
let state = makeState();
let keys = new Set();
let lastTime = performance.now();

function makeState() {
  return {
    running: false,
    over: false,
    won: false,
    hp: maxHp,
    t: 0,
    waveT: 0,
    wave: 0,
    player: { x: arena.x + arena.w / 2, y: arena.y + arena.h / 2, r: 8, inv: 0 },
    bullets: [],
    effects: [],
    spawnTimers: {},
  };
}

function selectBoss(boss) {
  selectedBoss = boss;
  bossName.textContent = boss.name;
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

function resetGame(autoStart = true) {
  state = makeState();
  state.running = autoStart;
  waveName.textContent = selectedBoss.waves[0];
  timeLeft.textContent = "60.0";
  syncHp();
}

function syncHp() {
  hpFill.style.width = `${Math.max(0, state.hp / maxHp) * 100}%`;
  hpText.textContent = `${Math.max(0, Math.ceil(state.hp))} / ${maxHp}`;
}

function spawn(kind, data) {
  state.bullets.push({ kind, age: 0, hit: false, ...data });
}

function every(key, interval, dt) {
  state.spawnTimers[key] = (state.spawnTimers[key] || 0) - dt;
  if (state.spawnTimers[key] <= 0) {
    state.spawnTimers[key] += interval / difficulty[difficultyKey].rate;
    return true;
  }
  return false;
}

function update(dt) {
  if (!state.running || state.over) return;
  const d = difficulty[difficultyKey];
  state.t += dt;
  state.waveT += dt;
  state.player.inv = Math.max(0, state.player.inv - dt);

  if (state.waveT > 20) {
    state.wave = Math.min(2, state.wave + 1);
    state.waveT = 0;
    state.bullets = [];
    state.spawnTimers = {};
    waveName.textContent = selectedBoss.waves[state.wave];
  }

  if (state.t >= 60) {
    state.over = true;
    state.won = true;
    state.running = false;
  }

  movePlayer(dt);
  runPattern(dt);

  for (const b of state.bullets) {
    b.age += dt;
    b.x += (b.vx || 0) * dt * d.speed;
    b.y += (b.vy || 0) * dt * d.speed;
    if (b.spin) b.angle = (b.angle || 0) + b.spin * dt;
    if (touching(b) && state.player.inv <= 0) {
      state.hp -= d.damage;
      state.player.inv = 1.0;
      state.effects.push({ x: state.player.x, y: state.player.y, age: 0 });
      syncHp();
      if (state.hp <= 0) {
        state.over = true;
        state.running = false;
      }
    }
  }

  state.effects.forEach((e) => (e.age += dt));
  state.effects = state.effects.filter((e) => e.age < 0.45);
  state.bullets = state.bullets.filter((b) => !outside(b));
  timeLeft.textContent = Math.max(0, 60 - state.t).toFixed(1);
}

function movePlayer(dt) {
  const slow = keys.has("Shift") ? 0.45 : 1;
  const speed = 245 * slow;
  const p = state.player;
  let dx = 0;
  let dy = 0;
  if (keys.has("ArrowLeft") || keys.has("a")) dx -= 1;
  if (keys.has("ArrowRight") || keys.has("d")) dx += 1;
  if (keys.has("ArrowUp") || keys.has("w")) dy -= 1;
  if (keys.has("ArrowDown") || keys.has("s")) dy += 1;
  const len = Math.hypot(dx, dy) || 1;
  p.x = clamp(p.x + (dx / len) * speed * dt, arena.x + p.r, arena.x + arena.w - p.r);
  p.y = clamp(p.y + (dy / len) * speed * dt, arena.y + p.r, arena.y + arena.h - p.r);
}

function runPattern(dt) {
  if (selectedBoss.id === "undyne") undynePattern(dt);
  if (selectedBoss.id === "asgore") asgorePattern(dt);
  if (selectedBoss.id === "disbelief") disbeliefPattern(dt);
  if (selectedBoss.id === "btt") bttPattern(dt);
}

function undynePattern(dt) {
  if (state.wave === 0 && every("spear-rain", 0.28, dt)) {
    spawn("spear", { x: rand(arena.x, arena.x + arena.w), y: arena.y - 28, vx: rand(-18, 18), vy: rand(210, 270), r: 13, angle: Math.PI / 2 });
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
    spawn("fire", { x: rand(arena.x, arena.x + arena.w), y: arena.y - 24, vx: Math.sin(state.t * 2) * 30, vy: rand(180, 250), r: rand(8, 15) });
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
  if (state.wave >= 1 && every("blaster", 1.35, dt)) {
    const horizontal = Math.random() > 0.5;
    spawn("beam", {
      x: horizontal ? arena.x : rand(arena.x + 20, arena.x + arena.w - 20),
      y: horizontal ? rand(arena.y + 20, arena.y + arena.h - 20) : arena.y,
      vx: 0,
      vy: 0,
      r: 24,
      horizontal,
      warn: 0.55,
      life: 1.05,
    });
  }
  if (state.wave === 2 && every("btt-bones", 0.52, dt)) {
    const x = rand(arena.x + 20, arena.x + arena.w - 20);
    spawn("blueBone", { x, y: arena.y - 34, vx: 0, vy: 270, r: 15, h: 70 });
  }
}

function touching(b) {
  const p = state.player;
  if (b.kind === "beam") {
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
  return Math.hypot(p.x - b.x, p.y - b.y) < p.r + b.r;
}

function outside(b) {
  if (b.kind === "beam") return b.age > b.life;
  return b.x < arena.x - 120 || b.x > arena.x + arena.w + 120 || b.y < arena.y - 120 || b.y > arena.y + arena.h + 120;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackdrop();
  drawBoss();
  drawArena();
  drawBullets();
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
  ctx.translate(canvas.width / 2, 78);
  ctx.strokeStyle = selectedBoss.color;
  ctx.fillStyle = selectedBoss.color;
  ctx.lineWidth = 4;
  ctx.strokeRect(-38, -32, 76, 64);
  ctx.font = "bold 42px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(selectedBoss.icon, 0, 1);
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
      ctx.fillStyle = selectedBoss.color;
      ctx.fillRect(-18, -4, 36, 8);
      ctx.beginPath();
      ctx.moveTo(18, -11);
      ctx.lineTo(34, 0);
      ctx.lineTo(18, 11);
      ctx.fill();
    } else if (b.kind === "fire") {
      ctx.fillStyle = "#ff7a1a";
      ctx.beginPath();
      ctx.arc(0, 0, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.arc(-2, -2, b.r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else if (b.kind === "trident") {
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-34, 0);
      ctx.lineTo(32, 0);
      ctx.moveTo(18, 0);
      ctx.lineTo(34, -18);
      ctx.moveTo(18, 0);
      ctx.lineTo(34, 0);
      ctx.moveTo(18, 0);
      ctx.lineTo(34, 18);
      ctx.stroke();
    } else if (b.kind === "bone" || b.kind === "blueBone") {
      ctx.fillStyle = b.kind === "blueBone" ? "#57d6ff" : "#ffffff";
      ctx.fillRect(-8, -b.h / 2, 16, b.h);
      ctx.beginPath();
      ctx.arc(0, -b.h / 2, 12, 0, Math.PI * 2);
      ctx.arc(0, b.h / 2, 12, 0, Math.PI * 2);
      ctx.fill();
    } else if (b.kind === "beam") {
      const active = b.age >= b.warn;
      ctx.globalAlpha = active ? 0.82 : 0.35;
      ctx.fillStyle = active ? "#ffffff" : "#57d6ff";
      if (b.horizontal) ctx.fillRect(-10, -14, arena.w + 20, 28);
      else ctx.fillRect(-14, -10, 28, arena.h + 20);
    }
    ctx.restore();
  }
}

function drawPlayer() {
  const p = state.player;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.globalAlpha = p.inv > 0 ? 0.45 + Math.sin(state.t * 32) * 0.25 : 1;
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = "#ff3855";
  ctx.fillRect(-7, -7, 14, 14);
  ctx.beginPath();
  ctx.arc(-7, -7, 7, 0, Math.PI * 2);
  ctx.arc(7, -7, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
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
  ctx.fillText("Press Start or R", arena.x + arena.w / 2, arena.y + 176);
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

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
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
  if (state.over) resetGame(true);
  else state.running = true;
});

restartBtn.addEventListener("click", () => resetGame(true));

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
