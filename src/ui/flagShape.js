// Záložná vlajka kreslená kódom (pásy vo farbách krajiny, bez textu), kým nie je sprite `flag_<kód>`.
// Farby sú v data/sprites.json → flagFallback[kód]. Krajina bez záznamu = null (volajúci si poradí sám).
import * as data from '../systems/data.js';

const hex = (s) => Phaser.Display.Color.HexStringToColor(s).color;

export function flagShape(scene, country, x, y, w) {
  const def = ((data.get('sprites') || {}).flagFallback || {})[country];
  if (!def) return null;
  const h = Math.round(w * 0.75);
  const box = scene.add.container(x, y).setSize(w, h);
  const n = def.colors.length;
  def.colors.forEach((c, i) => {
    const horiz = def.dir !== 'v';
    const sw = horiz ? w : w / n, sh = horiz ? h / n : h;
    const px = horiz ? 0 : -w / 2 + sw * (i + 0.5), py = horiz ? -h / 2 + sh * (i + 0.5) : 0;
    box.add(scene.add.rectangle(px, py, sw + 1, sh + 1, hex(c)));
  });
  if (def.left) box.add(scene.add.rectangle(-w / 2 + w * 0.125, 0, w * 0.25, h, hex(def.left)));
  if (def.cross) {
    box.add(scene.add.rectangle(0, 0, w * 0.14, h, hex(def.cross)));
    box.add(scene.add.rectangle(0, 0, w, h * 0.18, hex(def.cross)));
  }
  box.add(scene.add.rectangle(0, 0, w, h).setStrokeStyle(Math.max(2, w / 32), 0x7a7a7a));   // obrys, aby biela vlajka nezapadla do mapy
  return box;
}
