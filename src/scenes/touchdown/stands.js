import * as audio from '../../systems/audio.js';

// Stojiská pod dráhou: každé má veľké číslo. Hlas povie cieľové číslo, syn ťukne na správne.
// Zlý ťuk = len jemné zatrasenie stojiska (žiadny trest). Pri nečinnosti cieľ pulzuje a hlas zopakuje.
// Vráti { pads, target, enable(onCorrect), disable() }.
export function makeStands(scene, input, cfg, standY, xs) {
  const [lo, hi] = cfg.numberRange;
  const nums = [];
  while (nums.length < cfg.standCount) {
    const n = Phaser.Math.Between(lo, hi);
    if (!nums.includes(n)) nums.push(n);
  }
  const target = Phaser.Math.Between(0, nums.length - 1);

  const pads = nums.map((n, i) => {
    const x = xs[i];
    const box = scene.add.rectangle(0, 0, 280, 110, 0x9aa5ab).setStrokeStyle(8, 0xffffff);
    const stripe = scene.add.rectangle(0, 42, 240, 10, 0xffd54f);
    const txt = scene.add.text(0, -6, String(n), { fontSize: '72px', fontStyle: 'bold', color: '#ffffff', stroke: '#2c3e50', strokeThickness: 8 }).setOrigin(0.5);
    const root = scene.add.container(x, standY, [box, stripe, txt]).setDepth(5).setAlpha(0);
    return { n, x, y: standY, root, zone: input.hitZone(x, standY, 300, 130) };
  });

  let active = false, onCorrect = null, idle = null, hintTween = null;

  const say = () => {
    audio.play(cfg.standVoice);
    scene.time.delayedCall(cfg.numberDelaySec * 1000, () => { if (active) audio.play('num_' + nums[target]); });
  };
  const rearm = () => {
    if (idle) idle.remove();
    idle = scene.time.delayedCall(cfg.idleHintSec * 1000, () => { if (active) { hint(); say(); rearm(); } });
  };
  const hint = () => {
    if (hintTween) hintTween.stop();
    const r = pads[target].root;
    r.setScale(1);
    hintTween = scene.tweens.add({ targets: r, scale: 1.12, duration: 300, yoyo: true, repeat: 3 });
  };

  input.on('tap', (pt) => {
    if (!active) return;
    const i = pads.findIndex((p) => p.zone.contains(pt.x, pt.y));
    if (i < 0) return;
    if (i === target) { active = false; if (idle) idle.remove(); onCorrect(pads[i]); return; }
    const r = pads[i].root;
    scene.tweens.add({ targets: r, x: r.x + 10, duration: 50, yoyo: true, repeat: 3, onComplete: () => r.setX(pads[i].x) });
    rearm();
  });

  return {
    pads, target,
    enable(cb) {
      onCorrect = cb; active = true;
      scene.tweens.add({ targets: pads.map((p) => p.root), alpha: 1, duration: 500 });
      say(); rearm();
    },
    disable() { active = false; if (idle) idle.remove(); },
  };
}
