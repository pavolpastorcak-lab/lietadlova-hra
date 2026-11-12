import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as save from '../systems/save.js';
import * as economy from '../systems/economy.js';
import * as audio from '../systems/audio.js';
import { addHome } from '../ui/home.js';
import * as fx from '../ui/fx.js';
import { addSprite, role } from '../systems/sprites.js';
import { desaturate, addVeil } from '../ui/haze.js';
import * as daytime from '../ui/daytime.js';
import { startQuiz, quizCfg } from './landing/quiz.js';
import { showCountryName, belowY } from './landing/countryName.js';
import { flagShape } from '../ui/flagShape.js';

const WEATHER_BG = { sun: '#ffd54f', rain: '#7f9cb3' };
const FLAG_COLORS = { sk: 0x2b5fd6, gb: 0xd62b2b };

// Pristátie: počasie v cieli, zástupná vlajka a hlas `land_<id>` (chýba = ticho).
// Ťuk na vlajku → výplata.
export default class Landing extends Phaser.Scene {
  constructor() { super('Landing'); }

  create(args) {
    const dest = data.destination(args && args.to);
    if (dest) { economy.consumeFuel(save.get().location, dest.id); save.get().location = dest.id; save.save(); }   // lietadlo pristálo: odtiaľto sa letí ďalej
    const weather = dest && dest.weather;
    const time = daytime.timeOf(args && args.from, args && args.to);   // čas trasy (R2d): len pozadie a závoj
    this.cameras.main.setBackgroundColor(time === 'day' ? (WEATHER_BG[weather] || '#cccccc') : daytime.skyHex(time));
    const bg = addSprite(this, role('bgLanding'), 640, 400, { w: 1280 });
    desaturate(bg, 'landing');
    if (time === 'day') addVeil(this, 'landing', 1); else daytime.addScreenVeil(this, time, 1);
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
    if (dest && dest.id !== 'bts' && quizCfg() && this.textures.exists(dest.flag)) {   // chýba sprite vlajky → bez kvízu (ako Bratislava)
      startQuiz(this, input, dest, (quizFirstTry) => fx.go(this, 'Payout', { ...args, quizFirstTry }));
      return;
    }

    const color = (dest && FLAG_COLORS[dest.country]) || 0x999999;
    const flagSpr = addSprite(this, dest && dest.flag, 640, 380, { w: 256 });
    const flag = flagSpr || (dest && flagShape(this, dest.country, 640, 380, 256)) || this.add.rectangle(640, 380, 256, 192, color).setStrokeStyle(8, 0xffffff);
    const base = flag.scale;
    this.tweens.add({ targets: flag, scale: base * 1.08, duration: 700, yoyo: true, repeat: -1 });
    const gap = ((data.get('airport').landing || {}).countryText || {}).gap || 24;
    showCountryName(this, dest, 640, belowY(flag, gap) + (flag.displayHeight * 0.08) / 2);
    input.onTapIn(input.hitZone(640, 380, 256, 192), () => fx.go(this, 'Payout', args));
    if (dest) audio.play(`land_${dest.id}`);
  }
}
