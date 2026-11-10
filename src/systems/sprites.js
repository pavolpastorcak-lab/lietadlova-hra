// Sprity z kresieb syna. Všetky mená a mierky sú v data/ (sprites.json, airport.json, destinations.json).
// Chýbajúci sprite = addSprite vráti null a scéna nakreslí pôvodný záložný tvar.
import * as data from './data.js';

const cfg = () => data.get('sprites') || { dir: './assets/sprites/', roles: {}, scale: {}, people: [], bags: { sizes: [], colors: [] } };
const catOf = (key) => key.split('_')[0];
const pathOf = (key) => {
  const c = cfg(), cat = catOf(key);
  return `${c.dir}${cat}/${key}.${(c.ext || {})[cat] || 'png'}`;
};

// Rola → názov sprite (alebo pole názvov).
export function role(name) { return cfg().roles[name]; }
export function personKey(i) { const p = cfg().people; return p.length ? p[i % p.length] : null; }
export function bagKey(i) {
  const { sizes, colors } = cfg().bags;
  return sizes.length && colors.length ? `bag_${sizes[i % sizes.length]}_${colors[i % colors.length]}` : null;
}

// Zoznam všetkých spritov, ktoré hra používa (z dát), bez lietadiel.
export function allKeys() {
  const c = cfg(), keys = new Set();
  const add = (k) => { if (typeof k === 'string' && k) keys.add(k); };
  Object.values(c.roles).forEach((v) => (Array.isArray(v) ? v.forEach(add) : add(v)));
  c.people.forEach(add);
  c.bags.sizes.forEach((s) => c.bags.colors.forEach((col) => add(`bag_${s}_${col}`)));
  const ap = data.get('airport') || {};
  (ap.stations || []).forEach((s) => { if (s.sprite && !s.sprite.startsWith('plane_')) add(s.sprite); add(s.spriteOpen); });
  (ap.backdrop || []).forEach((b) => add(b.sprite));
  if (ap.landing && ap.landing.lights) Object.values(ap.landing.lights).forEach(add);
  (data.get('destinations') || []).forEach((d) => {
    add(d.flag); add(d.mapLayer);
    if (d.scenery) { add(d.scenery.skyline); (d.scenery.trees || []).forEach((t) => add(t.sprite)); }
  });
  return [...keys];
}

export function queueSprites(scene) {
  allKeys().forEach((k) => { if (!scene.textures.exists(k)) scene.load.image(k, pathOf(k)); });
}

// opts: w / h (cieľová šírka alebo výška), scale (násobok), origin [x, y].
export function addSprite(scene, key, x, y, opts = {}) {
  if (!key || !scene.textures.exists(key)) return null;
  const img = scene.add.image(x, y, key);
  if (opts.w) img.setScale(opts.w / img.width);
  else if (opts.h) img.setScale(opts.h / img.height);
  else img.setScale(opts.scale ?? cfg().scale[catOf(key)] ?? 1);
  if (opts.origin) img.setOrigin(opts.origin[0], opts.origin[1]);
  return img;
}

// --- Lietadlá (mená z planes.json: sprites.side / air / top) ---
const PLANE_DIR = './assets/sprites/plane/';

export function queuePlaneSprites(scene, planes) {
  planes.forEach((p) => {
    Object.values(p.sprites).forEach((key) => {
      if (key) scene.load.image(key, `${PLANE_DIR}${key}.png`);
    });
  });
}

// kind: 'side' | 'air' | 'top'. Šírka v px, výška podľa pomeru strán.
export function addPlane(scene, kind, x, y, width, planeIndex = 0) {
  const plane = data.get('planes')[planeIndex];
  const key = plane && plane.sprites[kind];
  return addSprite(scene, key, x, y, { w: width });
}
