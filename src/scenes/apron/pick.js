import * as data from '../../systems/data.js';
import * as routes from '../../systems/routes.js';

// Výber hádanky pre trasu. Počítadlo dohratých hádaniek je len v pamäti hry (nie v save).
// Prvý let berie prvý level z poľa, ďalšie idú po kruhu, teda vždy ten, čo sa hral najdávnejšie.
const done = new Map();

// Id levelu pre trasu, alebo null (trasa bez platných `puzzles` hádanku preskočí).
export function pickLevel(from, to) {
  const f = routes.flight(from, to);
  const known = new Set((data.get('puzzles') || []).map((p) => p.id));
  const ids = (f && Array.isArray(f.puzzles) ? f.puzzles : []).filter((id) => known.has(id));
  if (!ids.length) return null;
  return ids[(done.get(`${from}-${to}`) || 0) % ids.length];
}

// Zavolá sa až po vyčistení levelu (odchod cez ikonu domov sa nepočíta).
export function markDone(from, to) {
  if (to) { const k = `${from}-${to}`; done.set(k, (done.get(k) || 0) + 1); }
}
