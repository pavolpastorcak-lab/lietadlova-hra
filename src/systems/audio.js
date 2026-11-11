// Zvuk podľa data/voice.json. Chýbajúci mp3 súbor = ticho (hra nespadne).
// Používa fetch + WebAudio (bez Range požiadaviek), takže funguje aj z cache service workera.
// Kanály: hlas (kľúče bez "sfx_") má jeden kanál, nový hlas preruší starý; efekty "sfx_*" hrajú
// cez seba a hlas neprerušia. Hlasitosť kľúča: voice.json "volume" (chýba = 1) alebo { volume }.

let voice = {};
let ctx = null;
let currentVoice = null;
let unlockSet = false;
const bufs = {};
const sources = new Set();   // všetky bežiace zdroje (na kontrolu, že nič nehrá po odchode zo scény)
let loops = 0;               // počet aktívnych slučiek

function ac() {
  if (!ctx) {
    const A = window.AudioContext || window.webkitAudioContext;
    if (A) ctx = new A();
  }
  if (ctx && !unlockSet) {   // AudioContext je do prvého dotyku "suspended": po dotyku ho rozbehni
    unlockSet = true;
    const un = () => { if (ctx.state === 'suspended') ctx.resume(); };
    ['pointerdown', 'touchstart', 'keydown'].forEach((e) => window.addEventListener(e, un, { passive: true }));
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

function vol(key, opts) {
  if (opts && typeof opts.volume === 'number') return opts.volume;
  const v = voice[key];
  return v && typeof v.volume === 'number' ? v.volume : 1;
}

// Vytvorí zdroj napojený cez GainNode; vráti { src, gain } alebo null.
function make(buf, volume, loopIt) {
  if (ctx.state === 'suspended') ctx.resume();
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buf;
  src.loop = !!loopIt;
  gain.gain.value = volume;
  src.connect(gain);
  gain.connect(ctx.destination);
  sources.add(src);
  src.onended = () => { sources.delete(src); try { gain.disconnect(); } catch (_) { /* nič */ } };
  return { src, gain };
}

export function init(voiceData) { voice = voiceData || {}; }

export function preload(keys) { keys.forEach(buffer); }

// Vráti Promise, ktorý sa splní, keď zvuk dohrá, hlas ho preruší, alebo hneď, keď zvuk chýba / nie je AudioContext.
// Volania bez `await` fungujú ako predtým.
export function play(key, opts) {
  return buffer(key).then((buf) => new Promise((resolve) => {
    if (!buf || !ctx) { resolve(); return; }
    const isSfx = key.startsWith('sfx_');
    if (!isSfx && currentVoice) { try { currentVoice.stop(); } catch (_) { /* nič */ } }
    const { src } = make(buf, vol(key, opts), false);
    src.addEventListener('ended', () => resolve());
    src.start();
    if (!isSfx) currentVoice = src;
  }));
}

// Zastaví aktuálny hlas (napr. pri odchode zo scény).
export function stopVoice() {
  if (currentVoice) { try { currentVoice.stop(); } catch (_) { /* nič */ } currentVoice = null; }
}

// Slučka (napr. motor): vráti { setRate(r), setVolume(v), stop() }. Chýbajúci súbor = ticho, volania sú bezpečné.
export function loop(key, opts) {
  let src = null, gain = null, stopped = false, rate = 1, volume = vol(key, opts);
  buffer(key).then((buf) => {
    if (!buf || !ctx || stopped) return;
    ({ src, gain } = make(buf, volume, true));
    src.playbackRate.value = rate;
    loops += 1;
    src.start();
  });
  return {
    setRate(r) { rate = r; if (src) src.playbackRate.value = r; },
    setVolume(v) { volume = v; if (gain) gain.gain.value = v; },
    stop() {
      stopped = true;
      if (!src) return;
      loops -= 1;
      try { src.stop(); } catch (_) { /* nič */ }
      sources.delete(src);
      src = null;
    },
  };
}

// Kontrola pre testy: počet aktívnych slučiek a všetkých bežiacich zdrojov.
export function activeLoops() { return loops; }
export function activeSources() { return sources.size; }
