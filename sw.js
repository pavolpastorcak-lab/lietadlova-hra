// Service worker: offline-first. Všetky cesty relatívne k umiestneniu sw.js (podpriečinok na GitHub Pages).
// CACHE_VERSION zvýš pri KAŽDEJ zmene cachovaného súboru. Nový asset doplň do PRECACHE.

const CACHE_VERSION = 'v22';
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
  // Sprity z data/sprites.json, airport.json a destinations.json (generované z dát, pri novom spriteovi doplň):
  './assets/sprites/bag/bag_maly_cerveny.png',
  './assets/sprites/bag/bag_maly_fialovy.png',
  './assets/sprites/bag/bag_maly_modry.png',
  './assets/sprites/bag/bag_maly_zeleny.png',
  './assets/sprites/bag/bag_maly_zlty.png',
  './assets/sprites/bag/bag_stredny_cerveny.png',
  './assets/sprites/bag/bag_stredny_fialovy.png',
  './assets/sprites/bag/bag_stredny_modry.png',
  './assets/sprites/bag/bag_stredny_zeleny.png',
  './assets/sprites/bag/bag_stredny_zlty.png',
  './assets/sprites/bag/bag_velky_cerveny.png',
  './assets/sprites/bag/bag_velky_fialovy.png',
  './assets/sprites/bag/bag_velky_modry.png',
  './assets/sprites/bag/bag_velky_zeleny.png',
  './assets/sprites/bag/bag_velky_zlty.png',
  './assets/sprites/bg/bg_letisko_den.png',
  './assets/sprites/bg/bg_pristatie_den.png',
  './assets/sprites/bld/bld_checkin.png',
  './assets/sprites/bld/bld_gate_otvorena.png',
  './assets/sprites/bld/bld_gate_zatvorena.png',
  './assets/sprites/bld/bld_hangar.png',
  './assets/sprites/bld/bld_letisko_terminal.png',
  './assets/sprites/bld/bld_pas.png',
  './assets/sprites/bld/bld_schody.png',
  './assets/sprites/bld/bld_skener.png',
  './assets/sprites/bld/bld_veza.png',
  './assets/sprites/env/env_palma.png',
  './assets/sprites/env/env_skyline_domy.png',
  './assets/sprites/env/env_skyline_historicke.png',
  './assets/sprites/env/env_skyline_mrakodrapy.png',
  './assets/sprites/env/env_strom_ihlicnaty.png',
  './assets/sprites/env/env_strom_listnaty.png',
  './assets/sprites/env/env_svetlo_drahy_vyp.png',
  './assets/sprites/env/env_svetlo_drahy_zap.png',
  './assets/sprites/flag/flag_de.png',
  './assets/sprites/flag/flag_es.png',
  './assets/sprites/flag/flag_fr.png',
  './assets/sprites/flag/flag_gb.png',
  './assets/sprites/flag/flag_ie.png',
  './assets/sprites/flag/flag_it.png',
  './assets/sprites/flag/flag_pt.png',
  './assets/sprites/flag/flag_sk.png',
  './assets/sprites/item/item_flasa.png',
  './assets/sprites/item/item_kniha.png',
  './assets/sprites/item/item_macko.png',
  './assets/sprites/item/item_noznice.png',
  './assets/sprites/item/item_sedadlo.png',
  './assets/sprites/item/item_tricko.png',
  './assets/sprites/item/item_nadrz.png',
  './assets/sprites/map/map_01_europa.jpg',
  './assets/sprites/obs/obs_hviezda.png',
  './assets/sprites/obs/obs_oblak_biely_01.png',
  './assets/sprites/obs/obs_oblak_biely_02.png',
  './assets/sprites/obs/obs_oblak_tmavy_01.png',
  './assets/sprites/obs/obs_vtak_a.png',
  './assets/sprites/obs/obs_vtak_b.png',
  './assets/sprites/person/person_dieta_01.png',
  './assets/sprites/person/person_dieta_02.png',
  './assets/sprites/person/person_dieta_03.png',
  './assets/sprites/person/person_muz_01.png',
  './assets/sprites/person/person_muz_02.png',
  './assets/sprites/person/person_muz_03.png',
  './assets/sprites/person/person_zena_01.png',
  './assets/sprites/person/person_zena_02.png',
  './assets/sprites/person/person_zena_03.png',
  './assets/sprites/ui/ui_domov.png',
  './assets/sprites/ui/ui_hviezda.png',
  './assets/sprites/ui/ui_kos.png',
  './assets/sprites/ui/ui_letenka.png',
  './assets/sprites/ui/ui_paka_gombik.png',
  './assets/sprites/ui/ui_paka_podstavec.png',
  './assets/sprites/ui/ui_minca.png',
  './assets/sprites/ui/ui_pin.png',
  './assets/sprites/ui/ui_smajlik.png',
  './src/scenes/touchdown/scenery.js',
  './src/ui/coins.js',
  './src/scenes/airport/flow.js',
  './src/scenes/airport/shapes.js',
  './src/scenes/airport/checkin.js',
  './src/scenes/airport/bags.js',
  './src/scenes/airport/stairs.js',
  './src/scenes/airport/gate.js',
  './src/scenes/airport/security.js',
  './src/scenes/takeoff/lever.js',
  './src/scenes/touchdown/stands.js',
  './src/scenes/flight/cruise.js',
  './src/scenes/flight/shapes.js',
  './src/scenes/flight/spawner.js',
  './src/ui/fx.js',
  './src/ui/fx-particles.js',
  './src/ui/haze.js',
  './src/ui/home.js',
  './src/scenes/Boot.js',
  './src/scenes/Preload.js',
  './src/scenes/Map.js',
  './src/scenes/Airport.js',
  './src/scenes/Takeoff.js',
  './src/scenes/Flight.js',
  './src/scenes/Touchdown.js',
  './src/scenes/Landing.js',
  './src/scenes/Payout.js',
  './src/scenes/Hangar.js',
  './src/scenes/hangar/upgradePanel.js',
  './data/destinations.json',
  './data/planes.json',
  './data/airport.json',
  './data/flights.json',
  './data/economy.json',
  './data/voice.json',
  './data/sprites.json',
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
