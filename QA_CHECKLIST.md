# QA / ABNAHME-CHECKLISTE

## Designidentität
- [ ] Grundlayout wie V6: hell, viel Weißraum, DM Sans + DM Serif Display, Blau/Limette, großes Foto in rechter Hero-Spalte.
- [ ] Hero zeigt `assets/hero-dirk.webp` (neu gewähltes Bild).
- [ ] Über-mich zeigt `assets/about-dirk.webp`, nicht ein weiteres/neues Foto.
- [ ] Höchstens zwei unterschiedliche Fotos der Person auf der gesamten Website.
- [ ] Keine anderen Farben, Schriften, Headline-Texte, Reihenfolgen, Sektionen ohne Zustimmung.

## Interaktionen
- [ ] Hero-Geometric-Hintergrund läuft dezent ohne den Inhalt zu überlagern.
- [ ] Image Ripple reagiert beim Mausbewegen sowohl im Hero als auch Über mich.
- [ ] Bei WebGL-Ausfall bleibt das Foto sichtbar und idealerweise gibt es 2D-Fallback.
- [ ] Letter Cascade ist auf den vorhandenen `.cascade-target`-Headlines wahrnehmbar und verformt keine Wörter.
- [ ] Split Card teilt/dreht die drei Kompetenzen beim Scrollen, ohne Inhalte zu verschlucken.
- [ ] Case Study Flip Stack klappt zwischen allen drei Erfahrungsfeldern um.
- [ ] Bei `prefers-reduced-motion` sind Inhalte stets vollständig lesbar.

## Funktion / Responsiveness
- [ ] Kein horizontaler Überlauf bei 390px / 768px / 1440px.
- [ ] Sticky-Navigation + mobiles Menü funktionieren.
- [ ] CTA „Mehr über mich“, LinkedIn-Link und vier Arbeitsweise-Schritte funktionieren.
- [ ] Lebenslauf noch nicht vorhanden: Keine tote/irreführende Download-Zusage; Platzhalter verständlich erklären.
- [ ] Alle Bilder laden; keine 404; keine JavaScript-Ausnahmen in der Konsole.
- [ ] Keine offengelegten sensiblen Kontaktdaten oder erfundenen beruflichen Nachweise.
- [ ] Verständliche lokale Start- und spätere Deployment-Anleitung.
