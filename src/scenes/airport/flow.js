import * as audio from '../../systems/audio.js';

// Spúšťa stanice po poradí podľa airport.json. Naraz svieti (pulzuje) len aktuálna.
// Každý runner: (ctx, done) a eventy registruje cez ctx.on (flow ich po dokončení odpojí).
export function runFlow(ctx, stations, runners, onDone) {
  const subs = [];
  ctx.on = (ev, fn) => { ctx.input.on(ev, fn); subs.push([ev, fn]); };
  const clear = () => { subs.forEach(([ev, fn]) => ctx.input.off(ev, fn)); subs.length = 0; };

  Object.values(ctx.buildings).forEach((b) => b.setAlpha(0.35));

  let i = 0;
  const next = () => {
    if (i >= stations.length) { onDone(); return; }
    const st = stations[i++];
    const b = ctx.buildings[st.id];
    b.setAlpha(1);
    const br = ctx.breath && ctx.breath.obj === b ? ctx.breath : null;   // dýchanie nesmie bojovať s pulzom
    if (br) br.stop();
    const bx = b.scaleX, by = b.scaleY;     // pôvodná mierka (sprity majú vlastnú)
    const pulse = ctx.scene.tweens.add({
      targets: b, scaleX: bx * 1.04, scaleY: by * 1.04, duration: 500, yoyo: true, repeat: -1,
    });
    ctx.station = st;
    audio.play(st.voice);
    runners[st.id](ctx, () => {
      clear();
      pulse.stop();
      b.setScale(bx, by);
      if (br) br.start();
      next();
    });
  };
  next();
}
