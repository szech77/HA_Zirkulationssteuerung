# Mitwirken

Vielen Dank für Beiträge zur Warmwasser-Zirkulationssteuerung. Änderungen sollen
klein, nachvollziehbar und auf die sichere Betriebsweise der Integration ausgerichtet
sein.

## Entwicklungsumgebung

1. Repository klonen und den Branch `feature/initial` für die initiale Umsetzung
   verwenden.
2. Die projektlokale Umgebung `.venv\Scripts\python.exe` auswählen.
3. Test- und Security-Abhängigkeiten installieren:

   ```powershell
   .venv\Scripts\python.exe -m pip install -e ".[test]"
   .venv\Scripts\python.exe -m pip install -e ".[security]"
   cd frontend
   npm ci --ignore-scripts --no-audit --no-fund
   ```

## Frontend-Abhängigkeiten

Für die Frontend-Werkzeuge Node **22.22.2 oder neuer aus der 22er-Reihe**,
**24.15.0 oder neuer aus der 24er-Reihe** oder **26+** verwenden. Die CI prüft
Node 22.22.2. Der exakt gepinnte Vue-Compileradapter `@vitejs/plugin-vue` 6.0.10
unterstützt das verwendete Vite 6 und Vue 3.5. Seine Node-Untergrenze
(20.19 bzw. 22.12) ist durch die Projektvorgaben bereits erfüllt.
`.npmrc` deaktiviert Lifecycle-Skripte auch bei einem einfachen
`npm ci`; `package-lock.json` weiterhin zusammen mit `package.json` pflegen.

`jsdom` 31.0.0 ersetzt die veraltete DOM-Testkette. `js-beautify` 2.0.3 verwendet
noch ältere `glob`-/`minimatch`-Bereiche. Die Overrides in `package.json` begrenzen
deshalb diese Kette auf `glob` 14.0.4 und `minimatch` 11.0.5. Die verwendeten APIs
`globSync`, `hasMagic`, `Minimatch.match` und `escape` bleiben verfügbar; Tests prüfen
Vue-HTML-Formatierung und EditorConfig-Dateimuster. Sobald der Upstream selbst
gepatchte Bereiche verwendet, die Overrides neu bewerten.

Hintergrund: [glob-Advisory](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4),
[minimatch-Advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249).
Neue Versionen beim Auflösen mit `npm install --min-release-age=14` auswählen
(npm 11); `npm ci` installiert danach die geprüfte Lockdatei. Der Dependabot-Cooldown
beträgt ebenfalls 14 Tage.

## Python-Struktur

```text
custom_components/warmwasser_zirkulation/
├── __init__.py          # von HA geladene Setup-/Unload-Einstiege
├── config_flow.py       # native HA-Konfiguration und Optionsdialog
├── sensor.py            # native Sensorplattform
├── switch.py            # native Schalterplattform
├── manifest.json        # HA-/HACS-Metadaten
├── app/
│   ├── api/             # Admin-WebSocket-Endpunkte und Statusdarstellung
│   ├── core/            # Konstanten, Konfiguration und Feiertagskalender
│   ├── models/          # Mess-, Lern-, Planungs- und Laufzeitmodelle; Verträge
│   ├── schemas/         # Validierung der Steuerungseinstellungen
│   ├── services/        # Erkennung, Planung, Historienauswertung und Steuerung
│   ├── db/              # HA Store, Recorder-Zugriff und Speichermigrationen
│   ├── adapters/        # bestätigte Pumpenbefehle, Beobachtung und Panel-Lebenszyklus
│   ├── utils/           # Temperaturkonvertierung
│   └── main.py          # Integration initialisieren und entladen
├── translations/        # native HA-Übersetzungen
├── brand/               # native HA-Logos
├── icons.js             # globales HA-Menüsymbol
└── web/                 # gebautes Vue-Bundle; nur im Release versioniert

tests/
├── api/
├── adapters/
├── core/
├── db/
├── services/
├── tools/               # Release- und Security-Werkzeuge
└── conftest.py          # gemeinsame Pfade und isolierte Installationskopien
```

Das HA-Paket ist zugleich der Quellcode- und Auslieferungsordner. Ein zusätzliches
`src/app` außerhalb dieses Pakets würde beim Kopieren durch HACS fehlen. Deshalb
bleibt der Anwendungscode vollständig unter `custom_components/.../app` und wird
von der bestehenden setuptools-Paketsuche rekursiv erfasst. Die CI prüft weiterhin
den gesamten Integrationsordner; ihre Test-, Coverage- und Scannerpfade erfassen
auch die neuen Unterpakete.

`models`, `schemas` und die Fachservices benötigen keine HA-Laufzeit. Die
HA-spezifische Verbindung entsteht in `app/main.py`, den Adaptern und den
Speicherschnittstellen. `api/websocket.py` verwendet weiterhin HAs authentifizierte
Verbindung und Administratorprüfung; die bestehenden WebSocket-Namen bleiben gleich.
Ein eigener HTTP-Server, JWT-Login, ORM oder Alembic sind dafür nicht erforderlich.
Die vorhandenen versionierten Speichermigrationen liegen in `app/db/migrations.py`;
Die Speicherschlüssel bleiben unverändert. Schema-/HA-Store-Version 3 ergänzt
dauerhaft gespeicherte Laufzeit und Tageslimits und migriert Versionen 1 und 2.
Der API-/Speichervertrag verwendet Sekunden, die Oberfläche Minuten. Änderungen
der Laufzeit ändern keine bereits bestätigte Laufzeitgrenze.

Die Tests spiegeln diese Verantwortlichkeiten. Zusätzlich prüfen sie, dass das
kopierte Integrationspaket ohne Zugriff auf das Repository importierbar bleibt
und das Panel seine gebauten Dateien im Integrationsordner findet.

## Frontend-Struktur

```text
frontend/src/
├── assets/
│   ├── images/          # SVG-Logoquellen und Menü-Symbol
│   └── styles/          # globale Panel-Styles
├── components/          # wiederverwendbare Vue-Komponenten samt Tests
├── composables/         # useHomeAssistantPanel: Verbindung, Polling, Befehle
├── views/               # DashboardView: Seitenansicht samt Tests
├── router/              # Vue-Router-Konfiguration und Tests
├── stores/              # reaktiver Dashboard-Zustand pro App-Instanz
├── types/               # gemeinsame TypeScript-Verträge
├── test/                # synthetische Fixtures und übergreifende Tests
├── App.vue              # Wurzelkomponente mit RouterView
└── main.ts              # Vue-Mounting und HA-Custom-Element-Brücke
```

Vue Router **4.6.4** ist exakt gepinnt und verwendet `createMemoryHistory()`.
Home Assistant behält die äußere Browser-URL; das Panel startet intern auf der
Dashboard-Route; `/settings` ist die eigene Einstellungsseite. `App.vue` hält
die feste Titelleiste und mit `KeepAlive` die Entwürfe beim Routenwechsel. Jede gemountete Panel-Instanz erhält einen eigenen Router und
Store. Der Store verwendet Vues `reactive`; `useHomeAssistantPanel` kapselt die
von HA bereitgestellte authentifizierte Verbindung. Beim Entladen werden Polling
und ausstehende UI-Aktualisierungen beendet beziehungsweise verworfen.

Die Custom-Element-Eigenschaften `panel`, `hass`, `route` und `narrow` gehören
Home Assistant. Interne Controller in echten privaten JavaScript-Feldern halten,
damit die Metadatenzuweisung beim Panel-Start sie nicht überschreibt. Brückentests
müssen die HA-Eigenschaften vor dem Einhängen des Elements setzen.

Komponententests liegen neben ihren Komponenten, Router-/Store-/Composable-Tests
neben den jeweiligen Modulen. Die bestehenden VS-Code-Tasks führen weiterhin
alle Tests ab dem Ordner `frontend/` aus. Backend-Berechnungen, Persistenz und
physische Pumpenbefehle bleiben in der Python-Integration.

## Änderungen entwickeln

- Fachlogik gehört in `app/services/`, Datenmodelle in `app/models/`. Beide bleiben
  unabhängig von einer installierten HA-Laufzeit testbar.
- Home-Assistant-Adapter bleiben dünn; Fehler werden fail-closed behandelt.
- Vue-Komponenten müssen zugänglich bleiben und sichtbare Zustände für Monitoring,
  Pause, Fehler und Aktivität unterscheiden.
- Keine Secrets, privaten URLs, echten Entity-IDs oder vollständigen externen Payloads
  in Quelltext, Tests oder Logs aufnehmen.

## Tests vor einem Pull Request

```powershell
.venv\Scripts\python.exe -m pytest -q
.venv\Scripts\python.exe -m pytest -q --cov=custom_components.warmwasser_zirkulation --cov-branch --cov-report=term-missing
.venv\Scripts\python.exe -m compileall -q custom_components tests
.venv\Scripts\python.exe -m bandit -r custom_components -ll
.venv\Scripts\python.exe -m pip_audit --skip-editable

cd frontend
npm test
npm run test:coverage
npm run audit
npm run build
```

Neue Fachlogik braucht Tests für Normalfall, Grenzwerte und Fehlerfälle. Neue oder
geänderte Vue-Komponenten brauchen Vitest- und Vue-Test-Utils-Tests.

Die Konfigurationsvalidierung und die Vollständigkeit der deutschen/englischen
Texte werden ohne HA-Laufzeit geprüft. `tests/adapters/test_config_flow.py` und `tests/adapters/test_native_panel.py` prüfen zusätzlich
native HA-Selektoren, den Optionsdialog und das Seitenleistenpanel, wenn Home Assistant in der verwendeten
Testumgebung installiert ist; sonst wird dieses Modul ausdrücklich übersprungen.
Die CI installiert unter Python 3.14 die gepinnte HA-Testversion aus
`requirements-ha-test.txt`; ältere Python-Matrixjobs prüfen den unabhängigen Kern.
Für Änderungen an den HA-Dialogen auch diese Tests in einer passenden HA-Umgebung
(mit Home Assistant 2026.11.2 geprüft) ausführen:

```powershell
python -m pip install -r requirements-ha-test.txt
python -m pytest -q tests/adapters/test_config_flow.py tests/adapters/test_native_panel.py tests/services/test_usage.py
```

## Pull Requests

- Titel und Beschreibung sollen die fachliche Wirkung und mögliche Sicherheitsfolgen
  erklären.
- Changelog, Dokumentation und Tests bei Bedarf im selben Pull Request aktualisieren.
- Commits thematisch klein halten.
- Keine produktiven Systeme aktivieren und nicht automatisch pushen.


## Scrollen im eingebetteten Panel prüfen

Das äußere HA-Custom-Element begrenzt die Fläche; `.panel-viewport` im Shadow DOM
übernimmt das native Scrollen. Die Titelleiste steht als eigene Flex-Zeile außerhalb
dieses Scrollbereichs; `.panel-root` begrenzt die App auf die verfügbare HA-Fläche.
Damit hängt die Leiste nicht von `position: sticky` ab. Die Heatmap hat
ihren eigenen horizontalen Scrollbereich. Keine Rad-/Touchpad-Ereignisse abfangen
oder per JavaScript nachbilden.

Nach `npm run build` im Frontend zusätzlich `npm run test:tools` und
`npm run test:browser` ausführen.
Der Test nutzt ein bereits installiertes Chrome/Chromium (optional über
`CHROME_BIN`) mit isoliertem temporärem Profil und synthetischen Daten. Er prüft
echte Mausrad-Eingaben, gebrochene Touchpad-Deltas, die schmale Ansicht, beide
Scrollachsen der Heatmap, Routenwechsel, die feste Titelleiste und echte Touch-Gesten
für das native HA-Menü, die EOS-Geometrie der Titelleiste und die mobile
Navigation unterhalb des Scrollbereichs. Die Heatmap-Prüfung unterscheidet
benachbarte Quoten und grüne Freigaben auch bei 100 % Entnahme.
Die passive Wischerkennung am linken Rand sendet
`hass-toggle-menu` mit `open: true`; vertikale Bewegungen, mehrere Finger und
Bedienelemente lösen das Menü nicht aus. Die CI führt
ihn im Python-3.14-Testjob mit dem Browser des Ubuntu-Runner-Images aus.
