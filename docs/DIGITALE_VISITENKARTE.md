# Digitale Visitenkarte

Die bestehende Website ist der zentrale Auftritt unter **https://lebenslauf-xi.vercel.app/**. Für die Weitergabe sind QR-Dateien, eine Kontaktdatei und ein eigenes Vorschaubild vorbereitet. Das bestätigte V6-Design, die Texte, beide Originalporträts und die bereinigte Lebenslauf-PDF bleiben erhalten.

## Verwenden

| Zweck | Datei / Link |
| --- | --- |
| Website teilen | [lebenslauf-xi.vercel.app](https://lebenslauf-xi.vercel.app/) |
| QR auf dem Smartphone, in einer E-Mail oder einem Dokument | [PNG herunterladen](https://lebenslauf-xi.vercel.app/assets/qr-dirk-herrmann.png) |
| QR für druckfähige Gestaltung | [SVG herunterladen](https://lebenslauf-xi.vercel.app/assets/qr-dirk-herrmann.svg) |
| Kontakt übernehmen | [Dirk-Herrmann.vcf](https://lebenslauf-xi.vercel.app/assets/dirk-herrmann.vcf) oder „Kontakt speichern“ im Kontaktbereich |
| Bild für Link-Vorschauen | [Vorschaubild](https://lebenslauf-xi.vercel.app/assets/dirk-herrmann-vorschau.png) |

Die Links auf neue Dateien werden nach dem erfolgreichen Vercel-Deployment verfügbar. Die Dateien liegen zusätzlich unter `assets/` im Repository.

Der QR-Code enthält direkt die Website-Adresse, ohne Trackingparameter oder Weiterleitungsdienst. Er wurde mit Fehlerkorrektur Q und vier Modulen weißem Rand erzeugt. Der weiße Rand gehört zum Code und sollte beim Platzieren erhalten bleiben. Für Ausdrucke empfiehlt sich zunächst etwa 25–30 mm Kantenlänge und ein Scan des fertigen Testdrucks. Vorhandene QR-Dateien nicht einfach auf eine neue Domain umbeschriften: Das Ziel ist in den Bildpunkten gespeichert.

Die vCard enthält **Name, E-Mail, Website und LinkedIn**, ohne Telefonnummer. Die Website liefert `text/vcard; charset=utf-8` und lässt die native Kontaktvorschau des Geräts zu. Der Nutzer bestätigt die Übernahme im jeweiligen Adressbuch selbst. Die Offline-Einzeldatei bietet stattdessen den eingebetteten VCF-Download an.

Die vorhandene Lebenslauf-PDF wurde nicht umgestaltet. Der QR-Code kann später an einer bewusst gewählten Stelle in Bewerbungsunterlagen oder auf einer gedruckten Karte platziert werden.

## Link-Vorschau

Das Bild ist 1200 × 630 px groß und verwendet das bestehende Hero-Porträt, die lokal vorhandenen Schriften und die bestätigte Farbwelt. Es ist eine gerenderte HTML-Vorschau; die Originalfotodatei wird nicht verändert. Auf der Website bleiben weiterhin dieselben zwei persönlichen Fotos sichtbar.

Open-Graph- und Twitter-Card-Metadaten verweisen mit absoluten HTTPS-Adressen auf dieses Bild und die Website. Eine Canonical-Adresse ist hinterlegt. Die Plattformen entscheiden selbst, wie sie Vorschauen darstellen, und können ältere Ergebnisse zwischenspeichern. Der tatsächliche Abruf durch LinkedIn/WhatsApp wurde aus dieser Cloud-Umgebung nicht getestet.

## Pflegen oder später eine Domain ergänzen

`site-profile.json` enthält die bestätigte Website-Adresse und Kontaktdaten. Zum Aktualisieren:

```sh
npm ci
npx playwright install chromium
npm run card:prepare
npm test
```

In dieser Cloud-Umgebung ist Chromium vorhanden; dort `CHROMIUM_PATH=/usr/bin/chromium npm run card:prepare` verwenden. Das Kommando erzeugt QR-PNG/-SVG, VCF und Vorschaubild neu, aktualisiert die Metadaten in `index.html` und regeneriert die Einzeldatei. Die Bildvorlage ist `templates/link-preview.html`.

Die erzeugten Dateien werden committed. Vercel/Netlify benötigen für den Betrieb nur den bestehenden statischen Kopierschritt, weder Chromium noch QR-Bibliotheken. `qrcode`, `jsqr` und `pngjs` sind reine Entwicklungswerkzeuge; sie werden nicht in den Browser geladen.

Bei einer neuen Domain `website` in `site-profile.json` ändern und die Dateien erneut erzeugen. Bei geänderten Kontaktdaten auch den sichtbaren Kontaktbereich pflegen; der Generator prüft E-Mail und LinkedIn auf Übereinstimmung. Bereits verteilte QR-Codes zeigen weiterhin auf die bisherige Adresse. Diese deshalb bei einem späteren Umzug erhalten oder kontrolliert auf die neue Adresse umleiten.

## Prüfungen

`npm run test:card` führt die gezielte Prüfung aus; `npm test` enthält sie ebenfalls. Unabhängige QR-Decodierung prüft die URL aus dem hochauflösenden PNG und aus PNG/SVG bei 256 px Bildschirmgröße. Weitere Checks prüfen die vCard-Felder, Zeilenfaltung, Dateinamen, MIME-Typen, echte Downloads auch ohne JavaScript, Metadaten, Bildmaße, Kontaktlayout und automatische Barrierefreiheit.

Ergebnisse stehen unter `test-results/card/`; archivierte erfolgreiche Nachweise unter [qa/card](qa/card/README.md). Der native Import in die iPhone-Kontakte-App, physische Ausdrucke und die Vorschau in externen Messenger-Apps sind zusätzliche Geräte-/Plattformprüfungen. Die öffentliche Vercel-Adresse ist aus der Cloud-Netzrichtlinie weiterhin nicht abrufbar.
