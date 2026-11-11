// Zástupná grafika (tvary) je záložná: ak sprite chýba, nakreslí sa tvar. Mená spritov idú z dát.
import { addSprite, role } from '../../systems/sprites.js';

export const PERSON_COLORS = [0xe74c3c, 0x3498db, 0xf39c12, 0x9b59b6, 0x1abc9c, 0xe67e22, 0x2ecc71, 0xe84393];

// spriteKey: sprite postavy (nohy pri y + 45, zhruba ako zástupný tvar).
export function makePerson(scene, x, y, color, spriteKey) {
  const c = scene.add.container(x, y);
  const spr = addSprite(scene, spriteKey, 0, 45, { origin: [0.5, 1] });
  if (spr) { c.add(spr); return c; }
  c.add([scene.add.ellipse(0, 12, 44, 60, color), scene.add.circle(0, -28, 18, 0xf1c27d)]);
  return c;
}

// Vráti objekt, ktorý sa dá ťahať a mazať (sprite alebo kontajner).
export function makeBag(scene, x, y, color, spriteKey) {
  const spr = addSprite(scene, spriteKey, x, y);
  if (spr) return spr;
  const c = scene.add.container(x, y);
  c.add([scene.add.rectangle(0, -20, 18, 8, 0x333333), scene.add.rectangle(0, 0, 44, 34, color).setStrokeStyle(3, 0x333333)]);
  return c;
}

// Letenka nad hlavou (ikona bez textu).
export function addTicket(scene, person) {
  const spr = addSprite(scene, role('ticket'), -30, -100, { w: 42 });
  if (spr) { person.add(spr); return spr; }
  const t = scene.add.container(-22, -62);
  t.add([scene.add.rectangle(0, 0, 30, 20, 0xffffff).setStrokeStyle(3, 0x333333), scene.add.rectangle(0, 0, 18, 4, 0x3498db)]);
  person.add(t);
  return t;
}

// Smajlík nad hlavou.
export function addSmile(scene, person) {
  const spr = addSprite(scene, role('smile'), 30, -100, { w: 42 });
  if (spr) { person.add(spr); return spr; }
  const g = scene.add.graphics();
  g.fillStyle(0xffd23f).fillCircle(22, -62, 16);
  g.fillStyle(0x333333).fillCircle(17, -66, 2.5).fillCircle(27, -66, 2.5);
  g.lineStyle(3, 0x333333).beginPath().arc(22, -62, 9, 0.3, Math.PI - 0.3).strokePath();
  person.add(g);
  return g;
}

// ---- Bezpečnostná kontrola: záložné tvary (sprite z role/poľa `sprite`, ak existuje) ----

// Skener: rám tunela so svetlom (`light`) a bodkami kufrov (`dots`). Origin kontajnera = stred spodnej hrany.
export function makeScanner(scene, x, y, w, bags) {
  const c = scene.add.container(x, y);
  const spr = addSprite(scene, role('scanner'), 0, 0, { w, origin: [0.5, 1] });
  if (spr) c.add(spr);
  else {
    c.add([scene.add.rectangle(0, -85, w, 170, 0x7f8c8d).setStrokeStyle(5, 0x34495e),
      scene.add.rectangle(0, -60, w - 50, 90, 0x2c3e50), scene.add.rectangle(0, -60, w - 90, 8, 0x95a5a6)]);
  }
  // so spritom sedí stavové svetlo na jeho lampe (lampa je hore, ~8 % výšky od vrchu)
  c.light = spr ? scene.add.circle(spr.displayWidth * 0.01, -spr.displayHeight * 0.92, 13, 0xe74c3c).setStrokeStyle(3, 0x34495e)
    : scene.add.circle(0, -150, 18, 0xe74c3c).setStrokeStyle(4, 0x34495e);
  c.dots = [];
  for (let i = 0; i < bags; i++) c.dots.push(scene.add.circle((i - (bags - 1) / 2) * 34, -18, 11, 0xbdc3c7).setStrokeStyle(3, 0x34495e));
  c.add([c.light, ...c.dots]);
  return c;
}

// Kôš: stred x,y, výška ~ size.
export function makeBin(scene, x, y, size) {
  const spr = addSprite(scene, role('bin'), x, y, { h: size });
  if (spr) return spr;
  const c = scene.add.container(x, y);
  const k = size / 150;
  const g = scene.add.graphics();
  g.fillStyle(0x3a7bd5).lineStyle(5, 0x1f4e8c);
  g.fillPoints([{ x: -60 * k, y: -50 * k }, { x: 60 * k, y: -50 * k }, { x: 48 * k, y: 70 * k }, { x: -48 * k, y: 70 * k }], true);
  g.strokePoints([{ x: -60 * k, y: -50 * k }, { x: 60 * k, y: -50 * k }, { x: 48 * k, y: 70 * k }, { x: -48 * k, y: 70 * k }], true);
  g.fillStyle(0x1f4e8c).fillRect(-72 * k, -70 * k, 144 * k, 22 * k);
  g.fillStyle(0xffffff).fillTriangle(-24 * k, -10 * k, 24 * k, -10 * k, 0, 30 * k);   // šípka nadol
  c.add(g);
  return c;
}

// Vec v kufri: rozoznateľný tvar, veľký `size` px (stred x,y). def = položka z airport.security.items.
export function makeItem(scene, def, x, y, size) {
  const spr = addSprite(scene, def.sprite, x, y, { w: size });
  if (spr) { if (spr.displayHeight > size) spr.setScale(size / spr.height); return spr; }   // dlhšia strana = size
  const c = scene.add.container(x, y);
  const k = size / 120, col = Number(def.color);
  const g = scene.add.graphics();
  const R = (a, b, w, h, f) => g.fillStyle(f).fillRect(a * k, b * k, w * k, h * k);
  const C = (a, b, r, f) => g.fillStyle(f).fillCircle(a * k, b * k, r * k);
  if (def.id === 'flasa') {
    R(-28, -20, 56, 80, col); R(-14, -55, 28, 36, 0xd6eaf8); R(-18, -66, 36, 14, 0xe74c3c); R(-28, 5, 56, 22, 0xffffff);
  } else if (def.id === 'noznice') {
    g.lineStyle(10 * k, 0x95a5a6).lineBetween(-5 * k, 5 * k, 30 * k, -55 * k).lineBetween(5 * k, 5 * k, -30 * k, -55 * k);
    g.lineStyle(10 * k, col).strokeCircle(-22 * k, 38 * k, 18 * k).strokeCircle(22 * k, 38 * k, 18 * k);
  } else if (def.id === 'macko') {
    C(-34, -38, 16, col); C(34, -38, 16, col); C(0, -10, 44, col); C(0, 8, 20, 0xf5cba7);
    C(-16, -20, 6, 0x222222); C(16, -20, 6, 0x222222); C(0, 0, 7, 0x222222);
  } else if (def.id === 'tricko') {
    R(-30, -45, 60, 100, col); R(-62, -45, 36, 34, col); R(26, -45, 36, 34, col); C(0, -45, 16, 0xf5f5f5);
  } else {  // kniha
    R(-42, -52, 84, 104, col); R(-34, -44, 76, 88, 0xffffff); R(-42, -52, 14, 104, 0x1e8449); R(-12, -22, 44, 8, 0x95a5a6); R(-12, 0, 44, 8, 0x95a5a6);
  }
  c.add(g);
  return c;
}
