// Načítanie a validácia JSON dát z data/. Obsah hry je len tu, nie v kóde.
import { validateLevel } from '../scenes/apron/board.js';

const KEYS = ['destinations', 'planes', 'airport', 'flights', 'economy', 'voice', 'sprites', 'puzzles'];

// Povinné polia pre položky (pole = zoznam položiek, objekt = priamo).
const REQUIRED = {
  destinations: ['id', 'country', 'flag', 'map', 'weather', 'voice'],
  planes: ['id', 'sprites', 'capacity', 'range'],
  flights: ['from', 'to', 'durationSec', 'obstacles', 'stars'],
  stations: ['id', 'x', 'voice'],
  economy: ['startCoins', 'basePerPassenger', 'tipPerStar', 'tipPerSmile'],
};

const FLIGHT_DEFAULTS = {
  minX: 160, maxX: 900, minY: 140, maxY: 700, followMs: 120, followXMs: 220, speed: 420,
  invulnMs: 1200, fingerOffsetX: -140, returnMs: 800, returnX: 300, returnY: 400,
  tiltMaxDeg: 12, tiltVy: 400, tiltSmoothMs: 80, homeZone: { x: 70, y: 70, w: 130, h: 130 },
};

const CRUISE_DEFAULTS = { rateMin: 0.85, rateMax: 1.25, vxForMax: 500, smoothMs: 250 };

const store = {};

export function queueLoad(scene) {
  KEYS.forEach((k) => scene.load.json(k, `./data/${k}.json`));
}

function checkItems(name, items, fields, errors) {
  if (!Array.isArray(items) || items.length === 0) {
    errors.push(`${name}: očakávam neprázdne pole`);
    return;
  }
  items.forEach((it, i) => {
    fields.forEach((f) => {
      if (it == null || it[f] === undefined) errors.push(`${name}[${i}]: chýba "${f}"`);
    });
  });
}

// Bezpečnostná kontrola: každý kufor sa musí dať zložiť z dostupných vecí.
function checkSecurity(sec, errors) {
  if (!sec) { errors.push('airport.security: chýba blok'); return; }
  ['bags', 'itemsPerBag', 'firstBagForbidden', 'idleHintSec'].forEach((f) => {
    if (typeof sec[f] !== 'number') errors.push(`airport.security: chýba "${f}"`);
  });
  const fpb = sec.forbiddenPerBag;
  if (!Array.isArray(fpb) || !fpb.length) { errors.push('airport.security: "forbiddenPerBag" má byť neprázdne pole'); return; }
  if (!Array.isArray(sec.items)) { errors.push('airport.security: chýba "items"'); return; }
  const forb = sec.items.filter((i) => i.type === 'forbidden').length;
  const allowed = sec.items.filter((i) => i.type === 'allowed').length;
  if (forb < Math.max(...fpb, sec.firstBagForbidden)) errors.push('airport.security: málo zakázaných vecí');
  if (allowed < sec.itemsPerBag - Math.min(...fpb, sec.firstBagForbidden)) errors.push('airport.security: málo povolených vecí');
  const p = sec.panel;
  ['x', 'y', 'w', 'h', 'itemSize', 'binX', 'binSize'].forEach((f) => {
    if (!p || typeof p[f] !== 'number') errors.push(`airport.security.panel: chýba "${f}"`);
  });
  if (!p || !Array.isArray(p.itemXs) || p.itemXs.length < sec.itemsPerBag) errors.push('airport.security.panel: "itemXs" má mať položku pre každú vec');
}

// Hádanky: tvar levelu a riešiteľnosť (slepá ulička = chyba dát).
function checkPuzzles(list, flights, errors) {
  if (!Array.isArray(list) || !list.length) { errors.push('puzzles: očakávam neprázdne pole'); return; }
  list.forEach((lv, i) => validateLevel(lv).forEach((e) => errors.push(`puzzles[${i}] ${lv && lv.id}: ${e}`)));
  const ids = new Set(list.map((lv) => lv && lv.id));
  (flights || []).forEach((f) => {
    if (f.puzzles === undefined) return;
    if (!Array.isArray(f.puzzles)) { errors.push(`flights ${f.to}: "puzzles" má byť pole`); return; }
    f.puzzles.forEach((id) => { if (!ids.has(id)) errors.push(`flights ${f.to}: neznáma hádanka "${id}"`); });
  });
}

// Prevezme dáta z Phaser cache, overí ich a vráti zoznam chýb (prázdny = OK).
export function collect(scene) {
  KEYS.forEach((k) => { store[k] = scene.cache.json.get(k); });
  const errors = [];
  KEYS.forEach((k) => { if (store[k] == null) errors.push(`${k}.json sa nenačítal`); });
  checkItems('destinations', store.destinations, REQUIRED.destinations, errors);
  checkItems('planes', store.planes, REQUIRED.planes, errors);
  checkItems('flights', store.flights, REQUIRED.flights, errors);
  checkItems('airport.stations', store.airport && store.airport.stations, REQUIRED.stations, errors);
  if (!store.airport || typeof store.airport.flight !== 'object') errors.push('airport.flight: chýba blok');
  const cr = store.airport && store.airport.audio && store.airport.audio.cruise;
  ['rateMin', 'rateMax', 'vxForMax', 'smoothMs'].forEach((f) => {
    if (!cr || typeof cr[f] !== 'number') errors.push(`airport.audio.cruise: chýba "${f}"`);
  });
  checkSecurity(store.airport && store.airport.security, errors);
  if (!store.sprites || typeof store.sprites.fx !== 'object') errors.push('sprites.fx: chýba blok');
  const hp = store.sprites && store.sprites.hangarPanels;
  ['capacity', 'range'].forEach((k) => {
    ['x', 'y', 'w', 'h'].forEach((f) => {
      if (!hp || !hp[k] || hp[k][f] === undefined) errors.push(`sprites.hangarPanels.${k}: chýba "${f}"`);
    });
  });
  checkPuzzles(store.puzzles, store.flights, errors);
  checkItems('economy', [store.economy], REQUIRED.economy, errors);
  const qz = store.economy && store.economy.quiz;
  ['options', 'tipFirstTry', 'flagW', 'gap', 'y', 'gapMs', 'maxWaitMs', 'idleMs', 'doneMs'].forEach((f) => {
    if (!qz || typeof qz[f] !== 'number') errors.push(`economy.quiz: chýba "${f}"`);
  });
  if (qz && !Array.isArray(qz.extraFlags)) errors.push('economy.quiz: chýba "extraFlags"');
  errors.forEach((e) => console.error('[data]', e));
  return errors;
}

export function get(key) {
  return store[key];
}

export function flight(to) {
  return (store.flights || []).find((f) => f.to === to);
}

// Nastavenia letu: airport.flight doplnené o predvolené hodnoty.
export function flightCfg() {
  return { ...FLIGHT_DEFAULTS, ...((store.airport && store.airport.flight) || {}) };
}

// Nastavenia zvuku motora v lete (výška tónu podľa pohybu do strán).
export function cruiseCfg() {
  return { ...CRUISE_DEFAULTS, ...((store.airport && store.airport.audio && store.airport.audio.cruise) || {}) };
}

export function destination(id) {
  return (store.destinations || []).find((d) => d.id === id);
}

// Level hádanky podľa id (neznáme id → prvý level).
export function puzzle(id) {
  const list = store.puzzles || [];
  return list.find((p) => p.id === id) || list[0];
}
