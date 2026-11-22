# Continuous Integration

Die GitHub-Actions-Pipeline prüft Pull Requests gegen `main` sowie Pushes auf
`main`, `feature/**`, `bug/**` und `bugfix/**`.

## Prüfungen

- Python 3.12, 3.13 und 3.14: Installation, Bytecode-Kompilierung, pytest und
  Branch-Coverage
- Vue/Node: reproduzierbare Installation mit `npm ci`, Vitest, Coverage, `npm audit`
  und Vite-Build
- Python Security: Bandit und pip-audit
- Pull Requests: GitHub Dependency Review

Die Pipeline verwendet keine produktiven Home-Assistant-Zugangsdaten. Der lokale
Projektname wird bei pip-audit als Editable-Paket übersprungen, weil er nicht auf
PyPI veröffentlicht ist; externe Python-Abhängigkeiten werden weiterhin geprüft.

## Lokales Nachstellen

Die vollständigen Befehle stehen in [INSTALLATION.md](./INSTALLATION.md). In VS Code
stehen zusätzlich die Frontend-Tasks `Frontend: Tests` und `Frontend: Coverage` zur
Verfügung.

Ein grüner Lauf bestätigt nur Build-, Test- und statische Prüfungen. Eine produktive
Aktivierung oder ein realer Pumpenstart ist ausdrücklich nicht Bestandteil der CI.
