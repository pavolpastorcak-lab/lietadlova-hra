// Nádrž na mape: ikona + stĺpec hladiny (zelená, pod lowFrac oranžová). Ťuk = natankovať za mince.
// Čísla (pozícia, veľkosť, trvanie) sú v data/economy.json → fuel.
import * as data from '../../systems/data.js';
import * as economy from '../../systems/economy.js';
import * as save from '../../systems/save.js';
import * as audio from '../../systems/audio.js';
import { addSprite, role } from '../../systems/sprites.js';
import { coinFly } from '../../ui/fx-particles.js';

const GREEN = 0x4caf50, ORANGE = 0xff9800;

// Vráti { blink, level }. onChange() sa zavolá hneď po zmene paliva (prekreslenie špendlíkov).
export function addFuelTank(scene, input, plane, counter, onChange) {
  const cfg = data.get('economy').fuel;
  const t = cfg.tank;
  const box = scene.add.container(t.x, t.y).setDepth(60);
  box.add(scene.add.rectangle(0, 0, t.hit, t.hit, 0xffffff, 0.85).setStrokeStyle(5, 0xb8860b));
  const icon = addSprite(scene, role('tank'), -24, 0, { h: t.h })
    || scene.add.rectangle(-24, 0, 52, t.h * 0.75, 0x3498db).setStrokeStyle(4, 0x1f618d);
  const barX = t.hit / 2 - t.barW / 2 - 8;
  const back = scene.add.rectangle(barX, 0, t.barW, t.barH, 0xcfd8dc).setStrokeStyle(3, 0x607d8b);
  const fill = scene.add.rectangle(barX, t.barH / 2, t.barW - 6, 1, GREEN).setOrigin(0.5, 1);
  box.add([icon, back, fill]);

  const draw = (km) => {
    const info = economy.fuelInfo(plane);
    const frac = info.max ? Math.min(1, km / info.max) : 0;
    fill.setSize(t.barW - 6, Math.max(0, (t.barH - 6) * frac)).setFillStyle(frac < cfg.lowFrac ? ORANGE : GREEN);
  };
  draw(economy.fuelInfo(plane).fuel);

  const blink = () => scene.tweens.add({ targets: box, scale: 1.25, duration: 160, yoyo: true, repeat: 2 });
  const shake = () => scene.tweens.add({ targets: box, x: t.x + 10, duration: 60, yoyo: true, repeat: 3, onComplete: () => box.setX(t.x) });

  let busy = false;
  const zone = input.hitZone(t.x, t.y, t.hit, t.hit);
  input.on('tap', (pt) => {
    if (busy || !zone.contains(pt.x, pt.y)) return;
    const before = economy.fuelInfo(plane);
    if (before.missing <= 0) { audio.play('st_fuel_full'); blink(); return; }
    const coins0 = save.get().coins;
    const res = economy.refuel(plane);
    if (!res.coins) { shake(); return; }          // 0 mincí: len zatrasie
    busy = true;
    audio.play('sfx_fuel');
    onChange();
    const p = { km: before.fuel };
    scene.tweens.add({ targets: p, km: before.fuel + res.km, duration: cfg.fillSec * 1000, onUpdate: () => draw(p.km), onComplete: () => draw(before.fuel + res.km) });
    const done = () => { counter.set(save.get().coins); counter.tick(); busy = false; };
    coinFly(scene, counter.icon.x, counter.icon.y, { x: t.x, y: t.y }, res.coins,
      (i, n) => counter.set(coins0 - Math.round((res.coins * (i + 1)) / n)), done);
  });
  return { blink };
}
