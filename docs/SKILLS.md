# Installierte Design- und Animations-Skills

Stand: 6. November 2026. Auf ausdrücklichen Nutzerwunsch wurden alle drei genannten Pakete **projektlokal für Codex** installiert. Insgesamt sind 19 Skills unter `.agents/skills/` vorhanden. Es wurden keine Laufzeitbibliotheken zur Website hinzugefügt.

| Paket | Installierter Stand | Umfang |
| --- | --- | --- |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill/tree/9b4bf937a1f69348126959c15d2f99a73e65699b) | Taste 2.5.0; Commit `9b4bf937a1f69348126959c15d2f99a73e65699b` | `design-taste-frontend`, einschließlich Referenzen und Prüfwerkzeugen |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable/tree/c3bb418ee38ee49a6b999b7752c1368f3123a2bd) | 4.8.0; Commit `c3bb418ee38ee49a6b999b7752c1368f3123a2bd` | Offizieller Codex-Skill `impeccable` mit Befehlsreferenzen |
| [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/c8a79627b59d72d764d6ab6f2c87c09a48169833) | Commit `c8a79627b59d72d764d6ab6f2c87c09a48169833` | Alle 17 Skills; hier insbesondere `emil-design-eng` und `animate` angewendet |

## Installation und erneute Einrichtung

Die gewünschten Befehle wurden mit dem Skill-Installer **1.7.6**, ohne Rückfragen und für Codex ausgeführt:

```sh
npx --yes skills@1.7.6 add Leonxlnx/taste-skill --agent codex --yes
npx --yes impeccable@4.8.0 install --providers=codex --scope=project --yes --no-hooks
npx --yes skills@1.7.6 add emilkowalski/skills --agent codex --skill '*' --yes
```

Der Impeccable-Bundle-Download von `impeccable.style` war in dieser Cloud-Umgebung nicht erreichbar. Die Installation erfolgte erfolgreich mit den offiziellen, bereits für Codex kompilierten Dateien desselben Projekts:

```sh
npx --yes skills@1.7.6 add https://github.com/pbakaus/impeccable/tree/c3bb418ee38ee49a6b999b7752c1368f3123a2bd/.agents/skills/impeccable --agent codex --yes
```

`skills-lock.json` hält Quellen, Commit-Referenzen und Inhaltsprüfsummen fest. Die umfangreichen Skill-Dateien bleiben lokal; sie gehören weder in das Website-Paket noch in dessen Download-ZIP. Nach einem neuen Checkout können die festgehaltenen Versionen erneut installiert werden:

```sh
npm run skills:restore
```

Die aktuelle Installation wurde mit `skills list --agent codex --json` geprüft: 19 Skills vorhanden. Der Wiederherstellungsbefehl wurde als Dry Run gegen die vorhandene Installation geprüft. Internetzugriff auf GitHub/npm wird für eine neue Installation benötigt. Es wurde kein automatischer Impeccable-Hook eingerichtet; dessen mechanische Prüfung wurde gezielt ausgeführt.

## Anwendung auf die bestehende Website

Die vorhandene V6A-Darstellung, bestätigte Texte und Fotos sowie die fünf gewünschten Effekte bleiben verbindlich. Die allgemeinen Neubau-Rezepte von Taste und Impeccable wurden deshalb nicht auf dieses bestehende Projekt übertragen. Die Empfehlungen wurden für die vorhandene CSS-/WAAPI-Implementierung ausgewertet.

| Before | After | Why |
| --- | --- | --- |
| Hover-Regeln auch auf Geräten ohne echten Hover | Hover nur bei `(hover: hover) and (pointer: fine)` | Keine klebenden Zoom-/Bewegungszustände nach Touch-Eingaben; Taste Motion und Emil Design Engineering |
| Kartenhub von 3 px, Bildvergrößerung bis 1,05 | Kartenhub 2 px, Bildvergrößerung 1,03 | Dezente Rückmeldung innerhalb der vorhandenen Gestaltung; Taste Motion |
| Schaltflächen ohne eigenen Druckzustand | Kurzer Druckzustand, 1 px und Faktor 0,985; kein Versatz bei reduzierter Bewegung | Bestätigung einer Zeiger-Eingabe ohne Layoutverschiebung; Taste Motion und Emil Design Engineering |
| Arbeitsweise-Dialog öffnet in 400 ms | Öffnen in 260 ms, Schließen in 160 ms mit der bestehenden `--ease`-Kurve | Schnellere Reaktion, gemeinsame Bewegungssprache; Emil Animate |
| Schließen startet immer am vollständig geöffneten Zustand | Schließen setzt am aktuell sichtbaren Transformations-/Deckkraftzustand an | Kein Sprung bei Unterbrechung; Emil Animate und Impeccable Polish |
| Tastaturöffnung und Escape spielen dieselbe Animation wie Mausklicks | Tastaturöffnung und Escape reagieren sofort, mit Fokusführung | Direkte Bedienung; Emil Design Engineering |
| Animierter, fest verdrahteter Eckenradius | Eckenradius bleibt in CSS; nur Transform und Deckkraft werden animiert | Weniger animierte Paint-Eigenschaften, korrekter mobiler Radius; Emil Design Engineering |
| Veraltete `.process-output`-Regeln im CSS | Sechs unbenutzte Regeln entfernt | Impeccable-Detektor meldete die dortige Akzentlinie; das zugehörige alte Element existiert nicht mehr |

Gelesen wurden die jeweiligen Hauptanweisungen sowie Taste Motion/Performance, Emil Animate und Impeccable Polish/Craft Floor. Impeccable `context --target index.html` bestätigt die vorhandene Gestaltung als Grundlage für gezielte Verbesserungen. Es war keine Neugestaltung notwendig.

## Nachweise

- `CHROMIUM_PATH=/usr/bin/chromium npm test`: **43 Prüfgruppen bestanden**, einschließlich sechs axe-Prüfungen ohne automatische Verstöße.
- Neue Regressionen prüfen die sichtbare Position beim Unterbrechen einer Öffnung, sofortige Tastaturbedienung sowie ausbleibenden Hover-Zoom im emulierten Touch-Browser.
- Eine gezielte Prüfung der erzeugten Einzeldatei bestätigt zusätzlich Hover-/Druckrückmeldung mit Maus und Touch sowie statische Druckzustände bei reduzierter Bewegung: [input-feedback.json](qa/skills/input-feedback.json).
- Desktop-, Tablet- und Smartphone-Darstellung wurden gerendert; Hero, Arbeitsweise-Karten und mobiler Dialog wurden zusätzlich visuell geprüft.
- Impeccable `detect --json assets/site.css assets/work-card.js`: eine Warnung zur oben beschriebenen Altregel; anschließend entfernt. Kein pauschaler Filter und keine zweite Prüfung zum Verbergen von Befunden. Rohbefund: [impeccable-detect.json](qa/skills/impeccable-detect.json).
- Taste-Performance-Prüfung: rund 255 KiB Transfer; **1 FAIL und 3 WARN** durch Bildabmessungen und die kleine dritte Schriftfamilie. Die drei SVG-Treffer betreffen absichtlich über drei Karten verteilte Vektorgrafik; die freigegebenen Rasterfotos bleiben unverändert. Vollständige Rohdaten: [perf.json](qa/skills/perf.json), genaue Einordnung im [Prüfbericht](../PRUEFBERICHT.md).
- Die beiden Porträtdateien und die geprüfte PDF ohne Telefonnummer haben unveränderte SHA-256-Prüfsummen. Der Seitentext wurde nicht geändert.

Die Browserprüfungen erfolgen in Chromium mit emulierten Mobilansichten. Sie ersetzen keine Prüfung auf einem echten Smartphone und keine GPU-Messung auf einem solchen Gerät.
