// Častice 3i: lietajúce mince a konfety. Čísla z sprites.json → fx, objekty sa po dohraní ničia.
import { makeCoin } from './coins.js';
import { fxCfg } from './fx.js';

// Mince letia po oblúku z (x, y) do cieľa { x, y } po jednej (max cfg.max viditeľných).
// onCoin(i, n) sa zavolá pri dopade každej, onDone() po poslednej. Súčet dopadov rieši volajúci.
export function coinFly(scene, x, y, target, amount, onCoin, onDone, cfg = fxCfg().coinFly) {
  const n = cfg ? Math.max(1, Math.min(cfg.max, amount)) : 0;
  if (!n) { onDone(); return 0; }
  let arrived = 0;
  for (let i = 0; i < n; i++) {
    const c = makeCoin(scene, x, y, cfg.size / 2.2).setDepth(150).setVisible(false);
    const p = { t: 0 };
    scene.tweens.add({ targets: p, t: 1, duration: cfg.ms, delay: i * cfg.gapMs, ease: 'Sine.inOut',
      onStart: () => c.setVisible(true),
      onUpdate: () => {
        c.x = x + (target.x - x) * p.t;
        c.y = y + (target.y - y) * p.t - Math.sin(Math.PI * p.t) * cfg.arc;
        c.setScale(1 + (cfg.endScale - 1) * p.t);
      },
      onComplete: () => {
        c.destroy();
        onCoin(i, n);
        if (++arrived === n) onDone();
      } });
  }
  return n;
}

// Konfety: cfg.count farebných obdĺžnikov z bodu (x, y), padajú a miznú.
export function confetti(scene, x, y, cfg = fxCfg().confetti) {
  if (!cfg) return;
  for (let i = 0; i < cfg.count; i++) {
    const col = Number(cfg.colors[i % cfg.colors.length]);
    const r = scene.add.rectangle(x, y, cfg.w, cfg.h, col).setDepth(160).setAngle(Phaser.Math.Between(0, 180));
    const tx = x + Phaser.Math.Between(-cfg.spread, cfg.spread);
    scene.tweens.add({ targets: r, x: tx, y: y - Phaser.Math.Between(cfg.rise / 2, cfg.rise), duration: cfg.ms * 0.35,
      ease: 'Quad.out', onComplete: () => scene.tweens.add({ targets: r, y: y + cfg.fall, x: tx + Phaser.Math.Between(-40, 40),
        angle: r.angle + Phaser.Math.Between(-360, 360), alpha: 0, duration: cfg.ms * 0.65, ease: 'Quad.in',
        onComplete: () => r.destroy() }) });
  }
}
