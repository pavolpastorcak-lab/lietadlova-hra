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
  let hits = 0, cooldown = 0, starCount = 0, storm = null, stormT = 0, block = null;
  // Interval prekážky: v búrke sa mraky plynulo zrýchlia na stormCloudEvery (podľa stormT 0..1).
  const every = (t) => (storm && t.kind === 'cloud' ? t.every + (storm.stormCloudEvery - t.every) * stormT : t.every);
  const randY = (lo, hi) => lo + rand() * (hi - lo);
  // Výška prekážky mimo pásu, ktorý vietor zakázal (vietor.band()); null = nemožno nájsť, prekážka sa preskočí.
  function obstacleY() {
    const b = block && block();
    for (let i = 0; i < 6; i++) {
      const y = randY(minY, maxY);
      if (!b || y < b.lo || y > b.hi) return y;
    }
    return null;
  }

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
    setStorm(cfg, t) { storm = cfg; stormT = t; },       // t > 0: tmavé mraky, bez vtákov
    setBlock(fn) { block = fn; },                        // fn() → { lo, hi } pás bez prekážok, alebo null
    get thin() { return hits >= (flight.thinAfterHits || Infinity); },
    tick(dt) {
      const out = [];
      cooldown = Math.max(0, cooldown - dt);
      timers.forEach((t) => {
        const ev = every(t), stormy = storm && stormT > 0;
        t.left = Math.min(t.left - dt, ev);
        if (t.left > 0) return;
        if (stormy && t.kind === 'bird') { t.left += ev; return; }     // vtáky v búrke nelietajú
        if (t.obstacle && this.thin && rand() > (flight.thinFactor ?? 1)) { t.left += ev; return; }
        if (cooldown > 0) return;               // pošle sa, keď sa uvoľní miesto
        t.left += ev;
        if (t.obstacle) {
          const y = obstacleY();
          if (y === null) return;
          cooldown = MIN_GAP_SEC;
          out.push({ kind: stormy && t.kind === 'cloud' ? 'stormCloud' : t.kind, y });
        } else { cooldown = MIN_GAP_SEC; out.push(...starItems()); }
      });
      return out;
    },
  };
}
