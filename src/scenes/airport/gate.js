import * as fx from '../../ui/fx.js';
import * as audio from '../../systems/audio.js';
// Gate: ťuk na bránu → otvorí sa a cestujúci po schodoch nastúpia do lietadla sami.
export function gate(ctx, done) {
  const { scene, input, plane, people } = ctx;
  const g = ctx.gateInfo;
  const zone = input.hitZone(g.x, g.y, 240, 240);

  ctx.on('tap', (pt) => {
    if (!zone.contains(pt.x, pt.y) || g.opened) return;
    g.opened = true;
    audio.play('sfx_gate');
    if (g.sprite && g.openKey && scene.textures.exists(g.openKey)) {
      g.sprite.setTexture(g.openKey);                       // otvorená brána (sprite)
    } else if (g.door) {
      g.door.setFillStyle(0xfff3b0);
      scene.tweens.add({ targets: g.door, scaleX: 0.3, duration: 300 });
    }

    people.forEach((p, i) => {
      fx.stopSway(p.c);
      const t = (props, cb) => scene.tweens.add({ targets: p.c, duration: 600, ...props, onComplete: cb });
      scene.time.delayedCall(400 + i * 450, () => {
        t({ x: g.x, y: 590 }, () => t({ x: plane.door.x, y: plane.door.y + 40 }, () => t({
          y: plane.door.y - 30, scale: 0.4, alpha: 0, duration: 400,
        }, () => {
          p.c.setVisible(false);
          if (i === people.length - 1) scene.time.delayedCall(500, done);
        })));
      });
    });
  });
}
