import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as audio from '../systems/audio.js';
import { addHome } from '../ui/home.js';
import * as fx from '../ui/fx.js';
import { createSpawner } from './flight/spawner.js';
import { makePlane, makeCloud, makeBird, makeStar, makeHud } from './flight/shapes.js';

const MAKERS = { cloud: makeCloud, bird: makeBird, star: makeStar };
const PLANE_HIT = { w: 160, h: 50 };   // menší než sprite = zhovievavé

// Let zboku: lietadlo plynulo sleduje prst (aj doprava/doľava, kúsok vľavo od prsta), vyhýba sa
// prekážkam, zbiera hviezdičky. Náraz = zatrasenie + zvuk (žiadna škoda). Čísla sú v airport.flight.
// Po durationSec sa lietadlo plynulo vráti na začiatok pristátia (hviezdičky sa ešte zbierajú) → Touchdown.
export default class Flight extends Phaser.Scene {
  constructor() { super('Flight'); }

  create(args) {
    this.args = args || {};
    const flights = data.get('flights');
    this.flight = data.flight(this.args.to) || flights[0];
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
    this.far = fx.farClouds(this);
    this.trail = fx.trail(this);
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
    audio.preload(['sfx_bump']);
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
    this.far.update(dt, this.speed);
    this.trail.update(dt, this.plane.x, this.plane.y);

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
    this.plane.y += (this.targetY - this.plane.y) * (1 - Math.exp(-delta / cfg.followMs));
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
    fx.sparks(this, o.x, o.y);
    fx.counterBounce(this, this.hud.counter);
    this.tweens.add({ targets: o, scale: 1.8, alpha: 0, y: o.y - 40, duration: 250, onComplete: () => o.destroy() });
  }

  bump(o) {
    if (o.kind === 'cloud') fx.puff(this, o);
    this.spawner.hit();
    this.invuln = this.cfg.invulnMs;
    audio.play('sfx_bump');
    this.cameras.main.shake(250, 0.012);
    this.tweens.add({ targets: this.plane, alpha: 0.3, duration: 100, yoyo: true, repeat: 5, onComplete: () => this.plane.setAlpha(1) });
  }

  finish() {
    this.ended = true;
    this.plane.angle = 0;
    const { to, passengers, smiles } = this.args;
    fx.go(this, 'Touchdown', { ...this.args, to, passengers, smiles, stars: this.stars }, { fade: false });
  }
}
