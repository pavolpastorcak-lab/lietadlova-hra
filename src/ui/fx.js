// Spoločné efekty (kód, bez nových obrázkov). Každá funkcia berie scénu a čísla z sprites.json → fx
// a po sebe upratuje (destroy). Max ~60 objektov naraz: mraky 8, stopa ≤ maxLive, iskry 6 na zber.
import * as data from '../systems/data.js';
import { addSprite, role } from '../systems/sprites.js';

export const fxCfg = () => (data.get('sprites') || {}).fx || {};

function cloudShape(scene, w) {
  const spr = addSprite(scene, Phaser.Utils.Array.GetRandom(role('cloud') || []), 0, 0, { w });
  if (spr) return spr;
  const k = w / 200;
  return scene.add.container(0, 0, [scene.add.circle(-40 * k, 8 * k, 34 * k, 0xffffff),
    scene.add.circle(0, -8 * k, 44 * k, 0xffffff), scene.add.circle(42 * k, 8 * k, 32 * k, 0xffffff)]);
}

// Vzdialené mraky za hernou vrstvou: pomalšie než prekážky, priehľadné, bez nárazu.
// Vráti { update(dt, speed), destroy() }; speed = rýchlosť hernej vrstvy (px/s).
export function farClouds(scene, cfg = fxCfg().farClouds) {
  if (!cfg) return { update() {}, tint() {}, destroy() {} };
  const all = [];
  cfg.layers.forEach((L) => {
    for (let i = 0; i < L.count; i++) {
      const c = cloudShape(scene, L.width).setAlpha(L.alpha).setDepth(L.depth);
      c.setPosition(cfg.startX + (cfg.spanX / L.count) * i, Phaser.Math.Between(L.minY, L.maxY));
      c.layer = L;
      all.push(c);
    }
  });
  return {
    update(dt, speed) {
      all.forEach((c) => {
        c.x -= speed * c.layer.speed * dt;
        if (c.x < cfg.startX - 200) { c.x += cfg.spanX + 200; c.y = Phaser.Math.Between(c.layer.minY, c.layer.maxY); }
      });
    },
    // Plynulé stmavnutie (t 0..1) z bielej na farbu `to` (sprite = tint, záložný tvar = výplň kruhov).
    tint(t, to) {
      const k = Phaser.Display.Color.Interpolate.ColorWithColor(new Phaser.Display.Color(255, 255, 255), Phaser.Display.Color.ValueToColor(to), 100, Math.round(t * 100));
      const col = Phaser.Display.Color.GetColor(k.r, k.g, k.b);
      all.forEach((c) => (c.setTint ? c.setTint(col) : c.list.forEach((s) => s.setFillStyle(col))));
    },
    destroy() { all.forEach((c) => c.destroy()); all.length = 0; },
  };
}

// Stopa za lietadlom: miznúce biele krúžky. Vráti { update(dt, x, y), destroy() }.
export function trail(scene, cfg = fxCfg().trail) {
  if (!cfg) return { update() {}, destroy() {} };
  const live = new Set();
  let acc = 0;
  return {
    update(dt, x, y) {
      acc += dt * 1000;
      if (acc < cfg.everyMs) return;
      acc = 0;
      if (live.size >= cfg.maxLive) return;
      const c = scene.add.circle(x + cfg.offsetX, y, cfg.radius, 0xffffff, cfg.alpha).setDepth(15);
      live.add(c);
      scene.tweens.add({ targets: c, alpha: 0, scale: cfg.growTo, x: c.x + cfg.driftX, duration: cfg.lifeMs,
        onComplete: () => { live.delete(c); c.destroy(); } });
    },
    destroy() { live.forEach((c) => c.destroy()); live.clear(); },
  };
}

// Iskry do strán pri zbere hviezdičky.
export function sparks(scene, x, y, cfg = fxCfg().sparks) {
  if (!cfg) return;
  for (let i = 0; i < cfg.count; i++) {
    const a = (Math.PI * 2 * i) / cfg.count;
    const s = scene.add.circle(x, y, cfg.size, Number(cfg.color)).setDepth(30);
    scene.tweens.add({ targets: s, x: x + Math.cos(a) * cfg.dist, y: y + Math.sin(a) * cfg.dist, alpha: 0, scale: 0.3,
      duration: cfg.ms, onComplete: () => s.destroy() });
  }
}

// Počítadlo poskočí (target = text/objekt s mierkou).
export function counterBounce(scene, target, cfg = fxCfg().counter) {
  if (!cfg || !target) return;
  scene.tweens.killTweensOf(target);
  target.setScale(1);
  scene.tweens.add({ targets: target, scale: cfg.scale, duration: cfg.ms, yoyo: true });
}

// Mrak sa po náraze „rozfúkne": zväčší sa a zbledne (bez zmeny nárazovej plochy).
export function puff(scene, obj, cfg = fxCfg().puff) {
  if (!cfg || !obj || !obj.scene) return;
  scene.tweens.add({ targets: obj, scale: cfg.scale, alpha: cfg.alpha, duration: cfg.ms });
}

// ---- 3i: prechody, stlačenie, scény ----

// Prechod scény: jediná cesta pre scene.start. Druhé volanie počas prechodu sa ignoruje.
// opts.fade=false = plynulé pokračovanie bez zatmenia (Takeoff → Flight → Touchdown).
export function go(scene, key, args, opts = {}) {
  if (scene.__going) return;
  scene.__going = true;
  scene.events.once('shutdown', () => { scene.__going = false; });
  const cfg = fxCfg().transition;
  if (opts.fade === false || !cfg) { scene.scene.start(key, args); return; }
  const [r, g, b] = cfg.color;
  const target = scene.scene.get(key);
  if (target) target.events.once('create', () => target.cameras.main.fadeIn(cfg.ms, r, g, b));
  scene.cameras.main.once('camerafadeoutcomplete', () => scene.scene.start(key, args));
  scene.cameras.main.fadeOut(cfg.ms, r, g, b);
}

// Krátke stlačenie (mierka z aktuálnej mierky objektu). Nie na objekt, ktorý už má vlastný pulz.
export function press(scene, obj, cfg = fxCfg().press) {
  if (!cfg || !obj || !obj.scene || obj.__pressing) return;
  obj.__pressing = true;
  const bx = obj.scaleX, by = obj.scaleY;
  scene.tweens.add({ targets: obj, scaleX: bx * cfg.scale, scaleY: by * cfg.scale, duration: cfg.ms / 2, yoyo: true,
    onComplete: () => { obj.setScale(bx, by); obj.__pressing = false; } });
}

// Jemné pohupovanie (náklon), každý objekt s inou fázou (index i). Vráti tween (uloží aj do obj.__sway).
export function sway(scene, obj, i = 0, cfg = fxCfg().sway) {
  if (!cfg || !obj) return null;
  obj.__sway = scene.tweens.add({ targets: obj, angle: cfg.angle, duration: cfg.ms, yoyo: true, repeat: -1,
    ease: 'Sine.inOut', delay: (i % 6) * cfg.phaseMs });
  return obj.__sway;
}
export function stopSway(obj) {
  if (obj && obj.__sway) { obj.__sway.stop(); obj.__sway = null; obj.setAngle(0); }
}

// Poskočenie o px a návrat presne na y.
export function hop(scene, obj, y, cfg = fxCfg().hop) {
  if (!cfg || !obj || !obj.scene) return;
  scene.tweens.add({ targets: obj, y: y - cfg.px, duration: cfg.ms, yoyo: true, onComplete: () => obj.setY(y) });
}

// „Dýchanie" ±scale. Vráti { obj, start(), stop() }; stop vráti pôvodnú mierku (kvôli pulzu staníc).
export function breathe(scene, obj, cfg = fxCfg().breathe) {
  const h = { obj, tw: null, start() {}, stop() {} };
  if (!cfg || !obj) return h;
  let bx = 0, by = 0;
  h.start = () => {
    if (h.tw) return;
    bx = obj.scaleX; by = obj.scaleY;
    h.tw = scene.tweens.add({ targets: obj, scaleX: bx * (1 + cfg.scale), scaleY: by * (1 + cfg.scale),
      duration: cfg.ms, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  };
  h.stop = () => { if (!h.tw) return; h.tw.stop(); h.tw = null; obj.setScale(bx, by); };
  h.start();
  return h;
}

// Pás s kuframi: tmavé pruhy sa posúvajú v ohraničenom páse. Vráti { destroy() }.
export function belt(scene, b, cfg = fxCfg().belt) {
  if (!cfg) return { destroy() {} };
  const maskG = scene.make.graphics({ x: 0, y: 0, add: false });
  maskG.fillRect(b.x - b.w / 2, b.y - cfg.h / 2, b.w, cfg.h);
  const mask = maskG.createGeometryMask();
  const cont = scene.add.container(0, 0).setDepth(2).setMask(mask);
  for (let x = b.x - b.w / 2 - cfg.period; x < b.x + b.w / 2 + cfg.period; x += cfg.period) {
    cont.add(scene.add.rectangle(x, b.y, cfg.stripeW, cfg.h, 0x222222, cfg.alpha));
  }
  const tw = scene.tweens.add({ targets: cont, x: cfg.period, duration: cfg.ms, repeat: -1 });
  return { destroy() { tw.stop(); cont.clearMask(); cont.destroy(); mask.destroy(); maskG.destroy(); } };
}

// Špendlíky „zapichnú" zhora s odrazom; pins = [{ obj, y }] (y = cieľová poloha z dát).
export function dropPins(scene, pins, cfg = fxCfg().pins) {
  if (!cfg) return;
  pins.forEach(({ obj, y }, i) => {
    obj.setY(y - cfg.dropPx).setVisible(false);
    scene.tweens.add({ targets: obj, y, duration: cfg.ms, ease: 'Bounce.easeOut', delay: cfg.startMs + i * cfg.gapMs,
      onStart: () => obj.setVisible(true), onComplete: () => obj.setY(y) });
  });
}

// Dva jemné tiene mrakov pomaly prechádzajú cez mapu (pod špendlíkmi).
export function mapShadows(scene, depth, cfg = fxCfg().mapShadows) {
  if (!cfg) return [];
  return cfg.ys.map((y, i) => {
    const spr = addSprite(scene, (role('cloud') || [])[0], 0, y, { w: cfg.w });
    let s = spr;
    if (spr && spr.setTint) spr.setTint(0x1d3557);
    else { if (spr) spr.destroy(); s = scene.add.ellipse(0, y, cfg.w, cfg.h, 0x1d3557); }
    s.setAlpha(cfg.alpha).setDepth(depth);
    s.x = -cfg.w;
    scene.tweens.add({ targets: s, x: 1280 + cfg.w, duration: cfg.ms, repeat: -1, delay: i * cfg.phaseMs });
    return s;
  });
}
