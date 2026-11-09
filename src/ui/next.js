// DOČASNÉ: zástupná šípka "ďalej" pre kostru 2a.
// V 2b–2d ju nahradí postup cez akcie priamo na objektoch.
export function addNext(scene, input, onTap) {
  const x = 1150, y = 700, w = 180, h = 130;
  const g = scene.add.graphics().setDepth(100);
  g.fillStyle(0x3cb44b).fillRoundedRect(x - w / 2, y - h / 2, w, h, 24);
  g.fillStyle(0xffffff).fillTriangle(x - 30, y - 40, x - 30, y + 40, x + 45, y);
  input.onTapIn(input.hitZone(x, y, w, h), onTap);
}
