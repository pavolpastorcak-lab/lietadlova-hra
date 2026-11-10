# Spustenie orchestrátora (Fable architekt + Sonnet implementuje)

Použiť: nová session v tomto projekte, model Fable 5.2. Vložiť tento prompt:

```text
Prečítaj CLAUDE.md (vrátane sekcie „Režim orchestrátora“), docs/ARCHITECTURE.md, docs/PROGRESS.md a docs/design-notes.md. Si architekt a orchestrátor, sám nekóduješ.
1) Opýtaj sa ma v jednej dávke (AskUserQuestion) na rozhodnutia, ktoré potrebuješ (poradie, rozsah, obtiažnosť pre 6-ročného).
2) Napíš docs/BACKLOG.md: poradie úloh po v1 (z roadmapy), pri každej samostatný brief pre Sonnet (cieľ, súbory, akceptačné kritériá, čo sa nesmie zmeniť, čo overím ja na tablete). Ukáž mi ho a počkaj na schválenie.
3) Po schválení zadávaj úlohy postupne Sonnet sessions (jedna úloha = jedna session, jeden commit, model sonnet, kontext fresh). Po každej skontroluj diff a výsledok, pri nedostatkoch vráť opravu.
4) Zastav sa, keď potrebuješ tablet, hlas, kresby alebo Magnific kredity, a napíš mi presne, čo mám spraviť.
5) Na konci každej úlohy mi daj návod na test (CLAUDE.md pravidlo 11).
```
