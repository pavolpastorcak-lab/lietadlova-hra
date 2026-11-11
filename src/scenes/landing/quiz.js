// Kvíz s vlajkami po pristátí: 4 vlajky, správna na náhodnej pozícii. Čísla sú v data/economy.json → quiz.
import * as data from '../../systems/data.js';
import * as audio from '../../systems/audio.js';
import * as fx from '../../ui/fx.js';
import { confetti } from '../../ui/fx-particles.js';
import { addSprite } from '../../systems/sprites.js';
import { showCountryName } from './countryName.js';

export const quizCfg = () => (data.get('economy') || {}).quiz;

// Čisté zloženie možností: správna + (options-1) rôznych iných vlajok, zamiešané.
export function buildOptions(dest, dests, quiz, rng = Math.random) {
  const right = dest.flag;
  const pool = [];
  const add = (k) => { if (k && k !== right && !pool.includes(k)) pool.push(k); };
  (dests || []).forEach((d) => add(d.flag));
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const extra = [];
  (quiz.extraFlags || []).forEach((k) => { if (k !== right && !pool.includes(k) && !extra.includes(k)) extra.push(k); });
  const need = Math.max(1, quiz.options) - 1;
  const wrong = shuffle(pool).slice(0, need);
  if (wrong.length < need) wrong.push(...shuffle(extra).slice(0, need - wrong.length));
  return shuffle([right, ...wrong]);
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Spustí kvíz. onDone(firstTry) sa zavolá po oslave správnej odpovede.
export function startQuiz(scene, input, dest, onDone) {
  const q = quizCfg();
  const keys = buildOptions(dest, data.get('destinations'), q);
  let alive = true, ready = false, done = false, firstTry = true, idle = null;
  const items = [];
  scene.events.once('shutdown', () => { alive = false; audio.stopVoice(); if (idle) idle.remove(false); });

  const total = keys.length * q.flagW + (keys.length - 1) * q.gap;
  const h = Math.round(q.flagW * 0.75);
  const hint = () => { if (alive && !done) audio.play('quiz_flag'); };
  const armIdle = () => {
    if (idle) idle.remove(false);
    idle = scene.time.addEvent({ delay: q.idleMs, callback: () => { hint(); armIdle(); } });
  };

  keys.forEach((key, i) => {
    const x = 640 - total / 2 + q.flagW / 2 + i * (q.flagW + q.gap);
    const spr = addSprite(scene, key, x, q.y, { w: q.flagW });
    const obj = spr || scene.add.rectangle(x, q.y, q.flagW, h, 0x999999).setStrokeStyle(8, 0xffffff);
    obj.setVisible(false);
    const it = { key, obj, spr, off: false, base: obj.scale };
    items.push(it);
    input.onTapIn(input.hitZone(x, q.y, q.flagW + 20, h + 20), () => tap(it));
  });

  function tap(it) {
    if (!ready || done || it.off) return;
    armIdle();
    if (it.key !== dest.flag) {
      firstTry = false;
      it.off = true;
      scene.tweens.killTweensOf(it.obj);
      const bx = it.obj.x;
      scene.tweens.add({ targets: it.obj, x: bx + 12, duration: 60, yoyo: true, repeat: 3, onComplete: () => it.obj.setX(bx) });
      if (it.spr) it.spr.setTint(0x888888); else it.obj.setAlpha(0.4);
      return;
    }
    done = true;
    if (idle) idle.remove(false);
    items.forEach((o) => { if (o !== it) scene.tweens.add({ targets: o.obj, alpha: 0, duration: 300 }); });
    scene.tweens.add({ targets: it.obj, x: 640, y: q.y - 20, scale: it.base * 1.5, duration: 400, ease: 'Back.out' });
    const gap = ((data.get('airport').landing || {}).countryText || {}).gap || 24;
    showCountryName(scene, dest, 640, q.y - 20 + (it.obj.displayHeight / it.obj.scale) * it.base * 1.5 / 2 + gap);
    fx.sparks(scene, 640, q.y - 20);
    confetti(scene, 640, q.y - 20);
    audio.play('sfx_star');
    scene.time.delayedCall(q.doneMs, () => { if (alive) onDone(firstTry); });
  }

  (async () => {
    const capped = (p) => Promise.race([p, wait(q.maxWaitMs)]);
    await capped(audio.play(`land_${dest.id}`));
    if (!alive) return;
    await wait(q.gapMs);
    if (!alive) return;
    items.forEach((it) => {
      it.obj.setVisible(true);
      fx.press(scene, it.obj);
    });
    ready = true;
    armIdle();
    await capped(audio.play('quiz_flag'));
  })();
}
