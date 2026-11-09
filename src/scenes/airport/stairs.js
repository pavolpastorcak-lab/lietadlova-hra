// Boarding: potiahni nástupné schody k dverám lietadla. Pustené inde sa vrátia na štart.
export function stairs(ctx, done) {
  const { scene, input, plane } = ctx;
  const st = scene.add.container(plane.stairsStart.x, plane.stairsStart.y);
  st.add(scene.add.rectangle(0, 0, 130, 110, 0xa0522d).setStrokeStyle(4, 0x5a2d0c));
  [-30, 0, 30].forEach((y) => st.add(scene.add.rectangle(0, y, 110, 8, 0x5a2d0c)));
  ctx.stairs = st;

  const mark = scene.add.circle(plane.door.x, plane.door.y, 60).setStrokeStyle(6, 0xffffff);
  const pulse = scene.tweens.add({ targets: mark, alpha: 0.2, duration: 500, yoyo: true, repeat: -1 });
  const grab = input.hitZone(st.x, st.y, 150, 130);
  let held = null;

  ctx.on('dragStart', (pt) => {
    if (grab.contains(pt.x, pt.y)) held = { dx: st.x - pt.x, dy: st.y - pt.y };
  });
  ctx.on('drag', (pt) => { if (held) st.setPosition(pt.x + held.dx, pt.y + held.dy); });
  ctx.on('dragEnd', () => {
    if (!held) return;
    held = null;
    const near = Phaser.Math.Distance.Between(st.x, st.y, plane.door.x, plane.door.y) < 110;
    const to = near ? plane.door : plane.stairsStart;
    scene.tweens.add({
      targets: st, x: to.x, y: to.y, duration: 250,
      onComplete: () => {
        if (!near) return;
        pulse.stop();
        mark.destroy();
        scene.time.delayedCall(300, done);
      },
    });
  });
}
