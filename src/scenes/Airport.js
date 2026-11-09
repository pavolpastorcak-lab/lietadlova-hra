import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import { addHome } from '../ui/home.js';
import { addNext } from '../ui/next.js';

const COLORS = [0xf0ad4e, 0x5bc0de, 0x9b59b6, 0x2ecc71];

// Letisko zboku: zástupné stanovištia z airport.json.
export default class Airport extends Phaser.Scene {
  constructor() { super('Airport'); }

  create(args) {
    this.cameras.main.setBackgroundColor('#b8c4cc');
    this.add.rectangle(640, 680, 1280, 240, 0x7f8c8d);  // podlaha
    data.get('airport').stations.forEach((s, i) => {
      this.add.rectangle(s.x, 460, 200, 240, COLORS[i % COLORS.length]);
    });
    const input = createInput(this);
    addHome(this, input);
    addNext(this, input, () => this.scene.start('Flight', args));
  }
}
