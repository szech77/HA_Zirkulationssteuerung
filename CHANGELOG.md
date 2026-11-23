# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden hier dokumentiert.
Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

## New Version

### Features

- Ein natives Vue-Dashboard als HA-Seitenleistenpanel mit echten Temperatur-, Pumpen-, Lern- und Betriebsdaten ergänzen. Lade-, Verbindungs- und Fehlerzustände auf Deutsch anzeigen; die vorhandenen Sensor-/Schalterplattformen pro Konfigurationseintrag laden und Änderungen der Bedarfsautomatik dauerhaft speichern.
- Eine persistente Heatmap je halber Stunde für Montag bis Sonntag und eine separate Feiertagszeile ergänzen. 180 Tage Beobachtungen behalten, Messlücken und Pumpenlaufzeiten ausschließen, Teilmessungen kennzeichnen und Tagesquoten erst ab ausreichender Messbasis ausweisen. Gesetzliche Feiertage über das in der Konfiguration änderbare Land und Bundesland/Region mit `holidays==0.109` zuordnen. Die Messwertbeobachtung selbst löst keine Pumpenbefehle aus.
- Native, durchsuchbare HA-Auswahl für Vorlauf- und optionalen Puffertemperaturfühler sowie den Pumpenschalter ergänzen. Deutsche Beschriftungen, Hilfetexte und Validierungsfehler für Einrichtung und nachträgliche Konfiguration bereitstellen. Laufzeit und tägliches Startlimit als begrenzte Ganzzahlen erfassen; geänderte Optionen automatisch neu laden und einen optionalen Puffersensor wieder entfernen können.
- Initiale Home-Assistant-Custom-Integration für lernende Warmwasserzirkulation.
- Vue-3-Oberfläche mit Vitest-Tests sowie CI- und Security-Prüfungen.
- Automatische Beta-/Stable-Releaseplanung mit expliziter Maintainer-Freigabe.

### Bugfixes

- Das gebaute Panel-Bundle und Stylesheet im Integrationsordner erzeugen und in den Release-Snapshot aufnehmen; Veröffentlichungen ohne gebaute Assets ablehnen. Panel und Beobachtungsabonnements bei Entladen oder fehlgeschlagener Einrichtung aufräumen.
- Den Integrationsstart mit echten Home-Assistant-Adaptern statt des `hass`-Platzhalters für Speicher und Pumpensteuerung korrigieren. Laufzeitdaten pro Konfigurationseintrag asynchron speichern und zeitzonenbehaftete Pumpenlaufzeiten wiederherstellen. Ungültige gespeicherte Zustände verhindern den Start; unbekannte Pumpenzustände verhindern Einschaltbefehle. Das konfigurierte Tageslimit übernehmen und Servicefehler ohne rohe Ausnahmedetails protokollieren.

### Breaking Changes

- Keine.

### Security

- Panel und Status-WebSocket auf authentifizierte HA-Administratoren begrenzen. HA-Authentifizierung verwenden und private Fehlerantworten weder im Dashboard noch in Browsermeldungen offenlegen.
- Bandit, pip-audit, npm audit und Hassfest werden in der CI ausgeführt.

## 0.1.0 - 2026-11-22

### Features

- Reine Fachlogik mit synthetischen fachlichen Tests.
