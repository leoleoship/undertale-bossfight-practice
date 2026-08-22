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
const wavePractice = document.getElementById("wavePractice");
const commandPanel = document.getElementById("commandPanel");
const commandText = document.getElementById("commandText");
const turnInfo = document.getElementById("turnInfo");

const baseArena = { x: 250, y: 292, w: 460, h: 238 };
const squareArena = { x: 361, y: 292, w: 238, h: 238 };
const compactArena = { x: 300, y: 314, w: 360, h: 194 };
const tallArena = { x: 300, y: 278, w: 360, h: 260 };
const wideArena = { x: 220, y: 300, w: 520, h: 220 };
const lowWideArena = { x: 212, y: 324, w: 536, h: 178 };
const tallNarrowArena = { x: 330, y: 268, w: 300, h: 282 };
const arena = { ...baseArena };
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
const bossImagePresentation = {
  undyne: { maxW: 205, maxH: 188, y: -4 },
  asgore: { maxW: 215, maxH: 190, y: -6 },
  disbelief: { maxW: 190, maxH: 190, y: -4 },
  btt: { maxW: 310, maxH: 156, y: 6 },
  sans: { maxW: 185, maxH: 158, y: 8 },
  undying: { maxW: 218, maxH: 192, y: -8 },
  omega: { maxW: 286, maxH: 196, y: -4 },
  asriel: { maxW: 260, maxH: 205, y: -10 },
  mettaton: { maxW: 205, maxH: 198, y: -4 },
};
const bossStagePlacement = {
  undyne: { x: -18, y: 132, bob: 2 },
  asgore: { x: -12, y: 128, bob: 1 },
  disbelief: { x: -28, y: 135, bob: 1.5 },
  btt: { x: 0, y: 132, bob: 1 },
  sans: { x: -34, y: 143, bob: 0.8 },
  undying: { x: -14, y: 127, bob: 1.8 },
  omega: { x: 12, y: 126, bob: 2.4 },
  asriel: { x: 0, y: 122, bob: 2.2 },
  mettaton: { x: -8, y: 130, bob: 2 },
};
const bossDialogues = {
  undyne: ["* Spears from the front!", "* Keep your guard moving!", "* A spinning spear path closes in!"],
  asgore: ["* Fire gathers at both sides.", "* The trident chooses a lane.", "* Flames fall, but leave a gap."],
  disbelief: ["* Bones rise in paired lanes.", "* Blue bones test your patience.", "* Bone walls climb from below."],
  btt: ["* Three rhythms overlap.", "* A blaster line joins the rush.", "* Bones, spears, and fire share the box."],
  sans: ["* short bones first.", "* blue bones want you still.", "* beams mark the hall."],
  undying: ["* The heroine aims four ways.", "* Shield reads get faster.", "* Red-heart spears cross the box."],
  omega: ["* Petals fall in fixed lanes.", "* Vines cage the screen.", "* Pellet rings leave thin exits."],
  asriel: ["* Stars descend in curtains.", "* Sabers sweep across the box.", "* Hope opens a small path."],
  mettaton: ["* Spotlights mark your mark!", "* Shoot the bombs, darling!", "* Legs sweep the stage edge!"],
};
const bossWaveDialogues = {
  undyne: ["* Green SOUL. Face the spear!", "* Red SOUL. Dodge the cross lances!", "* Back to guard. Read the spin!"],
  asgore: ["* Flames bloom in a ring.", "* The trident sweeps across the box.", "* Fire falls in curtains."],
  disbelief: ["* Blue SOUL. Jump the bone lanes.", "* Stay still when blue falls.", "* Yellow SOUL. Shoot through the wall."],
  btt: ["* Three openings. One box.", "* Gravity pulls while beams charge.", "* Yellow SOUL. Watch every lane."],
  sans: ["* Blue SOUL. The floor matters.", "* Stop for blue. Jump late.", "* Yellow SOUL. Beams cross the hall."],
  undying: ["* Green SOUL. No running.", "* Shield up. The pattern doubles.", "* Red SOUL. Spears cross freely."],
  omega: ["* Yellow SOUL. Petals fill the screen.", "* Vines cut the arena into cells.", "* Pellet rings leave one exit."],
  asriel: ["* Red SOUL. Stars rain down.", "* Yellow SOUL. Fire into the light.", "* Blue SOUL. Hold through the ring."],
  mettaton: ["* Yellow SOUL. Center your shots.", "* Bombs fall under the lights.", "* Red SOUL. Legs sweep the stage."],
};
const soulModeMessages = {
  red: "* RED SOUL: move freely.",
  blue: "* BLUE SOUL: gravity is on.",
  green: "* GREEN SOUL: aim the shield.",
  yellow: "* YELLOW SOUL: press SPACE to shoot.",
};
const commandDialogues = {
  fight: {
    sans: "* that the best swing you've got?",
    undyne: "* Good! Fight like you mean it!",
    undying: "* I won't fall to that!",
    asgore: "* The king lowers his eyes.",
    mettaton: "* Violence? How dramatic!",
    omega: "* The screen shudders.",
    asriel: "* Your attack fades away.",
    disbelief: "* He tightens his grip.",
    btt: "* All three brace at once.",
  },
  act: {
    sans: "* you try talking. nice.",
    undyne: "* Words won't stop these spears!",
    undying: "* Your resolve is noted!",
    asgore: "* For a moment, he listens.",
    disbelief: "* He wants to believe you.",
    mettaton: "* A bold performance choice!",
    omega: "* The vines twitch.",
    asriel: "* A memory answers back.",
    btt: "* You watch for the first cue.",
  },
  item: {
    sans: "* snack break, huh?",
    undyne: "* Heal up. You'll need it!",
    asgore: "* The smell feels familiar.",
    mettaton: "* Product placement!",
    omega: "* The screen flickers hungrily.",
    asriel: "* Hold onto that hope.",
    disbelief: "* He waits while you recover.",
    btt: "* No one gives you much time.",
    undying: "* Heal. Then block.",
  },
  spare: {
    sans: "* sparing already?",
    undyne: "* Not yet!",
    undying: "* I refuse to yield!",
    asgore: "* His grip tightens.",
    disbelief: "* Mercy still matters.",
    mettaton: "* The audience gasps!",
    omega: "* Mercy is swallowed by static.",
    asriel: "* The feeling reaches him.",
    btt: "* The attacks don't stop yet.",
  },
};
const playerCommandMessages = {
  fight: {
    sans: "* You swing. Sans is already a step away.",
    undyne: "* You strike. Undyne grins through it.",
    undying: "* You attack. The heroine refuses to fall.",
    asgore: "* You attack. Asgore's trident lowers.",
    disbelief: "* You attack. Papyrus steadies his bones.",
    btt: "* You attack. Three shadows prepare at once.",
    omega: "* You fire back. The screen tears with static.",
    asriel: "* You attack. The light bends around him.",
    mettaton: "* You attack. The ratings spike.",
  },
  act: {
    sans: "* You checked the timing. The next gap is small.",
    undyne: "* You challenge her. Spears answer first.",
    undying: "* You hold your ground. The shield feels heavier.",
    asgore: "* You talk. For a breath, the flames slow.",
    disbelief: "* You endure. The bone lanes become readable.",
    btt: "* You analyze. The first cue belongs to the bones.",
    omega: "* You call out. The vines twitch in response.",
    asriel: "* You hope. A safe path flashes in the stars.",
    mettaton: "* You pose. The spotlight snaps toward you.",
  },
  spare: {
    sans: "* You spare. The shortcut is not open yet.",
    undyne: "* You spare. Undyne points her spear again.",
    undying: "* You spare. She will not yield.",
    asgore: "* You spare. Asgore's grip tightens.",
    disbelief: "* You spare. Mercy still matters.",
    btt: "* You spare. The pressure keeps building.",
    omega: "* You spare. Static swallows the offer.",
    asriel: "* You spare. The feeling reaches him.",
    mettaton: "* You spare. The audience holds its breath.",
  },
};

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
  normal: { damage: 4, rate: 0.78, speed: 0.94, cap: 30 },
  hard: { damage: 7, rate: 1, speed: 1.05, cap: 38 },
  insane: { damage: 10, rate: 1.18, speed: 1.18, cap: 48 },
};
const soulPhysics = {
  redSpeed: 248,
  yellowSpeed: 236,
  blueSpeed: 218,
  focusMult: 0.45,
  gravity: 980,
  jump: -420,
  shotCooldown: 0.18,
  shotSpeed: -520,
};
const projectileHitboxes = {
  arrow: { w: 46, h: 14 },
  spear: { w: 46, h: 12 },
  trident: { w: 64, h: 24 },
  saber: { w: 66, h: 18 },
  leg: { w: 60, h: 20 },
  beam: { thickness: 15 },
  vine: { thickness: 16 },
  bone: { w: 16 },
  box: { w: 24, h: 24 },
  fire: { scale: 0.76 },
  blueFire: { scale: 0.76 },
  orangeFire: { scale: 0.76 },
  star: { scale: 0.78 },
  diamond: { scale: 0.78 },
  petal: { scale: 0.75 },
  pellet: { scale: 0.72 },
  bomb: { scale: 0.78 },
};
const waveTuning = {
  undyne: [
    { rate: 1.04, speed: 1.14, length: 10.5, cap: 20 },
    { rate: 0.96, speed: 1.1, length: 11.5, cap: 26 },
    { rate: 1.14, speed: 1.18, length: 10.5, cap: 24 },
  ],
  asgore: [
    { rate: 0.8, speed: 0.98, length: 12.5, cap: 28 },
    { rate: 0.88, speed: 1.04, length: 12, cap: 26 },
    { rate: 0.98, speed: 1.08, length: 12.5, cap: 34 },
  ],
  disbelief: [
    { rate: 0.98, speed: 1.06, length: 10.5, cap: 24 },
    { rate: 1.08, speed: 1.1, length: 10.5, cap: 28 },
    { rate: 1.12, speed: 1.14, length: 11, cap: 32 },
  ],
  btt: [
    { rate: 0.9, speed: 1.02, length: 11, cap: 28 },
    { rate: 1.02, speed: 1.08, length: 11, cap: 32 },
    { rate: 1.16, speed: 1.14, length: 11.5, cap: 36 },
  ],
  sans: [
    { rate: 1.1, speed: 1.12, length: 9.5, cap: 24 },
    { rate: 1.18, speed: 1.18, length: 9.5, cap: 28 },
    { rate: 1.24, speed: 1.22, length: 10, cap: 34 },
  ],
  undying: [
    { rate: 1.26, speed: 1.16, length: 9.8, cap: 24 },
    { rate: 1.34, speed: 1.22, length: 9.8, cap: 26 },
    { rate: 1.14, speed: 1.18, length: 10.5, cap: 32 },
  ],
  omega: [
    { rate: 1.04, speed: 1.04, length: 12, cap: 36 },
    { rate: 1.1, speed: 1.06, length: 12, cap: 34 },
    { rate: 1.18, speed: 1.12, length: 12.5, cap: 40 },
  ],
  asriel: [
    { rate: 0.98, speed: 1.06, length: 12, cap: 32 },
    { rate: 1.06, speed: 1.12, length: 11.5, cap: 30 },
    { rate: 1.1, speed: 1.12, length: 12, cap: 36 },
  ],
  mettaton: [
    { rate: 1.0, speed: 1.08, length: 12, cap: 28 },
    { rate: 1.12, speed: 1.14, length: 11.5, cap: 32 },
    { rate: 1.2, speed: 1.2, length: 10.5, cap: 34 },
  ],
};

let selectedBoss = bosses[0];
let difficultyKey = "normal";
let practiceWaveIndex = 0;
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
    bpm: 184,
    lead: [784, 0, 740, 784, 988, 880, 784, 740, 659, 0, 740, 784, 880, 988, 880, 784],
    bass: [196, 196, 147, 147, 165, 165, 185, 185],
    pulse: 0.62,
  },
  asgore: {
    bpm: 144,
    lead: [523, 587, 659, 784, 740, 659, 587, 523, 440, 523, 587, 659, 698, 659, 587, 523],
    bass: [131, 131, 98, 98, 117, 117, 87, 87],
    pulse: 0.48,
  },
  disbelief: {
    bpm: 192,
    lead: [587, 0, 587, 698, 784, 698, 587, 523, 466, 0, 523, 587, 698, 587, 523, 466],
    bass: [147, 147, 110, 110, 131, 131, 98, 98],
    pulse: 0.7,
  },
  btt: {
    bpm: 204,
    lead: [784, 0, 740, 659, 784, 0, 988, 880, 784, 740, 659, 587, 659, 740, 784, 988],
    bass: [196, 147, 165, 196, 147, 196, 220, 196],
    pulse: 0.75,
  },
  sans: {
    bpm: 200,
    lead: [392, 0, 392, 587, 523, 0, 466, 392, 294, 0, 294, 440, 392, 0, 349, 330],
    bass: [98, 98, 147, 98, 87, 87, 131, 87],
    pulse: 0.85,
  },
  undying: {
    bpm: 212,
    lead: [880, 988, 1175, 1319, 1175, 988, 880, 784, 988, 1175, 1319, 1568, 1319, 1175, 988, 880],
    bass: [220, 220, 165, 165, 196, 196, 247, 247],
    pulse: 0.78,
  },
  omega: {
    bpm: 156,
    lead: [523, 622, 659, 523, 466, 392, 466, 523, 698, 659, 622, 523, 466, 523, 622, 659],
    bass: [65, 98, 87, 98, 65, 98, 87, 98],
    pulse: 0.56,
  },
  asriel: {
    bpm: 172,
    lead: [659, 784, 988, 1175, 988, 880, 784, 659, 740, 880, 1175, 1319, 1175, 988, 880, 740],
    bass: [165, 196, 247, 196, 220, 247, 294, 247],
    pulse: 0.52,
  },
  mettaton: {
    bpm: 180,
    lead: [880, 0, 880, 988, 1047, 0, 988, 880, 740, 0, 740, 880, 988, 0, 880, 740],
    bass: [220, 165, 196, 147, 220, 165, 196, 147],
    pulse: 0.72,
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
    rateMult: 1,
    speedMult: 1,
    waveCap: 30,
    enemyTurnLength: 12,
    heartMode: "red",
    message: "Choose an action.",
    lastCommand: null,
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
  practiceWaveIndex = clamp(practiceWaveIndex, 0, boss.waves.length - 1);
  bossName.textContent = boss.name;
  loadBossImage(boss.id);
  if (music.playing) restartMusicForBoss();
  resetGame(false);
  renderRoster();
  renderWavePractice();
}

function renderRoster() {
  roster.innerHTML = "";
  for (const boss of bosses) {
    const card = document.createElement("button");
    card.className = `boss-card${boss.id === selectedBoss.id ? " active" : ""}`;
    card.dataset.boss = boss.id;
    card.innerHTML = `
      <div class="boss-thumb" style="--boss-color:${boss.color}">
        <img src="${bossImagePaths[boss.id]}" alt="" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';" />
        <span>${boss.icon}</span>
      </div>
      <div>
        <h2>${boss.name}</h2>
        <span class="boss-note">${boss.note}</span>
      </div>
    `;
    card.addEventListener("click", () => selectBoss(boss));
    roster.append(card);
  }
}

function renderWavePractice() {
  wavePractice.innerHTML = "";
  selectedBoss.waves.forEach((wave, index) => {
    const mode = selectedBoss.heartModes[index];
    const button = document.createElement("button");
    button.className = index === practiceWaveIndex ? "active" : "";
    button.dataset.wave = index;
    button.style.setProperty("--soul-color", heartColors[mode] || "#ffffff");
    button.innerHTML = `
      <span class="wave-number">${index + 1}</span>
      <span>${wave}</span>
      <span class="wave-soul" aria-hidden="true"></span>
    `;
    button.addEventListener("click", () => selectPracticeWave(index));
    wavePractice.append(button);
  });
}

function selectPracticeWave(index) {
  practiceWaveIndex = clamp(index, 0, selectedBoss.waves.length - 1);
  resetGame(false);
  renderWavePractice();
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

function applyArenaLayout(heartMode = state?.heartMode || selectedBoss.heartModes[0]) {
  const layout = getArenaLayout(selectedBoss.id, heartMode, state?.wave || 0);
  arena.x = layout.x;
  arena.y = layout.y;
  arena.w = layout.w;
  arena.h = layout.h;
}

function getArenaLayout(id, heartMode, wave = 0) {
  if (id === "undyne") return squareArena;
  if (usesSquareArena(id, heartMode)) return squareArena;
  if (id === "sans") return wave === 2 ? lowWideArena : compactArena;
  if (id === "disbelief") return heartMode === "blue" ? compactArena : wideArena;
  if (id === "btt") return wave === 2 ? wideArena : baseArena;
  if (id === "omega") return wave === 1 ? tallNarrowArena : wideArena;
  if (id === "asriel") return wave === 2 ? tallArena : wideArena;
  if (id === "mettaton" && heartMode === "yellow") return tallArena;
  if (id === "asgore" && wave === 2) return wideArena;
  return baseArena;
}

function usesSquareArena(id, heartMode) {
  return (id === "undyne" || id === "undying") && heartMode === "green";
}

function resetGame(autoStart = true) {
  const wave = clamp(practiceWaveIndex, 0, selectedBoss.waves.length - 1);
  applyArenaLayout(selectedBoss.heartModes[wave]);
  state = makeState();
  state.running = autoStart;
  state.phase = autoStart ? "menu" : "ready";
  state.turn = wave + 1;
  state.wave = wave;
  state.heartMode = selectedBoss.heartModes[wave];
  const tuning = getWaveTuning(selectedBoss.id, wave);
  state.rateMult = tuning.rate;
  state.speedMult = tuning.speed;
  state.waveCap = tuning.cap;
  state.enemyTurnLength = tuning.length;
  applyArenaLayout(state.heartMode);
  state.player.x = arena.x + arena.w / 2;
  state.player.y = state.heartMode === "blue" ? arena.y + arena.h - state.player.r : arena.y + arena.h / 2;
  state.player.grounded = state.heartMode === "blue";
  waveName.textContent = selectedBoss.waves[wave];
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
  const difficultyCap = difficulty[difficultyKey].cap || (difficultyKey === "hard" ? 34 : 46);
  const cap = Math.min(difficultyCap, state.waveCap || difficultyCap);
  if (state.bullets.length >= cap && kind !== "beam" && kind !== "vine") return;
  state.bullets.push({ kind, age: 0, hit: false, ...data });
}

function every(key, interval, dt) {
  state.spawnTimers[key] = (state.spawnTimers[key] || 0) - dt;
  if (state.spawnTimers[key] <= 0) {
    state.spawnTimers[key] += interval / (difficulty[difficultyKey].rate * state.rateMult);
    return true;
  }
  return false;
}

function sequencedEvery(key, interval, dt, sequence) {
  if (!every(key, interval, dt)) return null;
  const index = sequenceIndex(interval) % sequence.length;
  return sequence[index];
}

function patternClock() {
  const d = difficulty[difficultyKey];
  return attackTime() * d.rate * state.rateMult;
}

function sequenceIndex(interval) {
  return Math.floor(patternClock() / interval);
}

function getAttackLeadIn() {
  if (state.phase !== "enemy") return 0;
  if (selectedBoss.id === "sans") return 0.45;
  if (selectedBoss.id === "omega" || selectedBoss.id === "asriel") return 0.78;
  return 0.62;
}

function attackTime() {
  return Math.max(0, state.waveT - getAttackLeadIn());
}

function attackProgress() {
  const activeLength = Math.max(1, state.enemyTurnLength - getAttackLeadIn());
  return clamp(attackTime() / activeLength, 0, 1);
}

function attackIntensity() {
  const p = attackProgress();
  if (p < 0.18) return (p / 0.18) * 0.38;
  if (p < 0.72) return 0.38 + ((p - 0.18) / 0.54) * 0.42;
  return 0.8 + ((p - 0.72) / 0.28) * 0.2;
}

function intensityRange(start, end) {
  return start + (end - start) * attackIntensity();
}

function startEnemyTurn(message, pressure = 1, command = null) {
  state.phase = "enemy";
  state.message = message;
  state.lastCommand = command;
  state.pressure = pressure;
  state.waveT = 0;
  state.bullets = [];
  state.shots = [];
  state.spawnTimers = {};
  state.wave = (state.turn - 1) % selectedBoss.waves.length;
  state.heartMode = selectedBoss.heartModes[state.wave];
  const tuning = getWaveTuning(selectedBoss.id, state.wave);
  state.rateMult = tuning.rate;
  state.speedMult = tuning.speed;
  state.waveCap = tuning.cap;
  state.enemyTurnLength = tuning.length;
  applyArenaLayout(state.heartMode);
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
  state.wave = (state.turn - 1) % selectedBoss.waves.length;
  state.heartMode = selectedBoss.heartModes[state.wave];
  const tuning = getWaveTuning(selectedBoss.id, state.wave);
  state.rateMult = tuning.rate;
  state.speedMult = tuning.speed;
  state.waveCap = tuning.cap;
  state.enemyTurnLength = tuning.length;
  applyArenaLayout(state.heartMode);
  state.player.x = arena.x + arena.w / 2;
  state.player.y = state.heartMode === "blue" ? arena.y + arena.h - state.player.r : arena.y + arena.h / 2;
  state.message = `Turn ${state.turn}. Mercy: ${Math.min(100, state.mercy)}%.`;
  syncTurnUi();
}

function chooseCommand(command) {
  if (!state.running || state.phase !== "menu" || state.over) return;
  if (command === "fight") {
    state.mercy = clamp(state.mercy + 18, 0, 100);
    startEnemyTurn(getPlayerCommandMessage("fight"), 1.14, "fight");
  }
  if (command === "act") {
    const act = selectedBoss.acts[(state.turn - 1) % selectedBoss.acts.length];
    state.mercy = clamp(state.mercy + 24, 0, 100);
    startEnemyTurn(`${getPlayerCommandMessage("act")} (${act}.)`, 0.88, "act");
  }
  if (command === "item") {
    const item = selectedBoss.items[state.itemIndex % selectedBoss.items.length];
    state.itemIndex++;
    state.hp = clamp(state.hp + item.heal, 0, maxHp);
    state.mercy = clamp(state.mercy + 8, 0, 100);
    syncHp();
    startEnemyTurn(`* You used ${item.name}. +${item.heal} HP.`, 1, "item");
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
    startEnemyTurn(getPlayerCommandMessage("spare"), 1.05, "spare");
  }
}

function getPlayerCommandMessage(command) {
  return playerCommandMessages[command]?.[selectedBoss.id] || `* ${selectedBoss.name} prepares the next attack.`;
}

function getWaveTuning(id, wave) {
  return waveTuning[id]?.[wave] || { rate: 1, speed: 1, length: 12, cap: 30 };
}

function firePlayerShot() {
  if (state.shotTimer > 0 || state.phase !== "enemy") return;
  state.shotTimer = soulPhysics.shotCooldown;
  state.shots.push({ x: state.player.x, y: state.player.y - 22, vy: soulPhysics.shotSpeed, hit: false });
}

function updateShots(dt) {
  for (const shot of state.shots) {
    shot.y += shot.vy * dt;
    for (const b of state.bullets) {
      if (b.kind === "beam" || b.kind === "vine" || shot.hit) continue;
      if (Math.hypot(shot.x - b.x, shot.y - b.y) < (b.r || 18) + 5) {
        if (b.kind === "bomb") {
          spawn("beam", {
            x: b.x,
            y: arena.y,
            vx: 0,
            vy: 0,
            r: 24,
            horizontal: false,
            warn: 0.08,
            life: 0.45,
          });
          spawn("beam", {
            x: arena.x,
            y: b.y,
            vx: 0,
            vy: 0,
            r: 24,
            horizontal: true,
            warn: 0.08,
            life: 0.32,
          });
          for (let i = 0; i < 4; i++) {
            const a = Math.PI / 4 + i * (Math.PI / 2);
            spawn("pellet", { x: b.x, y: b.y, vx: Math.cos(a) * 178, vy: Math.sin(a) * 178, r: 7, angle: a, spin: -2.4 });
          }
        }
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
  if (state.waveT < getAttackLeadIn()) {
    timeLeft.textContent = Math.max(0, state.enemyTurnLength - state.waveT).toFixed(1);
    syncTurnUi();
    return;
  }
  runPattern(dt);

  for (const b of state.bullets) {
    b.age += dt;
    if (b.delay && b.delay > 0) {
      b.delay = Math.max(0, b.delay - dt);
      continue;
    }
    const bulletSpeed = d.speed * state.speedMult;
    b.x += (b.vx || 0) * dt * bulletSpeed;
    b.y += (b.vy || 0) * dt * bulletSpeed;
    if (b.spin) b.angle = (b.angle || 0) + b.spin * dt;

    if (state.heartMode === "green" && shieldBlocks(b)) {
      b.hit = true;
      state.effects.push({ x: state.player.x, y: state.player.y, age: 0, block: true });
      continue;
    }

    if (b.kind === "arrow" && state.heartMode === "green" && arrowReachedSoul(b)) {
      if (state.player.shieldDir === b.dir) {
        b.hit = true;
        state.effects.push({ x: state.player.x, y: state.player.y, age: 0, block: true });
      } else {
        damagePlayer(d.damage);
        b.hit = true;
      }
      continue;
    }

    if (touching(b) && state.player.inv <= 0) {
      damagePlayer(d.damage);
    }
  }

  state.effects.forEach((e) => (e.age += dt));
  state.effects = state.effects.filter((e) => e.age < 0.45);
  state.bullets = state.bullets.filter((b) => !b.hit && !outside(b));
  state.shots = state.shots.filter((s) => s.y > arena.y - 70 && !s.hit);
  timeLeft.textContent = Math.max(0, state.enemyTurnLength - state.waveT).toFixed(1);
  syncTurnUi();
}

function damagePlayer(amount) {
  if (state.player.inv > 0) return;
  state.hp -= amount;
  state.player.inv = 1.0;
  state.effects.push({ x: state.player.x, y: state.player.y, age: 0, block: false });
  syncHp();
  if (state.hp <= 0) {
    state.over = true;
    state.running = false;
    stopMusic();
  }
}

function arrowReachedSoul(b) {
  return Math.hypot(state.player.x - b.x, state.player.y - b.y) < 34;
}

function movePlayer(dt) {
  const slow = keys.has("Shift") ? soulPhysics.focusMult : 1;
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
    p.x = arena.x + arena.w / 2;
    p.y = arena.y + arena.h / 2;
    p.vy = 0;
    p.grounded = false;
    return;
  }

  if (state.heartMode === "blue") {
    const blueSpeed = soulPhysics.blueSpeed * slow;
    p.x = clamp(p.x + dx * blueSpeed * dt, arena.x + p.r, arena.x + arena.w - p.r);
    p.vy += soulPhysics.gravity * dt;
    if (dy < 0 && p.grounded) {
      p.vy = soulPhysics.jump;
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

  const speed = (state.heartMode === "yellow" ? soulPhysics.yellowSpeed : soulPhysics.redSpeed) * slow;
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
  if (state.wave === 0) {
    const progress = attackIntensity();
    const interval = 0.56 - progress * 0.18;
    const arrowSpeed = 246 + progress * 88;
    const chordStep = 0.12 - progress * 0.05;
    const chord = sequencedEvery("spear-rain", interval, dt, [
      "up",
      "left",
      "right",
      "down",
      "left",
      "up",
      "up right",
      "down left",
      "right",
      "up",
      "right left",
      "down",
      "left up",
    ]);
    if (chord) spawnUndyneArrowChord(arrowSpeed, chord.split(" "), chordStep);
  }
  if (state.wave === 1 && every("cross-lances", 0.5, dt)) {
    const index = sequenceIndex(0.5);
    const lane = [0.18, 0.36, 0.64, 0.82, 0.5, 0.28, 0.72][index % 7];
    const fromLeft = index % 2 === 0;
    spawn("spear", { x: fromLeft ? arena.x - 35 : arena.x + arena.w + 35, y: arena.y + arena.h * lane, vx: fromLeft ? 372 : -372, vy: 0, r: 13, angle: fromLeft ? 0 : Math.PI, delay: intensityRange(0.28, 0.19) });
    if (index % 3 !== 1) {
      const x = arena.x + arena.w * ([0.24, 0.5, 0.76, 0.38, 0.62][index % 5]);
      spawn("spear", { x, y: arena.y - 35, vx: 0, vy: 326, r: 13, angle: Math.PI / 2, delay: intensityRange(0.32, 0.23) });
    }
  }
  if (state.wave === 2 && every("cyclone", 0.34 - attackIntensity() * 0.06, dt)) {
    const angle = patternClock() * 3.2;
    const radiusX = arena.w / 2 + 36;
    const radiusY = arena.h / 2 + 36;
    const x = arena.x + arena.w / 2 + Math.cos(angle) * radiusX;
    const y = arena.y + arena.h / 2 + Math.sin(angle) * radiusY;
    const toward = Math.atan2(state.player.y - y, state.player.x - x);
    const speed = 248 + attackIntensity() * 56;
    spawn("spear", { x, y, vx: Math.cos(toward) * speed, vy: Math.sin(toward) * speed, r: 12, angle: toward, delay: intensityRange(0.24, 0.16) });
  }
  if (state.wave === 2 && every("cyclone-guard-chord", 0.72 - attackIntensity() * 0.08, dt)) {
    const chords = ["up right", "down left", "left up", "right down", "up down", "left right"];
    const chord = chords[sequenceIndex(0.72 - attackIntensity() * 0.08) % chords.length];
    spawnUndyneArrowChord(236 + attackIntensity() * 66, chord.split(" "), Math.max(0.055, 0.1 - attackIntensity() * 0.035));
  }
  if (state.wave === 2 && every("undyne-guard-ladder", 1.18 - attackIntensity() * 0.1, dt)) {
    const ladders = ["up left down", "right up left", "down right up", "left down right"];
    const ladder = ladders[sequenceIndex(1.18 - attackIntensity() * 0.1) % ladders.length];
    spawnUndyneArrowChord(258 + attackIntensity() * 58, ladder.split(" "), Math.max(0.065, 0.12 - attackIntensity() * 0.03));
  }
}

function spawnUndyneArrowChord(speed, dirs, step = 0.14) {
  dirs.forEach((dir, index) => spawnUndyneArrow(speed, dir, index * step));
}

function spawnUndyneArrow(speed, forcedDir = null, delay = 0) {
  const p = state.player;
  const specs = {
    up: { x: p.x, y: arena.y - 36, vx: 0, vy: speed, angle: Math.PI / 2, dir: "up" },
    right: { x: arena.x + arena.w + 36, y: p.y, vx: -speed, vy: 0, angle: Math.PI, dir: "right" },
    down: { x: p.x, y: arena.y + arena.h + 36, vx: 0, vy: -speed, angle: -Math.PI / 2, dir: "down" },
    left: { x: arena.x - 36, y: p.y, vx: speed, vy: 0, angle: 0, dir: "left" },
  };
  const dir = forcedDir || ["up", "right", "down", "left"][sequenceIndex(0.5) % 4];
  spawn("arrow", { ...specs[dir], r: 13, delay });
}

function asgorePattern(dt) {
  const t = patternClock();
  const progress = attackIntensity();
  if (state.wave === 0 && every("embers", 0.3, dt)) {
    const index = sequenceIndex(0.3);
    const side = index % 2 === 0 ? -1 : 1;
    const y = arena.y + arena.h * ([0.18, 0.74, 0.36, 0.58, 0.26, 0.82][index % 6]);
    const kind = index % 5 === 1 ? "blueFire" : index % 5 === 3 ? "orangeFire" : "fire";
    spawn(kind, { x: arena.x + arena.w / 2 + side * 245, y, vx: -side * (150 + (index % 3) * 24), vy: Math.sin(t * 2 + index) * 34, r: 10 + (index % 3) * 2 });
  }
  if (state.wave === 0 && every("fire-ring", 1.4, dt)) {
    const skip = sequenceIndex(1.4) % 10;
    for (let i = 0; i < 10; i++) {
      if (i === skip || i === (skip + 1) % 10 || i === (skip + 9) % 10) continue;
      const a = (Math.PI * 2 * i) / 10 + t * 0.35;
      const kind = i % 4 === 0 ? "blueFire" : i % 4 === 2 ? "orangeFire" : "fire";
      spawn(kind, { x: arena.x + arena.w / 2, y: arena.y + arena.h / 2, vx: Math.cos(a) * 146, vy: Math.sin(a) * 146, r: 9 });
    }
  }
  if (state.wave === 0 && every("asgore-hand-sweep", 1.12 - progress * 0.1, dt)) {
    const index = sequenceIndex(1.12 - progress * 0.1);
    const safe = [0.24, 0.48, 0.72, 0.36, 0.62][index % 5];
    for (let i = 0; i < 5; i++) {
      const lane = 0.18 + i * 0.16;
      if (Math.abs(lane - safe) < 0.13) continue;
      const fromLeft = (i + index) % 2 === 0;
      const kind = i % 4 === 1 ? "blueFire" : i % 4 === 3 ? "orangeFire" : "fire";
      spawn(kind, {
        x: fromLeft ? arena.x - 28 : arena.x + arena.w + 28,
        y: arena.y + arena.h * lane,
        vx: fromLeft ? 214 + progress * 36 : -214 - progress * 36,
        vy: Math.sin(t * 3 + i) * (22 + progress * 8),
        r: 10,
      });
    }
  }
  if (state.wave >= 1) {
    const interval = state.wave === 2 ? 0.92 : 1.08;
    const lane = sequencedEvery("sweep", interval, dt, [0.24, 0.5, 0.76, 0.36, 0.64]);
    if (lane !== null) {
      const y = arena.y + arena.h * lane;
      spawn("trident", { x: arena.x - 60, y, vx: 472, vy: 0, r: 22, angle: 0, delay: intensityRange(0.48, 0.32) });
      if (state.wave === 2) spawn("trident", { x: arena.x + arena.w + 60, y: arena.y + arena.h * (1 - lane), vx: -472, vy: 0, r: 22, angle: Math.PI, delay: intensityRange(0.48, 0.32) });
    }
  }
  if (state.wave === 1 && every("asgore-trident-pinch", 1.36 - progress * 0.12, dt)) {
    const index = sequenceIndex(1.36 - progress * 0.12);
    const lane = [0.26, 0.74, 0.42, 0.58][index % 4];
    const y = arena.y + arena.h * lane;
    spawn("trident", { x: arena.x - 58, y, vx: 430 + progress * 46, vy: 0, r: 22, angle: 0, delay: intensityRange(0.44, 0.3) });
    spawn("trident", { x: arena.x + arena.w + 58, y: arena.y + arena.h * (1 - lane), vx: -430 - progress * 46, vy: 0, r: 22, angle: Math.PI, delay: intensityRange(0.44, 0.3) });
  }
  if (state.wave === 2 && every("flame-curtain", 0.42, dt)) {
    const gap = arena.x + arena.w * ([0.25, 0.5, 0.75, 0.4, 0.62][sequenceIndex(0.42) % 5]);
    for (let i = 0; i < 8; i++) {
      const x = arena.x + 24 + i * ((arena.w - 48) / 7);
      if (Math.abs(x - gap) < 42) continue;
      const kind = i % 5 === 0 ? "blueFire" : i % 5 === 3 ? "orangeFire" : "fire";
      spawn(kind, { x, y: arena.y - 28, vx: 0, vy: 196, r: 9 });
    }
    if (sequenceIndex(0.42) % 4 === 0) spawnAsgoreFireGrid(progress);
  } else if (state.wave >= 1 && every("side-embers", 0.5, dt)) {
    const index = sequenceIndex(0.5);
    const y = arena.y + arena.h * ([0.24, 0.48, 0.76, 0.36, 0.64][index % 5]);
    const fromLeft = index % 2 === 0;
    const kind = index % 4 === 1 ? "blueFire" : index % 4 === 3 ? "orangeFire" : "fire";
    spawn(kind, { x: fromLeft ? arena.x - 24 : arena.x + arena.w + 24, y, vx: fromLeft ? 184 + progress * 18 : -184 - progress * 18, vy: 0, r: 10 });
  }
}

function spawnAsgoreFireGrid(progress) {
  const safe = sequenceIndex(1.68) % 4;
  for (let row = 0; row < 4; row++) {
    if (row === safe) continue;
    const y = arena.y + arena.h * (0.2 + row * 0.2);
    const fromLeft = row % 2 === 0;
    const kind = row % 3 === 0 ? "blueFire" : row % 3 === 1 ? "orangeFire" : "fire";
    spawn(kind, { x: fromLeft ? arena.x - 24 : arena.x + arena.w + 24, y, vx: fromLeft ? 238 + progress * 32 : -238 - progress * 32, vy: 0, r: 10 });
  }
}

function disbeliefPattern(dt) {
  const progress = attackIntensity();
  const boneInterval = state.wave === 0 ? 0.5 - progress * 0.1 : 0.4 - progress * 0.07;
  if (every("bones", boneInterval, dt)) {
    const lanes = [0.28, 0.48, 0.68, 0.38, 0.58];
    const index = sequenceIndex(boneInterval);
    const gap = arena.y + arena.h * lanes[index % lanes.length];
    const fromLeft = index % 2 === 0;
    const speed = 248 + progress * 46;
    const gapSize = state.wave === 0 ? 78 : 72;
    spawn("bone", { x: fromLeft ? arena.x - 30 : arena.x + arena.w + 30, y: gap - gapSize, vx: fromLeft ? speed : -speed, vy: 0, r: 16, h: 86 });
    spawn("bone", { x: fromLeft ? arena.x - 30 : arena.x + arena.w + 30, y: gap + gapSize, vx: fromLeft ? speed : -speed, vy: 0, r: 16, h: 86 });
  }
  if (state.wave >= 1) {
    const blueInterval = 0.78 - progress * 0.08;
    const xFrac = sequencedEvery("blue", blueInterval, dt, [0.18, 0.35, 0.52, 0.7, 0.86]);
    if (xFrac !== null) spawn("blueBone", { x: arena.x + arena.w * xFrac, y: arena.y - 28, vx: 0, vy: 268 + progress * 30, r: 14, h: 58 });
  }
  const wallInterval = 1.22 - progress * 0.12;
  if (state.wave === 2 && every("slam", wallInterval, dt)) {
    const gap = sequenceIndex(wallInterval) % 7;
    spawnBoneWallFromBottom(gap, 7, 272 + progress * 28, [54, 74, 64], 1);
  }
  if (state.wave === 2 && every("disbelief-bone-fan", 0.96 - progress * 0.1, dt)) {
    const index = sequenceIndex(0.96 - progress * 0.1);
    const safe = index % 5;
    for (let i = 0; i < 5; i++) {
      if (i === safe || i === (safe + 1) % 5) continue;
      const x = arena.x + arena.w * (0.16 + i * 0.17);
      const kind = i % 2 === 0 ? "blueBone" : "bone";
      spawn(kind, { x, y: arena.y - 34, vx: (i - 2) * (18 + progress * 8), vy: 286 + progress * 34, r: 13, h: 64 + (i % 2) * 20 });
    }
  }
}

function bttPattern(dt) {
  const progress = attackIntensity();
  undynePattern(dt);
  const fireInterval = 0.92 - progress * 0.14;
  if (every("small-fire", fireInterval, dt)) {
    const index = sequenceIndex(fireInterval);
    const side = index % 4;
    const lane = [0.22, 0.78, 0.38, 0.62, 0.5][index % 5];
    const x = side === 0 ? arena.x - 20 : side === 1 ? arena.x + arena.w + 20 : arena.x + arena.w * lane;
    const y = side === 2 ? arena.y - 20 : side === 3 ? arena.y + arena.h + 20 : arena.y + arena.h * lane;
    const a = Math.atan2(state.player.y - y, state.player.x - x);
    spawn("fire", { x, y, vx: Math.cos(a) * (186 + progress * 30), vy: Math.sin(a) * (186 + progress * 30), r: 9 });
  }
  if (state.wave >= 1) spawnBlasterLine("blaster", 1.9 - progress * 0.18, dt, 0.5);
  const bttBoneInterval = 0.78 - progress * 0.08;
  if (state.wave === 2 && every("btt-bones", bttBoneInterval, dt)) {
    const x = arena.x + arena.w * ([0.18, 0.38, 0.58, 0.78, 0.48][sequenceIndex(bttBoneInterval) % 5]);
    spawn("blueBone", { x, y: arena.y - 34, vx: 0, vy: 280 + progress * 24, r: 15, h: 70 });
  }
  if (state.wave === 2 && every("btt-sync-burst", 1.34 - progress * 0.12, dt)) {
    const index = sequenceIndex(1.34 - progress * 0.12);
    const safe = [0.25, 0.5, 0.75][index % 3];
    for (const lane of [0.2, 0.4, 0.6, 0.8]) {
      if (Math.abs(lane - safe) < 0.16) continue;
      spawn("beam", { x: arena.x + arena.w * lane, y: arena.y, vx: 0, vy: 0, r: 24, horizontal: false, warn: intensityRange(0.5, 0.36), life: 0.82 });
    }
    spawn("fire", { x: arena.x - 22, y: arena.y + arena.h * safe, vx: 236 + progress * 34, vy: 0, r: 9 });
    spawn("spear", { x: arena.x + arena.w + 34, y: arena.y + arena.h * (1 - safe), vx: -286 - progress * 36, vy: 0, r: 12, angle: Math.PI, delay: intensityRange(0.28, 0.18) });
  }
}

function spawnBlasterLine(key, interval, dt, biasHorizontal = 0.5) {
  if (!every(key, interval, dt)) return;
  const index = sequenceIndex(interval);
  const horizontal = index % 4 < Math.round(biasHorizontal * 4);
  const hLanes = [0.28, 0.56, 0.74, 0.42];
  const vLanes = [0.2, 0.8, 0.5, 0.34, 0.66];
  spawn("beam", {
    x: horizontal ? arena.x : arena.x + arena.w * vLanes[index % vLanes.length],
    y: horizontal ? arena.y + arena.h * hLanes[index % hLanes.length] : arena.y,
    vx: 0,
    vy: 0,
    r: 24,
    horizontal,
    warn: intensityRange(0.58, 0.44),
    life: 0.96,
  });
}

function spawnBlaster(biasHorizontal = 0.5) {
  const index = sequenceIndex(0.9);
  const horizontal = index % 4 < Math.round(biasHorizontal * 4);
  const xLane = [0.22, 0.42, 0.62, 0.82, 0.34, 0.7][index % 6];
  const yLane = [0.3, 0.5, 0.7, 0.4, 0.6][index % 5];
  spawn("beam", {
    x: horizontal ? arena.x : arena.x + arena.w * xLane,
    y: horizontal ? arena.y + arena.h * yLane : arena.y,
    vx: 0,
    vy: 0,
    r: 24,
    horizontal,
    warn: intensityRange(0.56, 0.42),
    life: 0.96,
  });
}

function sansPattern(dt) {
  const progress = attackIntensity();
  const boneInterval = state.wave === 0 ? 0.46 - progress * 0.08 : 0.38 - progress * 0.05;
  if (every("sans-bones", boneInterval, dt)) {
    const heights = state.wave === 0 ? [38, 62, 96, 48, 122, 72, 42, 104] : [44, 74, 112, 56, 132, 84, 48, 104];
    const index = sequenceIndex(boneInterval);
    const h = heights[index % heights.length];
    const speed = 258 + progress * 54;
    spawn("bone", { x: arena.x + arena.w + 28, y: arena.y + arena.h - h / 2, vx: -speed - 12, vy: 0, r: 14, h });
    if (state.wave >= 1 && index % 3 !== 1) spawn("bone", { x: arena.x - 28, y: arena.y + h / 2, vx: speed, vy: 0, r: 14, h: Math.max(42, h * 0.62) });
  }
  if (state.wave === 0 && every("sans-low-high-wall", 1.05 - progress * 0.08, dt)) {
    const index = sequenceIndex(1.05 - progress * 0.08);
    const gap = [1, 4, 6, 2, 5][index % 5];
    if (index % 2 === 0) {
      spawnBoneWallFromBottom(gap, 8, 240 + progress * 30, [46, 78, 56, 96], 2);
    } else {
      spawnBoneWallFromTop(gap, 8, 230 + progress * 28, [40, 68, 52, 84]);
      spawnBoneWallFromBottom((gap + 4) % 8, 8, 224 + progress * 24, [34, 56, 44], 1);
    }
  }
  if (state.wave >= 1) {
    const xFrac = sequencedEvery("sans-blue", 0.8, dt, [0.2, 0.42, 0.64, 0.82, 0.34, 0.56]);
    if (xFrac !== null) spawn("blueBone", { x: arena.x + arena.w * xFrac, y: arena.y - 34, vx: 0, vy: 288, r: 14, h: 70 });
  }
  if (state.wave >= 1 && every("sans-slam", 1.42 - progress * 0.1, dt)) {
    const slam = sequenceIndex(1.42 - progress * 0.1) % 4;
    const pushX = slam === 0 ? arena.x + state.player.r : slam === 1 ? arena.x + arena.w - state.player.r : state.player.x;
    const pushY = slam === 2 ? arena.y + state.player.r : arena.y + arena.h - state.player.r;
    state.player.x = clamp(pushX, arena.x + state.player.r, arena.x + arena.w - state.player.r);
    state.player.y = clamp(pushY, arena.y + state.player.r, arena.y + arena.h - state.player.r);
    state.player.vy = slam === 2 ? 120 : 0;
    state.effects.push({ x: state.player.x, y: state.player.y, age: 0, block: false });
    const gap = [2, 5, 1, 6][slam];
    if (slam < 2) spawnBoneWallFromTop(gap, 8, 250 + progress * 24, [42, 68, 54], 2);
    else spawnBoneWallFromBottom(gap, 8, 260 + progress * 22, [46, 76, 58], 1);
  }
  if (state.wave === 2) {
    const xFrac = sequencedEvery("sans-orange", 1.08, dt, [0.16, 0.5, 0.84, 0.36]);
    if (xFrac !== null) spawn("orangeBone", { x: arena.x + arena.w * xFrac, y: arena.y - 34, vx: 0, vy: 268, r: 14, h: 64 });
  }
  if (state.wave === 2) {
    const beam = sequencedEvery("sans-beam", 0.95, dt, ["h", "v", "h", "v"]);
    if (beam) {
      const laneIndex = sequenceIndex(0.95) % 2;
      spawn("beam", {
        x: beam === "h" ? arena.x : arena.x + arena.w * ([0.28, 0.72][laneIndex]),
        y: beam === "h" ? arena.y + arena.h * ([0.34, 0.66][laneIndex]) : arena.y,
        vx: 0,
        vy: 0,
        r: 24,
        horizontal: beam === "h",
        warn: intensityRange(0.46, 0.34),
        life: 0.88,
      });
    }
  }
  if (state.wave === 2 && every("sans-cross-beam", 1.9 - progress * 0.14, dt)) {
    const index = sequenceIndex(1.9 - progress * 0.14);
    const safeV = [0.2, 0.5, 0.8][index % 3];
    const safeH = [0.3, 0.7, 0.48][index % 3];
    for (const lane of [0.2, 0.5, 0.8]) {
      if (Math.abs(lane - safeV) < 0.04) continue;
      spawn("beam", { x: arena.x + arena.w * lane, y: arena.y, vx: 0, vy: 0, r: 24, horizontal: false, warn: intensityRange(0.5, 0.36), life: 0.82 });
    }
    for (const lane of [0.3, 0.5, 0.7]) {
      if (Math.abs(lane - safeH) < 0.04) continue;
      spawn("beam", { x: arena.x, y: arena.y + arena.h * lane, vx: 0, vy: 0, r: 24, horizontal: true, warn: intensityRange(0.54, 0.38), life: 0.82 });
    }
  }
  if (state.wave === 2 && every("sans-floor-ceiling", 1.28, dt)) {
    const gap = sequenceIndex(1.28) % 8;
    spawnBoneWallFromBottom(gap, 8, 236, [52, 92, 68], 1);
    spawnBoneWallFromTop((gap + 4) % 8, 8, 226, [48, 78, 62]);
  }
}

function spawnBoneWallFromBottom(gap, count, speed, heights, orangeOffset = -1) {
  for (let i = 0; i < count; i++) {
    if (i === gap || i === (gap + 1) % count) continue;
    const x = arena.x + 24 + i * ((arena.w - 48) / Math.max(1, count - 1));
    const kind = i % 3 === orangeOffset ? "orangeBone" : "bone";
    spawn(kind, { x, y: arena.y + arena.h + 34, vx: 0, vy: -speed, r: 13, h: heights[i % heights.length] });
  }
}

function spawnBoneWallFromTop(gap, count, speed, heights, orangeOffset = -1) {
  for (let i = 0; i < count; i++) {
    if (i === gap || i === (gap + count - 1) % count) continue;
    const x = arena.x + 24 + i * ((arena.w - 48) / Math.max(1, count - 1));
    const kind = i % 3 === orangeOffset ? "orangeBone" : "bone";
    spawn(kind, { x, y: arena.y - 34, vx: 0, vy: speed, r: 13, h: heights[i % heights.length] });
  }
}

function undyingPattern(dt) {
  const progress = attackIntensity();
  const aimedInterval = state.heartMode === "green" ? 0.34 - progress * 0.08 : 0.3 - progress * 0.05;
  if (every("undying-aimed", aimedInterval, dt)) {
    if (state.heartMode === "green") {
      const chords = [
        "up",
        "right",
        "left",
        "down",
        "up right",
        "left down",
        "right up",
        "down left",
        "up right down",
        "left up right",
        "down left up",
      ];
      const chord = chords[sequenceIndex(aimedInterval) % chords.length];
      spawnUndyneArrowChord(286 + progress * 66, chord.split(" "), Math.max(0.04, 0.085 - progress * 0.035));
    }
    else {
      const index = sequenceIndex(aimedInterval);
      const edge = index % 4;
      const lanes = [0.18, 0.34, 0.52, 0.7, 0.86, 0.42, 0.62];
      const lane = lanes[index % lanes.length];
      const x = edge === 0 ? arena.x - 36 : edge === 1 ? arena.x + arena.w + 36 : arena.x + arena.w * lane;
      const y = edge === 2 ? arena.y - 36 : edge === 3 ? arena.y + arena.h + 36 : arena.y + arena.h * lane;
      const a = Math.atan2(state.player.y - y, state.player.x - x);
      spawn("spear", { x, y, vx: Math.cos(a) * (298 + progress * 42), vy: Math.sin(a) * (298 + progress * 42), r: 12, angle: a, delay: intensityRange(0.2, 0.13) });
    }
  }
  const crossInterval = 0.58 - progress * 0.06;
  if (state.wave >= 1 && every("undying-cross", crossInterval, dt)) {
    const index = sequenceIndex(crossInterval);
    spawn("spear", { x: arena.x + arena.w * ([0.2, 0.42, 0.68, 0.84, 0.34, 0.58][index % 6]), y: arena.y - 35, vx: 0, vy: 314 + progress * 32, r: 12, angle: Math.PI / 2, delay: intensityRange(0.24, 0.16) });
    if (index % 3 !== 1) spawn("spear", { x: arena.x - 35, y: arena.y + arena.h * ([0.26, 0.52, 0.76][index % 3]), vx: 328 + progress * 30, vy: 0, r: 12, angle: 0, delay: intensityRange(0.28, 0.18) });
  }
  if (state.wave === 1 && every("undying-guard-ladder", 1.04 - progress * 0.08, dt)) {
    const ladders = ["up right down", "left up right", "down left up", "right down left"];
    const ladder = ladders[sequenceIndex(1.04 - progress * 0.08) % ladders.length];
    spawnUndyneArrowChord(300 + progress * 58, ladder.split(" "), Math.max(0.045, 0.082 - progress * 0.025));
  }
  if (state.wave === 2 && every("undying-ring-salvo", 1.12 - progress * 0.1, dt)) {
    const index = sequenceIndex(1.12 - progress * 0.1);
    const skip = index % 10;
    const cx = arena.x + arena.w / 2;
    const cy = arena.y + arena.h / 2;
    const radius = Math.max(arena.w, arena.h) / 2 + 42;
    for (let i = 0; i < 10; i++) {
      if (i === skip || i === (skip + 1) % 10 || i === (skip + 9) % 10) continue;
      const a = (Math.PI * 2 * i) / 10 + patternClock() * 0.18;
      const x = cx + Math.cos(a) * radius;
      const y = cy + Math.sin(a) * radius;
      const toward = Math.atan2(cy - y, cx - x);
      spawn("spear", { x, y, vx: Math.cos(toward) * (252 + progress * 48), vy: Math.sin(toward) * (252 + progress * 48), r: 12, angle: toward, delay: intensityRange(0.3, 0.2) });
    }
  }
}

function omegaPattern(dt) {
  const t = patternClock();
  const progress = attackIntensity();
  const petalInterval = 0.36 - progress * 0.08;
  const pelletLaneInterval = 0.5 - progress * 0.05;
  if (state.wave === 0 && every("omega-petal", petalInterval, dt)) {
    const lanes = [0.18, 0.34, 0.5, 0.66, 0.82, 0.42, 0.58];
    const index = sequenceIndex(petalInterval);
    const x = arena.x + arena.w * lanes[index % lanes.length];
    spawn("petal", { x, y: arena.y - 26, vx: Math.sin(t * 5) * (34 + progress * 22), vy: 212 + progress * 42, r: 12, angle: Math.PI / 2, spin: 2.2 });
    if (index % 3 === 0) {
      const side = x < arena.x + arena.w / 2 ? arena.x + arena.w + 26 : arena.x - 26;
      const toward = Math.atan2(state.player.y - arena.y - arena.h * 0.5, state.player.x - side);
      spawn("petal", { x: side, y: arena.y + arena.h * 0.5, vx: Math.cos(toward) * 184, vy: Math.sin(toward) * 184, r: 12, angle: toward, spin: 2.2 });
    }
  }
  if (state.wave === 0 && every("omega-burst", 1.55, dt)) {
    const skip = sequenceIndex(1.55) % 14;
    for (let i = 0; i < 14; i++) {
      if (i === skip || i === (skip + 1) % 14 || i === (skip + 13) % 14 || i === (skip + 2) % 14) continue;
      const a = (Math.PI * 2 * i) / 14 - t * 0.28;
      spawn("pellet", { x: arena.x + arena.w / 2, y: arena.y + arena.h * 0.44, vx: Math.cos(a) * 148, vy: Math.sin(a) * 148, r: 7, angle: a, spin: -2.1 });
    }
  }
  if (state.wave === 0 && every("omega-petal-fan", 1.08 - progress * 0.08, dt)) {
    const index = sequenceIndex(1.08 - progress * 0.08);
    const safe = index % 7;
    const centerX = arena.x + arena.w / 2;
    for (let i = 0; i < 7; i++) {
      if (i === safe || i === (safe + 1) % 7) continue;
      const lane = 0.12 + i * 0.13;
      const fromTop = index % 2 === 0;
      const x = arena.x + arena.w * lane;
      const y = fromTop ? arena.y - 24 : arena.y + arena.h + 24;
      const toward = Math.atan2(arena.y + arena.h * 0.48 - y, centerX - x);
      spawn("petal", {
        x,
        y,
        vx: Math.cos(toward) * (164 + progress * 34),
        vy: Math.sin(toward) * (164 + progress * 34),
        r: 11,
        angle: toward,
        spin: fromTop ? 2.4 : -2.4,
        delay: i * 0.035,
      });
    }
  }
  if (state.wave >= 1) {
    const vineInterval = 0.92 - progress * 0.14;
    const vine = sequencedEvery("omega-vine", vineInterval, dt, ["v25", "h38", "v75", "h62", "v50", "h50"]);
    if (vine) {
      const horizontal = vine[0] === "h";
      const n = Number(vine.slice(1)) / 100;
      spawn("vine", {
        x: horizontal ? arena.x : arena.x + arena.w * n,
        y: horizontal ? arena.y + arena.h * n : arena.y,
        vx: 0,
        vy: 0,
        r: 24,
        horizontal,
        warn: intensityRange(0.62, 0.44),
        life: 0.9,
      });
    }
  }
  if (state.wave === 1 && every("omega-seeds", 0.58 - progress * 0.08, dt)) {
    const index = sequenceIndex(0.58 - progress * 0.08);
    const fromLeft = index % 2 === 0;
    const lanes = [0.18, 0.34, 0.5, 0.66, 0.82, 0.42, 0.58];
    const y = arena.y + arena.h * lanes[index % lanes.length];
    const arc = (index % 3) - 1;
    spawn("pellet", { x: fromLeft ? arena.x - 18 : arena.x + arena.w + 18, y, vx: fromLeft ? 176 + progress * 30 : -176 - progress * 30, vy: arc * (34 + progress * 12), r: 7, angle: fromLeft ? 0 : Math.PI, spin: -2.2 });
  }
  if (state.wave === 2 && every("omega-ring", 1.16, dt)) {
    const skip = sequenceIndex(1.16) % 12;
    for (let i = 0; i < 12; i++) {
      if (i === skip || i === (skip + 1) % 12 || i === (skip + 11) % 12) continue;
      const a = (Math.PI * 2 * i) / 12 + t * 0.45;
      spawn("pellet", { x: arena.x + arena.w / 2, y: arena.y + arena.h / 2, vx: Math.cos(a) * (178 + progress * 24), vy: Math.sin(a) * (178 + progress * 24), r: 8, angle: a, spin: -2.5 });
    }
  }
  if (state.wave === 2 && every("omega-spiral", 0.34 - progress * 0.05, dt)) {
    const index = sequenceIndex(0.34 - progress * 0.05);
    const origin = [
      [arena.x + 28, arena.y + 28],
      [arena.x + arena.w - 28, arena.y + 28],
      [arena.x + arena.w - 28, arena.y + arena.h - 28],
      [arena.x + 28, arena.y + arena.h - 28],
    ][Math.floor(index / 5) % 4];
    const angle = t * 1.9 + index * 0.82;
    spawn("pellet", { x: origin[0], y: origin[1], vx: Math.cos(angle) * (148 + progress * 38), vy: Math.sin(angle) * (148 + progress * 38), r: 7, angle, spin: -2.7 });
  }
  if (state.wave === 2 && every("omega-soul-relay", 0.9 - progress * 0.1, dt)) {
    const index = sequenceIndex(0.9 - progress * 0.1);
    const safe = index % 6;
    const cx = arena.x + arena.w / 2;
    const cy = arena.y + arena.h / 2;
    for (let i = 0; i < 6; i++) {
      if (i === safe || i === (safe + 1) % 6) continue;
      const a = (Math.PI * 2 * i) / 6 + t * 0.22;
      const x = cx + Math.cos(a) * (arena.w / 2 + 20);
      const y = cy + Math.sin(a) * (arena.h / 2 + 20);
      const toward = Math.atan2(cy - y, cx - x);
      const kind = i % 2 === 0 ? "diamond" : "pellet";
      spawn(kind, { x, y, vx: Math.cos(toward) * (170 + progress * 34), vy: Math.sin(toward) * (170 + progress * 34), r: kind === "diamond" ? 9 : 7, angle: toward, spin: kind === "diamond" ? -3.8 : -2.4 });
    }
  }
  if (state.wave === 2 && every("omega-vine-rake", 1.42 - progress * 0.12, dt)) {
    const index = sequenceIndex(1.42 - progress * 0.12);
    const safe = index % 4;
    for (let i = 0; i < 4; i++) {
      if (i === safe) continue;
      const y = arena.y + arena.h * ([0.22, 0.42, 0.62, 0.82][i]);
      spawn("vine", { x: arena.x, y, vx: 0, vy: 0, r: 24, horizontal: true, warn: intensityRange(0.6, 0.44), life: 0.82 });
    }
  } else if (state.wave >= 1 && every("omega-pellet-lanes", pelletLaneInterval, dt)) {
    const index = sequenceIndex(pelletLaneInterval);
    const fromLeft = index % 2 === 0;
    const y = arena.y + arena.h * ([0.25, 0.45, 0.65, 0.35, 0.75][index % 5]);
    spawn("pellet", { x: fromLeft ? arena.x - 18 : arena.x + arena.w + 18, y, vx: fromLeft ? 182 : -182, vy: 0, r: 8, angle: fromLeft ? 0 : Math.PI, spin: -2.5 });
  }
}

function asrielPattern(dt) {
  const t = patternClock();
  const progress = attackIntensity();
  const starInterval = state.wave === 0 ? 0.32 - progress * 0.06 : 0.42 - progress * 0.06;
  if (every("asriel-starfall", starInterval, dt)) {
    const lanes = [0.16, 0.3, 0.44, 0.58, 0.72, 0.86, 0.38, 0.66];
    const index = sequenceIndex(starInterval);
    const x = arena.x + arena.w * lanes[index % lanes.length];
    spawn("star", { x, y: arena.y - 24, vx: index % 2 ? 54 : -54, vy: (state.wave === 0 ? 220 : 258) + progress * 34, r: 12, spin: 3.2 });
  }
  if (state.wave === 0 && every("asriel-star-curtain", 1.28, dt)) {
    const gap = sequenceIndex(1.28) % 6;
    for (let i = 0; i < 6; i++) {
      if (i === gap) continue;
      const x = arena.x + 34 + i * ((arena.w - 68) / 5);
      spawn("star", { x, y: arena.y - 26, vx: i % 2 ? 30 : -30, vy: 188, r: 10, spin: 3.5, delay: i * 0.055 });
    }
  }
  if (state.wave >= 1) {
    const saberInterval = 0.98 - progress * 0.12;
    const lane = sequencedEvery("asriel-saber", saberInterval, dt, [0.24, 0.72, 0.42, 0.58]);
    if (lane !== null) {
      const fromLeft = sequenceIndex(saberInterval) % 2 === 0;
      spawn("saber", { x: fromLeft ? arena.x - 58 : arena.x + arena.w + 58, y: arena.y + arena.h * lane, vx: fromLeft ? 470 : -470, vy: 0, r: 22, angle: fromLeft ? 0 : Math.PI, delay: intensityRange(0.42, 0.28) });
    }
  }
  if (state.wave === 1 && every("asriel-saber-cross", 1.34 - progress * 0.1, dt)) {
    const index = sequenceIndex(1.34 - progress * 0.1);
    const lane = [0.3, 0.7, 0.48, 0.58][index % 4];
    spawn("saber", { x: arena.x - 58, y: arena.y + arena.h * lane, vx: 486 + progress * 38, vy: 0, r: 22, angle: 0, delay: intensityRange(0.38, 0.26) });
    if (index % 2 === 0) spawn("saber", { x: arena.x + arena.w + 58, y: arena.y + arena.h * (1 - lane), vx: -486 - progress * 38, vy: 0, r: 22, angle: Math.PI, delay: intensityRange(0.46, 0.32) });
  }
  if (state.wave === 2 && every("asriel-hope", 1.12, dt)) {
    const skip = sequenceIndex(1.12) % 8;
    for (let i = 0; i < 8; i++) {
      if (i === skip || i === (skip + 1) % 8) continue;
      const a = (Math.PI * 2 * i) / 8 - t * 0.55;
      spawn("diamond", { x: arena.x + arena.w / 2, y: arena.y + arena.h / 2, vx: Math.cos(a) * 174, vy: Math.sin(a) * 174, r: 10, spin: -4 });
    }
  }
  if (state.wave === 2 && every("asriel-dream-rain", 0.62 - progress * 0.08, dt)) {
    const index = sequenceIndex(0.62 - progress * 0.08);
    const lanes = [0.2, 0.36, 0.52, 0.68, 0.84, 0.44, 0.6];
    const x = arena.x + arena.w * lanes[index % lanes.length];
    spawn("diamond", { x, y: arena.y - 22, vx: index % 2 ? 34 : -34, vy: 220 + progress * 42, r: 9, spin: -3.6 });
  }
  if (state.wave === 2 && every("asriel-hope-gate", 1.06 - progress * 0.1, dt)) {
    const index = sequenceIndex(1.06 - progress * 0.1);
    const safe = index % 6;
    for (let i = 0; i < 6; i++) {
      if (i === safe || i === (safe + 1) % 6) continue;
      const x = arena.x + arena.w * (0.1 + i * 0.16);
      spawn("beam", { x, y: arena.y, vx: 0, vy: 0, r: 24, horizontal: false, warn: intensityRange(0.58, 0.42), life: 0.72 });
    }
    const x = arena.x + arena.w * (0.18 + ((safe + 3) % 6) * 0.12);
    spawn("diamond", { x, y: arena.y - 24, vx: (index % 2 ? 36 : -36), vy: 238 + progress * 42, r: 9, spin: -3.8, delay: intensityRange(0.16, 0.08) });
  }
  if (state.wave === 2 && every("asriel-shocker", 1.48 - progress * 0.14, dt)) {
    const index = sequenceIndex(1.48 - progress * 0.14);
    const safeColumn = index % 5;
    for (let i = 0; i < 5; i++) {
      if (i === safeColumn || i === (safeColumn + 1) % 5) continue;
      spawn("beam", {
        x: arena.x + arena.w * (0.14 + i * 0.18),
        y: arena.y,
        vx: 0,
        vy: 0,
        r: 24,
        horizontal: false,
        warn: intensityRange(0.7, 0.52),
        life: 0.88,
      });
    }
    if (index % 2 === 1) {
      const safeRow = [0.28, 0.62, 0.44][index % 3];
      for (const row of [0.26, 0.48, 0.7]) {
        if (Math.abs(row - safeRow) < 0.08) continue;
        spawn("beam", { x: arena.x, y: arena.y + arena.h * row, vx: 0, vy: 0, r: 24, horizontal: true, warn: intensityRange(0.78, 0.58), life: 0.84 });
      }
    }
  }
}

function mettatonPattern(dt) {
  const t = patternClock();
  const progress = attackIntensity();
  const spotInterval = state.wave === 2 ? 0.72 : 0.7 - progress * 0.08;
  const bombInterval = 0.42 - progress * 0.07;
  const legInterval = 0.6 - progress * 0.08;
  if (every("mettaton-spot", spotInterval, dt)) {
    const lanes = [0.2, 0.42, 0.64, 0.82, 0.36];
    spawn("beam", {
      x: arena.x + arena.w * lanes[sequenceIndex(spotInterval) % lanes.length],
      y: arena.y,
      vx: 0,
      vy: 0,
      r: 24,
      horizontal: false,
      warn: intensityRange(0.54, 0.4),
      life: 0.9,
    });
  }
  if (state.wave === 0 && every("mettaton-sweeping-spot", 1.5, dt)) {
    const y = arena.y + arena.h * ([0.28, 0.5, 0.72, 0.42][sequenceIndex(1.5) % 4]);
    spawn("beam", { x: arena.x, y, vx: 0, vy: 0, r: 24, horizontal: true, warn: intensityRange(0.68, 0.52), life: 0.9 });
  }
  if (state.wave >= 1 && every("mettaton-bombs", bombInterval, dt)) {
    const index = sequenceIndex(bombInterval);
    const kind = index % 4 === 1 ? "box" : "bomb";
    const lanes = [0.18, 0.34, 0.5, 0.66, 0.82];
    const x = arena.x + arena.w * lanes[index % lanes.length];
    const sway = kind === "bomb" ? Math.sin(t * 5) * 46 : Math.sin(t * 3 + index) * 26;
    spawn(kind, { x, y: arena.y - 24, vx: sway, vy: (kind === "bomb" ? 204 : 184) + (index % 3) * 22 + progress * 22, r: 13, spin: 5 });
  }
  if (state.wave === 1 && every("mettaton-box-wall", 1.22 - progress * 0.08, dt)) {
    const gap = sequenceIndex(1.22 - progress * 0.08) % 5;
    for (let i = 0; i < 5; i++) {
      if (i === gap || i === (gap + 1) % 5) continue;
      const x = arena.x + arena.w * (0.14 + i * 0.18);
      spawn("box", { x, y: arena.y - 24, vx: 0, vy: 176 + progress * 26, r: 13, spin: 4 });
    }
  }
  if (state.wave === 2 && every("mettaton-rush", legInterval, dt)) {
    const y = arena.y + arena.h * ([0.22, 0.44, 0.68, 0.82, 0.36][sequenceIndex(legInterval) % 5]);
    spawn("leg", { x: arena.x + arena.w + 45, y, vx: -482, vy: 0, r: 22, angle: Math.PI, delay: intensityRange(0.32, 0.23) });
  }
  if (state.wave === 2 && every("mettaton-ratings-lane", 1.18 - progress * 0.1, dt)) {
    const index = sequenceIndex(1.18 - progress * 0.1);
    const safe = index % 5;
    for (let i = 0; i < 5; i++) {
      const laneX = arena.x + arena.w * (0.14 + i * 0.18);
      if (i === safe || i === (safe + 1) % 5) continue;
      spawn("beam", { x: laneX, y: arena.y, vx: 0, vy: 0, r: 24, horizontal: false, warn: intensityRange(0.48, 0.34), life: 0.72 });
    }
    const row = [0.24, 0.42, 0.6, 0.78][index % 4];
    const fromLeft = index % 2 === 0;
    spawn("pellet", { x: fromLeft ? arena.x - 18 : arena.x + arena.w + 18, y: arena.y + arena.h * row, vx: fromLeft ? 246 + progress * 34 : -246 - progress * 34, vy: 0, r: 8, angle: fromLeft ? 0 : Math.PI, spin: 3.2 });
  }
  if (state.wave === 2 && every("mettaton-ratings-pellets", 0.34 - progress * 0.05, dt)) {
    const index = sequenceIndex(0.34 - progress * 0.05);
    const lanes = [0.16, 0.3, 0.44, 0.58, 0.72, 0.86, 0.38, 0.66];
    const x = arena.x + arena.w * lanes[index % lanes.length];
    const sway = index % 2 === 0 ? 42 : -42;
    spawn("pellet", { x, y: arena.y - 18, vx: sway, vy: 218 + progress * 42, r: 7, angle: Math.PI / 2, spin: 3.2 });
  }
}

function touching(b) {
  const p = state.player;
  if (state.heartMode === "green" && shieldBlocks(b)) return false;
  if (b.kind === "arrow") {
    return orientedRectCircle(b.x, b.y, b.angle || 0, projectileHitboxes.arrow.w, projectileHitboxes.arrow.h, p.x, p.y, p.r);
  }
  if (b.kind === "beam" || b.kind === "vine") {
    if (b.age < b.warn) return false;
    const thickness = projectileHitboxes[b.kind].thickness;
    return b.horizontal ? Math.abs(p.y - b.y) < thickness : Math.abs(p.x - b.x) < thickness;
  }
  if (b.kind === "bone" || b.kind === "blueBone" || b.kind === "orangeBone") {
    const moving = playerIsTryingToMove();
    if (b.kind === "blueBone" && !moving) return false;
    if (b.kind === "orangeBone" && moving) return false;
    const width = projectileHitboxes.bone.w;
    return rectCircle(b.x - width / 2, b.y - b.h / 2, width, b.h, p.x, p.y, p.r);
  }
  if (b.kind === "spear" || b.kind === "trident" || b.kind === "saber" || b.kind === "leg") {
    const hitbox = projectileHitboxes[b.kind];
    return orientedRectCircle(b.x, b.y, b.angle || 0, hitbox.w, hitbox.h, p.x, p.y, p.r);
  }
  if (b.kind === "box") {
    const hitbox = projectileHitboxes.box;
    return rectCircle(b.x - hitbox.w / 2, b.y - hitbox.h / 2, hitbox.w, hitbox.h, p.x, p.y, p.r);
  }
  const profile = projectileHitboxes[b.kind];
  const scale = profile?.scale || 0.82;
  if (b.kind === "blueFire" && !playerIsTryingToMove()) return false;
  if (b.kind === "orangeFire" && playerIsTryingToMove()) return false;
  return Math.hypot(p.x - b.x, p.y - b.y) < p.r + (b.r || 10) * scale;
}

function playerIsTryingToMove() {
  return keys.has("ArrowLeft") || keys.has("ArrowRight") || keys.has("ArrowUp") || keys.has("ArrowDown") || keys.has("a") || keys.has("d") || keys.has("w") || keys.has("s");
}

function shieldBlocks(b) {
  const p = state.player;
  if (b.kind === "arrow") return arrowReachedSoul(b) && p.shieldDir === b.dir;
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

function orientedRectCircle(cx, cy, angle, w, h, px, py, pr) {
  const cos = Math.cos(-angle);
  const sin = Math.sin(-angle);
  const dx = px - cx;
  const dy = py - cy;
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;
  return rectCircle(-w / 2, -h / 2, w, h, localX, localY, pr);
}

function outside(b) {
  if (b.kind === "beam" || b.kind === "vine") return b.age > b.life;
  return b.x < arena.x - 120 || b.x > arena.x + arena.w + 120 || b.y < arena.y - 120 || b.y > arena.y + arena.h + 120;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackdrop();
  drawBoss();
  drawBossSpeechBox();
  drawArena();
  drawArenaModeDetails();
  drawSoulRuleHint();
  drawAttackLeadInCue();
  drawSoulModeCallout();
  drawPacingHint();
  drawBullets();
  drawShots();
  drawEffects();
  drawPlayer();
  drawNarrationBox();
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
  const placement = bossStagePlacement[selectedBoss.id] || { x: 0, y: 130, bob: 2 };
  ctx.save();
  ctx.translate(canvas.width / 2 + placement.x, placement.y + Math.sin(state.t * 4) * placement.bob);
  drawBossStageCues(selectedBoss.id);
  if (!drawBossImage(selectedBoss.id)) {
    drawTileBoss(selectedBoss.id);
    drawBossSignature(selectedBoss.id);
  }
  drawBossNameplate();
  ctx.restore();
}

function drawBossStageCues(id) {
  ctx.save();
  ctx.globalAlpha = 0.46;
  if (id === "sans") {
    drawStageBones(-190, 45, 380, "#ffffff");
    drawStageBlaster(155, -54, 0.9);
    cueStageBlock(10, -82, 10, 10, "#57d6ff");
  } else if (id === "disbelief") {
    drawStageBones(-205, 58, 410, "#ffffff");
    drawStageBoneSpear(-155, 36, -80, -82, "#ffffff");
    drawStageBoneSpear(150, 45, 70, -86, "#ffffff");
    cueStageLine(2, -116, 116, -136, "#ffd166", 5);
  } else if (id === "btt") {
    drawStageBones(-210, 62, 420, "#ffffff");
    drawStageBlaster(0, -70, 0.76);
    drawStageSpear(-168, 40, -106, -72, "#80ed99");
    drawStageSpear(174, 44, 102, -74, "#57d6ff");
  } else if (id === "undyne" || id === "undying") {
    const color = id === "undying" ? "#80ed99" : "#57d6ff";
    for (let i = -2; i <= 2; i++) {
      drawStageSpear(-210, i * 24, -118, i * 12 - 78, color);
      drawStageSpear(210, i * 24, 118, i * 12 - 78, color);
    }
    if (id === "undying") {
      cueStageBlock(-18, 48, 36, 24, "#ff3855");
      cueStageLine(-64, 60, 64, 60, "#80ed99", 7);
    }
  } else if (id === "asgore") {
    drawStageTrident(152, -8);
    for (let i = 0; i < 7; i++) drawStageFlame(-175 + i * 58, 58 + Math.sin(state.t * 4 + i) * 5);
  } else if (id === "omega") {
    for (let i = 0; i < 4; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      cueStageLine(side * (120 + i * 18), -50 + i * 20, side * (210 - i * 8), 66 + i * 12, "#80ed99", 8);
    }
    drawStageEye(-155, -54);
    drawStageEye(155, -54);
    drawStageEye(-112, 14);
    drawStageEye(112, 14);
  } else if (id === "asriel") {
    drawStageWing(-150, -28, -1);
    drawStageWing(150, -28, 1);
    for (let i = 0; i < 7; i++) drawStageStar(-150 + i * 50, -78 + (i % 2) * 22, i % 2 ? "#ffd166" : "#ffffff");
  } else if (id === "mettaton") {
    cueStageLine(-205, -76, -54, -32, "#ff8bd1", 8);
    cueStageLine(205, -76, 54, -32, "#ff8bd1", 8);
    for (let i = 0; i < 8; i++) cueStageBlock(-174 + i * 50, 62, 24, 12, i % 2 ? "#ffffff" : "#ff8bd1");
  }
  ctx.restore();
}

function cueStageBlock(x, y, w, h, color = "#ffffff") {
  px(x, y, w, h, "#050507");
  px(x + 2, y + 2, Math.max(2, w - 4), Math.max(2, h - 4), color);
}

function cueStageLine(x1, y1, x2, y2, color = "#ffffff", size = 6) {
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) / size));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    cueStageBlock(Math.round(x1 + (x2 - x1) * t), Math.round(y1 + (y2 - y1) * t), size, size, color);
  }
}

function drawStageBones(x, y, width, color) {
  cueStageLine(x, y, x + width, y, color, 8);
  for (let i = x; i < x + width; i += 34) {
    cueStageBlock(i, y - 11, 18, 18, color);
    cueStageBlock(i + 14, y - 5, 14, 14, color);
  }
}

function drawStageBoneSpear(x1, y1, x2, y2, color) {
  cueStageLine(x1, y1, x2, y2, color, 7);
  cueStageBlock(x2 - 8, y2 - 8, 18, 18, color);
}

function drawStageSpear(x1, y1, x2, y2, color) {
  cueStageLine(x1, y1, x2, y2, color, 7);
  cueStageBlock(x2 - 7, y2 - 7, 18, 18, "#ffffff");
  cueStageBlock(x2 - 3, y2 - 3, 10, 10, color);
}

function drawStageTrident(x, y) {
  cueStageLine(x, y + 72, x, y - 74, "#ffd166", 7);
  cueStageLine(x - 24, y - 44, x - 24, y - 82, "#ffd166", 7);
  cueStageLine(x + 24, y - 44, x + 24, y - 82, "#ffd166", 7);
  cueStageLine(x - 24, y - 44, x, y - 62, "#ffd166", 7);
  cueStageLine(x + 24, y - 44, x, y - 62, "#ffd166", 7);
}

function drawStageFlame(x, y) {
  cueStageBlock(x - 11, y - 6, 22, 24, "#ff7a1a");
  cueStageBlock(x - 6, y - 14, 12, 12, "#ff7a1a");
  cueStageBlock(x - 4, y + 4, 8, 12, "#ffd166");
}

function drawStageBlaster(x, y, s = 1) {
  cueStageBlock(x - 32 * s, y - 18 * s, 48 * s, 34 * s, "#ffffff");
  cueStageBlock(x - 8 * s, y - 6 * s, 10 * s, 10 * s, "#050507");
  cueStageBlock(x + 10 * s, y - 6 * s, 10 * s, 10 * s, "#050507");
  cueStageBlock(x + 16 * s, y - 26 * s, 34 * s, 12 * s, "#ffffff");
  cueStageBlock(x + 16 * s, y + 12 * s, 34 * s, 12 * s, "#ffffff");
}

function drawStageEye(x, y) {
  cueStageBlock(x - 18, y - 10, 36, 20, "#ffffff");
  cueStageBlock(x - 6, y - 6, 12, 12, "#050507");
}

function drawStageWing(x, y, side) {
  cueStageLine(x, y, x + side * 90, y + 34, "#ffffff", 8);
  cueStageLine(x + side * 12, y + 22, x + side * 78, y + 70, "#ffffff", 8);
  cueStageLine(x + side * 28, y + 44, x + side * 58, y + 100, "#ffffff", 8);
}

function drawStageStar(x, y, color) {
  cueStageBlock(x - 4, y - 14, 8, 28, color);
  cueStageBlock(x - 14, y - 4, 28, 8, color);
}

function drawBossNameplate() {
  const text = selectedBoss.name.toUpperCase();
  ctx.save();
  ctx.font = "bold 16px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const width = Math.min(320, ctx.measureText(text).width + 28);
  px(-width / 2, 82, width, 24, "#050507");
  ctx.strokeStyle = selectedBoss.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(-width / 2, 82, width, 24);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, 0, 95);
  ctx.restore();
}

function drawBossSpeechBox() {
  const text = getBossSpeech();
  const visibleText = getVisibleSpeech(text);
  const box = getSpeechBoxPlacement(selectedBoss.id);
  ctx.save();
  px(box.x, box.y, box.w, box.h, "#ffffff");
  px(box.x + 4, box.y + 4, box.w - 8, box.h - 8, "#ffffff");
  drawSpeechTail(box);
  ctx.font = "bold 17px Courier New";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#050507";
  drawWrappedSpeech(visibleText, box.x + 18, box.y + 15, box.w - 36, 21, 3);
  ctx.restore();
}

function getSpeechBoxPlacement(id) {
  if (id === "omega") return { x: 178, y: 32, w: 288, h: 92, tail: "right-low" };
  if (id === "asriel") return { x: 84, y: 34, w: 292, h: 92, tail: "right" };
  if (id === "btt") return { x: 586, y: 36, w: 300, h: 88, tail: "left-low" };
  if (id === "sans") return { x: 586, y: 36, w: 276, h: 86, tail: "left-low" };
  if (id === "mettaton") return { x: 592, y: 34, w: 284, h: 90, tail: "left" };
  if (id === "asgore") return { x: 592, y: 30, w: 292, h: 92, tail: "left-low" };
  return { x: 586, y: 32, w: 292, h: 90, tail: "left" };
}

function drawSpeechTail(box) {
  const right = box.tail === "right" || box.tail === "right-low";
  const low = box.tail === "left-low" || box.tail === "right-low";
  const anchorX = right ? box.x + box.w - 18 : box.x + 18;
  const tipX = right ? box.x + box.w + 24 : box.x - 22;
  const baseY = box.y + box.h - (low ? 12 : 4);
  const tipY = box.y + box.h + (low ? 30 : 18);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(anchorX, baseY);
  ctx.lineTo(tipX, tipY);
  ctx.lineTo(anchorX + (right ? -14 : 14), baseY);
  ctx.closePath();
  ctx.fill();
}

function getBossSpeech() {
  if (state.over) return state.won ? "* The fight settles." : "* Stay determined.";
  const lines = bossDialogues[selectedBoss.id] || ["* The boss watches you."];
  const waveLine = getWaveBossSpeech();
  if (state.phase === "ready") return lines[0];
  if (state.phase === "menu") return waveLine || lines[(state.turn - 1) % lines.length];
  if (state.phase === "enemy" && state.waveT < 1.15 && state.lastCommand) {
    return commandDialogues[state.lastCommand]?.[selectedBoss.id] || waveLine || lines[state.wave % lines.length];
  }
  return waveLine || lines[state.wave % lines.length];
}

function getWaveBossSpeech() {
  return bossWaveDialogues[selectedBoss.id]?.[state.wave] || "";
}

function getVisibleSpeech(text) {
  const age = state.phase === "enemy" ? state.waveT : state.phase === "ready" ? 10 : Math.max(1.5, state.t);
  const count = Math.max(1, Math.floor(age * 42));
  return text.slice(0, count);
}

function drawWrappedSpeech(text, x, y, maxWidth, lineHeight, maxLines) {
  let lineCount = 0;
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(" ");
    let lineText = "";
    for (const word of words) {
      const test = lineText ? `${lineText} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && lineText) {
        ctx.fillText(lineText, x, y + lineCount * lineHeight);
        lineCount++;
        lineText = word;
        if (lineCount >= maxLines) return;
      } else {
        lineText = test;
      }
    }
    if (lineText && lineCount < maxLines) {
      ctx.fillText(lineText, x, y + lineCount * lineHeight);
      lineCount++;
    }
    if (lineCount >= maxLines) return;
  }
}

function drawBossImage(id) {
  const entry = bossImages[id];
  if (!entry || !entry.ok || !entry.image) return false;
  const image = entry.image;
  const presentation = bossImagePresentation[id] || { maxW: 190, maxH: 180, y: 0 };
  const maxW = presentation.maxW;
  const maxH = presentation.maxH;
  const scale = Math.min(maxW / image.naturalWidth, maxH / image.naturalHeight);
  const w = Math.round(image.naturalWidth * scale);
  const h = Math.round(image.naturalHeight * scale);
  const y = Math.round((presentation.y || 0) - h / 2);
  ctx.imageSmoothingEnabled = false;
  drawPixelImageSilhouette(image, -w / 2, y, w, h);
  ctx.drawImage(image, -w / 2, y, w, h);
  ctx.imageSmoothingEnabled = true;
  return true;
}

function drawPixelImageSilhouette(image, x, y, w, h) {
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.filter = "brightness(0)";
  for (const [dx, dy] of [[-3, 0], [3, 0], [0, -3], [0, 3], [-3, -3], [3, -3], [-3, 3], [3, 3]]) {
    ctx.drawImage(image, x + dx, y + dy, w, h);
  }
  ctx.restore();
}

const matrixColors = {
  W: "#ffffff",
  K: "#050507",
  B: "#57d6ff",
  C: "#2f8de4",
  Y: "#ffd166",
  G: "#80ed99",
  O: "#ff7a1a",
  R: "#ff3855",
  P: "#ff8bd1",
  V: "#c77dff",
  D: "#8a8f99",
  A: "#f6d28a",
};

const matrixSprites = {
  sans: [
    "............WWWWWW............",
    ".........WWWWWWWWWWWW.........",
    ".......WWWWWWWWWWWWWWWW.......",
    "......WWWKKKWWWWWWKKKWWW......",
    ".....WWWKKKKWWWWWWKKKKBWW.....",
    ".....WWWWKWWWWWWWWWWKWWWW.....",
    "......WWWWWKKWWKKWWWWW.......",
    ".......WWWWWWWWWWWWWW........",
    ".........WWKKKKKKWW..........",
    ".......WWWWWWWWWWWWWW........",
    ".....WWWWBBBBBBBBWWWWWW......",
    "....WWWBBBBKKKKBBBBWWW.......",
    "...WWWBBBBBKKKKBBBBBWWW......",
    "...WWBBBBBBBBBBBBBBBBWW......",
    "...WWBBBKKKBBBBKKKBBBWW......",
    "....WWWKKKBBBBBBKKKWWW.......",
    ".....WWWWBBBBBBBBWWWW........",
    ".......WWWWWWWWWWWW..........",
    ".......WWWW....WWWW..........",
    "......WWWW......WWWW.........",
    ".....WWWW........WWWW........",
    "....WWWW..........WWWW.......",
    "...WWWWW..........WWWWW......",
  ],
  disbelief: [
    ".............WWWW.............",
    ".........WWWWWWWWWWWW.........",
    ".......WWWWWWWWWWWWWWWW.......",
    "......WWWKKKWWWWWWKKKWWW......",
    ".....WWWKKKWWWWWWWWKKKWWW.....",
    ".....WWWWWWWKKWWKKWWWWWWW.....",
    "......WWWWWWWWWWWWWWWWWW......",
    "........WWWKKKKKKKKWWW........",
    "..........WWWWWWWWWW..........",
    ".............YY...............",
    "............YYYY..............",
    ".....WWWWWWWWWWWWWWWWWW......",
    "...WWWWWWWWWWWWWWWWWWWWWW....",
    "..WWWWKKKKWWWWWWWWKKKKWWWW...",
    ".WWWWKKKKKKWWWWWWKKKKKKWWWW..",
    "WWWWWWWWWWWWKKKKWWWWWWWWWWWW.",
    "....WWWWWWWWWWWWWWWWWWWW.....",
    "......WWWWWWWWWWWWWWWW.......",
    "......WWWW........WWWW.......",
    ".....WWWW..........WWWW......",
    ".....WWWW..........WWWW......",
    "....WWWWW..........WWWWW.....",
    "...WWWWWW..........WWWWWW....",
  ],
  undyne: [
    ".............CCCCCC...........",
    "..........CCCCCCCCCCCC........",
    "........CCCCCCCCCCCCCCCC......",
    ".......CCCWKKCCCCCCKKWCCC.....",
    "......CCCWKKKCCCCCCKKKWCCC....",
    ".....CCCCCCCCKKKKCCCCCCCC.....",
    ".....CCCCCCCCCCCCCCCCCCCC.....",
    "......CCCCCCKKKKKKCCCCCC......",
    ".........CCCCCCCCCCCC.........",
    "...........YYYYYYYY...........",
    ".....CCCCCCCCCCCCCCCCCC.......",
    "...CCCCCCCCCCCCCCCCCCCCCC.....",
    "..CCCCCCCCKKKKKKKKCCCCCCCC....",
    "..CCCCCCCKKKKKKKKKKCCCCCCC....",
    "...CCCCCCCCCCCCCCCCCCCCCC.....",
    ".....CCCCCCCCCCCCCCCCCC.......",
    "....CCCCCC........CCCCCC......",
    "...CCCCCC..........CCCCCC.....",
    "..CCCCCC............CCCCCC....",
    ".CCCCCC..............CCCCCC...",
    "CCCCCC................CCCCCC..",
    "..CCCC................CCCC....",
    "....CC................CC......",
  ],
  undying: [
    ".............GGGGGG...........",
    "..........GGGGGGGGGGGG........",
    "........GGGGGGGGGGGGGGGG......",
    ".......GGGWKKGGGGGGKKWGGG.....",
    "......GGGWKKKGGGGGGKKKWGGG....",
    ".....GGGGGGGGKKKKGGGGGGGG.....",
    ".....GGGGGGGGGGGGGGGGGGGG.....",
    "......GGGGGGKKKKKKGGGGGG......",
    ".........GGGGGGGGGGGG.........",
    "...........YYYYYYYY...........",
    ".....GGGGGGGGGGGGGGGGGG.......",
    "...GGGGGGGGGGGGGGGGGGGGGG.....",
    "..GGGGGGGKKKKKKKKGGGGGGGG.....",
    "..GGGGGGKKKKKKKKKKGGGGGGG.....",
    ".GGGGGGGGGGGGGGGGGGGGGGGGG....",
    "GGGGGGGGGGGGGGGGGGGGGGGGGG....",
    "...GGGGGG........GGGGGG.......",
    "..GGGGGG..........GGGGGG......",
    ".GGGGGG............GGGGGG.....",
    "GGGGGG..............GGGGGG....",
    "GGGGG................GGGGG....",
    "..GG....................GG....",
    "....G..................G......",
  ],
  asgore: [
    ".....AA.................AA....",
    "....AAAA...............AAAA...",
    "...AAAAAA.............AAAAAA..",
    "....AA.WWWWWWWWWWWWW.AA......",
    "......WWWWWWWWWWWWWWWW.......",
    ".....WWWKKKWWWWWWKKKWWW......",
    ".....WWWWKKWWWWWWKKWWWW......",
    "......WWWWWWKKKKWWWWWW.......",
    "........WWWWWWWWWWWW.........",
    "..........YYYYYYYY...........",
    ".....WWWWWWWWWWWWWWWWWW......",
    "...WWWWWWWWWWWWWWWWWWWWWW....",
    "..WWWWWWWWWWWWWWWWWWWWWWWW...",
    "..WWWWWWYYYYYYYYYYYYWWWWWW...",
    ".WWWWWWWYYYYYYYYYYYYWWWWWWW..",
    "WWWWWWWWWWWWWWWWWWWWWWWWWW...",
    "....WWWWWW......WWWWWW.......",
    "...WWWWWW........WWWWWW......",
    "...WWWWW..........WWWWW......",
    "..WWWWW............WWWWW.....",
    ".WWWWW..............WWWWW....",
    "WWWWW................WWWWW...",
  ],
  omega: [
    "...........WWWWWWWWWW.........",
    ".......WWWWWWWWWWWWWWWWWW.....",
    "....GGWWWWWWWWWWWWWWWWWWGG....",
    "...GGGWWWKKKWWWWWWKKKWWWGGG...",
    "..GGGGWWWKKKKWWWWKKKKWWWGGGG..",
    ".GGGGGWWWWKKKWWWWKKKWWWWGGGGG.",
    "GGGGGGGWWWWWWWWWWWWWWGGGGGGGG.",
    "GGGGGGGGGWWKKKKKKWWGGGGGGGGGG.",
    "..GGGGGGGGWWWWWWWWGGGGGGGG....",
    ".....AAAAAOOOOOOOOAAAAA.......",
    "....AAAAAOOOOOOOOOOAAAAA......",
    "...AAAAAOOOOKKKKOOOOAAAAA.....",
    "..AAAAAOOOOOKKKKOOOOOAAAAA....",
    "...AAAAAOOOOOOOOOOAAAAA.......",
    ".....AAAAOOOOOOOOAAAA.........",
    "GGGG....AAAA..AAAA....GGGG....",
    "GGGGG....AA....AA....GGGGG....",
    ".GGGGG............GGGGG.......",
    "..GGGGG..........GGGGG........",
    "...GGGGG........GGGGG.........",
    "....GGGG........GGGG..........",
  ],
  asriel: [
    "......WW...............WW.....",
    ".....WWWW.............WWWW....",
    "....WWWWW.............WWWWW...",
    "......WWWWWWWWWWWWWWWWW......",
    ".....WWWWWWWWWWWWWWWWWWW.....",
    "....WWWKKKWWWWWWWWWKKKWWW....",
    "....WWWWKKWWWWWWWWWKKWWWW....",
    ".....WWWWWWKKKKKWWWWWW.......",
    ".......WWWWWWWWWWWWWW........",
    ".........YYYYYYYYYY..........",
    "....WWWWVVVVVVVVVVVVWWWW.....",
    "..WWWWVVVVVVVVVVVVVVVVWWWW...",
    ".WWWWVVVVVVKKKKVVVVVVVVWWWW..",
    "WWWWVVVVVVKKKKKKVVVVVVVVWWWW.",
    "WWWWWWVVVVVVVVVVVVVVVVWWWWWW.",
    "..WWWWWWVVVVVVVVVVWWWWWW.....",
    "....WWWWWW......WWWWWW.......",
    "...WWWWW..........WWWWW......",
    "..WWWWW............WWWWW.....",
    ".WWWWW..............WWWWW....",
    "WWWWW................WWWWW...",
  ],
  mettaton: [
    "...........PPPPPPPPPP.........",
    ".........PPPPPPPPPPPPPP.......",
    "........PPPKKKPPPPKKKPPP......",
    ".......PPPPKKKPPPPKKKPPPP.....",
    "........PPPPPPKKKKPPPPPP......",
    "..........PPPPPPPPPPPP........",
    ".......PPPPPPPPPPPPPPPPPP.....",
    "....PPPPPPPPPPPPPPPPPPPPPP....",
    "..PPPPPPPPPPPPPPPPPPPPPPPPPP..",
    "..PPPPPPPPPPKKKKPPPPPPPPPPPP..",
    "...PPPPPPPPKKKKKKPPPPPPPPP....",
    "....PPPPPPPPPPPPPPPPPPPP......",
    "......PPPPPPPPPPPPPPPP........",
    "........PPPPPPPPPPPP..........",
    "......PPPPPP......PPPPPP......",
    "....PPPPPP..........PPPPPP....",
    "..PPPPPP..............PPPPPP..",
    "PPPPPP..................PPPPPP",
    "...PPPP................PPPP...",
    "...PPPP................PPPP...",
    "..PPPPP................PPPPP..",
  ],
};

function drawMatrixBoss(id) {
  if (id === "btt") {
    ctx.save();
    ctx.translate(-105, 12);
    drawMatrixSprite(matrixSprites.disbelief, -35, -82, 2.6);
    ctx.translate(105, 14);
    drawMatrixSprite(matrixSprites.sans, -38, -78, 2.6);
    ctx.translate(104, -10);
    drawMatrixSprite(matrixSprites.undying, -38, -84, 2.45);
    ctx.restore();
    return true;
  }
  const rows = matrixSprites[id];
  if (!rows) return false;
  const scale = id === "omega" ? 4.1 : id === "mettaton" ? 4.15 : 4.25;
  const maxWidth = Math.max(...rows.map((row) => row.length)) * scale;
  const height = rows.length * scale;
  drawMatrixSprite(rows, -maxWidth / 2, -height / 2 + 4, scale);
  return true;
}

function drawMatrixSprite(rows, x, y, size) {
  for (let row = 0; row < rows.length; row++) {
    for (let col = 0; col < rows[row].length; col++) {
      const color = matrixColors[rows[row][col]];
      if (!color) continue;
      ctx.fillStyle = "#050507";
      ctx.fillRect(Math.round(x + col * size - 1), Math.round(y + row * size - 1), Math.ceil(size + 2), Math.ceil(size + 2));
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x + col * size), Math.round(y + row * size), Math.ceil(size), Math.ceil(size));
    }
  }
}

function drawBossSignature(id) {
  ctx.save();
  ctx.translate(0, -4);
  drawPixelBossCues(id);
  ctx.globalAlpha = 0.52;
  if (id === "sans") drawSansPortrait(0.58);
  else if (id === "disbelief") drawPapyrusPortrait(0.58);
  else if (id === "btt") drawTrioPortrait(0.5);
  else if (id === "undyne") drawUndynePortrait(0.56, false);
  else if (id === "undying") drawUndynePortrait(0.56, true);
  else if (id === "asgore") drawAsgorePortrait(0.56);
  else if (id === "omega") drawOmegaPortrait(0.56);
  else if (id === "asriel") drawAsrielPortrait(0.56);
  else if (id === "mettaton") drawMettatonPortrait(0.56);
  ctx.restore();
}

function cueBlock(x, y, w, h, color = "#ffffff") {
  px(x, y, w, h, "#050507");
  px(x + 2, y + 2, Math.max(2, w - 4), Math.max(2, h - 4), color);
}

function cueLine(x1, y1, x2, y2, color = "#ffffff", size = 8) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) / size;
  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    cueBlock(Math.round(x1 + (x2 - x1) * t), Math.round(y1 + (y2 - y1) * t), size, size, color);
  }
}

function drawBlasterCue(x, y, scale = 1) {
  const s = 6 * scale;
  cueBlock(x - 5 * s, y - 3 * s, 8 * s, 6 * s);
  cueBlock(x - 6 * s, y - 1 * s, 2 * s, 3 * s);
  cueBlock(x - 2 * s, y - 1 * s, 2 * s, 2 * s, "#050507");
  cueBlock(x + 2 * s, y - 1 * s, 2 * s, 2 * s, "#050507");
  cueBlock(x + 3 * s, y - 4 * s, 4 * s, 2 * s);
  cueBlock(x + 3 * s, y + 2 * s, 4 * s, 2 * s);
  cueBlock(x + 7 * s, y - 2 * s, 2 * s, 4 * s);
}

function drawTridentCue(x, y, color = "#ffd166") {
  cueLine(x, y + 66, x, y - 64, color, 7);
  cueLine(x - 22, y - 40, x - 22, y - 70, color, 7);
  cueLine(x + 22, y - 40, x + 22, y - 70, color, 7);
  cueLine(x - 22, y - 40, x, y - 58, color, 7);
  cueLine(x + 22, y - 40, x, y - 58, color, 7);
}

function drawSpearCue(x1, y1, x2, y2, color) {
  cueLine(x1, y1, x2, y2, color, 7);
  cueBlock(x2 - 8, y2 - 8, 18, 18);
  cueBlock(x2 - 4, y2 - 4, 10, 10, color);
}

function drawPixelBossCues(id) {
  ctx.save();
  ctx.globalAlpha = 1;
  if (id === "sans") {
    drawBlasterCue(118, -68, 0.74);
    cueLine(-112, 76, 112, 76, "#ffffff", 8);
    for (let x = -110; x <= 100; x += 24) cueBlock(x, 67, 18, 18);
    cueBlock(-45, -24, 18, 70, "#57d6ff");
    cueBlock(27, -24, 18, 70, "#57d6ff");
    cueBlock(11, -76, 9, 9, "#57d6ff");
  } else if (id === "disbelief") {
    cueLine(-28, -122, 86, -150, "#ffd166", 6);
    cueBlock(78, -158, 24, 24, "#ffd166");
    cueLine(-92, 82, -150, 130, "#ffffff", 8);
    cueLine(-118, 128, -176, 124, "#ffffff", 8);
    cueBlock(-58, -24, 116, 18);
    cueBlock(-34, -2, 68, 60, "#050507");
    cueBlock(-24, -54, 48, 12, "#ff3855");
  } else if (id === "btt") {
    ctx.save();
    ctx.scale(0.72, 0.72);
    ctx.translate(-132, 20);
    drawPixelBossCues("disbelief");
    ctx.translate(132, 16);
    drawPixelBossCues("sans");
    ctx.translate(136, -24);
    drawPixelBossCues("undying");
    ctx.restore();
  } else if (id === "undyne" || id === "undying") {
    const accent = id === "undying" ? "#80ed99" : "#57d6ff";
    drawSpearCue(-140, 84, -92, -106, accent);
    cueLine(-74, -120, -138, -148, accent, 7);
    cueLine(-66, -110, -132, -124, accent, 7);
    cueBlock(-64, -42, 128, 20);
    cueBlock(-44, -8, 88, 64, id === "undying" ? "#80ed99" : "#2f8de4");
    cueBlock(-20, 10, 40, 24, "#050507");
    if (id === "undying") {
      cueBlock(-18, -6, 36, 22, "#ff3855");
      cueLine(-78, -20, 78, -20, "#80ed99", 7);
    }
  } else if (id === "asgore") {
    cueLine(-52, -92, -112, -156, "#f6d28a", 8);
    cueLine(-38, -104, -76, -164, "#f6d28a", 8);
    cueLine(52, -92, 112, -156, "#f6d28a", 8);
    cueLine(38, -104, 76, -164, "#f6d28a", 8);
    drawTridentCue(124, -4, "#ffd166");
    cueBlock(-72, -26, 144, 92);
    cueBlock(-46, -12, 92, 70, "#050507");
    cueLine(0, -26, 0, 66, "#ffd166", 8);
  } else if (id === "omega") {
    cueBlock(-92, -126, 184, 34);
    cueBlock(-52, -154, 104, 30);
    cueBlock(-76, -82, 34, 28, "#050507");
    cueBlock(42, -82, 34, 28, "#050507");
    cueLine(-128, 8, -194, 112, "#80ed99", 9);
    cueLine(128, 8, 194, 112, "#80ed99", 9);
    cueLine(-86, 58, -166, 150, "#80ed99", 9);
    cueLine(86, 58, 166, 150, "#80ed99", 9);
    cueBlock(-34, 28, 68, 82, "#ff7a1a");
    cueBlock(-14, 54, 28, 44, "#050507");
  } else if (id === "asriel") {
    cueLine(-60, -108, -104, -160, "#ffffff", 8);
    cueLine(60, -108, 104, -160, "#ffffff", 8);
    cueLine(-58, -28, -146, 28, "#ffffff", 8);
    cueLine(-70, -8, -168, 72, "#ffffff", 8);
    cueLine(58, -28, 146, 28, "#ffffff", 8);
    cueLine(70, -8, 168, 72, "#ffffff", 8);
    cueBlock(-58, -28, 116, 90, "#c77dff");
    cueBlock(-16, 2, 32, 46);
  } else if (id === "mettaton") {
    cueLine(-26, -132, -74, -168, "#ffffff", 7);
    cueBlock(-58, -150, 54, 20);
    cueLine(-104, -48, -184, -48, "#ffffff", 7);
    cueLine(104, -48, 184, -48, "#ffffff", 7);
    cueBlock(-54, -46, 108, 88);
    cueBlock(-20, -20, 40, 40, "#ff8bd1");
    cueLine(-44, 38, -78, 136, "#ffffff", 8);
    cueLine(44, 38, 78, 136, "#ffffff", 8);
    cueBlock(-96, 126, 48, 16);
    cueBlock(48, 126, 48, 16);
  }
  ctx.restore();
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
  if (drawMatrixBoss(id)) return;
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
  tileRect(2, -20, 2, 2, "#57d6ff");
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
  tileLine(-24, 16, -31, 19, accent);
  tileLine(-24, 16, -31, 13, accent);
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
  tileRect(-23, -10, 46, 2, "#ff8bd1");
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

function drawArenaModeDetails() {
  ctx.save();
  if (state.heartMode === "green") {
    const cx = arena.x + arena.w / 2;
    const cy = arena.y + arena.h / 2;
    ctx.globalAlpha = 0.82;
    drawShieldMarker(cx, arena.y + 16, "up");
    drawShieldMarker(arena.x + arena.w - 16, cy, "right");
    drawShieldMarker(cx, arena.y + arena.h - 16, "down");
    drawShieldMarker(arena.x + 16, cy, "left");
  }
  if (state.heartMode === "blue") {
    ctx.globalAlpha = 0.26;
    ctx.fillStyle = "#4ea1ff";
    for (let x = arena.x + 16; x < arena.x + arena.w; x += 24) {
      ctx.fillRect(x, arena.y + arena.h - 12, 12, 4);
    }
  }
  if (state.heartMode === "yellow") {
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = "#ffd166";
    for (let y = arena.y + 20; y < arena.y + arena.h - 10; y += 30) {
      ctx.fillRect(arena.x + arena.w / 2 - 2, y, 4, 14);
    }
  }
  ctx.restore();
}

function drawShieldMarker(x, y, dir) {
  ctx.save();
  ctx.translate(x, y);
  const rotations = { up: 0, right: Math.PI / 2, down: Math.PI, left: -Math.PI / 2 };
  ctx.rotate(rotations[dir] || 0);
  ctx.fillStyle = state.player.shieldDir === dir ? "#80ed99" : "#2f6f35";
  ctx.fillRect(-10, -4, 20, 8);
  ctx.fillRect(-4, -12, 8, 8);
  ctx.restore();
}

function drawAttackLeadInCue() {
  if (state.phase !== "enemy" || state.waveT >= getAttackLeadIn()) return;
  const text = `* ${selectedBoss.waves[state.wave]}`;
  ctx.save();
  ctx.font = "bold 18px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const w = Math.min(arena.w - 30, ctx.measureText(text).width + 34);
  const h = 34;
  const x = arena.x + arena.w / 2 - w / 2;
  const y = arena.y + arena.h - h - 16;
  px(x, y, w, h, "#050507");
  ctx.strokeStyle = selectedBoss.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, arena.x + arena.w / 2, y + h / 2 + 1);
  ctx.restore();
}

function drawSoulModeCallout() {
  if (state.phase !== "enemy" || state.waveT > 1.05) return;
  const text = soulModeMessages[state.heartMode];
  if (!text) return;
  ctx.save();
  const color = heartColors[state.heartMode] || "#ffffff";
  const alpha = clamp(1 - Math.max(0, state.waveT - 0.72) / 0.33, 0, 1);
  ctx.globalAlpha = alpha;
  ctx.font = "bold 20px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const w = Math.min(arena.w - 20, ctx.measureText(text).width + 34);
  const h = 42;
  const x = arena.x + arena.w / 2 - w / 2;
  const y = arena.y + 18;
  px(x, y, w, h, "#050507");
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillText(text, arena.x + arena.w / 2, y + h / 2 + 1);
  ctx.restore();
}

function drawNarrationBox() {
  if (state.over || state.phase === "ready") return;
  const text = getNarrationText();
  if (!text) return;
  const box = getNarrationBox();
  ctx.save();
  px(box.x, box.y, box.w, box.h, "#ffffff");
  px(box.x + 4, box.y + 4, box.w - 8, box.h - 8, "#050507");
  ctx.font = "bold 18px Courier New";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#ffffff";
  drawWrappedSpeech(text, box.x + 22, box.y + 17, box.w - 44, 24, 3);
  ctx.restore();
}

function getNarrationBox() {
  const y = Math.min(552, arena.y + arena.h + 24);
  return { x: 170, y, w: 620, h: 76 };
}

function getNarrationText() {
  if (state.phase === "menu") {
    const soulLine = soulModeMessages[state.heartMode] || "";
    return `* ${selectedBoss.name} blocks the way.${soulLine ? `\n${soulLine}` : ""}`;
  }
  if (state.phase === "enemy" && state.waveT < 0.75) return soulModeMessages[state.heartMode] || state.message;
  if (state.phase === "enemy" && state.waveT < getAttackLeadIn() + 0.15) {
    return state.message;
  }
  return "";
}

function drawSoulRuleHint() {
  const hasBlue = state.bullets.some((b) => b.kind === "blueBone" || b.kind === "blueFire");
  const hasOrange = state.bullets.some((b) => b.kind === "orangeBone" || b.kind === "orangeFire");
  if (!hasBlue && !hasOrange) return;
  ctx.save();
  ctx.font = "bold 13px Courier New";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const text = hasBlue && hasOrange ? "BLUE: STOP  ORANGE: MOVE" : hasBlue ? "BLUE: STOP" : "ORANGE: MOVE";
  const w = Math.min(arena.w - 28, ctx.measureText(text).width + 24);
  px(arena.x + arena.w / 2 - w / 2, arena.y + 10, w, 24, "#050507");
  ctx.strokeStyle = hasOrange ? "#ff9f1c" : "#57d6ff";
  ctx.lineWidth = 2;
  ctx.strokeRect(arena.x + arena.w / 2 - w / 2, arena.y + 10, w, 24);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, arena.x + arena.w / 2, arena.y + 22);
  ctx.restore();
}

function drawPacingHint() {
  if (!state.running || state.phase === "ready") return;
  ctx.save();
  ctx.font = "bold 12px Courier New";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const text = `${Math.round(state.speedMult * 100)}% SPD / ${Math.round(state.rateMult * 100)}% RATE`;
  const x = arena.x + arena.w - 10;
  const y = arena.y + arena.h + 12;
  ctx.fillStyle = selectedBoss.color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawBullets() {
  for (const b of state.bullets) {
    ctx.save();
    drawDelayedBulletWarning(b);
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle || 0);
    if (b.delay && b.delay > 0) ctx.globalAlpha = 0.45 + Math.sin(state.t * 28) * 0.18;
    if (b.kind === "spear" || b.kind === "arrow") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-22, -8, 42, 16);
      ctx.fillStyle = selectedBoss.color;
      ctx.fillRect(-18, -3, 30, 6);
      ctx.fillRect(12, -9, 8, 18);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(20, -3, 12, 6);
    } else if (b.kind === "fire" || b.kind === "blueFire" || b.kind === "orangeFire") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-b.r, -b.r, b.r * 2, b.r * 2);
      ctx.fillStyle = b.kind === "blueFire" ? "#57d6ff" : b.kind === "orangeFire" ? "#ff9f1c" : "#ff7a1a";
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
    } else if (b.kind === "diamond") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-15, -15, 30, 30);
      ctx.fillStyle = "#57d6ff";
      ctx.fillRect(-4, -16, 8, 8);
      ctx.fillRect(-10, -8, 20, 8);
      ctx.fillRect(-16, 0, 32, 8);
      ctx.fillRect(-10, 8, 20, 8);
      ctx.fillRect(-4, 16, 8, 8);
    } else if (b.kind === "petal") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-15, -10, 30, 20);
      ctx.fillStyle = "#ff7a1a";
      ctx.fillRect(-12, -7, 24, 14);
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(-4, -4, 8, 8);
      ctx.fillStyle = "#80ed99";
      ctx.fillRect(10, -2, 10, 4);
    } else if (b.kind === "pellet") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-10, -10, 20, 20);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-6, -6, 12, 12);
      ctx.fillStyle = "#ff7a1a";
      ctx.fillRect(-3, -3, 6, 6);
    } else if (b.kind === "bomb") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-14, -14, 28, 28);
      ctx.fillStyle = "#ff8bd1";
      ctx.fillRect(-10, -8, 20, 18);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-4, -14, 8, 8);
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(8, -16, 10, 6);
    } else if (b.kind === "box") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-14, -14, 28, 28);
      ctx.fillStyle = "#050507";
      ctx.fillRect(-10, -10, 20, 20);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-5, -5, 10, 10);
    } else if (b.kind === "leg") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-34, -13, 68, 26);
      ctx.fillStyle = "#ff8bd1";
      ctx.fillRect(-28, -7, 46, 14);
      ctx.fillRect(12, -18, 12, 36);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(20, 8, 18, 8);
    } else if (b.kind === "bone" || b.kind === "blueBone" || b.kind === "orangeBone") {
      ctx.fillStyle = "#111118";
      ctx.fillRect(-12, -b.h / 2 - 10, 24, b.h + 20);
      ctx.fillStyle = b.kind === "blueBone" ? "#57d6ff" : b.kind === "orangeBone" ? "#ff9f1c" : "#ffffff";
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

function drawDelayedBulletWarning(b) {
  if (!b.delay || b.delay <= 0) return;
  ctx.save();
  ctx.globalAlpha = 0.2 + Math.sin(state.t * 32) * 0.08;
  ctx.fillStyle = selectedBoss.color;
  const lane = b.kind === "trident" ? 20 : b.kind === "saber" || b.kind === "leg" ? 18 : 14;
  if (b.kind === "arrow") {
    if (b.dir === "up" || b.dir === "down") {
      ctx.fillRect(state.player.x - 7, arena.y, 14, arena.h);
    } else {
      ctx.fillRect(arena.x, state.player.y - 7, arena.w, 14);
    }
  } else if (b.kind === "trident" || b.kind === "saber" || b.kind === "leg" || (b.kind === "spear" && Math.abs(b.vx || 0) > Math.abs(b.vy || 0))) {
    ctx.fillRect(arena.x, b.y - lane / 2, arena.w, lane);
  } else if (b.kind === "spear") {
    ctx.fillRect(b.x - lane / 2, arena.y, lane, arena.h);
  }
  ctx.restore();
}

function drawPlayer() {
  const p = state.player;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.globalAlpha = p.inv > 0 ? 0.45 + Math.sin(state.t * 32) * 0.25 : 1;
  drawPixelHeart(-21, -18, pixel, heartColors[state.heartMode], state.heartMode);
  drawSoulHitbox();
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

function drawEffects() {
  ctx.save();
  for (const e of state.effects) {
    const size = 18 + e.age * 70;
    ctx.globalAlpha = Math.max(0, 1 - e.age / 0.45);
    ctx.strokeStyle = e.block ? "#80ed99" : "#ff3855";
    ctx.lineWidth = 4;
    ctx.strokeRect(e.x - size / 2, e.y - size / 2, size, size);
    if (e.block) {
      ctx.font = "bold 12px Courier New";
      ctx.textAlign = "center";
      ctx.fillStyle = "#80ed99";
      ctx.fillText("BLOCK", e.x, e.y - 36 - e.age * 18);
    }
  }
  ctx.restore();
}

function drawShield(dir) {
  const plates = {
    up: [-32, -48, 64, 12, 0, -58, 0],
    down: [-32, 40, 64, 12, 0, 62, Math.PI],
    left: [-50, -28, 12, 64, -62, 0, -Math.PI / 2],
    right: [40, -28, 12, 64, 62, 0, Math.PI / 2],
  };
  const plate = plates[dir] || plates.up;
  ctx.fillStyle = "#050507";
  ctx.fillRect(plate[0] - 3, plate[1] - 3, plate[2] + 6, plate[3] + 6);
  ctx.fillStyle = "#80ed99";
  ctx.fillRect(plate[0], plate[1], plate[2], plate[3]);
  ctx.save();
  ctx.translate(plate[4], plate[5]);
  ctx.rotate(plate[6]);
  ctx.fillStyle = "#80ed99";
  ctx.fillRect(-8, -8, 16, 8);
  ctx.fillRect(-4, -14, 8, 8);
  ctx.restore();
}

function drawPixelHeart(x, y, size, color, mode = "red") {
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
  if (mode === "yellow") {
    ctx.fillStyle = "#050507";
    ctx.fillRect(x + 18, y - 8, 6, 10);
    ctx.fillStyle = color;
    ctx.fillRect(x + 18, y - 14, 6, 12);
    ctx.fillRect(x + 12, y - 8, 18, 6);
  }
  if (mode === "blue") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 18, y + 28, 6, 4);
  }
}

function drawSoulHitbox() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-2, -2, 4, 4);
  ctx.fillStyle = "#050507";
  ctx.fillRect(-1, -1, 2, 2);
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
    const pulse = tune.pulse || 0.5;
    if (lead) {
      playTone(lead, music.nextTime, beat * 0.38, "square", 0.065 + pulse * 0.03);
      if (pulse > 0.68 && music.step % 4 === 0) playTone(lead * 2, music.nextTime + beat * 0.08, beat * 0.18, "square", 0.025);
    }
    if (music.step % 2 === 0) playTone(bass, music.nextTime, beat * 0.82, "triangle", 0.045 + pulse * 0.02);
    if (music.step % 4 === 2 || pulse > 0.7) playNoiseHat(music.nextTime, beat * 0.1);
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
