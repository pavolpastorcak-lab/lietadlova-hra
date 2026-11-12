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
| `st_fuel_need.mp3` | Natankuj lietadlo. (ťuk na špendlík, na ktorý treba natankovať) |
| `st_fuel_full.mp3` | Nádrž je plná. (ťuk na plnú nádrž) |
| `st_takeoff.mp3` | Potiahni páku hore. |
| `st_brake.mp3` | Potiahni páku dole. |
| `st_stand.mp3` | Nájdi stojisko číslo. |
| `num_1.mp3` až `num_9.mp3` | Jeden. Dva. Tri. Štyri. Päť. Šesť. Sedem. Osem. Deväť. (každé číslo zvlášť) |
| `dest_lon.mp3` | Letíme do Londýna. |
| `land_lon.mp3` | V Londýne prší. |
| `dest_ber.mp3` | Letíme do Berlína. |
| `land_ber.mp3` | V Berlíne svieti slnko. |
| `land_bts.mp3` | V Bratislave svieti slnko. |
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
| `dest_zur.mp3` | Letíme do Zürichu. |
| `land_zur.mp3` | V Zürichu svieti slnko. |
| `dest_ams.mp3` | Letíme do Amsterdamu. |
| `land_ams.mp3` | V Amsterdame prší. |
| `dest_sto.mp3` | Letíme do Štokholmu. |
| `land_sto.mp3` | V Štokholme prší. |
| `dest_ath.mp3` | Letíme do Atén. |
| `land_ath.mp3` | V Aténach svieti slnko. |
| `dest_ist.mp3` | Letíme do Istanbulu. |
| `land_ist.mp3` | V Istanbule svieti slnko. |
| `dest_fin.mp3` | Letíme do Helsínk. |
| `land_fin.mp3` | V Helsinkách prší. |
| `dest_mos.mp3` | Letíme do Moskvy. |
| `land_mos.mp3` | V Moskve prší. |
| `dest_ast.mp3` | Letíme do Astany. |
| `land_ast.mp3` | V Astane svieti slnko. |
| `dest_uln.mp3` | Letíme do Ulanbátaru. |
| `land_uln.mp3` | V Ulanbátare svieti slnko. |
| `dest_cai.mp3` | Letíme do Káhiry. |
| `land_cai.mp3` | V Káhire svieti slnko. |
| `dest_dxb.mp3` | Letíme do Dubaja. |
| `land_dxb.mp3` | V Dubaji svieti slnko. |
| `dest_mct.mp3` | Letíme do Maskatu. |
| `land_mct.mp3` | V Maskate svieti slnko. |
| `dest_sll.mp3` | Letíme do Salály. |
| `land_sll.mp3` | V Salále prší. |
| `dest_tun.mp3` | Letíme do Tunisu. |
| `land_tun.mp3` | V Tunise svieti slnko. |
| `dest_alg.mp3` | Letíme do Alžíru. |
| `land_alg.mp3` | V Alžíri svieti slnko. |
| `dest_rak.mp3` | Letíme do Marakéša. |
| `land_rak.mp3` | V Marakéši svieti slnko. |
| `dest_tbs.mp3` | Letíme do Tbilisi. |
| `land_tbs.mp3` | V Tbilisi svieti slnko. |
| `dest_gyd.mp3` | Letíme do Baku. |
| `land_gyd.mp3` | V Baku svieti slnko. |
| `quiz_flag.mp3` | Ktorá vlajka sem patrí? (kvíz po pristátí, zaznie po `land_*`) |

*(R4b1) Hlasy nových miest `dest_mos` … `land_gyd` (24 riadkov vyššie): mp3 dodá architekt v R4b2, dovtedy ticho.*

Navyše jeden **zvuk** (nie hlas): `assets/audio/sfx/bump.mp3`, krátke jemné „bum-bum" (do ~0,5 s) pri náraze do mraku alebo vtáka počas letu. Nie je to hlas, tak ho nedávaj do priečinka `voice/sk`, ale do `assets/audio/sfx/`.

Ďalšie dva **zvuky** (nie hlas) pre vzlet, tiež do `assets/audio/sfx/`: `engine.mp3` (motor lietadla, plynulá **slučka** ~2 s bez ticha na konci, hra mení jeho výšku podľa rýchlosti) a `takeoff.mp3` (nábeh a odlepenie, ~2 s).

Pre pristátie jeden **zvuk** do `assets/audio/sfx/`: `touchdown.mp3` (dosadnutie kolies na dráhu, ~1 s). Motor sa pri pristátí používa ten istý `engine.mp3`.

Zvuky v hre (4c), všetky v `assets/audio/sfx/`, hlasitosť je v `data/voice.json` (pole `volume`):

| Súbor | Kde hrá |
|---|---|
| `cruise.mp3` | slučka počas celého letu (motory veľkého lietadla), výška tónu sleduje pohyb do strán |
| `star.mp3` | zber hviezdičky v lete |
| `coins.mp3` | ťuk na kôpku mincí pri výplate |
| `fuel.mp3` | **CHÝBA**; čerpanie paliva ~1 s (`sfx_fuel`, hlasitosť 0,8), hrá pri tankovaní na mape; do dodania je ticho |
| `upgrade.mp3` | úspešná kúpa upgradu v hangári (pneumatický uťahovák) |
| `airport.mp3` | slučka, šum haly počas celej scény Letisko (potichu) |
| `belt.mp3` | slučka, kým je aktívna stanica batožiny (pás) |
| `gate.mp3` | otvorenie brány na letisku |
| `rain.mp3` | **CHÝBA (dodá architekt)**; slučka, jemný dážď, hrá v búrke počas letu do daždivých miest (hlasitosť rastie so zatiahnutím, 0,5), zastaví sa pri odchode zo scény; do dodania je ticho |
| `wind.mp3` | jednorazový poryv vetra ~2 s (`sfx_wind`, hlasitosť 0,6), hrá raz na začiatku varovania pred poryvom vetra počas letu (dub, mad, lis); súbor existuje |
| `bin.mp3` | zakázaná vec padne do koša pri bezpečnostnej kontrole |
| `drive.mp3` | vozidlo odchádza v hádanke Arrows (`sfx_drive`, hlasitosť 0,7) |
| `honk.mp3` | ťuk na zablokované vozidlo v hádanke (`sfx_honk`, hlasitosť 0,6) |

Zdroj pravdy je `data/voice.json` (tam sú tie isté texty). Ak chceš text zmeniť, zmeň ho v oboch miestach, alebo napíš mne.

### Pokyny v miestnom jazyku (R4a)
Keď lietadlo štartuje zo zahraničia (`save.location` mimo Bratislavy), pokyny staníc zaznejú najprv po slovensky a po pauze 400 ms (`airport.json` → `localVoicePauseMs`) v jazyku mesta (`destinations.json` → `lang`). Kľúč `<pokyn>_<lang>` (napr. `st_checkin_fr`), súbor `voice/<lang>/<pokyn>.mp3`. Bez súboru zaznie len slovenská veta. Nápoveda po nečinnosti je len slovenská. Jazyky: en (Londýn, Dublin), de (Berlín, Zürich), fr (Paríž), it (Rím), es (Madrid), pt (Lisabon), nl (Amsterdam), sv (Štokholm), el (Atény), tr (Istanbul), fi (Helsinki).

| Súbor (v `assets/audio/`) | Čo má hlas povedať |
|---|---|
| `voice/en/st_checkin.mp3` | Show your ticket. |
| `voice/en/st_bags.mp3` | Put the suitcases on the belt. |
| `voice/en/st_security.mp3` | What doesn't belong on the plane? Put it in the bin. |
| `voice/en/st_gate.mp3` | Open the gate. |
| `voice/en/st_boarding.mp3` | Pull the stairs to the plane. |
| `voice/en/st_takeoff.mp3` | Pull the lever up. |
| `voice/de/st_checkin.mp3` | Zeig dein Ticket. |
| `voice/de/st_bags.mp3` | Leg die Koffer auf das Band. |
| `voice/de/st_security.mp3` | Was gehört nicht ins Flugzeug? Wirf es in den Korb. |
| `voice/de/st_gate.mp3` | Öffne das Tor. |
| `voice/de/st_boarding.mp3` | Zieh die Treppe zum Flugzeug. |
| `voice/de/st_takeoff.mp3` | Zieh den Hebel nach oben. |
| `voice/fr/st_checkin.mp3` | Montre ton billet. |
| `voice/fr/st_bags.mp3` | Mets les valises sur le tapis. |
| `voice/fr/st_security.mp3` | Qu'est-ce qui ne va pas dans l'avion ? Mets-le dans la poubelle. |
| `voice/fr/st_gate.mp3` | Ouvre la porte. |
| `voice/fr/st_boarding.mp3` | Approche l'escalier de l'avion. |
| `voice/fr/st_takeoff.mp3` | Tire le levier vers le haut. |
| `voice/it/st_checkin.mp3` | Mostra il tuo biglietto. |
| `voice/it/st_bags.mp3` | Metti le valigie sul nastro. |
| `voice/it/st_security.mp3` | Cosa non va sull'aereo? Mettilo nel cestino. |
| `voice/it/st_gate.mp3` | Apri il cancello. |
| `voice/it/st_boarding.mp3` | Avvicina la scala all'aereo. |
| `voice/it/st_takeoff.mp3` | Tira la leva in alto. |
| `voice/es/st_checkin.mp3` | Enseña tu billete. |
| `voice/es/st_bags.mp3` | Pon las maletas en la cinta. |
| `voice/es/st_security.mp3` | ¿Qué no va en el avión? Ponlo en la papelera. |
| `voice/es/st_gate.mp3` | Abre la puerta. |
| `voice/es/st_boarding.mp3` | Acerca la escalera al avión. |
| `voice/es/st_takeoff.mp3` | Tira de la palanca hacia arriba. |
| `voice/pt/st_checkin.mp3` | Mostra o teu bilhete. |
| `voice/pt/st_bags.mp3` | Põe as malas no tapete. |
| `voice/pt/st_security.mp3` | O que não pode ir no avião? Põe no cesto. |
| `voice/pt/st_gate.mp3` | Abre o portão. |
| `voice/pt/st_boarding.mp3` | Puxa a escada até ao avião. |
| `voice/pt/st_takeoff.mp3` | Puxa a alavanca para cima. |
| `voice/nl/st_checkin.mp3` | Laat je ticket zien. |
| `voice/nl/st_bags.mp3` | Zet de koffers op de band. |
| `voice/nl/st_security.mp3` | Wat hoort niet in het vliegtuig? Gooi het in de bak. |
| `voice/nl/st_gate.mp3` | Open de poort. |
| `voice/nl/st_boarding.mp3` | Trek de trap naar het vliegtuig. |
| `voice/nl/st_takeoff.mp3` | Trek de hendel omhoog. |
| `voice/sv/st_checkin.mp3` | Visa din biljett. |
| `voice/sv/st_bags.mp3` | Lägg väskorna på bandet. |
| `voice/sv/st_security.mp3` | Vad får inte följa med på planet? Lägg det i korgen. |
| `voice/sv/st_gate.mp3` | Öppna grinden. |
| `voice/sv/st_boarding.mp3` | Dra trappan till planet. |
| `voice/sv/st_takeoff.mp3` | Dra spaken uppåt. |
| `voice/el/st_checkin.mp3` | Δείξε το εισιτήριό σου. |
| `voice/el/st_bags.mp3` | Βάλε τις βαλίτσες στον ιμάντα. |
| `voice/el/st_security.mp3` | Τι δεν επιτρέπεται στο αεροπλάνο; Βάλ' το στο καλάθι. |
| `voice/el/st_gate.mp3` | Άνοιξε την πύλη. |
| `voice/el/st_boarding.mp3` | Τράβηξε τη σκάλα στο αεροπλάνο. |
| `voice/el/st_takeoff.mp3` | Τράβηξε τον μοχλό προς τα πάνω. |
| `voice/tr/st_checkin.mp3` | Biletini göster. |
| `voice/tr/st_bags.mp3` | Bavulları banda koy. |
| `voice/tr/st_security.mp3` | Uçağa ne giremez? Onu sepete at. |
| `voice/tr/st_gate.mp3` | Kapıyı aç. |
| `voice/tr/st_boarding.mp3` | Merdiveni uçağa çek. |
| `voice/tr/st_takeoff.mp3` | Kolu yukarı çek. |
| `voice/fi/st_checkin.mp3` | Näytä lippusi. |
| `voice/fi/st_bags.mp3` | Laita matkalaukut hihnalle. |
| `voice/fi/st_security.mp3` | Mikä ei kuulu lentokoneeseen? Laita se koriin. |
| `voice/fi/st_gate.mp3` | Avaa portti. |
| `voice/fi/st_boarding.mp3` | Vedä portaat koneen luo. |
| `voice/fi/st_takeoff.mp3` | Vedä vipu ylös. |

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

### Ladiaci log zvuku (?debug=audio)
Keď hlas nehrá, otvor hru s `?debug=audio` v adrese (napr. `http://localhost:8080/?debug=audio`). Vpravo dole nad nádržou sa zobrazí malý polopriehľadný text s posledných 8 udalostí: čas, kľúč a stav (`ok` = načítané, `zlyhal, skúšam znova` = jeden automatický opakovaný pokus, `CHYBA` = nenačítalo sa, ďalší pokus príde pri najbližšom prehratí, `hrá` = zvuk sa spustil, `uvoľnené` = hlas vyhodený z pamäte, `nový AudioContext`) a v hranatých zátvorkách stav zvukového kontextu (`running` = v poriadku, `suspended`/`interrupted` = pozastavený). Bez parametra sa nič nezobrazí. Nie je pre syna.
Postup: 5 letov za sebou (aj zo zahraničia). Pri každom lete má log ukázať `dest_<mesto> ok` + `hrá dest_<mesto>` a pri pokynoch staníc aj `..._<jazyk>`. Riadok `CHYBA` alebo `suspended` pri ticho hrajúcom hlase = zapíš kľúč a stav a pošli architektovi.

## 6. Zástupky z Magnificu (stav 2026-11-10)
Všetky kľúče z `data/voice.json` majú súbor. Hlasové zástupky sú TTS, kým ich Paľo nenahradí vlastnými nahrávkami (rovnaký názov súboru, potom zvýšiť `CACHE_VERSION`).
- **Hlas:** Magnific → Voiceover, hlas „Katarína Horváthová" (ElevenLabs), model `eleven_v3`, rýchlosť 0,9, stabilita 0,5. Ďalšie hlasy generuj s tým istým nastavením.
- **Zvuky:** Magnific → Sound effects: `bump` (1 s), `engine` (slučka 2 s), `takeoff` (2 s), `touchdown` (1 s).
- **Na vypočutie:** čísla `num_1`–`num_9` sú jednoslovné a model pri nich občas pridá ticho alebo ruch (dĺžky 0,7 až 3,9 s). Ktoré neznejú čisto, treba vygenerovať znova alebo nahrať.
- **Dávka 2 (2026-11-10):** `st_checkin.mp3` nahradený Paľovou novou verziou (model `eleven_v4`, znie prirodzenejšie; **ďalšie hlasy generuj modelom `eleven_v4`**, hlas a ostatné nastavenie rovnaké). Nové zvuky v `assets/audio/sfx/`: `cruise` (slučka, motory v lete), `star`, `coins`, `upgrade` (pneumatický uťahovák), `airport` (slučka, šum haly), `belt` (slučka, pás), `gate`. Do hry ich zapojí úloha 4c.
- **Dávka 3 (2026-11-11):** `st_security.mp3` (hlas, `eleven_v4`) a `sfx/bin.mp3` (vec padne do koša, 1 s). Zapojí úloha 5b.
- **Dávka 4 (2026-11-11):** `st_apron.mp3` (hlas, `eleven_v4`), `sfx/drive.mp3` (rozjazd vozidla, 1 s), `sfx/honk.mp3` (zatrúbenie pri zablokovanom vozidle, 1 s). Zapojí úloha 6c.
- **Dávka 5 (2026-11-11, pripomienky Paľa):** `sfx/drive.mp3` (bol piskľavý) a `sfx/upgrade.mp3` (vysoký tón) pregenerované s dôrazom na nízky, realistický zvuk (2 s každý).
- **Dávka 6 (2026-11-11):** `land_bts.mp3` (hlas, `eleven_v4`, 6 kreditov) pre pristátie v Bratislave (úloha R1b).
- **Dávka 7 (2026-11-11):** `st_fuel_need.mp3`, `st_fuel_full.mp3` (hlas, `eleven_v4`, 8 kreditov) a `sfx/fuel.mp3` (čerpanie paliva, 1 s, 5 kreditov) pre úlohu R3b.
- **Dávka 8 (2026-11-12):** 66 pokynov staníc v 11 jazykoch pre R4a (`voice/<lang>/st_*.mp3`, `eleven_v4`, ~410 kreditov). Hlasy rodených hovoriacich: en Ava Jordan (29), de Heike Lindemann (1288), fr Claire Laval (147), it Elisa Fontana (84), es Casilda Quintana (1367), pt Tomás Oliveira (616, lisabonská výslovnosť), nl Anouk Janssen (139), sv Lina Sundström (123), el Niki Papadopoulos (109), tr Elif Kaya (203), fi Jukka Virtanen (803).
- **Dávka 9 (2026-11-12):** 24 hlasov `dest_*`, `land_*` pre 12 nových miest R4b (Katarína, `eleven_v4`, ~115 kreditov). Spolu s 11 vlajkami (~590 kreditov) dávka R4b2 ≈ 705 kreditov.
