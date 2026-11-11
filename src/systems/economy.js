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

// Stav upgradu (kind = 'capacity' | 'range'): aktuálna hodnota, ďalšia hodnota, cena, či sa dá kúpiť.
export function upgradeInfo(plane, kind) {
  const idx = save.get().planes[plane.id][kind];
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
  save.get().planes[plane.id][kind] += 1;
  save.save();
  return true;
}

// Dolet lietadla (km) podľa kúpeného stupňa a či tam lietadlo dolieta.
export function planeRange(plane) {
  return plane.range[save.get().planes[plane.id].range].value;
}

// Dolet sa meria od miesta, kde lietadlo stojí; Bratislava je dosiahnuteľná vždy.
export const inRange = (dest, plane) => routes.reachable(save.get().location, dest.id, planeRange(plane));

export const capacityInfo = (plane) => upgradeInfo(plane, 'capacity');
export const buyCapacity = (plane) => buyUpgrade(plane, 'capacity');
