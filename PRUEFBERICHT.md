# Prüfbericht · V6A technisch optimiert

Stand: 5. November 2026. Geprüft wurde die vorhandene Website nach den gezielten technischen Änderungen, nicht ein neuer Entwurf.

## Durchführung

`CHROMIUM_PATH=/usr/bin/chromium npm test` prüft das mit `scripts/prepare-deploy.cjs` erzeugte Veröffentlichungspaket über einen lokalen HTTP-Server. Der Server liefert die vorgesehene Content Security Policy mit aus. Werkzeuge: Playwright 1.58.2, Chromium 155 und axe-core 4.11.1. WebGL läuft im Headless-Test über Software-Rendering.

Der abschließende maschinenlesbare Bericht und ausgewählte Screenshots liegen unter `docs/qa/`. Der Testlauf erzeugt seine vollständigen aktuellen Ergebnisse unter `test-results/`; alte Ergebnisse werden zu Beginn entfernt.

## Ergebnisse

| Prüfung | Ergebnis |
| --- | --- |
| 390 × 900, Touch-/Smartphone-Emulation | Kein horizontaler Seitenüberlauf; Menü, Kontaktanker, Inhalte und native horizontale Erfahrungs-Karten bedienbar |
| 768 × 900, Tablet-Viewport | Kein horizontaler Seitenüberlauf; verständliche Karten-Fallbacks und funktionsfähige Navigation |
| 1440 × 900, Desktop | Hero, beide Fotos, Split-Flip und alle drei Flip-Stack-Felder geprüft |
| 320 × 900 | Zusätzlich schmalen Smartphone-Viewport ohne horizontalen Seitenüberlauf geprüft |
| 844 × 390 und 720 × 450 | Niedrige/querformatige bzw. schmale Viewports: fließende Karten statt abgeschnittener Sticky-Stufen |
| Navigation/Tastatur | Skip-Link, Menüöffnung, Tab-Reihenfolge, Escape mit Fokusrückgabe, Menüschließen und Fokus am Kontaktziel geprüft |
| Arbeitsweise | Alle vier Buttons per Tastatur aktiviert; genau ein aktiver Schritt und korrekter Ausgabetext |
| Bilder | Alle fünf verwendeten Bilddateien erfolgreich geladen, einschließlich der horizontal zunächst außerhalb liegenden Lazy-Load-SVGs |
| Hero Geometric | Hintergrund läuft, ist pausierbar und zeichnet außerhalb des Sichtfelds keine weiteren Frames |
| Image Ripple | Mausbewegung aktiviert fehlerfreies WebGL auf beiden Fotos; Wellen enden wieder im unveränderten Originalbild |
| WebGL nicht verfügbar | Tatsächliche 2D-Wellen auf beiden Fotos nachgewiesen; Originalfotos bleiben sichtbar |
| WebGL-Kontextverlust | Originalfoto bleibt sichtbar, kein leerer Canvas über dem Gesicht |
| Scroll Split Card | Start und vollständige Drehung unterscheiden sich; Fortschritt erreicht 100 %, drei Kompetenztexte bleiben lesbar |
| Case Study Flip Stack | Positionen für alle drei Erfahrungsfelder angesteuert; jeweilige Karte voll sichtbar; Artikel bleiben für Hilfsmittel erreichbar |
| Letter Cascade | Vollständiger zugänglicher H1-Name; Animationen beim Eintritt, zusammenhängende Wörter und lesbare reduzierte Darstellung |
| Reduzierte Bewegung | Sowohl beim Seitenstart als auch nachträglich geprüft: sichtbare Überschriften und statische Karten, keine Foto-Ripple-Animation |
| Ohne JavaScript | Desktop und Smartphone: Navigation, Überschriften, Kompetenztexte und alle Erfahrungsfelder lesbar; Hinweis auf interaktive Zusatzfunktionen |
| Ohne IntersectionObserver / Canvas | Inhalt und Foto bleiben sichtbar; kein Skriptabbruch |
| PDF-Platzhalter | Klar als „folgt“ bezeichnet; Hinweis auf-/zuklappbar; keine Anfrage einer fehlenden PDF |
| PDF-Vorbereitung | Konfigurierter Pfad erzeugt einen Download-Link; auch ein später direkt eingesetzter HTML-Link verhindert die übrigen Funktionen nicht. Keine Test-PDF als Lebenslauf ausgegeben |
| Automatische Barrierefreiheit | Vier axe-Prüfungen: Desktop/Smartphone mit normaler und reduzierter Bewegung; keine automatischen Verstöße gegen die geprüften WCAG-2/2.1-A/AA- und Best-Practice-Regeln |
| Ressourcen und Sicherheit | Keine JavaScript-/Konsolenfehler, HTTP-Fehler, CSP-Verstöße oder externen Ressourcenanfragen im Prüflauf |

Insgesamt: **27 Prüfgruppen bestanden**. Einzelne Prüfgruppen enthalten mehrere Assertions bzw. Auflösungen. Es wurden keine fehlgeschlagenen Prüfungen als bestanden gewertet und keine Tests übersprungen.

## Integrität und Veröffentlichungsvorbereitung

- Alle ursprünglichen Überschriften und Absatztexte wurden programmgesteuert mit der gelieferten V6A verglichen: unverändert. Neu sind technische Hilfstexte; der PDF-CTA wurde eindeutig gekennzeichnet.
- Alle ursprünglichen WebP-/SVG-Dateien wurden byteweise mit der ZIP-Basis verglichen: unverändert. Die vier ursprünglichen Übergabedokumente sind ebenfalls unverändert.
- SHA-256 Hero: `a84e5c77a14347dc286c54692430c942b57b8a547f67f23c826a142309f463c4`
- SHA-256 Über mich: `b6acd135776df7dfaac430ae735751ffe9bdcdad170f683a038b13d9b66266d4`
- `vercel.json` und `netlify.toml` lassen sich parsen und haben übereinstimmende Sicherheitsheader sowie dasselbe Ausgabeverzeichnis. Die Anwendung funktioniert unter dieser CSP.
- `dist/` enthält genau zwei Personenfotos. Unbenutzte Fotovarianten, Tests und Übergabedokumente werden nicht mitveröffentlicht.
- Die bestehende LinkedIn-Adresse wurde beibehalten. Im Test wurde keine externe Kontaktaufnahme ausgelöst.

## Ladeverhalten

Das Hero-Foto hat hohe Ladepriorität und passende intrinsische Maße. Das zweite Foto und die SVG-Felder laden verzögert; beim horizontalen Weiterscrollen werden die weiteren Bilder korrekt nachgeladen. Schriften, Styles und Skripte liegen lokal. Es gibt keine externe Schrift-, API- oder Animationsbibliothek zur Laufzeit. Die bereitgestellten Cache-Regeln können erst beim Hosting wirksam werden.

Der JSON-Bericht enthält lokale, frühe LCP-/CLS-Beobachtungen aus dem Browser. Sie sind **keine Lighthouse-Bewertung** und kein Feldnachweis unter Mobilfunkbedingungen. Insbesondere können Schriftwechsel und langsame Geräte andere Ergebnisse liefern. Es wird kein erfundener Lighthouse-Score oder garantierter FPS-Wert angegeben.

## Grenzen und offene Punkte

Smartphone und Tablet wurden im Chromium-Browser emuliert; echte iPhones/Android-Geräte, Safari, Firefox und reale Screenreader wurden nicht getestet. Automatische Barrierefreiheitstests beweisen keine vollständige Konformität. Eine abschließende Sicht- und Bedienprüfung auf den tatsächlich genutzten Geräten bleibt sinnvoll.

Die echte Lebenslauf-PDF liegt weiterhin nicht vor. Vercel-/Netlify-Deployment, produktive HTTP-Header und reale Download-Funktion können erst nach Upload bzw. Veröffentlichung abschließend geprüft werden. Es wurden weder veröffentlicht noch Domain, Kontaktdaten oder ein QR-Ziel erfunden. Die lokalen Projekt- und Veröffentlichungsschritte sind in `README.md` beschrieben.
