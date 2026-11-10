// Spoločné efekty (kód, bez nových obrázkov). Každá funkcia berie scénu a čísla z sprites.json → fx
// a po sebe upratuje (destroy). Max ~60 objektov naraz: mraky 8, stopa ≤ maxLive, iskry 6 na zber.
import * as data from '../systems/data.js';
import { addSprite, role } from '../systems/sprites.js';

export const fxCfg = () => (data.get('sprites') || {}).fx || {};

function cloudShape(scene, w) {
  const spr = addSprite(scene, Phaser.Utils.Array.GetRandom(role('cloud') || []), 0, 0, { w });
  if (spr) return spr;
  const k = w / 200;
  return scene.add.container(0, 0, [scene.add.circle(-40 * k, 8 * k, 34 * k, 0xffffff),
    scene.add.circle(0, -8 * k, 44 * k, 0xffffff), scene.add.circle(42 * k, 8 * k, 32 * k, 0xffffff)]);
}

// Vzdialené mraky za hernou vrstvou: pomalšie než prekážky, priehľadné, bez nárazu.
// Vráti { update(dt, speed), destroy() }; speed = rýchlosť hernej vrstvy (px/s).
export function farClouds(scene, cfg = fxCfg().farClouds) {
  if (!cfg) return { update() {}, destroy() {} };
  const all = [];
  cfg.layers.forEach((L) => {
    for (let i = 0; i < L.count; i++) {
      const c = cloudShape(scene, L.width).setAlpha(L.alpha).setDepth(L.depth);
      c.setPosition(cfg.startX + (cfg.spanX / L.count) * i, Phaser.Math.Between(L.minY, L.maxY));
      c.layer = L;
      all.push(c);
    }
  });
  return {
    update(dt, speed) {
      all.forEach((c) => {
        c.x -= speed * c.layer.speed * dt;
        if (c.x < cfg.startX - 200) { c.x += cfg.spanX + 200; c.y = Phaser.Math.Between(c.layer.minY, c.layer.maxY); }
      });
    },
    destroy() { all.forEach((c) => c.destroy()); all.length = 0; },
  };
}

// Stopa za lietadlom: miznúce biele krúžky. Vráti { update(dt, x, y), destroy() }.
export function trail(scene, cfg = fxCfg().trail) {
  if (!cfg) return { update() {}, destroy() {} };
  const live = new Set();
  let acc = 0;
  return {
    update(dt, x, y) {
      acc += dt * 1000;
      if (acc < cfg.everyMs) return;
      acc = 0;
      if (live.size >= cfg.maxLive) return;
      const c = scene.add.circle(x + cfg.offsetX, y, cfg.radius, 0xffffff, cfg.alpha).setDepth(15);
      live.add(c);
      scene.tweens.add({ targets: c, alpha: 0, scale: cfg.growTo, x: c.x + cfg.driftX, duration: cfg.lifeMs,
        onComplete: () => { live.delete(c); c.destroy(); } });
    },
    destroy() { live.forEach((c) => c.destroy()); live.clear(); },
  };
}

// Iskry do strán pri zbere hviezdičky.
export function sparks(scene, x, y, cfg = fxCfg().sparks) {
  if (!cfg) return;
  for (let i = 0; i < cfg.count; i++) {
    const a = (Math.PI * 2 * i) / cfg.count;
    const s = scene.add.circle(x, y, cfg.size, Number(cfg.color)).setDepth(30);
    scene.tweens.add({ targets: s, x: x + Math.cos(a) * cfg.dist, y: y + Math.sin(a) * cfg.dist, alpha: 0, scale: 0.3,
      duration: cfg.ms, onComplete: () => s.destroy() });
  }
}

// Počítadlo poskočí (target = text/objekt s mierkou).
export function counterBounce(scene, target, cfg = fxCfg().counter) {
  if (!cfg || !target) return;
  scene.tweens.killTweensOf(target);
  target.setScale(1);
  scene.tweens.add({ targets: target, scale: cfg.scale, duration: cfg.ms, yoyo: true });
}

// Mrak sa po náraze „rozfúkne": zväčší sa a zbledne (bez zmeny nárazovej plochy).
export function puff(scene, obj, cfg = fxCfg().puff) {
  if (!cfg || !obj || !obj.scene) return;
  scene.tweens.add({ targets: obj, scale: cfg.scale, alpha: cfg.alpha, duration: cfg.ms });
}
