// Glóbus na mape (vľavo hore): ťuk prepne medzi mapami z sprites.json → maps. Ikona je kreslená kódom (sprite neskôr).
// Poloha a veľkosť: sprites.json → globe. Prechod = fade z kamery, potom restart scény s novým `view`.
import * as data from '../../systems/data.js';

export function nextView(view) {
  const keys = Object.keys(data.get('sprites').maps);
  return keys[(keys.indexOf(view) + 1) % keys.length];
}

// Vráti { zone, box } (zásahová plocha v súradniciach obrazovky, aby ju špendlíky pod ňou ignorovali; box = kontajner na pripnutie k obrazovke).
export function addGlobe(scene, input, view) {
  const g = data.get('sprites').globe;
  const box = scene.add.container(g.x, g.y).setDepth(100);
  box.add(scene.add.circle(0, 0, g.r + 6, 0xffffff, 0.92).setStrokeStyle(5, 0xb8860b));
  box.add(scene.add.circle(0, 0, g.r, 0x3498db));
  [[-14, -10, 34, 26], [16, 8, 22, 30], [-8, 22, 18, 12]].forEach(([x, y, w, h]) => box.add(scene.add.ellipse(x, y, w, h, 0x5fb760)));
  box.add(scene.add.ellipse(-g.r * 0.3, -g.r * 0.35, g.r * 0.5, g.r * 0.28, 0xffffff, 0.35));   // odlesk
  const zone = input.hitZone(g.x, g.y, g.hit, g.hit);
  let busy = false;
  input.onTapIn(zone, () => {
    if (busy) return;
    busy = true;
    scene.tweens.add({ targets: box, scale: 1.15, duration: 100, yoyo: true });
    scene.cameras.main.once('camerafadeoutcomplete', () => scene.scene.restart({ view: nextView(view), switched: true }));
    scene.cameras.main.fadeOut(g.fadeMs, 74, 163, 223);
  });
  return { zone, box };
}
