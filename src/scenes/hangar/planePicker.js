import * as data from '../../systems/data.js';
import * as save from '../../systems/save.js';
import * as economy from '../../systems/economy.js';
import * as audio from '../../systems/audio.js';
import * as fx from '../../ui/fx.js';
import { addPlane } from '../../systems/sprites.js';
import { makeCoin } from '../../ui/coins.js';
import { confetti } from '../../ui/fx-particles.js';
import { desaturate } from '../../ui/haze.js';

const Y = 120, SIZE = 140, GAP = 30;   // rad miniatúr hore nad panelmi upgradov (x vycentrované na 500)

// Rad miniatúr lietadiel. Vlastnené = farebné (ťuk vyberie), nevlastnené = zašednuté s cenou
// (ťuk kúpi a vyberie, bez mincí zatrasie). Po zmene sa hangár prekreslí (scene.restart);
// state.busy je zámok proti dvojťuku, aby sa kúpa neodpočítala dvakrát.
export function addPlanePicker(scene, input, { counter, state }) {
  const planes = data.get('planes');
  const s = save.get();
  audio.init(data.get('voice'));
  audio.preload(['sfx_upgrade']);
  const x0 = 500 - ((planes.length - 1) * (SIZE + GAP)) / 2;

  planes.forEach((p, i) => {
    const x = x0 + i * (SIZE + GAP);
    const owned = s.owned.includes(p.id), active = s.activePlane === p.id;
    const color = Number(p.color) || 0x999999;
    const box = scene.add.container(x, Y).setDepth(5);
    const frame = scene.add.rectangle(0, 0, SIZE, SIZE, 0xffffff, owned ? 1 : 0.85)
      .setStrokeStyle(active ? 10 : 5, active ? 0x2e7d32 : 0x9e9e9e);
    const pic = addPlane(scene, 'side', 0, owned ? 4 : -14, SIZE - 20, { plane: p })
      || scene.add.rectangle(0, owned ? 4 : -14, SIZE - 30, 56, color).setStrokeStyle(4, 0x555555);
    box.add([frame, pic]);
    if (!owned) {
      desaturate(pic, 'hangarUi');
      pic.setAlpha(0.55);
      if (pic.setTint) pic.setTint(0xbbbbbb);
      box.add([makeCoin(scene, -34, 46, 15), scene.add.text(26, 46, String(p.cost), {
        fontFamily: 'Arial', fontSize: '30px', fontStyle: 'bold', color: '#666666' }).setOrigin(0.5)]);
      if (s.coins < p.cost) box.setAlpha(0.6);
    }
    if (active) scene.tweens.add({ targets: box, scale: 1.05, duration: 700, yoyo: true, repeat: -1 });

    input.onTapIn(input.hitZone(x, Y, SIZE, SIZE), () => {
      if (state.busy || active) return;
      if (owned) {
        state.busy = true;
        economy.setActivePlane(p.id);
        fx.press(scene, box);
        scene.time.delayedCall(250, () => scene.scene.restart());
        return;
      }
      if (s.coins < p.cost) {   // zatrasenie, nič sa neodpočíta
        scene.tweens.add({ targets: box, x: x + 12, duration: 60, yoyo: true, repeat: 3, onComplete: () => box.setX(x) });
        return;
      }
      state.busy = true;
      economy.buyPlane(p.id);
      counter.set(save.get().coins);
      counter.tick();
      confetti(scene, x, Y);
      audio.play('sfx_upgrade');
      scene.time.delayedCall(900, () => scene.scene.restart());
    });
  });
}
