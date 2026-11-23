# Warmwasser-Zirkulation für Home Assistant

Eine sicher startende Custom Integration für lernende Warmwasser-Zirkulation.
Der Kern läuft zunächst im Monitoring und erzeugt erst nach ausreichender Kalibrierung
und expliziter Aktivierung Schaltbefehle.

## Architektur

* `custom_components/warmwasser_zirkulation/domain.py` enthält reine Fachlogik für
  Erkennung, Lernen, Heatmap und Planung.
* `coordinator.py` verbindet Fachlogik, HA-Zustände, Persistenz und Aktorik. InfluxDB
  ist optional; Recorder-Daten können als Importquelle verwendet werden.
* `sensor.py` und `switch.py` sind dünne HA-Adapter. Keine produktiven Entity-IDs oder
  Zugangsdaten werden erfunden; alle Identitäten bleiben konfigurierbar.
* `frontend/` enthält eine Vue-3-Oberfläche als Lovelace-Ressource.

## Einrichtung

Die vollständige Anleitung steht in [INSTALLATION.md](./INSTALLATION.md).

Weitere Projektregeln und Informationen:

- [CONTRIBUTING.md](./CONTRIBUTING.md) – Entwicklungsablauf und Pull Requests
- [CI.md](./CI.md) – Pipeline und lokale Nachstellung
- [CHANGELOG.md](./CHANGELOG.md) – nachvollziehbare Änderungen je Version
- [LOGGING.md](./LOGGING.md) – Logging- und Diagnosekonventionen
- [SECURITY.md](./SECURITY.md) – Meldung und Behandlung von Sicherheitsproblemen
- [LICENSE](./LICENSE) – Apache-2.0-Lizenz

Kurzablauf:

1. Integration über UI konfigurieren: Vorlaufsensor, Puffersensor optional,
   Pumpenschalter, Laufzeit und tägliches Startlimit setzen. Die Auswahl ist unter
   **Konfigurieren** nachträglich änderbar; der Dialog ist auf Deutsch verfügbar.
2. Mindestens mehrere Tage im Modus `Monitoring` beobachten. InfluxDB ist optional.
3. Messintervall, Lücken, Pumpenartefakte und Stichprobengröße im Dashboard prüfen.
4. Erst danach `Aktiv` und optional `Bedarfsautomatik` einschalten.

Die produktive Installation/Aktivierung ist ausdrücklich nicht Teil dieses Projekts.
Konfiguration, Pumpenverhalten und reale Zeitabstände müssen an der Anlage verifiziert werden.

## Tests

```text
python -m pip install -e ".[test]"
python -m pytest
```

In VS Code muss dafür derselbe Interpreter ausgewählt sein, in dem die Test-Extras
installiert wurden. Die asynchronen Koordinator-Tests benötigen zusätzlich
`pytest-asyncio`.

Die Tests verwenden synthetische Zeitreihen und prüfen fachliche Grenzfälle sowie sichere
Fehlerbehandlung: Datenlücken, Ausreißer, unbekannte Pumpenzustände, konkurrierende Starts,
Fenster/Limits, Neustart und optionale Influx-Ausfälle.

