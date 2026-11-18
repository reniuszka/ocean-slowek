import { WORD_PAIRS, CATEGORIES, AGE_GROUPS } from './words.js';
import { sfx } from './audio.js';
import { HandTracker } from './hands.js';

// ---------- Ustawienia gry ----------
const GAME_DURATION = 90; // sekundy
const POINTS = { correct: 5, wrong: -5, missed: -10 };
const MISSION_BONUS = 15;
const MISSION_INTRO = 2.8; // ile sekund widać kartę misji
const FONT = "'Baloo 2', 'Segoe UI', sans-serif";
const EMOJI_FONT = "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
const PASTELS = [
  ['#ffffff', '#cfe8ff'],
  ['#ffffff', '#ffd9e0'],
  ['#ffffff', '#fff1b8'],
  ['#ffffff', '#e2d9ff'],
  ['#ffffff', '#ffe2c4'],
  ['#ffffff', '#c9f5f0'],
];
const PRAISE = ['Brawo!', 'Super!', 'Ekstra!', 'Świetnie!', 'Mistrz!', 'Tak jest!'];
const HAND_LINKS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11],
  [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
];
const AMBIENT_LETTERS = ['ą', 'ę', 'ó', 'u', 'ż', 'rz', 'ch', 'h', 'ł', 'ś', 'ź', 'ć', 'ń', 'Aa'];
const AVATARS = ['🦊', '🐱', '🐶', '🐼', '🐸', '🦄', '🐙', '🐯', '🐰', '🐵', '🐧', '🦖', '🐳', '🦉', '🐨', '🤖'];
const RANKING_SIZE = 5;
// Mnożnik tempa: zwiększa prędkość spadania i częstotliwość pojawiania się wyrazów.
const SPEEDS = {
  slow: { label: '🐢 Wolno', icon: '🐢', mult: 0.7 },
  normal: { label: '🐇 Normalnie', icon: '🐇', mult: 1 },
  fast: { label: '🚀 Szybko', icon: '🚀', mult: 1.35 },
  turbo: { label: '⚡ Turbo', icon: '⚡', mult: 1.7 },
};

// ---------- DOM ----------
const $ = (s) => document.querySelector(s);
const canvas = $('#game');
const ctx = canvas.getContext('2d');
const video = $('#video');
const el = {
  hud: $('#hud'),
  score: $('#score'),
  combo: $('#combo'),
  time: $('#time'),
  timer: $('.timer'),
  timerRing: $('#timerRing'),
  missionPill: $('#missionPill'),
  missionPillText: $('#missionPillText'),
  missionPillBar: $('#missionPillBar'),
  missionCard: $('#missionCard'),
  missionTitle: $('#missionTitle'),
  missionSub: $('#missionSub'),
  missionIcon: $('#missionIcon'),
  handHint: $('#handHint'),
  toast: $('#toast'),
  countdown: $('#countdown'),
  menu: $('#menu'),
  pause: $('#pause'),
  over: $('#over'),
  status: $('#status'),
  startBtn: $('#startBtn'),
  best: $('#bestScore'),
  ageSeg: $('#ageSeg'),
  speedSeg: $('#speedSeg'),
  catChips: $('#catChips'),
  modeSeg: $('#modeSeg'),
  muteBtn: $('#muteBtn'),
  nameInput: $('#nameInput'),
  avatarGrid: $('#avatarGrid'),
  avatarPreview: $('#avatarPreview'),
  hudAvatar: $('#hudAvatar'),
  hudName: $('#hudName'),
};

const tracker = new HandTracker(video);

// ---------- Ustawienia gracza ----------
const settings = {
  age: localStorage.getItem('lapacz-age') || '10-12',
  mode: 'hand',
  cats: new Set(Object.keys(CATEGORIES)),
  name: localStorage.getItem('lapacz-name') || '',
  avatar: localStorage.getItem('lapacz-avatar') || AVATARS[0],
  speed: localStorage.getItem('lapacz-speed') || 'normal',
};
if (!SPEEDS[settings.speed]) settings.speed = 'normal';
if (!AGE_GROUPS[settings.age]) settings.age = '10-12';
if (!AVATARS.includes(settings.avatar)) settings.avatar = AVATARS[0];
sfx.muted = localStorage.getItem('lapacz-muted') === '1';

// ---------- Płótno ----------
let W = 0;
let H = 0;
const ambient = { bubbles: [], letters: [], weeds: [] };

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  initAmbient();
}

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function newAmbientBubble(anywhere) {
  return { x: rand(0, W), y: anywhere ? rand(0, H) : H + 20, r: rand(2, 8), v: rand(20, 60), ph: rand(0, 6.28) };
}

function initAmbient() {
  ambient.bubbles = Array.from({ length: 45 }, () => newAmbientBubble(true));
  ambient.letters = Array.from({ length: 14 }, () => ({
    x: rand(0, W),
    y: rand(0, H),
    size: rand(40, 120),
    v: rand(6, 18),
    rot: rand(-0.4, 0.4),
    vr: rand(-0.1, 0.1),
    ch: pick(AMBIENT_LETTERS),
    a: rand(0.05, 0.11),
  }));
  const n = Math.ceil(W / 55);
  ambient.weeds = Array.from({ length: n }, (_, i) => ({
    x: (i + rand(0, 1)) * (W / n),
    h: rand(50, Math.min(190, H * 0.22)),
    ph: rand(0, 6.28),
    w: rand(5, 10),
    hue: rand(140, 175),
  }));
}

// ---------- Stan gry ----------
let state = makeState();
let activePool = [];

function makeState() {
  return {
    phase: 'menu', // menu | countdown | playing | mission | paused | over
    resumePhase: 'playing',
    score: 0,
    combo: 0,
    bestCombo: 0,
    elapsed: 0,
    timeLeft: GAME_DURATION,
    lastSec: -1,
    spawnTimer: 0.6,
    pairs: [],
    bubbles: [],
    particles: [],
    rings: [],
    popups: [],
    stats: { correct: 0, wrong: 0, missed: 0 },
    review: [],
    recent: [],
    mission: null,
    pendingMission: null,
    introLeft: 0,
    nextMissionAt: 15,
    shake: 0,
  };
}

// ---------- Wskaźniki (palec / myszka) ----------
const pointers = [];
let handsScreen = [];
let mouse = null;
let lastHandSeen = 0;

canvas.addEventListener('pointermove', (e) => (mouse = { x: e.clientX, y: e.clientY }));
canvas.addEventListener('pointerdown', (e) => (mouse = { x: e.clientX, y: e.clientY }));
canvas.addEventListener('pointerleave', () => (mouse = null));

function videoRect() {
  const vw = video.videoWidth || 1280;
  const vh = video.videoHeight || 720;
  const s = Math.max(W / vw, H / vh);
  return { x: (W - vw * s) / 2, y: (H - vh * s) / 2, w: vw * s, h: vh * s };
}

// Obraz z kamery jest lustrzany, więc odwracamy oś X.
function toScreen(p, r) {
  return { x: W - (r.x + p.x * r.w), y: r.y + p.y * r.h };
}

function updatePointers() {
  let targets = [];
  if (settings.mode === 'hand') {
    if (tracker.ready) {
      const r = videoRect();
      handsScreen = tracker.detect().map((lm) => lm.map((p) => toScreen(p, r)));
      targets = handsScreen.map((h) => h[8]); // czubek palca wskazującego
      if (targets.length) lastHandSeen = performance.now();
    }
  } else {
    handsScreen = [];
    if (mouse) targets = [mouse];
  }

  targets.forEach((t, i) => {
    let p = pointers[i];
    if (!p || Math.hypot(t.x - p.x, t.y - p.y) > 260) {
      p = pointers[i] = { x: t.x, y: t.y, trail: [] };
    } else {
      const k = settings.mode === 'hand' ? 0.6 : 1;
      p.x += (t.x - p.x) * k;
      p.y += (t.y - p.y) * k;
    }
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > 14) p.trail.shift();
  });
  pointers.length = targets.length;
}

// ---------- Wyrazy ----------
function buildPool() {
  const maxDiff = AGE_GROUPS[settings.age].maxDiff;
  const inCats = WORD_PAIRS.filter((p) => settings.cats.has(p.cat));
  const byAge = inCats.filter((p) => p.diff <= maxDiff);
  return byAge.length >= 6 ? byAge : inCats;
}

function pickPair() {
  let pool = activePool;
  const m = state.mission;
  if (m?.type === 'cat' && Math.random() < 0.65) {
    const inCat = pool.filter((p) => p.cat === m.cat);
    if (inCat.length) pool = inCat;
  }
  const fresh = pool.filter((p) => !state.recent.includes(p));
  const choice = pick(fresh.length ? fresh : pool);
  state.recent.push(choice);
  if (state.recent.length > Math.min(15, Math.floor(activePool.length * 0.6))) state.recent.shift();
  return choice;
}

const fontSize = () => Math.round(clamp(Math.min(W, H) * 0.05, 22, 44));
const sway = (b) => Math.sin(b.t * 1.4 + b.wob) * 10;

function spawnPair(progress) {
  const data = pickPair();
  const fs = fontSize();
  ctx.font = `800 ${fs}px ${FONT}`;
  const [c1, c2] = pick(PASTELS);
  const icon = data.icon;
  const iconW = icon ? fs * 1.15 : 0;
  const iconGap = icon ? fs * 0.3 : 0;
  const make = (text, correct) => ({
    text,
    correct,
    fs,
    icon,
    iconW,
    iconGap,
    textW: ctx.measureText(text).width,
    w: ctx.measureText(text).width + iconW + iconGap + fs * 1.4,
    h: fs * 1.85,
    x: 0,
    y: 0,
    alpha: 1,
    scale: 0,
    state: 'fall',
    t: 0,
    anim: 0,
    vy: 15,
    wob: rand(0, Math.PI * 2),
    hover: 0,
    c1,
    c2,
  });
  const words = Math.random() < 0.5 ? [make(data.good, true), make(data.bad, false)] : [make(data.bad, false), make(data.good, true)];

  const gap = Math.max(50, W * 0.09);
  const total = words[0].w + words[1].w + gap;
  const minC = 30 + total / 2;
  const maxC = W - 30 - total / 2;
  const cx = maxC > minC ? rand(minC, maxC) : W / 2;
  words[0].x = cx - total / 2 + words[0].w / 2;
  words[1].x = cx + total / 2 - words[1].w / 2;
  const y0 = -words[0].h / 2;
  words.forEach((b) => (b.y = y0 - rand(0, fs * 0.6)));

  const age = AGE_GROUPS[settings.age];
  const pair = {
    data,
    bubbles: words,
    resolved: false,
    speed: ((H + 60) / age.fallTime) * (1 + 0.35 * progress) * SPEEDS[settings.speed].mult,
  };
  words.forEach((b) => (b.pair = pair));
  state.pairs.push(pair);
  state.bubbles.push(...words);
}

function hits(b, p, pad = 14) {
  if (b.y < b.h * 0.3) return false;
  return Math.abs(p.x - (b.x + sway(b))) < b.w / 2 + pad && Math.abs(p.y - b.y) < b.h / 2 + pad;
}

function catchBubble(pair, b) {
  pair.resolved = true;
  const other = pair.bubbles.find((x) => x !== b);
  const bx = b.x + sway(b);
  if (b.correct) {
    state.combo++;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.stats.correct++;
    b.state = 'good';
    other.state = 'fade';
    addScore(POINTS.correct, bx, b.y);
    burst(bx, b.y, 'good');
    state.rings.push({ x: bx, y: b.y, life: 0, color: '105,219,124' });
    sfx.good(state.combo);
    if (state.combo > 0 && state.combo % 5 === 0) bigPopup(`Seria ×${state.combo}! 🔥`, '#ffd43b');
    else if (Math.random() < 0.3) popup(pick(PRAISE), bx, b.y - b.h, '#ffffff', 30);
    missionEvent('correct', pair);
  } else {
    state.combo = 0;
    state.stats.wrong++;
    b.state = 'bad';
    other.state = 'reveal';
    addScore(POINTS.wrong, bx, b.y);
    burst(bx, b.y, 'bad');
    state.shake = 14;
    sfx.bad();
    showToast(pair.data, 'wrong');
    addReview(pair.data);
    missionEvent('fail', pair);
  }
  updateHud();
}

function missPair(pair) {
  pair.resolved = true;
  state.combo = 0;
  state.stats.missed++;
  for (const b of pair.bubbles) {
    if (b.correct) {
      b.state = 'reveal';
      b.vy = -40;
    } else b.state = 'sink';
  }
  const good = pair.bubbles.find((b) => b.correct);
  addScore(POINTS.missed, clamp(good.x, 80, W - 80), H - 90);
  sfx.miss();
  state.shake = 8;
  showToast(pair.data, 'miss');
  addReview(pair.data);
  missionEvent('fail', pair);
  updateHud();
}

function addReview(d) {
  if (!state.review.includes(d)) state.review.push(d);
}

function addScore(delta, x, y) {
  state.score += delta;
  const color = delta > 0 ? '#69ff9c' : delta === POINTS.missed ? '#ffa94d' : '#ff6b81';
  popup(`${delta > 0 ? '+' : '−'}${Math.abs(delta)}`, x, y, color, 46);
  el.score.classList.remove('bump');
  void el.score.offsetWidth;
  el.score.classList.add('bump');
}

// ---------- Misje ----------
function makeMission() {
  const counts = {};
  activePool.forEach((p) => (counts[p.cat] = (counts[p.cat] || 0) + 1));
  const cats = Object.keys(counts).filter((c) => counts[c] >= 3);
  if (cats.length && Math.random() < 0.65) {
    const cat = pick(cats);
    return {
      type: 'cat',
      cat,
      need: 3,
      time: 25,
      progress: 0,
      icon: '🎯',
      title: `Złap 3 wyrazy: ${CATEGORIES[cat].label}`,
      sub: `Tylko poprawnie napisane! · 25 s`,
      short: `${CATEGORIES[cat].label}`,
    };
  }
  return {
    type: 'streak',
    need: 5,
    time: 30,
    progress: 0,
    icon: '🔥',
    title: 'Seria 5 bez błędu!',
    sub: 'Złap 5 poprawnych wyrazów z rzędu · 30 s',
    short: 'Seria bez błędu',
  };
}

function startMissionIntro() {
  const m = makeMission();
  m.left = m.time;
  state.pendingMission = m;
  state.phase = 'mission';
  state.introLeft = MISSION_INTRO;
  el.missionTitle.textContent = m.title;
  el.missionSub.textContent = m.sub;
  el.missionIcon.textContent = m.icon;
  const card = el.missionCard;
  card.style.setProperty('--dur', `${MISSION_INTRO}s`);
  card.classList.remove('hidden', 'out', 'run');
  void card.offsetWidth;
  card.classList.add('run');
  sfx.tick();
  setTimeout(() => sfx.tick(), 150);
}

function endMissionIntro() {
  state.mission = state.pendingMission;
  state.pendingMission = null;
  state.phase = 'playing';
  el.missionCard.classList.add('out');
  setTimeout(() => el.missionCard.classList.add('hidden'), 350);
  el.missionPill.classList.remove('hidden');
  updateMissionPill();
}

function missionEvent(kind, pair) {
  const m = state.mission;
  if (!m) return;
  if (kind === 'correct' && (m.type === 'streak' || pair.data.cat === m.cat)) m.progress++;
  if (kind === 'fail' && m.type === 'streak') m.progress = 0;
  if (m.progress >= m.need) finishMission(true);
  else updateMissionPill();
}

function finishMission(ok) {
  state.mission = null;
  state.nextMissionAt = state.elapsed + rand(16, 24);
  el.missionPill.classList.add('hidden');
  if (ok) {
    state.score += MISSION_BONUS;
    bigPopup(`Misja wykonana! +${MISSION_BONUS}`, '#ffd43b');
    burst(W / 2, H * 0.35, 'confetti');
    sfx.mission();
  } else {
    bigPopup('Misja nieudana 😕', '#ffd6de');
    sfx.missionFail();
  }
  updateHud();
}

function updateMissionPill() {
  const m = state.mission;
  if (!m) return;
  el.missionPillText.textContent = `🎯 ${m.short} · ${m.progress}/${m.need} · ${Math.ceil(m.left)} s`;
  el.missionPillBar.style.width = `${(m.left / m.time) * 100}%`;
}

// ---------- Efekty ----------
function burst(x, y, kind) {
  const palettes = {
    good: ['#ffd43b', '#69db7c', '#ffffff', '#4cc9f0'],
    bad: ['#ff4d6d', '#ff8787', '#ffffff'],
    confetti: ['#ffd43b', '#ff922b', '#4361ee', '#69db7c', '#f783ac', '#4cc9f0'],
  };
  const n = kind === 'confetti' ? 110 : 30;
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2);
    const sp = kind === 'confetti' ? rand(200, 650) : rand(120, 420);
    state.particles.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - (kind === 'confetti' ? 280 : 80),
      g: kind === 'confetti' ? 600 : 420,
      life: 0,
      max: rand(0.6, kind === 'confetti' ? 1.8 : 1.1),
      color: pick(palettes[kind]),
      size: rand(5, 12),
      shape: kind === 'good' ? 'star' : kind === 'bad' ? 'shard' : 'rect',
      rot: rand(0, 6.28),
      vr: rand(-10, 10),
    });
  }
}

function popup(text, x, y, color, size = 40) {
  state.popups.push({ text, x, y, color, size, life: 0, max: 1.1, rise: 70 });
}

function bigPopup(text, color) {
  state.popups.push({ text, x: W / 2, y: H * 0.42, color, size: clamp(W * 0.06, 34, 64), life: 0, max: 1.8, rise: 50 });
}

let toastTimer = 0;
function showToast(d, kind) {
  const hint = d.hint || CATEGORIES[d.cat].rule;
  el.toast.innerHTML =
    `${kind === 'miss' ? '⏳ Uciekło! ' : ''}${d.icon ? `${d.icon} ` : ''}<span class="w-bad">${escapeHtml(d.bad)}</span> → ` +
    `<span class="w-good">✓ ${escapeHtml(d.good)}</span><small>${escapeHtml(hint)}</small>`;
  el.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('show'), 3000);
}

// ---------- HUD ----------
function updateHud() {
  el.score.textContent = state.score;
  el.score.classList.toggle('neg', state.score < 0);
  el.combo.textContent = state.combo >= 2 ? `🔥 seria ×${state.combo}` : '';
  el.time.textContent = Math.ceil(state.timeLeft);
  el.timerRing.style.strokeDashoffset = `${125.66 * (1 - state.timeLeft / GAME_DURATION)}`;
  el.timer.classList.toggle('low', state.timeLeft <= 10);
}

// ---------- Pętla gry ----------
function update(dt) {
  state.elapsed += dt;
  state.timeLeft = Math.max(0, GAME_DURATION - state.elapsed);
  if (state.timeLeft <= 0) return endGame();

  const progress = state.elapsed / GAME_DURATION;
  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnPair(progress);
    state.spawnTimer = (AGE_GROUPS[settings.age].spawnEvery * (1 - 0.3 * progress)) / SPEEDS[settings.speed].mult;
  }

  for (const pair of state.pairs) {
    if (pair.resolved) continue;
    for (const b of pair.bubbles) b.y += pair.speed * dt;
    outer: for (const p of pointers) {
      for (const b of pair.bubbles) {
        if (hits(b, p)) {
          catchBubble(pair, b);
          break outer;
        }
      }
    }
    if (!pair.resolved && pair.bubbles.some((b) => b.y > H - b.h * 0.35)) missPair(pair);
  }

  if (state.mission) {
    state.mission.left -= dt;
    if (state.mission.left <= 0) finishMission(false);
    else updateMissionPill();
  } else if (state.elapsed >= state.nextMissionAt && state.timeLeft > 20) {
    startMissionIntro();
  }

  const sec = Math.ceil(state.timeLeft);
  if (sec !== state.lastSec) {
    state.lastSec = sec;
    if (sec <= 5) sfx.tick();
    updateHud();
  }
}

function updateFx(dt) {
  // tło
  for (const b of ambient.bubbles) {
    b.y -= b.v * dt;
    b.ph += dt;
    if (b.y < -20) Object.assign(b, newAmbientBubble(false));
  }
  for (const l of ambient.letters) {
    l.y -= l.v * dt;
    l.rot += l.vr * dt;
    if (l.y < -l.size) {
      l.y = H + l.size;
      l.x = rand(0, W);
      l.ch = pick(AMBIENT_LETTERS);
    }
  }

  // wyrazy
  for (const b of state.bubbles) {
    b.t += dt;
    const near = b.state === 'fall' && pointers.some((p) => hits(b, p, 60));
    b.hover += ((near ? 1 : 0) - b.hover) * Math.min(1, dt * 10);
    if (b.state !== 'fall') b.anim += dt;
    switch (b.state) {
      case 'fall':
        b.scale += (1 + b.hover * 0.1 - b.scale) * Math.min(1, dt * 9);
        break;
      case 'good':
        b.scale = 1 + b.anim * 1.4;
        b.alpha = 1 - b.anim / 0.45;
        break;
      case 'bad':
        b.alpha = 1 - b.anim / 0.7;
        b.shakeX = Math.sin(b.anim * 60) * 10 * (1 - b.anim / 0.7);
        break;
      case 'fade':
        b.y += 40 * dt;
        b.alpha = 1 - b.anim / 0.5;
        b.scale = Math.max(0.6, 1 - b.anim * 0.6);
        break;
      case 'reveal':
        b.y += b.vy * dt;
        b.scale = 1.08 + Math.sin(b.anim * 10) * 0.05;
        b.alpha = b.anim < 1.4 ? 1 : 1 - (b.anim - 1.4) / 0.4;
        break;
      case 'sink':
        b.y += 140 * dt;
        b.alpha = 1 - b.anim / 0.5;
        break;
    }
  }
  state.bubbles = state.bubbles.filter((b) => b.alpha > 0);
  state.pairs = state.pairs.filter((p) => p.bubbles.some((b) => b.alpha > 0));

  for (const p of state.particles) {
    p.life += dt;
    p.vy += p.g * dt;
    p.vx *= 0.99;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
  }
  state.particles = state.particles.filter((p) => p.life < p.max);

  for (const r of state.rings) r.life += dt;
  state.rings = state.rings.filter((r) => r.life < 0.5);

  for (const p of state.popups) p.life += dt;
  state.popups = state.popups.filter((p) => p.life < p.max);

  state.shake = Math.max(0, state.shake - dt * 40);
}

// ---------- Rysowanie ----------
function drawBackground(t) {
  const camera = settings.mode === 'hand' && tracker.ready;
  if (camera) {
    const r = videoRect();
    ctx.save();
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, r.x, r.y, r.w, r.h);
    ctx.restore();
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, 'rgba(70,160,230,0.30)');
    g.addColorStop(1, 'rgba(20,60,140,0.50)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#62cdf5');
    g.addColorStop(0.55, '#2f7fd8');
    g.addColorStop(1, '#1a3d8f');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 3; i++) {
      const x = W * (0.2 + 0.3 * i) + Math.sin(t * 0.3 + i * 2) * W * 0.1;
      const y = H * 0.4 + Math.cos(t * 0.25 + i) * H * 0.15;
      const rg = ctx.createRadialGradient(x, y, 0, x, y, Math.max(W, H) * 0.35);
      rg.addColorStop(0, 'rgba(255,255,255,0.12)');
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // promienie światła
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 4; i++) {
    const x = W * (0.15 + i * 0.25) + Math.sin(t * 0.2 + i) * 60;
    const lg = ctx.createLinearGradient(x, 0, x, H * 0.8);
    lg.addColorStop(0, 'rgba(255,255,255,0.10)');
    lg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.moveTo(x - 40, 0);
    ctx.lineTo(x + 40, 0);
    ctx.lineTo(x + 160 + Math.sin(t * 0.3 + i) * 40, H * 0.8);
    ctx.lineTo(x + 20, H * 0.8);
    ctx.fill();
  }
  ctx.restore();

  // pływające litery
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const l of ambient.letters) {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    ctx.fillStyle = `rgba(255,255,255,${l.a})`;
    ctx.font = `800 ${l.size}px ${FONT}`;
    ctx.fillText(l.ch, 0, 0);
    ctx.restore();
  }

  // bąbelki
  ctx.lineWidth = 1.5;
  for (const b of ambient.bubbles) {
    const x = b.x + Math.sin(b.ph * 2) * 6;
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  // wodorosty
  ctx.lineCap = 'round';
  for (const wd of ambient.weeds) {
    const s = Math.sin(t * 1.2 + wd.ph) * 18;
    ctx.strokeStyle = `hsla(${wd.hue}, 55%, 38%, 0.6)`;
    ctx.lineWidth = wd.w;
    ctx.beginPath();
    ctx.moveTo(wd.x, H + 10);
    ctx.quadraticCurveTo(wd.x - s, H - wd.h * 0.5, wd.x + s, H - wd.h);
    ctx.stroke();
  }

  // strefa „uciekło” na dole
  if (state.phase !== 'menu' && state.phase !== 'over') {
    const danger = state.pairs.some((p) => !p.resolved && p.bubbles.some((b) => b.y > H * 0.75));
    const a = danger ? 0.22 + Math.sin(t * 12) * 0.08 : 0.1;
    const dg = ctx.createLinearGradient(0, H - 90, 0, H);
    dg.addColorStop(0, 'rgba(255,77,109,0)');
    dg.addColorStop(1, `rgba(255,77,109,${a})`);
    ctx.fillStyle = dg;
    ctx.fillRect(0, H - 90, W, 90);
  }
}

function drawHands() {
  for (const hand of handsScreen) {
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (const [a, b] of HAND_LINKS) {
      ctx.moveTo(hand[a].x, hand[a].y);
      ctx.lineTo(hand[b].x, hand[b].y);
    }
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    for (const p of hand) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawWord(b) {
  const x = b.x + sway(b) + (b.shakeX || 0);
  ctx.save();
  ctx.globalAlpha = clamp(b.alpha, 0, 1);
  ctx.translate(x, b.y);
  ctx.rotate(Math.sin(b.t * 1.1 + b.wob) * 0.05);
  ctx.scale(b.scale, b.scale);
  const { w, h } = b;
  const r = h / 2;
  const isGood = b.state === 'good' || b.state === 'reveal';
  const isBad = b.state === 'bad';

  ctx.shadowColor = isGood ? 'rgba(46,204,113,0.95)' : isBad ? 'rgba(255,77,109,0.95)' : `rgba(255,255,255,${0.4 + b.hover * 0.6})`;
  ctx.shadowBlur = 16 + b.hover * 24 + (isGood || isBad ? 16 : 0);
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  g.addColorStop(0, isGood ? '#ebfbee' : isBad ? '#fff5f5' : b.c1);
  g.addColorStop(1, isGood ? '#8ce99a' : isBad ? '#ff8fa3' : b.c2);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, r);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 3;
  ctx.strokeStyle = isGood ? '#2f9e44' : isBad ? '#e03131' : 'rgba(255,255,255,0.95)';
  ctx.stroke();

  // połysk
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.beginPath();
  ctx.ellipse(-w / 2 + r * 0.95, -h * 0.24, r * 0.5, h * 0.11, -0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1d2b4f';
  ctx.font = `800 ${b.fs}px ${FONT}`;
  ctx.textBaseline = 'middle';
  const contentW = b.iconW + b.iconGap + b.textW;
  const left = -contentW / 2;
  ctx.textAlign = 'left';
  ctx.fillText(b.text, left + b.iconW + b.iconGap, b.fs * 0.08);
  ctx.textAlign = 'center';

  if (b.icon) {
    ctx.save();
    ctx.translate(left + b.iconW / 2, 0);
    ctx.rotate(Math.sin(b.t * 3 + b.wob) * 0.18);
    ctx.font = `${b.fs * 1.05}px ${EMOJI_FONT}`;
    ctx.fillText(b.icon, 0, b.fs * 0.05);
    ctx.restore();
  }

  if (isBad) {
    ctx.strokeStyle = '#e03131';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + r * 0.6, 0);
    ctx.lineTo(w / 2 - r * 0.6, 0);
    ctx.stroke();
  }
  if (b.state === 'reveal') {
    ctx.fillStyle = '#2f9e44';
    ctx.beginPath();
    ctx.arc(w / 2 - 4, -h / 2 + 4, h * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `800 ${h * 0.36}px ${FONT}`;
    ctx.fillText('✓', w / 2 - 4, -h / 2 + 6);
  }
  ctx.restore();
}

function starPath(r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.45 : r;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
}

function drawFx() {
  for (const r of state.rings) {
    const k = r.life / 0.5;
    ctx.strokeStyle = `rgba(${r.color},${1 - k})`;
    ctx.lineWidth = 6 * (1 - k) + 1;
    ctx.beginPath();
    ctx.arc(r.x, r.y, 20 + k * 110, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (const p of state.particles) {
    const k = p.life / p.max;
    ctx.save();
    ctx.globalAlpha = 1 - k;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.shape === 'star') {
      starPath(p.size);
      ctx.fill();
    } else if (p.shape === 'shard') {
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(p.size * 0.5, p.size * 0.6);
      ctx.lineTo(-p.size * 0.5, p.size * 0.6);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    ctx.restore();
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const p of state.popups) {
    const k = p.life / p.max;
    const s = k < 0.12 ? 0.4 + (k / 0.12) * 0.9 : k < 0.22 ? 1.3 - ((k - 0.12) / 0.1) * 0.3 : 1;
    const ease = 1 - Math.pow(1 - k, 3);
    ctx.save();
    ctx.globalAlpha = k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1;
    ctx.translate(p.x, p.y - ease * p.rise);
    ctx.scale(s, s);
    ctx.font = `800 ${p.size}px ${FONT}`;
    ctx.lineWidth = p.size / 6;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(20,30,60,0.65)';
    ctx.strokeText(p.text, 0, 0);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, 0, 0);
    ctx.restore();
  }
}

function drawPointers(t) {
  for (const p of pointers) {
    const tr = p.trail;
    ctx.lineCap = 'round';
    for (let i = 1; i < tr.length; i++) {
      const k = i / tr.length;
      ctx.strokeStyle = `rgba(140,230,255,${k * 0.7})`;
      ctx.lineWidth = k * 16;
      ctx.beginPath();
      ctx.moveTo(tr[i - 1].x, tr[i - 1].y);
      ctx.lineTo(tr[i].x, tr[i].y);
      ctx.stroke();
    }
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 38);
    glow.addColorStop(0, 'rgba(255,255,255,0.9)');
    glow.addColorStop(0.35, 'rgba(140,230,255,0.55)');
    glow.addColorStop(1, 'rgba(140,230,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 22 + Math.sin(t * 6) * 2, 0, Math.PI * 2);
    ctx.stroke();
    // awatar gracza „siedzi” na czubku palca
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(Math.sin(t * 4) * 0.15);
    ctx.font = `34px ${EMOJI_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(settings.avatar, 0, 2);
    ctx.restore();
  }
}

function render(t) {
  ctx.save();
  if (state.shake > 0) ctx.translate(rand(-1, 1) * state.shake, rand(-1, 1) * state.shake);
  drawBackground(t);
  drawHands();
  for (const b of state.bubbles) drawWord(b);
  drawFx();
  drawPointers(t);
  ctx.restore();
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  updatePointers();
  if (state.phase === 'playing') update(dt);
  if (state.phase === 'mission') {
    state.introLeft -= dt;
    if (state.introLeft <= 0) endMissionIntro();
  }
  if (state.phase !== 'paused') updateFx(dt);

  const inGame = state.phase === 'playing' || state.phase === 'mission' || state.phase === 'countdown';
  const noHand = settings.mode === 'hand' && inGame && performance.now() - lastHandSeen > 1500;
  el.handHint.classList.toggle('hidden', !noHand);

  render(now / 1000);
  requestAnimationFrame(frame);
}

// ---------- Przebieg gry ----------
function showScreen(name) {
  for (const s of [el.menu, el.pause, el.over]) s.classList.remove('show');
  if (name) el[name].classList.add('show');
}

function setStatus(text, isError = false) {
  el.status.textContent = text;
  el.status.classList.toggle('error', isError);
}

function cameraErrorMessage(err) {
  if (err?.name === 'NotAllowedError') return 'Brak zgody na kamerę 🙈 Zezwól w przeglądarce albo wybierz sterowanie myszką.';
  if (err?.name === 'NotFoundError') return 'Nie znaleziono kamery. Wybierz sterowanie myszką.';
  return `Nie udało się uruchomić kamery: ${err?.message || err}`;
}

async function startGame() {
  sfx.unlock();
  const name = el.nameInput.value.trim();
  if (!name) {
    showScreen('menu');
    el.nameInput.classList.remove('shake');
    void el.nameInput.offsetWidth;
    el.nameInput.classList.add('shake');
    el.nameInput.focus();
    return setStatus('Wpisz swoje imię, żeby zagrać 🙂', true);
  }
  settings.name = name;
  localStorage.setItem('lapacz-name', name);
  el.hudAvatar.textContent = settings.avatar;
  el.hudName.textContent = `${name} · ${SPEEDS[settings.speed].icon}`;

  activePool = buildPool();
  if (!activePool.length) return setStatus('Wybierz przynajmniej jedną kategorię 🙂', true);

  if (settings.mode === 'hand') {
    el.startBtn.disabled = true;
    try {
      await tracker.init((s) => setStatus(s));
    } catch (err) {
      console.error(err);
      setStatus(cameraErrorMessage(err), true);
      return;
    } finally {
      el.startBtn.disabled = false;
    }
  }
  setStatus('');

  state = makeState();
  state.phase = 'countdown';
  lastHandSeen = performance.now();
  el.missionPill.classList.add('hidden');
  el.missionCard.classList.add('hidden');
  el.toast.classList.remove('show');
  showScreen(null);
  el.hud.classList.remove('hidden');
  updateHud();

  const steps = ['3', '2', '1', 'Start!'];
  steps.forEach((txt, i) =>
    setTimeout(() => {
      el.countdown.textContent = txt;
      el.countdown.classList.remove('pop');
      void el.countdown.offsetWidth;
      el.countdown.classList.add('pop');
      if (i < 3) sfx.tick();
      else sfx.go();
    }, i * 800),
  );
  setTimeout(() => {
    if (state.phase === 'countdown') state.phase = 'playing';
  }, steps.length * 800 - 300);
}

function endGame() {
  state.phase = 'over';
  state.mission = null;
  for (const b of state.bubbles) if (b.state === 'fall') b.state = 'fade';
  el.missionPill.classList.add('hidden');
  el.missionCard.classList.add('hidden');
  el.toast.classList.remove('show');
  sfx.end();
  burst(W / 2, H * 0.3, 'confetti');

  const { correct, wrong, missed } = state.stats;
  const total = correct + wrong + missed;
  const ranking = loadRanking();
  const best = ranking[0]?.score ?? 0;
  const isRecord = state.score > best && state.score > 0;
  const entry = { name: settings.name, avatar: settings.avatar, score: state.score, speed: settings.speed };
  ranking.push(entry);
  ranking.sort((a, b) => b.score - a.score);
  const top = ranking.slice(0, RANKING_SIZE);
  localStorage.setItem(rankingKey(), JSON.stringify(top));
  renderRanking(top, entry);

  const n = settings.name;
  $('#overAvatar').textContent = settings.avatar;
  $('#overTitle').textContent =
    state.score >= 100
      ? `Mistrz ortografii, ${n}! 🏆`
      : state.score >= 40
        ? `Świetna robota, ${n}! 🌟`
        : state.score >= 0
          ? `Dobra robota, ${n}! 👍`
          : `Trenuj dalej, ${n}! 💪`;
  $('#finalScore').textContent = state.score;
  $('#newRecord').classList.toggle('hidden', !isRecord);
  $('#stCorrect').textContent = correct;
  $('#stWrong').textContent = wrong;
  $('#stMissed').textContent = missed;
  $('#stAcc').textContent = `${total ? Math.round((correct / total) * 100) : 0}%`;
  $('#stCombo').textContent = state.bestCombo;
  $('#reviewBox').classList.toggle('hidden', !state.review.length);
  $('#reviewList').innerHTML = state.review
    .slice(0, 15)
    .map((d) => `<li>${d.icon ? `${d.icon} ` : ''}<b>✓ ${escapeHtml(d.good)}</b><s>${escapeHtml(d.bad)}</s><small>${escapeHtml(d.hint || CATEGORIES[d.cat].rule)}</small></li>`)
    .join('');

  setTimeout(() => {
    el.hud.classList.add('hidden');
    showScreen('over');
    refreshBest();
  }, 900);
}

function pauseGame() {
  if (state.phase !== 'playing' && state.phase !== 'mission') return;
  state.resumePhase = state.phase;
  state.phase = 'paused';
  document.body.classList.add('paused');
  showScreen('pause');
}

function resumeGame() {
  if (state.phase !== 'paused') return;
  state.phase = state.resumePhase;
  document.body.classList.remove('paused');
  showScreen(null);
  last = performance.now();
}

function goToMenu() {
  state = makeState();
  document.body.classList.remove('paused');
  el.hud.classList.add('hidden');
  el.missionPill.classList.add('hidden');
  el.missionCard.classList.add('hidden');
  el.toast.classList.remove('show');
  showScreen('menu');
  refreshBest();
}

function rankingKey() {
  return `lapacz-ranking-${settings.age}`;
}

function loadRanking() {
  try {
    const list = JSON.parse(localStorage.getItem(rankingKey()) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function renderRanking(list, me) {
  $('#rankAge').textContent = `(${AGE_GROUPS[settings.age].label})`;
  $('#rankList').innerHTML = list.length
    ? list
        .map(
          (r) =>
            `<li class="${r === me ? 'me' : ''}"><span>${escapeHtml(r.avatar)}</span>` +
            `<span class="r-name">${escapeHtml(r.name)}</span>` +
            `<span title="Szybkość gry">${SPEEDS[r.speed]?.icon || ''}</span><span>${r.score}</span></li>`,
        )
        .join('')
    : '<li class="empty">Jeszcze nikt nie zagrał</li>';
}

function refreshBest() {
  const top = loadRanking()[0];
  el.best.textContent = top ? `${top.score} (${top.avatar} ${top.name})` : '0';
}

// ---------- Menu ----------
function selectAvatar(avatar) {
  settings.avatar = avatar;
  localStorage.setItem('lapacz-avatar', avatar);
  el.avatarPreview.textContent = avatar;
  el.avatarPreview.classList.remove('pop');
  void el.avatarPreview.offsetWidth;
  el.avatarPreview.classList.add('pop');
  [...el.avatarGrid.children].forEach((c) => c.classList.toggle('active', c.textContent === avatar));
}

function buildMenu() {
  el.nameInput.value = settings.name;
  el.nameInput.addEventListener('input', () => {
    el.nameInput.classList.remove('shake');
    setStatus('');
  });
  el.nameInput.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') startGame();
  });

  el.avatarGrid.innerHTML = '';
  for (const a of AVATARS) {
    const btn = document.createElement('button');
    btn.textContent = a;
    btn.onclick = () => {
      selectAvatar(a);
      sfx.good(0);
    };
    el.avatarGrid.appendChild(btn);
  }
  selectAvatar(settings.avatar);
  el.ageSeg.innerHTML = '';
  for (const [key, g] of Object.entries(AGE_GROUPS)) {
    const btn = document.createElement('button');
    btn.textContent = g.label;
    btn.classList.toggle('active', key === settings.age);
    btn.onclick = () => {
      settings.age = key;
      localStorage.setItem('lapacz-age', key);
      [...el.ageSeg.children].forEach((c) => c.classList.toggle('active', c === btn));
      refreshBest();
    };
    el.ageSeg.appendChild(btn);
  }

  el.speedSeg.innerHTML = '';
  for (const [key, s] of Object.entries(SPEEDS)) {
    const btn = document.createElement('button');
    btn.textContent = s.label;
    btn.classList.toggle('active', key === settings.speed);
    btn.onclick = () => {
      settings.speed = key;
      localStorage.setItem('lapacz-speed', key);
      [...el.speedSeg.children].forEach((c) => c.classList.toggle('active', c === btn));
    };
    el.speedSeg.appendChild(btn);
  }

  el.catChips.innerHTML = '';
  for (const [key, c] of Object.entries(CATEGORIES)) {
    const btn = document.createElement('button');
    btn.textContent = c.label;
    btn.title = c.rule;
    btn.classList.add('active');
    btn.onclick = () => {
      if (settings.cats.has(key)) settings.cats.delete(key);
      else settings.cats.add(key);
      btn.classList.toggle('active', settings.cats.has(key));
    };
    el.catChips.appendChild(btn);
  }

  for (const btn of el.modeSeg.children) {
    btn.onclick = () => {
      settings.mode = btn.dataset.mode;
      [...el.modeSeg.children].forEach((c) => c.classList.toggle('active', c === btn));
      setStatus('');
    };
  }
  el.muteBtn.textContent = sfx.muted ? '🔇' : '🔊';
  refreshBest();
}

el.startBtn.onclick = startGame;
$('#againBtn').onclick = startGame;
$('#menuBtn').onclick = goToMenu;
$('#quitBtn').onclick = goToMenu;
$('#resumeBtn').onclick = resumeGame;
$('#pauseBtn').onclick = pauseGame;
el.muteBtn.onclick = () => {
  sfx.muted = !sfx.muted;
  localStorage.setItem('lapacz-muted', sfx.muted ? '1' : '0');
  el.muteBtn.textContent = sfx.muted ? '🔇' : '🔊';
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
    if (state.phase === 'paused') resumeGame();
    else pauseGame();
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseGame();
});
window.addEventListener('resize', resize);

resize();
buildMenu();
requestAnimationFrame(frame);
