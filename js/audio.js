// Dźwięki generowane w locie (Web Audio) – bez plików audio.
let ac = null;

function audio() {
  if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

function tone(freq, dur, { type = 'sine', vol = 0.15, delay = 0, slideTo = null } = {}) {
  if (sfx.muted) return;
  const a = audio();
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  muted: false,
  unlock() {
    audio();
  },
  good(combo = 0) {
    const base = 520 + Math.min(combo, 12) * 35;
    tone(base, 0.12, { type: 'triangle' });
    tone(base * 1.5, 0.2, { type: 'triangle', vol: 0.12, delay: 0.07 });
  },
  bad() {
    tone(260, 0.3, { type: 'sawtooth', vol: 0.07, slideTo: 110 });
  },
  miss() {
    tone(180, 0.35, { type: 'square', vol: 0.05, slideTo: 70 });
  },
  tick() {
    tone(720, 0.1, { type: 'triangle', vol: 0.12 });
  },
  go() {
    tone(660, 0.12, { type: 'triangle' });
    tone(990, 0.3, { type: 'triangle', delay: 0.1 });
  },
  mission() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, { type: 'triangle', vol: 0.12, delay: i * 0.09 }));
  },
  missionFail() {
    [392, 330, 262].forEach((f, i) => tone(f, 0.25, { type: 'triangle', vol: 0.1, delay: i * 0.12 }));
  },
  end() {
    [784, 659, 523, 659, 784, 1046].forEach((f, i) => tone(f, 0.2, { type: 'triangle', vol: 0.1, delay: i * 0.11 }));
  },
};
