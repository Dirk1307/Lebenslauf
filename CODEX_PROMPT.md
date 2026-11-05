# CODEX-MASTERPROMPT — BEWERBUNGSWEBSITE DIRK HERRMANN (V6A)

## Deine Aufgabe
Du arbeitest an einer bereits bestehenden, funktionsfähigen Bewerbungs- und Portfolio-Website. **Verwende zwingend die Dateien dieses Projekts als Ausgangsbasis.** Die Version heißt **V6A = ursprüngliche helle V6 mit gezielten Anpassungen**. Keine Neugestaltung, kein Wechsel zu V7/V8 oder Dark Mode.

Bitte lies zuerst `README_START_HIER.md`, `DESIGN_BRIEF.md` und `QA_CHECKLIST.md`; öffne dann `index.html` und überprüfe alle Dateien unter `assets/`.

## Verbindliche Designvorgaben
1. **Erhalte den V6-Look:** clean, fresh, modern; überwiegend sehr heller Hintergrund (`#F8FAF8`), dunkle Schrift (`#121820`), kräftiges Kobaltblau (`#3449EB`), kleine limettengrüne Akzente (`#DFFF82`), großzügige Abstände, abgerundete Karten, hochwertige Microinteractions. Schriften: **DM Sans** und **DM Serif Display**. In `referenzen/` findest du Screenshots der ursprünglichen V6 zur Orientierung. **Der aktuelle Code mit geänderten Fotos ist maßgeblich.**
2. **Hero-Sektion behalten:** asymmetrisches Zwei-Spalten-Layout; links „Klar denken. Weiter machen.“ und die vorhandenen Texte/CTAs, rechts mein großes Porträt mit Bogen-/Arch-Form. Behalte die Hero-Geometric-Hintergrundanimation bei. **Das aktuelle `assets/hero-dirk.webp` ist das gewünschte Foto aus der zweiten Variante; nicht gegen das frühere Porträt zurücktauschen.**
3. **Zweites Personenfoto:** `assets/about-dirk.webp` im Abschnitt „Über mich“. Verwende mich insgesamt **nur auf diesen beiden Fotos**. Für weitere Visualisierungen ausschließlich die bereits vorhandenen SVG-Illustrationen oder abstrakte Grafiken.
4. **Image Ripple Effect auf BEIDEN Fotos:** Hero und Über mich. Interaktion bei Mausbewegung / Pointer; mit Fallback, wenn WebGL deaktiviert ist. Der Effekt darf die Gesichtserkennbarkeit nicht beeinträchtigen. Kein Ripple-Zwang auf Touch-Geräten.
5. **Letter Cascade auf ausgewählten Headlines:** Die aktuelle Datei enthält Markierungen `.cascade-target`. Behalte einen flüssigen buchstabenweisen 3D-Einblendeffekt beim Eintritt ins Sichtfeld und ein dezentes Hover-Feedback bei. Überschriften müssen semantisch und für Screenreader vollständig lesbar bleiben. Keine zerbrochenen Wörter oder Layoutverschiebungen. `prefers-reduced-motion` respektieren.
6. **Scroll Split Card behalten:** Abschnitt „Was ich mitbringe“ mit drei Kompetenzfeldern: Strategie & Konzeption, Performance & Recruiting, Projekte & Prozesse. Drei Karten teilen bzw. drehen sich beim Scrollen. Für Mobilgeräte ein übersichtliches, zugängliches Layout.
7. **Case Study Flip Stack behalten:** Drei scrollgesteuerte Erfahrungsfelder: Social Recruiting, Employer Branding, Projektsteuerung. Keine erfundenen Kundenprojekte, Cases oder Ergebnisse hinzufügen. Die vorhandenen SVG-Bilder aus `assets/` verwenden.
8. **Restliche Website bewahren:** Reihenfolge der Bereiche, Navigation, Arbeitsweise mit vier Schritten, Werdegang, Kontakt und LinkedIn-CTA. Bestehende Texte nicht eigenmächtig neu schreiben. Platzhalter für einen künftig hochladbaren PDF-Lebenslauf bleibt klar gekennzeichnet; **keine erfundenen Kontaktdaten, Telefonnummern, E-Mails, Lebenslaufstationen oder Kennzahlen** eintragen.

## Technische Aufgabe
- Bestehendes HTML, CSS und JavaScript zuerst verstehen. Der aktuelle Stand ist Vanilla HTML/CSS/JS ohne Framework oder Build-Prozess. **Bevorzuge minimal-invasive Verbesserung**, statt eine komplette Architektur neu aufzubauen.
- Prüfe vorhandene Animationen auf Syntaxfehler, Scrollverhalten, Flickern, Fallbacks und Performance. In der gelieferten Version sind die Effekte selbst implementiert und **nicht die originalen React-Komponenten von Componentry**.
- Die offiziellen Referenzen sind:
  - Hero Geometric: https://componentry.dev/docs/components/hero-geometric
  - Image Ripple Effect: https://componentry.dev/docs/components/image-ripple-effect
  - Scroll Split Card: https://componentry.dev/docs/components/scroll-split-card
  - Case Study Flip Stack: https://componentry.dev/docs/components/case-study-flip-stack
  - Letter Cascade: https://componentry.dev/docs/components/letter-cascade
  Nutze sie als Referenz für das gewünschte Verhalten. Nur dann Original-Komponenten übernehmen, wenn sie mit dem Stack und ihren Lizenzen kompatibel sind und das V6-Design 1:1 erhalten bleibt; sonst die bestehenden Effekte verbessern.
- Sicherstellen: alle Bildassets laden aus relativen Pfaden; keine externen Platzhalterbilder und keine notwendige externe API.
- Responsive prüfen bei **390px, 768px, 1440px**. Keine horizontale Scrollbar, keine Texte hinter Bildern, Menü und CTA müssen bedienbar bleiben.
- Lighthouse-orientierte Optimierung für LCP, CLS und Tastaturbedienbarkeit, aber keine optische Verschlechterung.
- Teste die Website mit lokalem Server (z. B. `python3 -m http.server 8000`), nicht nur mit `file://`. Falls Playwright verfügbar ist: Screenshots Desktop + Mobile, Test der Scroll-Effekte und mindestens ein Maus-Ripple-Test; behebe eventuelle Konsolenfehler.

## Gewünschtes Ergebnis
1. Vollständige, lauffähige Website im vorhandenen Projekt.
2. Keine selbstständige Neugestaltung, keinen neuen Farbstil, keine neuen Personalfotos.
3. Kurzprotokoll: Was geändert wurde und was bewusst unverändert blieb.
4. Prüfbericht: Desktop/Mobile, Bilder, Navigation, Interaktionen, `prefers-reduced-motion`, bekannte Einschränkungen.
5. Verständliche Anleitung, wie ich die Website später auf **Vercel oder Netlify** veröffentliche, meinen Lebenslauf als PDF verlinke und einen QR-Code auf die öffentliche URL setze. **Nicht eigenständig veröffentlichen** und keine Domain oder kostenpflichtige Dienste bestellen.

**Wichtigste Priorität:** Die Seite muss visuell **V6A** bleiben. Ich möchte Qualität und technische Zuverlässigkeit, nicht eine andere Designrichtung.
