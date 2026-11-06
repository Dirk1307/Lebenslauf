# Arbeitsweise: Expandable Profile Card

Die Arbeitsweise-Karten übertragen das vom Nutzer gewünschte Verhalten der **Watermelon Expandable Profile Card** auf die bestehende V6A-Website: Eine kompakte Bildkarte öffnet sich mit einer fließenden Größen-/Positionsanimation in eine größere Detailansicht. Auf Desktop stehen Illustration und Text nebeneinander, auf Smartphone untereinander.

## Originalquelle und Lizenz

- Gewünschter Registry-Eintrag: `https://registry.watermelon.sh/r/expandable-profile-card.json`
- Offizielles Repository: https://github.com/WatermelonCorp/watermelon-platform
- Geprüfter Commit: `b0171095227a67c40e627271a1e0ae67cdc2ed21`
- Original: https://github.com/WatermelonCorp/watermelon-platform/blob/b0171095227a67c40e627271a1e0ae67cdc2ed21/src/data/contents/animated-components/expandable-profile-card/original.tsx
- Komponentenbeschreibung: https://github.com/WatermelonCorp/watermelon-platform/blob/b0171095227a67c40e627271a1e0ae67cdc2ed21/src/data/contents/registry/expandable-profile-card.mdx
- MIT-Lizenz: `assets/licenses/Watermelon-MIT.txt` (im Veröffentlichungspaket und in der Einzeldatei enthalten).

Die Registry-Domain war in der Cloud-Umgebung gesperrt. Deshalb wurde der Code direkt aus dem öffentlichen Originalrepository gelesen. Dessen README beschreibt die Registry als aus diesen gepflegten Quelldateien generiert; der MDX-Eintrag enthält exakt den vom Nutzer angegebenen shadcn-Befehl.

## Integration

Der React-/Motion-/Tailwind-Quellcode ist nicht direkt in ein statisches HTML-Dokument einsetzbar. Statt einer Migration der ganzen Website wurde das Karten-/Overlay-Verhalten in `assets/work-card.js` und dem entsprechenden Abschnitt von `assets/site.css` umgesetzt. Es handelt sich um eine Vanilla-Portierung nach der Originalquelle, **nicht** um einen ausgeführten shadcn-CLI-Import. Die Website benötigt weiterhin keinen Framework-Build und keine neue Laufzeitbibliothek.

Die vier Schritte bleiben erhalten: Verstehen, Hinterfragen, Entwickeln, Umsetzen. Ihre Beschreibungen wurden in der anschließenden Inhaltsrunde auf die vom Nutzer bestätigten Marketingaufgaben konkretisiert. Inzwischen werden vier eigene recherchierte SVG-Motive für die Arbeitsschritte verwendet, jeweils verschieden von den Bildern der Erfahrungsfelder. Der Dialog übernimmt genau das Motiv der geöffneten Karte. Quellen: `docs/BILDQUELLEN.md`. Es werden keine weiteren persönlichen Fotos oder fremden Demo-Porträts verwendet. Die fiktiven Texte und Kontaktangaben des Watermelon-Demos werden nicht übernommen.

Zusätzlich zur Vorlage: native modale Dialog-Semantik, Tastaturaktivierung, Escape, Fokusbegrenzung durch `showModal()`, Fokusrückgabe, Schließen über Schaltfläche oder Hintergrund, gesperrtes Hintergrundscrollen, vorheriger/nächster Schritt sowie reduzierte Bewegung. Ohne JavaScript bzw. ohne Dialog-Unterstützung bleiben alle vier Beschreibungen direkt unter ihren Karten lesbar.

Die Einzeldatei unter `vorschau/` wird mit `node scripts/prepare-preview.cjs` direkt aus dem aktuellen HTML, CSS, allen Skripten und den Assets erzeugt. So stimmen GitHub-Download und normale Website überein.

## Mobile Ergänzung · 6. November 2026

Für die Touch-Navigation der drei Erfahrungsfelder wurde zusätzlich das originale Muster [Carousel Navigator](https://github.com/WatermelonCorp/watermelon-platform/blob/b0171095227a67c40e627271a1e0ae67cdc2ed21/src/data/contents/animated-components/carousel-navigator/original.tsx) geprüft. Die Kombination aus Pfeilen und direkt wählbaren Positionen wird im vorhandenen V6-Stil umgesetzt: echte 44-px-Schaltflächen, aktive Seitenanzeige und native horizontale Scrollbewegung mit Scroll-Snap. Es gibt kein automatisches Weiterschalten. Vertikales Scrollen und die Trägheit des Browsers bleiben erhalten.

Das React-/Motion-Demo wurde nicht importiert; `assets/mobile-interactions.js` implementiert die passende Navigation für die bestehenden Karten. Die dortigen fiktiven Inhalte, wechselnden Demo-Themen und Auto-Delay-Effekte werden nicht verwendet. Die schon vorhandene MIT-Lizenz deckt die dokumentierte Originalquelle ab.

Die vorhandenen drei Split-Karten nach der Componentry-Referenz erhalten auf kleinen Bildschirmen eine Tipp-Variante mit Bildvorderseite und Inhaltsrückseite. Die Desktop-Scrollanimation bleibt erhalten. Bei reduzierter Bewegung oder fehlendem JavaScript bleibt der Text ohne Drehung offen. Die Componentry-Dokumentationsseiten konnten in dieser Cloud-Sitzung wegen der Netzrichtlinie nicht erneut abgerufen werden; es wurde keine neue Originalkomponente von dort importiert.

Die vier Expandable Cards bleiben die Watermelon-Detailansichten. Ihre Illustrationen sind inzwischen direkt eingebettet, die mobile Dialoghöhe berücksichtigt `dvh`, und das Textfeld lässt sich bei Bedarf separat scrollen. Es werden keine zusätzlichen persönlichen Fotos eingeführt.
