import { addSprite, role } from '../../systems/sprites.js';
import { tintFor, addWindows } from '../../ui/daytime.js';

// Kulisy pristátia podľa lokality (destinations.json → scenery): skyline, stromy, veža, svetlá dráhy.
// Všetko sa pridá do `world` (zostupuje spolu s krajinou). Chýbajúci sprite sa jednoducho vynechá.
// Vráti { lights, setLit(bool) }; svetlá posúva Touchdown spolu so značkami dráhy.
// time = 'day' | 'dusk' | 'night' (R2d): kulisy dostanú tint času, v noci aj teplé okná skyline (jeden Graphics).
export function addScenery(scene, world, dest, horizonY, runwayY, lightCfg, gap, count, parallax, time = 'day') {
  const sc = (dest && dest.scenery) || {};
  const add = (key, x, o) => {
    const s = addSprite(scene, key, x, horizonY + 14, { origin: [0.5, 1], ...o });
    if (s) world.add(s);
    return s;
  };
  // Vrstvy s koeficientom posunu (landing.parallax); okraje sa zalamujú, takže sa nikdy neodkryjú.
  const par = parallax || {};
  const layers = [];
  const layer = (k, wrap, items) => { const its = items.filter(Boolean); if (its.length) layers.push({ k, wrap, its }); };
  const SKY_W = 720, SKY_N = 4;                  // 4 × 720 > šírka 1280 + zalomenie
  const sky = [];
  for (let i = 0; i < SKY_N; i++) sky.push(add(sc.skyline, 200 + i * SKY_W, { w: SKY_W + 2 }));
  layer(par.skyline ?? 1, SKY_N * SKY_W, sky);
  const WRAP = 1500;
  layer(par.tower ?? 1, WRAP, [add(role('tower'), 1010, { h: 250 })]);
  layer(par.trees ?? 1, WRAP, (sc.trees || []).map((t) => add(t.sprite, t.x, { h: 150 })));

  const tint = tintFor(time);
  if (tint !== null) layers.forEach(({ its }) => its.forEach((o) => o.setTint(tint)));
  const windows = time === 'night' ? addWindows(scene, world, sky.filter(Boolean), dest && dest.id) : null;

  const lights = [];
  if (lightCfg) {
    for (let i = 0; i < count; i++) {
      const l = addSprite(scene, lightCfg.off, i * gap + gap / 2, runwayY + 4, { w: 56, origin: [0.5, 1] });
      if (!l) break;
      lights.push(l);
      world.add(l);
    }
  }
  return {
    lights, windows,
    scroll(dx) {
      layers.forEach(({ k, wrap, its }) => its.forEach((o) => {
        o.x -= dx * k;
        if (o.x < -380) o.x += wrap;
      }));
      if (windows) windows.draw();
    },
    setLit(on) { lights.forEach((l) => l.setTexture(on ? lightCfg.on : lightCfg.off)); },
  };
}
