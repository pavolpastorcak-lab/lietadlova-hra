import { makeBag, addSmile } from './shapes.js';
import * as fx from '../../ui/fx.js';
import * as audio from '../../systems/audio.js';
import { bagKey } from '../../systems/sprites.js';

const BAG_COLORS = [0x27ae60, 0xc0392b, 0x2980b9, 0xf1c40f, 0x8e44ad, 0xd35400, 0x16a085, 0x7f8c8d];

// Batožina: kufor potiahni na pás. Vedľa pásu sa vráti, ak ho pustíš inde. Nič sa nestratí.
export function bags(ctx, done) {
  const { scene, input, people, belt } = ctx;
  const beltZone = input.hitZone(belt.x, belt.y, belt.w, 120);
  let left = people.length;
  let held = null;
  const stripes = fx.belt(scene, belt);
  const beltSnd = audio.loop('sfx_belt');                 // hrá, kým je stanica aktívna (ako pruhy pásu)
  scene.events.once('shutdown', () => beltSnd.stop());

  people.forEach((p, i) => {
    p.bag = makeBag(scene, p.x + 45, p.y + 25, BAG_COLORS[i % BAG_COLORS.length], bagKey(i));
    p.bag.home = { x: p.bag.x, y: p.bag.y };
  });

  ctx.on('dragStart', (pt) => {
    let best = null;
    let bestD = Infinity;
    people.forEach((p) => {
      if (p.bagDone || !input.hitZone(p.bag.x, p.bag.y, 96, 96).contains(pt.x, pt.y)) return;
      const d = Phaser.Math.Distance.Between(p.bag.x, p.bag.y, pt.x, pt.y);
      if (d < bestD) { best = p; bestD = d; }
    });
    if (!best) return;
    held = { p: best, dx: best.bag.x - pt.x, dy: best.bag.y - pt.y };
    best.bag.setDepth(50);
  });

  ctx.on('drag', (pt) => {
    if (held) held.p.bag.setPosition(pt.x + held.dx, pt.y + held.dy);
  });

  ctx.on('dragEnd', (pt) => {
    if (!held) return;
    const { p } = held;
    held = null;
    const bag = p.bag;
    if (!beltZone.contains(pt.x, pt.y)) {
      scene.tweens.add({ targets: bag, x: bag.home.x, y: bag.home.y, duration: 250 });
      return;
    }
    p.bagDone = true;
    scene.tweens.add({
      targets: bag, x: belt.x - 40, y: belt.y - 20, duration: 200,
      onComplete: () => scene.tweens.add({
        targets: bag, x: belt.x + 100, alpha: 0, duration: 700,
        onComplete: () => {
          bag.destroy();
          addSmile(scene, p.c);
          ctx.smiles += 1;
          fx.hop(scene, p.c, p.y);
          if (--left === 0) scene.time.delayedCall(500, () => { stripes.destroy(); beltSnd.stop(); done(); });
        },
      }),
    });
  });
}
