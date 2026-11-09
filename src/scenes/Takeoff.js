import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as audio from '../systems/audio.js';
import { addHome } from '../ui/home.js';
import { addPlane } from '../systems/sprites.js';
import { makeLever } from './takeoff/lever.js';

const RUNWAY_Y = 660;          // horný okraj dráhy
const START_X = 200, END_X = 300, END_Y = 400;   // END_* = štart lietadla vo Flight
const MARK_GAP = 220, MARK_SPEED = 1100;         // čiary na dráhe (px/s pri plnej rýchlosti)

// Vzlet zboku: syn ťahá páku plynu nahor, lietadlo sa rozbehne a pri plnom výkone vzlietne → Flight.
// Číselné parametre sú v data/airport.json (takeoff). Nič sa nedá pokaziť, páka ostáva kde ju pustí.
export default class Takeoff extends Phaser.Scene {
  constructor() { super('Takeoff'); }

  create(args) {
    this.args = args || {};
    this.cfg = data.get('airport').takeoff;
    this.speed = 0;
    this.throttle = 0;
    this.state = 'roll';    // roll → lift → (Flight)
    this.cameras.main.setBackgroundColor('#87ceeb');

    // Svet (zem, dráha, čiary) sa pri stúpaní posunie dole.
    this.world = this.add.container(0, 0).setDepth(1);
    this.world.add([
      this.add.rectangle(640, 760, 1280, 240, 0x6aa84f),
      this.add.rectangle(640, RUNWAY_Y + 50, 1280, 100, 0x5f6b73),
    ]);
    this.marks = [];
    for (let i = 0; i < 8; i++) {
      const m = this.add.rectangle(i * MARK_GAP, RUNWAY_Y + 50, 110, 14, 0xffffff);
      this.marks.push(m);
      this.world.add(m);
    }

    // Lietadlo: sprite so zemou a sprite vo vzduchu (prekríži sa pri odlepení).
    const side = addPlane(this, 'side', 0, 0, 260)
      || this.add.rectangle(0, 0, 260, 90, 0xffffff).setStrokeStyle(6, 0x2e7d32);
    const air = addPlane(this, 'air', 0, 0, 230);
    if (air) air.setAlpha(0);
    this.sideImg = side;
    this.airImg = air;
    this.groundY = RUNWAY_Y + 10 - side.displayHeight / 2;
    this.plane = this.add.container(START_X, this.groundY).setDepth(20);
    this.plane.add(air ? [side, air] : [side]);

    const input = createInput(this);
    addHome(this, input);
    this.lever = makeLever(this, input, 1160, 230, 620, (v) => { this.throttle = v; });

    audio.init(data.get('voice'));
    audio.preload([this.cfg.hintVoice, 'sfx_engine', 'sfx_takeoff']);
    audio.play(this.cfg.hintVoice);
    this.engine = audio.loop('sfx_engine');
    this.events.once('shutdown', () => this.engine.stop());
  }

  update(time, delta) {
    const dt = delta / 1000;
    // Rýchlosť plynulo dobieha polohu páky (0..1), nikdy neklesá rýchlo = žiadny trest.
    this.speed += (this.throttle - this.speed) * (1 - Math.exp(-dt / this.cfg.accelTauSec));
    this.engine.setRate(0.7 + this.speed * 0.9);

    this.marks.forEach((m) => {
      m.x -= this.speed * MARK_SPEED * dt;
      if (m.x < -80) m.x += this.marks.length * MARK_GAP;
    });

    if (this.state !== 'roll') return;
    this.plane.x = START_X + (END_X - START_X) * this.speed;
    this.plane.y = this.groundY + Math.sin(time / 40) * this.speed * 1.2;   // jemné drncanie
    if (this.throttle >= this.cfg.fullAt && this.speed >= this.cfg.rotateSpeed) this.liftOff();
  }

  liftOff() {
    this.state = 'lift';
    this.lever.lock();
    audio.play('sfx_takeoff');
    const climbMs = this.cfg.climbSec * 1000;
    const tw = (props) => this.tweens.add({ ...props });

    tw({ targets: this.lever.root, alpha: 0, duration: 600 });
    tw({ targets: this.plane, x: END_X, y: END_Y, duration: climbMs, ease: 'Quad.easeIn' });
    tw({ targets: this.plane, angle: -14, duration: 700, ease: 'Sine.out' });
    tw({ targets: this.plane, angle: 0, duration: climbMs - 700, delay: 700, ease: 'Sine.inOut' });
    tw({ targets: this.world, y: 520, duration: climbMs, ease: 'Quad.easeIn' });
    if (this.airImg) {
      tw({ targets: this.sideImg, alpha: 0, duration: 500, delay: 300 });
      tw({ targets: this.airImg, alpha: 1, duration: 500, delay: 300 });
    }
    this.time.delayedCall(climbMs + 100, () => this.scene.start('Flight', this.args));
  }
}
