import * as data from '../systems/data.js';

// Zosadenie farieb: menšia sýtosť + modrastý závoj (hodnoty v data/sprites.json → haze[name]).
// Čitateľnosť: menej farebných prvkov na ploche. Bez WebGL postFX ostane len závoj.
export function haze(name) { return ((data.get('sprites') || {}).haze || {})[name]; }

export function desaturate(obj, name) {
  const h = haze(name);
  if (obj && h && obj.postFX) obj.postFX.addColorMatrix().saturate(h.saturation);
}

export function addVeil(scene, name, depth = 0) {
  const h = haze(name);
  if (!h) return null;
  const c = Phaser.Display.Color.HexStringToColor(h.color).color;
  return scene.add.rectangle(640, 400, 1280, 800, c, h.alpha).setDepth(depth);
}
