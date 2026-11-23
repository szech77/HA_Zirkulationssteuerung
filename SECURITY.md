# Sicherheit

## Sicherheitsprinzipien

- Automatische Pumpenstarts sind standardmäßig deaktiviert.
- Unbekannte oder veraltete Messwerte pausieren automatische Aktionen.
- Fehler beim Pumpenbefehl werden nicht als erfolgreicher Start persistiert.
- Eingaben aus Home Assistant, InfluxDB und dem Frontend werden validiert.
- Secrets und produktive Entity-IDs gehören nicht in das Repository.

Die CI führt Bandit, pip-audit, npm audit, CodeQL und bei Pull Requests GitHub
Dependency Review aus. Bandit, pip-audit und npm audit werden zusätzlich als
SARIF-Reports in GitHub Code Scanning veröffentlicht. Abhängigkeiten müssen in
`pyproject.toml` beziehungsweise `frontend/package-lock.json` nachvollziehbar sein.
GitHub Secret Scanning und Push Protection sind als Repository-Sicherheitsfunktionen
zu aktivieren.

## GitHub Advanced Security

CodeQL analysiert den Python- und Vue/TypeScript-Code. Dependency Review prüft
Änderungen an Python-, npm- und GitHub-Action-Abhängigkeiten. Dependabot überwacht
die Abhängigkeiten und erstellt Aktualisierungsvorschläge.

Im Repository müssen unter `Settings > Advanced Security` aktiviert werden:

- Code scanning mit dem Workflow `.github/workflows/codeql.yml`
- Secret scanning
- Push protection
- Dependabot alerts und Dependabot security updates

Die Aktivierung dieser Funktionen ist eine Repository-Einstellung und kann nicht
vollständig durch Dateien im Repository erzwungen werden.

## Sicherheitsproblem melden

Bitte veröffentliche keine Details zu einer nicht behobenen Schwachstelle in einem
öffentlichen Issue. Verwende ausschließlich
[GitHub Private Vulnerability Reporting](https://github.com/szech77/HA_Zirkulationssteuerung/security/advisories/new)
für vertrauliche Meldungen. Dadurch bleiben die Details zunächst auf die Maintainer
und die beteiligten Sicherheitsforscher beschränkt.

Melde keine produktiven Zugangsdaten, Tokens oder anderen Secrets. Verwende für die
Reproduktion synthetische Daten und anonymisierte Konfigurationen.

Bitte beschreibe:

- betroffene Version oder Commit-ID
- betroffene Komponente und Voraussetzungen
- reproduzierbare Schritte oder einen minimalen Proof of Concept
- mögliche Auswirkungen und einen vorgeschlagenen Fix, falls vorhanden

## Umgang mit Meldungen

Meldungen werden zunächst reproduziert und nach Auswirkung und Ausnutzbarkeit
priorisiert. Die weitere Kommunikation und Koordination erfolgt über den GitHub
Security Advisory. Nach einer Korrektur werden Tests, Security-Scans und
Dokumentation aktualisiert. Eine Veröffentlichung erfolgt erst, wenn eine sichere
Version oder ein angemessener Workaround verfügbar ist.
