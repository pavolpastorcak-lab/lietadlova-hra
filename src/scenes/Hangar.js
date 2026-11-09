import { createInput } from '../systems/input.js';
import * as save from '../systems/save.js';
import { addHome } from '../ui/home.js';
import { addNext } from '../ui/next.js';

// Hangár: zástupné lietadlo. Pri návrate na mapu sa uloží hra.
export default class Hangar extends Phaser.Scene {
  constructor() { super('Hangar'); }

  create() {
    this.cameras.main.setBackgroundColor('#8d6e63');
    this.add.rectangle(640, 640, 1280, 320, 0x5d4037);  // podlaha
    this.add.rectangle(640, 470, 400, 120, 0xffffff).setStrokeStyle(6, 0x2e7d32);
    const input = createInput(this);
    addHome(this, input);
    addNext(this, input, () => {
      save.save();
      this.scene.start('Map');
    });
  }
}
