import * as data from '../systems/data.js';
import * as save from '../systems/save.js';
import { queuePlaneSprites, queueSprites } from '../systems/sprites.js';

// Načíta JSON dáta, overí ich a načíta save (predvolené hodnoty berie z dát).
export default class Preload extends Phaser.Scene {
  constructor() { super('Preload'); }

  preload() {
    const bar = this.add.rectangle(340, 400, 0, 40, 0xffffff).setOrigin(0, 0.5);
    this.add.rectangle(640, 400, 604, 48).setStrokeStyle(4, 0xffffff);
    this.load.on('progress', (v) => { bar.width = 600 * v; });
    data.queueLoad(this);
  }

  create() {
    data.collect(this);
    save.load({
      planes: data.get('planes'),
      flights: data.get('flights'),
      economy: data.get('economy'),
      destinations: data.get('destinations'),
    });
    // Sprity lietadiel: mená až z načítaných dát. Chýbajúci súbor hru nezhodí (záložný tvar).
    const go = () => this.scene.start('Map');
    queuePlaneSprites(this, data.get('planes'));
    queueSprites(this);
    if (!this.load.list.size) { go(); return; }
    this.load.once('complete', go);
    this.load.start();
  }
}
