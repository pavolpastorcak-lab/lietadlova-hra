# Lietadlová hra pre syna (6 r.)

## Kontext
- Hráč: 6-ročný chlapec, číta málo, preto ikony, obrázky a hlas, minimum textu.
- Zariadenie: Samsung tablet (dotyk, Chrome). Offline-first PWA, žiadne CDN, reklamy, nákupy ani online účty.
- Žáner: pokojná budovateľská a edukačná hra o lietadlách a letisku (štýl Township / My Little Work). Žiadne násilie, smrť, výbuchy ani strieľanie, prehra nikdy nie je definitívna.
- Edukačný cieľ: postup na letisku (check-in, batožina, gate, boarding), destinácie, vlajky, počasie.
- Grafika: kresby syna ako sprity (priehľadné PNG).
- Paľo je technicky zdatný, ale kód upravuješ ty, až po jeho schválení.

## Záväzné pravidlá
1. Pred každou úlohou sa opýtaj cez AskUserQuestion (interaktívne otázky, nie zoznam v texte). Až po odpovediach začni.
2. JEDNA ÚLOHA = JEDNA SESSION (úloha = jedna funkcia, jeden level alebo jedna oprava). Po dokončení zhrň výsledok, aktualizuj docs/PROGRESS.md, urob commit a napíš: "Hotovo, urob /clear a otvor novú session." Ak Paľo žiada druhú úlohu, odmietni a pripomeň pravidlo, aj keď bude tlačiť.
3. Najprv plán, čakaj na schválenie, potom implementuj.
4. Vertikálny rez: najmenšia hrateľná slučka, až potom rozširuj. Nepridávaj nič, o čo sa nepožiadalo.
5. Engine a obsah sú oddelené: lietadlá, destinácie, levely a ceny sú JSON dáta v data/, nie kód.
6. Šetri tokeny: čítaj len potrebné súbory, použi docs/ARCHITECTURE.md ako mapu, súbory držíme pod 300 riadkov, upravuj diffami a neprepisuj celé súbory.
7. Reference (herný dizajn a UX pre deti 4-7 rokov, 2D grafika): najprv skontroluj docs/design-notes.md. Na web choď len ak to úloha vyžaduje a výsledok ulož tam (max 1 strana).
8. Všetko musí fungovať offline (režim lietadlo). Pri zmene cachovaných súborov zvýš verziu cache v service workeri.
9. Git: jedna dokončená úloha = jeden commit.
10. Komunikuj po slovensky, tykaj, stručne.
11. Po každej úlohe napíš Paľovi, ako ju otestuje: príkaz na spustenie servera (`npx.cmd serve -l 8080` v priečinku projektu, potom `http://localhost:8080/`, Ctrl+Shift+R), konkrétne kroky v hre a čo má vidieť/počuť, plus ktoré zvuky treba doplniť (tabuľka v docs/AUDIO.md, ak úloha pridala nový voice/sfx kľúč).

## Režim orchestrátora (len keď to Paľo výslovne spustí promptom z docs/ORCHESTRATOR.md)
Architekt (silnejší model, napr. Fable) riadi, Sonnet implementuje. Pravidlá 1–11 platia ďalej, s týmito výnimkami a doplnkami:
- **Architekt nekóduje.** Číta, rozhoduje, píše briefy, kontroluje diffy a navrhuje ďalšie kroky.
- **Pravidlo 1 v dávke:** architekt sa opýta Paľa na všetky nejasnosti naraz (AskUserQuestion), nie pred každou úlohou. Medzi úlohami sa nepýta, kým nenarazí na nový dizajnový alebo obsahový výber.
- **Pravidlo 2 platí pre Sonnet sessions:** každú úlohu dostane samostatná Sonnet session (`start_session`, model sonnet, kontext fresh), ktorá skončí commitom a aktualizovaným `docs/PROGRESS.md`. Architekt zadáva úlohy po jednej (žiadne dve naraz na tých istých súboroch).
- **Pravidlo 3 zmäkčené:** pri malej úlohe stačí plán v jednej vete bez čakania; pri úlohe, ktorá mení dáta, save alebo viac ako 3 súbory, Sonnet pošle plán architektovi na schválenie.
- **Brief pre Sonnet** je samostatný (cieľ, súbory, akceptačné kritériá, čo sa nesmie zmeniť, test), aby ho Sonnet zvládol aj bez architekta. Zdroj: `docs/BACKLOG.md`.
- **Kontrola po každej úlohe:** diff, súbory pod 300 riadkov, obsah v `data/`, zvýšená `CACHE_VERSION`, aktualizovaný PROGRESS, commit. Pri nedostatkoch vráti opravu do tej istej session.
- **Zastav a vyžiadaj Paľa**, keď treba: test na tablete, hlasové mp3, kresby syna, míňanie Magnific kreditov, zmenu pravidiel alebo rozsahu.
