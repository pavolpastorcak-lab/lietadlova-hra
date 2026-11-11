import * as audio from '../../systems/audio.js';
import { fxCfg } from '../../ui/fx.js';

// Vietor počas letu (trasy s flight.wind). Poryv posúva len CIEĽOVÚ výšku lietadla o offset (px), prst
// (scene.targetY) sa nemení, takže po poryve sa lietadlo samo vráti. Poryvy sú naplánované vopred
// (smer náhodne hore/dole): varovanie warnSec vopred = svetlé čiary v smere vetra + sfx_wind (jednorazový),
// potom nábeh rampSec, držanie, dobeh rampSec (spolu durationSec). Žiadny poryv, ktorý by sa nestihol
// pred záverečným návratom. Prekážky: spawner dostane pás, kde počas poryvu nevznikajú (viď band()).
// Čísla: flights.wind (every, durationSec, push) + sprites.fx.wind.
const NONE = { offset: 0, update() {}, stop() {} };
const smooth = (x) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };
const SPAWN_X = 1400;      // rovnaké ako x vzniku objektov vo Flight.js
const END_MARGIN = 2;      // s pred koncom letu, kedy už nový poryv nezačne

export function createWind(scene, flight, spawner, speed, bounds) {
  const w = flight.wind, c = fxCfg().wind;
  if (!w || !c) return NONE;
  const W = scene.scale.width, H = scene.scale.height;
  const g = scene.add.graphics().setDepth(c.depth);
  const streaks = Array.from({ length: c.lines }, () => ({
    x: Math.random() * W, y: Math.random() * H, len: c.len[0] + Math.random() * (c.len[1] - c.len[0]),
  }));
  let done = false, gust = null, drawn = false;

  // Ďalší poryv: začína o `every` s po konci predošlého (prvý o `every` od štartu), ak sa ešte stihne.
  const plan = (after) => {
    const start = after + w.every, end = start + w.durationSec;
    gust = end <= flight.durationSec - END_MARGIN
      ? { start, end, dir: Math.random() < 0.5 ? -1 : 1, warned: false } : null;
  };
  plan(0);

  // Pás výšok, kde nemá vzniknúť prekážka, aby poryv sám nevyvolal náraz (null = bez obmedzenia).
  const band = (elapsed) => {
    if (!gust) return null;
    const lead = (SPAWN_X - scene.plane.x) / speed + c.gustLeadSec;
    if (elapsed < gust.start - lead || elapsed > gust.end) return null;
    const a = Math.min(scene.plane.y, scene.targetY), b = Math.max(scene.plane.y, scene.targetY);
    const lo = gust.dir < 0 ? a - w.push - c.margin : a - c.margin;
    const hi = gust.dir < 0 ? b + c.margin : b + w.push + c.margin;
    return { lo: Math.max(bounds.minY, lo), hi: Math.min(bounds.maxY, hi) };
  };

  function draw(dt, alpha, dir) {
    g.clear().lineStyle(c.w, Number(c.color), c.alpha * alpha);
    streaks.forEach((s) => {
      s.y += dir * c.speed * dt;
      if (dir < 0 && s.y < -s.len) { s.y = H + s.len; s.x = Math.random() * W; }
      if (dir > 0 && s.y > H + s.len) { s.y = -s.len; s.x = Math.random() * W; }
      g.lineBetween(s.x, s.y, s.x, s.y - dir * s.len);
    });
    drawn = true;
  }

  const self = {
    offset: 0,
    update(dt, elapsed) {
      if (done) return;
      spawner.setBlock(() => band(elapsed));
      this.offset = 0;
      if (!gust) return;
      const k = elapsed - gust.start;                       // < 0 = varovanie
      if (k >= -c.warnSec && !gust.warned) { gust.warned = true; audio.play('sfx_wind'); }
      if (k >= -c.warnSec && elapsed < gust.end + c.rampSec) {
        const fadeIn = smooth((k + c.warnSec) / c.warnSec), fadeOut = smooth((gust.end + c.rampSec - elapsed) / c.rampSec);
        draw(dt, Math.min(fadeIn, fadeOut), gust.dir);
      } else if (drawn) { g.clear(); drawn = false; }
      if (k >= 0) {
        const env = Math.min(smooth(k / c.rampSec), smooth((gust.end - elapsed) / c.rampSec));
        this.offset = gust.dir * w.push * env;
      }
      if (elapsed >= gust.end + c.rampSec) plan(gust.end);
    },
    stop() {
      if (done) return;
      done = true;
      this.offset = 0;
      spawner.setBlock(null);
      g.destroy();
    },
  };
  scene.events.once('shutdown', () => self.stop());
  return self;
}
