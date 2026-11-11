import * as data from '../../systems/data.js';

// Výber hádanky pre trasu. Počítadlo dohratých hádaniek je len v pamäti hry (nie v save).
// Prvý let berie prvý level z poľa, ďalšie idú po kruhu, teda vždy ten, čo sa hral najdávnejšie.
const done = new Map();

// Id levelu pre trasu, alebo null (trasa bez platných `puzzles` hádanku preskočí).
export function pickLevel(to) {
  const f = data.flight(to);
  const known = new Set((data.get('puzzles') || []).map((p) => p.id));
  const ids = (f && Array.isArray(f.puzzles) ? f.puzzles : []).filter((id) => known.has(id));
  if (!ids.length) return null;
  return ids[(done.get(to) || 0) % ids.length];
}

// Zavolá sa až po vyčistení levelu (odchod cez ikonu domov sa nepočíta).
export function markDone(to) {
  if (to) done.set(to, (done.get(to) || 0) + 1);
}
