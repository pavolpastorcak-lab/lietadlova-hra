// Výpočet výplaty a cien. Čísla sú v data/economy.json a data/planes.json.
import * as data from './data.js';
import * as save from './save.js';

// Základ sa vypláca vždy; hviezdičky a smajlíky dávajú len prepitné.
export function payout(passengers, smiles, stars) {
  const e = data.get('economy');
  const base = passengers * e.basePerPassenger;
  const tip = stars * e.tipPerStar + smiles * e.tipPerSmile;
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

export const capacityInfo = (plane) => upgradeInfo(plane, 'capacity');
export const buyCapacity = (plane) => buyUpgrade(plane, 'capacity');
