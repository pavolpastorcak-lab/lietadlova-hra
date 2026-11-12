import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as save from '../systems/save.js';
import * as economy from '../systems/economy.js';
import { addHome } from '../ui/home.js';
import * as fx from '../ui/fx.js';
import { addPlane, addSprite, role } from '../systems/sprites.js';
import { addCoinCounter } from '../ui/coins.js';
import { addUpgradePanel } from './hangar/upgradePanel.js';
import { addPlanePicker } from './hangar/planePicker.js';

// Hangár: lietadlo so sedadlami, upgrade kapacity za mince a brána na odchod.
export default class Hangar extends Phaser.Scene {
  constructor() { super('Hangar'); }

  create() {
    this.cameras.main.setBackgroundColor('#8d6e63');
    const bg = addSprite(this, role('bgHangar'), 640, 400, { w: 1280 });
    if (bg) bg.setDepth(-10);
    else this.add.rectangle(640, 680, 1280, 240, 0x5d4037);  // podlaha
    const plane = economy.activePlane();
    const input = createInput(this);
    addHome(this, input);
    const counter = addCoinCounter(this, save.get().coins);
    const info = economy.capacityInfo(plane);

    // Lietadlo, sedadlá = bodky (nové sú zvýraznené).
    let py = 618;  // stred lietadla, spodok stojí na podlahe hangára (y≈790)
    const body = addPlane(this, 'side', 480, py, 560, { scaled: true });
    if (body) { py = 790 - body.displayHeight / 2; body.setY(py); }
    else {
      this.add.rectangle(480, py + 20, 520, 160, 0xffffff).setStrokeStyle(8, Number(plane.color) || 0x2e7d32);
      this.add.triangle(250, py - 60, 0, 80, 80, 80, 0, 0, Number(plane.color) || 0x2e7d32);
    }
    const total = info.next || info.current;
    const cols = Math.ceil(total / 2), step = Math.min(70, 400 / cols), sr = Math.min(22, step * 0.4);
    const seats = [];
    for (let i = 0; i < total; i++) {   // 2 rady; pri veľkej kapacite užší krok a menšie bodky
      const x = 445 - ((cols - 1) * step) / 2 + (i % cols) * step, y = i < cols ? py - 10 : py + 50;
      const isNew = i >= info.current;
      seats.push(this.add.circle(x, y, sr, isNew ? 0xbdbdbd : 0x3498db).setAlpha(isNew ? 0.5 : 1));
    }

    // Upgrade: ikona + sedadlá, cena s mincou. Bez mincí zašednutý.
    const state = { busy: false };
    const leave = () => this.time.delayedCall(1600, () => fx.go(this, 'Map'));
    const pulse = (o) => this.tweens.add({ targets: o, scale: o.scale * 1.6, duration: 250, yoyo: true, repeat: 2 });
    // Tri panely nad lietadlom: kapacita a dolet hore, motor pod nimi (polohy v data/sprites.json → hangarPanels).
    addUpgradePanel(this, input, { kind: 'capacity', plane, counter, state, onBought: (inf, up) => {
      up.destroy();
      seats.forEach((s) => s.setAlpha(1).setFillStyle(0x3498db));
      seats.slice(inf.current).forEach((s) => this.tweens.add({ targets: s, scale: 1.6, duration: 250, yoyo: true, repeat: 2 }));
      leave();
    } });
    addUpgradePanel(this, input, { kind: 'range', plane, counter, state, onBought: (inf, up, symbol) => {
      pulse(symbol);  // zväčšená nádrž v paneli, panel ostáva do odchodu
      leave();
    } });
    addUpgradePanel(this, input, { kind: 'engine', plane, counter, state, onBought: (inf, up, symbol) => {
      pulse(symbol);
      leave();
    } });
    addPlanePicker(this, input, { counter, state });
    const busy = () => state.busy;

    // Brána hangára: odchod na mapu bez kúpy.
    const gx = 1020, gy = 520;
    const door = this.add.rectangle(gx, gy, 260, 340, 0x3cb44b).setStrokeStyle(8, 0x2e7d32);
    this.add.triangle(gx, gy, -50, -60, -50, 60, 60, 0, 0xffffff);
    this.tweens.add({ targets: door, scale: 1.04, duration: 800, yoyo: true, repeat: -1 });
    input.onTapIn(input.hitZone(gx, gy, 260, 340), () => {
      if (!busy()) fx.go(this, 'Map');
    });
  }
}
