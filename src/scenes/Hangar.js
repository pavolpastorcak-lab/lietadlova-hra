import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as save from '../systems/save.js';
import * as economy from '../systems/economy.js';
import { addHome } from '../ui/home.js';
import { makeCoin, addCoinCounter } from '../ui/coins.js';

// Hangár: lietadlo so sedadlami, upgrade kapacity za mince a brána na odchod.
export default class Hangar extends Phaser.Scene {
  constructor() { super('Hangar'); }

  create() {
    this.cameras.main.setBackgroundColor('#8d6e63');
    this.add.rectangle(640, 680, 1280, 240, 0x5d4037);  // podlaha
    const plane = data.get('planes')[0];
    const input = createInput(this);
    addHome(this, input);
    const counter = addCoinCounter(this, save.get().coins);
    const info = economy.capacityInfo(plane);

    // Lietadlo, sedadlá = bodky (nové sú zvýraznené).
    this.add.rectangle(480, 440, 520, 160, 0xffffff).setStrokeStyle(8, 0x2e7d32);
    this.add.triangle(250, 360, 0, 80, 80, 80, 0, 0, 0x2e7d32);
    const total = info.next || info.current;
    const seats = [];
    for (let i = 0; i < total; i++) {
      const x = 340 + (i % 4) * 70, y = i < 4 ? 410 : 470;
      const isNew = i >= info.current;
      seats.push(this.add.circle(x, y, 22, isNew ? 0xbdbdbd : 0x3498db).setAlpha(isNew ? 0.5 : 1));
    }

    // Upgrade: ikona + sedadlá, cena s mincou. Bez mincí zašednutý.
    let busy = false;
    if (!info.maxed) {
      const ux = 480, uy = 640;
      const up = this.add.container(ux, uy);
      up.add([
        this.add.rectangle(0, 0, 300, 120, 0xffffff).setStrokeStyle(6, 0x2e7d32),
        this.add.triangle(-110, 0, 0, 40, 40, 40, 20, 0, 0x2e7d32),
        this.add.circle(-40, 0, 18, 0x3498db),
        this.add.text(-10, 0, '+' + (info.next - info.current), {
          fontFamily: 'Arial', fontSize: '40px', fontStyle: 'bold', color: '#333333' }).setOrigin(0, 0.5),
        makeCoin(this, 70, 0, 20),
        this.add.text(130, 0, String(info.cost), {
          fontFamily: 'Arial', fontSize: '40px', fontStyle: 'bold', color: '#333333' }).setOrigin(1, 0.5),
      ]);
      if (!info.affordable) up.setAlpha(0.4);
      input.onTapIn(input.hitZone(ux, uy, 300, 120), () => {
        if (busy) return;
        if (!info.affordable) {
          this.tweens.add({ targets: up, x: ux + 12, duration: 60, yoyo: true, repeat: 3, onComplete: () => up.setX(ux) });
          return;
        }
        busy = true;
        economy.buyCapacity(plane);
        counter.set(save.get().coins);
        up.destroy();
        seats.forEach((s) => s.setAlpha(1).setFillStyle(0x3498db));
        seats.slice(info.current).forEach((s) => this.tweens.add({ targets: s, scale: 1.6, duration: 250, yoyo: true, repeat: 2 }));
        this.time.delayedCall(1600, () => this.scene.start('Map'));
      });
    }

    // Brána hangára: odchod na mapu bez kúpy.
    const gx = 1020, gy = 520;
    const door = this.add.rectangle(gx, gy, 260, 340, 0x3cb44b).setStrokeStyle(8, 0x2e7d32);
    this.add.triangle(gx, gy, -50, -60, -50, 60, 60, 0, 0xffffff);
    this.tweens.add({ targets: door, scale: 1.04, duration: 800, yoyo: true, repeat: -1 });
    input.onTapIn(input.hitZone(gx, gy, 260, 340), () => {
      if (!busy) this.scene.start('Map');
    });
  }
}
