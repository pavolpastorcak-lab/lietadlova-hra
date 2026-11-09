import Boot from './scenes/Boot.js';
import Preload from './scenes/Preload.js';
import MapScene from './scenes/Map.js';
import Airport from './scenes/Airport.js';
import Flight from './scenes/Flight.js';
import Landing from './scenes/Landing.js';
import Payout from './scenes/Payout.js';
import Hangar from './scenes/Hangar.js';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 800,
  backgroundColor: '#1d4f8a',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { activePointers: 1 },
  scene: [Boot, Preload, MapScene, Airport, Flight, Landing, Payout, Hangar],
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch((e) => console.warn('[sw] registrácia zlyhala', e));
}
