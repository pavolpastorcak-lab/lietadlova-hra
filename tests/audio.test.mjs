// Node test audio.js s mockom AudioContext a fetch: node tests/audio.test.mjs
import assert from 'node:assert/strict';

let state = 'running', ctxCount = 0, resumeMode = 'ok', fetchFail = {}, fetchCalls = {};
class Src { constructor() { this.playbackRate = {}; } connect() {} addEventListener(e, f) { if (e === 'ended') this.end = f; }
  start() { started.push(this); } stop() { this.stopped = true; this.end && this.end(); } }
let last = null, started = [];
class Ctx {
  constructor() { last = this; ctxCount += 1; this.destination = {}; this.id = ctxCount; this.state = state; }
  resume() { if (resumeMode === 'ok') { this.state = 'running'; return Promise.resolve(); } return new Promise(() => {}); }
  close() { this.state = 'closed'; }
  decodeAudioData(b) { return Promise.resolve({ b }); }
  createBufferSource() { return new Src(); }
  createGain() { return { gain: {}, connect() {}, disconnect() {} }; }
}
globalThis.window = { AudioContext: Ctx, addEventListener() {} };
globalThis.fetch = (url) => {
  fetchCalls[url] = (fetchCalls[url] || 0) + 1;
  if (fetchFail[url] > 0) { fetchFail[url] -= 1; return Promise.reject(new Error('sieť')); }
  return Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(4)) });
};
const audio = await import('../src/systems/audio.js');
const voice = { sfx_a: { file: 'a.mp3' }, loop_x: { file: 'x.mp3' } };
for (let i = 0; i < 60; i++) voice['v' + i] = { file: `v${i}.mp3` };
audio.init(voice);
const u = (f) => `./assets/audio/${f}`;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// 1) zlyhanie 2x (aj retry) sa nekešuje, ďalší play skúsi znova a uspeje
fetchFail[u('v0.mp3')] = 2;
assert.equal(await audio.has('v0'), false);
assert.equal(fetchCalls[u('v0.mp3')], 2);
assert.equal(await audio.has('v0'), true);
assert.equal(fetchCalls[u('v0.mp3')], 3);
// 1b) jedno zlyhanie: interný retry to zachráni
fetchFail[u('v1.mp3')] = 1;
assert.equal(await audio.has('v1'), true);

// 2) LRU: max MAX_VOICES hlasov, sfx ostane
await audio.has('sfx_a');
for (let i = 2; i < 60; i++) await audio.has('v' + i);
const keys = audio.cachedKeys();
assert.equal(keys.filter((k) => !k.startsWith('sfx_')).length, audio.MAX_VOICES);
assert.ok(keys.includes('sfx_a'));
assert.ok(!keys.includes('v0') && keys.includes('v59'));
// vyhodený hlas sa dá znova načítať
assert.equal(await audio.has('v0'), true);

// 3) slučka drží buffer, kým hrá (aj nie-sfx kľúč)
const lp = audio.loop('loop_x'); await wait(20);
assert.equal(audio.activeLoops(), 1);
for (let i = 1; i < 60; i++) await audio.has('v' + i);
assert.ok(audio.cachedKeys().includes('loop_x'));
lp.stop(); assert.equal(audio.activeLoops(), 0);

// 4) suspended: play počká na resume a potom zahrá
last.state = 'suspended'; resumeMode = 'ok'; started = [];
audio.play('v5'); await wait(30);
assert.equal(started.length, 1); assert.equal(last.state, 'running');
// interrupted sa berie ako suspended
last.state = 'interrupted'; started = [];
audio.play('v6'); await wait(30);
assert.equal(started.length, 1); assert.equal(last.state, 'running');

// 5) resume sa nesplní: po limite aj tak zahrá (a po 2 zlyhaniach vznikne nový kontext, cache sa vyčistí)
resumeMode = 'never'; const c1 = last; c1.state = 'suspended'; started = [];
const n0 = ctxCount;
audio.play('v7'); await wait(600);
assert.equal(started.length, 1); assert.equal(ctxCount, n0);          // 1. zlyhanie: hrá, kontext ostal
audio.play('v8'); await wait(600);
assert.equal(c1.state, 'closed'); assert.equal(ctxCount, n0 + 1);      // 2. zlyhanie: nový kontext
assert.deepEqual(audio.cachedKeys().filter((k) => k !== 'v8'), []);    // cache vyčistená
// 6) closed kontext sa nahradí novým a hlas zahrá
resumeMode = 'ok'; last.state = 'closed'; started = [];
audio.play('v9'); await wait(40);
assert.equal(started.length, 1); assert.equal(ctxCount, n0 + 2);
// 7) starší hlas po novšom nezačne (seq guard) a stopVoice zruší načítavaný hlas
started = []; audio.play('v10'); audio.play('v11'); await wait(40);
assert.equal(started.length, 1);
started = []; audio.play('v12'); audio.stopVoice(); await wait(40);
assert.equal(started.length, 0);
console.log('OK: audio.test.mjs');
process.exit(0);
