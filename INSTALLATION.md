# Installations- und Einrichtungshinweise

## 1. Voraussetzungen

Für den Betrieb werden benötigt:

- Home Assistant mit einer unterstützten Python-/Home-Assistant-Umgebung
- ein Vorlauftemperatursensor, zum Beispiel `sensor.zirkulation_vorlauf`
- optional ein Puffertemperatursensor, zum Beispiel `sensor.warmwassertemperatur`
- ein in Home Assistant erreichbarer Pumpenschalter
- eine lokale HA-Zeitzone, die zur Anlage passt

Die konkrete Pumpen-Entity, Home-Assistant-Version, das Bundesland und die Recorder-Aufbewahrung müssen vor der Einrichtung an der Anlage geprüft werden. Diese
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
2. Prüfen, dass unter anderem `manifest.json`, `config_flow.py`, der vollständige Ordner `app/` mit `app/main.py`,
   `sensor.py`, `switch.py`, `brand/icon.png`, `brand/icon@2x.png`,
   `brand/dark_icon.png`, `brand/dark_icon@2x.png`, `icons.js`, `web/panel.js` und
   `web/panel.css` vorhanden sind. Bei einem Update den Integrationsordner vollständig ersetzen,
   statt neue Dateien über alte Python-Module zu kopieren. Die `.storage`-Daten bleiben erhalten.
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

### Logo in Geräte- und Integrationsansichten

Ab **Home Assistant 2026.3** wird das mitgelieferte Logo aus dem Unterordner
`brand/` automatisch in den nativen Geräte- und Integrationsansichten verwendet.
Alle vier PNG-Dateien mitkopieren, HA vollständig neu starten und den Browser mit
**Strg+F5** neu laden. Es ist keine Logo-URL oder zusätzliche Integration nötig.
Das quadratische Symbol dient über HAs eingebaute Rückfalllogik auch als Logo.
Für ältere HA-Versionen steht diese lokale Brand-Anzeige nicht zur Verfügung.

Das Dashboard zeigt das farbige Logo im Kopfbereich und folgt bei Hell/Dunkel der
Home-Assistant-Themeneinstellung. In der Seitenleiste verwendet der Eintrag das
Motiv als natives Icon in HAs Menüfarben. `icons.js` wird dazu automatisch als
kleines Frontend-Modul registriert, auch vor dem ersten Öffnen des Dashboards;
ein zusätzlicher Lovelace-Ressourceneintrag ist nicht erforderlich. Bei Updates
`icons.js` und das neu gebaute `web/` mitkopieren und HA/Browser neu laden.

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
vorbelegt. Der Link **Geräte & Sensoren** im Dashboard öffnet die Integrationsseite;
das Zahnrad am gewünschten Eintrag öffnet den nativen Einstellungsdialog.
Zum Entfernen des optionalen Puffersensors dessen Auswahl leeren.
Nach dem Speichern lädt HA die Integration mit den neuen Optionen neu.
Die Sensor-/Kalenderkonfiguration führt selbst keine Einschaltbefehle aus. Beim
Neuladen wird ein laufender, von der Integration gestarteter Pumpenlauf beendet.

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
- Recorder-Aufbewahrung und Aufzeichnung von Vorlaufsensor und Pumpenschalter
- tägliches Maximum automatischer Starts
- Warmwasser-Schwellwert in °C

Keine Zugangsdaten in YAML, Dashboard-Dateien oder Quellcode eintragen. Der Import
verwendet HAs Recorder-API ohne zusätzliche Datenbank-Zugangsdaten. Eine direkte
InfluxDB-Anbindung ist derzeit nicht implementiert.

### Freigabezeiten und Betriebsart im Dashboard

Als HA-Administrator in der Seitenleiste **Warmwasser-Zirkulation → Konfiguration**
öffnen. Die Einstellungen gelten getrennt pro Integrationseintrag und werden mit
**Konfiguration speichern** dauerhaft übernommen, ohne die Integration neu zu laden.
Bei parallelen Änderungen in einem zweiten Browser werden vorhandene Eingaben
behalten; **Gespeicherten Stand neu laden** übernimmt den aktuellen Stand.

- **Nur Monitoring:** Messwertbeobachtung und Lernen laufen weiter; keine automatischen
  Starts. Ein noch laufender eigener Automatiklauf wird beendet. Manuelle oder von
  anderen Automationen gestartete Pumpenläufe werden nicht übernommen oder beendet.
- **Steuerung aktiv:** Ein erkannter Zapfvorgang kann die Pumpe innerhalb der
  Freigabezeiten für die konfigurierte Laufzeit starten. Zusätzlich sind gelernte
  vorausschauende Starts bei ausreichender Messbasis möglich. Die Freigabezeiten
  selbst sind keine Dauerlaufzeiten oder festen täglichen Starttermine.
- **Montag bis Samstag:** Je Tag bis zu zwölf Abschnitte hinzufügen oder entfernen,
  beispielsweise Montag 06:00–08:00 und 18:00–21:00. Eine leere Liste sperrt den Tag.
- **Sonn-/Feiertage:** Gemeinsame Freigabe für Sonntage und gesetzliche Feiertage der
  gewählten Region. Ein Feiertag ersetzt den regulären Wochentag; ein Sonntag zählt
  auch bei Überschneidung nur einmal. Ohne Kalender gelten hier weiterhin Sonntage.
  Eine leere Liste sperrt Sonntage und erkannte Feiertage.
- **Urlaubsprofil:** Manuell aktivieren/deaktivieren. Solange aktiv, gelten ausschließlich
  dessen tägliche Abschnitte, auch an Feiertagen. Ohne Abschnitte bleibt die Zirkulation
  im Urlaub gesperrt. Die normale Wochenplanung bleibt gespeichert.

Es gilt die Home-Assistant-Zeitzone. Ende bis **24:00** ist möglich. Über Mitternacht
gehende Freigaben auf zwei Tage aufteilen (z. B. Freitag 23:00–24:00 und Samstag
00:00–01:00). Überschneidungen und ungültige Uhrzeiten werden beim Speichern abgelehnt.
Nicht vorhandene Uhrzeiten bei der Sommerzeitumstellung erteilen keine Freigabe.
Die vollständige Pumpenlaufzeit muss in einen Abschnitt passen; um 07:59:30 ist
bei Ende 08:00 und Laufzeit 60 Sekunden kein Start mehr erlaubt.

Monitoring und leere Freigaben sind die Vorgabe bei neuen Installationen. Vorhandene
Installationen erhalten ebenfalls leere Listen und müssen passende Fenster anlegen.
Die Steuerung läuft unabhängig vom geöffneten Browser und prüft laufende Automatikläufe
sekündlich. Laufzeitende, Wechsel ins Monitoring oder Entzug des Zeitfensters beenden
eigene Läufe. Auch bei fehlenden Temperaturdaten bleibt das Laufzeitende wirksam.
Pumpenbefehle müssen über den HA-Zustand bestätigt werden. Fehlgeschlagene Stopps
bleiben gespeichert und werden erneut versucht; ein Pumpenfehler verhindert neue
Starts, bis er nach Prüfung durch erneutes Speichern quittiert wurde.
Ein Neustart stellt Einstellungen und offene Laufzeitgrenzen wieder her. Das
Startlimit zählt nach lokalem Kalendertag und wird am nächsten Tag wieder freigegeben.

## 4. Sicherer Kalibrierungsablauf

1. Integration zunächst im **Monitoring** belassen.
2. Prüfen, ob der Vorlaufsensor regelmäßig aktualisierte, plausible Werte liefert.
3. Mehrere reale Zapfvorgänge und Ruhephasen aufzeichnen.
4. Messlücken, Pumpenlauf und Abklingphasen kontrollieren.
5. Im Dashboard Schwelle, Stichprobengröße, Beobachtungsabdeckung und erkannte Ereignisse
   prüfen.
6. Erst nach Prüfung der Datenbasis im Dashboard **Konfiguration → Betriebsart →
   Steuerung aktiv** wählen und speichern. Der HA-Schalter **Bedarfsautomatik**
   schaltet dieselbe Betriebsart um; ohne Zeitfenster bleiben Starts gesperrt.
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

Die Heatmap verwendet 48 halbstündliche Zellen für Montag bis Samstag sowie die
gemeinsame Gruppe Sonn-/Feiertage. Bei eingerichtetem Kalender fallen Feiertage aus den
normalen Wochentagszeilen heraus. Die Farbe zeigt den Anteil ausreichend beobachteter
Tage mit mindestens einem erkannten Zapfvorgang, keine erfundenen Verbräuche.

- Live-Beobachtungen und aus HA importierte Historie werden pro Konfigurationseintrag unter
  `.storage/warmwasser_zirkulation.<entry_id>.observations` gespeichert.
- Ein Tag zählt in einer Zelle erst ab 15 Minuten gültiger Messungen bei ausgeschalteter
  Pumpe. Messlücken über acht Minuten werden nicht überbrückt; unbekannte Pumpenzustände,
  veraltete Werte und Pumpenlaufzeiten werden nicht als „kein Verbrauch“ gezählt.
- Unter drei beobachteten Tagen ist eine Quote schraffiert als vorläufig markiert.
  Ohne Messbasis bleibt die Zelle grau. Anklicken zeigt die zugrunde liegenden Zahlen.
- Die Historie ist auf 180 Tage begrenzt. Regionale Feiertage richten sich nach der
  Kalenderbibliothek und der gewählten Region. Ohne Länderwahl werden in der
  gemeinsamen Gruppe nur Sonntage zugeordnet.
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



## HA-Historie als Lernstart und vorausschauendes Vorwärmen

Bei unzureichender Messbasis liest die Integration nach dem Start automatisch die
letzten **28 abgeschlossenen lokalen Kalendertage** aus dem HA-Recorder. Vorlaufsensor
und Pumpenschalter kommen aus der vorhandenen Konfiguration. Die Datenbankabfragen
und historische Auswertung laufen in HAs Recorder-Executor, in Tagesblöcken und
unabhängig vom Browser. Die Live-Beobachtung läuft parallel weiter. Es werden keine
historischen Pumpenbefehle nachgeholt und keine Produktionssysteme umkonfiguriert.

Im Dashboard zeigt **Historie und Lernplanung** Fortschritt, zusätzliche Lernereignisse,
Fehler und den nächsten Muster-Vorschlag. **HA-Historie erneut einlesen** startet einen
erneuten Import über die authentifizierte Administratorverbindung. Wiederholungen
zählen Tageszellen und Lernereignisse nicht doppelt. Ein gespeicherter Tages-Checkpoint
erlaubt die Wiederaufnahme nach Neustart oder Fehler; importierte Daten liegen wie
Live-Daten in `.storage/warmwasser_zirkulation.<Eintrags-ID>.observations` und gehören
zum Backup der HA-Konfiguration. Sensor-, Pumpen- oder Zeitzonenwechsel beginnen eine
neue Beobachtungsbasis, damit verschiedene Quellen nicht vermischt werden.

Wenn keine historischen Pumpenaufzeichnungen vorliegen, wird **Pumpe aus** angenommen.
Diese ausdrücklich gewählte Annahme wird im Dashboard angezeigt. Aufgezeichnete
Pumpenläufe und unbekannte Zustände werden weiterhin ausgeschlossen. Messlücken über
acht Minuten, fehlende Temperaturen und ungültige Werte liefern keine Messabdeckung.
Es werden nur Recorder-Zustandsdaten gelesen; langfristige Statistikmittelwerte
ersetzen keine Temperaturverläufe. Daher ist nur die tatsächlich noch aufbewahrte
Historie nutzbar. Der Import vergrößert nicht HAs Aufbewahrung und füllt keine
fehlenden Temperaturwerte auf. Bei fehlendem Recorder lernt die Integration live.

Für Musterstarts braucht ein halbstündlicher Abschnitt mindestens **drei gültig
beobachtete Tage** in derselben Tagesgruppe, Entnahmen an **mindestens 60 %** dieser
Tage und mindestens zwei Tage mit genauer Entnahmeminute. Die typische Entnahmezeit
ist der Median dieser Minuten. Vor dieser Zeit wird um die eingestellte Pumpenlaufzeit
vorgewärmt. Die gesamte Laufzeit muss in eine Freigabe passen. Vergangene Starttermine
werden nicht nachgeholt; eine Verzögerung von höchstens 30 Sekunden durch die laufende
Prüfung ist zulässig. Vorschläge werden für bis zu sieben Tage berechnet.

Muster- und Bedarfsstarts teilen Tageslimit und mindestens **20 Minuten Abstand**.
Jeder Vorschlag wird höchstens einmal gestartet und die Ausführung über Neustarts
hinweg dedupliziert. Frische Live-Temperaturen und ein bestätigter ausgeschalteter
Pumpenzustand bleiben Voraussetzungen. Der Historienimport setzt die Betriebsart
nicht auf aktiv. Vor der Aktivierung die Muster prüfen, insbesondere bei fehlender
Pumpenhistorie.

Sonntage und gesetzliche Feiertage bilden in Heatmap, Lernplanung und Zeitfreigaben
**Sonn-/Feiertage**. Vorhandene Tagesbeobachtungen bleiben erhalten und werden neu
gruppiert. Beim Update werden getrennte Sonntags-/Feiertagsfreigaben durch ihre
**Schnittmenge** ersetzt. Unterschiedliche oder leere alte Listen können die neue
Gruppe sperren. Die Migration läuft selbstständig beim Laden; neue Stunden werden dadurch nicht
freigegeben. Beide Speicherdateien verwenden Schema-Version 2, zusätzlich zur
HA-Store-Version 2. Ältere Version-1-Daten ohne interne Versionsangabe werden
validiert und automatisch übertragen. Unbekannte neuere Versionen und beschädigte
Daten werden abgelehnt und nicht überschrieben. Wiederholtes Laden migriert nicht erneut.


### Zeitplanung in der Heatmap

Die Verbrauchsfarben bleiben sichtbar. **Blaue Striche am unteren Zellrand** markieren
konfigurierte Freigabezeiten, **orange Markierungen am oberen Zellrand** die gelernten
Vorwärmläufe für die nächsten sieben Tage. Auch Teilzeiträume innerhalb einer Zelle
werden dargestellt. Beim Anklicken oder per Tastatur zeigen die Zelldetails die
Uhrzeiten und bei Vorwärmläufen das Datum in der Home-Assistant-Zeitzone.

Die Vorschau bleibt in **Nur Monitoring** sichtbar. Sie aktiviert keine Steuerung
und gibt keine Schaltbefehle aus. Die Vorhersage berücksichtigt Freigaben, Urlaubsprofil,
Tageslimit, bereits verbrauchte Starts und den Startabstand. Die tatsächliche Ausführung
benötigt zusätzlich aktive Steuerung und gültige Live-Messwerte. Bei fehlender Messbasis
werden nur Freigabezeiten markiert. Sonntage und Feiertage bleiben eine gemeinsame Zeile.
