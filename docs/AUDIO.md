# AUDIO: hlas do hry (postup pre laika)

Hra hlas prehrá, len keď existuje súbor. Bez súboru je ticho a nič sa nepokazí. Hlasy sú teda voliteľné a môžeš ich pridávať postupne.

## 1. Čo treba nahrať

Každý riadok = jeden mp3 súbor. **Názov súboru musí byť presne ako v tabuľke** (malé písmená, bez medzier a diakritiky).

| Názov súboru | Čo má hlas povedať |
|---|---|
| `st_checkin.mp3` | Ukáž letenku. |
| `st_bags.mp3` | Daj kufre na pás. |
| `st_boarding.mp3` | Pritiahni schody k lietadlu. |
| `st_gate.mp3` | Otvor bránu. |
| `dest_lon.mp3` | Letíme do Londýna. |

Navyše jeden **zvuk** (nie hlas): `assets/audio/sfx/bump.mp3`, krátke jemné „bum-bum" (do ~0,5 s) pri náraze do mraku alebo vtáka počas letu. Nie je to hlas, tak ho nedávaj do priečinka `voice/sk`, ale do `assets/audio/sfx/`.

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
4. Ak hlas nehrá: v Chrome stlač F12 → záložka Network → pozri, či `st_checkin.mp3` má stav 200 (červený 404 = zlý názov alebo priečinok).
5. Na tablete: po novom nasadení otvor hru, nechaj ju chvíľu načítať, potom zapni režim lietadlo a overíš, či hlas stále hrá (súbory sa uložia do cache automaticky).
