import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as save from '../systems/save.js';
import * as economy from '../systems/economy.js';
import * as routes from '../systems/routes.js';
import { addHome } from '../ui/home.js';
import * as audio from '../systems/audio.js';
import * as fx from '../ui/fx.js';
import { coinFly } from '../ui/fx-particles.js';
import { makeCoin, addCoinCounter } from '../ui/coins.js';

// Výplata: kôpka za cestujúcich (základ) a kôpka prepitného. Ťuk = mince do počítadla.
// Mince sa uložia hneď pri vstupe (nič sa nestratí ani pri odchode cez domov),
// ťuk na kôpku len zobrazí pripočítanie. Po zozbieraní oboch → Hangar.
export default class Payout extends Phaser.Scene {
  constructor() { super('Payout'); }

  create(args) {
    const { from, to, passengers = 0, smiles = 0, stars = 0, quizFirstTry = false } = args || {};
    this.cameras.main.setBackgroundColor('#fff3d6');
    audio.init(data.get('voice'));
    audio.preload(['sfx_coins']);
    const f = to ? routes.flight(from, to) : null;
    const pay = economy.payout(passengers, smiles, stars, f && f.payMult, quizFirstTry);
    if (f) save.setBestStars(`${f.from}-${f.to}`, stars);
    const before = save.get().coins;
    save.addCoins(pay.total);

    const input = createInput(this);
    addHome(this, input);
    const counter = addCoinCounter(this, before);

    let shown = before;
    const piles = [{ x: 420, amount: pay.base }, { x: 860, amount: pay.tip }].filter((p) => p.amount > 0);
    let left = piles.length;
    const finish = () => this.time.delayedCall(700, () => fx.go(this, 'Hangar'));
    if (left === 0) finish();

    piles.forEach((p) => {
      const y = 450;
      const c = this.add.container(p.x, y);
      const n = Math.min(8, Math.max(2, Math.ceil(p.amount / 3)));
      for (let i = 0; i < n; i++) {
        c.add(makeCoin(this, (i % 3 - 1) * 46 + (i % 2) * 10, 40 - Math.floor(i / 3) * 30, 36));
      }
      c.add(this.add.text(0, 110, String(p.amount), {
        fontFamily: 'Arial', fontSize: '64px', fontStyle: 'bold', color: '#333333',
      }).setOrigin(0.5));
      this.tweens.add({ targets: c, scale: 1.08, duration: 600, yoyo: true, repeat: -1 });
      let taken = false;
      input.onTapIn(input.hitZone(p.x, y + 40, 260, 300), () => {
        if (taken) return;
        taken = true;
        audio.play('sfx_coins');
        this.tweens.killTweensOf(c);
        c.destroy();
        // mince letia po jednej (max 12), zvyšok sa pripočíta číslom; súčet = p.amount presne
        coinFly(this, p.x, y + 40, counter.icon, p.amount, (i, n) => {
          const per = Math.floor(p.amount / n);
          shown += i === n - 1 ? p.amount - per * (n - 1) : per;
          counter.set(shown);
          counter.tick();
        }, () => {
          if (--left > 0) return;
          counter.set(before + piles.reduce((a, q) => a + q.amount, 0));   // záruka presného čísla
          finish();
        });
      });
    });
  }
}
