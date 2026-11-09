// Prvá scéna: základné nastavenie a prechod na Preload.
export default class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    this.scene.start('Preload');
  }
}
