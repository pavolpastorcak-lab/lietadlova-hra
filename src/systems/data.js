// Načítanie a validácia JSON dát z data/. Obsah hry je len tu, nie v kóde.

const KEYS = ['destinations', 'planes', 'airport', 'flights', 'economy', 'voice'];

// Povinné polia pre položky (pole = zoznam položiek, objekt = priamo).
const REQUIRED = {
  destinations: ['id', 'country', 'flag', 'map', 'weather', 'voice'],
  planes: ['id', 'sprites', 'capacity', 'range'],
  flights: ['from', 'to', 'durationSec', 'obstacles', 'stars'],
  stations: ['id', 'x', 'sprite', 'voice'],
  economy: ['startCoins', 'basePerPassenger', 'tipPerStar', 'tipPerSmile'],
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
  checkItems('economy', [store.economy], REQUIRED.economy, errors);
  errors.forEach((e) => console.error('[data]', e));
  return errors;
}

export function get(key) {
  return store[key];
}

export function destination(id) {
  return (store.destinations || []).find((d) => d.id === id);
}
