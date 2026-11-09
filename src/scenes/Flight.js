import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as audio from '../systems/audio.js';
import { addHome } from '../ui/home.js';
import { createSpawner } from './flight/spawner.js';
import { makePlane, makeCloud, makeBird, makeStar, makeHud } from './flight/shapes.js';

const MIN_Y = 140, MAX_Y = 700;
const FOLLOW_MS = 120;     // čím menšie, tým rýchlejšie lietadlo dobieha prst
const SPEED = 420;         // rýchlosť posunu sveta (px/s)
const INVULN_MS = 1200;    // po náraze prekážky lietadlom prechádzajú
const MAKERS = { cloud: makeCloud, bird: makeBird, star: makeStar };
const PLANE_HIT = { w: 160, h: 50 };   // menší než sprite = zhovievavé

// Let zboku: lietadlo plynulo sleduje výšku prsta, vyhýba sa prekážkam, zbiera hviezdičky.
// Náraz = zatrasenie + zvuk (žiadna škoda). Po durationSec ide do Landing.
export default class Flight extends Phaser.Scene {
  constructor() { super('Flight'); }

  create(args) {
    this.args = args || {};
    const flights = data.get('flights');
    this.flight = data.flight(this.args.to) || flights[0];
    this.cameras.main.setBackgroundColor('#87ceeb');

    this.plane = makePlane(this, 300, 400);
    this.targetY = this.plane.y;
    this.items = [];
    this.stars = 0;
    this.elapsed = 0;
    this.invuln = 0;
    this.ended = false;
    this.spawner = createSpawner(this.flight);
    this.hud = makeHud(this);

    const input = createInput(this);
    const steer = (p) => { this.targetY = Phaser.Math.Clamp(p.y, MIN_Y, MAX_Y); };
    input.on('dragStart', steer);
    input.on('drag', steer);
    addHome(this, input);

    audio.init(data.get('voice'));
    audio.preload(['sfx_bump']);
    const dest = data.destination(this.args.to);
    if (dest) audio.play(dest.voice);
  }

  update(time, delta) {
    if (this.ended) return;
    const dt = delta / 1000;
    const k = 1 - Math.exp(-delta / FOLLOW_MS);
    this.plane.y += (this.targetY - this.plane.y) * k;

    this.elapsed += dt;
    this.hud.setProgress(this.elapsed / this.flight.durationSec);
    this.invuln = Math.max(0, this.invuln - delta);

    this.spawner.tick(dt).forEach((s) => {
      const o = MAKERS[s.kind] && MAKERS[s.kind](this);
      if (!o) return;
      o.kind = s.kind;
      o.setPosition(1400, s.y);
      this.items.push(o);
    });

    this.items = this.items.filter((o) => {
      o.x -= SPEED * dt;
      if (o.x < -200) { o.destroy(); return false; }
      if (!this.overlaps(o, o.kind === 'star' ? { w: 200, h: 70 } : PLANE_HIT)) return true;
      if (o.kind === 'star') { this.collect(o); return false; }
      if (this.invuln <= 0) this.bump();
      return true;
    });

    if (this.elapsed >= this.flight.durationSec) this.finish();
  }

  overlaps(o, box) {
    return Math.abs(o.x - this.plane.x) < (o.hit.w + box.w) / 2
        && Math.abs(o.y - this.plane.y) < (o.hit.h + box.h) / 2;
  }

  collect(o) {
    this.stars += 1;                       // hviezdičky sa nikdy neodpočítavajú
    this.hud.setStars(this.stars);
    this.tweens.add({ targets: o, scale: 1.8, alpha: 0, y: o.y - 40, duration: 250, onComplete: () => o.destroy() });
  }

  bump() {
    this.spawner.hit();
    this.invuln = INVULN_MS;
    audio.play('sfx_bump');
    this.cameras.main.shake(250, 0.012);
    this.tweens.add({ targets: this.plane, alpha: 0.3, duration: 100, yoyo: true, repeat: 5, onComplete: () => this.plane.setAlpha(1) });
  }

  finish() {
    this.ended = true;
    const { to, passengers, smiles } = this.args;
    this.scene.start('Landing', { ...this.args, to, passengers, smiles, stars: this.stars });
  }
}
