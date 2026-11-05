# Dirk Herrmann · Bewerbungswebsite V6A

Diese Website entwickelt die gelieferte V6A weiter. HTML, Inhalte, Reihenfolge, Farben, Typografie und die fünf vorhandenen Effekte bilden weiterhin die Basis. Kein Framework, Backend oder externer Dienst ist zum Betrieb erforderlich.

## Vorschau ohne Installation

Auf GitHub den Branch `v6a-optimierung` auswählen und über **Code → Download ZIP** herunterladen. Die GitHub-Dateiansicht zeigt den HTML-Quelltext; für die interaktive Vorschau die ZIP entpacken und die folgende Datei lokal im Browser öffnen.

Die Datei `vorschau/Dirk_Herrmann_V6A_Vorschau.html` enthält die Website einschließlich Bildern, Schriftarten und Animationen in einer einzigen Datei. Nach dem Herunterladen des Repositorys die ZIP vollständig entpacken und diese HTML-Datei im Browser öffnen. Dafür sind weder Python noch Node.js erforderlich. Die Datei ist eine separate Prüffassung; bearbeitet werden weiterhin `index.html` und `assets/`. Sie wird nicht durch die Hosting-Konfiguration veröffentlicht.

## Lokal starten

Im Projektordner:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Dann im Browser `http://localhost:8000` öffnen. Mit `Strg+C` beenden. Für die normale Vorschau sind weder Node.js noch `npm install` nötig. Bitte über HTTP und nicht durch Doppelklick auf `index.html` testen.

## Dateien bearbeiten

- `index.html`: vorhandene Inhalte, Bilder, Navigation und PDF-Konfiguration.
- `assets/site.css`: ursprüngliche V6A-Stile in derselben Reihenfolge; technische Korrekturen am Ende.
- `assets/site.js`: Navigation, Arbeitsweise und die fünf Animationen, ohne Bibliothek zur Laufzeit.
- `assets/hero-dirk.webp` und `assets/about-dirk.webp`: die zwei unveränderten Personenfotos.
- `assets/fonts/`: DM Sans, DM Serif Display und ein kleines monochromes Symbol-Subset inklusive Lizenzen. Keine Verbindung zu Google Fonts.
- `AENDERUNGEN.md` und `PRUEFBERICHT.md`: Änderungen, Testergebnisse und Grenzen.
- Die vier ursprünglichen Übergabedokumente und `referenzen/` bleiben als Ausgangsdokumentation erhalten.

## Den echten Lebenslauf später ergänzen

1. Die freigegebene PDF als `assets/lebenslauf-dirk-herrmann.pdf` ablegen.
2. In `index.html` beim Button mit `id="cv-info"` nur dieses Attribut ändern:

   ```html
   data-cv-url="assets/lebenslauf-dirk-herrmann.pdf"
   ```

3. Lokal öffnen, den Download anklicken und Inhalt/Dateiname prüfen. JavaScript wandelt den Platzhalter dann in einen normalen Download-Link um. Das leere Attribut bedeutet weiterhin „PDF folgt“, ohne eine nicht vorhandene Datei anzufragen.
4. Für einen Download **auch ohne JavaScript** den Platzhalter stattdessen durch diesen normalen Link ersetzen und den dazugehörigen Hinweis entfernen:

   ```html
   <a class="hero-cv" href="assets/lebenslauf-dirk-herrmann.pdf" download>
     Lebenslauf herunterladen ↓
   </a>
   ```

   Das Skript unterstützt auch diesen Fall. Bis die tatsächliche PDF vorliegt, bleibt die aktuelle Kennzeichnung bestehen.

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

## Veröffentlichung vorbereiten

Die Konfigurationen für Vercel und Netlify sind vorhanden; es wurde nichts veröffentlicht. Beide verwenden denselben kleinen Kopierschritt:

```sh
node scripts/prepare-deploy.cjs
```

Dieser kopiert die vorhandene Website nach `dist/`. Es gibt keinen Framework-Build und keine Abhängigkeiten für diesen Schritt. Nur HTML und Assets werden veröffentlicht; Übergabedokumente, Tests, Referenzscreenshots und die zwei ungenutzten Fotovarianten bleiben außerhalb des Veröffentlichungspakets. Eine künftig in `assets/` abgelegte PDF wird mitkopiert. Keine SPA-Weiterleitung: ein fehlendes PDF soll weiterhin eine echte 404 liefern.

Zum Prüfen des Pakets:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

**Vercel:** Das GitHub-Repository nach gewünschter Abnahme verbinden. Framework „Other“, Build-Befehl `node scripts/prepare-deploy.cjs`, Ausgabeverzeichnis `dist`. `vercel.json` enthält die Einstellungen und HTTP-Sicherheitsheader. Es sind keine Umgebungsvariablen oder API-Schlüssel nötig.

**Netlify:** Repository verbinden; `netlify.toml` übernimmt Build-Befehl, `dist` und dieselben Sicherheitsheader. Ebenfalls keine Umgebungsvariablen nötig. Die installierten Testpakete sind für den Build nicht erforderlich.

Beide Konfigurationen sind lokal geprüft, aber noch nicht bei einem Hostinganbieter ausgeführt. Nach dem ersten Deployment Bilder, Schriftarten, alle Anker, Sicherheitsheader und gegebenenfalls den echten PDF-Download auf der öffentlichen URL erneut prüfen. Die HTML-/CSS-/JS-Cache-Regeln erlauben Aktualisierungen; Bilder und Fonts werden einen Tag zwischengespeichert.

Vor öffentlicher Bereitstellung bleiben die bereits in der Übergabe genannten rechtlichen Angaben und Datenschutzhinweise zu prüfen. Es wurden keine Kontaktangaben erfunden oder ergänzt. Der bestehende LinkedIn-Link ist unverändert und wird erst beim Anklicken extern geöffnet.

## QR-Code später

Erst nach Festlegung und Prüfung der dauerhaften HTTPS-Adresse einen QR-Code auf genau diese URL erzeugen. Keine lokale Adresse oder kurzlebige Deployment-Vorschau verwenden. Testdruck mit Smartphone scannen; der QR-Code gehört z. B. in die echte Lebenslauf-PDF. In diesem Stand existieren weder eine erfundene öffentliche URL noch ein darauf basierender QR-Code.
