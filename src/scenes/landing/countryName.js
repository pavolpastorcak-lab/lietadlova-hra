// Názov krajiny pod vlajkou: "Finland / Suomi" (rovnaké názvy sa ukážu raz). Štýl v data/airport.json → landing.countryText.
import * as data from '../../systems/data.js';

export function countryLabel(dest) {
  const n = dest && dest.countryName;
  if (!n) return '';
  return n.intl === n.local ? n.intl : `${n.intl} / ${n.local}`;
}

// Vykreslí text so stredom v x a vrchom v y, jemne ho zobrazí (fade). Vráti text alebo null.
export function showCountryName(scene, dest, x, y) {
  const cfg = (data.get('airport') || {}).landing;
  const c = cfg && cfg.countryText;
  const label = countryLabel(dest);
  if (!c || !label) return null;
  const t = scene.add.text(x, y, label, {
    fontFamily: 'Arial, sans-serif', fontSize: `${c.size}px`, fontStyle: 'bold', color: c.color,
    stroke: c.stroke, strokeThickness: c.strokeW,
  }).setOrigin(0.5, 0).setDepth(50).setAlpha(0);
  if (t.width > c.maxW) t.setScale(c.maxW / t.width);
  scene.tweens.add({ targets: t, alpha: 1, duration: c.fadeMs });
  return t;
}

// Výška vlajky v sprite aj záložnom tvare nie je istá, preto sa y počíta z ozajstnej zobrazenej výšky.
export function belowY(obj, gap) {
  return obj.y + obj.displayHeight / 2 + gap;
}
