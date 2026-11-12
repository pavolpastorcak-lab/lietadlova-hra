import * as data from '../../systems/data.js';
import { addTicket } from './shapes.js';

// Check-in: ťuk na cestujúceho → dostane letenku. Po `checkin.maxTaps` ťukoch dostanú letenky ostatní sami
// (jeden po druhom, `autoMs`), aby check-in pri 14 cestujúcich nebol zdĺhavý.
export function checkin(ctx, done) {
  const { scene, input, people } = ctx;
  const cfg = data.get('airport').checkin || { maxTaps: 6, autoMs: 180 };
  let left = people.length, taps = 0, auto = false;
  const zones = people.map((p) => input.hitZone(p.x, p.y, 96, 96));

  const give = (p) => {
    p.ticket = addTicket(scene, p.c);
    scene.tweens.add({ targets: p.c, y: p.y - 14, duration: 120, yoyo: true });
    if (--left === 0) scene.time.delayedCall(500, done);
  };

  ctx.on('tap', (pt) => {
    if (auto) return;
    const i = people.findIndex((p, k) => !p.ticket && zones[k].contains(pt.x, pt.y));
    if (i < 0) return;
    give(people[i]);
    if (++taps >= cfg.maxTaps && left > 0) {
      auto = true;
      people.filter((p) => !p.ticket).forEach((p, n) => scene.time.delayedCall((n + 1) * cfg.autoMs, () => give(p)));
    }
  });
}
