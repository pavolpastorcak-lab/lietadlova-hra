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
- [ ] **2c** let: drag-to-steer, prekážky, hviezdičky, zriedenie po 2 nárazoch
- [ ] **2d** hangár a ekonomika: výplata, prepitné, upgrade kapacity
- [ ] spracovať kresby syna na sprity podľa pipeline (hrubá fixka, 1 objekt na papier)
- [ ] nahrať vlastné hlasové mp3 podľa `docs/AUDIO.md` (po pridaní zvýšiť CACHE_VERSION)

## Roadmapa po v1
v1.1 dolet + nové destinácie · v1.2 bezpečnostná kontrola · v1.3 hádanka Arrows · v1.4 kvíz s vlajkami · v1.5 počasie počas letu · v1.6 ďalšie lietadlá · v1.7 budovanie letiska

## Poznámky
- Raw kresby (`assets-raw/`): letisko s vežou, lietadlá zboku aj zhora, ľudia s batožinou. Kreslené tenkou ceruzkou, ďalšie kresby treba robiť hrubou fixkou.
