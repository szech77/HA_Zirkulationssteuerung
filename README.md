# Warmwasser-Zirkulation für Home Assistant

Eine sicher startende Custom Integration für lernende Warmwasser-Zirkulation.
Der Kern läuft zunächst im Monitoring und erzeugt erst nach expliziter Aktivierung
innerhalb konfigurierter Freigabezeiten bedarfsabhängige Schaltbefehle.

## Architektur

* `custom_components/warmwasser_zirkulation/app/` gliedert den Python-Code in
  `api`, `core`, `models`, `schemas`, `services`, `db`, `adapters` und `utils`.
  Erkennung, Lernen und Planung bleiben unabhängig von Home Assistant testbar.
* `app/main.py` koordiniert den HA-Lebenszyklus; `app/services/coordinator.py`
  serialisiert Steuerung und Einstellungen. Die von HA geladenen Einstiegsdateien
  `__init__.py`, `config_flow.py`, `sensor.py` und `switch.py` bleiben im Integrationsordner.
* `app/db/` enthält HAs Speicherschnittstellen, versionierte Migrationen und den
  lesenden Recorder-Zugriff. Eine InfluxDB-Anbindung ist derzeit nicht implementiert.
* `app/adapters/observations.py` sammelt Live-Beobachtungen und ruft die Steuerung
  browserunabhängig auf; `app/api/` liefert die geschützte Dashboard-API.
* Die gespiegelten Bereiche unter `tests/` prüfen Fachlogik, Adapter, API und Speicher.
  Die vollständige Python-Struktur steht in [CONTRIBUTING.md](./CONTRIBUTING.md#python-struktur).
* `frontend/src/` enthält das Vue-3-Panel mit `App.vue`, `views`, `components`,
  `composables`, `router`, `stores` und `assets`. Die Verzeichnisaufteilung steht in
  [CONTRIBUTING.md](./CONTRIBUTING.md#frontend-struktur).

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
3. Im Modus `Monitoring` Historienimport, Messbasis und erkannte Muster prüfen.
   Die letzten 28 abgeschlossenen Tage werden bei unzureichender Lernbasis automatisch
   aus dem HA-Recorder gelesen, soweit dort Messungen vorhanden sind.
4. Messintervall, Lücken, Pumpenartefakte und Stichprobengröße im Dashboard prüfen.
5. Im Dashboard **Einstellungen → Freigabezeiten** öffnen: Freigabezeiten für Montag bis Samstag
   und die gemeinsame Gruppe **Sonn-/Feiertage** als Listen mit mehreren Abschnitten anlegen (z. B. 06:00–08:00
   und 18:00–21:00). Leere Tage sind gesperrt. Erst danach **Automatische Steuerung**
   wählen und **Änderungen speichern**. Für Urlaub gibt es ein separates,
   manuell aktivierbares Tagesprofil; ohne Zeitfenster sperrt es alle Starts.

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
Fenster/Limits, Neustart, wiederholte Recorder-Importe und Importausfälle.


Die Heatmap zeigt halbstündliche Quoten beobachteter Tage mit Zapfvorgängen:
Montag bis Samstag einzeln, Sonn- und Feiertage gemeinsam nach der gewählten Region.
Sie nutzt verfügbare Recorder-Historie und wird durch Live-Messungen ergänzt. Graue Zellen haben
keine ausreichende Messbasis; schraffierte Werte sind vorläufig. Ein beobachteter
Tag zählt pro Zelle erst ab 15 Minuten gültiger Messungen bei ausgeschalteter Pumpe.
Mindestens drei solche Tage sind für eine ausreichende Messbasis nötig.


Die aktive Steuerung kann vor regelmäßig erkannten Entnahmen vorwärmen: mindestens
3 ausreichend beobachtete Tage, Entnahmen an mindestens 60 % dieser Tage und
mindestens 2 Tage mit bekannter Entnahmezeit im jeweiligen halbstündlichen Abschnitt.
Aus deren Median wird die typische Entnahmezeit geschätzt; die konfigurierte
Pumpenlaufzeit ist der Vorlauf. Aktuelle Messwerte, ein bestätigter Pumpenzustand,
Freigabefenster, Tageslimits und 20 Minuten Abstand zwischen Starts bleiben Pflicht.
Monitoring schaltet die Pumpe nicht. Der Import aktiviert die Steuerung nicht.

Bei fehlenden historischen Pumpenaufzeichnungen wird auf ausdrückliche Vorgabe
„Pumpe aus“ angenommen; die UI kennzeichnet dies. Aufgezeichnete `unknown`- oder
`unavailable`-Zustände werden ausgeschlossen. Fehlende Temperaturdaten werden
nicht ergänzt oder als verbrauchsfreie Zeit gezählt.

Die Titelleiste bleibt beim Scrollen sichtbar. Unter **Einstellungen → Betrieb & Urlaub**
sind Pumpenlaufzeit (frei in Minuten bis 1.440 Minuten) und Tageslimit einstellbar.
Dezimalwerte sind möglich; laufende Pumpenläufe behalten ihre bestätigte Endzeit.
Die dunkle Ansicht verwendet neutrale Anthrazit-/Grautöne.
