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

1. Bei einem Quellbranch zuerst das Frontend bauen:

   ```powershell
   cd frontend
   npm ci --ignore-scripts --no-audit --no-fund
   npm run build
   ```

   Release-Tags enthalten die gebauten Dateien bereits. Danach den Ordner
   `custom_components/warmwasser_zirkulation/` in das Verzeichnis
   `<config>/custom_components/warmwasser_zirkulation/` kopieren.
2. Prüfen, dass unter anderem `manifest.json`, `config_flow.py`, `coordinator.py`,
   `sensor.py`, `switch.py`, `web/panel.js` und `web/panel.css` vorhanden sind.
3. Home Assistant neu starten.
4. Die Integration über die Geräte-&-Dienste-Seite hinzufügen.

Bei einer manuellen Installation müssen Updates erneut kopiert werden. HACS übernimmt
die Aktualisierung, ersetzt aber keine fachliche Prüfung der Konfiguration.

Die Laufzeitdaten liegen pro Konfigurationseintrag in Home Assistants Speicherverwaltung
unter `.storage/warmwasser_zirkulation.<entry_id>`. Beim Austausch des Integrationsordners
bleiben diese Daten erhalten. Eine neue Installation startet mit deaktivierter Automatik;
der Integrationsstart schaltet die Pumpe nicht. Gespeicherte Pumpenlaufzeiten enthalten
eine Zeitzone. Ungültige gespeicherte Zustände brechen die Einrichtung ab, anstatt
ungeprüfte Werte für automatische Starts zu verwenden. Als Pumpen-Entity wird ein
`switch` erwartet; ein Einschaltbefehl setzt einen aktuell bestätigten Zustand `off`
voraus. Servicefehler werden an den Coordinator weitergegeben.

## 3. Konfiguration

Der Einrichtungsdialog verwendet durchsuchbare Home-Assistant-Auswahllisten
mit Entitätsnamen. Bei deutscher HA-Sprache sind Beschriftungen, Hilfetexte und
Fehlermeldungen auf Deutsch; Englisch ist als Rückfall vorhanden.

- **Vorlauftemperaturfühler:** vorhandenen Temperatursensor an der Leitung auswählen.
- **Puffertemperaturfühler:** optional einen weiteren Temperatursensor auswählen.
- **Schalter der Zirkulationspumpe:** vorhandene `switch`-Entität auswählen.
- **Pumpenlaufzeit:** ganze Sekunden von 1 bis 3600; Standard 120.
- **Maximale automatische Starts pro Tag:** ganze Zahl von 1 bis 100; Standard 6.

Die Sensorauswahl zeigt nur `sensor`-Entitäten mit der Geräteklasse `temperature`.
Fehlt ein Temperaturfühler in der Liste, seine Geräteklasse in der Quellintegration
prüfen. Unbekannte Entitäten, andere Sensorarten und dieselbe Entität als Vorlauf-
und Puffersensor werden beim Speichern abgelehnt. Vorübergehend nicht verfügbare,
aber weiterhin in HA vorhandene Entitäten können ausgewählt bleiben.

Spätere Änderungen sind unter **Einstellungen → Geräte & Dienste →
Warmwasser-Zirkulation → Konfigurieren** möglich. Die vorhandene Auswahl ist
vorbelegt. Der Link **Konfiguration** im Dashboard öffnet die Integrationsseite;
das Zahnrad am gewünschten Eintrag öffnet den nativen Einstellungsdialog.
Zum Entfernen des optionalen Puffersensors dessen Auswahl leeren.
Nach dem Speichern lädt HA die Integration mit den neuen Optionen neu.
Die Konfiguration selbst führt keine Schaltbefehle aus.

Danach kann im Schritt **Feiertagskalender** ein Land gewählt werden. Wenn das Land
regionale Unterteilungen unterstützt, folgt **Bundesland / Region** mit einer
Auswahlliste; für Deutschland werden Namen wie Bayern oder Nordrhein-Westfalen
angezeigt. Ohne Region gelten nur landesweite Feiertage. Eine leere Länderauswahl
deaktiviert die Feiertagszuordnung. Diese Werte lassen sich ebenfalls über
**Konfigurieren** ändern, ohne die Integration zu löschen.

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

## 5. Dashboard und Heatmap

Nach erfolgreicher Einrichtung erscheint **Warmwasser-Zirkulation** automatisch
in der HA-Seitenleiste. Das Panel und seine Status-API sind HA-Administratoren
vorbehalten. Eine separate Lovelace-Ressource ist nicht erforderlich.
Ein Link zum Panel ist optional in `dashboard/warmwasser.yaml` vorbereitet.

Das Panel zeigt echte Vorlauf-/Puffertemperaturen, Pumpenzustand, Betriebsgrund,
Erkennungsschwelle, Lernbasis, Startkontingent und die Kalenderauswahl. Es lädt seine
Werte über die bestehende HA-Anmeldung und aktualisiert sie alle 15 Sekunden.
Verbindungsfehler blenden alte Messwerte aus und bieten einen erneuten Abruf an.

Die Heatmap verwendet 48 halbstündliche Zellen für Montag bis Sonntag sowie eine
separate Feiertagszeile. Bei eingerichtetem Kalender fallen Feiertage aus den
normalen Wochentagszeilen heraus. Die Farbe zeigt den Anteil ausreichend beobachteter
Tage mit mindestens einem erkannten Zapfvorgang, keine erfundenen Verbräuche.

- Die Beobachtung beginnt ab Installation und wird pro Konfigurationseintrag unter
  `.storage/warmwasser_zirkulation.<entry_id>.observations` gespeichert.
- Ein Tag zählt in einer Zelle erst ab 15 Minuten gültiger Messungen bei ausgeschalteter
  Pumpe. Messlücken über acht Minuten werden nicht überbrückt; unbekannte Pumpenzustände,
  veraltete Werte und Pumpenlaufzeiten werden nicht als „kein Verbrauch“ gezählt.
- Unter drei beobachteten Tagen ist eine Quote schraffiert als vorläufig markiert.
  Ohne Messbasis bleibt die Zelle grau. Anklicken zeigt die zugrunde liegenden Zahlen.
- Die Historie ist auf 180 Tage begrenzt. Regionale Feiertage richten sich nach der
  Kalenderbibliothek und der gewählten Region. Ohne Länderwahl bleibt die Feiertagszeile
  ausdrücklich unkonfiguriert.
- Die Beobachtung kalibriert die Erkennung, schaltet die Pumpe jedoch nicht.

Bei manuellen Updates den **gesamten** Integrationsordner einschließlich des gebauten
`web`-Ordners kopieren, HA neu starten und das Panel mit `Strg` + `F5` neu laden.
Die gespeicherten Daten unter `.storage` erhalten. Fehlen Build-Dateien, meldet HA
beim Einrichten ausdrücklich, dass das Frontend gebaut und mitkopiert werden muss.
Mit Home Assistant 2026.11.2 getestet.

## 6. Lokale Entwicklung

### Python

```powershell
.venv\Scripts\python.exe -m pip install -e ".[test]"
.venv\Scripts\python.exe -m pytest -q
.venv\Scripts\python.exe -m pytest -q --cov=custom_components.warmwasser_zirkulation --cov-branch --cov-report=term-missing
.venv\Scripts\python.exe -m compileall -q custom_components tests
.venv\Scripts\python.exe -m pip install -e ".[security]"
.venv\Scripts\python.exe -m bandit -r custom_components -ll
# Das lokale Editable-Paket ist nicht auf PyPI veröffentlicht und wird übersprungen.
.venv\Scripts\python.exe -m pip_audit --skip-editable
```

### Vue

Node 22 ab 22.22.2, Node 24 ab 24.15.0 oder Node 26+ verwenden.

```powershell
cd frontend
npm ci --ignore-scripts --no-audit --no-fund
npm test
npm run test:coverage
npm run audit
npm run build
```

In VS Code stehen dafür die Tasks `Frontend: Tests` und `Frontend: Coverage` zur
Verfügung. Für die Anzeige im Test Explorer muss die empfohlene Vitest-Erweiterung
installiert sein.

## 7. Sicherheitsprüfungen

Die CI führt technologiebezogene Sicherheitsprüfungen aus:

- **Python/Home Assistant:** Bandit prüft den Quellcode; pip-audit prüft Python-Abhängigkeiten.
- **Vue/Node:** `npm audit --audit-level=high` prüft das Frontend-Lockfile und die transitive Dependency-Kette.
- **Pull Requests:** GitHub Dependency Review bewertet neue oder aktualisierte Abhängigkeiten.

Secrets gehören nicht in Quellcode, Logs, YAML, `.env`-Dateien oder Testdaten.

## 8. Betrieb und Fehlersuche

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

## 9. Deinstallation

1. Bedarfsautomatik deaktivieren.
2. Integration unter **Einstellungen → Geräte & Dienste** entfernen.
3. Home Assistant neu starten.
4. Bei manueller Installation den Ordner
   `<config>/custom_components/warmwasser_zirkulation/` entfernen.

Vor dem Entfernen persistierte Integrationsdaten und Dashboard-Konfiguration prüfen,
falls sie für eine spätere Wiederinstallation benötigt werden.

