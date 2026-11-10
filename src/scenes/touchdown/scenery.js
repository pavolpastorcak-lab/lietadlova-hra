import { addSprite, role } from '../../systems/sprites.js';

// Kulisy pristátia podľa lokality (destinations.json → scenery): skyline, stromy, veža, svetlá dráhy.
// Všetko sa pridá do `world` (zostupuje spolu s krajinou). Chýbajúci sprite sa jednoducho vynechá.
// Vráti { lights, setLit(bool) }; svetlá posúva Touchdown spolu so značkami dráhy.
export function addScenery(scene, world, dest, horizonY, runwayY, lightCfg, gap, count) {
  const sc = (dest && dest.scenery) || {};
  const add = (key, x, o) => {
    const s = addSprite(scene, key, x, horizonY + 14, { origin: [0.5, 1], ...o });
    if (s) world.add(s);
    return s;
  };
  add(sc.skyline, 560, { w: 720 });
  add(role('tower'), 1010, { h: 250 });
  (sc.trees || []).forEach((t) => add(t.sprite, t.x, { h: 150 }));

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
    lights,
    setLit(on) { lights.forEach((l) => l.setTexture(on ? lightCfg.on : lightCfg.off)); },
  };
}
