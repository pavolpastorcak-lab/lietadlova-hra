# NASADENIE: hra na tablete a nové verzie

Hra beží z internetu cez **GitHub Pages** (zadarmo, HTTPS). Tablet si ju pri prvom otvorení uloží a potom funguje aj v režime lietadlo. Bez HTTPS by offline režim nefungoval, preto nestačí otvoriť hru z počítača cez domácu Wi-Fi.

**Dôležité pred začiatkom:** na bezplatnom účte musí byť repozitár **verejný**. Ktokoľvek s odkazom uvidí hru aj jej súbory (kresby, hlasy, kód). Nie je tam nič osobné okrem kresieb syna a neskôr tvojho hlasu. Ak to nechceš, alternatíva je súkromný repozitár s platným GitHub Pro (4 USD mesačne).

## A. Jednorazové nastavenie (asi 20 minút)

1. **Spoj prácu do hlavnej vetvy.** Všetky úlohy sú zatiaľ na vetve `claude/architect-orchestrator-setup-7d8f3d`, hlavná vetva `master` ich nemá. Napíš architektovi „zlúč do master" a spraví to za teba.
2. **Účet:** na <https://github.com> si založ účet (alebo sa prihlás).
3. **Repozitár:** vpravo hore **+** → **New repository**. Meno `lietadlova-hra`, **Public**, nič nezaškrtávaj (žiadne README) → **Create repository**.
4. **Odoslanie hry:** v priečinku projektu `lietadlova-hra` otvor PowerShell a spusti (hotové 2026-11-11, repozitár `pavolpastorcak-lab/lietadlova-hra`):
   ```
   git remote add origin https://github.com/pavolpastorcak-lab/lietadlova-hra.git
   git push -u origin master
   ```
   Pri prvom odoslaní sa otvorí okno prehliadača s prihlásením na GitHub, potvrď ho.
5. **Zapnutie stránky:** na GitHube v repozitári **Settings** → vľavo **Pages** → **Source: Deploy from a branch** → Branch **master**, priečinok **/ (root)** → **Save**.
6. Počkaj 1 až 2 minúty. Hore na tej istej stránke sa ukáže adresa, `https://pavolpastorcak-lab.github.io/lietadlova-hra/`. Otvor ju na počítači a over, že hra beží.

## B. Hra do tabletu (raz)

1. Tablet pripoj na **Wi-Fi** a otvor **Chrome**.
2. Zadaj adresu z kroku A6 a počkaj, kým sa hra načíta. Ťukni na Londýn a prejdi aspoň na letisko (hra si medzitým uloží súbory, asi 12 MB). Nechaj ju otvorenú ešte asi pol minúty.
3. V Chrome ťukni na **⋮** (vpravo hore) → **Pridať na plochu** alebo **Inštalovať aplikáciu** → **Inštalovať**. Na ploche pribudne ikona **Lietadlá**.
4. Zatvor Chrome. Spusti hru **ikonou na ploche**: otvorí sa na celú obrazovku a na šírku.
5. **Test offline:** zapni **režim lietadlo**, spusti hru ikonou a prejdi celý let až do hangára. Ak niečo chýba (obrázok alebo zvuk), napíš architektovi, čo presne.

## C. Nová verzia (opakovane)

**Na počítači (zverejnenie):** keď je hotový míľnik, napíš architektovi **„zverejni"**. Zlúči prácu do `master` a pošle ju na GitHub (`git push`). Stránka sa obnoví sama do 1 až 2 minút. Každá verzia má vyššie číslo `CACHE_VERSION` v `sw.js`, vďaka tomu tablet pozná, že je nová.

**Na tablete (aktualizácia):**
1. Zapni **Wi-Fi** (nie režim lietadlo).
2. Spusti hru ikonou a nechaj ju otvorenú asi **30 sekúnd** (na pozadí si stiahne novú verziu).
3. Hru úplne zavri: tlačidlo **posledné aplikácie** (tri čiarky dole) → hru potiahni preč.
4. Spusti ju znova ikonou. Beží nová verzia. Mince, upgrady a rekordy ostanú.

**Ak sa nová verzia neukáže:** zopakuj kroky 2 až 4. Ak ani potom, napíš architektovi. **Nemaž údaje stránky** v nastaveniach Chrome: zmazal by si aj uložený postup syna (mince, lietadlá, rekordy).
