// Páka plynu: zvislá drážka, rúčka sa ťahá nahor. Po pustení ostane, kde je (nič sa nevracia).
// Hodnota 0..1. Hore je zelená značka „plný výkon". Bez textu.

// opts: start (0..1, predvolene 0), goal ('top' | 'bottom', predvolene 'top': kam sa ma paka dotiahnut).
export function makeLever(scene, input, x, topY, botY, onChange, opts = {}) {
  const start = opts.start || 0;
  const goalTop = opts.goal !== 'bottom';
  const gy = goalTop ? topY - 8 : botY + 8;
  const root = scene.add.container(0, 0).setDepth(50);
  const mid = (topY + botY) / 2;

  const slot = scene.add.rectangle(x, mid, 64, botY - topY + 80, 0x2c3e50).setStrokeStyle(6, 0xffffff);
  const full = scene.add.rectangle(x, gy, 120, 56, 0x5cb85c).setStrokeStyle(6, 0xffffff);
  const star = scene.add.star(x, gy, 5, 8, 20, 0xffffff);
  const handle = scene.add.container(x, botY - start * (botY - topY));
  handle.add([
    scene.add.circle(0, 0, 58, 0xd9534f).setStrokeStyle(8, 0xffffff),
    goalTop
      ? scene.add.triangle(0, 0, -26, 16, 26, 16, 0, -22, 0xffffff)   // šípka nahor
      : scene.add.triangle(0, 0, -26, -16, 26, -16, 0, 22, 0xffffff), // šípka nadol
  ]);
  root.add([slot, full, star, handle]);

  const lever = { value: start, grabbed: false, root };
  const setValue = (v) => {
    lever.value = Math.min(1, Math.max(0, v));
    handle.y = botY - lever.value * (botY - topY);
    onChange(lever.value);
  };

  const pulse = scene.tweens.add({
    targets: handle, scale: 1.18, duration: 450, yoyo: true, repeat: -1, ease: 'Sine.inOut',
  });

  let zone = null;
  input.on('dragStart', (p) => {
    zone = input.hitZone(x, handle.y, 180, 180);
    lever.grabbed = zone.contains(p.x, p.y);
    if (lever.grabbed) { pulse.pause(); handle.setScale(1); }
  });
  input.on('drag', (p) => { if (lever.grabbed) setValue((botY - p.y) / (botY - topY)); });
  input.on('dragEnd', () => {
    if (!lever.grabbed) return;
    lever.grabbed = false;
    if (goalTop ? lever.value < 1 : lever.value > 0) pulse.resume();
  });

  lever.lock = () => { lever.grabbed = false; pulse.stop(); handle.setScale(1); };
  return lever;
}
