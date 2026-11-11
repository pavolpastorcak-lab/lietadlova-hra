import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as audio from '../systems/audio.js';
import { addHome } from '../ui/home.js';
import * as fx from '../ui/fx.js';
import { addSprite, role } from '../systems/sprites.js';
import { desaturate, addVeil } from '../ui/haze.js';
import { startQuiz, quizCfg } from './landing/quiz.js';

const WEATHER_BG = { sun: '#ffd54f', rain: '#7f9cb3' };
const FLAG_COLORS = { sk: 0x2b5fd6, gb: 0xd62b2b };

// Pristátie: počasie v cieli, zástupná vlajka a hlas `land_<id>` (chýba = ticho).
// Ťuk na vlajku → výplata.
export default class Landing extends Phaser.Scene {
  constructor() { super('Landing'); }

  create(args) {
    const dest = data.destination(args && args.to);
    const weather = dest && dest.weather;
    this.cameras.main.setBackgroundColor(WEATHER_BG[weather] || '#cccccc');
    const bg = addSprite(this, role('bgLanding'), 640, 400, { w: 1280 });
    desaturate(bg, 'landing');
    addVeil(this, 'landing', 1);
    if (!bg) this.add.rectangle(640, 700, 1280, 200, 0x6e7b82);   // dráha

    if (weather === 'sun') {
      if (!bg) {
        this.add.circle(1050, 160, 70, 0xfff176).setStrokeStyle(8, 0xffa000);
      }
    } else if (weather === 'rain') {
      [[130, 150], [900, 140], [1020, 120], [1140, 150]].forEach(([x, y]) => {
        if (!addSprite(this, role('stormCloud'), x, y, { w: 230 })) this.add.ellipse(x, y, 160, 80, 0xeceff1);
        for (let i = 0; i < 3; i++) {
          this.add.ellipse(x - 40 + i * 40, y + 90, 10, 34, 0x4fc3f7);
        }
      });
    }

    const input = createInput(this);
    addHome(this, input);
    audio.init(data.get('voice'));
    if (dest && dest.id !== 'bts' && quizCfg()) {
      startQuiz(this, input, dest, (quizFirstTry) => fx.go(this, 'Payout', { ...args, quizFirstTry }));
      return;
    }

    const color = (dest && FLAG_COLORS[dest.country]) || 0x999999;
    const flagSpr = addSprite(this, dest && dest.flag, 640, 380, { w: 256 });
    const flag = flagSpr || this.add.rectangle(640, 380, 256, 192, color).setStrokeStyle(8, 0xffffff);
    const base = flag.scale;
    this.tweens.add({ targets: flag, scale: base * 1.08, duration: 700, yoyo: true, repeat: -1 });
    input.onTapIn(input.hitZone(640, 380, 256, 192), () => fx.go(this, 'Payout', args));
    if (dest) audio.play(`land_${dest.id}`);
  }
}
