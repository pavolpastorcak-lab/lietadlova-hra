// Mince: ikona a počítadlo (číslo). Sprite ui_minca, záložne tvary.
import { addSprite, role } from '../systems/sprites.js';

export function makeCoin(scene, x, y, r = 22) {
  const spr = addSprite(scene, role('coin'), x, y, { w: r * 2.2 });
  if (spr) return spr;
  const c = scene.add.container(x, y);
  c.add([scene.add.circle(0, 0, r, 0xf5c518).setStrokeStyle(4, 0xb8860b),
    scene.add.circle(0, 0, r * 0.55, 0xffe066)]);
  return c;
}

// Počítadlo vpravo hore. set(n) zmení zobrazené číslo.
export function addCoinCounter(scene, value) {
  const x = 1130, y = 70;
  scene.add.rectangle(x + 40, y, 200, 70, 0xffffff, 0.9).setDepth(100).setStrokeStyle(4, 0xb8860b);
  const icon = makeCoin(scene, x - 30, y, 26).setDepth(101);
  const txt = scene.add.text(x + 90, y, String(value), {
    fontFamily: 'Arial', fontSize: '44px', fontStyle: 'bold', color: '#333333',
  }).setOrigin(1, 0.5).setDepth(101);
  return { icon, set: (n) => txt.setText(String(n)) };
}
