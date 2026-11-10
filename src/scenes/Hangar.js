import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as save from '../systems/save.js';
import * as economy from '../systems/economy.js';
import { addHome } from '../ui/home.js';
import * as fx from '../ui/fx.js';
import { addPlane, addSprite, role } from '../systems/sprites.js';
import { makeCoin, addCoinCounter } from '../ui/coins.js';
import { confetti } from '../ui/fx-particles.js';
import { desaturate, haze } from '../ui/haze.js';

// Hangár: lietadlo so sedadlami, upgrade kapacity za mince a brána na odchod.
export default class Hangar extends Phaser.Scene {
  constructor() { super('Hangar'); }

  create() {
    this.cameras.main.setBackgroundColor('#8d6e63');
    const bg = addSprite(this, role('bgHangar'), 640, 400, { w: 1280 });
    if (bg) bg.setDepth(-10);
    else this.add.rectangle(640, 680, 1280, 240, 0x5d4037);  // podlaha
    const plane = data.get('planes')[0];
    const input = createInput(this);
    addHome(this, input);
    const counter = addCoinCounter(this, save.get().coins);
    const info = economy.capacityInfo(plane);

    // Lietadlo, sedadlá = bodky (nové sú zvýraznené).
    const py = 618;  // stred lietadla, spodok stojí na podlahe hangára (y≈790)
    if (!addPlane(this, 'side', 480, py, 560)) {
      this.add.rectangle(480, py + 20, 520, 160, 0xffffff).setStrokeStyle(8, 0x2e7d32);
      this.add.triangle(250, py - 60, 0, 80, 80, 80, 0, 0, 0x2e7d32);
    }
    const total = info.next || info.current;
    const seats = [];
    for (let i = 0; i < total; i++) {
      const x = 340 + (i % 4) * 70, y = i < 4 ? py - 10 : py + 50;
      const isNew = i >= info.current;
      seats.push(this.add.circle(x, y, 22, isNew ? 0xbdbdbd : 0x3498db).setAlpha(isNew ? 0.5 : 1));
    }

    // Upgrade: ikona + sedadlá, cena s mincou. Bez mincí zašednutý.
    let busy = false;
    if (!info.maxed) {
      // Panel nad lietadlom, v sivých tónoch (haze.hangarUi v data/sprites.json).
      const ux = 480, uy = 385, g = haze('hangarUi') || {};
      const gray = (o) => { desaturate(o, 'hangarUi'); return o; };
      const txt = (x, s, ox) => this.add.text(x, 0, s, { fontFamily: 'Arial', fontSize: '38px',
        fontStyle: 'bold', color: g.text || '#666666' }).setOrigin(ox, 0.5);
      const up = this.add.container(ux, uy);
      const icon = addPlane(this, 'side', -110, 0, 70);
      up.add([
        this.add.rectangle(0, 0, 300, 100, 0xffffff).setStrokeStyle(6, Phaser.Display.Color.HexStringToColor(g.border || '#9e9e9e').color),
        gray(icon || this.add.triangle(-110, 0, 0, 40, 40, 40, 20, 0, 0x2e7d32)),
        gray(addSprite(this, role('seat'), -40, 0, { w: 44 }) || this.add.circle(-40, 0, 16, 0x3498db)),
        txt(-12, '+' + (info.next - info.current), 0),
        gray(makeCoin(this, 70, 0, 18)),
        txt(130, String(info.cost), 1),
      ]);
      if (!info.affordable) up.setAlpha(0.4);
      input.onTapIn(input.hitZone(ux, uy, 300, 100), () => {
        if (busy) return;
        if (!info.affordable) {
          this.tweens.add({ targets: up, x: ux + 12, duration: 60, yoyo: true, repeat: 3, onComplete: () => up.setX(ux) });
          return;
        }
        busy = true;
        economy.buyCapacity(plane);
        counter.set(save.get().coins);
        counter.tick();
        confetti(this, ux, uy);
        up.destroy();
        seats.forEach((s) => s.setAlpha(1).setFillStyle(0x3498db));
        seats.slice(info.current).forEach((s) => this.tweens.add({ targets: s, scale: 1.6, duration: 250, yoyo: true, repeat: 2 }));
        this.time.delayedCall(1600, () => fx.go(this, 'Map'));
      });
    }

    // Brána hangára: odchod na mapu bez kúpy.
    const gx = 1020, gy = 520;
    const door = this.add.rectangle(gx, gy, 260, 340, 0x3cb44b).setStrokeStyle(8, 0x2e7d32);
    this.add.triangle(gx, gy, -50, -60, -50, 60, 60, 0, 0xffffff);
    this.tweens.add({ targets: door, scale: 1.04, duration: 800, yoyo: true, repeat: -1 });
    input.onTapIn(input.hitZone(gx, gy, 260, 340), () => {
      if (!busy) fx.go(this, 'Map');
    });
  }
}
