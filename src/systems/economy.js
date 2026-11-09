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

// Stav upgradu kapacity: aktuálna hodnota, ďalšia hodnota, cena, či sa dá kúpiť.
export function capacityInfo(plane) {
  const idx = save.get().planes[plane.id].capacity;
  const cur = plane.capacity[idx];
  const next = plane.capacity[idx + 1];
  return {
    current: cur.value,
    next: next ? next.value : null,
    cost: next ? next.cost : 0,
    maxed: !next,
    affordable: !!next && save.get().coins >= next.cost,
  };
}

// Kúpi ďalšiu úroveň kapacity za mince. Vráti true pri úspechu.
export function buyCapacity(plane) {
  const info = capacityInfo(plane);
  if (info.maxed || !info.affordable) return false;
  save.addCoins(-info.cost);
  save.get().planes[plane.id].capacity += 1;
  save.save();
  return true;
}
