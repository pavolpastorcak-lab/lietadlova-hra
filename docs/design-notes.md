# Design notes: herný dizajn a UX (deti 4-7 r.)

Záväzné rozhodnutia. Pred každou úlohou ich skontroluj. Webové referencie dopĺňaj sem (max 1 strana).

## Rozhodnutie 1: Herný model, nič získané sa nestráca
**Pravidlá**
- Každý dokončený let **vždy vyplatí základ** (mince za cestujúcich).
- **Hviezdičky** sa počas letu zbierajú **od 0** a dávajú len **prepitné**. Nikdy sa neodpočítavajú.
- **Smajlíky cestujúcich** (spokojnosť na letisku a počas letu) ovplyvňujú **len prepitné**.
- **Upgrady závisia len od mincí.** Žiadne hviezdičkové brány, žiadne časovače.
- **Po 3 nárazoch** sa prekážky v danom lete zriedia (`thinAfterHits`, `thinFactor` v `flights.json`).
- Náraz = zatrasenie lietadla a zvuk „bum-bum" (žiadna škoda, výbuch ani pád).
- Voliteľné **„zopakuj let na 3 hviezdy"**: rekord sa uloží, výplata za opakovaný let ide normálne.

**Prečo**
- 6-ročný nesmie zažiť stratu. Strata mincí alebo postupu vyvoláva frustráciu a plač, nie motiváciu.
- Pevný základ zaručí, že každý pokus posúva hru vpred. Hviezdičky sú bonus na zlepšovanie, nie trest.
- Upgrady len za mince sú jednoduchá príčina a následok, ktorej dieťa rozumie („mám mince → kúpim").
- Automatické zriedenie prekážok je neviditeľná pomoc. Hra sa prispôsobí bez toho, aby dieťa cítilo zlyhanie.
- Opakovanie na 3 hviezdy je dobrovoľná výzva pre staršie/zručnejšie dieťa.

## Rozhodnutie 2: Ovládanie, jedno gesto
**Pravidlá**
- **Žiadne tlačidlá okrem ikony domov.** Postup sa deje priamo na objektoch (ťukni na cestujúceho, potiahni kufor).
- Jediné gesto: **ťuk a ťahanie**. Žiadny pinch, swipe, dlhé podržanie ani dvojťuk.
- **Let:** celá obrazovka je ovládacia zóna. Lietadlo **plynulo sleduje prst v oboch smeroch** (hore/dole aj dopredu/dozadu, kúsok vľavo od prsta, drag-to-steer, lerp, nie skok; X dobieha pomalšie).
- **Len jeden aktívny pointer.** Druhý prst (alebo dlaň opretá o tablet) sa ignoruje.
- **Veľké zásahové plochy** (min. ~96 px pri 1280×800), väčšie ako samotný sprite.
- Všetok vstup ide cez **samostatný input modul** (`src/systems/input.js`).

**Prečo**
- Dieťa číta málo: tlačidlá s textom nefungujú a ikony bez kontextu mätú. Priama manipulácia je intuitívna.
- Jedno gesto = nulová krivka učenia. Ťuk a ťahanie zvládnu deti od ~3 rokov spoľahlivo, zložité gestá nie.
- Celá obrazovka ako zóna: dieťa sa netrafí do malého joysticku. Plynulé sledovanie prsta je fyzicky pochopiteľné.
- Deti často držia tablet celou rukou alebo sa opierajú dlaňou. Viac pointerov by spôsobovalo náhodné akcie.
- Veľké plochy kompenzujú nepresnú jemnú motoriku.
- Samostatný modul: pravidlá (1 pointer, veľkosti, gestá) sa vynútia na jednom mieste a scény sú jednoduchšie.

## Ďalšie zásady
- Hlas a ikony namiesto textu. Hlas = Paľove nahrávky, TTS len ako zástupka.
- Žiadne násilie, výbuchy, smrť ani definitívna prehra.
- Pokojné tempo, žiadne časové limity.
