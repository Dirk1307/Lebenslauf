# Technische Weiterentwicklung auf Basis V6A

## Ausgangslage

Übernommen wurde ausschließlich `Codex_Uebergabe_Dirk_Herrmann_V6A.zip`. Zuerst wurden `README_START_HIER.md`, `CODEX_PROMPT.md`, `DESIGN_BRIEF.md` und `QA_CHECKLIST.md` gelesen, anschließend HTML, CSS, JavaScript und sämtliche Assets geprüft. Das zuvor leere Git-Repository enthielt keinen konkurrierenden Website-Stand.

V6A enthält eine statische HTML-Seite mit mehreren aufeinander aufbauenden CSS-Ständen und drei eingebetteten Skriptblöcken. Die Effekte sind eigene Vanilla-JavaScript-Implementierungen; es wurden keine Componentry-/React-Komponenten importiert.

## Smartphone und iPhone/Safari · 6. November 2026

- Die gemeldeten fehlenden Motive adressiert: alle sieben Illustrationen direkt in HTML eingebettet. Die Originaldateien bleiben erhalten; drei SVG-Inline-Styles durch eine CSS-Klasse ersetzt, damit die bestehende CSP ohne Lockerung funktioniert.
- Bildvorderseiten der drei Kompetenzkarten mobil wieder sichtbar. Antippen öffnet die Inhaltsrückseite, eine Schaltfläche führt zurück. Fokus, zugängliche Namen und Zustände folgen der jeweils sichtbaren Seite. Desktop behält die Scroll-Split-Animation, reduzierte Bewegung und No-JS behalten offen lesbare Texte.
- Erfahrungsfelder erhalten sichtbare Pfeile und Positionsschaltflächen nach dem geprüften Watermelon-Navigator-Muster. Native Wischbewegung und vertikales Scrollen bleiben erhalten; keine automatische Rotation.
- Beide Porträts reagieren auf kurzes Antippen mit leichten 2D-Wellen, ohne WebGL auf Touch zu starten. Ein Swipe oder abgebrochener Touch löst keine Welle aus.
- Mobile Fließtexte auf mindestens 16 px, zentrale Bedienelemente auf mindestens 44 px angepasst; Foto-/Kartenabstände, Arbeitsweise-Raster, Werdegang, Safe Areas und dynamische Dialoghöhe abgestimmt. Die redundanten großen Wasserzeichenzahlen der Erfahrungsfelder sind mobil ausgeblendet.
- Eigenes mobiles Skript und passende Cache-Regeln ergänzt. Einzeldatei aus denselben Quellen erzeugt. Zusätzliche Touch-Suite prüft 320/375/390/430 px, Wischen und Tippen, tatsächliche SVG-Pixel, Fokus-/Scroll-Rückgabe und Orientierungswechsel.
- Finaler Testlauf: 62 Prüfgruppen bestanden (43 bisherige plus 19 Touch-Gruppen), neun axe-Scans ohne automatische Verstöße. Original-SVGs, Porträts und PDF-Prüfsummen unverändert; keine Browser-, HTTP- oder CSP-Fehler.
- Live-Adresse und Playwright-WebKit-Download sind in der Cloud-Netzrichtlinie gesperrt. Die Umsetzung wird lokal mit Chromium und synthetisierten Touch-Gesten geprüft; ein physischer iPhone-/Safari-Test bleibt gesondert nötig.

## Design-Skills installiert und angewendet · 6. November 2026

- Taste, Impeccable und alle 17 Emil-Kowalski-Skills projektlokal für Codex installiert; Quellen und Prüfsummen in `skills-lock.json`, Wiederherstellung über `npm run skills:restore`. Beim blockierten Impeccable-Bundle wurde erfolgreich die offizielle GitHub-Quelle verwendet.
- Hover auf geeignete Zeigergeräte begrenzt, Foto-/Illustrationszoom dezent auf 1,03 abgestimmt, Kartenhub auf 2 px und kurze Druckrückmeldung ergänzt. Reduzierte Bewegung und Tastatur lösen keinen zusätzlichen Versatz aus.
- Arbeitsweise-Dialog auf 260/160 ms verkürzt; schnelles Schließen setzt am sichtbaren Zwischenzustand an. Tastaturöffnung und Escape reagieren sofort. Animierter Eckenradius entfernt; Fokusbegrenzung und Rückgabe bleiben erhalten.
- Sechs veraltete CSS-Regeln des früheren Arbeitsweise-Outputs entfernt, nachdem Impeccable dort einen unbenutzten Akzentrand gemeldet hat.
- Bestehende Inhalte, Layout, Farben, Schriften, beide Fotos und die telefonfreie Lebenslauf-PDF bleiben erhalten. Aktuelle Einzeldatei neu erzeugt; vollständiger Browserlauf mit 43 bestandenen Prüfgruppen. Anwendung und Nachweise: `docs/SKILLS.md`.

## Foto-Hinweise entfernt · 6. November 2026

- Die beiden sichtbaren „BEWEG DEINE MAUS“-Hinweise am Hero- und Über-mich-Foto entfernt.
- Ripple-Effekte, persönliche Bildtexte und Porträts bleiben erhalten; die Einzeldatei wird aus der bereinigten Hauptseite neu erzeugt.
- Gezielt bei 390 und 1440 Pixeln geprüft: keine Hinweise, kein horizontaler Überlauf; beide Ripple-Effekte reagieren weiterhin auf Mausbewegungen. Auch die Einzeldatei enthält keine Hinweise; keine JavaScript-Fehler.

## Lebenslauf als Download · 6. November 2026

- Auf Nutzerwunsch eine separate Website-Version des bereitgestellten Lebenslaufs ohne Telefonnummer erstellt. Original-PDF unverändert erhalten; bereinigte Version liegt unter `assets/lebenslauf-dirk-herrmann.pdf`.
- Telefonnummer und zugehöriges Symbol mit echter PDF-Redaktion entfernt. Kein bloßes Überdecken: Nummer nicht mehr im extrahierten Text, keine `tel:`-Verknüpfung oder eingebetteten Dateien. Bildvergleich bestätigt unveränderte Darstellung beider Seiten außerhalb der Telefonzeile.
- „Lebenslauf-PDF · folgt“ durch einen nativen Download-Link ersetzt und den Hinweis auf eine noch ausstehende PDF entfernt. Der Link funktioniert ohne JavaScript; nicht mehr benötigte Platzhalter-Logik aus `assets/site.js` entfernt.
- Die Einzeldatei enthält die PDF mit dem korrekten MIME-Typ eingebettet. Normale Website und Offline-Vorschau liefern dieselbe geprüfte Datei.
- Download-Dateiname und PDF-/Cache-Header für Vercel und Netlify ergänzt. Tests überprüfen tatsächlich heruntergeladene Bytes gegen die geprüfte SHA-256; bisherige Tests für einen künftig konfigurierbaren Platzhalter wurden durch echte Downloadprüfungen ersetzt.

## Begrüßung und E-Mail-Kontakt · 6. November 2026

- Begrüßungszeile über dem Hero-Titel entfernt. „Hi, ich bin Dirk.“ ergänzt das vorhandene „NICE TO MEET YOU“-Schild direkt beim Porträt.
- Auf ausdrücklichen Nutzerwunsch die E-Mail-Adresse aus dem bereitgestellten Lebenslauf im Kontaktbereich sichtbar und als `mailto:` verlinkt. Es wird keine E-Mail automatisch versendet; der Link öffnet die vom Besucher eingerichtete E-Mail-Anwendung.
- Telefonnummer vorerst nicht ergänzt, da der Nutzer dazu noch unentschieden ist. Die Empfehlung lautet, öffentlich E-Mail und LinkedIn zu verwenden und die Nummer bei Bedarf im direkten Austausch weiterzugeben.
- Die Hauptseite und die neu erzeugte Einzeldatei wurden gezielt bei 320, 390, 768 und 1440 Pixeln auf Darstellung, Linkziel, Tastaturzugang und Barrierefreiheit geprüft. Interaktionsskripte und Bilder bleiben unverändert.

## Aktuelle redaktionelle Korrekturen und Bildauswahl

- Den ausdrücklich gewünschten ursprünglichen Hero-Text wortgleich wiederhergestellt.
- „YES, DAS BIN ICH“ durch „MIT IDEEN. MIT ENGAGEMENT.“ ersetzt; am freigegebenen Porträt selbst nichts geändert.
- Arbeitgebernamen aus Über mich und den drei Erfahrungsfeldern entfernt. Die ungefähre Kundenzahl wird auf der Website nicht mehr genannt; die Karten formulieren allgemeine fachliche Fähigkeiten.
- Werdegang mit persönlicheren Beschreibungen überarbeitet und den hochgeladenen Lebenslauf als Referenz genutzt: Projektleiter bei Recruiting Guru 10/2023–07/2025; Social Media Manager bei EKS Montage seit 07/2025. Studienbezug bleibt entfernt. Der PDF-Anhang wird als Inhaltsreferenz verwendet und nicht automatisch mit privaten Kontaktdaten ins Repository kopiert.
- Die vom Nutzer bestätigten Bereiche 03 („Womit ich mich auskenne“) und 04 („So arbeite ich“) erhalten sieben verschiedene recherchierte Illustrationen. Die Grafikdateien bleiben unverändert; ihre vorgesehene `currentColor`-Farbe wird bei der SVG-Einbindung über CSS gesetzt.
- Vorhandene Animationen, Layoutstruktur, Schriften und die beiden persönlichen Fotos bleiben bestehen. Die neue Bilddarstellung bewahrt vollständige Motive statt sie im Rahmen zu beschneiden.
- Lizenz-/Quellzuordnung in `docs/BILDQUELLEN.md`; Einzeldatei-Vorschau bettet die SVG-Pfade ein und funktioniert damit weiterhin ohne Dateizugriffe oder Bildserver.

## Vorherige inhaltliche Schärfung auf Basis der Nutzerangaben

- Gewünschte Richtung: Marketing, Performance Marketing, Marketingstrategie, Social Media Marketing und Projektmanagement. Hero, Über mich, Stärken, Erfahrungsfelder und Kontakt sind darauf abgestimmt.
- Recruiting Guru: eigenverantwortliche Betreuung von ca. 10–15 Kunden aus unterschiedlichen Branchen; Recruiting-Strategien, Meta-Kampagnen, Creatives, Landingpages und Bewerbungsfunnels, Kundenberatung, Projektkoordination und KPI-Analyse.
- EKS Montage: eigenverantwortliche Social-Media- und Employer-Branding-Strategie auf LinkedIn, Instagram und Facebook, Content von der Planung bis zur Veröffentlichung, Meta-Recruiting-Kampagnen inklusive Budgetverwaltung und Performance-Analyse, Koordination mit Fachabteilungen und externen Dienstleistern.
- Die Erfahrungsfelder verbinden die Marketing-Ausrichtung mit diesen konkreten Praxisaufgaben. Social Recruiting und Employer Branding bleiben als belegte fachliche Schwerpunkte erhalten.
- Die Arbeitsweise-Beschreibungen erläutern jetzt Zielsetzung, KPI-Prüfung, Konzeption und Umsetzung von Marketingmaßnahmen. Ihre vier Schritte und die Kartenfunktion bleiben erhalten.
- Den redaktionellen Meta-Hinweis „ohne geschönte Referenzen oder fiktive Projekte“ aus dem sichtbaren Text entfernt. Keine zusätzlichen Abschlüsse, Beschäftigungsdaten, Kundennamen oder Erfolgskennzahlen ergänzt.
- Es wurden ausschließlich Texte in der Hauptseite und der daraus generierten Vorschau geändert; Bilddateien, Styles und Interaktionscode sind bei dieser Inhaltsrunde unverändert.

## Freigegebene Inhalts- und Komponentenänderungen

- Hero-Foto auf ausdrücklichen Nutzerwunsch gegen das vorhandene Bild ohne Kappe und mit verschränkten Armen ausgetauscht. `hero-dirk.webp` entspricht bytegenau `portrait-smile.webp` aus der Übergabe; die Bildmaße sind jetzt 1000 × 667. Der Bogenrahmen und Ripple bleiben erhalten. Das neue Hero-Asset ist mit rund 40 KB deutlich kleiner als das vorherige Bild (rund 280 KB).
- Die gesamte Studien-Station „Marketing Management / Studium und praktische Grundlagen …“ entfernt. Die beiden beruflichen Stationen bleiben unverändert; es wurde kein Ersatzabschluss ergänzt.
- Arbeitsweise anhand der ausdrücklich verlinkten Watermelon Expandable Profile Card überarbeitet. Vier kompakte Karten öffnen eine größere Detailansicht, auf Desktop zweispaltig und mobil gestapelt. Vier eigene Arbeitsweise-Schritte statt fremder Demo-Biografie; die Beschreibungen sind inzwischen auf die bestätigten Marketingaufgaben konkretisiert. Lokale abstrakte SVGs statt weiterer Personenfotos.
- Originalquelle im offiziellen Watermelon-Repository geprüft; Vanilla-Portierung statt eines React-/Motion-/Tailwind-Umbaus. MIT-Lizenz und genaue Quellenzuordnung sind enthalten. Der shadcn-CLI-Befehl wurde nicht als Installation ausgeführt. Einzelheiten: `docs/WATERMELON.md`.
- Dialogbedienung mit Escape, Schließen-Button, Hintergrundklick, Tab-/Shift-Tab-Umlauf, Fokusrückgabe, vorherigem/nächstem Schritt, reduzierter Bewegung und lesbarem Fallback ohne JavaScript/`showModal()`.
- Einzeldatei-Vorschau wird nun reproduzierbar aus dem aktuellen Projekt erzeugt und mitgetestet; neue Fotos und Inhalte sind damit auch im GitHub-Download enthalten.

## Technische Verbesserungen der Ausgangsbasis

- Vorhandenes CSS in `assets/site.css` und die überarbeiteten Skripte in `assets/site.js` ausgelagert. HTML bleibt die Inhaltsquelle; keine Komponentenarchitektur und kein Framework hinzugefügt. JavaScript lädt mit `defer`.
- Die Originalfotos werden unverändert verwendet; nur die ausdrücklich freigegebene Hero-Auswahl ist geändert. Alle SVG-Illustrationen und das Über-mich-Foto bleiben bytegenau erhalten. Intrinsische Bildmaße sind korrekt. Hero lädt priorisiert, das zweite Foto verzögert.
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

Helle V6-Farbwelt, Kobaltblau/Limette, DM-Typografie, asymmetrischer Hero, Bogenformen, Abstände und Sektionen basieren weiterhin auf V6A. Die fachlichen Texte sind auf die oben dokumentierten Nutzerangaben konkretisiert. Alle Sektionen, die zwei beruflichen Stationen, die Bildauswahl und der LinkedIn-Link bleiben erhalten. Der Studien-Eintrag ist auf Nutzerwunsch entfernt. Die Navigation behält ihre Anker; der bisher nur auf Desktop vorhandene Kontakt ist auch im mobilen Menü erreichbar. Es wurden keine Kunden, Kennzahlen, Stationen, Kontakte oder Fotos erfunden. Die zwei ungenutzten Originalfotodateien bleiben in der Arbeitsübergabe erhalten, werden aber nicht veröffentlicht.

Die Änderungen werden auf dem separaten GitHub-Branch `v6a-optimierung` bereitgestellt. Ein Hosting-Deployment ist nicht Bestandteil dieses Schritts. Die ursprünglichen vier Übergabedokumente und die ursprünglichen Referenzbilder wurden nicht überschrieben.
