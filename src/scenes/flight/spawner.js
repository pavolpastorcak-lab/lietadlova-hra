// Generátor prekážok a hviezdičiek podľa data/flights.json (bez herného obsahu v kóde).
// tick(dt) vráti zoznam { kind, y, dx? } na vytvorenie (dx = posun za okrajom obrazovky, pre rad hviezdičiek).
// Po thinAfterHits nárazoch sa prekážky vynechávajú s pravdepodobnosťou (1 - thinFactor);
// hviezdičky sa nezriedia. Každá arcEvery-tá hviezdička je rad 3 hviezdičiek v oblúku.

const MIN_GAP_SEC = 0.35;   // min. rozostup medzi vytvorenými objektmi (nezlepia sa)

export function createSpawner(flight, bounds, rand = Math.random) {
  const { minY, maxY } = bounds;
  const timers = [
    ...flight.obstacles.map((o) => ({ kind: o.type, every: o.every, left: o.every, obstacle: true })),
    { kind: 'star', every: flight.stars.every, left: flight.stars.every * 0.5, obstacle: false },
  ];
  let hits = 0, cooldown = 0, starCount = 0;
  const randY = (lo, hi) => lo + rand() * (hi - lo);

  function starItems() {
    starCount += 1;
    const st = flight.stars;
    if (!(st.arcEvery && starCount % st.arcEvery === 0)) return [{ kind: 'star', y: randY(minY, maxY) }];
    const rise = st.arcRise || 0, dx = st.arcDx || 100;       // oblúk: stredná hviezdička vyššie, celý rad v pásme
    const y = randY(minY + rise, maxY);
    return [0, 1, 2].map((i) => ({ kind: 'star', y: i === 1 ? y - rise : y, dx: i * dx }));
  }

  return {
    hit() { hits += 1; },
    get thin() { return hits >= (flight.thinAfterHits || Infinity); },
    tick(dt) {
      const out = [];
      cooldown = Math.max(0, cooldown - dt);
      timers.forEach((t) => {
        t.left -= dt;
        if (t.left > 0) return;
        if (t.obstacle && this.thin && rand() > (flight.thinFactor ?? 1)) { t.left += t.every; return; }
        if (cooldown > 0) return;               // pošle sa, keď sa uvoľní miesto
        t.left += t.every;
        cooldown = MIN_GAP_SEC;
        if (t.obstacle) out.push({ kind: t.kind, y: randY(minY, maxY) });
        else out.push(...starItems());
      });
      return out;
    },
  };
}
