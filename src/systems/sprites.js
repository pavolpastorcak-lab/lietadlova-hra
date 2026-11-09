// Sprity lietadiel z kresieb. Mená berie z data/planes.json (sprites.side / air / top).
// Ak sprite chýba (súbor sa nenačítal), addPlane vráti null a scéna nakreslí záložný tvar.
import * as data from './data.js';

const DIR = './assets/sprites/plane/';

export function queuePlaneSprites(scene, planes) {
  planes.forEach((p) => {
    Object.values(p.sprites).forEach((key) => {
      if (key) scene.load.image(key, `${DIR}${key}.png`);
    });
  });
}

// kind: 'side' | 'air' | 'top'. Šírka v px, výška podľa pomeru strán.
export function addPlane(scene, kind, x, y, width, planeIndex = 0) {
  const plane = data.get('planes')[planeIndex];
  const key = plane && plane.sprites[kind];
  if (!key || !scene.textures.exists(key)) return null;
  const img = scene.add.image(x, y, key);
  img.setScale(width / img.width);
  return img;
}
