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
Node 22.22.2. `.npmrc` deaktiviert Lifecycle-Skripte auch bei einem einfachen
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
Dashboard-Route. Jede gemountete Panel-Instanz erhält einen eigenen Router und
Store. Der Store verwendet Vues `reactive`; `useHomeAssistantPanel` kapselt die
von HA bereitgestellte authentifizierte Verbindung. Beim Entladen werden Polling
und ausstehende UI-Aktualisierungen beendet beziehungsweise verworfen.

Komponententests liegen neben ihren Komponenten, Router-/Store-/Composable-Tests
neben den jeweiligen Modulen. Die bestehenden VS-Code-Tasks führen weiterhin
alle Tests ab dem Ordner `frontend/` aus. Backend-Berechnungen, Persistenz und
physische Pumpenbefehle bleiben in der Python-Integration.

## Änderungen entwickeln

- Fachlogik gehört in `domain.py` und bleibt frei von Home-Assistant-Importen.
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
Texte werden ohne HA-Laufzeit geprüft. `tests/test_config_flow.py` und `tests/test_native_panel.py` prüfen zusätzlich
native HA-Selektoren, den Optionsdialog und das Seitenleistenpanel, wenn Home Assistant in der verwendeten
Testumgebung installiert ist; sonst wird dieses Modul ausdrücklich übersprungen.
Die CI installiert unter Python 3.14 die gepinnte HA-Testversion aus
`requirements-ha-test.txt`; ältere Python-Matrixjobs prüfen den unabhängigen Kern.
Für Änderungen an den HA-Dialogen auch diese Tests in einer passenden HA-Umgebung
(mit Home Assistant 2026.11.2 geprüft) ausführen:

```powershell
python -m pip install -r requirements-ha-test.txt
python -m pytest -q tests/test_config_flow.py tests/test_native_panel.py tests/test_usage.py
```

## Pull Requests

- Titel und Beschreibung sollen die fachliche Wirkung und mögliche Sicherheitsfolgen
  erklären.
- Changelog, Dokumentation und Tests bei Bedarf im selben Pull Request aktualisieren.
- Commits thematisch klein halten.
- Keine produktiven Systeme aktivieren und nicht automatisch pushen.
