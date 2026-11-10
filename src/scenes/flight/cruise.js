import * as audio from '../../systems/audio.js';
import * as data from '../../systems/data.js';

// Motory počas letu: výška tónu sleduje vodorovnú rýchlosť lietadla (doprava vyššie, doľava nižšie,
// stojí = 1). Rýchlosť je obmedzená a vyhladená, takže tón nikdy neskáče (ani pri dt = 0).
export function createCruise(scene) {
  const c = data.cruiseCfg();
  const lp = audio.loop('sfx_cruise');
  let prevX = null, vx = 0;
  const stop = () => lp.stop();
  scene.events.once('shutdown', stop);
  return {
    update(x, deltaMs) {
      if (prevX === null) { prevX = x; return; }
      if (!(deltaMs > 0.5)) return;                       // dt = 0 alebo záporné: nič nerátaj
      const raw = Phaser.Math.Clamp((x - prevX) / (deltaMs / 1000), -c.vxForMax, c.vxForMax);
      prevX = x;
      vx += (raw - vx) * (1 - Math.exp(-deltaMs / c.smoothMs));
      const k = vx / c.vxForMax;                          // -1 .. 1
      lp.setRate(1 + (k >= 0 ? k * (c.rateMax - 1) : k * (1 - c.rateMin)));
    },
    stop,
  };
}
