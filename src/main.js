import Boot from './scenes/Boot.js';
import Preload from './scenes/Preload.js';
import MapScene from './scenes/Map.js';
import Airport from './scenes/Airport.js';
import Takeoff from './scenes/Takeoff.js';
import Flight from './scenes/Flight.js';
import Touchdown from './scenes/Touchdown.js';
import Landing from './scenes/Landing.js';
import Payout from './scenes/Payout.js';
import Hangar from './scenes/Hangar.js';
import Apron from './scenes/Apron.js';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 1280,
  height: 800,
  backgroundColor: '#1d4f8a',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { activePointers: 1 },
  scene: [Boot, Preload, MapScene, Airport, Takeoff, Flight, Touchdown, Landing, Payout, Hangar, Apron],
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch((e) => console.warn('[sw] registrácia zlyhala', e));
}

// Samotest logiky hádanky len na požiadanie (?test=1), v bežnej hre sa nenačíta.
if (new URLSearchParams(location.search).get('test') === '1') {
  import('./scenes/apron/board.js').then((m) => m.selfTest());
}
