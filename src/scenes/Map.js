import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import { addSprite, role } from '../systems/sprites.js';
import * as save from '../systems/save.js';
import { desaturate, addVeil } from '../ui/haze.js';

const HOME = 'bts';                                      // odtiaľ sa letí
const PIN_COLORS = { sk: 0x2b5fd6, gb: 0xd62b2b };       // zástupka za vlajku

// Mapa zhora: špendlíky destinácií, ťuk na cieľ → letisko.
// Pozadie = vrstva mapy z destinations.json (mapLayer), špendlík ui_pin s vlajkou nad ním.
export default class MapScene extends Phaser.Scene {
  constructor() { super('Map'); }

  create() {
    this.cameras.main.setBackgroundColor('#4aa3df');
    const dests = data.get('destinations');
    const layer = addSprite(this, dests[0].mapLayer, 640, 400, { w: 1280 });
    if (!layer) this.add.ellipse(560, 380, 760, 520, 0x7cc36b);      // pevnina
    desaturate(layer, 'map');
    addVeil(this, 'map', 1);
    const unlocked = save.get().unlocked || [];
    const input = createInput(this);

    dests.forEach((d) => {
      const pin = this.add.container(d.map.x, d.map.y);
      const pinSpr = addSprite(this, role('pin'), 0, 0, { h: 100, origin: [0.5, 1] });   // hrot na súradnici
      if (pinSpr) {
        pin.add(pinSpr);
        const flag = addSprite(this, d.flag, 0, -128, { w: 96 });
        if (flag) pin.add(flag);
      } else {
        pin.add(this.add.circle(0, 0, 44, 0xffffff));
        pin.add(this.add.circle(0, 0, 34, PIN_COLORS[d.country] || 0x999999));
        if (d.id === HOME) pin.add(this.add.circle(0, 0, 10, 0xffffff));
      }
      const open = d.id === HOME || unlocked.includes(d.id);
      if (!open) pin.setAlpha(0.45);              // zatiaľ nedostupná destinácia
      pin.setDepth(5);

      if (open) input.onTapIn(input.hitZone(d.map.x, d.map.y - (pinSpr ? 70 : 0), 150, pinSpr ? 200 : 120), () => {
        if (d.id === HOME) {
          this.tweens.add({ targets: pin, scale: 1.2, duration: 120, yoyo: true });
          return;
        }
        this.scene.start('Airport', { to: d.id });
      });
    });
  }
}
