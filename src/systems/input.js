// Jediný input modul. Sleduje len 1 aktívny pointer (prvý dotyk), ďalšie prsty ignoruje.
// Udalosti: 'tap', 'dragStart', 'drag', 'dragEnd' s { x, y } v herných súradniciach.
// Scény nepočúvajú surové Phaser eventy, len tento modul.

export const MIN_HIT = 96;   // min. zásahová plocha (px pri 1280×800)
const TAP_SLOP = 12;         // posun do 12 px je ešte ťuk

export function createInput(scene) {
  const ev = new Phaser.Events.EventEmitter();
  let activeId = null;
  let start = { x: 0, y: 0 };
  let dragging = false;

  const down = (p) => {
    if (activeId !== null) return;           // druhý prst / dlaň ignorujeme
    activeId = p.id;
    start = { x: p.x, y: p.y };
    dragging = false;
  };

  const move = (p) => {
    if (p.id !== activeId) return;
    if (!dragging && Phaser.Math.Distance.Between(start.x, start.y, p.x, p.y) > TAP_SLOP) {
      dragging = true;
      ev.emit('dragStart', { x: start.x, y: start.y });
    }
    if (dragging) ev.emit('drag', { x: p.x, y: p.y });
  };

  const up = (p) => {
    if (p.id !== activeId) return;
    ev.emit(dragging ? 'dragEnd' : 'tap', { x: p.x, y: p.y });
    activeId = null;
    dragging = false;
  };

  const inp = scene.input;
  inp.on('pointerdown', down);
  inp.on('pointermove', move);
  inp.on('pointerup', up);
  inp.on('pointerupoutside', up);

  scene.events.once('shutdown', () => {
    inp.off('pointerdown', down);
    inp.off('pointermove', move);
    inp.off('pointerup', up);
    inp.off('pointerupoutside', up);
    ev.removeAllListeners();
  });

  // Zásahová plocha so stredom x,y, zväčšená aspoň na MIN_HIT.
  ev.hitZone = (x, y, w, h) => {
    const W = Math.max(w, MIN_HIT);
    const H = Math.max(h, MIN_HIT);
    return new Phaser.Geom.Rectangle(x - W / 2, y - H / 2, W, H);
  };

  // Ťuk do plochy → callback.
  ev.onTapIn = (rect, cb) => {
    ev.on('tap', (pt) => { if (rect.contains(pt.x, pt.y)) cb(pt); });
  };

  return ev;
}
