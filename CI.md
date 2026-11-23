# Continuous Integration

Die GitHub-Actions-Pipeline prüft Pull Requests gegen `main` sowie Pushes auf
`main`, `feature/**`, `bug/**` und `bugfix/**`.

## Prüfungen

- Python 3.12, 3.13 und 3.14: Installation, Bytecode-Kompilierung, pytest und
  Branch-Coverage
- Vue/Node: reproduzierbare Installation mit `npm ci`, Vitest, Coverage, `npm audit`
  und Vite-Build
- Chrome-Browserregression im Python-3.14-Testjob: natives Mausrad-/Touchpad-Scrollen,
  feste Titelleiste mit EOS-Maßen, mobile Navigation, stufenlose Heatmap mit grünen
  Freigaben, Scrollachsen, Routenwechsel und Touch-Geste für das HA-Menü
- Python Security: Bandit und pip-audit inklusive SARIF-Upload zu Code Scanning
- GitHub Advanced Security: CodeQL für Python und TypeScript/JavaScript sowie
  Dependency Review für Änderungen an Python-, Node- und GitHub-Action-Abhängigkeiten
- Drittanbieter-Reports: Bandit, pip-audit und npm audit werden als SARIF in GitHub
  Code Scanning veröffentlicht und bleiben zusätzlich verpflichtende CI-Gates
- Home Assistant: Hassfest validiert Manifest, Strings und Integrationsstruktur
- Pull Requests: GitHub Dependency Review
- Branch-Pushes: Beta auf `feature/**`, `bug/**` und `bugfix/**`, stabil auf `main`

Die Pipeline verwendet keine produktiven Home-Assistant-Zugangsdaten. Der lokale
Projektname wird bei pip-audit als Editable-Paket übersprungen, weil er nicht auf
PyPI veröffentlicht ist; externe Python-Abhängigkeiten werden weiterhin geprüft.

## GitHub Advanced Security

CodeQL analysiert Python und TypeScript/JavaScript bei Pushes, Pull Requests und
wöchentlich. Der Dependency-Review-Job schlägt fehl, wenn eine Änderung eine
bekannte Schwachstelle mit mindestens hoher Schwere einführt. Die Konfiguration
liegt in [.github/codeql/codeql-config.yml](./.github/codeql/codeql-config.yml) und
[.github/dependency-review-config.yml](./.github/dependency-review-config.yml).

Zusätzlich müssen im Repository unter `Settings > Advanced Security` aktiviert
werden:

- Code scanning (Advanced setup mit [.github/workflows/codeql.yml](./.github/workflows/codeql.yml))
- Secret scanning und Push Protection
- Dependabot alerts und Dependabot security updates

Die Aktivierung von Secret Scanning, Push Protection und Dependabot erfolgt als
Repository-Einstellung und kann nicht sicher allein durch eine Workflow-Datei
erzwungen werden. Sicherheitsrelevante Findings müssen vor dem Merge geprüft und
behoben oder nachvollziehbar begründet werden.

## Lokales Nachstellen

Die vollständigen Befehle stehen in [INSTALLATION.md](./INSTALLATION.md). In VS Code
stehen zusätzlich die Frontend-Tasks `Frontend: Tests` und `Frontend: Coverage` zur
Verfügung.

Ein grüner Lauf bestätigt nur Build-, Test- und statische Prüfungen. Eine produktive
Aktivierung oder ein realer Pumpenstart ist ausdrücklich nicht Bestandteil der CI.

## Release

Ein Push auf `feature/**`, `bug/**` oder `bugfix/**` erzeugt nach erfolgreicher
Validierung einen Beta-Kandidaten. Ein Push auf `main` erzeugt einen stabilen
Kandidaten. Vor der Veröffentlichung pausiert der Release-Job an einem geschützten
GitHub-Environment:

- `beta-release` für Beta-Releases
- `stable-release` für finale Releases

Die erforderlichen Reviewer werden unter `Settings > Environments` konfiguriert.
Nur ein dort hinterlegter Reviewer kann in GitHub Actions über `Review deployments`
mit `Approve and deploy` freigeben. Für die finale Umgebung sollten zusätzlich nur
`main`-Deployments erlaubt und der Admin-Bypass deaktiviert werden. Optional kann
`Prevent self-review` aktiviert werden.

Die Release-Version wird aus dem strukturierten Abschnitt `## New Version` in
[CHANGELOG.md](./CHANGELOG.md) berechnet. Ohne Freigabe oder bei Ablehnung wird der
Release-Job nicht ausgeführt; es werden keine Issues und keine Kommentar-Polling-
Skripte benötigt.

## Panel-Artefakte

`npm run build` schreibt `panel.js` und `panel.css` nach
`custom_components/warmwasser_zirkulation/web/`. Der Build ist nicht versioniert.
Der freigegebene Publish-Job baut das Frontend; `tools/release.py publish` verlangt
beide Dateien und nimmt ihren geprüften Inhalt als Blobs in den Release-Commit auf.
Quellbranch und dessen Arbeitsstand bleiben unverändert. Ein fehlender oder leerer
Build verhindert die Veröffentlichung. Für manuelle Quellinstallationen lokal bauen.

Die Python-3.14-Testmatrix und der Security-Job installieren zusätzlich
`requirements-ha-test.txt` mit Home Assistant 2026.11.2. Dadurch laufen die nativen
HA-Tests in der Pflicht-CI und pip-audit erfasst auch deren Testabhängigkeiten.
Unter Python 3.12/3.13 bleibt die HA-Testinstallation per Versionsmarker ausgenommen.

Die Frontend-Prüfungen und der Release-Build verwenden Node 22.22.2, passend zur
Mindestversion der DOM-Testumgebung. Der npm-Audit bleibt aktiv; gezielte
Unterpaket-Overrides beheben die Formatter-Befunde, ohne Scanner zu unterdrücken.


`holidays` wird zur Laufzeit mit Home Assistant geteilt. Manifest und `pyproject.toml`
fordern deshalb `holidays>=0.108`, ohne HAs Paketversion exakt festzuschreiben.
`requirements-ha-test.txt` pinnt für die Tests 0.108, passend zur Workday-Integration
in HA 2026.11.2. Bei Updates der HA-Testversion auch diesen Test-Pin prüfen.
Die Metadatenprüfungen testen die Manifest-Reihenfolge, übereinstimmende
Projekt-/Manifest-Anforderungen und die Kompatibilität mit dem HA-Teststand.
