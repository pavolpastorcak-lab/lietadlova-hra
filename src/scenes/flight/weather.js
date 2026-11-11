import * as audio from '../../systems/audio.js';
import * as data from '../../systems/data.js';
import { fxCfg } from '../../ui/fx.js';

// Búrka počas letu (trasy s flight.weather): po stormFrom sa počas rampSec plynulo zatiahne (závoj pod HUD,
// stmavnú vzdialené mraky), pribudne jemný dážď (jeden Graphics, max rain.max kvapiek) a zvuk dažďa.
// Mraky a vtáky riadi spawner.setStorm(). Žiadne blesky. Čísla: flights.weather + sprites.fx.storm.
const NONE = { t: 0, drops: 0, update() {}, stop() {} };

export function createWeather(scene, flight, spawner, far) {
  const w = flight.weather, c = fxCfg().storm;
  if (!w || !c) return NONE;
  const r = c.rain, W = scene.scale.width, H = scene.scale.height;
  const veil = scene.add.rectangle(W / 2, H / 2, W, H, Number(c.veilColor), 0).setDepth(r.depth - 1);
  const g = scene.add.graphics().setDepth(r.depth);
  const drops = Array.from({ length: r.max }, () => ({ x: Math.random() * (W + 200), y: Math.random() * H }));
  const speed = Math.hypot(r.vx, r.vy), dx = r.vx / speed * r.len, dy = r.vy / speed * r.len;   // šikmo dole a doľava
  const rainVol = ((data.get('voice') || {}).sfx_rain || {}).volume ?? 0.5;
  let rain = null, done = false;
  const self = {
    t: 0, drops: 0,
    update(dt, elapsed) {
      if (done) return;
      const t = this.t = Phaser.Math.Clamp((elapsed / flight.durationSec - w.stormFrom) * flight.durationSec / c.rampSec, 0, 1);
      spawner.setStorm(w, t);
      veil.setFillStyle(Number(c.veilColor), c.veilAlpha * t);
      far.tint(t, Number(c.farTint));
      if (t <= 0) return;
      if (w.rain && !rain) rain = audio.loop('sfx_rain');
      if (rain) rain.setVolume(rainVol * t);
      const n = this.drops = w.rain ? Math.ceil(r.max * t) : 0;
      g.clear().lineStyle(r.w, Number(r.color), r.alpha);
      for (let i = 0; i < n; i++) {
        const d = drops[i];
        d.x += r.vx * dt; d.y += r.vy * dt;
        if (d.y > H + r.len || d.x < -r.len) { d.x = Math.random() * (W + 200); d.y = -r.len; }
        g.lineBetween(d.x, d.y, d.x + dx, d.y + dy);
      }
    },
    stop() {
      if (done) return;
      done = true;
      if (rain) rain.stop();
      veil.destroy(); g.destroy();
    },
  };
  scene.events.once('shutdown', () => self.stop());
  return self;
}
