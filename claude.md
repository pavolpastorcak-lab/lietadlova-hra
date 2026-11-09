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