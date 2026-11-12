// Posun veľkej mapy jedným prstom (len udalosti dragStart/drag/dragEnd z input.js; ťuk sa tu nerieši).
// Mapa je zväčšená v súradniciach (nie camera.zoom), kamera sa len posúva po scrollX/Y.
export const VIEW_W = 1280, VIEW_H = 800;

// Orezanie posunu na okraje mapy W×H (nikdy nevidno prázdno). Mapa menšia ako výhľad = 0.
export function clampScroll(x, y, W, H) {
  return { x: Math.min(Math.max(0, W - VIEW_W), Math.max(0, x)), y: Math.min(Math.max(0, H - VIEW_H), Math.max(0, y)) };
}

// Posun tak, aby bod (cx, cy) bol v strede obrazovky.
export function centerOn(cx, cy, W, H) {
  return clampScroll(cx - VIEW_W / 2, cy - VIEW_H / 2, W, H);
}

export function addPan(scene, input, W, H) {
  const cam = scene.cameras.main;
  cam.setBounds(0, 0, W, H);
  if (W <= VIEW_W && H <= VIEW_H) return { enabled: false };
  let from = null;
  input.on('dragStart', (pt) => { from = { x: pt.x, y: pt.y, sx: cam.scrollX, sy: cam.scrollY }; });
  input.on('drag', (pt) => {
    if (!from) return;
    const s = clampScroll(from.sx - (pt.x - from.x), from.sy - (pt.y - from.y), W, H);
    cam.setScroll(s.x, s.y);
  });
  input.on('dragEnd', () => { from = null; });
  return { enabled: true };
}
