// Service worker: offline-first. Všetky cesty relatívne k umiestneniu sw.js (podpriečinok na GitHub Pages).
// CACHE_VERSION zvýš pri KAŽDEJ zmene cachovaného súboru. Nový asset doplň do PRECACHE.

const CACHE_VERSION = 'v1';
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
  './src/ui/home.js',
  './src/ui/next.js',
  './src/scenes/Boot.js',
  './src/scenes/Preload.js',
  './src/scenes/Map.js',
  './src/scenes/Airport.js',
  './src/scenes/Flight.js',
  './src/scenes/Landing.js',
  './src/scenes/Hangar.js',
  './data/destinations.json',
  './data/planes.json',
  './data/airport.json',
  './data/flights.json',
  './data/economy.json',
  './data/voice.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((c) => c.addAll(PRECACHE))
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
