# Agentenleitfaden

## Projektziel

Dieses Repository enthält eine Home-Assistant-Custom-Integration für lernende
Warmwasserzirkulation mit einer Vue-3-Oberfläche. Die Integration erkennt plausible
Zapfvorgänge, lernt eine begrenzte Schwelle, erstellt Tagesprofile und plant sichere
Pumpenstarts.

Eine produktive Installation oder Aktivierung der Integration gehört nicht zum
Entwicklungsauftrag. Produktive Entity-IDs, Zugangsdaten und Anlagenannahmen dürfen
nicht erfunden werden.

## Architektur

- `custom_components/warmwasser_zirkulation/domain.py`
  - reine Fachlogik ohne Home-Assistant-Importe
  - Erkennung, Lernen, Heatmap und Planung
  - bevorzugt deterministische, testbare Funktionen und unveränderliche Datenmodelle
- `custom_components/warmwasser_zirkulation/coordinator.py`
  - Grenze zu Home Assistant
  - Orchestrierung, Persistenz, Pumpen-Gateway und strukturiertes Logging
  - Fehlerzustände müssen fail-closed behandelt werden
- `config_flow.py`, `sensor.py`, `switch.py`
  - dünne Home-Assistant-Adapter
  - keine Fachlogik in Entity-Klassen duplizieren
- `frontend/`
  - Vue-3-Oberfläche
  - Build mit Vite
- `dashboard/`
  - Lovelace-Konfiguration
- `tests/`
  - fachliche Tests mit synthetischen Zeitreihen

## Entwicklungsumgebung

Der bevorzugte Interpreter ist die projektlokale Umgebung:

```text
.venv\Scripts\python.exe
```

Testabhängigkeiten installieren:

```powershell
.venv\Scripts\python.exe -m pip install -e ".[test]"
```

Wenn OneDrive Hardlink-Fehler verursacht, kann alternativ `pip` direkt verwendet
werden. Keine globalen Pakete als stillschweigende Projektvoraussetzung annehmen.

## Tests und Validierung

Vor jeder Übergabe:

```powershell
.venv\Scripts\python.exe -m pytest -q
.venv\Scripts\python.exe -m pytest -q --cov=custom_components.warmwasser_zirkulation --cov-branch --cov-report=term-missing
.venv\Scripts\python.exe -m compileall -q custom_components tests
.venv\Scripts\python.exe -m pip install -e ".[security]"
.venv\Scripts\python.exe -m bandit -r custom_components -ll
# Das lokale Editable-Paket ist nicht auf PyPI veröffentlicht und wird übersprungen.
.venv\Scripts\python.exe -m pip_audit --skip-editable
```

Für das Frontend:

```powershell
cd frontend
npm ci --ignore-scripts --no-audit --no-fund
npm run build
```

Frontendtests sind verpflichtend. Neue oder geänderte Vue-Komponenten müssen mit
Vitest und Vue Test Utils getestet werden. Mindestens Normalzustand, erfolgreiche
Aktion und Fehler-/Pausierungszustand abdecken:

```powershell
cd frontend
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run test:coverage
npm run audit
npm run build
```

Frontendtests liegen neben der Komponente als `*.test.ts` oder in einem dedizierten
`tests/`-Ordner. Tests sollen sichtbare Nutzerzustände und sicherheitsrelevante
Hinweise prüfen, nicht nur Implementierungsdetails.

In VS Code müssen die Frontendtests über die empfohlenen Erweiterungen und Tasks
ausführbar sein. Die Tasks `Frontend: Tests` und `Frontend: Coverage` verwenden die
projektlokale Frontend-Konfiguration und dürfen nicht auf globale Testtools angewiesen
sein.

Securityprüfungen sind verpflichtend: Bandit prüft den Python-/Home-Assistant-Code,
pip-audit prüft Python-Abhängigkeiten und `npm audit` prüft die Vue-/Node-Kette.
Neue Abhängigkeiten müssen begründet und in `pyproject.toml` beziehungsweise
`package-lock.json` nachvollziehbar sein.

Neue Fachlogik braucht Tests für Normalfall, Grenzwerte und Fehlerfälle. Besonders
zu prüfen sind:

- Datenlücken, veraltete und unbekannte Messwerte
- Ausreißer und Pumpenlauf-/Abklingphasen
- Mehrfachzählung und konkurrierende Startauslöser
- Tageslimits und Fenstergrenzen einschließlich Laufzeit
- Neustart, persistierter Pumpenzustand und abgelaufene Läufe
- unerreichbare Pumpe und optionaler InfluxDB-Ausfall
- Monitoring ohne Schaltbefehle

## Fachliche Sicherheitsregeln

- Automatische Starts sind standardmäßig deaktiviert.
- Unbekannte Pumpenzustände erzeugen höchstens Diagnosekandidaten.
- Fehlende frische Vorlaufwerte pausieren automatische Starts.
- Ein Pumpenfehler darf nicht als erfolgreicher Start persistiert werden.
- Gelernte Schwellenwerte müssen eine Mindestdatenbasis haben und begrenzt angepasst
  werden.
- Historienimporte müssen wiederholbar und dedupliziert sein.
- Keine Secrets, Tokens, privaten URLs oder produktiven Entity-IDs committen.
- Eingaben aus Home Assistant, InfluxDB und Frontend validieren; Fehlermeldungen dürfen
  keine sensiblen Daten loggen.

## Logging

Logging erfolgt über das Python-Logging-Modul. Ereignisse sollen strukturierte,
maschinenlesbare Zusatzdaten verwenden, zum Beispiel `reason`, `pump_entity` und
`daily_starts`. Keine Temperaturen, Tokens oder vollständigen externen Payloads loggen,
wenn sie für die Diagnose nicht erforderlich sind.

## Änderungen am Home-Assistant-Teil

- Konfigurationswerte über den Config Flow oder Konstanten führen.
- Keine Zugangsdaten in `manifest.json`, YAML oder Quellcode hinterlegen.
- Home-Assistant-Abhängigkeiten nur in Adapterdateien importieren, sofern der fachliche
  Kern sie nicht benötigt.
- Neue Entities mit stabilen `unique_id`-Werten versehen.
- Zeitberechnungen mit expliziten Zeitzonen durchführen; Sommerzeit und Tageswechsel
  berücksichtigen.

## Änderungen am Vue-Teil

- Vue-Komponenten klein und zugänglich halten.
- Keine Inline-Secrets oder Anlagenkonfiguration im Bundle.
- Zustände wie Monitoring, pausiert, Fehler und aktiv sichtbar unterscheiden.
- `npm ci` und `npm run build` müssen funktionieren; `package-lock.json` aktuell halten.

## Git-Regeln

- Branch für die initiale Umsetzung: `feature/initial`
- Kleine, thematisch geschlossene Commits mit aussagekräftiger Nachricht.
- Vor dem Commit Tests, Coverage und Compile-Prüfung ausführen.
- Generierte Dateien, lokale Umgebungen und Home-Assistant-Laufzeitdaten nicht committen.
- Nicht automatisch pushen, mergen oder produktive Systeme aktivieren.

## Arbeitsweise für Agenten

1. Anforderungen und vorhandene Dateien zuerst lesen.
2. Bestehende Nutzeränderungen erhalten und nicht blind überschreiben.
3. Fachlogik von Integrations-/UI-Code trennen.
4. Änderungen mit fokussierten Tests absichern.
5. Fehler, Annahmen und nicht lokal verifizierbare Punkte transparent dokumentieren.
6. Am Ende geänderte Dateien, Testresultat und verbleibende Risiken knapp berichten.

