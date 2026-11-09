import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import { addHome } from '../ui/home.js';
import { addNext } from '../ui/next.js';

const WEATHER_BG = { sun: '#ffd54f', rain: '#7f9cb3' };
const FLAG_COLORS = { sk: 0x2b5fd6, gb: 0xd62b2b };

// Pristátie: farba počasia v cieli a zástupná vlajka.
export default class Landing extends Phaser.Scene {
  constructor() { super('Landing'); }

  create(args) {
    const dest = data.destination(args && args.to);
    this.cameras.main.setBackgroundColor(WEATHER_BG[dest && dest.weather] || '#cccccc');
    const color = (dest && FLAG_COLORS[dest.country]) || 0x999999;
    this.add.rectangle(640, 360, 256, 192, color).setStrokeStyle(8, 0xffffff);
    const input = createInput(this);
    addHome(this, input);
    addNext(this, input, () => this.scene.start('Hangar', args));
  }
}
