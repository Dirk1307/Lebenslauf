# START HIER — Codex-Übergabe V6A

Diese Übergabe enthält die **aktuelle Bewerbungswebsite V6A**, nicht einen neuen Entwurf. Sie basiert auf **V6 (clean / fresh / modern)** mit folgenden Korrekturen: gewünschtes Hero-Foto, Ripple-Effekt auf beiden Fotos, Letter Cascade auf Headlines. Die bereits vorhandenen weiteren Effekte bleiben bestehen.

## Arbeitsablauf
1. ZIP entpacken oder den gesamten Projektordner in deinen Codex-Workspace hochladen.
2. `CODEX_PROMPT.md` in Codex einfügen — oder Codex bitten, den Inhalt dieser Datei als Arbeitsauftrag auszuführen.
3. Codex auf dieses Verzeichnis zugreifen lassen (insbesondere `index.html`, `assets/` und `referenzen/`).
4. Lokal testen: in diesem Verzeichnis `python3 -m http.server 8000`, dann `http://localhost:8000` im Browser öffnen. Alternativ mit VS Code Live Server.
5. Erst nach Abnahme online veröffentlichen. Der PDF-Lebenslauf liegt noch nicht bei; der Download ist daher noch ein Platzhalter.

## Dateien
- `index.html` – vollständiger bisheriger Stand der Website; Original-HTML, CSS und JavaScript.
- `assets/` – Originalbilder in WebP und Illustrationen in SVG.
- `CODEX_PROMPT.md` – vollständiger Copy-Paste-Auftrag für Codex.
- `DESIGN_BRIEF.md` – exakte visuelle Leitplanken und Texte.
- `QA_CHECKLIST.md` – Abnahmekriterien.
- `referenzen/` – Screenshots des ursprünglichen V6-Stils; der aktuelle Code enthält die neueren Bildanpassungen und ist maßgeblich.

## Technischer Status
Der Stand ist eine statische Website mit eingebettetem CSS/JS. Die Animationen sind eigenständig nach Componentry-Vorbildern realisiert; es handelt sich **nicht** um originale React-Componentry-Imports. Google Fonts wird online geladen (Systemfont-Fallback vorhanden). Keine API, kein eigener Server nötig, kein Login.

## Offene Inhalte
- Aktuelle Lebenslauf-PDF hochladen und Download-Link verbinden.
- Rechtlich erforderliche Angaben/Datenschutzhinweise vor öffentlicher Bereitstellung prüfen; je nach Betreiber/Verwendungszweck.
- Falls gewünscht Kontakt-E-Mail oder Telefonnummer **erst nach Freigabe** einfügen.
