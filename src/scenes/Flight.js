import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as audio from '../systems/audio.js';
import * as routes from '../systems/routes.js';
import * as economy from '../systems/economy.js';
import { addHome } from '../ui/home.js';
import * as fx from '../ui/fx.js';
import { createCruise } from './flight/cruise.js';
import { createSpawner } from './flight/spawner.js';
import { createWeather } from './flight/weather.js';
import { createWind } from './flight/wind.js';
import { createFaces } from './flight/faces.js';
import { startTime, createSky, wingLight } from '../ui/daytime.js';
import { makePlane, makeCloud, makeStormCloud, makeBird, makeStar, makeHud } from './flight/shapes.js';

const MAKERS = { cloud: makeCloud, stormCloud: makeStormCloud, bird: makeBird, star: makeStar };
const PLANE_HIT = { w: 160, h: 50 };   // menší než sprite = zhovievavé

// Let zboku: lietadlo plynulo sleduje prst (aj doprava/doľava, kúsok vľavo od prsta), vyhýba sa
// prekážkam, zbiera hviezdičky. Náraz = zatrasenie + zvuk (žiadna škoda). Čísla sú v airport.flight.
// Po durationSec sa lietadlo plynulo vráti na začiatok pristátia (hviezdičky sa ešte zbierajú) → Touchdown.
export default class Flight extends Phaser.Scene {
  constructor() { super('Flight'); }

  create(args) {
    this.args = args || {};
    this.flight = routes.flight(this.args.from, this.args.to, economy.engineValue(economy.activePlane()));
    this.cameras.main.setBackgroundColor('#87ceeb');
    const cfg = this.cfg = data.flightCfg();
    this.speed = this.flight.speed || cfg.speed;       // rýchlosť trasy (px/s), inak predvolená z airport.flight
    this.home = new Phaser.Geom.Rectangle(cfg.homeZone.x - cfg.homeZone.w / 2, cfg.homeZone.y - cfg.homeZone.h / 2,
      cfg.homeZone.w, cfg.homeZone.h);

    this.plane = makePlane(this, cfg.returnX, cfg.returnY);
    this.targetX = this.plane.x;
    this.targetY = this.plane.y;
    this.steering = false;
    this.returning = false;
    this.items = [];
    this.stars = 0;
    this.elapsed = 0;
    this.invuln = 0;
    this.ended = false;
    this.spawner = createSpawner(this.flight, { minY: cfg.minY, maxY: cfg.maxY });
    this.hud = makeHud(this);
    this.faces = createFaces(this, this.args.passengers, this.flight.faces);
    this.far = fx.farClouds(this);
    this.trail = fx.trail(this);
    this.weather = createWeather(this, this.flight, this.spawner, this.far);
    this.wind = createWind(this, this.flight, this.spawner, this.speed, { minY: cfg.minY, maxY: cfg.maxY });
    const time = this.flight.time || 'day', tc = fx.fxCfg().time || {}, storm = fx.fxCfg().storm;
    this.blend = [tc.blendFrom ?? 0.3, tc.blendTo ?? 0.8];
    this.sky = createSky(this, { t0: startTime(time), t1: time, k: 0, far: this.far, noStars: !!this.flight.weather,
      storm: this.flight.weather && storm ? { alpha: storm.veilAlpha, farTint: storm.farTint } : null });
    wingLight(this, this.plane, time);
    this.events.once('shutdown', () => { this.far.destroy(); this.trail.destroy(); });

    const input = createInput(this);
    const steer = (p) => {
      if (!this.steering) return;
      this.targetX = Phaser.Math.Clamp(p.x + cfg.fingerOffsetX, cfg.minX, cfg.maxX);
      this.targetY = Phaser.Math.Clamp(p.y, cfg.minY, cfg.maxY);
    };
    input.on('dragStart', (p) => { this.steering = !this.home.contains(p.x, p.y); steer(p); });   // ťah z ikony domov neriadi
    input.on('drag', steer);
    input.on('dragEnd', () => { this.steering = false; });
    addHome(this, input);

    audio.init(data.get('voice'));
    audio.preload(['sfx_bump', 'sfx_star', 'sfx_cruise', 'sfx_rain', 'sfx_wind']);
    this.cruise = createCruise(this);
    const dest = data.destination(this.args.to);
    if (dest) audio.play(dest.voice);
  }

  update(time, delta) {
    if (this.ended) return;
    const dt = delta / 1000, cfg = this.cfg;
    const prevY = this.plane.y;
    this.elapsed += dt;
    this.hud.setProgress(this.elapsed / this.flight.durationSec);
    this.invuln = Math.max(0, this.invuln - delta);
    if (this.elapsed >= this.flight.durationSec && !this.returning) this.startReturn();
    if (this.returning) this.stepReturn(delta); else this.stepFollow(delta);
    this.tilt(this.plane.y - prevY, dt, delta);
    this.cruise.update(this.plane.x, delta);
    this.far.update(dt, this.speed);
    this.trail.update(dt, this.plane.x, this.plane.y);
    this.weather.update(dt, this.elapsed);
    this.sky.setK(Phaser.Math.Clamp((this.elapsed / this.flight.durationSec - this.blend[0]) / (this.blend[1] - this.blend[0]), 0, 1), this.weather.t);
    this.sky.update(dt);
    this.wind.update(dt, this.elapsed);
    this.faces.update(dt);

    if (!this.returning) {
      this.spawner.tick(dt).forEach((s) => {
        const o = MAKERS[s.kind] && MAKERS[s.kind](this);
        if (!o) return;
        o.kind = s.kind;
        o.setPosition(1400 + (s.dx || 0), s.y);
        this.items.push(o);
      });
    }

    this.items = this.items.filter((o) => {
      o.x -= this.speed * dt;
      if (o.x < -200) { o.destroy(); return false; }
      if (!this.overlaps(o, o.kind === 'star' ? { w: 200, h: 70 } : PLANE_HIT)) return true;
      if (o.kind === 'star') { this.collect(o); return false; }
      if (this.invuln <= 0 && !this.returning) this.bump(o);
      return true;
    });
  }

  stepFollow(delta) {
    const cfg = this.cfg;
    this.plane.x += (this.targetX - this.plane.x) * (1 - Math.exp(-delta / cfg.followXMs));
    const ty = Phaser.Math.Clamp(this.targetY + this.wind.offset, cfg.minY, cfg.maxY);   // vietor posúva len cieľ, nie prst
    this.plane.y += (ty - this.plane.y) * (1 - Math.exp(-delta / cfg.followMs));
  }

  startReturn() {
    this.returning = true;
    this.returnT = 0;
    this.from = { x: this.plane.x, y: this.plane.y };
  }

  // Plynulý návrat na začiatok pristátia (smoothstep), po ňom Touchdown bez skoku lietadla.
  stepReturn(delta) {
    const cfg = this.cfg;
    this.returnT = Math.min(1, this.returnT + delta / cfg.returnMs);
    const e = this.returnT * this.returnT * (3 - 2 * this.returnT);
    this.plane.x = this.from.x + (cfg.returnX - this.from.x) * e;
    this.plane.y = this.from.y + (cfg.returnY - this.from.y) * e;
    if (this.returnT >= 1) this.finish();
  }

  // Nos hore pri stúpaní, dole pri klesaní (max tiltMaxDeg, plynulo).
  tilt(dy, dt, delta) {
    const cfg = this.cfg;
    const want = Phaser.Math.Clamp(dy / dt / cfg.tiltVy, -1, 1) * cfg.tiltMaxDeg;
    this.plane.angle += (want - this.plane.angle) * (1 - Math.exp(-delta / cfg.tiltSmoothMs));
  }

  overlaps(o, box) {
    return Math.abs(o.x - this.plane.x) < (o.hit.w + box.w) / 2
        && Math.abs(o.y - this.plane.y) < (o.hit.h + box.h) / 2;
  }

  collect(o) {
    this.stars += 1;                       // hviezdičky sa nikdy neodpočítavajú
    this.hud.setStars(this.stars);
    audio.play('sfx_star');
    fx.sparks(this, o.x, o.y);
    fx.counterBounce(this, this.hud.counter);
    this.tweens.add({ targets: o, scale: 1.8, alpha: 0, y: o.y - 40, duration: 250, onComplete: () => o.destroy() });
  }

  bump(o) {
    if (o.kind === 'cloud' || o.kind === 'stormCloud') fx.puff(this, o);
    this.spawner.hit();
    this.faces.sad();
    this.invuln = this.cfg.invulnMs;
    audio.play('sfx_bump');
    this.cameras.main.shake(250, 0.012);
    this.tweens.add({ targets: this.plane, alpha: 0.3, duration: 100, yoyo: true, repeat: 5, onComplete: () => this.plane.setAlpha(1) });
  }

  finish() {
    this.ended = true;
    this.cruise.stop();
    this.weather.stop();
    this.wind.stop();
    this.plane.angle = 0;
    const { to, passengers, smiles } = this.args;
    const flightSmiles = this.faces.smiling();   // usmiate tváre = smajlíky do prepitného
    fx.go(this, 'Touchdown', { ...this.args, to, passengers, smiles: (smiles || 0) + flightSmiles, flightSmiles, stars: this.stars }, { fade: false });
  }
}
