# AUDIO: hlas do hry (postup pre laika)

Hra hlas prehrá, len keď existuje súbor. Bez súboru je ticho a nič sa nepokazí. Hlasy sú teda voliteľné a môžeš ich pridávať postupne.

## 1. Čo treba nahrať

Každý riadok = jeden mp3 súbor. **Názov súboru musí byť presne ako v tabuľke** (malé písmená, bez medzier a diakritiky).

| Názov súboru | Čo má hlas povedať |
|---|---|
| `st_checkin.mp3` | Ukáž letenku. |
| `st_bags.mp3` | Daj kufre na pás. |
| `st_security.mp3` | Čo do lietadla nepatrí? Daj to do koša. |
| `st_apron.mp3` | Uvoľni cestu. Ťukni na auto, ktoré môže odísť. |
| `st_boarding.mp3` | Pritiahni schody k lietadlu. |
| `st_gate.mp3` | Otvor bránu. |
| `st_takeoff.mp3` | Potiahni páku hore. |
| `st_brake.mp3` | Potiahni páku dole. |
| `st_stand.mp3` | Nájdi stojisko číslo. |
| `num_1.mp3` až `num_9.mp3` | Jeden. Dva. Tri. Štyri. Päť. Šesť. Sedem. Osem. Deväť. (každé číslo zvlášť) |
| `dest_lon.mp3` | Letíme do Londýna. |
| `land_lon.mp3` | V Londýne prší. |
| `dest_ber.mp3` | Letíme do Berlína. |
| `land_ber.mp3` | V Berlíne svieti slnko. |
| `dest_rim.mp3` | Letíme do Ríma. |
| `land_rim.mp3` | V Ríme svieti slnko. |
| `dest_par.mp3` | Letíme do Paríža. |
| `land_par.mp3` | V Paríži prší. |
| `dest_dub.mp3` | Letíme do Dublinu. |
| `land_dub.mp3` | V Dubline prší. |
| `dest_mad.mp3` | Letíme do Madridu. |
| `land_mad.mp3` | V Madride svieti slnko. |
| `dest_lis.mp3` | Letíme do Lisabonu. |
| `land_lis.mp3` | V Lisabone svieti slnko. |

Navyše jeden **zvuk** (nie hlas): `assets/audio/sfx/bump.mp3`, krátke jemné „bum-bum" (do ~0,5 s) pri náraze do mraku alebo vtáka počas letu. Nie je to hlas, tak ho nedávaj do priečinka `voice/sk`, ale do `assets/audio/sfx/`.

Ďalšie dva **zvuky** (nie hlas) pre vzlet, tiež do `assets/audio/sfx/`: `engine.mp3` (motor lietadla, plynulá **slučka** ~2 s bez ticha na konci, hra mení jeho výšku podľa rýchlosti) a `takeoff.mp3` (nábeh a odlepenie, ~2 s).

Pre pristátie jeden **zvuk** do `assets/audio/sfx/`: `touchdown.mp3` (dosadnutie kolies na dráhu, ~1 s). Motor sa pri pristátí používa ten istý `engine.mp3`.

Zvuky v hre (4c), všetky v `assets/audio/sfx/`, hlasitosť je v `data/voice.json` (pole `volume`):

| Súbor | Kde hrá |
|---|---|
| `cruise.mp3` | slučka počas celého letu (motory veľkého lietadla), výška tónu sleduje pohyb do strán |
| `star.mp3` | zber hviezdičky v lete |
| `coins.mp3` | ťuk na kôpku mincí pri výplate |
| `upgrade.mp3` | úspešná kúpa upgradu v hangári (pneumatický uťahovák) |
| `airport.mp3` | slučka, šum haly počas celej scény Letisko (potichu) |
| `belt.mp3` | slučka, kým je aktívna stanica batožiny (pás) |
| `gate.mp3` | otvorenie brány na letisku |
| `bin.mp3` | zakázaná vec padne do koša pri bezpečnostnej kontrole |
| `drive.mp3` | vozidlo odchádza v hádanke Arrows (`sfx_drive`, hlasitosť 0,7) |
| `honk.mp3` | ťuk na zablokované vozidlo v hádanke (`sfx_honk`, hlasitosť 0,6) |

Zdroj pravdy je `data/voice.json` (tam sú tie isté texty). Ak chceš text zmeniť, zmeň ho v oboch miestach, alebo napíš mne.

## 2. Prompt pre AI generátor hlasu

Vlož do generátora (Magnific, ElevenLabs a pod.), jazyk **slovenčina**:

```
Hlas: milá, pokojná žena alebo mladý muž, ako veselý rozprávač detských kníh.
Tempo: pomalé a zreteľné, každé slovo jasne vyslovené.
Nálada: teplá, povzbudzujúca, usmievavá. Nikdy prísna, nikdy kričiaca.
Dĺžka: len jedna krátka veta, bez dlhej pauzy na začiatku a na konci.
Slovensky, správna slovenská výslovnosť (nie česká).
Text: "Ukáž letenku."
```

Za riadok `Text:` vždy daj text z tabuľky vyššie. **Všetky súbory generuj s tým istým hlasom a nastavením**, aby znely ako jedna postava. Ak ponúka generátor „stability / style", nechaj stredné hodnoty.

Alternatíva: nahraj sa sám/sama mobilom (Diktafón) a súbor potom previď na mp3 (krok 3). Tvoj vlastný hlas je pre syna najlepší a má prednosť.

## 3. Formát súboru

- **mp3**, **mono**, **64 kbps**, ticho na začiatku najviac ~0,2 s.
- Ak generátor ponúka len iný formát (wav, m4a), previď ho na mp3 napr. cez webový prevodník alebo Audacity (Súbor → Exportovať → MP3, Mono, 64 kbps). Hlavné je, aby výsledok mal príponu `.mp3`.

## 4. Kam súbory dať

1. Otvor priečinok projektu `lietadlova-hra`.
2. Choď do `assets` → `audio` → `voice` → `sk`.
   - Ak niektorý priečinok neexistuje, vytvor ho s presne týmto názvom.
3. Skopíruj sem hotové mp3 súbory. Cesta k jednému súboru potom vyzerá takto:
   `lietadlova-hra/assets/audio/voice/sk/st_checkin.mp3`
4. Napíš mi: **„Pridal som mp3, zvýš cache."** Zvýšim verziu cache v `sw.js`, aby ich tablet načítal (bez toho môže tablet ďalej používať starú verziu bez zvuku).

## 5. Ako overiť, že hlas funguje

1. Spusti server v priečinku projektu: `npx.cmd serve -l 8080`
2. Otvor `http://localhost:8080/` v Chrome, stlač **Ctrl+Shift+R** (načíta nanovo).
3. Ťukni na Londýn. Na každej stanici letiska (check-in, batožina, schody, brána) sa má ozvať hlas. Najprv musíš ťuknúť na obrazovku (Chrome nepustí zvuk bez dotyku, na tablete to nie je problém).
   Po pristátí sa má ozvať `land_lon` (V Londýne prší) a po ťuku na vlajku ide výplata.
4. Ak hlas nehrá: v Chrome stlač F12 → záložka Network → pozri, či `st_checkin.mp3` má stav 200 (červený 404 = zlý názov alebo priečinok).
5. Na tablete: po novom nasadení otvor hru, nechaj ju chvíľu načítať, potom zapni režim lietadlo a overíš, či hlas stále hrá (súbory sa uložia do cache automaticky).

## 6. Zástupky z Magnificu (stav 2026-11-10)
Všetky kľúče z `data/voice.json` majú súbor. Hlasové zástupky sú TTS, kým ich Paľo nenahradí vlastnými nahrávkami (rovnaký názov súboru, potom zvýšiť `CACHE_VERSION`).
- **Hlas:** Magnific → Voiceover, hlas „Katarína Horváthová" (ElevenLabs), model `eleven_v3`, rýchlosť 0,9, stabilita 0,5. Ďalšie hlasy generuj s tým istým nastavením.
- **Zvuky:** Magnific → Sound effects: `bump` (1 s), `engine` (slučka 2 s), `takeoff` (2 s), `touchdown` (1 s).
- **Na vypočutie:** čísla `num_1`–`num_9` sú jednoslovné a model pri nich občas pridá ticho alebo ruch (dĺžky 0,7 až 3,9 s). Ktoré neznejú čisto, treba vygenerovať znova alebo nahrať.
- **Dávka 2 (2026-11-10):** `st_checkin.mp3` nahradený Paľovou novou verziou (model `eleven_v4`, znie prirodzenejšie; **ďalšie hlasy generuj modelom `eleven_v4`**, hlas a ostatné nastavenie rovnaké). Nové zvuky v `assets/audio/sfx/`: `cruise` (slučka, motory v lete), `star`, `coins`, `upgrade` (pneumatický uťahovák), `airport` (slučka, šum haly), `belt` (slučka, pás), `gate`. Do hry ich zapojí úloha 4c.
- **Dávka 3 (2026-11-11):** `st_security.mp3` (hlas, `eleven_v4`) a `sfx/bin.mp3` (vec padne do koša, 1 s). Zapojí úloha 5b.
- **Dávka 4 (2026-11-11):** `st_apron.mp3` (hlas, `eleven_v4`), `sfx/drive.mp3` (rozjazd vozidla, 1 s), `sfx/honk.mp3` (zatrúbenie pri zablokovanom vozidle, 1 s). Zapojí úloha 6c.
- **Dávka 5 (2026-11-11, pripomienky Paľa):** `sfx/drive.mp3` (bol piskľavý) a `sfx/upgrade.mp3` (vysoký tón) pregenerované s dôrazom na nízky, realistický zvuk (2 s každý).
