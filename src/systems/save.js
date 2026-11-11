// Uloženie hry v localStorage so saveVersion a migráciami.
// Poškodený save sa nemaže: odloží sa do lietadla.save.bak a hra začne odznova.

const KEY = 'lietadla.save';
const BAK = KEY + '.bak';
export const SAVE_VERSION = 4;

// migrations[n] prevedie save z verzie n na n+1.
// 1 → 2: poloha lietadla (`location`), lety idú z miesta pristátia.
// 2 → 3: motor (`engine` = 0) a nový rad doletu (900…2600): starý index 0/1/2 (1500/2000/2600) → 3/4/5.
// 3 → 4: palivo (`fuel` v km); null = `load` doplní plnú nádrž podľa doletu.
const migrations = [null, (s) => ({ ...s, location: 'bts' }), (s) => {
  const planes = {};
  Object.entries(s.planes || {}).forEach(([id, p]) => {
    planes[id] = { ...p, engine: 0, range: (p.range || 0) + 3 };
  });
  return { ...s, planes };
}, (s) => ({ ...s, fuel: null })];

let state = null;

// Predvolený save podľa dát (štart mincí, lietadlá, odomknuté destinácie).
function defaults(data) {
  const planes = {};
  data.planes.forEach((p) => { planes[p.id] = { capacity: 0, range: 0, engine: 0 }; });
  return {
    saveVersion: SAVE_VERSION,
    coins: data.economy.startCoins,
    planes,
    unlocked: data.destinations.filter((d) => d.unlockCost === 0).map((d) => d.id),
    location: 'bts',
    fuel: maxFuel(data, planes),
    bestStars: {},   // kľúče `from-to`, nové páry vznikajú pri prvom rekorde
  };
}

// Plná nádrž = dolet prvého lietadla na jeho stupni.
const maxFuel = (data, planes, p = data.planes[0]) => p.range[(planes[p.id] || {}).range | 0].value;

function migrate(s) {
  while (s.saveVersion < SAVE_VERSION) {
    const m = migrations[s.saveVersion];
    if (!m) throw new Error(`chýba migrácia z verzie ${s.saveVersion}`);
    s = m(s);
    s.saveVersion += 1;
  }
  return s;
}

export function load(data) {
  let raw = null;
  try { raw = localStorage.getItem(KEY); } catch (e) { console.warn('[save] localStorage nedostupný', e); }

  if (raw) {
    try {
      const s = JSON.parse(raw);
      if (!s || typeof s.saveVersion !== 'number') throw new Error('chýba saveVersion');
      const def = defaults(data);
      state = { ...def, ...migrate(s) };
      // Chýbajúci kľúč upgradu (alebo celé lietadlo) sa doplní na 0, stupne mimo dát sa orežú.
      data.planes.forEach((p) => {
        const sp = state.planes[p.id] = { ...def.planes[p.id], ...(state.planes[p.id] || {}) };
        ['capacity', 'range', 'engine'].forEach((k) => { sp[k] = Math.min(Math.max(0, sp[k] | 0), p[k].length - 1); });
      });
      const mx = maxFuel(data, state.planes);
      state.fuel = typeof state.fuel === 'number' ? Math.min(Math.max(0, state.fuel), mx) : mx;
      if (!data.destinations.some((d) => d.id === state.location)) state.location = 'bts';
      if (!state.bestStars || typeof state.bestStars !== 'object') state.bestStars = {};
    } catch (e) {
      console.warn('[save] poškodený save, odkladám do .bak', e);
      try { localStorage.setItem(BAK, raw); } catch (_) { /* nič */ }
      state = defaults(data);
    }
  } else {
    state = defaults(data);
  }
  save();
  return state;
}

export function save() {
  if (!state) return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('[save] zápis zlyhal', e); }
}

export function addCoins(n) {
  state.coins += n;
  save();
}

// Uloží rekord hviezdičiek trasy, len ak je nový. Vráti true pri rekorde.
export function setBestStars(route, stars) {
  if (stars <= (state.bestStars[route] || 0)) return false;
  state.bestStars[route] = stars;
  save();
  return true;
}

export function get() {
  return state;
}
