import * as routes from '../systems/routes.js';
import { fxCfg } from './fx.js';

// Čas dňa letu (R2d): day | dusk | night podľa vzdialenosti (flights.json → byKm[].time).
// Farby, hviezdy, okná a svetielko sú v sprites.json → fx.time. `day` nevytvorí nič (vzhľad ako predtým).
// Hviezdy a okná sú vždy jeden Graphics, všetko sa uprace pri shutdown scény.
const NOOP = { setK() {}, update() {}, destroy() {} };
const WHITE = 0xffffff;
const cfg = () => fxCfg().time || {};
const num = (v) => (typeof v === 'string' ? Number(v) : v);

export function timeOf(from, to) { return (routes.flight(from, to).time) || 'day'; }
export function startTime(t) { return t === 'night' ? 'dusk' : 'day'; }

function lerpColor(a, b, k) {
  const A = Phaser.Display.Color.IntegerToColor(a), B = Phaser.Display.Color.IntegerToColor(b);
  const c = Phaser.Display.Color.Interpolate.ColorWithColor(A, B, 100, Math.round(Phaser.Math.Clamp(k, 0, 1) * 100));
  return Phaser.Display.Color.GetColor(c.r, c.g, c.b);
}
const lum = (c) => ((c >> 16) & 255) + ((c >> 8) & 255) + (c & 255);
const skyInt = (t) => Phaser.Display.Color.HexStringToColor((cfg()[t] || cfg().day).sky).color;

// Farba pozadia kamery pre daný čas ('#rrggbb').
export function skyHex(t) { return (cfg()[t] || cfg().day || {}).sky || '#87ceeb'; }

// Farba po prekrytí závojom času (pre kódom kreslené prvky, napr. čiary na dráhe).
export function dim(color, t, reduce = 0) {
  const c = cfg()[t];
  if (!c || !c.veil) return color;
  return lerpColor(color, num(c.veil), Math.max(0, c.veilAlpha - reduce));
}

// Závoj nad celou obrazovkou (Landing).
export function addScreenVeil(scene, t, depth = 1) {
  const c = cfg()[t];
  if (!c || !c.veil) return null;
  return scene.add.rectangle(640, 400, 1280, 800, num(c.veil), c.veilAlpha).setDepth(depth);
}

// Závoj len na zem a dráhu (vnútri kontajnera `world`); `reduce` = alfa inej vrstvy (dážď), ktorú neprikrývame dvakrát.
export function addGroundVeil(scene, world, t, rect, reduce = 0) {
  const c = cfg()[t];
  if (!c || !c.veil) return null;
  const r = scene.add.rectangle(rect.x, rect.y, rect.w, rect.h, num(c.veil), Math.max(0, c.veilAlpha - reduce));
  world.add(r);
  return r;
}

// Sprity kulís stmavnú / zahrejú (tint času). Vráti tint alebo null.
export function tintFor(t) { const c = cfg()[t]; return c && c.tint ? num(c.tint) : null; }

// Obloha letu: pozadie, závoj (depth veilDepth), hviezdy (jeden Graphics, depth starsDepth, nad závojom, pod ďalekými mrakmi),
// tint ďalekých mrakov. t0 → t1 podľa k (0..1). Búrka (stormT, stormAlpha) sa nesčítava so závojom noci: platí tmavší.
// o = { t0, t1, k, veil (bool), noStars (bool), starsY: [min, max], starsDepth (Touchdown: pod svetom), far, storm: { alpha, farTint } }
export function createSky(scene, o) {
  const C = cfg();
  if (!C.day || (o.t0 === 'day' && o.t1 === 'day')) return NOOP;
  const a = C[o.t0] || C.day, b = C[o.t1] || C.day;
  const vc0 = num(a.veil ?? b.veil ?? 0), vc1 = num(b.veil ?? a.veil ?? 0);
  const veil = o.veil === false ? null : scene.add.rectangle(640, 400, 1280, 800, vc1, 0).setDepth(C.veilDepth ?? 1);
  const S = C.stars, withStars = !!S && o.t1 === 'night' && !o.noStars;
  const g = withStars ? scene.add.graphics().setDepth(o.starsDepth ?? C.starsDepth ?? 1.5) : null;
  const [y0, y1] = o.starsY || [20, 780];
  const stars = withStars ? Array.from({ length: S.count }, () => ({
    x: Math.random() * 1280, y: y0 + Math.random() * (y1 - y0),
    r: (S.size[0] + Math.random() * (S.size[1] - S.size[0])) / 2,
    ph: Math.random() * 6.28, sp: 6.28 / (S.twinkleSec[0] + Math.random() * (S.twinkleSec[1] - S.twinkleSec[0])),
  })) : [];
  let k = o.k ?? 0, storm = 0, acc = 1e9, time = 0, dead = false;

  const self = {
    setK(nk, stormT = 0) { k = nk; storm = stormT; self.apply(); },
    apply() {
      if (dead) return;
      scene.cameras.main.setBackgroundColor(lerpColor(skyInt(o.t0), skyInt(o.t1), k));
      if (veil) {
        const stormA = o.storm ? o.storm.alpha * storm : 0;
        veil.setFillStyle(lerpColor(vc0, vc1, k), Math.max(0, Phaser.Math.Linear(a.veilAlpha || 0, b.veilAlpha || 0, k) - stormA));
      }
      if (o.far && o.t1 !== 'day') {
        let col = lerpColor(WHITE, num(b.far ?? WHITE), k);
        if (o.storm && storm > 0) {
          const sc = lerpColor(WHITE, num(o.storm.farTint), storm);
          if (lum(sc) < lum(col)) col = sc;                   // tmavší z noci a búrky, nie súčet
        }
        o.far.tint(1, col);
      }
    },
    update(dt) {
      if (dead || !g) return;
      time += dt; acc += dt * 1000;
      if (acc < S.redrawMs) return;
      acc = 0;
      const sf = (o.t0 === 'night' ? 1 : k);
      g.clear();
      if (sf <= 0.01) return;
      const col = num(S.color);
      stars.forEach((s) => {
        g.fillStyle(col, S.alpha * sf * (0.65 + 0.35 * Math.sin(time * s.sp + s.ph)));
        g.fillCircle(s.x, s.y, s.r);
      });
    },
    destroy() { dead = true; if (veil) veil.destroy(); if (g) g.destroy(); },
  };
  scene.events.once('shutdown', () => self.destroy());
  self.apply();
  return self;
}

// Bod (u, v) v textúre je „stena“: celé okno sa vojde na nepriehľadné pixely, nie na obrys (tmavé) ani červenú strechu.
function solidWall(scene, key, u, v, W) {
  const px = (x, y) => scene.textures.getPixel(Math.floor(x), Math.floor(y), key);
  const c = px(u, v);
  if (!c) return true;
  if (c.alpha < 200 || c.r + c.g + c.b < 150 || c.r > 1.6 * Math.max(c.g, c.b) + 20) return false;   // obrys, strecha
  const hw = W.w / 2, hh = W.h / 2;
  return [[-hw, -hh], [hw, -hh], [-hw, hh], [hw, hh]].every(([dx, dy]) => { const q = px(u + dx, v + dy); return !q || q.alpha >= 200; });
}

// Malé teplé okná v hornej časti skyline (jeden Graphics v `world`). Polohy sú podľa mesta (seed), len na nepriehľadných
// pixeloch dlaždice. `tiles` = sprity skyline (rovnaká textúra). Vráti { draw(), g } alebo null; draw() po posune dlaždíc.
export function addWindows(scene, world, tiles, seedKey) {
  const W = cfg().windows, t0 = tiles && tiles[0];
  if (!W || !t0) return null;
  const key = t0.texture.key, fw = t0.width, fh = t0.height;
  let seed = 7;
  for (const ch of String(seedKey)) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const spots = [];
  for (let i = 0, tries = 0; i < W.perTile && tries < W.tries; tries++) {
    const u = rnd() * fw, v = (W.top + rnd() * (W.bottom - W.top)) * fh;
    if (solidWall(scene, key, u, v, W)) { spots.push({ u, v }); i++; }
  }
  const g = scene.add.graphics();
  world.add(g);
  const col = num(W.color);
  const self = {
    g,
    draw() {
      g.clear().fillStyle(col, W.alpha);
      tiles.forEach((t) => {
        if (t.x < -400 || t.x > 1700) return;
        const s = t.scaleX, left = t.x - fw * s / 2, top = t.y - fh * s;
        spots.forEach((p) => g.fillRect(left + p.u * s - W.w / 2, top + p.v * s - W.h / 2, W.w, W.h));
      });
    },
  };
  self.draw();
  return self;
}

// Blikajúce červené svetielko na špičke krídla (len v noci). `container` = kontajner lietadla.
export function wingLight(scene, container, t) {
  const W = cfg().wing;
  if (!W || t !== 'night') return null;
  const c = scene.add.circle(W.x, W.y, W.radius, num(W.color));
  container.add(c);
  scene.tweens.add({ targets: c, alpha: 0.15, duration: W.blinkMs, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  return c;
}
