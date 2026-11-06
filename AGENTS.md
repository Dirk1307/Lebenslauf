# Projektkontext

Diese Bewerbungswebsite wird auf der vorhandenen V6A-Basis weiterentwickelt. Nutzerentscheidungen und die bestätigte Darstellung haben Vorrang vor allgemeinen Skill-Empfehlungen. Keine eigenständige Neugestaltung und kein Framework-Wechsel.

- Heller Hintergrund, Kobaltblau, Limettengrün, DM Sans und DM Serif Display erhalten.
- Genau zwei persönliche Fotos; die aktuellen Bilddateien bleiben erhalten.
- Die fünf bestätigten Effekte erhalten, einschließlich ihrer statischen Alternativen bei reduzierter Bewegung.
- Texte und Karriereangaben nur aus bestätigten Angaben ändern. Arbeitgebernamen gehören in den Werdegang; Studienbezug und Kundenzahl bleiben aus dem Seitentext entfernt.
- Die öffentliche Lebenslauf-PDF ist die bereits geprüfte Version ohne Telefonnummer. Das private Original nicht in das Repository kopieren.

Die auf Nutzerwunsch installierten Design- und Animations-Skills stehen projektlokal in `.agents/skills/`. Quellen, Auswahl und Anwendung: [docs/SKILLS.md](docs/SKILLS.md). Fehlen sie nach einem neuen Checkout, stellt `npm run skills:restore` die im `skills-lock.json` festgehaltenen Versionen wieder her. Nur passende Skills lesen und anwenden; ihre Vorschläge nicht pauschal auf die Website übertragen.

HTML, CSS und JavaScript bleiben die bearbeitbaren Quellen. Nach Änderungen `npm run preview:file` ausführen; `vorschau/Dirk_Herrmann_V6A_Vorschau.html` nicht direkt bearbeiten. Für Interaktionsänderungen den vorhandenen Browser-Test mit `CHROMIUM_PATH=/usr/bin/chromium npm test` verwenden. `dist/` enthält nur die veröffentlichte Website, keine Skills.
