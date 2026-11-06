# Smartphone- und Touch-Prüfung · 6. November 2026

**19 Prüfgruppen bestanden**, zusätzlich zu den 43 Gruppen des Hauptlaufs. Die drei geöffneten Kompetenzkarten wurden gesondert mit axe geprüft: keine automatischen Verstöße. Der Hauptlauf enthält sechs weitere axe-Scans.

- [Maschinenlesbarer Bericht](report.json)
- [Kompetenzvorderseiten](competencies-390.png)
- [Geöffnete Kompetenzkarte](competency-open.png)
- [Erfahrungsfelder](experience-390.png)
- [Arbeitsweise](workflow-390.png)
- [Geöffnete Detailkarte](workflow-dialog.png)
- [Hero mit größeren Bedienelementen](hero-390.png)
- [Impeccable-Rohbefund vor den abschließenden Kontrast-/Beschriftungskorrekturen](impeccable-before.json)
- [Grenzen der verfügbaren Umgebung](environment-limits.json)

Die Tests laufen in **Chromium** bei 320, 375, 390 und 430 px Breite. Wischen wird durch echte synthetisierte Touch-Sequenzen über CDP geprüft; die Fotos und Schaltflächen werden per Touch aktiviert. Dies belegt mehr als ein verkleinertes Screenshot-Fenster, ersetzt aber keinen physischen iPhone-/Safari-Test.

Die sieben Illustrationen werden zusätzlich auf tatsächlich gezeichnete Pixel geprüft. Die Vergleichsbilder wurden nur während des Tests vorübergehend ausgeblendet; die veröffentlichten Motive bleiben sichtbar. Geprüft werden außerdem vertikales Scrollen über den Karten und Fotos, Fokus-/Scroll-Rückgabe aus Dialogen, Hoch-/Querformatwechsel und reduzierte Bewegung.

Die öffentliche Vercel-Adresse und WebKit-Downloadserver sind in der Cloud-Netzrichtlinie gesperrt. Der Live-Deployment-Status und die Darstellung auf dem tatsächlichen iPhone sind deshalb gesondert zu prüfen. Weitere technische Details: [MOBIL.md](../../MOBIL.md).
