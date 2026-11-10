// Načítanie a validácia JSON dát z data/. Obsah hry je len tu, nie v kóde.

const KEYS = ['destinations', 'planes', 'airport', 'flights', 'economy', 'voice', 'sprites'];

// Povinné polia pre položky (pole = zoznam položiek, objekt = priamo).
const REQUIRED = {
  destinations: ['id', 'country', 'flag', 'map', 'weather', 'voice'],
  planes: ['id', 'sprites', 'capacity', 'range'],
  flights: ['from', 'to', 'durationSec', 'obstacles', 'stars'],
  stations: ['id', 'x', 'sprite', 'voice'],
  economy: ['startCoins', 'basePerPassenger', 'tipPerStar', 'tipPerSmile'],
};

const FLIGHT_DEFAULTS = {
  minX: 160, maxX: 900, minY: 140, maxY: 700, followMs: 120, followXMs: 220, speed: 420,
  invulnMs: 1200, fingerOffsetX: -140, returnMs: 800, returnX: 300, returnY: 400,
  tiltMaxDeg: 12, tiltVy: 400, tiltSmoothMs: 80, homeZone: { x: 70, y: 70, w: 130, h: 130 },
};

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
  if (!store.sprites || typeof store.sprites.fx !== 'object') errors.push('sprites.fx: chýba blok');
  checkItems('economy', [store.economy], REQUIRED.economy, errors);
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

export function destination(id) {
  return (store.destinations || []).find((d) => d.id === id);
}
