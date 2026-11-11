// Trasy z dvoch miest: vzdialenosť (haversine zo `geo`) a parametre letu zo stupňov `flights.byKm`.
// Počasie a vietor patria cieľu (destinations[].flightWeather / wind). Bratislava je dosiahnuteľná vždy.
import * as data from './data.js';

export const HOME = 'bts';
const R = 6371;
const rad = (x) => (x * Math.PI) / 180;

// Vzdialenosť medzi dvoma mestami v km, zaokrúhlená na 10.
export function km(a, b) {
  const p = data.destination(a), q = data.destination(b);
  if (!p || !q || !p.geo || !q.geo) return 0;
  const dLat = rad(q.geo.lat - p.geo.lat), dLon = rad(q.geo.lon - p.geo.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(p.geo.lat)) * Math.cos(rad(q.geo.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round((2 * R * Math.asin(Math.sqrt(h))) / 10) * 10;
}

// Dosiahnuteľné z `from` s doletom `range` (Bratislava vždy).
export function reachable(from, to, range) {
  return to === HOME || km(from, to) <= range;
}

// Parametre letu v tvare, aký čaká Flight: base + stupeň podľa km + počasie cieľa + from, to, km.
// engine = násobič času letu z motora (1 = základ). Časy (durationSec, every, stormCloudEvery, wind.every a
// wind.durationSec, faces.recoverSec) sa vynásobia, speed vydelí: počet prekážok a hviezd na let ostane rovnaký.
export function flight(from, to, engine = 1) {
  const f = data.get('flights');
  const a = from || HOME;
  const d = km(a, to);
  const tier = f.byKm.find((t) => t.upTo === undefined || d <= t.upTo);
  const dest = data.destination(to) || {};
  const { upTo, ...tierData } = tier;
  const out = { ...f.base, ...tierData, from: a, to, km: d };
  if (dest.flightWeather) out.weather = dest.flightWeather;
  if (dest.wind) out.wind = dest.wind;
  return engine === 1 ? out : applyEngine(out, engine);
}

function applyEngine(o, v) {
  const r = { ...o, durationSec: o.durationSec * v, speed: o.speed / v };
  r.obstacles = o.obstacles.map((x) => ({ ...x, every: x.every * v }));
  r.stars = { ...o.stars, every: o.stars.every * v };
  if (o.faces) r.faces = { ...o.faces, recoverSec: o.faces.recoverSec * v };
  if (o.weather) r.weather = { ...o.weather, stormCloudEvery: o.weather.stormCloudEvery * v };
  if (o.wind) r.wind = { ...o.wind, every: o.wind.every * v, durationSec: o.wind.durationSec * v };
  return r;
}
