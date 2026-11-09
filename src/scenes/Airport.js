import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as save from '../systems/save.js';
import * as audio from '../systems/audio.js';
import { addHome } from '../ui/home.js';
import { runFlow } from './airport/flow.js';
import { checkin } from './airport/checkin.js';
import { bags } from './airport/bags.js';
import { stairs } from './airport/stairs.js';
import { gate } from './airport/gate.js';
import { addPlane } from '../systems/sprites.js';
import { makePerson, PERSON_COLORS } from './airport/shapes.js';

const COLORS = { checkin: 0xf0ad4e, bags: 0x5bc0de, gate: 0x9b59b6 };
const RUNNERS = { checkin, bags, boarding: stairs, gate };

// Letisko zboku: stanice z airport.json idú po poradí (check-in, batožina, schody, gate) → let.
export default class Airport extends Phaser.Scene {
  constructor() { super('Airport'); }

  create(args) {
    this.cameras.main.setBackgroundColor('#b8c4cc');
    this.add.rectangle(640, 680, 1280, 240, 0x7f8c8d);  // podlaha
    const stations = data.get('airport').stations;
    const ctx = { scene: this, buildings: {}, smiles: 0 };

    stations.forEach((s) => {
      if (s.id === 'boarding') {
        ctx.buildings[s.id] = addPlane(this, 'side', s.x + 10, 450, 380)
          || this.add.rectangle(s.x, 470, 380, 120, 0xeeeeee).setStrokeStyle(6, 0x555555);
        ctx.plane = {
          door: { x: s.x - 120, y: 540 },
          stairsStart: { x: s.x - 280, y: 700 },
        };
        return;
      }
      ctx.buildings[s.id] = this.add.rectangle(s.x, 460, 200, 240, COLORS[s.id] || 0x999999);
      if (s.id === 'bags') ctx.belt = { x: s.x, y: 610, w: 220 };
      if (s.id === 'gate') {
        const door = this.add.rectangle(s.x, 500, 100, 150, 0x6b4a2b).setDepth(1);
        ctx.gateInfo = { x: s.x, y: 460, door, opened: false };
      }
    });
    if (ctx.belt) this.add.rectangle(ctx.belt.x, ctx.belt.y, ctx.belt.w, 40, 0x444444);

    // Cestujúci: počet = kapacita lietadla zo save, v 2 radoch.
    const plane = data.get('planes')[0];
    const n = plane.capacity[save.get().planes[plane.id].capacity].value;
    const cols = Math.ceil(n / 2);
    ctx.people = [];
    for (let i = 0; i < n; i++) {
      const x = 80 + (i % cols) * 100;
      const y = i < cols ? 610 : 715;
      ctx.people.push({ x, y, c: makePerson(this, x, y, PERSON_COLORS[i % PERSON_COLORS.length]).setDepth(10) });
    }

    ctx.input = createInput(this);
    addHome(this, ctx.input);
    audio.init(data.get('voice'));
    audio.preload(stations.map((s) => s.voice));

    runFlow(ctx, stations, RUNNERS, () => {
      this.scene.start('Takeoff', { ...args, passengers: n, smiles: ctx.smiles });
    });
  }
}
