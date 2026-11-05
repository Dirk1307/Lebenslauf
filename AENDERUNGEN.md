# Technische Weiterentwicklung auf Basis V6A

## Ausgangslage

Übernommen wurde ausschließlich `Codex_Uebergabe_Dirk_Herrmann_V6A.zip`. Zuerst wurden `README_START_HIER.md`, `CODEX_PROMPT.md`, `DESIGN_BRIEF.md` und `QA_CHECKLIST.md` gelesen, anschließend HTML, CSS, JavaScript und sämtliche Assets geprüft. Das zuvor leere Git-Repository enthielt keinen konkurrierenden Website-Stand.

V6A enthält eine statische HTML-Seite mit mehreren aufeinander aufbauenden CSS-Ständen und drei eingebetteten Skriptblöcken. Die Effekte sind eigene Vanilla-JavaScript-Implementierungen; es wurden keine Componentry-/React-Komponenten importiert.

## Gezielte Änderungen

- Vorhandenes CSS in `assets/site.css` und die überarbeiteten Skripte in `assets/site.js` ausgelagert. HTML bleibt die Inhaltsquelle; keine Komponentenarchitektur und kein Framework hinzugefügt. JavaScript lädt mit `defer`.
- Die beiden aktiven WebP-Dateien und alle SVG-Illustrationen bleiben bytegenau erhalten. Die falschen Hero-HTML-Maße `1500×1000` auf die tatsächlichen `1275×1700` korrigiert. Hero lädt priorisiert, das zweite Foto verzögert.
- CSS-Konflikt `.ripple-wrap` / `.hero-portrait` korrigiert: Das Foto sitzt wieder absolut im bereits vorgesehenen Bogenrahmen, statt rechts/unten überzulaufen. Die bestehenden Insets, `object-position` und der Hero-Zoom bleiben erhalten.
- Den geerbten oberen Abstand am Hero-Mauslabel aufgehoben. Dadurch bleibt der Hinweis eine kleine Kapsel und zieht keine dunkle Fläche über das Gesicht. Ein leeres Alt-Badge am zweiten Foto entfernt. Die Kompetenz-Hintergrundgrafik liegt hinter den Texten.
- DM Sans und DM Serif Display lokal bereitgestellt, einschließlich Fontlizenzen. Ein kleines lizenziertes DejaVu-Symbol-Subset verhindert fehlende Pfeile und grüne Emoji-Sterne in Browsern mit anderer Schrift-Fallback-Auswahl. Die Symbole folgen wieder den bestehenden Textfarben.
- Hero Geometric behält die ursprüngliche Farbflächenberechnung. Es zeichnet nur im sichtbaren Bereich und bei aktivem Tab. Ein dezenter Pausenbutton ermöglicht das Anhalten; reduzierte Bewegung blendet die Animation aus.
- Image Ripple bleibt auf beiden Fotos. WebGL wird erst bei passender Zeigerinteraktion initialisiert, läuft nur während der ausklingenden Wellen und berücksichtigt den vorhandenen CSS-Bildausschnitt/Zoom. Die Verdrängung bleibt dezent. Bei WebGL-Ausfall werden 2D-Wellen gezeichnet; bei Kontextverlust bleibt sofort das Originalbild sichtbar. Keine erzwungene Touch-Animation.
- Scroll Split Card und Case Study Flip Stack bleiben erhalten. Scroll-Updates sind über `requestAnimationFrame` gebündelt; es gibt lesbare Haltephasen. Auf kleinen bzw. niedrigen Viewports und bei reduzierter Bewegung werden die vorhandenen Inhalte zugänglich dargestellt. Die drei Erfahrungsartikel bleiben vollständig in der Accessibility-Struktur. Ihre blassen Ziffern-Wasserzeichen sind als rein dekorative SVGs statt als Inhaltstext ausgezeichnet.
- Letter Cascade bleibt ein buchstabenweiser 3D-Effekt mit Hover-Feedback. Ganze Wörter bleiben zusammen, Wortabstände bleiben echte Textabstände und jede Überschrift besitzt ihren vollständigen zugänglichen Namen. Alle Inhalte sind auch ohne JavaScript bzw. ohne IntersectionObserver lesbar.
- Skip-Link, mobile Kontakt-Erreichbarkeit, Escape-Bedienung, Schließen außerhalb des Menüs, konsistente Menünamen und Fokussteuerung ergänzt. Aktive Arbeitsweise-Schritte haben passende Kontraste; ihr vollständiger Text wird als Live-Region ausgegeben.
- Der Lebenslauf-CTA heißt bis zum tatsächlichen Upload eindeutig „Lebenslauf-PDF · folgt“. Der vorhandene Hinweis ist als zugängliche Aufklappfunktion angebunden; ein leerer PDF-Pfad löst keinen Download/404 aus. Eine echte PDF lässt sich später gezielt verknüpfen.
- Favicon, lokale Schriftdateien, wiederholbare Browserprüfungen sowie Vercel-/Netlify-Konfiguration ergänzt. Das Veröffentlichungspaket enthält nur die Website, genau zwei Personenfotos und die nötigen Assets.

## Bewahrt

Helle V6-Farbwelt, Kobaltblau/Limette, DM-Typografie, asymmetrischer Hero, Bogenformen, Abstände und Sektionen basieren weiterhin auf V6A. Alle bisherigen fachlichen Texte, Kompetenzbereiche, Erfahrungsfelder, Lebenslaufstationen und der LinkedIn-Link bleiben erhalten. Die Navigation behält ihre Anker; der bisher nur auf Desktop vorhandene Kontakt ist auch im mobilen Menü erreichbar. Es wurden keine Kunden, Kennzahlen, Stationen, Kontakte oder Fotos erfunden. Die zwei ungenutzten Originalfotodateien bleiben in der Arbeitsübergabe erhalten, werden aber nicht veröffentlicht.

Die Änderungen werden auf dem separaten GitHub-Branch `v6a-optimierung` bereitgestellt. Ein Hosting-Deployment ist nicht Bestandteil dieses Schritts. Die ursprünglichen vier Übergabedokumente und die ursprünglichen Referenzbilder wurden nicht überschrieben.
