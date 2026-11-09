// Hlas podľa data/voice.json. Chýbajúci mp3 súbor = ticho (hra nespadne).
// Používa fetch + WebAudio (bez Range požiadaviek), takže funguje aj z cache service workera.

let voice = {};
let ctx = null;
let current = null;
const bufs = {};

function ac() {
  if (!ctx) {
    const A = window.AudioContext || window.webkitAudioContext;
    if (A) ctx = new A();
  }
  return ctx;
}

function buffer(key) {
  if (key in bufs) return bufs[key];
  const v = voice[key];
  const c = ac();
  if (!v || !v.file || !c) return Promise.resolve(null);
  bufs[key] = fetch(`./assets/audio/${v.file}`)
    .then((r) => { if (!r.ok) throw new Error('chýba ' + v.file); return r.arrayBuffer(); })
    .then((b) => c.decodeAudioData(b))
    .catch(() => null);
  return bufs[key];
}

export function init(voiceData) { voice = voiceData || {}; }

export function preload(keys) { keys.forEach(buffer); }

export function play(key) {
  buffer(key).then((buf) => {
    if (!buf || !ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (current) { try { current.stop(); } catch (_) { /* nič */ } }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
    current = src;
  });
}

// Slučka (napr. motor): vráti { setRate(r), stop() }. Chýbajúci súbor = ticho, volania sú bezpečné.
export function loop(key) {
  let src = null, stopped = false, rate = 1;
  buffer(key).then((buf) => {
    if (!buf || !ctx || stopped) return;
    if (ctx.state === "suspended") ctx.resume();
    src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.playbackRate.value = rate;
    src.connect(ctx.destination);
    src.start();
  });
  return {
    setRate(r) { rate = r; if (src) src.playbackRate.value = r; },
    stop() { stopped = true; if (src) { try { src.stop(); } catch (_) { /* nič */ } src = null; } },
  };
}
