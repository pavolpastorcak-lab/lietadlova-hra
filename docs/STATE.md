# STATE: stav orchestrácie (pre architekta po /clear)

Aktualizované 2026-11-11. Architekt (Opus/Fable) riadi, Sonnet implementuje (CLAUDE.md, sekcia Režim orchestrátora).

## Kde sme
- Vetva `claude/architect-orchestrator-setup-7d8f3d` (worktree `.claude/worktrees/architect-orchestrator-setup-7d8f3d`). Hlavný priečinok projektu je na `master`.
- `master` = 5b1bc9d (CACHE_VERSION v31), pushnutý na GitHub `pavolpastorcak-lab/lietadlova-hra`, Pages beží: https://pavolpastorcak-lab.github.io/lietadlova-hra/ (overené 153/153 PRECACHE súborov 200).
- Na vetve navyše: b0c8d73 (NASADENIE s reálnou adresou) + tento súbor. Do master pôjdu pri ďalšom „zverejni".
- Hotové úlohy 3g–8b (BACKLOG [x]). Neurobené z BACKLOG: 9a, 9b, 10, 11a–11d.
- Obsah: 14 destinácií (bts, lon, ber, rim, par, dub, mad, lis, zur, ams, sto, ath, ist, fin), 8 hádaniek, počasie (par, lon, dub, ams, sto, fin), vietor (dub, mad, lis), doletové stupne 1500/2000/2600.
- Prvý test na tablete prebehol. Paľo: hra sa rýchlo obohrá, chýba progres.

## Pripomienky z tabletu (2026-11-11)
1. Hádanka s vozidlami: na začiatku zaznie „Uvoľni… Uvoľni cestu" (2x). Kód `src/scenes/Apron.js:59` volá `audio.play('st_apron')` len raz, `idleCheck` (r. 119) neskôr; mp3 `assets/audio/voice/sk/st_apron.mp3` má 4 s. Príčina zatiaľ neznáma (nahrávka vs. dvojitý štart scény/audio unlock).
2. Chýba let späť na Slovensko: vždy sa letí z Bratislavy. Má sa letieť odtiaľ, kde lietadlo pristálo (SK→GR, potom GR→?).

## Roadmapa (SCHVÁLENÁ Paľom 2026-11-11, briefy R1a–R4b v BACKLOG.md)
Odpovede Paľa: dolet sa meria od miesta pristátia, Bratislava vždy dosiahnuteľná; dvojité „Uvoľni" je pri každej hádanke; Magnific dávka `land_bts` + prípadne nový `st_apron` schválená (generuje architekt po R1a/R1b).
Stav: R1a hotová (fd0999d, v32; príčina v kóde, `st_apron` netreba pregenerovať). Ďalšia R1b.

Poradie: **1a → 1b → 2a → 2b → 2c → 3a → 3b → 2d → 3c → 4a → 4b**. Tablet test po 2c a po 3b.

| # | Úloha | Náročnosť | Magnific |
|---|---|---|---|
| 1a | Oprava dvojitého „Uvoľni" (diagnostika, oprava kódu alebo pregenerovanie vety) | malá | možno 1 hlas |
| 1b | Let z miesta pristátia: save `location`, mapa „Si tu", Bratislava ako cieľ, parametre letu (dĺžka, rýchlosť, payMult, hádanky) počítané zo vzdialenosti (súradnice v destinations.json namiesto ručných trás bts-x), rekordy `from-to`, migrácia starého save | veľká (základ pre 3b, 4a, 4b) | 1 hlas („V Bratislave svieti slnko.") |
| 2a | Pri pristátí pod vlajkou názov krajiny: medzinárodný + lokálny (Finland / Suomi), texty v dátach | malá | – |
| 2b | Paralaxa: panoráma mesta pri pristátí sa posúva pomalšie ako dráha | malá | – |
| 2c | Počasie aj počas pristávania (dážď, mraky, tmavšia obloha), zhodné s hlásením | malá–stredná | – |
| 3a | Hangár: nový upgrade Motor (rýchlejší, kratší let), viac stupňov doletu, drahšie upgrady / prísnejšie zarábanie (cieľ: desiatky letov) | stredná | 1 sfx |
| 3b | Palivo: tankovanie za mince, mapa ukáže dosiahnuteľné mestá; poistka: najbližšie mesto vždy dosiahnuteľné, bez mincí tankovanie naň zadarmo | stredná–veľká (po 1b) | 1 sfx, 2 hlasy |
| 2d | Noc (schválený nápad 11b): večerné lety, svetlá dráhy, hviezdy, okná mesta, vzlet aj pristátie | stredná | – |
| 3c | Nové lietadlá = BACKLOG 9a + 9b (iný dolet, rýchlosť, nádrž) | stredná | 6 spritov |
| 4a | Hlásenia na letisku pri odlete zo zahraničia: najprv SK, potom miestny jazyk; ~6 hlásení × 11 jazykov (en, de, fr, it, es, pt, nl, sv, el, tr, fi) | stredná (dáta) | ~66 hlasov |
| 4b | Nová mapa: Rusko, bývalé ZSSR, Blízky východ, sever Afriky (Omán, SAE, Egypt, Mongolsko…), 2–3 úlohy, prvá 6–8 miest | veľká | mapa, vlajky, skyline, hlasy |

Minihry ostávajú ako sú, priorita je obsah a progres.

## Postup architekta
1. Po schválení zapísať roadmapu do `docs/BACKLOG.md` ako samostatné briefy (cieľ, súbory, akceptačné kritériá, čo sa nesmie zmeniť, test) a do tabuľky Poradie.
2. Pred úlohou nejasnosti naraz cez AskUserQuestion (napr. 1b: čo sa stane s rekordmi a odomknutím, 3a: konkrétne ceny).
3. Každá úloha = nová Sonnet session (`start_session`, model `claude-sonnet-5-5`, context fresh, `use_worktree: false`, cwd tento worktree), končí commitom + PROGRESS.md. Po nej skontrolovať diff, &lt;300 riadkov, obsah v `data/`, CACHE_VERSION +1.
4. Po každej úlohe Paľovi návod na test (pravidlo 11; server `hra-worktree` port 8090 v `.claude/launch.json`).

## Trvalé pravidlá od Paľa
- Magnific (hlasy, sfx, obrázky) len po jeho schválení každej dávky. Hlas: Katarína Horváthová (id 357), eleven_v4; obrázky Nano Banana 2.1 + remove_background, štýl „Cute children's drawing style, thick black marker outline…"; orezanie skriptom trim.ps1 cez PowerShell tool.
- Merge do master a push len na výslovné „zlúč do master" / „zverejni" (postup: docs/NASADENIE.md, časť C).
- Na tablete nikdy neradiť mazanie údajov stránky (zmaže save).
- Pri vizuálnej kontrole môže architekt navrhovať vylepšenia, Paľo schvaľuje.
- Odložené: suveníry (neskôr), priania pasažierov (zatiaľ nie), mávajúci pilot (nie).
