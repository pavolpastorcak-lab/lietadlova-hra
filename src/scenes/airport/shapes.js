// Zástupná grafika (tvary). Neskôr ju nahradia sprity z kresieb syna.

export const PERSON_COLORS = [0xe74c3c, 0x3498db, 0xf39c12, 0x9b59b6, 0x1abc9c, 0xe67e22, 0x2ecc71, 0xe84393];

export function makePerson(scene, x, y, color) {
  const c = scene.add.container(x, y);
  c.add([scene.add.ellipse(0, 12, 44, 60, color), scene.add.circle(0, -28, 18, 0xf1c27d)]);
  return c;
}

export function makeBag(scene, x, y, color) {
  const c = scene.add.container(x, y);
  c.add([scene.add.rectangle(0, -20, 18, 8, 0x333333), scene.add.rectangle(0, 0, 44, 34, color).setStrokeStyle(3, 0x333333)]);
  return c;
}

// Letenka nad hlavou (ikona bez textu).
export function addTicket(scene, person) {
  const t = scene.add.container(-22, -62);
  t.add([scene.add.rectangle(0, 0, 30, 20, 0xffffff).setStrokeStyle(3, 0x333333), scene.add.rectangle(0, 0, 18, 4, 0x3498db)]);
  person.add(t);
  return t;
}

// Smajlík nad hlavou.
export function addSmile(scene, person) {
  const g = scene.add.graphics();
  g.fillStyle(0xffd23f).fillCircle(22, -62, 16);
  g.fillStyle(0x333333).fillCircle(17, -66, 2.5).fillCircle(27, -66, 2.5);
  g.lineStyle(3, 0x333333).beginPath().arc(22, -62, 9, 0.3, Math.PI - 0.3).strokePath();
  person.add(g);
  return g;
}
