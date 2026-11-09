// Zástupná grafika letu (tvary + HUD bez textu). Neskôr ju nahradia sprity z kresieb syna.

import { addPlane } from '../../systems/sprites.js';

export const PLANE_W = 200, PLANE_H = 70;

export function makePlane(scene, x, y) {
  const c = scene.add.container(x, y).setDepth(20);
  const spr = addPlane(scene, 'air', 0, 0, 230);   // sprite z kresby; hitbox ostáva PLANE_W × PLANE_H
  if (spr) { c.add(spr); return c; }
  c.add([
    scene.add.rectangle(0, 0, PLANE_W, PLANE_H, 0xffffff).setStrokeStyle(6, 0x2e7d32),
    scene.add.rectangle(40, -8, 40, 24, 0x87ceeb).setStrokeStyle(3, 0x2e7d32),     // okno
    scene.add.triangle(-80, -50, 0, 40, 40, 40, 0, 0, 0x2e7d32),                    // chvost
  ]);
  return c;
}

export function makeCloud(scene) {
  const c = scene.add.container(0, 0).setDepth(10);
  c.add([scene.add.circle(-40, 8, 34, 0xffffff), scene.add.circle(0, -8, 44, 0xffffff),
    scene.add.circle(42, 8, 32, 0xffffff), scene.add.rectangle(0, 20, 120, 30, 0xffffff)]);
  c.hit = { w: 150, h: 90 };
  return c;
}

export function makeBird(scene) {
  const g = scene.add.graphics().setDepth(10);
  g.lineStyle(8, 0x333333).beginPath().arc(-22, 0, 24, Math.PI, Math.PI * 2).strokePath();
  g.beginPath().arc(22, 0, 24, Math.PI, Math.PI * 2).strokePath();
  g.hit = { w: 90, h: 50 };
  return g;
}

export function drawStar(g, x, y, r, color = 0xffd23f) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
    pts.push({ x: x + Math.cos(a) * rr, y: y + Math.sin(a) * rr });
  }
  g.fillStyle(color).fillPoints(pts, true).lineStyle(3, 0xc99a00).strokePoints(pts, true);
}

export function makeStar(scene) {
  const g = scene.add.graphics().setDepth(10);
  drawStar(g, 0, 0, 26);
  g.hit = { w: 60, h: 60 };
  return g;
}

// HUD: počítadlo hviezdičiek (vľavo hore vedľa domova) a trasa s lietadielkom (hore v strede).
export function makeHud(scene) {
  const g = scene.add.graphics().setDepth(100);
  g.fillStyle(0xffffff, 0.85).fillRoundedRect(150, 34, 130, 72, 20);
  drawStar(g, 190, 70, 26);
  const txt = scene.add.text(228, 70, '0', { fontSize: '44px', fontStyle: 'bold', color: '#333' })
    .setOrigin(0, 0.5).setDepth(101);

  const x0 = 440, x1 = 1180, y = 70;
  const track = scene.add.graphics().setDepth(100);
  track.lineStyle(8, 0xffffff, 0.9).lineBetween(x0, y, x1, y);
  track.fillStyle(0xffffff).fillCircle(x0, y, 10).fillCircle(x1, y, 10);
  const marker = scene.add.rectangle(x0, y, 44, 18, 0xffffff).setStrokeStyle(4, 0x2e7d32).setDepth(101);

  return {
    setStars: (n) => txt.setText(String(n)),
    setProgress: (p) => { marker.x = x0 + (x1 - x0) * Math.min(1, p); },
  };
}
