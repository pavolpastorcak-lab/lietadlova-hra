import { addSprite, role } from '../../systems/sprites.js';

const COLORS = { car: 0x3a86ff, bus: 0xffc107, truck: 0xff7043 };
const ASPECT = { car: 0.78, bus: 0.9, truck: 0.84 };   // šírka tela voči bunke

// Vozidlo zhora, predok smeruje doprava a celý kontajner sa otočí podľa šípky (rotation = angle).
// Sprite z role (car/bus/truck) sa kreslí rovnako orientovaný (predok vpravo); šípka je vždy navrchu.
export function makeVehicle(scene, piece, cell, ratio, angle, spriteLong) {
  const s = cell * ratio;
  const c = scene.add.container(0, 0).setAngle(angle);
  const spr = addSprite(scene, role(piece.kind), 0, 0, { scale: 1 });
  if (spr) {
    spr.setScale((cell * (spriteLong || ratio)) / Math.max(spr.width, spr.height));   // zachová pomer strán, dlhšia strana = zlomok bunky
    c.add(spr);
  }
  else {
    const g = scene.add.graphics();
    const w = s * ASPECT[piece.kind];
    g.fillStyle(0x000000, 0.25).fillRoundedRect(-s / 2 + 5, -w / 2 + 7, s, w, 26);
    g.fillStyle(COLORS[piece.kind] || 0x888888).fillRoundedRect(-s / 2, -w / 2, s, w, 26);
    g.lineStyle(6, 0xffffff).strokeRoundedRect(-s / 2, -w / 2, s, w, 26);
    g.fillStyle(0x263238, 0.8).fillRoundedRect(s * 0.22, -w / 2 + 12, s * 0.18, w - 24, 8);   // čelné sklo
    g.fillStyle(0xfff59d).fillCircle(s / 2 - 8, -w * 0.3, 8).fillCircle(s / 2 - 8, w * 0.3, 8);  // svetlá vpredu
    c.add(g);
  }
  // Šípka: biela s čiernym obrysom, vždy v smere pohybu (rovnako ako predok vozidla).
  const a = scene.add.graphics();
  const t = s * 0.09, x0 = -s * 0.3, x1 = s * 0.04, x2 = s * 0.34, hw = s * 0.2;
  const pts = [[x0, -t], [x1, -t], [x1, -hw], [x2, 0], [x1, hw], [x1, t], [x0, t]].map(([x, y]) => new Phaser.Geom.Point(x, y));
  a.fillStyle(0xffffff).fillPoints(pts, true);
  a.lineStyle(6, 0x212121).strokePoints(pts, true);
  c.add(a);
  return c;
}
