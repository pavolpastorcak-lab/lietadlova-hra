import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import { addSprite, addPlane, role } from '../systems/sprites.js';
import * as economy from '../systems/economy.js';
import * as save from '../systems/save.js';
import { desaturate, addVeil } from '../ui/haze.js';
import * as fx from '../ui/fx.js';
import * as audio from '../systems/audio.js';
import { addCoinCounter } from '../ui/coins.js';
import { addFuelTank } from './map/fuel.js';
import { addGlobe } from './map/globe.js';
import { flagShape } from '../ui/flagShape.js';
import { addPan, centerOn } from './map/pan.js';

const PIN_COLORS = { sk: 0x2b5fd6, gb: 0xd62b2b };       // zástupka za vlajku

// Mapa zhora: špendlíky destinácií, ťuk na cieľ → letisko.
// Pozadie = vrstva zvolenej mapy (sprites.json → maps), špendlík ui_pin s vlajkou nad ním; polohy v destinations.json → maps[view].
// Veľká mapa (sprites.json → mapZoom) je zväčšená v súradniciach (pozadie aj polohy ×zoom, špendlíky nie) a posúva sa jedným prstom (map/pan.js).
// Špendlíky žijú vo svete (zásahová plocha = svet), HUD (glóbus, nádrž, mince, závoj, tiene) je pripnutý k obrazovke (scrollFactor 0).
// Glóbus (map/globe.js) prepína europa ↔ svet. Mapa sa otvorí tá, na ktorej stojí lietadlo.
export default class MapScene extends Phaser.Scene {
  constructor() { super('Map'); }

  create(args) {
    this.cameras.main.setBackgroundColor('#4aa3df');
    const here = save.get().location;                 // tu lietadlo stojí, odtiaľ sa letí
    const dests = data.get('destinations').filter((d) => d.maps[this.pickView(args, here)]);
    const view = this.pickView(args, here);
    this.viewName = view;
    if (args && args.switched) this.cameras.main.fadeIn(data.get('sprites').globe.fadeMs, 74, 163, 223);
    const mapCfg = data.get('sprites').maps[view];
    const zoom = (data.get('sprites').mapZoom || {})[view] || 1;
    const W = 1280 * zoom, H = 800 * zoom;
    const layer = addSprite(this, mapCfg.layer, W / 2, H / 2, { w: W });
    if (!layer) this.add.ellipse(560 * zoom, 380 * zoom, 760 * zoom, 520 * zoom, 0x7cc36b);      // pevnina
    desaturate(layer, 'map');
    const veil = addVeil(this, 'map', 1);
    if (veil) veil.setScrollFactor(0);
    const plane = economy.activePlane();
    const input = createInput(this);

    fx.mapShadows(this, 4).forEach((o) => o.setScrollFactor(0));
    const drops = [];
    const zones = [];
    dests.forEach((d) => {
      const at = { ...d.maps[view], x: d.maps[view].x * zoom, y: d.maps[view].y * zoom };   // súradnice sveta
      const k = at.k ?? (d.maps.europa && mapCfg.pinScale ? mapCfg.pinScale : 1);   // európske mestá na veľkej mape sú menšie, husté zhluky (Zálivy, Kaukaz) tiež (maps.svet.k)
      const pin = this.add.container(at.x, at.y).setScale(k);
      const pinSpr = addSprite(this, role('pin'), 0, 0, { h: 100, origin: [0.5, 1] });   // hrot na súradnici
      if (pinSpr) {
        pin.add(pinSpr);
        const flag = addSprite(this, d.flag, 0, -128, { w: 96 }) || flagShape(this, d.country, 0, -128, 96);
        if (flag) pin.add(flag);
      } else {
        pin.add(this.add.circle(0, 0, 44, 0xffffff));
        pin.add(this.add.circle(0, 0, 34, PIN_COLORS[d.country] || 0x999999));
        if (d.id === here) pin.add(this.add.circle(0, 0, 10, 0xffffff));
      }
      if (d.id === here) this.addHere(pin);
      pin.setDepth(5 + at.y / 1000);           // nižšie na mape = vpredu
      const cy = at.y - (pinSpr ? 70 : 0) * k;
      const z = { d, pin, at, k, state: 'open', dropY: (pinSpr ? -150 : -56) * k, cx: at.x, cy, rect: input.hitZone(at.x, cy, 110 * k, (pinSpr ? 190 : 120) * k) };
      this.applyState(z, plane);
      zones.push(z);
      if (z.state === 'open') drops.push({ obj: pin, y: at.y });
    });
    this.zones = zones;
    const globe = addGlobe(this, input, view);
    const counter = addCoinCounter(this, save.get().coins);
    const tank = addFuelTank(this, input, plane, counter, () => zones.forEach((z) => this.applyState(z, plane)));
    [globe.box, tank.box, ...counter.objs].forEach((o) => o.setScrollFactor(0));   // HUD stojí na mieste
    const hud = [globe.zone, tank.zone, counter.zone];
    const hereZ = zones.find((z) => z.d.id === here);
    const c0 = hereZ ? { x: hereZ.cx, y: hereZ.cy } : { x: W / 2, y: H / 2 };
    const s0 = centerOn(c0.x, c0.y, W, H);
    addPan(this, input, W, H);
    this.cameras.main.setScroll(s0.x, s0.y);

    // Jeden ťuk = najbližší špendlík so zásahovou plochou pod prstom (susedné plochy sa môžu dotýkať).
    input.on('tap', (pt) => {
      if (hud.some((h) => h.contains(pt.x, pt.y))) return;       // ťuk do HUD (obrazovka) nejde na špendlík pod ním
      const cam = this.cameras.main, wx = pt.x + cam.scrollX, wy = pt.y + cam.scrollY;   // ťuk (obrazovka) → svet
      const hit = zones.filter((z) => z.rect.contains(wx, wy))
        .sort((p, q) => Phaser.Math.Distance.Between(wx, wy, p.cx, p.cy) - Phaser.Math.Distance.Between(wx, wy, q.cx, q.cy))[0];
      if (!hit) return;
      const { d, pin } = hit;
      if (hit.state === 'needFuel') return this.needFuelPin(hit, tank);
      if (hit.state === 'locked') return this.lockedPin(hit);
      if (d.id === here) {
        this.tweens.add({ targets: pin, scale: hit.k * 1.2, duration: 120, yoyo: true });
        return;
      }
      fx.press(this, pin);
      fx.go(this, 'Airport', { from: here, to: d.id });
    });
    if (!(args && args.switched)) fx.dropPins(this, drops);
  }

  // Ktorá mapa sa otvorí: zvolená glóbusom, inak tá, na ktorej stojí lietadlo (mesto len na `svet` → svet).
  pickView(args, here) {
    if (args && args.view) return args.view;
    const d = data.destination(here);
    return d && d.maps.europa ? 'europa' : d ? Object.keys(d.maps)[0] : 'europa';
  }

  // Stav špendlíka podľa paliva: open = ako dnes, needFuel = priesvitný + oranžová kvapka, locked = priesvitnejší.
  applyState(z, plane) {
    z.state = economy.pinState(z.d, plane);
    z.pin.setAlpha(z.state === 'open' ? 1 : z.state === 'needFuel' ? 0.6 : 0.45);
    if (z.drop) { z.drop.destroy(); z.drop = null; }
    if (z.state !== 'needFuel') return;
    const s = data.get('economy').fuel.drop.size;
    z.drop = this.add.container(z.at.x + 62 * z.k, z.at.y + z.dropY).setDepth(30);   // mimo špendlíka, aby ho priesvitnosť nezoslabila
    z.drop.add([this.add.triangle(0, -s * 0.28, -s * 0.4, s * 0.2, s * 0.4, s * 0.2, 0, -s * 0.6, 0xff9800).setStrokeStyle(3, 0xe65100),
      this.add.circle(0, s * 0.2, s * 0.4, 0xff9800).setStrokeStyle(3, 0xe65100)]);
  }

  // Treba natankovať: špendlík zatrasie, nádrž sa rozbliká a hlas.
  needFuelPin({ at, pin }, tank) {
    this.tweens.add({ targets: pin, x: at.x + 10, duration: 60, yoyo: true, repeat: 3, onComplete: () => pin.setX(at.x) });
    tank.blink();
    audio.play('st_fuel_need');
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
  lockedPin({ at, k, pin }) {
    this.tweens.add({ targets: pin, x: at.x + 10, duration: 60, yoyo: true, repeat: 3, onComplete: () => pin.setX(at.x) });
    if (pin.tankShown) return;
    pin.tankShown = true;
    const tank = addSprite(this, role('tank'), at.x, at.y - 215 * k, { h: 70 })
      || this.add.rectangle(at.x, at.y - 215 * k, 44, 60, 0x3498db);
    tank.setDepth(20);
    this.time.delayedCall(1500, () => { tank.destroy(); pin.tankShown = false; });
  }
}
