# BACKLOG: úlohy po v1 (režim orchestrátora)

Architekt zadáva úlohy **po jednej**, každú samostatnej Sonnet session (kontext fresh, jeden commit). Brief = sekcia „Spoločné pravidlá" + sekcia úlohy. Stav úloh sa značí tu (`[ ]` → `[x]`), detaily hotového idú do `docs/PROGRESS.md`.

## Rozhodnutia Paľa (2026-11-10)
- **Poradie:** presne podľa roadmapy v1.1 → v1.7.
- **v1.1:** 6 nových európskych destinácií, odomykajú sa **len doletom** (žiadna cena za destináciu).
- **Obtiažnosť:** dnešná hra je pre syna príliš ľahká → nové lety hustejšie a dlhšie, minihry s viac možnosťami. Všetky čísla v `data/`.
- **Hlas a test:** hra beží ďalej aj bez mp3. Architekt sa zastaví **po každom míľniku** (v1.1, v1.2 …): test na tablete + zoznam mp3 a spritov naraz.

- **Doplnené počas písania:** hra pôsobí plocho. Paľo chce viac animácií a efektov a let aj **doprava a doľava**. Architekt navrhuje, Paľo schvaľuje. Pri každej kontrole diffu architekt pozrie scény aj okom a nové vizuálne nápady dopíše do sekcie „Nápady na schválenie".

## Schválené návrhy architekta (2026-11-10)
1. **3g, 3h, 3i idú pred v1.1.**
2. **Sprity a zvuky cez Magnific konektor.** Kredity sú zakúpené. Chýbajúce sprity a mp3 (TTS zástupky hlasu, sfx) generuje architekt alebo Sonnet session cez Magnific. Pravidlo: **jedno Paľovo schválenie pred každou dávkou** (architekt pošle zoznam súborov s promptmi a odhadom, Paľo povie áno). Kód sa medzitým píše so záložnými tvarmi, mená súborov idú do `data/` až keď súbor existuje.
3. **Zriedenie prekážok až po 3 nárazoch** (`thinAfterHits: 3`). Design-notes, Rozhodnutie 1, upraví úloha 3g.
4. **Náročnosť cez rýchlosť, nie cez počet prekážok.** Vzdialenejšia trasa = lietadlo letí rýchlejšie pri rovnakom počte prekážok. Odmena: dolet do vzdialenejších destinácií a väčší zárobok (`payMult` trasy), neskôr možno suvenír do zbierky.
5. **Návrhy z úloh 4a–9b** (destinácie, bezpečnostná kontrola, hádanka, kvíz) schválené tak, ako sú v briefoch.
6. **Nápady:** prstence, deň/noc, živé letisko (len občasný vzlet + zmena počasia a noc v čase) a sfarbenie lietadla sú schválené ako úlohy 11a–11d. Suveníry neskôr, želania cestujúcich zatiaľ nie, pilot nie.

## Poradie a stopky
| # | Úloha | Verzia | Stopka pred / po |
|---|---|---|---|
| 3g | Let do všetkých strán (prst vedie lietadlo aj v X) | v1.0 | – |
| 3h | Efekty v lete (hĺbka, stopa, iskry) | v1.0 | – |
| 3i | Animácie v ostatných scénach | v1.0 | **PO: tablet** (pocit z letu, plynulosť efektov) |
| 4a | Upgrade doletu v hangári | v1.1 | – |
| 4b | 6 nových destinácií + ťažšie lety | v1.1 | **PO: tablet** (polohy špendlíkov, obtiažnosť), mp3 `dest_*`, `land_*` |
| 4c | Zvuky v hre (let, hviezdy, mince, hangár, letisko) | v1.1 | **PO: tablet** (hlasitosti) |
| 5a | Bezpečnostná kontrola (záložné tvary) | v1.2 | **PO: tablet**; dávka Magnific (7 spritov) na jedno schválenie |
| 5b | Zapojenie spritov a zvukov bezpečnostnej kontroly | v1.2 | **PO: tablet** |
| 5c | Skener zboku a druhá sada vecí | v1.2 | hotovo |
| 6a | Hádanka Arrows: engine + 2 levely | v1.3 | hotovo |
| 6b | Hádanka Arrows: 8 levelov, zapojenie do slučky | v1.3 | **PO: tablet**; dávka Magnific (`bg_letisko_top`, 3 vozidlá) na jedno schválenie |
| 6c | Sprity a zvuky hádanky | v1.3 | hotovo |
| 7a | Kvíz s vlajkami po pristátí | v1.4 | **PO: tablet**, mp3 |
| 4d | Viac Európy na mape (6 miest) | v1.4 | **PO: tablet**; dávka Magnific (12 hlasov) na jedno schválenie |
| 8a | Búrkové mraky a dážď počas letu | v1.5 | – |
| 8b | Vietor počas letu | v1.5 | **PO: tablet** (sila vetra) |
| 9a | Aktívne lietadlo v save (bez viditeľnej zmeny) | v1.6 | **PRED 9b:** dávka Magnific (6 spritov lietadiel) na jedno schválenie |
| 9b | Kúpa a výber lietadla v hangári | v1.6 | **PO: tablet** |
| 10 | Budovanie letiska | v1.7 | **PRED: dizajnové otázky Paľovi**, brief sa dopíše až potom |
| 11a | Prstence na oblohe | nápad | zaradí sa po 8b (stavia na lete do strán a počasí) |
| 11b | Deň, západ slnka, noc | nápad | po 11a |
| 11c | Živé letisko: občasný vzlet v pozadí | nápad | po 11b |
| 11d | Vlastné sfarbenie lietadla | nápad | po 9b |

## Roadmapa v2: progres a obsah (Paľo schválil 2026-11-11)
Po prvom teste na tablete: hra sa rýchlo obohrá, chýba progres. Úlohy majú predponu **R**, aby sa nepliedli so starými 4a, 4b. 9a + 9b sa robia ako R3c, 11b ako R2d. Briefy sú na konci súboru (sekcia „Roadmapa v2: briefy").

| # | Úloha | Stopka pred / po |
|---|---|---|
| R1a | Oprava dvojitého „Uvoľni" v hádanke | po: architekt prípadne pregeneruje `st_apron` (schválené) |
| R1b | Let z miesta pristátia (poloha v save, vzdialenosti zo súradníc) | **PRED: plán architektovi**; po: hlas `land_bts` (schválené) |
| R2a | Názov krajiny pod vlajkou (Finland / Suomi) | ✔ hotové |
| R2a2 | Oprava: názov krajiny ostane do ťuknutia | hotovo |
| R2b | Paralaxa skyline pri pristátí | hotovo |
| R2c | Počasie aj pri pristávaní | hotovo, **PO: tablet** (R1a–R2c) |
| R2e | Tváre cestujúcich v lete (nárazy znižujú prepitné) | hotovo, **PO: tablet** |
| R3a | Hangár: Motor, viac stupňov doletu, drahšie upgrady | hotovo, **PO: tablet** (R3a–R3b) |
| R3b | Palivo a tankovanie | **PRED: otázky Paľovi**; **PO: tablet** (R3a–R3b) |
| R2d | Noc (večerné lety) | – |
| R3c | Nové lietadlá (= 9a + 9b) | **PRED: dávka Magnific** (6 spritov) |
| R4a | Hlásenia v miestnom jazyku pri odlete zo zahraničia | **PRED: dávka Magnific** (~66 hlasov) |
| R4b | Nová mapa (Rusko, Blízky východ, sever Afriky…) | **PRED: dizajnové otázky Paľovi** |

## Spoločné pravidlá (súčasť každého briefu)
Si implementátor v režime orchestrátora. Prečítaj `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/design-notes.md` a z `docs/PROGRESS.md` len posledné 2 úlohy. Výnimky z `CLAUDE.md`:
- **Paľa sa nepýtaj** (pravidlo 1 vybavil architekt). Nejasnosť = napíš otázku architektovi a skonči ťah.
- **Plán:** ak úloha mení `data/`, save alebo viac ako 3 súbory, napíš najprv plán (max 10 riadkov) a skonči ťah, architekt ho schváli. Inak plán v jednej vete a rovno rob.
- Rob **len túto úlohu**. Nič navyše, žiadny refaktor mimo uvedených súborov.

Povinné pri každej úlohe:
1. Vstup len cez `src/systems/input.js` (ťuk, ťahanie, 1 pointer, zásahová plocha ≥ 96 px). Žiadne nové tlačidlá, text (okrem čísel), časové limity, strata mincí ani prehra.
2. Čísla a obsah do `data/*.json`, nie do kódu. Nové povinné polia doplň do validácie v `src/systems/data.js`.
3. Každý súbor < 300 riadkov. Ak scéna rastie, vyčleň modul do `src/scenes/<scena>/`.
4. Sprite cez `addSprite`/`role` zo `src/systems/sprites.js`, vždy so záložným tvarom, ak sprite chýba.
5. `sw.js`: zvýš `CACHE_VERSION` o 1 a doplň do `PRECACHE` každý nový `src/` súbor, nový `data/` súbor a každý novo použitý sprite (aj ten, čo už je v repozitári, ale nebol v precache).
6. **Magnific (sprity, TTS, sfx) nikdy nespúšťaj sám.** Ak úloha potrebuje nový obrázok alebo zvuk, napíš architektovi zoznam (názov súboru, prompt) a pokračuj so záložným tvarom / tichom. Generuje sa až po Paľovom schválení dávky.
7. Nový hlas/zvuk: kľúč do `data/voice.json` + riadok do tabuľky v `docs/AUDIO.md`. Chýbajúci mp3 = ticho, nesmie nič zhodiť.
8. Zmena tvaru save: zvýš `SAVE_VERSION` a pridaj migráciu do `migrations[]` v `src/systems/save.js`. Starý save nesmie prísť o mince, upgrady ani rekordy.
9. Všetky cesty relatívne (`./`).
10. Test v Browser paneli (server `hra-worktree` z `.claude/launch.json`, port 8090; **nie** `hra` na 8080, tam môže bežať Paľov server z hlavného priečinka so starým kódom; over, že `./sw.js` vracia tvoju `CACHE_VERSION`): prejdi celú slučku Map → … → Hangar → Map, konzola bez chýb. Napíš, čo si NEotestoval.
11. Na konci: aktualizuj `docs/PROGRESS.md` (hotové + neotestované), v `docs/BACKLOG.md` označ úlohu `[x]`, **jeden commit** (`Uloha <č>: …, CACHE_VERSION vN`), a záverečná správa s návodom na test podľa `CLAUDE.md` pravidla 11.

---

## [x] 3g: Let do všetkých strán (v1.0)
**Cieľ:** Lietadlo počas letu sleduje prst nielen hore a dole, ale aj doprava a doľava. Let je živší: za hviezdičkou sa dá zaletieť dopredu, pred mrakom cúvnuť.

**Súbory:** `src/scenes/Flight.js`, `src/scenes/flight/spawner.js`, `data/airport.json` (nový blok `flight`), `docs/design-notes.md` (Rozhodnutie 2, veta o lete), `docs/ARCHITECTURE.md` (Input modul, veta o lete), `sw.js`, docs.

**Zadanie:**
- Konštanty z `Flight.js` (`MIN_Y`, `MAX_Y`, `FOLLOW_MS`, `SPEED`, `INVULN_MS`) presuň do `data/airport.json` → `flight: { "minX": 160, "maxX": 900, "minY": 140, "maxY": 700, "followMs": 120, "followXMs": 220, "speed": 420, "invulnMs": 1200, "fingerOffsetX": -140 }`.
- Cieľ lietadla = poloha prsta v X aj Y, obmedzená na pásmo. `fingerOffsetX`: lietadlo letí kúsok **vľavo od prsta**, aby ho ruka nezakrývala. V X dobieha pomalšie (`followXMs`), aby pôsobilo ťažšie. Stále jedno gesto (ťahanie), jeden pointer.
- Lietadlo sa nakláňa podľa pohybu: stúpa = nos mierne hore, klesá = nos dole (max ±12°, plynulo).
- Hviezdičky: približne každá tretia sa objaví v „rade" 3 hviezdičiek za sebou v oblúku (pole `stars.arcEvery` vo `flights.json`, predvolene 3), aby sa oplatilo letieť dopredu a dozadu.
- `flights.json`: `thinAfterHits` 2 → 3 (schválené, hra je príliš ľahká). V `docs/design-notes.md` uprav v Rozhodnutí 1 vetu „Po 2 nárazoch" na „Po 3 nárazoch" a v Rozhodnutí 2 vetu o lete (lietadlo sleduje prst v oboch smeroch).
- Na konci letu (`durationSec`) sa lietadlo plynulo vráti na (300, aktuálna výška) a až potom ide do Touchdown, aby nadväzujúca scéna sedela.

**Akceptačné kritériá:** prst vpravo hore → lietadlo doletí vpravo hore a zastane v pásme; lietadlo nikdy nevyjde z obrazovky ani pod HUD; nárazy, zriedenie a hviezdičky fungujú ako predtým; Takeoff → Flight → Touchdown bez skoku lietadla; v kóde neostanú herné čísla.

**Nesmie sa zmeniť:** pravidlá nárazu a výplaty, `input.js`, vzlet a pristátie.

---

## [x] 3h: Efekty v lete (v1.0)
**Cieľ:** Let prestane pôsobiť plocho. Len kód a existujúce sprity, žiadne nové obrázky, žiadna zmena pravidiel.

**Súbory:** nový `src/ui/fx.js` (spoločné efekty), `src/scenes/Flight.js`, `src/scenes/flight/shapes.js`, `data/sprites.json` (blok `fx` s číslami), `sw.js`, docs.

**Zadanie:** body 1 a 2 zo „Zoznamu efektov" v úlohe 3i. Každý efekt = funkcia vo `fx.js`, scéna ju len zavolá. Platia „Pravidlá efektov" tamže.

**Akceptačné kritériá:** let prejde bez chýb v konzole; efekty nemenia nárazy, hviezdičky ani trvanie letu; po lete neostanú v scéne žiadne objekty efektov.

**Nesmie sa zmeniť:** pravidlá letu z 3g, ostatné scény.

---

## [x] 3i: Animácie v ostatných scénach (v1.0)
**Cieľ:** To isté pre mapu, letisko, výplatu a hangár.

**Súbory:** `src/ui/fx.js` (z 3h; nad 300 riadkov rozdeľ na `fx.js` a `fx-particles.js`), `Map.js`, `Airport.js` + `scenes/airport/*`, `Payout.js`, `Hangar.js`, všetky scény kvôli prechodom, `data/sprites.json` → `fx`, `sw.js`, docs. Viac ako 3 súbory → najprv plán architektovi.

**Zadanie:** body 3 až 7 zo zoznamu.

**Zoznam efektov (3h = body 1–2, 3i = body 3–7):**
1. **Let, hĺbka:** 2 vrstvy vzdialených mrakov za hernou vrstvou (existujúce `obs_oblak_biely_*`, zmenšené, 25 % a 50 % rýchlosti, alfa 0,35/0,55, bez nárazu). Za lietadlom krátka biela stopa (miznúce krúžky).
2. **Let, odmena:** zber hviezdičky = 6 malých iskier do strán + počítadlo v HUD poskočí. Náraz = lietadlo sa zakýve (už je zatrasenie), mrak sa „rozfúkne" (zväčší a zbledne).
3. **Prechody scén:** krátke zatmenie/rozjasnenie kamery (200 ms) pri každom `scene.start` cez jednu funkciu `fx.go(scene, key, data)`.
4. **Letisko:** čakajúci cestujúci sa jemne pohupujú (každý iná fáza), pás s kuframi sa hýbe (pruhy), po smajlíku cestujúci poskočí. Lietadlo na stojisku jemne „dýcha" (±1 %).
5. **Mapa:** otvorené špendlíky sa po príchode na mapu postupne „zapichnú" (pád zhora s odrazom, 80 ms rozostup); po mape pomaly prejdú 2 tiene mrakov.
6. **Výplata a hangár:** mince letia po oblúku do počítadla po jednej (max 12 viditeľných, zvyšok sa pripočíta číslom), počítadlo tiká; kúpa upgradu = konfety (40 farebných obdĺžnikov, 1,2 s).
7. **Ťuk kdekoľvek na aktívny objekt:** krátke stlačenie (scale 0,92 → 1, 120 ms).

**Pravidlá efektov:** všetky dĺžky, počty a alfa v `sprites.json` → `fx`. Efekt nikdy neblokuje vstup dlhšie než dnes. Žiadne blikanie celej obrazovky, žiadne rýchle stroboskopy. Častice kresli tvarmi alebo existujúcou `role('star')`/`role('coin')`, max ~60 objektov naraz, po dohraní `destroy()`.

**Akceptačné kritériá (3i):** celá slučka prejde bez chýb v konzole; žiadny efekt nemení mince, hviezdičky, smajlíky ani poradie scén.

**Nesmie sa zmeniť:** herné pravidlá, polohy objektov z úloh 3e/3f, zosadenie farieb (`haze`).

**Paľo overí na tablete (STOP po 3i):** či let do strán sedí synovi do ruky (`fingerOffsetX`, `followXMs`); či efekty **nesekajú** (plynulosť sa dá posúdiť len na tablete) a neunavujú; čo z nich ubrať alebo pridať.

---

## [x] 4a: Upgrade doletu v hangári (v1.1)
**Cieľ:** V hangári sa dá za mince kúpiť väčšia nádrž (dolet). Zatiaľ nič neodomyká, na to nadviaže 4b.

**Súbory:** `data/planes.json`, `src/systems/economy.js`, `src/scenes/Hangar.js` (+ nový `src/scenes/hangar/upgradePanel.js`), `sw.js`, docs.

**Zadanie:**
- `planes.json` → `range`: `[{value:1500,cost:0},{value:2000,cost:150},{value:2600,cost:300}]`.
- `economy.js`: zovšeobecni `capacityInfo`/`buyCapacity` na `upgradeInfo(plane, kind)` a `buyUpgrade(plane, kind)` (`kind` = `capacity` | `range`), staré mená nechaj ako tenké obaly alebo uprav volania.
- Hangár: dnešný panel kapacity vyčleň do `upgradePanel.js` a použi ho dvakrát: kapacita (ako dnes) a dolet (ikona `item_nadrz` namiesto sedadla, namiesto „+N" šípka nahor alebo druhá nádrž; žiadne kilometre). Panely vedľa seba nad lietadlom, každý min. 280×100, medzera ≥ 24 px. Správanie rovnaké ako dnes: bez mincí zašednutý + zatrasenie, po kúpe oslava a návrat na Map. Pri maxe panel zmizne.
- Rola `tank: "item_nadrz"` v `data/sprites.json`.

**Akceptačné kritériá:**
- So 150+ mincami kúpim dolet, `save.planes.zelene.range` = 1, mince klesnú o 150; po reštarte ostáva.
- S 0 mincami oba panely zašednuté, ťuk len zatrasie.
- Kúpa kapacity funguje ako predtým (6 cestujúcich na letisku).
- Save sa nemení tvarom (`range` už v save je), žiadna migrácia.

**Nesmie sa zmeniť:** Map, letisko, let, výplata; poloha lietadla a sedadiel v hangári; `haze.hangarUi` štýl.

**Paľo overí na tablete (po 4b):** panely sa dajú trafiť prstom, je jasné, ktorý je ktorý.

---

## [x] 4b: 6 nových destinácií + ťažšie lety (v1.1)
**Cieľ:** Na mape pribudne 6 miest. Ktoré sú v dolete, sú hneď hrateľné; ostatné sú zašednuté, kým syn nekúpi nádrž. Lety sú ťažšie než dnes.

**Súbory:** `data/destinations.json`, `data/flights.json`, `data/voice.json`, `src/scenes/Map.js`, `src/systems/economy.js`, `src/scenes/Flight.js` (len voliteľná rýchlosť), `src/scenes/Hangar.js`/`upgradePanel.js` (vlajky v paneli), `sw.js`, docs.

**Zadanie:**
- Destinácie (vzdialenosť z Bratislavy v km, `unlockCost` nedávaj):

| id | mesto | vlajka | km | počasie | skyline / stromy | otvorí |
|---|---|---|---|---|---|---|
| ber | Berlín | `flag_de` | 550 | sun | domy / listnaté | hneď |
| rim | Rím | `flag_it` | 780 | sun | historické / palma | hneď |
| par | Paríž | `flag_fr` | 1090 | rain | historické / listnaté | hneď |
| dub | Dublin | `flag_ie` | 1700 | rain | domy / ihličnaté | dolet 2000 |
| mad | Madrid | `flag_es` | 1870 | sun | mrakodrapy / palma | dolet 2000 |
| lis | Lisabon | `flag_pt` | 2500 | sun | domy / palma | dolet 2600 |

- Polohy špendlíkov (architekt overil na `map_01_europa.jpg`, všetkých 6 krajín na mape je; ber ako východisko a dolaď podľa obrázka): Berlín (555, 390), Rím (505, 635), Paríž (320, 515), Dublin (190, 320), Madrid (190, 625), Lisabon (62, 660). Hrot špendlíka musí byť **vnútri krajiny**, stredy ≥ 110 px od seba, vlajka nad špendlíkom (šírka 96) celá na obrazovke. Lisabon je pri ľavom okraji, over ho zvlášť.
- `economy.js`: `inRange(dest)` = `dest.distance <= aktuálny dolet lietadla`. `Map.js`: otvorené = domov **alebo** `save.unlocked.includes(id)` **alebo** `inRange`. Londýn musí ostať otvorený.
- Zamknutý špendlík (45 % ako dnes) dostane zásahovú plochu: ťuk = zatrasenie + nad špendlíkom sa na 1,5 s ukáže ikona nádrže (`role('tank')`). Žiadny text.
- Hangár, panel doletu: namiesto šípky malé vlajky destinácií, ktoré ďalší stupeň otvorí (max 3, šírka ~40 px).
- `flights.json` (všetky `from: "bts"`), voliteľné nové pole `speed` (px/s; ak chýba, platí `airport.json` → `flight.speed` z úlohy 3g):

| to | durationSec | cloud every | bird every | stars every | speed | payMult |
|---|---|---|---|---|---|---|
| ber | 35 | 2.4 | 4.5 | 2.5 | 420 | 1.0 |
| rim | 40 | 2.4 | 4.5 | 2.5 | 450 | 1.0 |
| par | 45 | 2.4 | 4.5 | 2.5 | 480 | 1.2 |
| lon | 45 | 2.4 | 4.5 | 2.5 | 500 | 1.2 |
| dub | 55 | 2.4 | 4.5 | 2.5 | 540 | 1.5 |
| mad | 55 | 2.4 | 4.5 | 2.5 | 560 | 1.5 |
| lis | 65 | 2.4 | 4.5 | 2.5 | 600 | 2.0 |

- Princíp (schválený): prekážok je na každej trase rovnako husto, **ťažšie je to rýchlosťou**. `thinAfterHits` všade 3.
- `payMult`: `economy.payout` vynásobí **základ** (nie prepitné) hodnotou trasy a zaokrúhli nahor; chýbajúce pole = 1. Payout dostane trasu cez `to`.
- Hlas: `dest_<id>` („Letíme do Berlína." …) a `land_<id>` („V Berlíne svieti slnko." / „V Paríži prší." …) pre 6 nových + `land_bts` nedávaj.
- Skyline majú veľké priehľadné okraje: pri nových (`domy`, `mrakodrapy`) over, že v Touchdown sedia na zemi ako dnešný `historicke`; ak nie, dolaď polohu v dátach, obrázky needituj.

**Akceptačné kritériá:**
- Nový save: otvorené Bratislava, Londýn, Berlín, Rím, Paríž; Dublin, Madrid, Lisabon zašednuté.
- Po kúpe doletu 2000 sa otvorí Dublin a Madrid, po 2600 Lisabon. Starý save (pred úlohou) funguje bez straty.
- Výplata za Lisabon má dvojnásobný základ oproti Berlínu pri rovnakom počte cestujúcich; prepitné sa nenásobí.
- Let do každej destinácie prejde celú slučku: správna vlajka, počasie a skyline pri pristátí, rekord hviezdičiek sa uloží pod `bts-<id>`.
- Ťuk na zamknutý špendlík nič nespustí, len zatrasie a ukáže nádrž.
- Všetky nové sprity (6 vlajok, `env_palma`, `env_skyline_domy`, `env_skyline_mrakodrapy`, `item_nadrz`) sú v `PRECACHE`.

**Nesmie sa zmeniť:** letisko, vzlet, brzdenie a stojiská, výpočet prepitného, pravidlo zriedenia prekážok (len čísla v dátach), poloha Bratislavy (698, 490) a Londýna.

**Paľo overí na tablete (STOP po 4b):** polohy 8 špendlíkov na mape; či sú lety primerane ťažké (hlavne rýchlosť Londýna 500 a Lisabonu 600); či syn pochopí zašednutý špendlík → nádrž v hangári; ceny 150/300 voči zárobku. Hlas `dest_*`, `land_*` (12 ks): TTS zástupky cez Magnific v dávke po schválení, vlastné nahrávky neskôr.

---

## [x] 4c: Zvuky v hre (v1.1, pripomienky Paľa po teste)
**Cieľ:** Hra nie je nikde ticho. Zvuky sú už vygenerované v `assets/audio/sfx/`, úloha ich len zapojí.

**Súbory:** `src/systems/audio.js`, `data/voice.json`, nový blok `audio` v `data/airport.json`, `src/scenes/Flight.js`, `src/scenes/Airport.js`, `src/scenes/airport/bags.js`, `src/scenes/airport/gate.js`, `src/scenes/Payout.js`, `src/scenes/hangar/upgradePanel.js`, `docs/AUDIO.md`, `sw.js`. Viac ako 3 súbory → najprv plán architektovi.

**Zadanie:**
- **`audio.js`, kanály:** dnes `play()` vždy zastaví predošlý zvuk, takže efekt by prerušil hlas. Rozdeľ: hlas (kľúče bez `sfx_`) má jeden kanál ako dnes (nový hlas preruší starý hlas); efekty `sfx_*` hrajú cez seba a hlas neprerušia. `play(key, { volume })` a `loop(key, { volume })` cez GainNode; `loop` vráti aj `setVolume(v)`. Predvolená hlasitosť kľúča je voliteľné pole `volume` vo `voice.json` (chýba = 1). Chýbajúci súbor = ticho, ako dnes.
- **Nové kľúče vo `voice.json`** (súbory existujú): `sfx_cruise` (`sfx/cruise.mp3`, slučka, motory veľkého lietadla), `sfx_star` (`sfx/star.mp3`), `sfx_coins` (`sfx/coins.mp3`), `sfx_upgrade` (`sfx/upgrade.mp3`, pneumatický uťahovák), `sfx_airport` (`sfx/airport.mp3`, slučka, šum haly), `sfx_belt` (`sfx/belt.mp3`, slučka), `sfx_gate` (`sfx/gate.mp3`). Východiskové hlasitosti: cruise 0,35, star 0,6, coins 0,8, upgrade 0,8, airport 0,25, belt 0,4, gate 0,8.
- **Let:** `sfx_cruise` hrá v slučke celý let a zastaví sa pri odchode zo scény (aj cez ikonu domov). Výška tónu sleduje vodorovný pohyb lietadla: letí doprava = vyššie (zrýchlenie), doľava = nižšie (spomalenie), stojí = 1. Plynulo (vyhladené), rozsah a citlivosť v `airport.json` → `audio.cruise: { "rateMin": 0.85, "rateMax": 1.25, "vxForMax": 500, "smoothMs": 250 }`. Zber hviezdičky = `sfx_star` (rad troch za sebou znie trikrát, nesmie prerušiť hlas „Letíme do…").
- **Výplata:** ťuk na kôpku mincí = `sfx_coins` (raz na kôpku).
- **Hangár:** úspešná kúpa upgradu = `sfx_upgrade` (spolu s konfetami). Zašednutý panel bez zvuku.
- **Letisko:** `sfx_airport` potichu v slučke počas celej scény Airport, zastaví sa pri odchode. `sfx_belt` hrá v slučke, kým je aktívna stanica batožiny (rovnaký začiatok a koniec ako pohyb pruhov pásu z 3i). Otvorenie brány = `sfx_gate`.
- Všetky slučky zastav v `shutdown` scény. Žiadny zvuk nesmie hrať ďalej v nasledujúcej scéne.
- `docs/AUDIO.md`: doplň 7 nových zvukov do zoznamu (názov, kde hrá).

**Akceptačné kritériá:**
- Hlas stanice alebo cieľa dohrá celý, aj keď medzitým zaznie hviezdička, náraz alebo mince.
- Po odchode z letu, letiska a hangára (vrátane ikony domov) nehrá žiadna slučka; v `AudioContext` neostávajú bežiace zdroje (over počítadlom aktívnych slučiek v `audio.js`).
- Zmazanie ktoréhokoľvek mp3 hru nezhodí.
- Vzlet a pristátie znejú ako predtým (`sfx_engine` so zmenou výšky).

**Nesmie sa zmeniť:** texty a kľúče existujúcich hlasov, herné pravidlá, efekty z 3h/3i.

**Paľo overí na tablete:** hlasitosti (šum letiska má byť sotva počuteľný, motor v lete nesmie rušiť hlas), či zmena tónu pri pohybe do strán znie prirodzene, šev v slučkách.

---

## [x] 5a: Bezpečnostná kontrola (v1.2)
**Cieľ:** Nová stanica na letisku medzi batožinou a schodmi: kufor ide cez skener, syn vyberie veci, ktoré do lietadla nepatria.

**Súbory:** `data/airport.json`, `data/sprites.json`, `data/voice.json`, nový `src/scenes/airport/security.js`, `src/scenes/airport/flow.js`, `src/scenes/Airport.js`, `src/scenes/airport/shapes.js`, `sw.js`, docs.

**Zadanie:**
- `airport.json` → nová stanica `security` v poradí checkin → bags → **security** → boarding → gate, s vlastným `x`, `y`, `w` (rozmiestni stanice tak, aby sa neprekrývali; ostatným staniciam hýb len `x`). Parametre v `airport.json` → `security`: `{ "bags": 3, "itemsPerBag": 3, "forbiddenPerBag": [1, 2] }`.
- Priebeh: cez skener prejdú postupne 3 kufre. Skener ukáže obsah kufra ako 3 veľké ikony (≥ 96 px). Zakázané veci (fľaša s vodou, nožnice) syn **potiahne do koša** vedľa skenera; povolené (macko, tričko, kniha) nechá. Keď v kufri neostane nič zakázané, svetlo zozelenie a kufor odíde sám. Povolená vec potiahnutá do koša sa vráti späť so zatrasením (žiadny trest). Nečinnosť 8 s = zakázaná vec pulzuje + zopakuje sa hlas.
- Zoznam vecí a ich typ (`allowed`/`forbidden`) je v `data/airport.json` → `security.items`, nie v kóde.
- Smajlík: kufor vyriešený bez chybného ťahu = +1 smajlík do `smiles` (ide do prepitného cez existujúci výpočet).
- Hlas: `st_security` („Čo do lietadla nepatrí? Daj to do koša.").
- Grafika: záložné tvary (rám skenera, kôš, jednoduché ikony vecí kreslené tvarmi). Mená budúcich spritov (`bld_skener`, `ui_kos`, `item_flasa`, `item_noznice`, `item_macko`, `item_tricko`, `item_kniha`) **do `data/` zatiaľ nedávaj**: Preload načíta každé meno z dát a chýbajúci súbor by dal chybu v konzole. Kód nech pýta `role('scanner')`, `role('bin')` a sprite veci z poľa `sprite` v položke (zatiaľ bez neho) → `addSprite` vráti `null` → záložný tvar. Mená doplní úloha „zapojenie spritov".

**Akceptačné kritériá:**
- Stanica sa aktivuje až po batožine a schody až po nej; celý Airport sa dá dohrať.
- Každý kufor má 1–2 zakázané veci, náhodne; vždy sa dá dokončiť.
- Chybný ťah nič neberie; `smiles` rastie len za čisté kufre.
- `Airport.js` ostáva len skladačka (logika v `security.js`), všetko < 300 riadkov.

**Nesmie sa zmeniť:** správanie check-inu, batožiny, schodov a brány; argumenty do Takeoff `{ to, passengers, smiles }`.

**Paľo overí na tablete (STOP po 5a):** či syn rozumie, čo je zakázané; veľkosť ikon a koša; či 3 kufre nie sú zdĺhavé. **Dávka Magnific (po schválení):** 7 spritov vyššie (prompty doplní architekt do `docs/SPRITES.md`), TTS `st_security`.

---

## [x] 5b: Zapojenie spritov a zvukov bezpečnostnej kontroly (v1.2)
**Cieľ:** Bezpečnostná kontrola používa nové obrázky a zvuky namiesto záložných tvarov. Súbory už sú v repozitári, úloha ich len zapojí.

**Súbory:** `data/sprites.json` (roly), `data/airport.json` (sprite vecí, veľkosti), `data/voice.json` (`sfx_bin`), `src/scenes/airport/security.js`, `src/scenes/airport/shapes.js`, `src/scenes/Airport.js` (ak treba), `src/systems/sprites.js` (ak `allKeys` nepozná sprity vecí), `docs/AUDIO.md`, `sw.js`.

**Nové súbory (existujú):** `assets/sprites/bld/bld_skener.png` (512×358), `assets/sprites/ui/ui_kos.png` (206×256), `assets/sprites/item/item_flasa.png`, `item_noznice.png`, `item_macko.png`, `item_tricko.png`, `item_kniha.png` (dlhšia strana 192), `assets/audio/voice/sk/st_security.mp3` (kľúč už je vo `voice.json`), `assets/audio/sfx/bin.mp3`.

**Zadanie:**
- Roly `scanner: "bld_skener"`, `bin: "ui_kos"` v `sprites.json`; každej veci v `airport.json` → `security.items` pridaj `sprite`. Preload ich musí načítať (over `allKeys()`), záložné tvary ostávajú ako záloha.
- Skener pri stanici: sprite stojí na zemi ako ostatné stanice (spodok na úrovni podlahy), šírka z dát. Stavové svetlo (červená/zelená) a bodky za vyriešené kufre musia ostať viditeľné a čitateľné aj so spritom (sprite má vlastné červené svetlo hore: stavové svetlo daj naň alebo tesne nad neho).
- Veci v paneli: zachovaj pomer strán spritu, dlhšia strana = `panel.itemSize`; zásahová plocha ostáva ≥ 96 px. Kôš: sprite vo veľkosti `panel.binSize`, vec mizne do jeho otvoru (horná tretina).
- Zvuk: `sfx_bin` (`sfx/bin.mp3`, hlasitosť 0,8) pri vhodení zakázanej veci do koša. Hlas `st_security` sa už prehráva cez stanicu, len over, že súbor hrá.
- `sw.js`: `CACHE_VERSION` +1 a 7 nových spritov do `PRECACHE`.

**Akceptačné kritériá:** celé letisko prejde ako po 5a; v konzole žiadna chyba načítania; skener, kôš a všetkých 5 vecí sú sprity; po zmazaní ktoréhokoľvek spritu sa ukáže záložný tvar; rozmiestnenie staníc sa nezmení.

**Nesmie sa zmeniť:** pravidlá stanice z 5a (chyba len pri povolenej veci v koši, prvý kufor 1 zakázaná vec, smajlíky), ostatné stanice.

**Paľo overí na tablete (STOP po 5b):** či syn pochopí, čo je zakázané; veľkosť vecí a koša; či 3 kufre nie sú zdĺhavé; ako skener sedí medzi stanicami.

---

## [x] 6a: Hádanka Arrows, engine + 2 levely (v1.3)
**Cieľ:** Samostatná scéna `Apron` (pohľad zhora): na mriežke stoja vozidlá so šípkou. Ťuk na vozidlo = odíde v smere šípky, ak má voľnú cestu až po okraj. Keď je plocha prázdna, cesta na dráhu je voľná. Zatiaľ sa spúšťa len pre test, do slučky ju zapojí 6b.

**Súbory:** nový `data/puzzles.json`, `src/systems/data.js` (načítanie + validácia), nový `src/scenes/Apron.js`, nový `src/scenes/apron/board.js` (čistá logika bez Phaseru), `src/main.js`, `sw.js`, docs.

**Zadanie:**
- `puzzles.json`: `[{ "id": "p1", "cols": 4, "rows": 3, "pieces": [{ "x": 0, "y": 1, "dir": "right", "kind": "car" }, …] }]`. `dir` = `up|down|left|right`, `kind` = `car|bus|truck` (len vzhľad).
- `board.js`: `canMove(piece)` (cesta po okraj bez iného dielika), `remove(piece)`, `isClear()`, `isSolvable(level)` (pažravo: kým sa dá, odober pohyblivý dielik; pri týchto pravidlách je to úplný test). `data.js` pri načítaní zavolá `isSolvable` na každý level a neriešiteľný nahlási ako chybu dát.
- Scéna: bunka ≥ 150 px, vozidlo = farebný obdĺžnik s veľkou šípkou (záložný tvar). Kód pýta `role('bgApronTop')` a `role('car')`/`role('bus')`/`role('truck')`, ale roly do `sprites.json` zatiaľ **nedávaj** (súbory nie sú, chýbajúci súbor = chyba v konzole); doplnia sa po dodaní spritov. Voľné vozidlo po ťuku plynulo odíde z obrazovky. Zablokované sa len zatrasie a krátko blikne vozidlo, ktoré mu stojí v ceste. Nečinnosť 8 s = pulzuje jedno vozidlo, ktoré sa dá pohnúť. Po vyčistení krátka oslava a `scene.start(next, data)` (odovzdá prijaté argumenty ďalej nezmenené).
- 2 levely: 4 a 6 vozidiel. Hlas `st_apron` („Uvoľni cestu. Ťukni na auto, ktoré môže odísť.").
- Dočasný vstup pre test: `Apron` sa dá spustiť z konzoly (`game.scene.start('Apron', …)`), v hre sa ešte nevolá.

**Akceptačné kritériá:**
- Oba levely sa dajú dohrať; zablokovaný ťuk nič nepokazí; neexistuje slepá ulička.
- `board.js` nemá import Phaseru a v prehliadači prejde krátky samotest (pár `console.assert` spustených len pri `?test=1`).
- Hlavná slučka hry je bez zmeny.

**Nesmie sa zmeniť:** žiadna existujúca scéna okrem zoznamu v `main.js`.

---

## [x] 6b: Hádanka Arrows, 8 levelov a zapojenie do slučky (v1.3)
**Cieľ:** Hádanka je súčasťou letu: Airport → **Apron** → Takeoff. Náročnosť rastie so vzdialenosťou cieľa.

**Súbory:** `data/puzzles.json`, `data/flights.json`, `src/scenes/Airport.js` alebo `airport/gate.js` (kam ide po bráne), `src/scenes/Apron.js`, `sw.js`, docs.

**Zadanie:**
- 8 levelov: 2× ľahký (4–5 vozidiel, mriežka 4×3), 3× stredný (6–8, 5×3), 3× ťažký (9–12, 5×4, aspoň 3 vozidlá na začiatku zablokované). Každý prejde `isSolvable`.
- `flights.json` → pole `puzzles: ["p1","p2"]` pri každej trase (krátke trasy ľahké, Lisabon ťažké). Scéna vyberie z poľa ten, ktorý sa pre túto trasu hral najdávnejšie (stačí počítadlo v pamäti hry, nie v save).
- Po bráne ide hra do `Apron` s `{ to, passengers, smiles }` a odtiaľ do `Takeoff` s tými istými argumentmi. Level bez chybného ťuku = +1 smajlík.
- Trasa bez `puzzles` hádanku preskočí.

**Akceptačné kritériá:** celá slučka pre všetky destinácie; argumenty do Takeoff prídu úplné; ikona domov funguje aj v `Apron`; mince a rekordy bez zmeny.

**Nesmie sa zmeniť:** stanice letiska, vzlet, let, pristátie.

**Paľo overí na tablete (STOP po 6b):** či syn pochopí pravidlo bez vysvetlenia; ťažké levely (frustrácia?); či hádanka pri každom lete neotravuje (ak áno, zredukuje sa cez dáta). **Dávka Magnific (po schválení):** `bg_letisko_top`, 3 vozidlá zhora, TTS `st_apron`.

---

## [x] 7a: Kvíz s vlajkami po pristátí (v1.4)
**Cieľ:** Po pristátí syn vyberie vlajku krajiny, kde pristál. Správne na prvý pokus = bonus do prepitného.

**Súbory:** `data/economy.json`, `data/voice.json`, `src/scenes/Landing.js` (+ nový `src/scenes/landing/quiz.js`), `src/systems/economy.js`, `src/scenes/Payout.js`, `sw.js`, docs.

**Zadanie:**
- Landing dnes: ťuk na vlajku → Payout. Nové: po hlase `land_<id>` zaznie `quiz_flag` („Ktorá vlajka sem patrí?") a namiesto jednej vlajky sa ukážu **4 vlajky** v rade (správna + 3 náhodné z ostatných `destinations.json`; ak ich je málo, doplň z `economy.json` → `quiz.extraFlags`), každá ≥ 160 px široká, medzery ≥ 40 px.
- Správny ťuk: vlajka sa zväčší, ostatné zmiznú, oslava, potom Payout. Nesprávny: vlajka sa zatrasie a zašedne (nedá sa znova ťuknúť), hrá sa ďalej. Nečinnosť 8 s = zopakuje sa hlas (správnu vlajku neprezrádzaj).
- `economy.json` → `quiz: { "options": 4, "tipFirstTry": 5, "extraFlags": ["flag_at","flag_cz","flag_pl","flag_hu"] }`. `economy.payout(passengers, smiles, stars, quiz)` pripočíta `tipFirstTry` do prepitného, len ak bol prvý pokus správny. Payout to ukáže v kôpke prepitného (žiadna nová kôpka).
- Pri pristátí doma (`bts`) kvíz nie je, správanie ako dnes.

**Akceptačné kritériá:** správna vlajka je vždy medzi možnosťami a na náhodnej pozícii; výplata s bonusom = stará + 5; bez bonusu presne ako predtým; novo použité vlajky v `PRECACHE`.

**Nesmie sa zmeniť:** počasie, pozadie a hlas v Landing; základ výplaty; uloženie mincí a rekordu hneď pri vstupe do Payout.

**Paľo overí na tablete (STOP po 7a):** či 4 vlajky nie sú príliš ťažké/ľahké; či syn vlajky rozozná. mp3 `quiz_flag`.

---

## [x] 4d: Viac Európy na mape (v1.4, Paľo schválil 2026-11-11)
**Cieľ:** Na dnešnej mape Európy pribudne 6 miest s vlajkami, ktoré už máme. Bez nových obrázkov. Všetky sú v základnom dolete (do 1500 km), takže sú hneď otvorené; vzdialenejšie sú ťažšie rýchlosťou a lepšie platené (`payMult`) ako v 4b.

**Prečo nie Viedeň, Praha, Budapešť:** sú od Bratislavy 55 až 290 km, na mape 1280 px je to 15 až 85 px, špendlíky by sa prekrývali s Bratislavou. Prídu s priblíženou mapou (samostatná úloha neskôr).

**Súbory:** `data/destinations.json`, `data/flights.json`, `data/voice.json`, `docs/AUDIO.md`, `sw.js`. Kód len ak treba (Map.js má poradie kreslenia podľa `y` a výber najbližšieho špendlíka z 4b).

**Mestá** (km z Bratislavy, `unlockCost` nedávaj):

| id | mesto | vlajka | km | počasie | skyline / stromy | dur s | speed | payMult | puzzles |
|---|---|---|---|---|---|---|---|---|---|
| ~~var~~ | ~~Varšava~~ | | | | | | | | **Nahradené Helsinkami** (Poľsko leží priamo nad Bratislavou, vlajky by sa prekrývali) |
| zur | Zürich | `flag_ch` | 680 | sun | domy / ihličnaté | 40 | 440 | 1.0 | p1, p3 |
| ams | Amsterdam | `flag_nl` | 1050 | rain | domy / listnaté | 45 | 480 | 1.2 | p2, p4 |
| sto | Štokholm | `flag_se` | 1250 | rain | historické / ihličnaté | 45 | 500 | 1.2 | p4, p5 |
| ath | Atény | `flag_gr` | 1240 | sun | historické / palma | 45 | 500 | 1.2 | p5, p2 |
| ist | Istanbul | `flag_tr` | 1250 | sun | púšť (`env_skyline_pustatina`, kupola a minarety) / palma | 45 | 500 | 1.2 | p4, p5 |
| fin | Helsinki | `flag_fi` | 1400 | rain | domy / ihličnaté | 45 | 500 | 1.2 | p4, p5 |

Prekážky a hviezdičky ako ostatné trasy (`cloud` 2.4, `bird` 4.5, `stars` 2.5 s oblúkom, `thinAfterHits` 3).

**Polohy špendlíkov:** urči podľa `assets/sprites/map/map_01_europa.jpg`: hrot vnútri krajiny, vlajka (96 px nad špendlíkom) celá na obrazovke a **nezakrýva iný špendlík ani vlajku**, zásahové plochy sa smú dotýkať, ale ťuk musí ísť na najbližší špendlík. Polohy existujúcich 8 miest nemeň. Rizikové dvojice: Amsterdam–Londýn, Varšava–Berlín/Bratislava, Zürich–Paríž/Berlín. Ak sa niektoré mesto nedá umiestniť bez prekrytia, nahraď ho: Oslo (`flag_no`, 1350, rain, historické / ihličnaté) alebo Helsinki (`flag_fi`, 1400, rain, domy / ihličnaté), rovnaké parametre letu ako Štokholm. Napíš to v pláne.

**Hlas:** kľúče `dest_<id>` a `land_<id>` (`landVoice` ak ho 4b zaviedol) s textami: „Letíme do Varšavy / Zürichu / Amsterdamu / Štokholmu / Atén / Istanbulu." a „Vo Varšave svieti slnko." „V Zürichu svieti slnko." „V Amsterdame prší." „V Štokholme prší." „V Aténach svieti slnko." „V Istanbule svieti slnko." Súbory zatiaľ nie sú (ticho), architekt ich vygeneruje v dávke.

**Kvíz:** nové vlajky sa automaticky stanú možnosťami v kvíze (berú sa z `destinations.json`). Over, že `quiz.extraFlags` nevytvorí duplicitu s novými destináciami.

**Akceptačné kritériá:** 14 špendlíkov, žiadne prekrytie vlajok a špendlíkov; všetkých 6 nových miest hneď otvorených; let do každého prejde celú slučku (letisko, hádanka, let, pristátie so správnou vlajkou, počasím a skyline, kvíz, výplata s `payMult`, rekord `bts-<id>`); starý save bez straty; nové sprity (`flag_pl`, `flag_ch`, `flag_nl`, `flag_se`, `flag_gr`, `flag_tr`, `env_skyline_pustatina`) v `PRECACHE`, `CACHE_VERSION` +1.

**Nesmie sa zmeniť:** polohy a parametre existujúcich 8 miest, stupne doletu a ich ceny, save.

**Paľo overí na tablete:** či mapa so 14 špendlíkmi nie je preplnená a či sa dá trafiť správny špendlík; skyline Istanbulu.

---

## [x] 8a: Búrkové mraky a dážď počas letu (v1.5, nápad syna)
**Cieľ:** Pri lete do miesta, kde prší, sa biele mraky postupne menia na tmavé búrkové a začne pršať.

**Súbory:** `data/flights.json`, `src/scenes/flight/spawner.js`, `src/scenes/flight/shapes.js`, `src/scenes/Flight.js` (+ nový `src/scenes/flight/weather.js`), `sw.js`, docs.

**Zadanie:**
- `flights.json` → voliteľné `weather: { "stormFrom": 0.55, "stormCloudEvery": 1.6, "rain": true }` pri trasách do destinácií s `weather: "rain"` (lon, par, dub). `stormFrom` = podiel letu (0–1).
- Do `stormFrom` let ako dnes. Potom: nové mraky sú `role('stormCloud')` (väčšie, ~1,3×, rovnaký náraz ako biely mrak), interval mrakov sa plynulo skráti na `stormCloudEvery`, obloha počas ~3 s stmavne (závoj, nie čierna) a pridá sa dážď (šikmé čiarky kreslené kódom, bez spritu). Vtáky v búrke nelietajú. **Žiadne blesky ani hrom.**
- Zriedenie po nárazoch (`thinAfterHits`) platí aj v búrke. Hviezdičky ostávajú.
- Zvuk `sfx_rain` (slučka cez `audio.loop`, zastav pri odchode zo scény).

**Akceptačné kritériá:** let do Berlína/Ríma bez zmeny; let do Londýna po ~55 % stmavne, prší a mraky sú tmavé; prechod do Touchdown so všetkými argumentmi; dážď max ~80 čiarok naraz (plynulosť overí Paľo na tablete po 8b).

**Nesmie sa zmeniť:** ovládanie letu, hitbox lietadla, pravidlá nárazu a hviezdičiek.

---

## [x] 8b: Vietor počas letu (v1.5)
**Cieľ:** Na dlhých trasách občas zafúka vietor a jemne tlačí lietadlo hore alebo dole; syn to vyrovnáva prstom.

**Súbory:** `data/flights.json`, `src/scenes/flight/weather.js`, `src/scenes/Flight.js`, `data/voice.json`, `sw.js`, docs.

**Zadanie:**
- `flights.json` → voliteľné `wind: { "every": 9, "durationSec": 3, "push": 120 }` (dub, mad, lis). Počas poryvu sa cieľová výška lietadla posunie o `push` px (smer náhodne hore/dole, plynulý nábeh a dobeh 0,5 s). Lietadlo nikdy neopustí hracie pásmo.
- Poryv je vidno 1 s vopred: cez obrazovku preletia svetlé čiary v smere vetra + `sfx_wind`. Počas poryvu nevznikajú nové prekážky vo výške, kam vietor tlačí (aby náraz nebol nevyhnutný).

**Akceptačné kritériá:** trasy bez `wind` bez zmeny; s vetrom sa lietadlo viditeľne posunie a dá sa prstom vyrovnať; žiadny nevyhnutný náraz v simulácii 3 letov.

**Nesmie sa zmeniť:** 8a, zriedenie prekážok, výplata.

**Paľo overí na tablete (STOP po 8b):** sila vetra (`push`) a hustota búrky; či syna búrka nestraší. mp3 `sfx_rain`, `sfx_wind`.

---

## [ ] 9a: Aktívne lietadlo v save (v1.6, bez viditeľnej zmeny)
**Cieľ:** Kód prestane predpokladať jediné lietadlo (`data.get('planes')[0]`), aby 9b mohla pridať ďalšie.

**Súbory:** `src/systems/save.js`, `src/systems/economy.js`, `src/systems/sprites.js`, scény, ktoré volajú `planes[0]` alebo `addPlane` (nájdi grepom), `data/airport.json` (stanica boarding má natvrdo `plane_zelene_side`), `sw.js`, docs.

**Zadanie:**
- Save v2: `activePlane: "zelene"`, `owned: ["zelene"]`. Migrácia v1 → v2 doplní obe polia, nič iné nemení. Nový save dostane lietadlo s cenou 0.
- `save.load` spája save s predvolenými hodnotami len plytko, takže starému save chýba záznam pre lietadlo pridané neskôr. Po načítaní doplň `planes[id] = { capacity: 0, range: 0 }` pre každé lietadlo z `planes.json`, ktoré v save nie je (existujúce nemeň). Inak 9b spadne v `economy` na `undefined`.
- `economy.activePlane()` vráti položku z `planes.json` podľa save (neznáme id → prvé lietadlo). Všetky scény berú lietadlo odtiaľ; `addPlane` kreslí sprite aktívneho lietadla. Stanica boarding berie sprite z aktívneho lietadla, nie z `airport.json`.

**Akceptačné kritériá:** hra vyzerá a hrá sa presne ako predtým; starý save v1 sa načíta s mincami, upgradmi a rekordmi; po dočasnom pridaní druhého lietadla do `planes.json` sa starý save načíta bez chyby (potom vráť); v kóde neostane `planes')[0]` ani natvrdo `zelene` (okrem dát).

**Nesmie sa zmeniť:** nič viditeľné.

**STOP pred 9b (dávka Magnific, jedno schválenie):** 6 spritov `plane_modre_*`, `plane_cervene_*` × `side|air|top` podľa `docs/SPRITES.md` §8 (zlaté neskôr).

---

## [ ] 9b: Kúpa a výber lietadla v hangári (v1.6)
**Cieľ:** V hangári sa dajú kúpiť 2 ďalšie lietadlá a prepínať medzi nimi.

**Súbory:** `data/planes.json`, `src/scenes/Hangar.js` (+ nový `src/scenes/hangar/planePicker.js`), `src/systems/economy.js`, `sw.js`, docs.

**Zadanie:**
- `planes.json`: `modre` (`cost` 400, kapacita 6 → 8 → 10, dolet 2000 → 2600 → 3200), `cervene` (`cost` 900, kapacita 10 → 12 → 14, dolet 2600 → 3200). `zelene` dostane `cost: 0`.
- Hangár: dole rad miniatúr lietadiel (≥ 140 px). Vlastnené = farebné, ťuk ho vyberie (`activePlane`) a veľké lietadlo sa vymení. Nevlastnené = zašednuté s mincou a cenou; ťuk pri dostatku mincí kúpi a vyberie, inak zatrasie. Upgrady (kapacita, dolet) sa vždy týkajú vybraného lietadla.
- Sedadlá na letisku a v hangári: pri kapacite nad 8 zmenši alebo zalom bodky, aby sa zmestili; check-in pri 14 cestujúcich nesmie byť zdĺhavý, preto `airport.json` → `checkin.maxTaps: 6` (ďalší cestujúci prejdú sami).

**Akceptačné kritériá:** kúpa odpočíta mince raz; výber prežije reštart; upgrady každého lietadla sú oddelené; let, vzlet aj pristátie kreslia vybrané lietadlo; chýbajúci sprite = záložný tvar, nie pád.

**Nesmie sa zmeniť:** ceny a upgrady zeleného lietadla, mapa, výplata na cestujúceho.

**Paľo overí na tablete (STOP po 9b):** ceny lietadiel voči zárobku; mierka nových lietadiel voči schodom a stojisku.

---

## [ ] 10: Budovanie letiska (v1.7), brief zatiaľ nie je
Najväčšia položka roadmapy a jediná bez dizajnu. Brief sa nepíše naslepo. Pred ňou architekt položí Paľovi (AskUserQuestion) tieto otázky a rozdelí ju na 3–4 úlohy:
1. Čo sa stavia: nové stanice (kaviareň, obchod), ozdoby (stromy, lampy), alebo budovy, ktoré zvyšujú zárobok?
2. Kde: samostatná scéna „moje letisko" zhora, alebo priamo dnešné letisko zboku?
3. Čím sa platí: mince (súťažia s upgradmi lietadla), alebo nová surovina z letov?
4. Má stavba vplyv na hru (viac cestujúcich, prepitné), alebo je len na radosť?
5. Kresby syna: ktoré budovy nakreslí (podklad pre sprity)?

---

## Roadmapa v2: briefy

## [x] R1a: Dvojité „Uvoľni" v hádanke (oprava)
**Cieľ:** Na začiatku hádanky Arrows zaznie veta `st_apron` presne raz. Paľo na tablete pri **každej** hádanke počuje „Uvoľni… Uvoľni cestu" (dvakrát, prvé slovo sa opakuje).

**Súbory:** `src/scenes/Apron.js`, `src/scenes/Airport.js` (r. ~91, prechod do Apron), `src/ui/fx.js` (`go`), `src/systems/audio.js`; podľa príčiny len tie, ktoré treba.

**Zadanie (diagnostika, potom najmenšia oprava):**
- Over v Browser paneli dočasným logom (potom odstráň), koľkokrát sa pri jednom vstupe do hádanky zavolá `Apron.create` a `audio.play('st_apron')`. Podozrenia v poradí: (1) prechod do Apron sa spustí dvakrát (dvojitý `fx.go` po bráne alebo `scene.start` dvakrát) a vzniknú dve prehrávania o pár stoviek ms posunuté; (2) `audio.play` rovnaký kľúč spustí dvakrát (napr. čaká na načítanie a potom prehrá aj z cache); (3) `idleCheck` vystrelí hneď na štarte (napr. `lastAct` z iného času).
- Ak je príčina v kóde, oprav ju. Ak kód volá prehranie raz a raz ho aj spustí, chyba je v nahrávke: napíš to architektovi (pregeneruje `st_apron`, má Paľovo schválenie) a kód nemeň.
- Ak oprava patrí do spoločného kódu (`fx.go`, `audio.play`), ochráň aj ostatné scény (napr. hlas rovnakého kľúča sa nespustí znova, kým ešte hrá).

**Akceptačné kritériá:** pri vstupe do hádanky jedno `create` a jedno spustenie `st_apron`; nápoveda po 8 s nečinnosti hlas zopakuje ako doteraz; ostatné scény (letisko, vzlet, pristátie) majú hlasy bez zmeny; konzola bez chýb.

**Nesmie sa zmeniť:** logika hádanky, levely, poradie scén.

---

## [x] R1b: Let z miesta pristátia
**Cieľ:** Lietadlo štartuje tam, kde naposledy pristálo (SK → GR, potom GR → TR alebo domov). Bratislava je normálny cieľ s pristátím a hlásením počasia. Dĺžka letu, rýchlosť, výplata a hádanky sa počítajú zo vzdialenosti medzi dvoma mestami, nie z ručných trás `bts-x`.

**Rozhodnutie Paľa:** dolet sa meria **od miesta, kde lietadlo stojí**. Bratislava je dosiahnuteľná vždy (syn nikdy neuviazne).

**Súbory:** `data/destinations.json`, `data/flights.json`, `src/systems/data.js` (validácia, `data.flight`), nový `src/systems/routes.js`, `src/systems/save.js`, `src/systems/economy.js`, `src/scenes/Map.js`, scény, ktoré odovzdávajú `to` (Airport, Takeoff, Flight, Touchdown, Landing, Payout; nájdi grepom `args.to`, `data.flight`, `bestStars`), `src/scenes/apron/pick.js`, `data/voice.json`, `docs/AUDIO.md`, `docs/ARCHITECTURE.md` (§3), `sw.js`, docs.

**Zadanie:**
- `destinations.json`: každé mesto dostane `geo: { lat, lon }` (skutočné súradnice letiska alebo mesta, 2 desatinné miesta). Pole `distance` zmaž. `routes.km(a, b)` = haversine, zaokrúhlené na 10 km. Skontroluj, že vzdialenosť z `bts` padne do rovnakého stupňa doletu (1500 / 2000 / 2600) ako dnešné `distance`. Odhad: ber ~550, zur ~650, rim ~780, ams ~980, par ~1090, ath ~1150, lon ~1230, ist ~1240, sto ~1250, fin ~1460, dub ~1680, mad ~1900, lis ~2440. Ak niektoré nesedí, napíš architektovi.
- Počasie patrí cieľu: búrku (`weather` z trasy) a vietor (`wind`) presuň z `flights.json` do destinácie ako `flightWeather` a `wind` (rovnaký tvar, rovnaké mestá: búrka par, lon, dub, ams, sto, fin; vietor dub, mad, lis). Platí pre každý let do toho mesta.
- `flights.json` nový tvar: `{ "base": { obstacles, stars, thinAfterHits, thinFactor }, "byKm": [ { "upTo": 600, "durationSec": 35, "speed": 420, "payMult": 1, "puzzles": ["p1","p3"] }, … ] }`. Stupne nastav tak, aby lety z Bratislavy ostali ako dnes: ≤600 → 35/420/1/[p1,p3]; ≤850 → 40/445/1/[p1,p3]; ≤1150 → 45/480/1,2/[p2,p4]; ≤1450 → 45/500/1,2/[p4,p5]; ≤2000 → 55/550/1,5/[p4,p5,p6,p7]; zvyšok → 65/600/2/[p6,p7,p8]. Posledný stupeň bez `upTo`.
- `routes.flight(from, to)` vráti objekt v tvare, aký dnes dostáva Flight (base + stupeň podľa km + `weather`/`wind` cieľa + `from`, `to`, `km`). `data.flight(to)` nahraď, všetky volania prepíš. Validácia v `data.js`: `geo` povinné, `byKm` zoradené, hádanky existujú, búrka/vietor v destinácii (prenes dnešné kontroly).
- Save v2 (`SAVE_VERSION` 2): `location: "bts"`. Migrácia 1 → 2 doplní `location`, nič iné nemení. `bestStars` ostávajú s kľúčmi `from-to` (staré `bts-x` platia ďalej, nové páry začínajú 0, v `defaults` netreba vopred plniť všetky páry). Pozor: `load` spája s predvolenými hodnotami len plytko.
- Mapa: namiesto konštanty `HOME` platí `save.location`. Pri špendlíku polohy značka „Si tu" (malé lietadlo cez `addPlane`/sprite aktívneho lietadla nad špendlíkom + jemne pulzujúci krúžok, záložný tvar). Ťuk na vlastnú polohu = poskočí ako dnes domov. Otvorené mesto: `id === 'bts'` alebo `km(location, d) <= planeRange`. Pole `unlocked` už o otvorení nerozhoduje (v save ostáva). Zamknutý špendlík sa správa ako dnes (nádrž).
- Do `args` celej slučky pribudne `from` (= poloha pri štarte). `save.location = to` sa zapíše **v Landing pri vstupe** (lietadlo pristálo). Odchod domov ikonou počas letisku alebo letu polohu nemení.
- Pristátie v Bratislave: počasie `sun`, hlas `land_bts` („V Bratislave svieti slnko.", kľúč do `voice.json` + riadok v `AUDIO.md`; mp3 dodá architekt, dovtedy ticho), kvíz sa nespúšťa (dnes `dest.id !== 'bts'`, ponechaj). Kulisy `bts` už existujú.
- `ARCHITECTURE.md` §3: nový tvar `flights.json`, `geo`, `location` v save.

**Akceptačné kritériá:**
- Nová hra začína v Bratislave; lety z Bratislavy majú rovnakú dĺžku, rýchlosť, `payMult` a hádanky ako pred úlohou (v správe tabuľka 13 trás pred / po).
- Po pristátí v Aténach mapa ukáže „Si tu" pri Aténach; otvorené sú mestá do doletu od Atén a Bratislava; let ath → bts prejde celou slučkou (letisko, hádanka, vzlet, let, pristátie bez kvízu, výplata podľa km).
- Reštart (F5) zachová polohu; ikona domov počas letu polohu nezmení.
- Starý save v1 (vlož ručne do localStorage pred načítaním) sa načíta s mincami, upgradmi, rekordmi a `location: "bts"`.
- Búrka aj vietor fungujú pri lete do par/lon/dub aj z iného mesta než Bratislava.

**Nesmie sa zmeniť:** stanice letiska, minihry, ovládanie letu, správanie búrky a vetra, vzorec výplaty (`economy.payout`), hangár, ceny upgradov.

**Plán:** úloha mení dáta aj save, takže najprv plán architektovi.

---

## [x] R2a: Názov krajiny pod vlajkou pri pristátí
**Cieľ:** Pri pristátí sa pod vlajkou ukáže názov krajiny po anglicky a v miestnom jazyku, napr. „Finland / Suomi". Výnimka z pravidla „bez textu" (Paľo schválil).

**Súbory:** `data/destinations.json`, `src/scenes/Landing.js`, `src/systems/data.js`, `sw.js`, docs.

**Zadanie:**
- `destinations.json`: `countryName: { "intl": "Finland", "local": "Suomi" }` pre všetkých 14 miest. Miestny názov v pôvodnom písme (napr. `Greece / Ελλάδα`, `Türkiye`, `Sweden / Sverige`, `Ireland / Éire`). Ak sú oba rovnaké (napr. Spojené kráľovstvo: `United Kingdom`), zobrazí sa raz. Bratislava: `Slovakia / Slovensko`.
- Landing: text pod vlajkou, veľký (≥ 44 px), tmavý s bielym obrysom, objaví sa jemne (fade 300 ms) spolu s vlajkou. Veľkosť, farba a odstup v dátach (`airport.json` → `landing.countryText`).
- Validácia: `countryName.intl` a `.local` povinné.

**Akceptačné kritériá:** všetkých 14 miest má správny názov, text sa nezreže ani pri dlhom názve (`United Kingdom`), kvíz po pristátí funguje ako predtým.

**Nesmie sa zmeniť:** kvíz, hlas pri pristátí, výplata.

---

## [x] R2a2: Názov krajiny ostane do ťuknutia (oprava po R2a)
**Cieľ:** Po správnej vlajke v kvíze ostane zväčšená vlajka s názvom krajiny na obrazovke, kým syn neťukne (nech si názvy prečíta). Dnes sa po `quiz.doneMs` (1,2 s) scéna hneď prepne na výplatu.

**Súbory:** `src/scenes/landing/quiz.js`, `data/economy.json` (`quiz`), `src/systems/data.js` (ak treba), `sw.js`, docs.

**Zadanie:** po správnej odpovedi sa `onDone` nevolá časovačom, ale ťuknutím kamkoľvek (cez `input.js`, nie na ikonu domov). Ťuk je povolený až po poistke `quiz.tapAfterMs: 800` (rýchle dvojťuknutie nesmie hneď odbehnúť). Po `quiz.idleMs` nečinnosti zväčšená vlajka jemne pulzuje ako nápoveda (bez hlasu). Bratislava (bez kvízu) už dnes čaká na ťuk na vlajku, nemení sa. `doneMs` odstráň z dát aj validácie, ak sa už nepoužíva.

**Akceptačné kritériá:** po správnej vlajke sa scéna neprepne sama ani po 30 s; ťuk po 0,8 s prepne na výplatu s `quizFirstTry` ako doteraz; ťuk pred 0,8 s nič neurobí; nesprávna vlajka sa správa ako predtým; ikona domov funguje.

**Nesmie sa zmeniť:** logika kvízu, bonus za prvý pokus, Bratislava.

---

## [x] R2b: Paralaxa pri pristátí
**Cieľ:** Pri pristávaní sa panoráma mesta (skyline) posúva pomalšie ako dráha a stromy, aby scéna pôsobila hlbšie.

**Súbory:** `src/scenes/Touchdown.js`, `src/scenes/touchdown/scenery.js`, `data/airport.json`, `sw.js`, docs.

**Zadanie:** vrstvy kulís dostanú koeficient posunu z dát (`airport.json` → `landing.parallax: { "skyline": 0.35, "trees": 0.7, "tower": 0.7 }`, dráha a svetlá = 1). Skyline musí byť dosť široký (alebo sa zopakuje), aby sa počas dojazdu neodkryl okraj.

**Akceptačné kritériá:** pri dojazde je posun vrstiev viditeľný, okraj skyline sa nikdy neukáže, stojisko a čísla na stojiskách fungujú ako predtým.

**Nesmie sa zmeniť:** priebeh pristátia (brzda, stojisko), kulisy podľa mesta.

---

## [x] R2c: Počasie pri pristávaní
**Cieľ:** Keď v cieli prší, prší aj počas pristávania: tmavšia obloha, sivé mraky, dážď. Zhoduje sa s hlásením („V Londýne prší").

**Súbory:** `src/scenes/Touchdown.js` (prípadne `Landing.js`, ak sa obloha kreslí tam), znovupoužiť dážď z `src/scenes/flight/weather.js` (ak treba, vyčleniť spoločnú časť do `src/ui/rain.js`), `data/airport.json` alebo `data/sprites.json` (`fx`), `sw.js`, docs.

**Zadanie:** podľa `weather` cieľa (`rain`) stmavni oblohu a závoj ako v búrke počas letu, pridaj 3–4 sivé mraky v pozadí a dážď (max ~60 čiarok), slučka `sfx_rain` počas pristátia, pri odchode zo scény ticho. `sun` = bez zmeny.

**Akceptačné kritériá:** Londýn, Paríž, Dublin, Amsterdam, Štokholm, Helsinki pristávajú v daždi; Berlín, Rím, Bratislava bez dažďa; po odchode zo scény žiadna slučka zvuku ani kvapky; plynulosť ako pri búrke v lete.

**Nesmie sa zmeniť:** búrka počas letu, priebeh pristátia.

**STOP po R2c: tablet** (dvojité „Uvoľni", let z miesta pristátia, názvy krajín, paralaxa, dážď pri pristátí).

---

## [x] R2e: Tváre cestujúcich v lete
**Cieľ:** Nárazy do mrakov a vtákov majú viditeľný, mierny vplyv na prepitné. Dnes nemajú žiadny (len zatrasenie a zriedenie po 3 nárazoch). Rozhodnutie Paľa (2026-11-11): rad tvárí cestujúcich počas letu. Mince sa nikdy neodpočítavajú.

**Súbory:** nový `src/scenes/flight/faces.js`, `src/scenes/Flight.js` (napojenie na náraz a na koniec letu), `src/scenes/Payout.js` (ak treba zobraziť), `data/flights.json` (`base.faces`) alebo `data/sprites.json` (`fx.faces`), `src/systems/data.js`, `docs/design-notes.md` (pravidlo prepitného), `sw.js`, docs.

**Zadanie:**
- Hore uprostred HUD rad okrúhlych tvárí kreslených kódom, jedna za každého cestujúceho (`args.passengers`). Pri viac ako 8 sa zmenšia, aby sa zmestili. Na začiatku letu sú všetky usmiate.
- Náraz: najbližšia usmiata tvár sprava zosmutnie (zmena úst + krátke zatrasenie tváre). Ak sú všetky smutné, nič ďalšie.
- Zotavenie: po `recoverSec` (návrh 8 s) bez nárazu sa jedna smutná tvár znova usmeje (s malou iskrou). Opakuje sa, kým nie sú všetky usmiate.
- Koniec letu: počet usmiatych tvárí ide do `args` ako `flightSmiles` a pripočíta sa k `smiles` pre výplatu (`tipPerSmile` sa nemení). Výplata a Payout inak bez zmeny.
- Čísla v dátach: `recoverSec`, veľkosť tváre, rozostup, max veľkosť radu. Nezakryť počítadlo hviezdičiek ani ikonu domov.
- `design-notes.md`: doplniť, že spokojnosť cestujúcich v lete ovplyvňuje len prepitné a nikdy neodpočítava mince.

**Akceptačné kritériá:** let bez nárazu = +N smajlíkov (N = počet cestujúcich); 3 rýchle nárazy = 3 smutné tváre, po ~8 s pokoja sa postupne usmievajú; prepitné na výplate sa zmení presne o počet usmiatych tvárí; zriedenie prekážok po 3 nárazoch funguje ako predtým; búrka a vietor bez zmeny.

**Nesmie sa zmeniť:** pravidlá nárazu a hitbox, hviezdičky, základná výplata, smajlíky z letiska a hádanky.

---

## [x] R3a: Hangár: Motor a pomalší progres
**Cieľ:** Hra vydrží desiatky letov. Nový upgrade Motor (rýchlejší a kratší let), viac stupňov doletu, drahšie upgrady a prísnejšie zarábanie.

**Súbory:** `data/planes.json`, `data/economy.json`, `src/systems/economy.js`, `src/systems/routes.js`, `src/scenes/Hangar.js`, `src/scenes/hangar/upgradePanel.js`, `src/systems/save.js`, `data/voice.json`, `sw.js`, docs.

**Rozhodnutia Paľa (2026-11-11):** tempo ~40 letov, štart doletu 900 km, motor 3 stupne. Výplata (`economy.json`) sa nemení.

**Zadanie:**
- `planes.json` (lietadlo `zelene`):
  - `capacity`: 4 (0) → 6 (200) → 8 (500)
  - `range`: 900 (0) → 1100 (100) → 1300 (200) → 1500 (300) → 2000 (450) → 2600 (650)
  - nové `engine`: `{ value: 1, cost: 0 }` → `{ 0.9, 300 }` → `{ 0.8, 600 }`. Spolu 3300 mincí.
- Motor: `value` násobí `durationSec` letu (v `routes.flight` alebo pri štarte Flight, podľa aktívneho lietadla). Aby počet prekážok a hviezdičiek na let ostal rovnaký, intervaly `every` (prekážky, hviezdy, búrka, vietor) sa vynásobia rovnakým `value` a rýchlosť posunu (`speed`) sa vydelí `value`. Výplata ani `payMult` sa nemenia.
- Save v3 (`SAVE_VERSION` 3), migrácia 2 → 3: `planes[id].engine = 0`; prevod doletu bez straty: starý index 0/1/2 (1500/2000/2600) → nový 3/4/5. Kapacita index ostáva. Nový save začína na 900 km.
- Hangár: tretí upgrade s ikonou motora (kreslená kódom, záložný tvar; sprite neskôr), rovnaké ovládanie ako kapacita a dolet. Zvuk kúpy: existujúci `sfx_upgrade` (bez Magnificu). Ak sa 3 panely nezmestia, uprav rozloženie v `upgradePanel.js`, zásahová plocha ≥ 96 px.
- Mapa: pri 900 km z Bratislavy majú byť otvorené ber (530), zur (650), rim (810), plus Bratislava. Over aj, že kapacita 8 sa zmestí na letisku (check-in, sedadlá) a v tvárach R2e (`maxRow` 8).

**Akceptačné kritériá:** v správe tabuľka: pri priemernej výplate (odhadni z `economy.payout` pre 4/6/8 cestujúcich, typické hviezdy a smajlíky) koľko letov treba na každý upgrade a na všetky (cieľ ~40); starý save v2 s doletom 2000 ostane na 2000 a mince sa nezmenia; motor 0,8 skráti let do Berlína z 35 s na 28 s pri rovnakom počte prekážok; kúpa odpočíta mince raz.

**Nesmie sa zmeniť:** ovládanie hangára, mince sa nikdy neodpočítajú bez kúpy.

---

## [ ] R3b: Palivo a tankovanie
**Cieľ:** Lietadlo má nádrž. Let spotrebuje palivo podľa km, tankuje sa za mince. Mapa ukáže, kam sa s aktuálnym palivom dá doletieť.

**Otázky na Paľa pred zadaním:** kde sa tankuje (ťuk na nádrž na mape alebo v hangári), cena za plnú nádrž, či dolet = veľkosť nádrže.

**Návrh zadania:** save `fuel` (km v nádrži, nový save plný); nádrž = dolet lietadla; mesto je dosiahnuteľné, ak `km ≤ fuel`; ikona nádrže na mape s hladinou, ťuk = natankovať doplna za mince z `economy.json` (`fuelPerKm`), animácia čerpania + `sfx_fuel`. Poistka: najbližšie mesto (vrátane Bratislavy, ak je najbližšie) je dosiahnuteľné vždy; ak na tankovanie nie sú mince, natankuje sa zadarmo presne naň. 2 hlasy (napr. „Natankuj lietadlo.", „Nádrž je plná.").

**STOP po R3b: tablet** (tempo progresu, ceny, tankovanie zrozumiteľné pre syna).

---

## [ ] R2d: Noc (schválený nápad 11b)
**Cieľ:** Dlhé lety sú večer alebo v noci: tmavomodrá obloha, hviezdy, svetlá dráhy, svietiace okná mesta. Pri vzlete aj pristátí.

**Návrh zadania:** stupne `byKm` vo `flights.json` dostanú `time: day | dusk | night` (napr. do 1150 deň, do 2000 západ slnka, ďalej noc). Farby oblohy a závojov v dátach. V noci: hviezdy na oblohe (kódom), svetlá dráhy svietia, okná skyline žlté (prekrytie kódom), lietadlo má blikajúce svetlo na krídle. Hviezdičky na zbieranie musia ostať dobre viditeľné.

**Nesmie sa zmeniť:** počasie (v daždi v noci bez hviezd na oblohe), obtiažnosť.

---

## [ ] R3c: Nové lietadlá (= 9a + 9b)
Briefy 9a a 9b vyššie platia, s doplnením: lietadlá majú vlastné stupne motora (R3a) a nádrž (R3b). Čísla doladí architekt po R3b. **STOP pred:** dávka Magnific, 6 spritov.

---

## [ ] R4a: Hlásenia v miestnom jazyku pri odlete zo zahraničia
**Cieľ:** Keď lietadlo štartuje zo zahraničia, hlásenia na letisku zaznejú najprv po slovensky a potom v jazyku krajiny (en, de, fr, it, es, pt, nl, sv, el, tr, fi).

**Návrh zadania:** ~6 hlásení (check-in, kontrola, brána, nástup, vzlet, privítanie). `destinations.json` → `lang`. Kľúče `ann_<id>_<lang>` vo `voice.json`, prehrá sa slovenská veta a hneď po nej miestna. V Bratislave len slovenská. Chýbajúci mp3 = len slovenská. **STOP pred:** dávka Magnific ~66 hlasov (výber hlasov pre každý jazyk schváli Paľo).

---

## [ ] R4b: Nová mapa (brief zatiaľ nie je)
Rusko, bývalé ZSSR, Blízky východ, sever Afriky (Omán, SAE, Egypt, Mongolsko…). Rozdelí sa na 2–3 úlohy, prvá so 6–8 mestami. **PRED: otázky Paľovi** (ktoré mestá, prepínanie máp, kresba mapy, odomknutie novej mapy) a dávka Magnific (mapa, vlajky, skyline, hlasy).

---

## Schválené nápady (stručné zadania, plný brief dopíše architekt pred zadaním)
- **11a Prstence na oblohe:** v lete občas veľký dúhový kruh (kreslený kódom). Prelet stredom = 3 hviezdičky naraz + krátke zrýchlenie (2 s). Minúť ho nič nestojí. Počet a rozostup vo `flights.json`.
- **11b Deň, západ slnka, noc:** farba oblohy a závoj podľa trasy (dlhé trasy pristávajú pri západe alebo v noci), v noci svietia okná skyline a svetlá dráhy. Len farby a závoje, nastavenie v dátach trasy.
- **11c Živé letisko:** v pozadí letiska **len občas** vzlietne iné lietadlo (nie vozíky, žiadny ruch). Zmena počasia a prechod do noci po určitom čase hrania nadväzuje na 11b.
- **11d Vlastné sfarbenie lietadla:** v hangári 5 farieb trupu (odtieň cez kód), uložené v save, bez vplyvu na hru.

## Odložené nápady
- **Suveníry do zbierky** (namiesto albumu pohľadníc): originálny suvenír ako odmena za vzdialenú destináciu. Neskôr, treba kresby alebo Magnific.
- **Želania cestujúcich:** zatiaľ nie. Ak by každý zo 6 cestujúcich chcel inam, rozhodovanie je pre 6-ročného ťažké; systém treba najprv doladiť (napr. jedno spoločné želanie na let).
- **Pilot máva:** zamietnuté.
