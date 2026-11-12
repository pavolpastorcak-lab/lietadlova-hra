// Výpočet výplaty a cien. Čísla sú v data/economy.json a data/planes.json.
import * as data from './data.js';
import * as save from './save.js';
import * as routes from './routes.js';

// Základ sa vypláca vždy; hviezdičky a smajlíky dávajú len prepitné.
// quizFirstTry = správna vlajka na prvý pokus: bonus quiz.tipFirstTry ide do prepitného (nenásobí sa mult).
// mult = payMult trasy (chýba = 1): násobí len základ, nie prepitné; zaokrúhľuje sa nahor.
export function payout(passengers, smiles, stars, mult = 1, quizFirstTry = false) {
  const e = data.get('economy');
  const base = Math.ceil(passengers * e.basePerPassenger * (mult || 1) - 1e-9);
  const bonus = quizFirstTry && e.quiz ? e.quiz.tipFirstTry : 0;
  const tip = stars * e.tipPerStar + smiles * e.tipPerSmile + bonus;
  return { base, tip, total: base + tip };
}

// Aktívne lietadlo podľa save (neznáme id = prvé lietadlo z planes.json).
export function activePlane() {
  const list = data.get('planes');
  return list.find((p) => p.id === save.get().activePlane) || list[0];
}

// Prepne aktívne lietadlo (len zápis save; palivo oreže fuelInfo/load).
export function setActivePlane(id) {
  if (!data.get('planes').some((p) => p.id === id)) return false;
  const s = save.get();
  s.activePlane = id;
  if (!s.owned.includes(id)) s.owned.push(id);
  s.fuel = Math.min(s.fuel, planeRange(activePlane()));   // menšia nádrž palivo oreže, väčšia ho nechá
  save.save();
  return true;
}

// Kúpi lietadlo za mince (len raz), vyberie ho a naplní jeho nádrž. Vráti true pri úspechu.
export function buyPlane(id) {
  const p = data.get('planes').find((x) => x.id === id);
  const s = save.get();
  if (!p || s.owned.includes(id) || s.coins < p.cost) return false;
  save.addCoins(-p.cost);
  setActivePlane(id);
  fillTank(p);
  return true;
}

// Stav upgradu (kind = 'capacity' | 'range'): aktuálna hodnota, ďalšia hodnota, cena, či sa dá kúpiť.
export function upgradeInfo(plane, kind) {
  const idx = save.get().planes[plane.id][kind] || 0;
  const cur = plane[kind][idx];
  const next = plane[kind][idx + 1];
  return {
    current: cur.value,
    next: next ? next.value : null,
    cost: next ? next.cost : 0,
    maxed: !next,
    affordable: !!next && save.get().coins >= next.cost,
  };
}

// Kúpi ďalšiu úroveň upgradu za mince. Vráti true pri úspechu.
export function buyUpgrade(plane, kind) {
  const info = upgradeInfo(plane, kind);
  if (info.maxed || !info.affordable) return false;
  save.addCoins(-info.cost);
  save.get().planes[plane.id][kind] = (save.get().planes[plane.id][kind] || 0) + 1;
  save.save();
  return true;
}

// Motor: násobič času letu (1 = základ, 0,8 = o 20 % kratší let), pozri routes.flight.
export const engineValue = (plane) => plane.engine[save.get().planes[plane.id].engine || 0].value;
export const engineInfo = (plane) => upgradeInfo(plane, 'engine');

// Dolet lietadla (km) podľa kúpeného stupňa a či tam lietadlo dolieta.
export function planeRange(plane) {
  return plane.range[save.get().planes[plane.id].range].value;
}

// Dolet sa meria od miesta, kde lietadlo stojí; Bratislava je dosiahnuteľná vždy.
export const inRange = (dest, plane) => routes.reachable(save.get().location, dest.id, planeRange(plane));

// Palivo: nádrž = dolet lietadla, `save.fuel` v km. Bratislava a najbližšie mesto sú vždy zadarmo.
const fuelCfg = () => data.get('economy').fuel;

export function fuelInfo(plane) {
  const max = planeRange(plane);
  const fuel = Math.min(save.get().fuel, max);
  const missing = max - fuel;
  return { fuel, max, missing, coinsToFill: Math.ceil(missing / fuelCfg().kmPerCoin) };
}

// Natankuje za mince: toľko celých mincí, koľko stačí (alebo koľko má); posledná minca doplní do plna, zvyšok prepadne.
// Vráti { coins, km } (km = o koľko stúplo palivo).
export function refuel(plane) {
  const i = fuelInfo(plane);
  const n = Math.min(save.get().coins, i.coinsToFill);
  if (n <= 0) return { coins: 0, km: 0 };
  const km = Math.min(i.missing, n * fuelCfg().kmPerCoin);
  save.addCoins(-n);
  save.get().fuel = i.fuel + km;
  save.save();
  return { coins: n, km };
}

// Plná nádrž zadarmo (kúpa vyššieho doletu).
export function fillTank(plane) {
  save.get().fuel = planeRange(plane);
  save.save();
}

// Let `from` → `to`: palivo klesne o km (min. 0). Mince sa nemenia.
export function consumeFuel(from, to) {
  const s = save.get();
  s.fuel = Math.max(0, (s.fuel || 0) - routes.km(from, to));
  save.save();
}

// Stav špendlíka: 'open' (ako dnes), 'needFuel' (treba natankovať), 'locked' (mimo doletu).
export function pinState(dest, plane) {
  const here = save.get().location;
  if (dest.id === here || dest.id === routes.HOME || dest.id === routes.nearest(here)) return 'open';
  const k = routes.km(here, dest.id);
  if (k <= fuelInfo(plane).fuel) return 'open';
  return k <= planeRange(plane) ? 'needFuel' : 'locked';
}

export const capacityInfo = (plane) => upgradeInfo(plane, 'capacity');
export const buyCapacity = (plane) => buyUpgrade(plane, 'capacity');
