# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden hier dokumentiert.
Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

## New Version

### Features

- Initiale Home-Assistant-Custom-Integration für lernende Warmwasserzirkulation.
- Vue-3-Oberfläche mit Vitest-Tests sowie CI- und Security-Prüfungen.
- Automatische Beta-/Stable-Releaseplanung mit expliziter Maintainer-Freigabe.

### Bugfixes

- Den Integrationsstart mit echten Home-Assistant-Adaptern statt des `hass`-Platzhalters für Speicher und Pumpensteuerung korrigieren. Laufzeitdaten pro Konfigurationseintrag asynchron speichern und zeitzonenbehaftete Pumpenlaufzeiten wiederherstellen. Ungültige gespeicherte Zustände verhindern den Start; unbekannte Pumpenzustände verhindern Einschaltbefehle. Das konfigurierte Tageslimit übernehmen und Servicefehler ohne rohe Ausnahmedetails protokollieren.

### Breaking Changes

- Keine.

### Security

- Bandit, pip-audit, npm audit und Hassfest werden in der CI ausgeführt.

## 0.1.0 - 2026-11-22

### Features

- Reine Fachlogik mit synthetischen fachlichen Tests.
