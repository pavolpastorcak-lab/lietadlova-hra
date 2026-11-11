# ARCHITECTURE: mapa projektu

Pokojná 2D hra o lietadlách pre 6-ročného. Offline-first PWA pre Samsung tablet (Chrome, dotyk).
Herné pravidlá a UX rozhodnutia: `docs/design-notes.md`. Stav a roadmapa: `docs/PROGRESS.md`.

## 1. Rozsah v1 (vertikálny rez)
Jedna kompletná slučka, 2 destinácie, 1 lietadlo, 1 upgrade.

1. **Mapa (zhora):** 2 špendlíky s vlajkami, Bratislava ☀️ a Londýn 🌧️. Ťuk na cieľ.
2. **Letisko (zboku):** stanice idú po poradí podľa `data/airport.json` (naraz pulzuje len aktuálna): check-in (ťuk na cestujúceho → letenka) → batožina (ťahaj kufor na pás → smajlík) → boarding (ťahaj nástupné schody k lietadlu) → gate (ťuk, brána sa otvorí a cestujúci nastúpia sami). Potom **vzlet** (scéna `Takeoff`, `scenes/takeoff/lever.js`): syn ťahá páku plynu nahor, pri plnom výkone lietadlo vzlietne. Parametre v `airport.json` → `takeoff`. Do Flight ide `{ to, passengers, smiles }`.
3. **Let (zboku):** lietadlo plynulo sleduje prst (X aj Y, čísla v `airport.flight`), vyhýba sa mrakom a vtákom, zbiera hviezdičky.
4. **Pristátie:** počasie v cieli + hlas („V Londýne prší"), vlajka krajiny.
5. **Výplata:** základ + prepitné (hviezdičky, smajlíky). Pozri design-notes.
6. **Hangár:** 1 upgrade (kapacita +2), platí sa len mincami.

### Roadmapa
- **v1.1** upgrade doletu + nové destinácie
- **v1.2** bezpečnostná kontrola na letisku
- **v1.3** hádanka v štýle Arrows (ťukaním uvoľniť stojisko / dráhu)
- **v1.4** kvíz s vlajkami
- **v1.5** počasie počas letu (vietor, dážď)
- **v1.6** ďalšie lietadlá
- **v1.7** budovanie letiska (štýl Township)

### Rozdelenie úlohy 2 (každá = samostatná session)
- **2a** kostra so zástupnou grafikou: scény, načítanie dát, save, PWA
- **2b** stanice letiska
- **2c** let
- **2d** hangár a ekonomika

## 2. Technológia
- **Phaser 3.90** (posledná v3), lokálne vo `vendor/phaser.min.js`, žiadne CDN.
- **Čisté ES moduly, bez build kroku.** Dôvody: nič netreba kompilovať, súbory, ktoré servujeme, sú presne tie, ktoré editujeme, service worker cachuje priamo zdrojáky, Paľo spustí hru akýmkoľvek statickým serverom.
- **Rozlíšenie** 1280×800 (16:10), `Phaser.Scale.FIT`, `autoCenter`, len na šírku.
- **Lokálny vývoj:** `python -m http.server 8080` alebo `npx serve` (service worker beží aj na localhost).
- **Limit:** súbory do 300 riadkov, engine je oddelený od obsahu (obsah = JSON v `data/`).

### Štruktúra priečinkov
```
index.html            # vstup, <script type="module" src="src/main.js">
manifest.json         # PWA manifest
sw.js                 # service worker (CACHE_VERSION, precache zoznam)
vendor/phaser.min.js
src/
  main.js             # Phaser config, zoznam scén
  scenes/             # Boot, Preload, Map, Airport, Takeoff, Flight, Landing, Hangar
    airport/          # flow.js (poradie staníc), checkin, bags, security, stairs, gate, shapes (zástupná grafika)
  systems/
    input.js          # jediný input modul (1 pointer, ťuk + ťahanie)
    save.js           # localStorage, saveVersion, migrácie
    economy.js        # výpočet výplaty a cien
    audio.js          # hlas podľa voice.json (fetch + WebAudio, chýbajúci mp3 = ticho); postup nahrávania: docs/AUDIO.md
    data.js           # načítanie a validácia JSON
    sprites.js        # sprity z dát: queueSprites/addSprite/role (mená z data/sprites.json, airport.json, destinations.json, planes.json); chýbajúci sprite = null → scéna nakreslí záložný tvar
  ui/                 # ikona domov, mince, hviezdičky (bez textu)
data/                 # destinations, planes, airport, flights, economy, voice, sprites
assets/
  sprites/<kategoria>/
  audio/voice/sk/     # Paľove mp3 (TTS len zástupka)
  audio/sfx/
assets-raw/           # originálne fotky kresieb, v .gitignore
docs/
```

### Input modul (`src/systems/input.js`)
- Sleduje len **jeden aktívny pointer** (prvý dotyk), ďalšie prsty ignoruje.
- Gestá: **ťuk** a **ťahanie**. Iné tlačidlá ako ikona domov nie sú.
- Zásahové plochy sú väčšie ako sprite (min. ~96 px pri 1280×800).
- Let: celá obrazovka je ovládacia zóna, lietadlo plynulo (lerp) sleduje prst v X aj Y; ťah začatý na ikone domov neriadi.
- Scény neposlúchajú surové Phaser eventy, ale udalosti z modulu (`tap`, `dragStart`, `drag`, `dragEnd`).

## 3. JSON formát dát (`data/`)
Ceny a čísla sú len príklad, doladia sa v 2d.

`destinations.json`
```json
[{ "id": "bts", "name": "Bratislava", "country": "sk", "flag": "flag_sk",
   "map": { "x": 640, "y": 420 }, "weather": "sun", "geo": { "lat": 48.17, "lon": 17.21 },
   "unlockCost": 0, "voice": "dest_bts" },
 { "id": "lon", "name": "Londýn", "country": "gb", "flag": "flag_gb",
   "map": { "x": 420, "y": 300 }, "weather": "rain", "geo": { "lat": 51.47, "lon": -0.45 },
   "flightWeather": { "stormFrom": 0.55, "stormCloudEvery": 1.6, "rain": true },
   "unlockCost": 0, "voice": "dest_lon" }]
```
`planes.json`
```json
[{ "id": "zelene", "sprites": { "side": "plane_zelene_side", "top": "plane_zelene_top" },
   "capacity": [{ "value": 4, "cost": 0 }, { "value": 6, "cost": 200 }, { "value": 8, "cost": 500 }],
   "range":    [{ "value": 900, "cost": 0 }, { "value": 1100, "cost": 100 }, "… až 2600 (6 stupňov)"],
   "engine":   [{ "value": 1, "cost": 0 }, { "value": 0.9, "cost": 300 }, { "value": 0.8, "cost": 600 }] }]
```
`engine.value` = násobič času letu: `routes.flight(from, to, engine)` násobí `durationSec`, `every` (prekážky, hviezdy, búrka, vietor), `wind.durationSec`, `faces.recoverSec` a delí `speed` (počet prekážok na let ostáva).
`airport.json`: poradie a pozície stanovíšť
```json
{ "stations": [
  { "id": "checkin", "x": 200,  "sprite": "bld_checkin", "voice": "st_checkin" },
  { "id": "bags",    "x": 480,  "sprite": "bld_belt",    "voice": "st_bags" },
  { "id": "gate",    "x": 760,  "sprite": "bld_gate",    "voice": "st_gate" },
  { "id": "boarding","x": 1040, "sprite": "plane_zelene_side", "voice": "st_boarding" } ] }
```
`flights.json`: parametre letu podľa vzdialenosti (R1b). Trasy sa nezadávajú ručne: `routes.flight(from, to)` zloží `base` + prvý stupeň `byKm`, kde `km <= upTo` (posledný stupeň bez `upTo`), + `weather`/`wind` cieľa + `from`, `to`, `km`.
```json
{ "base": { "obstacles": [{ "type": "cloud", "every": 2.4 }], "stars": { "every": 2.5 }, "thinAfterHits": 3, "thinFactor": 0.5 },
  "byKm": [{ "upTo": 600, "durationSec": 35, "speed": 420, "payMult": 1, "puzzles": ["p1", "p3"] },
           { "durationSec": 65, "speed": 600, "payMult": 2, "puzzles": ["p6", "p7", "p8"] }] }
```
`routes.js`: `km(a, b)` (haversine z `geo`, na 10 km), `reachable(from, to, range)` (Bratislava vždy), `flight(from, to)`. Búrka (`flightWeather`) a vietor (`wind`) patria cieľu v `destinations.json`. Dolet sa meria od `save.location`.

`economy.json`
```json
{ "startCoins": 0, "basePerPassenger": 5, "tipPerStar": 1,
  "tipPerSmile": 1, "replayForStars": true }
```
`voice.json`: kľúč → súbor (vlastná nahrávka má prednosť pred TTS zástupkou)
```json
{ "st_checkin": { "file": "voice/sk/st_checkin.mp3", "text": "Ukáž letenku." },
  "dest_lon":   { "file": "voice/sk/dest_lon.mp3",   "text": "Letíme do Londýna." } }
```

### Save (localStorage, kľúč `lietadla.save`)
```json
{ "saveVersion": 3, "coins": 0, "planes": { "zelene": { "capacity": 0, "range": 0, "engine": 0 } },
  "location": "bts", "unlocked": ["bts", "lon"], "bestStars": { "bts-lon": 0 } }
```
- `save.js` drží pole migrácií `migrations[n]` (n → n+1). Pri načítaní sa postupne aplikujú, kým nie je `saveVersion` aktuálna.
- `location` = kde lietadlo stojí (zapisuje sa v `Landing` pri vstupe; neznáme id → `bts`). `bestStars` kľúče `from-to`, nové páry vznikajú pri prvom rekorde. `unlocked` o otvorení mesta už nerozhoduje. Migrácia 1 → 2 doplní `location`, 2 → 3 `engine = 0` a posunie index `range` o 3 (nový rad doletu od 900 km). `load` doplní chýbajúce kľúče upgradov a orezá indexy.
- Poškodený save sa nezmaže, odloží sa do `lietadla.save.bak` a hra začne odznova.

### Sprity v dátach (úloha 3d)
- `data/sprites.json`: `dir`, `ext` (mapy `jpg`), `scale` (postavy, kufre), `roles` (ikony a pozadia podľa úlohy, napr. `home`, `coin`, `cloud[]`), `people[]`, `bags` (veľkosti × farby). Kód pýta `role('home')`, nie názov súboru.
- `airport.json`: staniciam pribudlo `y`, `w`, `spriteOpen`; `backdrop[]` (terminál, veža); `landing.lights` (svetlá dráhy).
- `destinations.json`: `mapLayer` (vrstva mapy), `scenery` (skyline, stromy s polohou), `flag`.
- Preload načíta všetky mená z dát (`allKeys`). Do `sw.js` PRECACHE sa sprity dopisujú ručne (zoznam sa dá vygenerovať z týchto dát).

## 4. PWA, offline a nasadenie
- **Hosting:** GitHub Pages ako projektová stránka v podpriečinku (`https://<user>.github.io/<repo>/`).
- **Všetky cesty relatívne** (`./`, nikdy `/`): v HTML, JS, JSON, manifeste aj v service workeri.
- `manifest.json`: `"start_url": "./"`, `"scope": "./"`, `"display": "fullscreen"`, `"orientation": "landscape"`, ikony 192 a 512 px.
- `sw.js`: registrovaný ako `./sw.js` (scope = podpriečinok). Najprv cache, pri chybe sieť. `CACHE_VERSION` sa zvyšuje pri **každej** zmene cachovaného súboru, staré cache sa mažú v `activate`.
- Precache zoznam je ručný v `sw.js` (bez build kroku). Pri pridaní assetu ho treba doplniť. Hlasové mp3 z `voice.json` sa cachujú automaticky jednotlivo (chýbajúci súbor inštaláciu nezhodí), nepridávajú sa do zoznamu.
- **Test:** nainštalovať cez „Pridať na plochu", zapnúť režim lietadlo, spustiť a prejsť celú slučku.

## 5. Pipeline z kresieb syna
1. **Kreslenie:** jeden objekt na jeden biely papier, **hrubá čierna fixka** na obrys (tenká ceruzka sa po vyrezaní stráca), plochy farbičkami.
2. **Foto:** zhora, rovno, denné svetlo bez tieňa → `assets-raw/` (nekomituje sa).
3. **Pozadie:** odstrániť cez Magnific `remove_background` (alebo GIMP), uložiť ako PNG-32 s priehľadnosťou.
4. **Orez a mierka** (dlhšia strana, pri 1280×800):

| Kategória | Prefix | Cieľová veľkosť |
|---|---|---|
| lietadlo | `plane_` | 512 px šírka |
| postava | `person_` | 192 px výška |
| kufor | `bag_` | 96 px |
| budova / stanica | `bld_` | 1024 px šírka |
| vlajka | `flag_` | 128×96 |
| prekážka | `obs_` | 160 px |
| UI ikona | `ui_` | 128 px |
| pozadie | `bg_` | 1280×800 |
| mapa (JPG, ~200 KB) | `map_` | 1280×800 |
| prostredie (skyline pás, strom 256 výška, svetlo) | `env_` | pás ~950×300, strom 256, svetlo 128 |
| vec na upgrade | `item_` | 128 |

5. **Názvy:** `kategoria_nazov_variant.png`, malé písmená, ASCII bez diakritiky, `_` ako oddeľovač. Napr. `plane_zelene_side.png`, `plane_zelene_top.png`, `person_mama_01.png`, `bag_zeleny.png`, `flag_sk.png`.
6. **Smer:** lietadlá kreslené smerom doprava (inak flip v kóde podľa dát). Veľkosť do ~200 KB na sprite.
7. **Doplnky:** chýbajúce sprity a variácie sa môžu generovať cez Magnific z pôvodných kresieb. UI, pozadia a jednoduché tvary môžu byť SVG/vektor.
8. **Hlas:** Paľove vlastné mp3 nahrávky (mono, 64 kbps) v `assets/audio/voice/sk/<kluc>.mp3`. Kým nie sú, slúži ako zástupka TTS mp3 z Magnificu s rovnakým názvom. V hre sa nikdy nepoužíva živé TTS.

## 6. Hádanka Arrows (scéna `Apron`, v1.3, v slučke Airport → Apron → Takeoff)
- Stupeň v `flights.json` (`byKm`) má `puzzles: [id, …]`; `apron/pick.js` (`pickLevel(from, to)`) vyberie level (počítadlo v pamäti podľa `from-to`), stupeň bez `puzzles` hádanku preskočí. Čistý level pridá `smiles + 1` do `args` pre Takeoff.
- `data/puzzles.json`: `[{ id, cols, rows, cell?, pieces: [{ x, y, dir: up|down|left|right, kind: car|bus|truck }] }]`. Vozidlo zaberá 1 bunku, `kind` je len vzhľad. Čísla scény v `airport.json` → `apron` (bunka 160, vozidlo 0,85, posun mriežky, nečinnosť, oslava).
- `scenes/apron/board.js`: čistá logika bez Phaseru (`canMove`, `blocker`, `remove`, `isClear`, `isSolvable`, `validateLevel`, `selfTest`). `data.js` pri načítaní nahlási neriešiteľný level ako chybu. Vozidlo odíde, ak je v smere šípky voľná cesta po okraj.
- `scenes/Apron.js` dostane `{ level, next, args }`, po vyčistení `fx.go(next || 'Map', args)`. `apron/shapes.js` kreslí záložné vozidlo (predok = smer šípky) alebo sprite z `role('car'|'bus'|'truck')`, pozadie `role('bgApronTop')`.
- Test: `?scene=Apron&level=p1&next=Map` (Preload; `next` len Map/Airport/Hangar), `?test=1` spustí samotest `board.js`.
