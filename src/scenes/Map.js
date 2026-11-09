import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';

const HOME = 'bts';                                      // odtiaľ sa letí
const PIN_COLORS = { sk: 0x2b5fd6, gb: 0xd62b2b };       // zástupka za vlajku

// Mapa zhora: špendlíky destinácií, ťuk na cieľ → letisko.
export default class MapScene extends Phaser.Scene {
  constructor() { super('Map'); }

  create() {
    this.cameras.main.setBackgroundColor('#4aa3df');
    this.add.ellipse(560, 380, 760, 520, 0x7cc36b);      // pevnina
    const input = createInput(this);

    data.get('destinations').forEach((d) => {
      const pin = this.add.container(d.map.x, d.map.y);
      pin.add(this.add.circle(0, 0, 44, 0xffffff));
      pin.add(this.add.circle(0, 0, 34, PIN_COLORS[d.country] || 0x999999));
      if (d.id === HOME) pin.add(this.add.circle(0, 0, 10, 0xffffff));

      input.onTapIn(input.hitZone(d.map.x, d.map.y, 120, 120), () => {
        if (d.id === HOME) {
          this.tweens.add({ targets: pin, scale: 1.2, duration: 120, yoyo: true });
          return;
        }
        this.scene.start('Airport', { to: d.id });
      });
    });
  }
}
