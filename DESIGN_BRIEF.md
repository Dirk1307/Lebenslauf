# DESIGN-BRIEF: DIE VERBINDLICHE V6A

**Marke/Ziel:** Persönliche Bewerbungswebsite für Dirk Herrmann. Moderne Digitalagentur-Anmutung, aber Arbeitgeber müssen sofort erkennen, wer ich bin, wie ich denke, welche Kompetenzen ich habe und welchen Nutzen ich mitbringe.

**Drei Adjektive:** clean · fresh · modern.

**Basis:** Die bereits vorhandene `index.html` (V6A), nicht die dunkle Version V8 und nicht die plakative Kreativagentur-V7. Der aktuelle Code ist die gestalterische und inhaltliche Single Source of Truth.

## Designtokens
- Background: `#F8FAF8`
- Text: `#121820`
- Electric/Cobalt Blue: `#3449EB`
- Deep dark sections: `#13192A`
- Lime accent: `#DFFF82`
- Weiß: `#FFFFFF`
- Fonts: DM Sans (Fließtext/Headlines), DM Serif Display (italische Hervorhebung)
- Formensprache: rounded, präzise, viel Weißraum, grafische Kreise/Bögen, zurückhaltende Highlights.

## Sektionen in bestehender Reihenfolge
1. Sticky Navigation, Logo Dirk Herrmann, Ankerlinks, Kontakt.
2. Hero „Klar denken. Weiter machen.“: text links; Hero-Porträt aus `assets/hero-dirk.webp` rechts; geometrische, animierte Formen; Ripple auf Foto; Letter Cascade auf Heading.
3. Über mich „Neugierig bleiben. Weiterdenken.“: Text links, Foto `assets/about-dirk.webp` rechts; Ripple auf Foto; Letter Cascade auf Heading.
4. „Was ich mitbringe“: 3 interaktive Scroll-Split-Karten (Strategie, Recruiting/Performance, Projekte/Prozesse).
5. „Womit ich mich auskenne“: 3 flip-/stack-scrollende Praxisfelder und lokale SVG-Grafiken.
6. „So arbeite ich“ mit vier klickbaren Schritten + Werdegang.
7. Kontakt: LinkedIn-Vernetzung und Lebenslauf-PDF nach späterem Upload.

## Fixierte Fotoregeln
- Maximal **zwei unterschiedliche Personalfotos** auf der Website.
- Hero verwendet **bereits das gewünschte neuere Foto** aus der zweiten Designvariante. Nicht wieder die vorherige Hero-Aufnahme einsetzen.
- Das Über-mich-Foto zeigt Dirk, der auf die Kamera zeigt.
- Keine KI-generierten Varianten seines Gesichtes; Originalmaterial nicht wesentlich verändern.

## Nicht tun
- Nicht ungefragt von Hell auf Dunkel umstellen, keine neuen Designsysteme, keine neue Navigation, kein zusätzlicher Karussell-/Galerieballast.
- Keine fiktiven Unternehmen, Kundenreferenzen, KPIs, Jahreszahlen, Kontaktdaten.
- Kein Teil der bestehenden vier Componentry-inspirierten Interaktionen entfernen.
