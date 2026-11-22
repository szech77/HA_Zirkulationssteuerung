# Continuous Integration

Die GitHub-Actions-Pipeline prüft Pull Requests gegen `main` sowie Pushes auf
`main`, `feature/**`, `bug/**` und `bugfix/**`.

## Prüfungen

- Python 3.12, 3.13 und 3.14: Installation, Bytecode-Kompilierung, pytest und
  Branch-Coverage
- Vue/Node: reproduzierbare Installation mit `npm ci`, Vitest, Coverage, `npm audit`
  und Vite-Build
- Python Security: Bandit und pip-audit
- Home Assistant: Hassfest validiert Manifest, Strings und Integrationsstruktur
- Pull Requests: GitHub Dependency Review
- Branch-Pushes: Beta auf `feature/**`, `bug/**` und `bugfix/**`, stabil auf `main`

Die Pipeline verwendet keine produktiven Home-Assistant-Zugangsdaten. Der lokale
Projektname wird bei pip-audit als Editable-Paket übersprungen, weil er nicht auf
PyPI veröffentlicht ist; externe Python-Abhängigkeiten werden weiterhin geprüft.

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
