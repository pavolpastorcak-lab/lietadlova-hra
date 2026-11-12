import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as save from '../systems/save.js';
import * as economy from '../systems/economy.js';
import * as audio from '../systems/audio.js';
import { addHome } from '../ui/home.js';
import * as fx from '../ui/fx.js';
import { desaturate, addVeil } from '../ui/haze.js';
import { runFlow } from './airport/flow.js';
import { checkin } from './airport/checkin.js';
import { bags } from './airport/bags.js';
import { stairs } from './airport/stairs.js';
import { gate } from './airport/gate.js';
import { pickLevel } from './apron/pick.js';
import { security } from './airport/security.js';
import { addPlane, addSprite, role, personKey } from '../systems/sprites.js';
import { makePerson, makeScanner, PERSON_COLORS } from './airport/shapes.js';

const COLORS = { checkin: 0xf0ad4e, bags: 0x5bc0de, gate: 0x9b59b6 };
const RUNNERS = { checkin, bags, security, boarding: stairs, gate };

// Letisko zboku: stanice z airport.json idú po poradí (check-in, batožina, schody, gate) → let.
// Sprity (pozadie, budovy, ľudia) idú z dát; keď chýbajú, kreslia sa zástupné tvary.
export default class Airport extends Phaser.Scene {
  constructor() { super('Airport'); }

  create(args) {
    this.cameras.main.setBackgroundColor('#b8c4cc');
    const bg = addSprite(this, role('bgAirport'), 640, 400, { w: 1280 });
    if (bg) { bg.setDepth(-20); desaturate(bg, 'airport'); }
    else this.add.rectangle(640, 680, 1280, 240, 0x7f8c8d);  // podlaha
    addVeil(this, 'airport', -5);  // závoj len nad pozadím a budovami, pod stanicami a ľuďmi
    const ap = data.get('airport');
    const stations = ap.stations;
    (ap.backdrop || []).forEach((b) => {
      const s = addSprite(this, b.sprite, b.x, b.y, { w: b.w, h: b.h, origin: [0.5, 1] });
      if (s) { s.setDepth(b.depth || -10); desaturate(s, 'airportBackdrop'); }
    });
    const ctx = { scene: this, buildings: {}, smiles: 0 };

    stations.forEach((s) => {
      if (s.id === 'boarding') {
        ctx.buildings[s.id] = addPlane(this, 'side', s.x + 10, 450, s.w)
          || this.add.rectangle(s.x, 470, 380, 120, 0xeeeeee).setStrokeStyle(6, 0x555555);
        ctx.plane = {
          door: { x: s.x - Math.round(120 * s.w / 380), y: 540 },
          stairsStart: { x: s.x - 280, y: 700 },
        };
        return;
      }
      if (s.id === 'security') {   // skener: sprite z role, inak tvary
        ctx.buildings[s.id] = makeScanner(this, s.x, s.y, s.w, ap.security.bags);
        return;
      }
      const spr = addSprite(this, s.sprite, s.x, s.y, { w: s.w, origin: [0.5, 1] });
      ctx.buildings[s.id] = spr || this.add.rectangle(s.x, 460, 200, 240, COLORS[s.id] || 0x999999);
      if (s.id === 'bags') {
        ctx.belt = { x: s.x, y: 610, w: 220 };
        if (!spr) this.add.rectangle(ctx.belt.x, ctx.belt.y, ctx.belt.w, 40, 0x444444);
      }
      if (s.id === 'gate') {
        const door = spr ? null : this.add.rectangle(s.x, 500, 100, 150, 0x6b4a2b).setDepth(1);
        ctx.gateInfo = { x: s.x, y: spr ? 540 : 460, door, sprite: spr, openKey: s.spriteOpen, opened: false };
      }
    });

    // Cestujúci: počet = kapacita lietadla zo save, v 2 radoch.
    const plane = economy.activePlane();
    const n = plane.capacity[save.get().planes[plane.id].capacity].value;
    const cols = Math.ceil(n / 2);
    ctx.people = [];
    for (let i = 0; i < n; i++) {
      const x = 80 + (i % cols) * 100;
      const y = i < cols ? 610 : 715;
      const c = makePerson(this, x, y, PERSON_COLORS[i % PERSON_COLORS.length], personKey(i)).setDepth(10);
      ctx.people.push({ x, y, c });
      fx.sway(this, c, i);
    }
    const boarding = ctx.buildings.boarding;
    if (boarding) ctx.breath = fx.breathe(this, boarding);   // flow.js ho pozastaví počas pulzu stanice

    ctx.input = createInput(this);
    addHome(this, ctx.input);
    audio.init(data.get('voice'));
    audio.preload([...stations.map((s) => s.voice), 'sfx_airport', 'sfx_belt', 'sfx_gate', 'sfx_bin']);
    const hall = audio.loop('sfx_airport');
    this.events.once('shutdown', () => hall.stop());

    runFlow(ctx, stations, RUNNERS, () => {
      const next = { ...args, passengers: n, smiles: ctx.smiles };
      const level = pickLevel(args && args.from, args && args.to);   // trasa bez hádanky ide rovno do Takeoff
      if (level) fx.go(this, 'Apron', { level, next: 'Takeoff', args: next });
      else fx.go(this, 'Takeoff', next);
    });
  }
}
