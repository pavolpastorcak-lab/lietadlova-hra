import { createInput } from '../systems/input.js';
import { addHome } from '../ui/home.js';
import { addNext } from '../ui/next.js';

const MIN_Y = 140, MAX_Y = 700;
const FOLLOW_MS = 120;   // čím menšie, tým rýchlejšie lietadlo dobieha prst

// Let zboku: obdĺžnik-lietadlo plynulo sleduje výšku prsta (celá obrazovka je zóna).
export default class Flight extends Phaser.Scene {
  constructor() { super('Flight'); }

  create(args) {
    this.args = args;
    this.cameras.main.setBackgroundColor('#87ceeb');
    this.plane = this.add.rectangle(300, 400, 200, 70, 0xffffff).setStrokeStyle(6, 0x2e7d32);
    this.targetY = this.plane.y;

    const input = createInput(this);
    const steer = (p) => { this.targetY = Phaser.Math.Clamp(p.y, MIN_Y, MAX_Y); };
    input.on('dragStart', steer);
    input.on('drag', steer);
    addHome(this, input);
    addNext(this, input, () => this.scene.start('Landing', this.args));
  }

  update(time, delta) {
    const k = 1 - Math.exp(-delta / FOLLOW_MS);
    this.plane.y += (this.targetY - this.plane.y) * k;
  }
}
