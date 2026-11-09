# PROGRESS

## Hotové
- **Úloha 1: Návrh a dokumenty** (2026-11-09)
  - `docs/ARCHITECTURE.md`: rozsah v1, roadmapa, technológia, JSON formáty, save, PWA, pipeline kresieb
  - `docs/design-notes.md`: rozhodnutia o hernom modeli a ovládaní
  - `.gitignore` (assets-raw/), git init
- **Úloha 2a: Kostra so zástupnou grafikou** (2026-11-09)
  - Phaser 3.90.0 vo `vendor/`, `index.html`, `src/main.js` (1280×800, FIT)
  - Scény Boot → Preload → Map → Airport → Flight → Landing → Hangar → Map (farebné obdĺžniky)
  - `systems/input.js` (1 pointer, tap/dragStart/drag/dragEnd, hitZone min. 96 px), `systems/data.js` (6 JSON + validácia), `systems/save.js` (saveVersion 1, migrácie, .bak pri poškodení, predvolené hodnoty z dát)
  - `ui/home.js` (ikona domov), `ui/next.js` (DOČASNÁ zelená šípka, v 2b–2d ju nahradia akcie na objektoch)
  - PWA: `manifest.json`, zástupné ikony 192/512, `sw.js` (CACHE_VERSION v1, ručný precache, cache-first)
  - Otestované: celý tok, ťahanie v Lete, ikona domov, zápis save, poškodený save, beh z podpriečinka. Paľo overil v Chrome service worker, cache a offline režim.
  - Lokálny server: `npx.cmd serve -l 8080` (PowerShell blokuje `npx.ps1`, Python nie je nainštalovaný). Otvárať cez `http://localhost:8080/`, nie dvojklikom na `index.html`.

- **Úloha 2b: Stanice letiska so zástupnou grafikou** (2026-11-09)
  - Poradie v `airport.json`: checkin → bags → boarding (schody) → gate. `scenes/airport/` (flow, checkin, bags, stairs, gate, shapes), `Airport.js` len skladá.
  - Check-in ťuk na cestujúceho (počet = kapacita lietadla zo save), kufor ťahom na pás (mimo pásu sa vráti), schody ťahom k dverám lietadla, ťuk na bránu → cestujúci nastúpia sami → Flight s `{ passengers, smiles }` (smajlík = kufor na páse, zatiaľ sa nepoužíva, prepitné až 2d).
  - `systems/audio.js` (chýbajúci mp3 = ticho), `voice.json` doplnený o st_bags, st_boarding, st_gate; `docs/AUDIO.md` (tabuľka, prompt, postup nahrania). SW: CACHE_VERSION v2, cachovanie mp3 z voice.json.
  - Otestované v Browser paneli (celý Airport až po nástup cestujúcich; panel kreslí len pri vstupe, preto pomalé). NEOTESTOVANÉ: skutočný prechod do Flight, zvuk (mp3 ešte nie sú), dotyk na tablete, SW (v paneli sa neregistruje).
- **Úloha 2c: Let so zástupnou grafikou** (2026-11-09)
  - `Flight.js` + `scenes/flight/` (`spawner.js` generuje z `flights.json`, `shapes.js` tvary a HUD). Lietadlo lerp za prstom cez input.js, svet scrolluje 420 px/s.
  - Náraz: zatrasenie, blikanie 1,2 s (počas neho prekážky prechádzajú), zvuk `sfx_bump`. Po `thinAfterHits` (2) nárazoch sa každá nová prekážka vynechá s pravdepodobnosťou 1 − `thinFactor`. Hviezdičky sa nezriedia a nikdy neubúdajú.
  - HUD bez textu okrem čísla: počítadlo hviezdičiek + trasa s lietadielkom. `ui/next.js` z Flight odstránená (ostáva v Landing/Hangar). Na začiatku hrá hlas cieľa (`dest_lon`), pre `bts` ticho.
  - Po `durationSec` → Landing `{ to, passengers, smiles, stars }`. `data.js` má nové `flight(to)`.
  - `voice.json`: `sfx_bump` (`assets/audio/sfx/bump.mp3`, zatiaľ ticho), `docs/AUDIO.md` doplnený. SW: CACHE_VERSION v4.
  - Otestované v Browser paneli: celý 45 s let simulovaný po snímkoch (4 nárazy, zriedenie po 2., zbieranie hviezdičiek, prechod do Landing s argumentmi), ťahanie myšou nastaví cieľ. NEOTESTOVANÉ: dotyk na tablete, zvuk (mp3 nie je), SW (v paneli treba odregistrovať starý), pocit z obtiažnosti (rýchlosť 420 px/s, hitbox) treba vyskúšať rukou.
- **Úloha 2d: Hangár a ekonomika** (2026-11-09)
  - Landing: počasie (slnko/dážď), vlajka, hlas `land_<id>` (`land_lon` v voice.json, pre bts ticho). Ťuk na vlajku → nová scéna Payout.
  - `systems/economy.js` (payout, capacityInfo, buyCapacity), `save.js` + `addCoins`, `setBestStars` (len nový rekord, kľúč `bts-lon`).
  - Payout: kôpka základu a kôpka prepitného (číslo pri minciach), ťuk = mince do počítadla, potom Hangar. Mince a rekord sa uložia hneď pri vstupe (nič sa nestratí ani cez domov). Základ 5/cestujúci, prepitné 1/hviezdička a 1/smajlík.
  - Hangár: upgrade kapacity +2 za 50 mincí (zašednutý + zatrasenie ak nemáš dosť, po kúpe oslava a návrat na Map), brána na odchod bez kúpy. Kapacita zo save sa prejaví na letisku (otestované: 6 cestujúcich).
  - `ui/next.js` zmazaná, žiadna dočasná šípka už nezostala. `ui/coins.js` (mince, počítadlo). SW: CACHE_VERSION v5.
  - Otestované v Browser paneli (simulované snímky): výplata 28 = 20+5+3, bestStars 5, zašednutý upgrade, kúpa, návrat na Map, 6 cestujúcich. NEOTESTOVANÉ: dotyk na tablete, zvuk (mp3 chýba), SW na tablete, vizuálny dojem a ladenie cien rukou.
- **Úloha 3a: Sprity zeleného lietadla z kresieb** (2026-11-09)
  - Zdroj: `assets-raw/lietadlo na zemi - vo vzduchu - zhora raw.jpg` (3 lietadlá). Kresba je tenká ceruzka, krídla sú len čiary, preto sme zvolili čistú verziu cez Magnific (obrázok z kresby, rovnaký tvar a farby, hrubší obrys) + `remove_background`. Je to teda vyčistená AI verzia kresby, nie pixel-verný výrez. Orez a mierka 512 px šírka (PNG-32).
  - `assets/sprites/plane/`: `plane_zelene_side.png` (so zemou, s podvozkom; letisko a hangár), `plane_zelene_air.png` (vo vzduchu, bez podvozku; Flight), `plane_zelene_top.png` (zhora; zatiaľ nepoužitý, na neskôr, špendlík na mape ostáva). Veľkosti 220–285 KB (mierne nad ~200 KB).
  - `data/planes.json`: pribudol `sprites.air`. Nový `systems/sprites.js` (`queuePlaneSprites`, `addPlane`): mená berie z dát, chýbajúci sprite = `null` → scéna nakreslí pôvodný záložný tvar. Preload načíta sprity po načítaní JSON.
  - Flight (`makePlane`, 230 px šírka, hitbox ostáva 200×70), Airport (boarding, 380 px), Hangár (lietadlo 560 px + ikona upgradu).
  - SW: sprity + `sprites.js` v precache, CACHE_VERSION v6.
  - Otestované v Browser paneli: všetky 3 textúry sa načítajú, sprite v Airport, Hangar aj Flight, záložný tvar pri chýbajúcom sprite. NEOTESTOVANÉ: dotyk na tablete, SW na tablete, celkový vizuálny dojem (veľkosti lietadla vs. schody/dvere v Airport a sedadlá v Hangári treba posúdiť okom).
  - Pozor: tiene/priehľadnosť okien sú z čistej verzie (okná biele, nie priehľadné). Ďalšie kresby: hrubá čierna fixka, jeden objekt na papier.
- [ ] spracovať ďalšie kresby syna na sprity (ľudia, kufre, budovy; hrubá fixka, 1 objekt na papier)
- [ ] nahrať vlastné hlasové mp3 podľa `docs/AUDIO.md` (po pridaní zvýšiť CACHE_VERSION)

## Roadmapa po v1
v1.1 dolet + nové destinácie · v1.2 bezpečnostná kontrola · v1.3 hádanka Arrows · v1.4 kvíz s vlajkami · v1.5 počasie počas letu · v1.6 ďalšie lietadlá · v1.7 budovanie letiska

## Poznámky
- Raw kresby (`assets-raw/`): letisko s vežou, lietadlá zboku aj zhora, ľudia s batožinou. Kreslené tenkou ceruzkou, ďalšie kresby treba robiť hrubou fixkou.
