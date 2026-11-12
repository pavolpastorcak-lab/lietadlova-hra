// Ladiaci log zvuku len s ?debug=audio v adrese (nie pre syna). Malý polopriehľadný text vpravo dole
// nad nádržou, posledných 8 udalostí: čas, kľúč, ok / chýba / CHYBA, stav AudioContextu.
import * as audio from '../systems/audio.js';

const MAX = 8;

export function enable() {
  const lines = [];
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;right:6px;bottom:96px;z-index:99999;max-width:46vw;padding:4px 6px;'
    + 'background:rgba(0,0,0,.45);color:#fff;font:11px/1.3 monospace;pointer-events:none;white-space:pre-wrap;'
    + 'word-break:break-all;border-radius:4px';
  document.body.appendChild(el);
  audio.onLog((msg, state) => {
    const t = new Date().toTimeString().slice(3, 8);
    lines.push(`${t} ${msg} [${state}]`);
    if (lines.length > MAX) lines.shift();
    el.textContent = lines.join('\n');
  });
}
