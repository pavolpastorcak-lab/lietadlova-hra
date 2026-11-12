import * as audio from './audio.js';
import * as data from './data.js';

// Hlásenia v jazyku mesta, odkiaľ sa letí (destinations[].lang). Bratislava / 'sk' = bez zmeny.
let seq = 0;   // len posledné hlásenie smie dohrať svoju cudziu vetu

function langOf(from) {
  const d = data.destination(from);
  return d && d.lang && d.lang !== 'sk' ? d.lang : null;
}

// Načíta cudzie verzie pokynov vopred (volaj po audio.init).
export function preloadLocal(keys, from) {
  const lang = langOf(from);
  if (lang) audio.preload(keys.map((k) => `${k}_${lang}`));
}

// Prvý pokyn stanice: slovenská veta, pauza, veta v jazyku `from`. Vráti Promise celého hlásenia.
// Cudzia veta nezačne po odchode zo scény ani keď medzitým začalo ďalšie hlásenie; chýbajúci mp3 = len slovenská veta.
export function playStation(scene, key, from) {
  const first = audio.play(key);
  const lang = langOf(from);
  if (!lang) return first;
  const lk = `${key}_${lang}`, me = ++seq;
  let alive = true;
  scene.events.once('shutdown', () => { alive = false; });
  const ok = () => alive && me === seq;
  return first
    .then(() => (ok() ? audio.has(lk) : false))
    .then((has) => (has && ok() ? new Promise((r) => scene.time.delayedCall(data.get('airport').localVoicePauseMs, r)) : false))
    .then((go) => (go !== false && ok() ? audio.play(lk) : undefined));
}
