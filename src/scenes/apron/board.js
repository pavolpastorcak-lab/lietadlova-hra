// Logika hádanky Arrows. Čistý modul bez Phaseru (testuje sa aj bez prehliadača).
// Dielik: { x, y, dir: up|down|left|right, kind }. Odíde, ak má v smere šípky voľnú cestu po okraj mriežky.

export const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

export function createBoard(level) {
  return { cols: level.cols, rows: level.rows, pieces: level.pieces.map((p) => ({ ...p })) };
}

// Najbližší dielik v ceste šípky (alebo null, ak je cesta voľná).
export function blocker(board, piece) {
  const [dx, dy] = DIRS[piece.dir];
  let best = null, bestD = Infinity;
  board.pieces.forEach((o) => {
    if (o === piece) return;
    const d = (o.x - piece.x) * dx + (o.y - piece.y) * dy;                    // vzdialenosť po smere šípky
    const side = (o.x - piece.x) * dy + (o.y - piece.y) * dx;                  // 0 = rovnaká čiara
    if (side === 0 && d > 0 && d < bestD) { best = o; bestD = d; }
  });
  return best;
}

export const canMove = (board, piece) => blocker(board, piece) === null;

export function remove(board, piece) {
  const i = board.pieces.indexOf(piece);
  if (i >= 0) board.pieces.splice(i, 1);
}

export const isClear = (board) => board.pieces.length === 0;

export const movable = (board) => board.pieces.filter((p) => canMove(board, p));

// Pažravo: kým sa dá, odober pohyblivý dielik. Odobratie nikdy nič nezablokuje, preto je to úplný test.
export function isSolvable(level) {
  const b = createBoard(level);
  for (;;) {
    const p = movable(b)[0];
    if (!p) return isClear(b);
    remove(b, p);
  }
}

// Kontrola tvaru levelu, vráti zoznam chýb (prázdny = OK).
export function validateLevel(level) {
  const errs = [];
  if (!level || !level.id) return ['chýba "id"'];
  if (!(level.cols > 0 && level.rows > 0)) errs.push('chýba "cols"/"rows"');
  if (!Array.isArray(level.pieces) || !level.pieces.length) return [...errs, 'chýbajú "pieces"'];
  const seen = new Set();
  level.pieces.forEach((p, i) => {
    if (!DIRS[p.dir]) errs.push(`pieces[${i}]: zlé "dir"`);
    if (!Number.isInteger(p.x) || !Number.isInteger(p.y) || p.x < 0 || p.y < 0 || p.x >= level.cols || p.y >= level.rows) errs.push(`pieces[${i}]: mimo mriežky`);
    const k = `${p.x},${p.y}`;
    if (seen.has(k)) errs.push(`pieces[${i}]: dve vozidlá v jednej bunke`);
    seen.add(k);
  });
  if (!errs.length && !isSolvable(level)) errs.push('level je neriešiteľný');
  return errs;
}

// Samotest (spúšťa sa len cez ?test=1).
export function selfTest() {
  const lv = { id: 't', cols: 3, rows: 1, pieces: [{ x: 0, y: 0, dir: 'right', kind: 'car' }, { x: 2, y: 0, dir: 'up', kind: 'car' }] };
  const b = createBoard(lv);
  console.assert(!canMove(b, b.pieces[0]), 'board: vozidlo s blokom v ceste sa nesmie pohnúť');
  console.assert(blocker(b, b.pieces[0]) === b.pieces[1], 'board: blokujúce vozidlo');
  console.assert(canMove(b, b.pieces[1]), 'board: vozidlo hore ide von');
  remove(b, b.pieces[1]);
  console.assert(canMove(b, b.pieces[0]) && !isClear(b), 'board: po odobratí je cesta voľná');
  remove(b, b.pieces[0]);
  console.assert(isClear(b), 'board: prázdna plocha');
  console.assert(isSolvable(lv), 'board: riešiteľný level');
  const dead = { id: 'd', cols: 2, rows: 1, pieces: [{ x: 0, y: 0, dir: 'right', kind: 'car' }, { x: 1, y: 0, dir: 'left', kind: 'car' }] };
  console.assert(!isSolvable(dead), 'board: slepá ulička sa musí odhaliť');
  console.assert(validateLevel(dead).length === 1, 'board: validácia nahlási neriešiteľný level');
  console.assert(validateLevel({ id: 'o', cols: 1, rows: 1, pieces: [{ x: 3, y: 0, dir: 'up' }] }).length > 0, 'board: mimo mriežky');
  console.log('[board] samotest prebehol');
}
