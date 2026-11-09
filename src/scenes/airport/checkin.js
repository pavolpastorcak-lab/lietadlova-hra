import { addTicket } from './shapes.js';

// Check-in: ťuk na každého cestujúceho → dostane letenku.
export function checkin(ctx, done) {
  const { scene, input, people } = ctx;
  let left = people.length;
  const zones = people.map((p) => input.hitZone(p.x, p.y, 96, 96));

  ctx.on('tap', (pt) => {
    const i = people.findIndex((p, k) => !p.ticket && zones[k].contains(pt.x, pt.y));
    if (i < 0) return;
    const p = people[i];
    p.ticket = addTicket(scene, p.c);
    scene.tweens.add({ targets: p.c, y: p.y - 14, duration: 120, yoyo: true });
    if (--left === 0) scene.time.delayedCall(500, done);
  });
}
