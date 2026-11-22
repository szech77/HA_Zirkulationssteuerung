# Installations- und Einrichtungshinweise

## 1. Voraussetzungen

Für den Betrieb werden benötigt:

- Home Assistant mit einer unterstützten Python-/Home-Assistant-Umgebung
- ein Vorlauftemperatursensor, zum Beispiel `sensor.zirkulation_vorlauf`
- optional ein Puffertemperatursensor, zum Beispiel `sensor.warmwassertemperatur`
- ein in Home Assistant erreichbarer Pumpenschalter
- eine lokale HA-Zeitzone, die zur Anlage passt

Die konkrete Pumpen-Entity, Home-Assistant-Version, das Bundesland und eine mögliche
InfluxDB-Konfiguration müssen vor der Einrichtung an der Anlage geprüft werden. Diese
Anleitung enthält absichtlich keine produktiven Zugangsdaten oder erfundenen IDs.

## 2. Installation als Custom Integration

### Variante A: HACS

1. Repository in HACS als Custom Repository vom Typ **Integration** hinzufügen.
2. `Warmwasser-Zirkulation` installieren.
3. Home Assistant neu starten.
4. Unter **Einstellungen → Geräte & Dienste → Integration hinzufügen** nach
   `Warmwasser-Zirkulation` suchen.

### Variante B: Manuelle Installation

1. Den Ordner
   `custom_components/warmwasser_zirkulation/` in das Verzeichnis
   `<config>/custom_components/warmwasser_zirkulation/` kopieren.
2. Prüfen, dass unter anderem `manifest.json`, `config_flow.py`, `coordinator.py`,
   `sensor.py` und `switch.py` vorhanden sind.
3. Home Assistant neu starten.
4. Die Integration über die Geräte-&-Dienste-Seite hinzufügen.

Bei einer manuellen Installation müssen Updates erneut kopiert werden. HACS übernimmt
die Aktualisierung, ersetzt aber keine fachliche Prüfung der Konfiguration.

## 3. Konfiguration

Im Config Flow mindestens folgende Werte angeben:

- Vorlaufsensor: aktueller Entity-ID des Leitungs-/Vorlauffühlers
- Pumpenschalter: aktueller Entity-ID des Zirkulationspumpenschalters
- Laufzeit je Start in Sekunden

Optional beziehungsweise für die spätere Planung relevant:

- Puffersensor
- Land und Bundesland für die Feiertagslogik
- Home-Assistant-Zeitzone
- InfluxDB-Verfügbarkeit, Rohdatenauflösung, Filter und Aufbewahrung
- sieben Wochentagsfenster
- tägliches Maximum automatischer Starts
- Warmwasser-Schwellwert in °C

Keine Zugangsdaten in YAML, Dashboard-Dateien oder Quellcode eintragen. Falls InfluxDB
verwendet wird, müssen Authentifizierung und Berechtigungen ausschließlich über die
Home-Assistant-Integration beziehungsweise deren Secret-Verwaltung erfolgen.

## 4. Sicherer Kalibrierungsablauf

1. Integration zunächst im **Monitoring** belassen.
2. Prüfen, ob der Vorlaufsensor regelmäßig aktualisierte, plausible Werte liefert.
3. Mehrere reale Zapfvorgänge und Ruhephasen aufzeichnen.
4. Messlücken, Pumpenlauf und Abklingphasen kontrollieren.
5. Im Dashboard Schwelle, Stichprobengröße, Beobachtungsabdeckung und erkannte Ereignisse
   prüfen.
6. Erst nach ausreichender Datenbasis die Bedarfsautomatik aktivieren.
7. Zunächst mit engem Zeitfenster und niedrigem Tageslimit testen.
8. Prüfen, dass manuelle Starts weiterhin möglich sind und automatische Starts bei
   fehlenden Messwerten oder unerreichbarer Pumpe pausieren.

Die gelernte Entnahmeschwelle ist nicht identisch mit dem einstellbaren
Warmwasser-Schwellwert in °C. Eine zeitgleiche Änderung des Puffersensors ist keine
Voraussetzung für die Erkennung.

## 5. Lovelace-Dashboard

Die Beispielkonfiguration liegt unter `dashboard/warmwasser.yaml`.

Die Vue-Oberfläche wird während der Entwicklung mit Vite gebaut. Für eine produktive
Lovelace-Einbindung müssen die erzeugten Frontend-Artefakte als Lovelace-Ressource
bereitgestellt und die verwendete Custom Card in der Zielinstallation registriert
werden. Die konkrete URL beziehungsweise der Hosting-Ort ist installationsabhängig
und wird nicht automatisch erfunden.

Das Dashboard sollte mindestens anzeigen:

- Monitoring-/Aktiv-/Pausiert-/Fehlerstatus
- gelernte Schwelle und Stichprobengröße
- Beobachtungsquote und Heatmap
- nächsten geplanten Start und Restkontingent
- letzten erkannten Zapfvorgang
- Grund für übersprungene oder pausierte Starts

## 6. Lokale Entwicklung

### Python

```powershell
.venv\Scripts\python.exe -m pip install -e ".[test]"
.venv\Scripts\python.exe -m pytest -q
.venv\Scripts\python.exe -m pytest -q --cov=custom_components.warmwasser_zirkulation --cov-branch --cov-report=term-missing
.venv\Scripts\python.exe -m compileall -q custom_components tests
```

### Vue

```powershell
cd frontend
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run test:coverage
npm run build
```

In VS Code stehen dafür die Tasks `Frontend: Tests` und `Frontend: Coverage` zur
Verfügung. Für die Anzeige im Test Explorer muss die empfohlene Vitest-Erweiterung
installiert sein.

## 7. Betrieb und Fehlersuche

Bei Problemen zuerst prüfen:

1. Ist die konfigurierte Entity vorhanden und erreichbar?
2. Ist der Vorlaufwert frisch und numerisch plausibel?
3. Ist die Pumpe bereits eingeschaltet oder ist ihr Zustand unbekannt?
4. Wurde das tägliche Startlimit erreicht?
5. Liegt der geplante Start vollständig innerhalb des erlaubten Zeitfensters?
6. Sind lokale Zeitzone, Tageswechsel und Sommerzeit korrekt?
7. Ist InfluxDB ausgefallen? Die lokale Modelllogik muss weiterhin sicher im Monitoring
   arbeiten.

Automatische Starts müssen bei Unsicherheit pausieren. Logs dürfen keine Secrets,
Tokens oder vollständigen externen Payloads enthalten.

## 8. Deinstallation

1. Bedarfsautomatik deaktivieren.
2. Integration unter **Einstellungen → Geräte & Dienste** entfernen.
3. Home Assistant neu starten.
4. Bei manueller Installation den Ordner
   `<config>/custom_components/warmwasser_zirkulation/` entfernen.

Vor dem Entfernen persistierte Integrationsdaten und Dashboard-Konfiguration prüfen,
falls sie für eine spätere Wiederinstallation benötigt werden.

