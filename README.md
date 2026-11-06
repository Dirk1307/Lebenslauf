# Dirk Herrmann · Bewerbungswebsite V6A

Diese Website entwickelt die gelieferte V6A weiter. HTML, Inhalte, Reihenfolge, Farben, Typografie und die fünf vorhandenen Effekte bilden weiterhin die Basis. Kein Framework, Backend oder externer Dienst ist zum Betrieb erforderlich.

## Aktueller Inhaltsstand

- Die Begrüßung „Hi, ich bin Dirk.“ steht beim limettengrünen Schild am Hero-Foto, nicht mehr über der großen Überschrift.
- Im Kontaktbereich ist die freigegebene Adresse `dirk.herrmann@yahoo.de` als direkter E-Mail-Link ergänzt. LinkedIn bleibt erhalten. Eine Telefonnummer wird derzeit nicht öffentlich angezeigt.

Die Positionierung richtet sich auf **Marketing, Performance Marketing, Marketingstrategie, Social Media Marketing und Projektmanagement**. Die Texte verwenden die vom Nutzer bestätigten Aufgaben bei Recruiting Guru und EKS Montage. Allgemeine fachliche Schwerpunkte sind Meta Ads, Creatives, Landingpages und Bewerbungsfunnels, LinkedIn/Instagram/Facebook, Content, KPI-Analyse, Budgetverwaltung sowie Projektkoordination. Arbeitgebernamen stehen ausschließlich im Werdegang; konkrete Kundenzahlen werden auf der Seite nicht genannt. Nicht genannte Daten, Ergebnisse, Tools oder Qualifikationen werden nicht ergänzt.

- Hero-Text: Der ursprüngliche Wortlaut „Strategisch im Kopf. Kreativ in der Umsetzung. Ich verbinde Marketing, digitale Ideen und Projektarbeit – mit dem Anspruch, Dinge wirklich voranzubringen.“ ist auf Nutzerwunsch wiederhergestellt.
- Hero: das ausdrücklich gewählte Originalfoto **ohne Kappe, mit verschränkten Armen** (`portrait-smile.webp`, unverändert nach `hero-dirk.webp` übernommen). Das zweite Foto zeigt weiterhin auf die Kamera. Es bleiben genau zwei Personenfotos.
- Der Lebenslauf „Dirk Herrmann.pdf“ wurde als Referenz für Rollen und Zeiträume verwendet: Projektleiter bei Recruiting Guru (10/2023–07/2025) und Social Media Manager bei EKS Montage (seit 07/2025). Die Arbeitgeber werden nur hier im Werdegang genannt; die allgemeinen Skills bleiben ohne Firmenbezug. Der Studienbezug bleibt entfernt.
- Bildhinweis am zweiten Foto: „MIT IDEEN. MIT ENGAGEMENT.“.
- Abschnitt 03 und 04 verwenden sieben unterschiedliche recherchierte unDraw-Motive im bestehenden Kobaltblau. Quellen und Lizenzzuordnung: [docs/BILDQUELLEN.md](docs/BILDQUELLEN.md).
- Die vier Arbeitsweise-Schritte öffnen sich als **Expandable Cards** mit Detailansicht nach der gewünschten Watermelon-Vorlage. Die Beschreibungen sind auf die Marketing-Arbeitsweise ausgerichtet; die V6-Farbwelt bleibt erhalten. Die Vanilla-Portierung, Originalquelle und MIT-Lizenz sind in [docs/WATERMELON.md](docs/WATERMELON.md) dokumentiert.

## Smartphone-Darstellung

Die Kompetenzkarten zeigen auf kleinen Bildschirmen wieder ihre Bildvorderseiten und lassen sich per Tipp öffnen und zurückdrehen. Die Erfahrungsfelder sind nativ wischbar und zusätzlich über Pfeile sowie drei Positionsschaltflächen erreichbar. Kurzes Antippen der beiden Porträts erzeugt eine leichte Welle; eine Scrollbewegung löst sie nicht aus. Reduzierte Bewegung zeigt die Kompetenztexte offen und lässt die Fotoeffekte ruhen.

Sieben Inline-SVG-Motive ersetzen externe SVG-`use`-Verweise, um die gemeldeten iPhone-/Safari-Bildprobleme zu vermeiden. Mobile Fließtexte sind mindestens 16 px groß, wichtige Schaltflächen mindestens 44 px hoch; die Darstellung berücksichtigt sichere Bildschirmränder und dynamische Viewport-Höhen.

## Vorschau ohne Installation

Auf GitHub den Branch `v6a-optimierung` auswählen und über **Code → Download ZIP** herunterladen. Die GitHub-Dateiansicht zeigt den HTML-Quelltext; für die interaktive Vorschau die ZIP entpacken und die folgende Datei lokal im Browser öffnen.

Die Datei `vorschau/Dirk_Herrmann_V6A_Vorschau.html` enthält die Website einschließlich Bildern, Schriftarten und Animationen in einer einzigen Datei. Nach dem Herunterladen des Repositorys die ZIP vollständig entpacken und diese HTML-Datei im Browser öffnen. Dafür sind weder Python noch Node.js erforderlich. Die Datei ist eine separate Prüffassung; bearbeitet werden weiterhin `index.html` und `assets/`. Sie wird nicht durch die Hosting-Konfiguration veröffentlicht.

Nach Änderungen lässt sich die Einzeldatei aus den aktuellen Quellen neu erzeugen:

```sh
node scripts/prepare-preview.cjs
```

Der Browser-Test erzeugt sie ebenfalls neu und prüft die Karten darin. Die Datei nicht separat bearbeiten.

## Lokal starten

Im Projektordner:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Dann im Browser `http://localhost:8000` öffnen. Mit `Strg+C` beenden. Für die normale Vorschau sind weder Node.js noch `npm install` nötig. Bitte über HTTP und nicht durch Doppelklick auf `index.html` testen.

## Dateien bearbeiten

- `index.html`: vorhandene Inhalte, Bilder, Navigation und PDF-Konfiguration.
- `assets/site.css`: ursprüngliche V6A-Stile in derselben Reihenfolge; technische Korrekturen am Ende.
- `assets/site.js`: Navigation und die fünf bisherigen Animationen, ohne Bibliothek zur Laufzeit.
- `assets/work-card.js`: aufklappbare Arbeitsweise-Karten mit modalem Dialog und Tastatursteuerung.
- `assets/mobile-interactions.js`: Tipp-Variante der vorhandenen Kompetenzkarten und Touch-/Tastaturnavigation der Erfahrungsfelder.
- `assets/hero-dirk.webp` und `assets/about-dirk.webp`: die zwei ausgewählten Original-Personenfotos; die Hero-Auswahl wurde auf Nutzerwunsch geändert.
- `assets/illustrations/`: sieben unterschiedliche SVG-Motive für Erfahrungsfelder und Arbeitsweise, mit Quellenmanifest.
- `assets/fonts/`: DM Sans, DM Serif Display und ein kleines monochromes Symbol-Subset inklusive Lizenzen. Keine Verbindung zu Google Fonts.
- `AENDERUNGEN.md` und `PRUEFBERICHT.md`: Änderungen, Testergebnisse und Grenzen.
- Die vier ursprünglichen Übergabedokumente und `referenzen/` bleiben als Ausgangsdokumentation erhalten. Für spätere freigegebene Änderungen gelten der aktuelle Inhaltsstand hier und `AENDERUNGEN.md`.

## Lebenslauf herunterladen

Die freigegebene **Website-Version ohne Telefonnummer** liegt unter `assets/lebenslauf-dirk-herrmann.pdf`. Sie wurde aus dem bereitgestellten Lebenslauf erstellt; die Originaldatei bleibt unverändert. Die Telefonnummer und das zugehörige Symbol wurden mit echter PDF-Redaktion entfernt. Beide Seiten bleiben außerhalb dieser Zeile visuell unverändert. E-Mail und die übrigen Inhalte sind weiterhin enthalten.

Der Hero enthält einen normalen HTML-Download-Link:

```html
<a class="hero-cv" href="assets/lebenslauf-dirk-herrmann.pdf"
   download="Lebenslauf-Dirk-Herrmann.pdf" type="application/pdf">
  Lebenslauf herunterladen ↓
</a>
```

Das funktioniert auch ohne JavaScript. Die Einzeldatei-Vorschau enthält dieselbe PDF eingebettet; auch dort lässt sie sich ohne zusätzliche Datei oder Server herunterladen. Vercel/Netlify sind für `application/pdf`, den Download-Dateinamen und erneute Validierung bei Aktualisierungen konfiguriert.

Für eine spätere Aktualisierung die bereinigte Website-PDF unter demselben Pfad ersetzen, Telefonnummer/Textauslesung und Darstellung erneut prüfen und die geprüfte SHA-256 in `docs/qa/cv-download/redaction.json` aktualisieren. Danach `node scripts/prepare-preview.cjs` ausführen. `npm test` prüft echte Downloads aus Website und Einzeldatei inklusive Dateinamen, Inhaltstyp und Hash; auch Varianten ohne JavaScript werden getestet.

## Wiederholbare Browserprüfung (optional)

Voraussetzungen: Node.js ab 20 und npm. Diese Pakete sind reine Entwicklungswerkzeuge:

```sh
npm ci
npx playwright install chromium
npm test
```

Unter Linux fehlen eventuell Systembibliotheken; Playwright erläutert sie mit `npx playwright install-deps chromium`. In dieser Cloud-Umgebung steht Chromium bereits bereit:

```sh
CHROMIUM_PATH=/usr/bin/chromium npm test
```

Der Test startet seinen eigenen lokalen Server mit der vorgesehenen Content Security Policy. Ergebnisse und Screenshots entstehen unter `test-results/`. Das Verzeichnis wird nicht veröffentlicht. Automatische Tests ersetzen keine Prüfung mit echten Mobilgeräten und Screenreadern.

`npm test` führt auch die zusätzliche Touch-Suite aus. Für deren gezielte Wiederholung: `CHROMIUM_PATH=/usr/bin/chromium npm run test:mobile`. Sie prüft 320, 375, 390 und 430 px breite Touch-Ansichten, wirkliche synthetisierte Wisch-/Tipp-Eingaben, alle Karten und sichtbare SVG-Pixel. Das ist Chromium-Emulation und kein Nachweis eines Tests mit physischem iPhone/Safari.

## Design- und Animations-Skills

Taste, Impeccable und die Emil-Kowalski-Skills sind projektlokal für Codex installiert und auf die vorhandenen Interaktionen angewendet. Nach einem neuen Checkout stellt `npm run skills:restore` die in `skills-lock.json` festgehaltenen Versionen wieder her. Die Skills werden für den lokalen Website-Start und das Hosting nicht benötigt. Installationsweg, angewendete Empfehlungen und Prüfungen: [docs/SKILLS.md](docs/SKILLS.md).

## Veröffentlichung vorbereiten

Der Nutzer hat die Website unter [lebenslauf-xi.vercel.app](https://lebenslauf-xi.vercel.app) veröffentlicht. Der bearbeitete Git-Branch ist `v6a-optimierung`. Die Konfigurationen für Vercel und Netlify verwenden denselben kleinen Kopierschritt:

```sh
node scripts/prepare-deploy.cjs
```

Dieser kopiert die vorhandene Website nach `dist/`. Es gibt keinen Framework-Build und keine Abhängigkeiten für diesen Schritt. Nur HTML und Assets werden veröffentlicht; Übergabedokumente, Tests, Referenzscreenshots und die zwei ungenutzten Fotovarianten bleiben außerhalb des Veröffentlichungspakets. Die aktuelle Website-PDF wird mitkopiert. Keine SPA-Weiterleitung: ein fehlendes PDF soll weiterhin eine echte 404 liefern.

Zum Prüfen des Pakets:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

**Vercel:** Das GitHub-Repository nach gewünschter Abnahme verbinden. Framework „Other“, Build-Befehl `node scripts/prepare-deploy.cjs`, Ausgabeverzeichnis `dist`. `vercel.json` enthält die Einstellungen und HTTP-Sicherheitsheader. Es sind keine Umgebungsvariablen oder API-Schlüssel nötig.

**Netlify:** Repository verbinden; `netlify.toml` übernimmt Build-Befehl, `dist` und dieselben Sicherheitsheader. Ebenfalls keine Umgebungsvariablen nötig. Die installierten Testpakete sind für den Build nicht erforderlich.

Die Konfigurationen werden lokal geprüft. Der Nutzer hat Vercel eingerichtet; die öffentliche Adresse ist aus dieser Cloud-Umgebung wegen der Netzrichtlinie nicht direkt abrufbar. Nach jedem Deployment Bilder, Schriftarten, alle Anker, Sicherheitsheader und den PDF-Download auf der öffentlichen URL prüfen. Die HTML-/CSS-/JS-Cache-Regeln erlauben Aktualisierungen; Bilder und Fonts werden einen Tag zwischengespeichert. Bei aktivierter GitHub-Integration übernimmt Vercel Änderungen am verbundenen Branch automatisch; den erfolgreichen Deployment-Status im Vercel-Dashboard prüfen.

Vor öffentlicher Bereitstellung bleiben die bereits in der Übergabe genannten rechtlichen Angaben und Datenschutzhinweise zu prüfen. Es wurden keine Kontaktangaben erfunden. Die E-Mail-Adresse wurde auf ausdrücklichen Nutzerwunsch aus dem bereitgestellten Lebenslauf übernommen. Der bestehende LinkedIn-Link ist unverändert und wird erst beim Anklicken extern geöffnet.

## QR-Code später

Erst nach Festlegung und Prüfung der dauerhaften HTTPS-Adresse einen QR-Code auf genau diese URL erzeugen. Keine lokale Adresse oder kurzlebige Deployment-Vorschau verwenden. Testdruck mit Smartphone scannen; der QR-Code gehört z. B. in die echte Lebenslauf-PDF. In diesem Stand existieren weder eine erfundene öffentliche URL noch ein darauf basierender QR-Code.
