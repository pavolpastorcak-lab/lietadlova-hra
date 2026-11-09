import * as data from '../systems/data.js';
import * as save from '../systems/save.js';

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
    this.scene.start('Map');
  }
}
