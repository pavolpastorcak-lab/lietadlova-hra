# SPRITES: zoznam spritov a promptov (Magnific)

Každý prvok generuj **samostatne**, PNG-32 s priehľadným pozadím (`remove_background`), smer lietadiel doprava.
Súbor ulož ako `assets/sprites/<kategoria>/<nazov>.png`. Cieľové veľkosti sú podľa tabuľky v ARCHITECTURE.md (dlhšia strana), kód ich v scénach prispôsobí.

**Priorita:** P1 = zapojím v úlohe 3d (prvky, ktoré dnes hra kreslí zástupným tvarom), P2 = pripravené na ďalšie rozšírenia (zatiaľ nič nezapájam).

## Spoločný štýl (pridaj na začiatok každého promptu)
> Cute children's drawing style, thick black marker outline, bright flat crayon colours, simple friendly shapes, slightly wobbly hand-drawn lines, single object, centered, plain white background, no shadow, no text.

Ak má byť predmet z pohľadu zboku/zhora/spredu, napíš to do promptu (viď stĺpec Pohľad).

## Nové prefixy (rozšírenie tabuľky z ARCHITECTURE.md)
| Prefix | Priečinok | Použitie | Veľkosť |
|---|---|---|---|
| `map_` | `map/` | vrstvy mapy sveta | 1280×800 |
| `env_` | `env/` | prostredie: skyline, stromy, svetlá dráhy | pás 1280 šírka, strom/palma 256 výška |
| `item_` | `item/` | veci na vylepšenie lietadla | 128 |

## 1. Budovy a stanice letiska (`bld_`, 1024 px šírka, zboku)
| Súbor | Prompt (popis vzhľadu) | Používa | P |
|---|---|---|---|
| `bld_letisko_terminal` | airport terminal building seen from the side, long low glass building with big windows, small sloping roof, a few round lamps | pozadie Airport | 1 |
| `bld_veza` | airport control tower seen from the side, tall thin tower with a wide glass cabin on top, small antenna | Airport, Touchdown | 1 |
| `bld_checkin` | check-in corner seen from the front, long desk with a computer, a small conveyor and a big tall sign with a ticket icon (no text) | stanica checkin | 1 |
| `bld_pas` | luggage conveyor belt seen from the side, dark belt with rollers, small metal frame, rubber flaps at the end | stanica bags | 1 |
| `bld_gate_zatvorena` | airport gate seen from the front, closed double glass door with a small waiting sign (a plane icon, no text), grey frame | stanica gate | 1 |
| `bld_gate_otvorena` | the same gate with both doors open wide, warm light inside | stanica gate | 1 |
| `bld_schody` | mobile boarding stairs seen from the side, rolling metal staircase with handrail and small wheels, climbing to the right | stanica boarding | 1 |
| `bld_hangar` | big airplane hangar seen from the front, wide arched roof, huge open door, a little light on top | Hangár | 1 |
| `bld_rukav` | airport jet bridge (boarding tunnel) seen from the side, long covered corridor on two legs with a round cab at the end | veľké letiská | 2 |
| `bld_stojisko_top` | empty airplane parking stand seen from above, grey pad with yellow guide line and a round yellow start spot (no numbers) | top view letiska | 2 |

## 2. Ľudia (`person_`, 192 px výška, spredu, stoja, usmiati)
Všetci stoja rovno čelom, ruky pri tele (kufor sa kreslí osobitne).
| Súbor | Prompt | P |
|---|---|---|
| `person_muz_01` | friendly man traveller, short brown hair, blue jacket, grey trousers | 1 |
| `person_muz_02` | friendly man traveller, bald with a beard, orange shirt, dark trousers | 1 |
| `person_muz_03` | friendly older man traveller, white hair, green sweater, brown trousers, glasses | 1 |
| `person_zena_01` | friendly woman traveller, long black hair, red coat, blue jeans | 1 |
| `person_zena_02` | friendly woman traveller, blonde ponytail, yellow dress, small hat | 1 |
| `person_zena_03` | friendly woman traveller, curly brown hair, purple jacket, long skirt | 1 |
| `person_dieta_01` | small boy about 5 years old, short hair, green t-shirt, shorts, little backpack | 1 |
| `person_dieta_02` | small girl about 5 years old, two pigtails, pink dress | 1 |
| `person_dieta_03` | small boy about 7 years old, cap, red hoodie, jeans | 1 |
| `person_pilot_01` | friendly pilot, dark blue uniform with gold stripes on sleeves, captain hat, waving | 2 |
| `person_personal_01` | friendly airport staff woman at check-in, bright yellow vest, name badge (no text), headset | 2 |

## 3. Kufre (`bag_<velkost>_<farba>`, dlhšia strana 64 / 96 / 128 px, zboku)
Veľkosti: `maly` (64, malá taška s krátkou rúčkou), `stredny` (96, kufor s kolieskami a výsuvnou rúčkou), `velky` (128, veľký objemný kufor s dvoma popruhmi).
Farby: `cerveny`, `modry`, `zeleny`, `zlty`, `fialovy`. Spolu **15 súborov**, napr. `bag_stredny_modry`.
Prompt: *a [small bag | medium rolling suitcase | big suitcase with straps], seen from the side, [colour] body, black handle and wheels, one small sticker (star or heart, no text)*. P1.

## 4. Pozadia a prostredie
| Súbor | Veľkosť | Prompt | Používa | P |
|---|---|---|---|---|
| `bg_letisko_den` | 1280×800 | airport apron background, light sky, clouds, flat grey ground in the lower third, no buildings | Airport | 1 |
| `bg_pristatie_den` | 1280×800 | airfield landscape seen from the side, light blue sky, green grass and a wide grey runway with white dashes in the lower half, no buildings | Touchdown | 1 |
| `env_skyline_domy` | 1280×300 pás | row of small colourful houses with red roofs seen from the front, town skyline | Touchdown, Landing | 1 |
| `env_skyline_mrakodrapy` | 1280×300 pás | row of tall modern glass skyscrapers of different heights, a few lit windows | Touchdown, Landing | 1 |
| `env_skyline_historicke` | 1280×300 pás | row of old historic European buildings, church tower, castle with small towers, coloured façades | Touchdown, Landing | 1 |
| `env_skyline_pustatina` | 1280×300 pás | low sandy houses with flat roofs and a mosque dome, minarets (Middle East), warm colours | Touchdown, Landing | 2 |
| `env_strom_listnaty` | 256 výška | round leafy green tree with brown trunk | Touchdown | 1 |
| `env_strom_ihlicnaty` | 256 výška | tall dark green fir tree | Touchdown | 1 |
| `env_palma` | 256 výška | palm tree with a curved trunk and big green leaves, two coconuts | Touchdown | 1 |
| `env_svetlo_drahy_vyp` | 128 | single runway edge light, small low metal base with a grey glass lamp (off) | Touchdown | 1 |
| `env_svetlo_drahy_zap` | 128 | the same runway light switched on, bright yellow-white glow | Touchdown | 1 |

Podľa lokality: `destinations.json` dostane pole `scenery` (skyline + stromy), napr. Bratislava = historické + listnaté, Londýn = historické + ihličnaté, Dubaj = mrakodrapy + palmy.

## 5. Let: mraky, vtáky, hviezdičky (`obs_`, 160 px)
| Súbor | Prompt | P |
|---|---|---|
| `obs_oblak_biely_01` | fluffy white cloud, round bumps, soft light blue outline | 1 |
| `obs_oblak_biely_02` | long flat white cloud with three bumps | 1 |
| `obs_oblak_tmavy_01` | dark grey storm cloud, heavy and round, no rain, no lightning | 2 |
| `obs_vtak_a` | small friendly bird flying, wings up, seen from the side, flying right | 1 |
| `obs_vtak_b` | the same bird with wings down | 1 |
| `obs_hviezda` | big yellow five-pointed star with a smiling face | 1 |

## 6. Mapa (`map_`, 1280×800, zhora, štýl detskej mapy)
Priestor má kúzlo pre tri „zoom" vrstvy pri rozširovaní hry. Každá vrstva obsahuje len zemepis (bez textu a bez špendlíkov, tie kreslí hra).
| Súbor | Prompt | P |
|---|---|---|
| `map_01_europa` | children's map of Europe seen from above, countries in soft different pastel colours with thick outlines, blue sea around, no names | 1 |
| `map_02_europa_vychod` | children's map of Europe and the Middle East, pastel coloured countries, blue seas, no names | 2 |
| `map_03_europa_azia_afrika` | children's map of Europe, Asia and Africa, pastel coloured countries and big seas, no names | 2 |
| `map_04_svet` | children's world map seen from above, all continents in different pastel colours, blue oceans, no names | 2 |
| `ui_pin` | red map pin with a round white middle, pointing down (vlajka sa kladie nad ňu) | 1 |

## 7. Letisko zhora (P2: minihra uvoľňovanie stojísk a výber stojiska podľa čísla)
| Súbor | Veľkosť | Prompt |
|---|---|---|
| `bg_letisko_top` | 1280×800 | airport seen from directly above, grey apron with six empty parking stands in two rows, a long runway on one side with white dashes, a terminal roof at the top, green grass around, no planes, no text |
| `bld_stojisko_top` | viď §1 | |
| `plane_zelene_top` | už je | |

## 8. Lietadlá (`plane_<id>_<side|air|top>`, 512 px šírka, doprava)
Zelené (`zelene`) už je (side, air, top). Nové modely po vylepšeniach, každý 3 pohľady, spolu **9 súborov**:
| Id | Prompt | P |
|---|---|---|
| `modre` | faster blue passenger jet, sleek pointed nose, two engines under the wings, white stripe along the windows | 2 |
| `cervene` | big red airliner, wide body, four engines, many windows, large tail with a star | 2 |
| `zlate` | golden supersonic plane, very slim with swept wings and a sharp nose, shiny star on the tail | 2 |
Pohľady: `side` (stojí na zemi, s podvozkom), `air` (vo vzduchu, podvozok zasunutý), `top` (zhora).

## 9. UI a vylepšenia (`ui_` 128 px, `item_` 128 px)
| Súbor | Prompt | P |
|---|---|---|
| `ui_domov` | round white button with a small red-roofed house icon | 1 |
| `ui_minca` | shiny gold coin with a small plane in the middle, seen from the front | 1 |
| `ui_hviezda` | yellow star icon for the counter, thick outline | 1 |
| `ui_smajlik` | yellow smiley face, big happy smile | 1 |
| `ui_letenka` | boarding pass ticket with a small plane symbol and stripes, no text | 1 |
| `ui_paka_podstavec` | throttle lever base: grey metal slot on a dark panel, seen from the front, vertical, with small tick marks, no text | 1 |
| `ui_paka_gombik` | round red throttle knob with grip ridges and a short metal shaft, like an airplane engine lever | 1 |
| `item_sedadlo` | airplane passenger seat, blue, seen from the side (upgrade kapacity) | 1 |
| `item_nadrz` | round fuel tank with a drop symbol (upgrade doletu) | 2 |
| `item_motor` | jet engine with spinning front fan (upgrade rýchlosti) | 2 |
| `item_kridla` | pair of wings icon, bright coloured (upgrade riadenia) | 2 |

## 10. Vlajky (`flag_<kod>`, 128×96)
Prompt: *flat rectangular flag of [country], slightly wavy, thick black outline, on a short pole*.
- **P1 (teraz):** `flag_sk`, `flag_gb`.
- **P2 (rozšírenie Európa):** `flag_at`, `flag_cz`, `flag_pl`, `flag_hu`, `flag_de`, `flag_fr`, `flag_it`, `flag_es`, `flag_pt`, `flag_nl`, `flag_ch`, `flag_gr`, `flag_ie`, `flag_se`, `flag_no`, `flag_fi`, `flag_tr`.

## Počty
P1 spolu ≈ 70 súborov (budovy 8, ľudia 9, kufre 15, pozadia a prostredie 9, let 5, mapa 2, vlajky 2, UI/item 11, svetlá 2). P2 ≈ 35 súborov. Doporučené poradie generovania: kufre → ľudia → budovy → prostredie → UI → mapa.

## Stav dodania (2026-11-10, import z Magnific projektu „Detská hra – sprity")
Stiahnuté a uložené do `assets/sprites/<kategoria>/`: **88 súborov** (bag 15, bg 2, bld 10, env 9, flag 19, item 4, map 4, obs 6, person 9, ui 8, plane 3 už existujúce).
- **Zapojené (3d):** všetko z P1 vrátane `ui_paka_*` (3e), `ui_pin`/mapa Európa, vlajky sk/gb, `obs_*`, `env_*` (okrem `env_palma`, `env_skyline_mrakodrapy|pustatina`, ktoré sa použijú pri nových destináciách), `item_sedadlo`. Ostatné `item_*`, `bld_rukav`, `bld_stojisko_top`, `map_02..04`, ďalšie vlajky sú v repozitári, ale zatiaľ mimo precache.
- **Chýba:** `person_pilot_01`, `person_personal_01`, `bg_letisko_top`, lietadlá `plane_modre|cervene|zlate` × `side|air|top` (9 súborov). Všetko P2.
- **Dvojité verzie v Magnifice:** `item_kridla_v2` a `ui_letenka_v2` uložené pod kanonickými menami (`item_kridla`, `ui_letenka`), pôvodné verzie nepoužité.
- **Na prerobenie / úpravu:**
  - ✔ (3e) `ui_paka_podstavec` prerobený bez páky a zapojený so `ui_paka_gombik`.
  - `map_01..04`: ✔ prevedené na JPG q50 (`map_0X_*.jpg`, 209–231 KB), PNG zmazané.
  - `env_skyline_*` (pás 1280×300) majú veľké priehľadné okraje (obsah len ~75 % šírky a spodná tretina výšky). Pri zapojení orezať na obsah.
  - `bag_*`: všetky veľkosti sú na plátne 128×128 (relatívna veľkosť je v obsahu, malý ≈ 60 px), OK; veľké sú ťažšie na zásahovú plochu, ladí sa v scéne.
  - `map_04_svet`: dole kúsok Antarktídy, `obs_vtak_a`/`b` majú rôzny rozmer plátna (160×142 vs 160×104), pri animácii zarovnať podľa stredu.
  - `plane_zelene_*` presahujú ~200 KB (už pred tým známe).

## Dávka 2026-11-11: bezpečnostná kontrola (Magnific, Nano Banana 2.1, 1k + remove_background)
Spoločný štýl ako vyššie. Orezané na obsah a zmenšené (dlhšia strana): `bld_skener` 512 (pohľad mierne zhora-zboku, pás prechádza tunelom, červené svetlo hore), `ui_kos` 256 (kovové vedro spredu), `item_flasa`, `item_noznice`, `item_macko`, `item_tricko`, `item_kniha` 192. Zapojí úloha 5b.
- **Doplnok 2026-11-11 (pripomienky Paľa):** `bld_skener` nahradený verziou čisto zboku (640×284, pás vodorovne cez skriňu, závesy na oboch koncoch). Druhá sada vecí (192): `item_flasa_sport` (zakázaná), `item_pribor` (nôž a vidlička, zakázané), `item_koleso` (plávacie koleso, povolené), `item_nohavice` (povolené). Zapojí úloha 5c.
- **Dávka 2026-11-11, hádanka Arrows:** `obs_auto_top` (256×144), `obs_autobus_top` (238×256), `obs_cisterna_top` (256×154): vozidlá zhora, **predok smeruje doprava** (rovnako ako záložný tvar v `apron/shapes.js`). Pozadie plochy `map_letisko_top.jpg` (1280×800, JPG kvôli veľkosti, preto prefix `map_`). Zapojí úloha 6c.
