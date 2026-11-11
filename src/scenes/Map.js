import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import { addSprite, addPlane, role } from '../systems/sprites.js';
import * as economy from '../systems/economy.js';
import * as save from '../systems/save.js';
import { desaturate, addVeil } from '../ui/haze.js';
import * as fx from '../ui/fx.js';

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
    const here = save.get().location;                 // tu lietadlo stojí, odtiaľ sa letí
    const plane = data.get('planes')[0];
    const input = createInput(this);

    fx.mapShadows(this, 4);
    const drops = [];
    const zones = [];
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
        if (d.id === here) pin.add(this.add.circle(0, 0, 10, 0xffffff));
      }
      const open = d.id === here || economy.inRange(d, plane);
      if (d.id === here) this.addHere(pin);
      if (!open) pin.setAlpha(0.45);              // zatiaľ nedostupná destinácia
      pin.setDepth(5 + d.map.y / 1000);           // nižšie na mape = vpredu
      if (open) drops.push({ obj: pin, y: d.map.y });
      const cy = d.map.y - (pinSpr ? 70 : 0);
      zones.push({ d, pin, open, cx: d.map.x, cy, rect: input.hitZone(d.map.x, cy, 110, pinSpr ? 190 : 120) });
    });

    // Jeden ťuk = najbližší špendlík so zásahovou plochou pod prstom (susedné plochy sa môžu dotýkať).
    input.on('tap', (pt) => {
      const hit = zones.filter((z) => z.rect.contains(pt.x, pt.y))
        .sort((p, q) => Phaser.Math.Distance.Between(pt.x, pt.y, p.cx, p.cy) - Phaser.Math.Distance.Between(pt.x, pt.y, q.cx, q.cy))[0];
      if (!hit) return;
      const { d, pin } = hit;
      if (!hit.open) return this.lockedPin(hit);
      if (d.id === here) {
        this.tweens.add({ targets: pin, scale: 1.2, duration: 120, yoyo: true });
        return;
      }
      fx.press(this, pin);
      fx.go(this, 'Airport', { from: here, to: d.id });
    });
    fx.dropPins(this, drops);
  }

  // „Si tu": pulzujúci krúžok pri hrote a malé lietadlo zhora pod ním (záložný tvar: trojuholník), vlajku nezakrýva.
  addHere(pin) {
    const ring = this.add.ellipse(0, 0, 90, 34).setStrokeStyle(6, 0xffffff);
    pin.addAt(ring, 0);
    this.tweens.add({ targets: ring, scale: 1.35, alpha: 0.35, duration: 800, yoyo: true, repeat: -1 });
    const y = 56;
    const plane = addPlane(this, 'top', 0, y, 56) || this.add.triangle(0, y, 0, 40, 40, 40, 20, 0, 0x2e7d32);
    const disc = this.add.circle(0, y, 34, 0xffffff, 0.92).setStrokeStyle(5, 0xff9800);   // aby lietadlo nezapadlo do mapy
    pin.add([disc, plane]);
    this.tweens.add({ targets: [disc, plane], y: y + 8, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  // Zamknutý špendlík: zatrasie sa a nad ním sa na 1,5 s ukáže nádrž (treba väčší dolet).
  lockedPin({ d, pin }) {
    this.tweens.add({ targets: pin, x: d.map.x + 10, duration: 60, yoyo: true, repeat: 3, onComplete: () => pin.setX(d.map.x) });
    if (pin.tankShown) return;
    pin.tankShown = true;
    const tank = addSprite(this, role('tank'), d.map.x, d.map.y - 215, { h: 70 })
      || this.add.rectangle(d.map.x, d.map.y - 215, 44, 60, 0x3498db);
    tank.setDepth(20);
    this.time.delayedCall(1500, () => { tank.destroy(); pin.tankShown = false; });
  }
}
