import { createInput } from '../systems/input.js';
import * as data from '../systems/data.js';
import * as audio from '../systems/audio.js';
import { addHome } from '../ui/home.js';
import * as fx from '../ui/fx.js';
import { confetti } from '../ui/fx-particles.js';
import { addSprite, role } from '../systems/sprites.js';
import { createBoard, canMove, blocker, remove, isClear, movable, DIRS } from './apron/board.js';
import { makeVehicle } from './apron/shapes.js';

const ANGLE = { right: 0, down: 90, left: 180, up: 270 };

// Hádanka Arrows (pohľad zhora): ťuk na vozidlo = odíde v smere šípky, ak má voľnú cestu po okraj.
// Dáta { level, next, args }: po vyčistení fx.go(next, args), bez next späť na mapu.
export default class Apron extends Phaser.Scene {
  constructor() { super('Apron'); }

  create(init) {
    const cfg = data.get('airport').apron;
    const { next, args } = init || {};
    const level = data.puzzle(init && init.level);
    this.board = createBoard(level);
    this.next = next || 'Map';
    this.args = args;
    this.done = false;
    this.mistakes = 0;
    this.cameras.main.setBackgroundColor('#6b7378');
    const bg = addSprite(this, role('bgApronTop'), 640, 400, { w: 1280 });
    if (bg) bg.setDepth(-10);

    // Mriežka: bunka z levelu/dát, zmenší sa, ak by zasahovala pod ikonu domov.
    let cell = level.cell || cfg.cell;
    const rectFor = (c) => {
      const w = level.cols * c, h = level.rows * c;
      return { w, h, left: (1280 - w) / 2, top: (800 - h) / 2 + cfg.offsetY };
    };
    let g = rectFor(cell);
    while (cell > 100 && g.left < cfg.homeZone && g.top < cfg.homeZone) { cell -= 10; g = rectFor(cell); }
    this.cell = cell;
    this.grid = g;
    this.drawGrid();

    this.views = new Map();
    this.board.pieces.forEach((p) => {
      const v = makeVehicle(this, p, cell, cfg.vehicle, ANGLE[p.dir]);
      v.setPosition(this.cx(p.x), this.cy(p.y)).setDepth(10 + p.y);
      this.views.set(p, v);
    });

    this.input_ = createInput(this);
    addHome(this, this.input_);
    this.input_.on('tap', (pt) => this.onTap(pt));
    this.lastAct = this.time.now;
    this.time.addEvent({ delay: 500, loop: true, callback: () => this.idleCheck(cfg) });
    audio.init(data.get('voice'));
    audio.play('st_apron');
    this.cfg = cfg;
  }

  cx(x) { return this.grid.left + (x + 0.5) * this.cell; }
  cy(y) { return this.grid.top + (y + 0.5) * this.cell; }

  drawGrid() {
    const { left, top, w, h } = this.grid;
    const gr = this.add.graphics().setDepth(-5);
    gr.fillStyle(0x4a5257, 0.55).fillRoundedRect(left - 12, top - 12, w + 24, h + 24, 20);
    gr.lineStyle(4, 0xffffff, 0.45);
    for (let i = 0; i <= this.board.cols; i++) gr.lineBetween(left + i * this.cell, top, left + i * this.cell, top + h);
    for (let j = 0; j <= this.board.rows; j++) gr.lineBetween(left, top + j * this.cell, left + w, top + j * this.cell);
  }

  pieceAt(pt) {
    const x = Math.floor((pt.x - this.grid.left) / this.cell), y = Math.floor((pt.y - this.grid.top) / this.cell);
    return this.board.pieces.find((p) => p.x === x && p.y === y);
  }

  onTap(pt) {
    if (this.done) return;
    const p = this.pieceAt(pt);
    if (!p) return;
    this.lastAct = this.time.now;
    const v = this.views.get(p);
    if (canMove(this.board, p)) this.leave(p, v);
    else this.blocked(p, v);
  }

  // Logika sa mení hneď, animácia je len vizuálna (dá sa ťuknúť na ďalšie vozidlo).
  leave(p, v) {
    remove(this.board, p);
    this.views.delete(p);
    const [dx, dy] = DIRS[p.dir];
    v.setDepth(50);
    this.tweens.add({ targets: v, x: v.x + dx * 1500, y: v.y + dy * 1500, duration: this.cfg.exitMs * 2.2, ease: 'Quad.in',
      onComplete: () => v.destroy() });
    if (isClear(this.board)) this.finish();
  }

  blocked(p, v) {
    this.mistakes++;
    this.tweens.add({ targets: v, x: v.x + 12, duration: 60, yoyo: true, repeat: 3, onComplete: () => v.setX(this.cx(p.x)) });
    const b = blocker(this.board, p), bv = b && this.views.get(b);
    if (bv && !bv.__blink) {
      bv.__blink = true;
      this.tweens.add({ targets: bv, alpha: 0.35, duration: 120, yoyo: true, repeat: 2, onComplete: () => { bv.alpha = 1; bv.__blink = false; } });
    }
  }

  idleCheck(cfg) {
    if (this.done || this.time.now - this.lastAct < cfg.idleHintSec * 1000) return;
    this.lastAct = this.time.now;
    const p = movable(this.board)[0], v = p && this.views.get(p);
    if (v) this.tweens.add({ targets: v, scale: 1.18, duration: 260, yoyo: true, repeat: 2 });
    audio.play('st_apron');
  }

  finish() {
    this.done = true;
    confetti(this, 640, 400);
    this.time.delayedCall(this.cfg.doneMs, () => fx.go(this, this.next, this.args));
  }
}
