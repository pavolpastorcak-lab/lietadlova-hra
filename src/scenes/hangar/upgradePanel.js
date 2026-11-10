import * as data from '../../systems/data.js';
import * as save from '../../systems/save.js';
import * as economy from '../../systems/economy.js';
import * as fx from '../../ui/fx.js';
import { addPlane, addSprite, role } from '../../systems/sprites.js';
import { makeCoin } from '../../ui/coins.js';
import { confetti } from '../../ui/fx-particles.js';
import { desaturate, haze } from '../../ui/haze.js';

// Panel upgradu v hangári (kind = 'capacity' | 'range'), v sivých tónoch (haze.hangarUi).
// Poloha a rozmer: data/sprites.json → hangarPanels[kind]. Pri maxe sa nevykreslí (vráti null).
// state = { busy } zdieľaný medzi panelmi a bránou; onBought(info) sa volá po kúpe.
export function addUpgradePanel(scene, input, { kind, plane, counter, state, onBought }) {
  const info = economy.upgradeInfo(plane, kind);
  if (info.maxed) return null;
  const { x: ux, y: uy, w, h } = data.get('sprites').hangarPanels[kind];
  const g = haze('hangarUi') || {};
  const gray = (o) => { desaturate(o, 'hangarUi'); return o; };
  const col = g.text || '#666666';
  const colNum = Phaser.Display.Color.HexStringToColor(col).color;
  const txt = (x, s, ox) => scene.add.text(x, 0, s, { fontFamily: 'Arial', fontSize: '38px',
    fontStyle: 'bold', color: col }).setOrigin(ox, 0.5);

  // Symbol: sedadlo (kapacita) alebo nádrž (dolet), šírka 44 a výška najviac 60 px.
  let symbol;
  if (kind === 'range') {
    symbol = addSprite(scene, role('tank'), -40, 0, { w: 44 });
    if (symbol && symbol.displayHeight > 60) symbol.setScale(60 / symbol.height);
    symbol = symbol || scene.add.rectangle(-40, 0, 30, 36, 0x3498db);
  } else {
    symbol = addSprite(scene, role('seat'), -40, 0, { w: 44 }) || scene.add.circle(-40, 0, 16, 0x3498db);
  }
  const icon = addPlane(scene, 'side', -110, 0, 70);
  // Hodnota: "+N" pri kapacite, šípka nahor (tvar, nie znak) pri dolete.
  const value = kind === 'range'
    ? [scene.add.rectangle(10, 8, 12, 24, colNum), scene.add.triangle(10, -14, -16, 14, 16, 14, 0, -14, colNum)]
    : [txt(-12, '+' + (info.next - info.current), 0)];
  const up = scene.add.container(ux, uy);
  up.add([
    scene.add.rectangle(0, 0, w, h, 0xffffff).setStrokeStyle(6, Phaser.Display.Color.HexStringToColor(g.border || '#9e9e9e').color),
    gray(icon || scene.add.triangle(-110, 0, 0, 40, 40, 40, 20, 0, 0x2e7d32)),
    gray(symbol),
    ...value.map(gray),
    gray(makeCoin(scene, 70, 0, 18)),
    txt(130, String(info.cost), 1),
  ]);
  if (!info.affordable) up.setAlpha(0.4);

  input.onTapIn(input.hitZone(ux, uy, w, h), () => {
    if (state.busy) return;
    if (!info.affordable) {
      scene.tweens.add({ targets: up, x: ux + 12, duration: 60, yoyo: true, repeat: 3, onComplete: () => up.setX(ux) });
      return;
    }
    fx.press(scene, up);
    state.busy = true;
    economy.buyUpgrade(plane, kind);
    counter.set(save.get().coins);
    counter.tick();
    confetti(scene, ux, uy);
    onBought(info, up, symbol);
  });
  return up;
}
