// Generátor prekážok a hviezdičiek podľa data/flights.json (bez herného obsahu v kóde).
// tick(dt) vráti zoznam { kind, y } na vytvorenie. Po thinAfterHits nárazoch sa prekážky
// vynechávajú s pravdepodobnosťou (1 - thinFactor); hviezdičky sa nezriedia.

const MIN_Y = 140, MAX_Y = 700;
const MIN_GAP_SEC = 0.35;   // min. rozostup medzi vytvorenými objektmi (nezlepia sa)

export function createSpawner(flight, rand = Math.random) {
  const timers = [
    ...flight.obstacles.map((o) => ({ kind: o.type, every: o.every, left: o.every, obstacle: true })),
    { kind: 'star', every: flight.stars.every, left: flight.stars.every * 0.5, obstacle: false },
  ];
  let hits = 0, cooldown = 0;

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
        out.push({ kind: t.kind, y: MIN_Y + rand() * (MAX_Y - MIN_Y) });
      });
      return out;
    },
  };
}
