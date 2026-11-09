// Service worker: offline-first. Všetky cesty relatívne k umiestneniu sw.js (podpriečinok na GitHub Pages).
// CACHE_VERSION zvýš pri KAŽDEJ zmene cachovaného súboru. Nový asset doplň do PRECACHE.

const CACHE_VERSION = 'v7';
const CACHE_NAME = `lietadla-${CACHE_VERSION}`;

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './vendor/phaser.min.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './src/main.js',
  './src/systems/input.js',
  './src/systems/data.js',
  './src/systems/save.js',
  './src/systems/audio.js',
  './src/systems/economy.js',
  './src/systems/sprites.js',
  './assets/sprites/plane/plane_zelene_side.png',
  './assets/sprites/plane/plane_zelene_air.png',
  './assets/sprites/plane/plane_zelene_top.png',
  './src/ui/coins.js',
  './src/scenes/airport/flow.js',
  './src/scenes/airport/shapes.js',
  './src/scenes/airport/checkin.js',
  './src/scenes/airport/bags.js',
  './src/scenes/airport/stairs.js',
  './src/scenes/airport/gate.js',
  './src/scenes/takeoff/lever.js',
  './src/scenes/flight/shapes.js',
  './src/scenes/flight/spawner.js',
  './src/ui/home.js',
  './src/scenes/Boot.js',
  './src/scenes/Preload.js',
  './src/scenes/Map.js',
  './src/scenes/Airport.js',
  './src/scenes/Takeoff.js',
  './src/scenes/Flight.js',
  './src/scenes/Landing.js',
  './src/scenes/Payout.js',
  './src/scenes/Hangar.js',
  './data/destinations.json',
  './data/planes.json',
  './data/airport.json',
  './data/flights.json',
  './data/economy.json',
  './data/voice.json',
];

// Hlasové mp3 z voice.json sa cachujú jednotlivo: chýbajúci súbor inštaláciu nezhodí.
function cacheVoice(c) {
  return c.match('./data/voice.json')
    .then((r) => r.json())
    .then((v) => Promise.allSettled(
      Object.values(v).map((x) => c.add(`./assets/audio/${x.file}`))
    ))
    .catch(() => {});
}

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((c) => c.addAll(PRECACHE).then(() => cacheVoice(c)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('lietadla-') && k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Najprv cache, pri chybe sieť. Navigácia offline → index.html.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).catch(() => {
        if (e.request.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
    })
  );
});
