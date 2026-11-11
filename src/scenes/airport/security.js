import { makeItem, makeBin } from './shapes.js';
import * as fx from '../../ui/fx.js';
import * as audio from '../../systems/audio.js';
import * as data from '../../systems/data.js';

const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

// Obsah jedného kufra: n zakázaných + zvyšok povolených, v náhodnom poradí.
function pickBag(cfg, first) {
  const n = first ? cfg.firstBagForbidden : cfg.forbiddenPerBag[Math.floor(Math.random() * cfg.forbiddenPerBag.length)];
  const forb = shuffle(cfg.items.filter((i) => i.type === 'forbidden')).slice(0, n);
  const ok = shuffle(cfg.items.filter((i) => i.type === 'allowed')).slice(0, cfg.itemsPerBag - n);
  return shuffle([...forb, ...ok]);
}

// Bezpečnostná kontrola: pri každom kufri sa v paneli ukážu veci, zakázané syn potiahne do koša.
// Chyba = len povolená vec pustená do koša (vráti sa). Mimo koša sa vec len plynulo vráti. Nič sa nestratí.
export function security(ctx, done) {
  const { scene, input } = ctx;
  const cfg = data.get('airport').security;
  const P = cfg.panel;
  const scanner = ctx.buildings.security;
  const idleMs = cfg.idleHintSec * 1000;
  let bagNo = 0, panel = null, items = [], held = null, mistake = false, lastAct = scene.time.now, busy = true;

  const timer = scene.time.addEvent({
    delay: 1000, loop: true,
    callback: () => {
      if (busy || scene.time.now - lastAct < idleMs) return;
      lastAct = scene.time.now;
      const it = items.find((o) => o.def.type === 'forbidden' && !o.gone);
      if (it) scene.tweens.add({ targets: it.obj, scale: 1.25, duration: 300, yoyo: true, repeat: 2 });
      audio.play(ctx.station.voice);
    },
  });

  const light = (c) => scanner.light.setFillStyle(c);

  function openBag() {
    mistake = false; busy = true; lastAct = scene.time.now;
    light(0xe74c3c);
    const sz = P.itemSize;
    panel = scene.add.container(P.x, P.y).setDepth(40).setAlpha(0).setScale(0.85);
    panel.add(scene.add.rectangle(0, 0, P.w, P.h, 0xffffff).setStrokeStyle(10, 0x34495e));
    panel.add(scene.add.rectangle((P.itemXs[P.itemXs.length - 1] + P.binX) / 2 + sz / 4, 0, 6, P.h - 60, 0xbdc3c7));   // čiara medzi vecami a košom
    const bin = makeBin(scene, P.binX, 0, P.binSize);
    panel.add(bin);
    panel.bin = bin;
    items = pickBag(cfg, bagNo === 0).map((def, i) => {
      const x = P.itemXs[i], obj = makeItem(scene, def, x, 0, sz);
      panel.add(obj);
      return { def, obj, home: { x, y: 0 }, gone: false };
    });
    scene.tweens.add({ targets: panel, alpha: 1, scale: 1, duration: 250, onComplete: () => { busy = false; lastAct = scene.time.now; } });
  }

  function clean() {
    busy = true;
    light(0x2ecc71);
    scanner.dots[bagNo].setFillStyle(0x2ecc71);
    if (!mistake) {
      ctx.smiles += 1;
      const p = ctx.people[bagNo % ctx.people.length];
      fx.hop(scene, p.c, p.y);
      fx.sparks(scene, scanner.x, scanner.y - 150);
    }
    const old = panel;
    scene.time.delayedCall(600, () => scene.tweens.add({
      targets: old, x: P.x + 350, alpha: 0, duration: 400,
      onComplete: () => {
        old.destroy();
        bagNo += 1;
        if (bagNo >= cfg.bags) { timer.remove(); scene.time.delayedCall(300, done); } else openBag();
      },
    }));
  }

  const inBin = (pt) => Math.abs(pt.x - (P.x + P.binX)) < Math.max(P.binSize, 96) / 2 + 10 && Math.abs(pt.y - P.y) < Math.max(P.binSize, 96) / 2 + 20;

  ctx.on('dragStart', (pt) => {
    lastAct = scene.time.now;
    if (busy) return;
    let best = null, bestD = Infinity;
    items.forEach((it) => {
      if (it.gone) return;
      const gx = P.x + it.home.x, gy = P.y;
      if (!input.hitZone(gx, gy, P.itemSize, P.itemSize).contains(pt.x, pt.y)) return;
      const d = Phaser.Math.Distance.Between(gx, gy, pt.x, pt.y);
      if (d < bestD) { best = it; bestD = d; }
    });
    if (!best) return;
    scene.tweens.killTweensOf(best.obj);
    best.obj.setScale(1);
    held = { it: best, dx: P.x + best.home.x - pt.x, dy: P.y - pt.y };
    panel.bringToTop(best.obj);
  });

  ctx.on('drag', (pt) => {
    lastAct = scene.time.now;
    if (held) held.it.obj.setPosition(pt.x + held.dx - P.x, pt.y + held.dy - P.y);
  });

  ctx.on('dragEnd', (pt) => {
    lastAct = scene.time.now;
    if (!held) return;
    const { it } = held;
    held = null;
    const back = (shake) => scene.tweens.add({
      targets: it.obj, x: it.home.x, y: it.home.y, duration: 250,
      onComplete: () => { if (shake) scene.tweens.add({ targets: it.obj, x: it.home.x + 12, duration: 70, yoyo: true, repeat: 2, onComplete: () => it.obj.setX(it.home.x) }); },
    });
    if (!inBin(pt)) { back(false); return; }
    if (it.def.type === 'allowed') { mistake = true; back(true); return; }
    it.gone = true;
    scene.tweens.add({
      targets: it.obj, x: P.binX, y: 0, scale: 0.1, alpha: 0, duration: 280,
      onComplete: () => {
        it.obj.destroy();
        fx.sparks(scene, P.x + P.binX, P.y - 40);
        if (!items.some((o) => o.def.type === 'forbidden' && !o.gone)) clean();
      },
    });
  });

  openBag();
}
