import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as audio from '../systems/audio.js';
import { addHome } from '../ui/home.js';
import { addPlane } from '../systems/sprites.js';
import { makeLever } from './takeoff/lever.js';
import { makeStands } from './touchdown/stands.js';
import { addScenery } from './touchdown/scenery.js';

const RUNWAY_Y = 540;                         // horný okraj dráhy
const STAND_Y = 735;                          // stred stojísk pod dráhou
const START_X = 300, START_Y = 400;           // lietadlo prichádza z letu (Flight)
const ROLL_X = 200;                           // kde lietadlo zastane na dráhe
const MARK_GAP = 220, MARK_SPEED = 1100;
const STAND_XS = [420, 720, 1020];

// Pristátie: zostup → brzdenie páky (ťahom nadol) → nájdi stojisko → dostavenie → Landing.
// Čísla sú v data/airport.json (landing). Nič sa nedá pokaziť.
export default class Touchdown extends Phaser.Scene {
  constructor() { super('Touchdown'); }

  create(args) {
    this.args = args || {};
    this.cfg = data.get('airport').landing;
    this.speed = 1;
    this.brake = 1;               // poloha páky 1 (hore) → 0 (dole)
    this.state = 'descend';
    this.cameras.main.setBackgroundColor('#87ceeb');

    this.world = this.add.container(0, 520).setDepth(1);
    this.world.add([
      this.add.rectangle(640, 760, 1280, 560, 0x6aa84f),
      this.add.rectangle(640, RUNWAY_Y + 50, 1280, 100, 0x5f6b73),
    ]);
    const dest = data.destination(this.args.to);
    this.scenery = addScenery(this, this.world, dest, 480, RUNWAY_Y, this.cfg.lights, MARK_GAP, 8);
    this.marks = [];
    for (let i = 0; i < 8; i++) {
      const m = this.add.rectangle(i * MARK_GAP, RUNWAY_Y + 50, 110, 14, 0xffffff);
      this.marks.push(m);
      this.world.add(m);
    }

    const side = addPlane(this, 'side', 0, 0, 260)
      || this.add.rectangle(0, 0, 260, 90, 0xffffff).setStrokeStyle(6, 0x2e7d32);
    const air = addPlane(this, 'air', 0, 0, 230);
    if (air) side.setAlpha(0);
    this.sideImg = side; this.airImg = air;
    this.groundY = RUNWAY_Y + 10 - side.displayHeight / 2;
    this.plane = this.add.container(START_X, START_Y).setDepth(20);
    this.plane.add(air ? [air, side] : [side]);

    const input = createInput(this);
    addHome(this, input);
    this.lever = makeLever(this, input, 1160, 230, 620, (v) => { this.brake = v; }, { start: 1, goal: 'bottom' });
    this.lever.root.setAlpha(0);
    this.stands = makeStands(this, input, this.cfg, STAND_Y, STAND_XS);

    audio.init(data.get('voice'));
    audio.preload([this.cfg.brakeVoice, this.cfg.standVoice, 'sfx_engine', 'sfx_touchdown',
      ...this.stands.pads.map((p) => 'num_' + p.n)]);
    this.engine = audio.loop('sfx_engine');
    this.events.once('shutdown', () => this.engine.stop());
    this.descend();
  }

  descend() {
    const ms = this.cfg.descendSec * 1000;
    this.tweens.add({ targets: this.world, y: 0, duration: ms, ease: 'Quad.easeOut' });
    this.tweens.add({ targets: this.plane, x: ROLL_X + 100, y: this.groundY, duration: ms, ease: 'Quad.easeOut' });
    this.tweens.add({ targets: this.plane, angle: -8, duration: ms * 0.6, yoyo: true, ease: 'Sine.inOut' });
    if (this.airImg) {
      this.tweens.add({ targets: this.airImg, alpha: 0, duration: 400, delay: ms - 500 });
      this.tweens.add({ targets: this.sideImg, alpha: 1, duration: 400, delay: ms - 500 });
    }
    this.time.delayedCall(ms, () => {
      this.state = 'brake';
      audio.play('sfx_touchdown');
      this.cameras.main.shake(180, 0.006);
      this.tweens.add({ targets: this.lever.root, alpha: 1, duration: 500 });
      this.time.delayedCall(700, () => audio.play(this.cfg.brakeVoice));
    });
  }

  update(time, delta) {
    const dt = delta / 1000;
    if (this.state === 'descend' || this.state === 'brake') {
      // Rýchlosť dobieha polohu páky (nikdy skokom, žiadny trest).
      const target = this.state === 'descend' ? 1 : this.brake;
      this.speed += (target - this.speed) * (1 - Math.exp(-dt / this.cfg.brakeTauSec));
      this.engine.setRate(0.7 + this.speed * 0.9);
      [...this.marks, ...this.scenery.lights].forEach((m) => {
        m.x -= this.speed * MARK_SPEED * dt;
        if (m.x < -80) m.x += 8 * MARK_GAP;
      });
    }
    if (this.state !== 'brake') return;
    this.plane.x = ROLL_X + 100 * this.speed;
    this.plane.y = this.groundY + Math.sin(time / 40) * this.speed * 1.2;
    if (this.brake <= 0.02 && this.speed <= this.cfg.stopSpeed) this.stopped();
  }

  stopped() {
    this.state = 'stand';
    this.lever.lock();
    this.engine.stop();
    this.scenery.setLit(true);
    this.plane.setPosition(ROLL_X, this.groundY);
    this.tweens.add({ targets: this.lever.root, alpha: 0, duration: 500 });
    this.stands.enable((pad) => this.taxi(pad));
  }

  // Dostavenie: po dráhe k stojisku, potom zasunutie na stojisko (menšie = ďalej).
  taxi(pad) {
    this.state = 'taxi';
    const ms = this.cfg.taxiSec * 1000;
    this.tweens.add({
      targets: this.plane, x: pad.x, duration: ms * 0.55, ease: 'Sine.inOut',
      onComplete: () => {
        this.tweens.add({ targets: this.plane, y: pad.y - 100, scale: 0.8, duration: ms * 0.45, ease: 'Sine.inOut',
          onComplete: () => {
            this.tweens.add({ targets: pad.root, scale: 1.15, duration: 250, yoyo: true });
            this.time.delayedCall(900, () => this.scene.start('Landing', this.args));
          } });
      },
    });
  }
}
