# Bildauswahl für Abschnitt 03 und 04

Die doppelt verwendeten Motive wurden durch sieben unterschiedliche, recherchierte Illustrationen ersetzt. Der Kompetenzbereich 02 behält seine bestehende gemeinsame Split-Grafik. Hero und Über-mich-Porträt bleiben die einzigen persönlichen Fotos.

| Bereich | Motiv | Datei |
| --- | --- | --- |
| 03 · Performance Marketing | Kampagnen-/Marketinganalyse | `marketing-analysis.svg` |
| 03 · Social Media | Social-Media-Beitrag und Content | `social-media-post.svg` |
| 03 · Projektmanagement | Digitale Projektorganisation | `organizing-projects.svg` |
| 04 · Verstehen | Recherche und Zusammenhänge | `researching.svg` |
| 04 · Hinterfragen | Analyse und Einordnung | `business-analytics.svg` |
| 04 · Entwickeln | Kreativer Prozess / Idee | `creative-process.svg` |
| 04 · Umsetzen | Zusammenarbeit im Projekt | `project-team.svg` |

## Urheber und Herkunft

Illustrationen von **Katerina Limpitsouni / unDraw**. Originalangebot: https://undraw.co/illustrations. Für die Originalgrafiken gelten die [unDraw-Nutzungsbedingungen](https://undraw.co/license), nicht die Softwarelizenz eines Paket-Wrappers. Die Motive werden als Bestandteile dieser persönlichen Bewerbungswebsite verwendet, nicht als konkurrierende Illustrationsbibliothek.

Bezugsquelle der unveränderten SVG-Dateien: https://github.com/evo-mark/undraw-svg/tree/d467f080ae92a39110774f8eb80bcd2c61d88a09/svgs. Das README dieser Sammlung nennt unDraw als Quelle und Katerina Limpitsouni als Illustratorin. Die zusätzliche MIT-Lizenz der Sammlung ist als `assets/licenses/evoMark-MIT.txt` enthalten; Hinweise zur ursprünglichen Grafiklizenz stehen in `assets/licenses/unDraw.txt`.

Die ausgewählten Originaldateien samt SHA-256 und Verwendungszweck sind in `assets/illustrations/sources.json` dokumentiert. Sie werden bytegleich übernommen. Ihre vom Anbieter vorgesehene `currentColor`-Farbe wird bei der Einbindung über CSS auf das vorhandene Kobaltblau gesetzt. Die Illustrationen sind symbolische Motive und stellen keine tatsächlichen Kundenprojekte oder Leistungsergebnisse dar.

## Technische Einbindung

Die sieben Motive sind jetzt direkt als SVG-Pfade in `index.html` eingebettet. Damit hängen Website und Dialoge nicht mehr von externen `<use href="datei.svg">`-Verweisen auf ein vollständiges SVG-Dokument ab, deren Unterstützung je nach Browser abweicht. Die Markenfarbe folgt weiterhin `currentColor`; die gerahmten Bilder zeigen das vollständige Motiv. `data-illustration` und ein Kommentar verweisen auf die jeweilige Originaldatei.

Die Originaldateien im Asset-Ordner bleiben bytegleich erhalten. Drei `style="isolation:isolate"`-Attribute der Projektorganisationsgrafik werden ausschließlich bei der HTML-Einbindung durch die gleichwertige CSS-Klasse `illustration-isolate` ersetzt. So gelten dieselben Darstellungsregeln unter der vorhandenen Content Security Policy, ohne Inline-Styles freizugeben.

`scripts/prepare-preview.cjs` übernimmt die bereits eingebetteten Pfade auch in die herunterladbare Einzeldatei. Der Arbeitsweise-Dialog klont das Inline-SVG der jeweils geöffneten Karte; dadurch stimmen normale Website, Dialog und Offline-Vorschau überein. Quellen-/Lizenzhinweise werden in beide Veröffentlichungspakete übernommen.

Weitere Kandidaten aus ManyPixels und illlustrations.co wurden recherchiert und betrachtet, aber nicht in die Website übernommen.
