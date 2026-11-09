// Ikona domov vľavo hore (jediné stále tlačidlo v hre). Ťuk → mapa.
export function addHome(scene, input) {
  const x = 70, y = 70;
  const g = scene.add.graphics().setDepth(100);
  g.fillStyle(0xffffff, 0.9).fillCircle(x, y, 48);
  g.fillStyle(0xd9534f).fillTriangle(x - 30, y - 2, x, y - 30, x + 30, y - 2); // strecha
  g.fillStyle(0x8a5a2b).fillRect(x - 22, y - 2, 44, 30);                      // dom
  g.fillStyle(0xffffff).fillRect(x - 7, y + 10, 14, 18);                       // dvere
  input.onTapIn(input.hitZone(x, y, 110, 110), () => scene.scene.start('Map'));
}
