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
* `observations.py` sammelt Live-Beobachtungen ohne Pumpenbefehle und speichert die begrenzte Heatmap-Historie.
* `frontend/` enthält das Vue-3-Seitenleistenpanel mit authentifiziertem Zugriff auf HA-Betriebsdaten.

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
   Im nächsten Schritt Land und optional Bundesland/Region für gesetzliche Feiertage auswählen.
2. Als HA-Administrator **Warmwasser-Zirkulation** in der Seitenleiste öffnen.
   Bei manueller Installation zuvor `cd frontend`, `npm ci --ignore-scripts` und `npm run build` ausführen;
   der gesamte Integrationsordner einschließlich `web/panel.js` und `web/panel.css` muss kopiert werden.
3. Mindestens mehrere Tage im Modus `Monitoring` beobachten. InfluxDB ist optional.
4. Messintervall, Lücken, Pumpenartefakte und Stichprobengröße im Dashboard prüfen.
5. Erst danach `Aktiv` und optional `Bedarfsautomatik` einschalten.

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


Die Heatmap zeigt halbstündliche Quoten beobachteter Tage mit Zapfvorgängen:
Montag bis Sonntag einzeln, Feiertage separat nach der gewählten Region.
Sie füllt sich ab Installation mit vorhandenen Live-Messungen. Graue Zellen haben
keine ausreichende Messbasis; schraffierte Werte sind vorläufig. Ein beobachteter
Tag zählt pro Zelle erst ab 15 Minuten gültiger Messungen bei ausgeschalteter Pumpe.
Mindestens drei solche Tage sind für eine ausreichende Messbasis nötig.
