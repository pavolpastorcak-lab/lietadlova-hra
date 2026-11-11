// Rad tvárí cestujúcich v lete (HUD, kreslené kódom). Náraz zosmutní najbližšiu usmiatu tvár sprava,
// po cfg.recoverSec bez nárazu sa jedna smutná znova usmeje. Usmiate tváre na konci = smajlíky do prepitného.
// Nikdy sa neodpočítavajú mince. cfg = data/flights.json → base.faces. count 0 = nič sa nevytvorí.

const DEPTH = 102;   // nad závojom, dažďom aj HUD

function drawFace(g, r, happy) {
  g.clear();
  g.fillStyle(happy ? 0xffd23f : 0xb9c6d6).fillCircle(0, 0, r);
  g.lineStyle(Math.max(2, r * 0.1), happy ? 0xc99a00 : 0x7a8797).strokeCircle(0, 0, r);
  g.fillStyle(0x333333).fillCircle(-r * 0.34, -r * 0.22, r * 0.1).fillCircle(r * 0.34, -r * 0.22, r * 0.1);
  g.lineStyle(Math.max(3, r * 0.12), 0x333333).beginPath();
  if (happy) g.arc(0, r * 0.05, r * 0.45, 0.2, Math.PI - 0.2).strokePath();
  else g.arc(0, r * 0.7, r * 0.4, Math.PI + 0.3, Math.PI * 2 - 0.3).strokePath();
}

export function createFaces(scene, count, cfg) {
  const n = Math.max(0, Math.floor(count || 0));
  if (!n || !cfg) return { sad() {}, update() {}, smiling: () => 0, total: () => 0, destroy() {} };
  // Pri viac ako maxRow sa tváre úmerne zmenšia, aby rad ostal rovnako široký.
  const k = Math.min(1, (cfg.maxRow * cfg.size + (cfg.maxRow - 1) * cfg.gap) / (n * cfg.size + (n - 1) * cfg.gap));
  const size = cfg.size * k, step = (cfg.size + cfg.gap) * k, r = size / 2;
  const x0 = cfg.x - ((n - 1) * step) / 2;
  const faces = [];
  for (let i = 0; i < n; i++) {
    const g = scene.add.graphics().setPosition(x0 + i * step, cfg.y).setDepth(DEPTH);
    faces.push({ g, happy: true });
    drawFace(g, r, true);
  }
  let calm = 0;   // s bez nárazu

  function spark(f) {
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6;
      const s = scene.add.circle(f.g.x, f.g.y, 4, 0xffffff).setDepth(DEPTH + 1);
      scene.tweens.add({ targets: s, x: f.g.x + Math.cos(a) * r * 1.3, y: f.g.y + Math.sin(a) * r * 1.3,
        alpha: 0, duration: 400, onComplete: () => s.destroy() });
    }
  }

  return {
    sad() {
      calm = 0;
      for (let i = n - 1; i >= 0; i--) {
        const f = faces[i];
        if (!f.happy) continue;
        f.happy = false;
        drawFace(f.g, r, false);
        scene.tweens.add({ targets: f.g, x: f.g.x + 6, duration: cfg.shakeMs / 8, yoyo: true, repeat: 3,
          onComplete: () => f.g.setX(x0 + i * step) });
        return;
      }
    },
    update(dt) {
      if (faces.every((f) => f.happy)) { calm = 0; return; }
      calm += dt;
      if (calm < cfg.recoverSec) return;
      calm = 0;
      const f = faces.find((q) => !q.happy);   // zľava: najskôr sa usmeje najstaršia (najvzdialenejšia od nárazu)
      f.happy = true;
      drawFace(f.g, r, true);
      spark(f);
    },
    smiling: () => faces.filter((f) => f.happy).length,
    total: () => n,
    destroy() { faces.forEach((f) => f.g.destroy()); },
  };
}
