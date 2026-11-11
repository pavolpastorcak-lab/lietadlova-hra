import * as audio from '../../systems/audio.js';
import * as data from '../../systems/data.js';
import { fxCfg } from '../../ui/fx.js';
import { addSprite, role } from '../../systems/sprites.js';

// Dážď pri pristátí (destinations.json → weather: "rain"): tmavší závoj, sivé mraky v pozadí, kvapky
// (jeden Graphics) a slučka sfx_rain. Vzhľad kvapiek zdieľa fx.storm.rain, čísla pristátia: airport.json → landing.rain.
// `sun` = nič sa nevytvorí. Všetko sa uprace pri odchode zo scény (shutdown).
export function createLandingRain(scene, dest) {
  const cfg = (data.get('airport').landing || {}).rain, storm = fxCfg().storm;
  if (!dest || dest.weather !== 'rain' || !cfg || !storm) return null;
  const r = storm.rain, W = scene.scale.width, H = scene.scale.height;
  const objs = [];
  objs.push(scene.add.rectangle(W / 2, H / 2, W, H, Number(cfg.veilColor), cfg.veilAlpha).setDepth(cfg.veilDepth));
  const cloudKey = role('stormCloud') || (role('cloud') || [])[0];
  for (const c of cfg.clouds) {
    const spr = addSprite(scene, cloudKey, c.x, c.y, { w: c.w });
    const o = spr || scene.add.ellipse(c.x, c.y, c.w, c.w * 0.4, Number(storm.farTint), 0.9);
    o.setDepth(cfg.cloudDepth).setTint?.(Number(storm.farTint));
    objs.push(o);
  }
  const g = scene.add.graphics().setDepth(r.depth);
  objs.push(g);
  const drops = Array.from({ length: cfg.max }, () => ({ x: Math.random() * (W + 200), y: Math.random() * H }));
  const speed = Math.hypot(r.vx, r.vy), dx = r.vx / speed * r.len, dy = r.vy / speed * r.len;
  const rainVol = ((data.get('voice') || {}).sfx_rain || {}).volume ?? 0.5;
  audio.preload(['sfx_rain']);
  let loop = audio.loop('sfx_rain'), done = false;
  if (loop) loop.setVolume(rainVol);
  const self = {
    drops: cfg.max,
    update(dt) {
      if (done) return;
      g.clear().lineStyle(r.w, Number(r.color), r.alpha);
      for (const d of drops) {
        d.x += r.vx * dt; d.y += r.vy * dt;
        if (d.y > H + r.len || d.x < -r.len) { d.x = Math.random() * (W + 200); d.y = -r.len; }
        g.lineBetween(d.x, d.y, d.x + dx, d.y + dy);
      }
    },
    stop() {
      if (done) return;
      done = true;
      if (loop) loop.stop();
      objs.forEach((o) => o.destroy());
    },
  };
  scene.events.once('shutdown', () => self.stop());
  return self;
}
