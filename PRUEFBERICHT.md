# Prüfbericht · V6A technisch optimiert

Stand des vollständigen Prüflaufs: 6. November 2026. Geprüft wurde die vorhandene Website nach den gezielten technischen Änderungen und den freigegebenen Inhaltsanpassungen: Hero ohne Kappe/mit verschränkten Armen, entfernter Studien-Eintrag, Expandable Cards im Bereich Arbeitsweise sowie die anhand der Nutzerkorrekturen und des Lebenslaufs überarbeiteten Texte und sieben unterschiedliche Illustrationen in Abschnitt 03/04.

## Aktueller Stand · Digitale Visitenkarte

Der abschließende Gesamtlauf besteht aus **43 Haupt-, 19 Touch- und 9 Karten-Prüfgruppen: insgesamt 71 bestanden**. Elf axe-Scans melden keine automatischen Verstöße; zwei davon prüfen den ergänzten Kontaktbereich bei 390 und 1440 px.

Der QR-Code wurde mit einem unabhängigen Decoder geprüft: Das 984 × 984 px große PNG sowie PNG und SVG in einer auf 256 px verkleinerten Darstellung ergeben exakt `https://lebenslauf-xi.vercel.app/`. Die vCard enthält ausschließlich Name, E-Mail, Website und LinkedIn; keine Telefonnummer. Zeilenenden und UTF-8-Zeilenfaltung werden geprüft. Echte Downloads liefern die erwarteten Bytes und den Dateinamen, auch ohne JavaScript aus Website und Einzeldatei.

Die Open-Graph-/Twitter-Card-Metadaten und die Canonical-Adresse verwenden absolute HTTPS-Adressen. Das Vorschaubild ist als PNG in 1200 × 630 px vorhanden und lokal abrufbar. Der zusätzliche Kontakt-Link bleibt bei 320, 390 und 1440 px erreichbar, mindestens 44 px hoch und ohne horizontalen Überlauf. Vercel und Netlify liefern übereinstimmende MIME-, Dateinamen- und Cache-Header für die Kontaktdatei. Die gezielte Impeccable-CSS-Prüfung meldet keine Befunde.

Die Sicherheitsrichtlinie bleibt bestehen; der finale Browserlauf meldet keine JavaScript-, HTTP- oder CSP-Fehler. Die beiden Originalporträts und die bereits geprüfte PDF ohne Telefonnummer haben unveränderte SHA-256-Prüfsummen. Der Hosting-Build bleibt ein statischer Kopierschritt; QR-/Bildwerkzeuge werden nur bei Entwicklung und Tests benötigt.

Nachweise und Grenzen: [Karten-Prüfbericht](docs/qa/card/report.json), [Dateinachweise](docs/qa/card/assets.json) und [Verwendung](docs/DIGITALE_VISITENKARTE.md). Der native Import in die iPhone-Kontakte-App, reale Drucke und der Abruf durch WhatsApp/LinkedIn wurden nicht automatisiert geprüft. Die Live-Adresse bleibt aus der Cloud-Netzrichtlinie gesperrt; der erfolgreiche Vercel-Deployment-Status ist deshalb gesondert zu prüfen.

## Mobilstand · Smartphone und iPhone/Safari

Der finale Lauf von `CHROMIUM_PATH=/usr/bin/chromium npm test` besteht aus **43 bisherigen Prüfgruppen plus 19 zusätzlichen Mobil-/Touch-Prüfgruppen: insgesamt 62 bestanden**. Dazu gehören **neun axe-Scans ohne automatische Verstöße**: sechs bestehende Seiten-/Dialogscans und drei gezielte Scans der geöffneten Kompetenzkarten.

Die sieben Illustrationen sind direkt eingebettet. Zusätzlich zu ihrer SVG-Geometrie vergleicht der Touch-Test jeden gerenderten Bildausschnitt mit derselben vorübergehend ausgeblendeten Grafik: Alle sieben Motive zeichnen sichtbare Pixel. Es gibt keine externen SVG-`use`-Abhängigkeiten mehr. Die drei ursprünglichen Inline-Styles einer Grafik wurden in eine CSS-Klasse überführt; die vorhandene CSP bleibt unverändert und der finale Lauf meldet keine CSP-, JavaScript- oder HTTP-Fehler.

Bei **320, 375, 390 und 430 px** wurden Schriftgrößen, Touch-Ziele, alle Tipp-Karten, Navigation und Überläufe geprüft. Bei 390 px wurden echte synthetisierte Touch-Sequenzen über CDP ausgeführt: horizontales Wischen wechselt die Erfahrungsfelder, vertikales Wischen über derselben Fläche und über Kompetenzkarten scrollt die Seite. Ein Scroll-Swipe öffnet keine Karte und startet keine Porträt-Welle. Kurzes Antippen erzeugt auf beiden Fotos leichte, wieder endende Wellen ohne WebGL-Start auf Touch. Alle vier Detailkarten zeigen ihre Illustration und geben Fokus sowie Scrollposition zurück. Orientierungswechsel und reduzierte Bewegung wurden ebenfalls geprüft.

Die Fotos, alle sieben Original-SVG-Dateien und die Website-PDF ohne Telefonnummer entsprechen weiterhin ihren dokumentierten SHA-256-Prüfsummen. Die sichtbaren fachlichen Texte bleiben erhalten. Die erzeugte Einzeldatei enthält die gleiche Anpassung; die Downloadprüfungen bestehen weiterhin.

Nachweise: [Hauptlauf](docs/qa/report.json), [Touch-Lauf](docs/qa/mobile/report.json), [mobile Screenshots und Grenzen](docs/qa/mobile/README.md). Technische Erläuterung und Einordnung der 47 ursprünglichen Impeccable-Heuristikbefunde: [docs/MOBIL.md](docs/MOBIL.md). Der konkrete Kontrasthinweis zur kleinen Nummer der türkisfarbenen Kompetenzrückseite ist korrigiert und im geöffneten Zustand mit axe geprüft; wichtige kleine Beschriftungen wurden vergrößert. Die Rohbefunde bleiben erhalten.

**Grenze:** Die vom Nutzer genannte Live-Adresse und die WebKit-Downloadserver sind aus dieser Cloud-Umgebung durch die Netzrichtlinie gesperrt. Geprüft wurde lokal in Chromium mit emulierten Mobilansichten und synthetisierten Touch-Eingaben, **nicht auf einem physischen iPhone oder direkt in Safari**. Die Entfernung der konkreten externen SVG-Abhängigkeit und die Touch-Anpassungen sind implementiert; der finale Gerätecheck und der erfolgreiche Vercel-Deployment-Status müssen an der öffentlichen URL geprüft werden.

## Ergänzung · 6. November 2026: Design- und Animations-Skills

Diese Skill-/Performance-Messungen dokumentieren den Stand **vor** der oben beschriebenen Smartphone-Anpassung. Die aktuelle Abnahme ist der 71-Gruppen-Lauf oben.

Taste, Impeccable und die Emil-Kowalski-Skills wurden projektlokal für Codex installiert und gezielt auf die vorhandenen Interaktionen angewendet. Der abschließende vollständige Browserlauf enthält **43 bestandene Prüfgruppen** und sechs axe-Prüfungen ohne automatische Verstöße. Neu geprüft: Tastaturöffnung ohne Warteanimation, sichtbare Kontinuität beim schnellen Schließen einer noch öffnenden Karte, sofortiges Escape und ausbleibender Hover-Zoom auf dem emulierten Touch-Gerät. Die bestehenden Foto-, Scroll-, Fallback-, PDF- und Offline-Prüfungen bestehen ebenfalls.

Impeccable `context` wurde ausgeführt; der gezielte Detektorlauf meldete eine Akzentlinie in einer nicht mehr verwendeten `.process-output`-Regel. Die sechs Regeln dieses alten Outputs sind anschließend entfernt worden. Der ursprüngliche Befund bleibt unter `docs/qa/skills/impeccable-detect.json` erhalten; eine nachträgliche pauschale Unterdrückung fand nicht statt.

Taste `perf.mjs` wurde unverändert mit drei Messdurchläufen je Breite bei 1440 und 390 px ausgeführt. Gemessen nach dem Durchscrollen: **255,3/254,1 KiB Transfer**, **19/17 Requests**, **320/268 ms medianer lokaler LCP**, **78/51 ms Blocking Time**, CLS gerundet **0,000**. Keine kaputten Requests oder ungenutzten Effektmodule. Diese lokalen CPU-Messungen sind keine Feldwerte unter Mobilfunkbedingungen. Die PDF wird erst beim Download angefordert und ist in dieser Messung nicht enthalten. WebGL-Kontexte bleiben ohne Mausinteraktion bei null; der vollständige Browserlauf aktiviert und prüft beide Ripples gesondert.

Der Taste-Check meldet ausdrücklich **1 FAIL und 3 WARN**; dies wird nicht als vollständig bestandener Performance-Check ausgegeben:

- Die Desktop-Sammelprüfung „oversized images“ zählt vier Treffer: das unveränderte Über-mich-Porträt und dreimal `network.svg`. Bei der SVG wird die deklarierte Breite von 1440 mit jeder einzelnen schmalen Split-Fläche verglichen. Sie ist eine Vektorgrafik und wird absichtlich mit `background-size:300% 100%` über drei Teilflächen verteilt; das sind keine drei übergroßen Rasterbilder. Dieser Teil des Befunds ist ein Fehlalarm für die vorhandene Split-Darstellung.
- Das Über-mich-Porträt und mobil auch das Hero-Foto haben mehr Quellpixel als für diese konkrete CSS-Breite nötig. Beide freigegebenen Originaldateien bleiben bewusst unverändert. Sie sind bereits WebP-Dateien von rund 85 bzw. 39 KiB und unterschreiten die Transferbudgets deutlich. Diese verbleibende Abmessungswarnung ist dokumentiert, nicht durch eine Veränderung der Fotos oder des Prüfers beseitigt.
- Bei beiden Breiten meldet der Prüfer drei Schriftfamilien. Neben den zwei freigegebenen Textschriften enthält `V6A Symbols` nur die wenigen benötigten monochromen Zeichen. Insgesamt werden drei Schriftdateien mit 64 KiB geladen; Datei- und Größenbudgets bestehen. Die kleine Symbolschrift verhindert bereits geprüfte Emoji-/Ersatzzeichenprobleme.

Quellen, Installationsweg und konkrete Umsetzung: [docs/SKILLS.md](docs/SKILLS.md). Rohdaten: [docs/qa/skills/perf.json](docs/qa/skills/perf.json).

## Ergänzung · 6. November 2026: Lebenslauf-Download

Die bereitgestellte PDF ist als separate Website-Version ohne Telefonnummer eingebunden. Die Nummer und das zugehörige Symbol sind durch echte PDF-Redaktion entfernt, nicht nur überdeckt. Ausgelesener Text und Link-Anmerkungen enthalten keinen Telefonkontakt mehr. Beide Seiten wurden außerhalb der entfernten Zeile gerendert mit dem Original verglichen: unverändert. Das Original bleibt separat erhalten.

Der Download ist ein nativer HTML-Link und benötigt kein JavaScript. Die Einzeldatei bettet dieselbe PDF als `application/pdf` ein. Die automatische Prüfung gleicht Dateiname und heruntergeladene Bytes mit der geprüften SHA-256 ab; reguläre HTTP-Auslieferung und Offline-Version werden jeweils auch ohne JavaScript geprüft. Redaktionsnachweis: `docs/qa/cv-download/redaction.json`.

## Ergänzung · 6. November 2026: Begrüßung und Kontakt

Die Begrüßung steht jetzt als „Hi, ich bin Dirk.“ auf dem Schild am Hero-Porträt. Die E-Mail-Adresse aus dem Lebenslauf ist im Kontaktbereich sichtbar und per `mailto:` verlinkt; eine Telefonnummer wurde nicht ergänzt.

Gezielte Browserprüfung mit der vorhandenen Content Security Policy bei **320, 390, 768 und 1440 × 900 Pixeln**: Begrüßung und E-Mail sichtbar, Schild und Adresse innerhalb der Bildschirmbreite, keine horizontale Scrollleiste, E-Mail-Link per Tastatur erreichbar und mindestens 44 px hoch. LinkedIn bleibt vorhanden. Die Kontaktadresse und das `mailto:`-Ziel stimmen überein; es wurde keine E-Mail versendet. Alle vier axe-Prüfungen der betroffenen Bereiche melden keine Verstöße gegen die geprüften WCAG-A/AA-Regeln. Auch die aktualisierte Einzeldatei enthält Begrüßung und E-Mail-Link. Keine Browser-, HTTP- oder CSP-Fehler.

Ergebnisse und Screenshots: `docs/qa/contact-update/`. Die Begrüßungs-/Kontaktänderung wurde zunächst gezielt geprüft. Für den später ergänzten PDF-Download wurde der vollständige Regressionslauf mit echten Downloadprüfungen erneut ausgeführt.

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
| Arbeitsweise / Watermelon-Portierung | Alle vier Karten per Tastatur geöffnet; richtige Beschreibung, seitlicher/gestapelter Dialog, Tab-/Shift-Tab-Fokusumlauf, Escape, Schließen-Button, Hintergrundklick, Fokusrückgabe und vorheriger/nächster Schritt geprüft |
| Bilder | Beide persönlichen Fotos und alle sieben unterschiedlichen SVG-Illustrationen geladen; Quelle/Originaldateien geprüft, SVG-Motive im bestehenden Kobaltblau und auch im geöffneten Dialog sichtbar |
| Hero Geometric | Hintergrund läuft, ist pausierbar und zeichnet außerhalb des Sichtfelds keine weiteren Frames |
| Image Ripple | Mausbewegung aktiviert fehlerfreies WebGL auf beiden Fotos; Wellen enden wieder im unveränderten Originalbild |
| WebGL nicht verfügbar | Tatsächliche 2D-Wellen auf beiden Fotos nachgewiesen; Originalfotos bleiben sichtbar |
| WebGL-Kontextverlust | Originalfoto bleibt sichtbar, kein leerer Canvas über dem Gesicht |
| Scroll Split Card | Start und vollständige Drehung unterscheiden sich; Fortschritt erreicht 100 %, drei Kompetenztexte bleiben lesbar |
| Case Study Flip Stack | Positionen für alle drei Erfahrungsfelder angesteuert; jeweilige Karte voll sichtbar; Artikel bleiben für Hilfsmittel erreichbar |
| Letter Cascade | Vollständiger zugänglicher H1-Name; Animationen beim Eintritt, zusammenhängende Wörter und lesbare reduzierte Darstellung |
| Reduzierte Bewegung | Sowohl beim Seitenstart als auch nachträglich geprüft: sichtbare Überschriften und statische Karten, keine Foto-Ripple-Animation |
| Ohne JavaScript | Desktop und Smartphone: Navigation, Überschriften, Kompetenztexte und alle Erfahrungsfelder lesbar; Hinweis auf interaktive Zusatzfunktionen |
| Ohne IntersectionObserver / Canvas / Dialog-Unterstützung | Inhalt und Foto bleiben sichtbar; kein Skriptabbruch. Ohne `showModal()` bleiben die vier Schrittbeschreibungen direkt unter den Karten lesbar |
| Lebenslauf-Download | Reale Website-PDF ohne Telefonnummer vorhanden; nativer Download-Link statt Platzhalter, auch ohne JavaScript |
| PDF-Inhalt und Auslieferung | Zwei Seiten; entfernte Telefonnummer nicht auslesbar. Echte Downloads aus Website/Einzeldatei werden auf Dateinamen, PDF-Inhalt und SHA-256 geprüft; HTTP-Antwort liefert den korrekten PDF-Typ |
| Automatische Barrierefreiheit | Neun axe-Prüfungen: drei geöffnete Kompetenzkarten sowie Desktop/Smartphone mit normaler und reduzierter Bewegung plus jeweils geöffneter Arbeitsweise-Karte; keine automatischen Verstöße gegen die geprüften WCAG-2/2.1-A/AA- und Best-Practice-Regeln |
| Einzeldatei-Vorschau | Neu aus aktuellen Quellen erzeugt; eingebettetes Hero-Bild mit 1000 × 667, Studien-Bezug entfernt, Arbeitsweise-Dialog auf Smartphone/Desktop ohne Server und externe Ressourcenanfragen geprüft |
| Ressourcen und Sicherheit | Keine JavaScript-/Konsolenfehler, HTTP-Fehler, CSP-Verstöße oder externen Ressourcenanfragen im Prüflauf |

Hauptlauf: **43 Prüfgruppen bestanden**; zusammen mit **19 Mobil-/Touch-Gruppen** und **9 Kartengruppen** insgesamt **71**. Einzelne Prüfgruppen enthalten mehrere Assertions bzw. Auflösungen. Es wurden keine fehlgeschlagenen Prüfungen als bestanden gewertet und keine Tests übersprungen. Der zusätzliche Taste-Budgetcheck ist oben mit seinem tatsächlichen FAIL/WARN-Ergebnis getrennt aufgeführt.

## Integrität und Veröffentlichungsvorbereitung

- Die ausdrücklich unerwünschte Studien-Station ist entfernt; die zwei beruflichen Stationen bleiben erhalten. Die vier Arbeitsweise-Beschreibungen liegen im HTML und werden in den Dialogen wiederverwendet. Hero, Über mich, Kompetenzkarten, Erfahrungsfelder, Werdegang und Kontakt wurden auf die gewünschten Marketingaufgaben sowie die vom Nutzer bestätigten Tätigkeiten bei Recruiting Guru und EKS Montage konkretisiert. Die Kundenzahl wird auf Nutzerwunsch nicht mehr genannt; Arbeitgebernamen stehen nur im Werdegang. Die Rollen und Beschäftigungszeiträume dort stammen aus dem bereitgestellten Lebenslauf. Der ursprüngliche Hero-Text ist wortgleich wiederhergestellt.
- Das neue Hero-Bild entspricht bytegenau der ausdrücklich gewählten Originaldatei `portrait-smile.webp` aus der ZIP. Das Über-mich-Foto bleibt unverändert. Die sieben neu recherchierten SVGs entsprechen bytegenau den dokumentierten Quelldateien; die ursprünglichen Grafiken bleiben im Arbeitsarchiv erhalten. Die vier ursprünglichen Übergabedokumente bleiben als Ausgangsarchiv erhalten; neuere Nutzerentscheidungen sind im aktuellen README dokumentiert.
- SHA-256 Hero: `d4b58f22bc704073dc9e18353e9c7ebc2ba55230cfb0d3be618df292269964f4`
- SHA-256 Über mich: `b6acd135776df7dfaac430ae735751ffe9bdcdad170f683a038b13d9b66266d4`
- `vercel.json` und `netlify.toml` lassen sich parsen und haben übereinstimmende Sicherheitsheader sowie dasselbe Ausgabeverzeichnis. Die Anwendung funktioniert unter dieser CSP.
- `dist/` enthält genau zwei Personenfotos. Unbenutzte Fotovarianten, Tests und Übergabedokumente werden nicht mitveröffentlicht.
- Die bestehende LinkedIn-Adresse wurde beibehalten. Im Test wurde keine externe Kontaktaufnahme ausgelöst.

## Ladeverhalten

Das ausgewählte Hero-Foto ist rund 40 KB groß (vorher rund 280 KB), hat hohe Ladepriorität und passende intrinsische Maße. Das zweite Foto lädt verzögert. Die neuen SVG-Dateien werden lokal eingebunden und im Browser mit ihrer vorgesehenen CSS-Farbe dargestellt. In der Einzeldatei sind die Vektorpfade direkt enthalten; es gibt keine externen Bild- oder Dateizugriffe. Schriften, Styles und Skripte liegen lokal. Es gibt keine externe Schrift-, API- oder Animationsbibliothek zur Laufzeit. Die bereitgestellten Cache-Regeln können erst beim Hosting wirksam werden.

Der JSON-Bericht enthält lokale, frühe LCP-/CLS-Beobachtungen aus dem Browser. Sie sind **keine Lighthouse-Bewertung** und kein Feldnachweis unter Mobilfunkbedingungen. Insbesondere können Schriftwechsel und langsame Geräte andere Ergebnisse liefern. Es wird kein erfundener Lighthouse-Score oder garantierter FPS-Wert angegeben.

## Grenzen und offene Punkte

Smartphone und Tablet wurden im Chromium-Browser emuliert; echte iPhones/Android-Geräte, Safari, Firefox und reale Screenreader wurden nicht getestet. Automatische Barrierefreiheitstests beweisen keine vollständige Konformität. Eine abschließende Sicht- und Bedienprüfung auf den tatsächlich genutzten Geräten bleibt sinnvoll. Der Inhalt der erzeugten Einzeldatei wurde direkt in den Browser geladen; direkte `file://`-Navigation ist durch die Cloud-Browserrichtlinie gesperrt. Die Vorschau ist für das lokale Öffnen nach dem GitHub-Download vorgesehen.

Die bereinigte Lebenslauf-PDF ist enthalten und der Download lokal geprüft. Vercel-/Netlify-Deployment und produktive HTTP-Header können erst nach einer Veröffentlichung beim Hostinganbieter abschließend geprüft werden. Es wurden weder veröffentlicht noch Domain, Kontaktdaten oder ein QR-Ziel erfunden. Die lokalen Projekt- und Veröffentlichungsschritte sind in `README.md` beschrieben.
