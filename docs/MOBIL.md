# Smartphone-Anpassung für die digitale Visitenkarte

Anlass: Auf dem iPhone in Safari meldete der Nutzer fehlende Motive und zu wenig Interaktion in den bestehenden V6A-Abschnitten. Die Anpassung erhält Inhalte, Farben, Schriften, beide Porträts und die fünf Effekte. Es wurden keine neuen persönlichen Fotos oder Laufzeitbibliotheken ergänzt.

## Bilder und Sicherheitsrichtlinie

Die sieben Illustrationen verwendeten `<use href="assets/illustrations/datei.svg">` auf die Wurzel eines externen SVG-Dokuments. Das funktionierte im bisherigen Chromium-Test, ist aber für die gewünschte browserübergreifende Darstellung eine unnötige Abhängigkeit. Alle sieben Motive sind nun direkt eingebettet und funktionieren auch ohne externen SVG-Abruf. Originalpfade, ViewBox und Markenfarbe bleiben erhalten; `data-illustration` dokumentiert die unveränderte Quelldatei.

Die drei Inline-Styles `isolation:isolate` in einem Originalmotiv werden beim Einbetten durch eine gleichwertige CSS-Klasse ersetzt. Der erste vollständige Prüflauf hat die damit verbundenen CSP-Verstöße aufgedeckt; sie wurden behoben. Die Sicherheitsrichtlinie wurde nicht gelockert. Die Original-SVG-Dateien bleiben bytegleich im Asset-Ordner.

## Bedienung auf dem Smartphone

| Before | After | Why |
| --- | --- | --- |
| Bildvorderseiten der Kompetenzkarten mobil ausgeblendet | Bildvorderseite mit benanntem Öffnen-Button; Tipp dreht zur vorhandenen Beschreibung, Zurück-Button dreht zurück | Das bestehende Split-Motiv bleibt sichtbar; Besucher können die Inhalte gezielt entdecken |
| Erfahrungsfelder nur horizontal scrollbar | Native Wischbewegung plus Pfeile und drei direkt wählbare Positionen | Alle drei Felder sind erkennbar erreichbar; der aktive Zustand folgt der Scrollposition |
| Fotos reagieren nur auf Maus-/Stiftbewegung | Ein kurzer stationärer Touch startet leichte 2D-Wellen auf beiden Porträts | Rückmeldung auf Touch, ohne dauerhaftes WebGL oder Eingriff in die Scrollgeste |
| Kleine mobile Fließtexte und Beschriftungen | Fließtexte mindestens 16 px, wichtige Zusatzbeschriftungen 11 px und zentrale Touch-Ziele mindestens 44 px | Bessere Lesbarkeit und zuverlässigere Bedienung |
| Feste mobile Raumaufteilung | Zwei Arbeitsweise-Spalten, einspaltiger Werdegang auf schmalen Geräten, dynamische Dialoghöhe und sichere seitliche Bildschirmränder | Inhalte bleiben lesbar, Motive sichtbar und Bedienelemente erreichbar |

Die Tipp-Karten verwenden dieselben vorhandenen Vorder- und Rückseiten. Fokus und ARIA-Zustände wechseln mit der sichtbaren Seite. Tastaturöffnung und Escape reagieren ohne Drehverzögerung. Bei reduzierter Bewegung und ohne JavaScript bleibt die Kompetenzbeschreibung offen lesbar.

Die mobile Erfahrungsnavigation orientiert sich am geprüften Watermelon Carousel Navigator. Die vorhandenen Watermelon Expandable Cards bleiben die Detailansichten der vier Arbeitsschritte. Die Componentry-Effekte am Desktop behalten ihr bisheriges Verhalten. Originalquellen und Lizenz: [WATERMELON.md](WATERMELON.md).

Die Swipe-Erkennung des Browsers bleibt erhalten: Der Code setzt keine eigenen Drag-Sperren auf die Erfahrungsfelder. Auf Fotos wird eine Welle nur nach kurzem, nahezu unbewegtem Kontakt ausgelöst. `pointercancel` und vertikales Wischen lösen keine Fotoanimation aus. Die Regeln zur reduzierten Bewegung bleiben wirksam.

## Technische Änderungen

- Inline-Motive in `index.html`; CSS-Klasse für die drei Isolationsgruppen.
- `assets/mobile-interactions.js`: Tipp-Karten, Fokusführung, Positionsanzeige, Touch-/Tastaturnavigation, Rücksetzen beim Wechsel der Bildschirmorientierung.
- `assets/site.js`: leichte Touch-Reaktion der vorhandenen Fotoeffekte.
- `assets/site.css`: mobile Typografie, Abstände, Raster, Vorder-/Rückseiten, Kontrastkorrektur der kleinen Kompetenznummern, Safe Areas und Dialogmaße.
- Übereinstimmende Cache-Regeln für das neue Skript in Vercel und Netlify.
- Einzeldatei-Vorschau aus denselben Quellen neu erzeugt.

## Prüfung und Grenzen

`CHROMIUM_PATH=/usr/bin/chromium npm test` führt den bestehenden Regressionslauf und die neue Touch-Suite aus. `npm run test:mobile` wiederholt nur die Touch-Suite. Die Berichte werden nach erfolgreichem Abschluss unter `test-results/report.json` und `test-results/mobile/report.json` gespeichert. Die archivierten aktuellen Nachweise stehen unter [qa](qa/README.md).

Die Touch-Suite verwendet Chromium bei 320, 375, 390 und 430 px Breite mit synthetisierten Touch-Eingaben. Sie prüft:

- sichtbare SVG-Pixel durch Bildvergleich mit derselben, vorübergehend ausgeblendeten Grafik;
- Öffnen/Schließen aller drei Kompetenzkarten und Fokus-Rückgabe;
- Zugriff auf alle Erfahrungsfelder über die Schaltflächen und Wischen;
- horizontale und vertikale Touch-Gesten über derselben Oberfläche;
- Foto-Tipps, Ruhe nach der Welle und ausbleibende Animation beim Scrollen;
- alle vier Detailkarten mit sichtbarem Motiv, Fokus und erhaltener Scrollposition;
- Hoch-/Querformatwechsel, reduzierte Bewegung, Textgrößen und Touch-Ziele;
- axe-Prüfungen jeder der drei geöffneten Kompetenzkarten zusätzlich zu den sechs bestehenden Scans.

Die Live-Adresse `https://lebenslauf-xi.vercel.app` und die Playwright-WebKit-Downloadserver sind in dieser Cloud-Netzrichtlinie gesperrt. Deshalb ist dies **kein direkter Safari-/iOS-Nachweis** und keine Live-Abnahme des Vercel-Deployments. Die konkrete SVG-Abhängigkeit wurde entfernt; die finale Sichtprüfung auf dem tatsächlichen iPhone bleibt der Gerätecheck.

Der Impeccable-Detektor wurde einmal über die geänderte Oberfläche ausgeführt und meldete 47 heuristische Befunde. Der Rohbefund bleibt unter `qa/mobile/impeccable-before.json` erhalten. Der tatsächliche Kontrasthinweis zur kleinen Zahl auf der türkisfarbenen Kompetenzrückseite wurde korrigiert und mit axe in geöffnetem Zustand geprüft. Die relevanten kleinen mobilen Beschriftungen wurden vergrößert. Weitere Meldungen betreffen die vom Nutzer festgelegte Serifentypografie, Abschnittsnummern, alte CSS-Schichten, bereits mobil ausgeblendete dekorative Wasserzeichen, verschachtelte Containerabstände und die recherchierten Originalillustrationen. Diese Hinweise wurden nicht durch globale Ausnahmen unterdrückt und rechtfertigen keine eigenständige Neugestaltung.
