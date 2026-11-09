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
  - Otestované: celý tok, ťahanie v Lete, ikona domov, zápis save, poškodený save, beh z podpriečinka. Service worker a offline treba overiť v Chrome (zabudovaný prehliadač SW nepodporuje).

## Ďalšie úlohy (každá = samostatná session)
- [ ] **2b** stanice letiska: check-in, batožina, gate, boarding
- [ ] **2c** let: drag-to-steer, prekážky, hviezdičky, zriedenie po 2 nárazoch
- [ ] **2d** hangár a ekonomika: výplata, prepitné, upgrade kapacity
- [ ] spracovať kresby syna na sprity podľa pipeline (hrubá fixka, 1 objekt na papier)
- [ ] nahrať vlastné hlasové mp3 (zatiaľ TTS zástupky)

## Roadmapa po v1
v1.1 dolet + nové destinácie · v1.2 bezpečnostná kontrola · v1.3 hádanka Arrows · v1.4 kvíz s vlajkami · v1.5 počasie počas letu · v1.6 ďalšie lietadlá · v1.7 budovanie letiska

## Poznámky
- Raw kresby (`assets-raw/`): letisko s vežou, lietadlá zboku aj zhora, ľudia s batožinou. Kreslené tenkou ceruzkou, ďalšie kresby treba robiť hrubou fixkou.
