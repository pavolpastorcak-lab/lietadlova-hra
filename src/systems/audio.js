// Zvuk podľa data/voice.json. Chýbajúci mp3 súbor = ticho (hra nespadne).
// Používa fetch + WebAudio (bez Range požiadaviek), takže funguje aj z cache service workera.
// Kanály: hlas (kľúče bez "sfx_") má jeden kanál, nový hlas preruší starý; efekty "sfx_*" hrajú
// cez seba a hlas neprerušia. Hlasitosť kľúča: voice.json "volume" (chýba = 1) alebo { volume }.
// R5a: neúspešné načítanie sa nekešuje (ďalší play skúsi znova), dekódované hlasy držia LRU (MAX_VOICES),
// pred štartom sa počká na rozbehnutie AudioContextu (suspended / interrupted), zatvorený kontext sa nahradí novým.

let voice = {};
let ctx = null;
let currentVoice = null;
let unlockSet = false;
let voiceSeq = 0;            // číslo posledného hlasu: starší hlas, ktorý sa zdržal (načítanie, resume), už nezačne
let resumeFails = 0;
let logger = null;           // ladiaci log (?debug=audio), pozri src/ui/audioDebug.js
const bufs = new Map();      // kľúč -> { p: Promise<AudioBuffer|null> }; neúspech sa nekešuje, hlasy držia LRU
const pins = new Map();      // kľúč -> počet aktívnych slučiek (slučka drží svoj buffer, kým hrá)
const sources = new Set();   // všetky bežiace zdroje (na kontrolu, že nič nehrá po odchode zo scény)
let loops = 0;               // počet aktívnych slučiek
export const MAX_VOICES = 40;     // max. počet držaných dekódovaných hlasov (sfx_* sa nevyhadzujú)
const RESUME_MS = 400;
const RETRY_MS = 250;

export function onLog(fn) { logger = fn; }
function log(msg) { if (logger) logger(msg, ctx ? ctx.state : 'bez kontextu'); }

function ac() {
  if (!ctx) {
    const A = window.AudioContext || window.webkitAudioContext;
    if (A) ctx = new A();
  }
  if (ctx && !unlockSet) {   // AudioContext je do prvého dotyku "suspended": po dotyku ho rozbehni
    unlockSet = true;
    const un = () => {
      if (ctx && ctx.state !== 'running' && ctx.state !== 'closed') { try { Promise.resolve(ctx.resume()).catch(() => {}); } catch (_) { /* nič */ } }
    };
    ['pointerdown', 'touchstart', 'keydown'].forEach((e) => window.addEventListener(e, un, { passive: true }));
  }
  return ctx;
}

// Nový kontext, keď je starý zatvorený alebo sa nedá rozbehnúť. Buffre sa dekódovali pre starý: vyčisti ich.
function resetCtx() {
  const old = ctx;
  ctx = null; currentVoice = null; resumeFails = 0;
  sources.clear(); bufs.clear();
  if (old) { try { old.close(); } catch (_) { /* nič */ } }
  log('nový AudioContext');
  return ac();
}

// Splní sa, keď kontext beží (max. RESUME_MS). "suspended" aj "interrupted" sa riešia resume; "closed" = nový kontext.
function running() {
  if (ctx && ctx.state === 'closed') resetCtx();
  if (!ctx || ctx.state === 'running') { resumeFails = 0; return Promise.resolve(); }
  const c = ctx;
  return new Promise((done) => {
    const t = setTimeout(() => {
      if (c !== ctx) return done();
      resumeFails += 1;
      log('resume nestihol (' + resumeFails + 'x)');
      if (resumeFails >= 2 && c.state !== 'running') resetCtx();
      done();
    }, RESUME_MS);
    let p;
    try { p = c.resume(); } catch (_) { p = null; }
    Promise.resolve(p).then(() => { clearTimeout(t); resumeFails = 0; done(); }, () => { clearTimeout(t); resumeFails += 1; done(); });
  });
}

function fetchDecode(c, file) {
  return fetch(`./assets/audio/${file}`)
    .then((r) => { if (!r.ok) throw new Error('chýba ' + file); return r.arrayBuffer(); })
    .then((b) => c.decodeAudioData(b));
}

// Zníži počet držaných hlasov na MAX_VOICES (najstaršie preč; sfx_*, slučky a hlas, čo práve hrá, ostanú).
function evict() {
  let n = 0;
  bufs.forEach((_, k) => { if (!k.startsWith('sfx_')) n += 1; });
  for (const k of [...bufs.keys()]) {
    if (n <= MAX_VOICES) break;
    if (k.startsWith('sfx_') || pins.get(k) || (currentVoice && currentVoice.key === k)) continue;
    bufs.delete(k); n -= 1; log('uvoľnené ' + k);
  }
}

function buffer(key) {
  const have = bufs.get(key);
  if (have) {   // naposledy použitý kľúč ide na koniec poradia (LRU)
    bufs.delete(key); bufs.set(key, have);
    return have.p;
  }
  const v = voice[key];
  const c = ac();
  if (!v || !v.file || !c) { log(key + ' chýba v voice.json / bez kontextu'); return Promise.resolve(null); }
  const entry = {};
  entry.p = fetchDecode(c, v.file)
    .catch((e1) => {
      log(key + ' zlyhal, skúšam znova: ' + (e1 && e1.message || e1));
      return new Promise((r) => setTimeout(r, RETRY_MS)).then(() => fetchDecode(c, v.file));
    })
    .then((b) => { log(key + ' ok'); return b; })
    .catch((e) => {
      if (bufs.get(key) === entry) bufs.delete(key);   // neúspech sa nekešuje: ďalší play skúsi znova
      log(key + ' CHYBA: ' + (e && e.message || e));
      return null;
    });
  bufs.set(key, entry);
  evict();
  return entry.p;
}

function vol(key, opts) {
  if (opts && typeof opts.volume === 'number') return opts.volume;
  const v = voice[key];
  return v && typeof v.volume === 'number' ? v.volume : 1;
}

// Vytvorí zdroj napojený cez GainNode; vráti { src, gain } alebo null.
function make(buf, volume, loopIt) {
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
  const isSfx = key.startsWith('sfx_');
  const me = isSfx ? 0 : ++voiceSeq;
  return buffer(key)
    .then((buf) => (buf ? running().then(() => buf) : null))
    .then((buf) => new Promise((resolve) => {
      if (!buf || !ctx || (!isSfx && me !== voiceSeq)) { resolve(); return; }   // starší hlas po novšom / po stopVoice nezačne
      if (!isSfx && currentVoice) { try { currentVoice.stop(); } catch (_) { /* nič */ } }
      const { src } = make(buf, vol(key, opts), false);
      src.addEventListener('ended', () => resolve());
      src.start();
      log('hrá ' + key);
      if (!isSfx) { src.key = key; currentVoice = src; }
    }));
}

// Zastaví aktuálny hlas (napr. pri odchode zo scény); hlas, ktorý sa ešte len načítava, už nezačne.
export function stopVoice() {
  voiceSeq += 1;
  if (currentVoice) { try { currentVoice.stop(); } catch (_) { /* nič */ } currentVoice = null; }
}

// Slučka (napr. motor): vráti { setRate(r), setVolume(v), stop() }. Chýbajúci súbor = ticho, volania sú bezpečné.
export function loop(key, opts) {
  let src = null, gain = null, stopped = false, rate = 1, volume = vol(key, opts), pinned = true;
  pins.set(key, (pins.get(key) || 0) + 1);
  const unpin = () => {
    if (!pinned) return;
    pinned = false;
    const n = (pins.get(key) || 1) - 1;
    if (n > 0) pins.set(key, n); else pins.delete(key);
  };
  buffer(key)
    .then((buf) => (buf && !stopped ? running().then(() => buf) : null))
    .then((buf) => {
      if (!buf || !ctx || stopped) { if (!buf) unpin(); return; }
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
      unpin();
      if (!src) return;
      loops -= 1;
      try { src.stop(); } catch (_) { /* nič */ }
      sources.delete(src);
      src = null;
    },
  };
}

// Kontrola pre testy: počet aktívnych slučiek, bežiacich zdrojov a držaných buffrov.
export function activeLoops() { return loops; }
export function activeSources() { return sources.size; }
export function cachedKeys() { return [...bufs.keys()]; }

// Splní sa true, ak sa mp3 pre kľúč dá prehrať (súbor existuje a dekódoval sa), inak false.
export function has(key) { return buffer(key).then((b) => !!b); }
