# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden hier dokumentiert.
Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

## New Version

### Features

- Den EOS-Gestaltungsstil auf Titelleiste, Logo-Position, Symbolnavigation, Schriften, Abstände, Karten und Formulare übertragen; die Navigation auf Handys dauerhaft unter dem Scrollbereich anzeigen. Entnahmequoten in der Heatmap stufenlos anhand der berechneten Quote einfärben, die Legende als Verlauf darstellen und Freigabezeiten separat in Grün markieren.
- Das native HA-Seitenmenü durch Wischen vom linken Panelrand nach rechts öffnen. Den zusätzlichen Ansichtsnamen samt Trennstrich aus der Titelleiste entfernen; aktive Navigation und zugängliche Seitenüberschriften erhalten.
- Den freigegebenen Oberflächenentwurf als echte Vue-App umsetzen: feste Titelleiste, getrennte Übersicht und Einstellungsseite, kompakte echte Messwerte, Heatmap mit ein-/ausblendbaren Freigaben und Vorwärmläufen, reale Planung und Historienimport. Neutrale Anthrazit-/Grautöne im Darkmode verwenden; Entwürfe beim Routenwechsel und bei Verbindungsproblemen erhalten. Sensoren und Region über HAs native Auswahl erreichbar halten.
- Pumpenlaufzeit frei in Minuten bis 1.440 Minuten (24 Stunden), einschließlich Dezimalwerten, sowie Tageslimit direkt im Panel speichern. Bestätigte laufende Endzeiten erhalten und längere Starts weiterhin vollständig an Freigabezeiten binden. Steuerungsdaten und native HA-Optionen auf dieselben wirksamen Grenzen abstimmen; Schema-/HA-Store-Version 3 mit automatischer Migration aus Version 1 und 2 ergänzen.
- Freigabezeiten und gelernte Vorwärmläufe direkt in den vorhandenen sieben Heatmap-Zeilen markieren, einschließlich minutengenauer Zeitangaben und Legende. Die Planung auch im Monitoring bei ausgeschalteter Pumpensteuerung anzeigen, ohne die Steuerung zu aktivieren oder Schaltbefehle auszulösen. Für Anzeige und Steuerung dieselbe Wochenplanung mit Tageskontingent, Startabstand und Sommerzeitbehandlung verwenden.
- Bei unzureichender Lernbasis die letzten 28 abgeschlossenen Tage aus HAs Recorder automatisch und erneut über das Dashboard einlesen. Importstatus anzeigen, Tages-Checkpoints speichern, Wiederholungen deduplizieren und Live-Beobachtung während des begrenzten Hintergrundimports fortsetzen. Fehlende historische Pumpenaufzeichnungen wie gewünscht als ausgeschaltete Pumpe behandeln und diese Annahme kennzeichnen; Messlücken und aufgezeichnete Pumpen-/Fehlerzustände ausschließen.
- Vorausschauendes Vorwärmen aus wiederkehrenden Entnahmezeiten ergänzen: mindestens drei Beobachtungstage, mindestens 60 % Entnahmetage und zwei bekannte Entnahmeminuten pro Zeitabschnitt. Musterstarts an Betriebsart, frische Live-Werte, bestätigte Pumpe, volle Laufzeit im Freigabefenster und Tageslimit binden; Muster- und Bedarfsstarts mit 20 Minuten Abstand und über Neustarts deduplizieren.
- Sonntage und gesetzliche Feiertage in Heatmap, Zeitplanung und Freigabeeditor zu „Sonn-/Feiertage“ zusammenführen. Tagesdaten erhalten und doppelte Zählung von Feiertagen an Sonntagen verhindern. Version-1-Speicherdaten automatisch auf die aktuelle Schema-/HA-Store-Version migrieren; dabei getrennte alte Freigaben konservativ auf ihre Schnittmenge zusammenführen. Unbekannte neuere Speicherformate unverändert erhalten und ablehnen.
- Freigabezeiten und Betriebsart direkt im Dashboard konfigurieren: für Montag bis Samstag und Sonn-/Feiertage bis zu zwölf Zeitabschnitte, ein manuell aktivierbares tägliches Urlaubsprofil sowie „Nur Monitoring“/„Steuerung aktiv“. Einstellungen pro Eintrag dauerhaft speichern, Zeitfenster im Backend validieren und parallele Änderungen durch Revisionsprüfung absichern. Feiertags- und Urlaubsprofile ersetzen den regulären Wochenplan; leere Listen sperren Starts.
- Bedarfssteuerung browserunabhängig ausführen und nur vollständige Läufe innerhalb der Freigaben erlauben. Eigene Läufe bei Laufzeitende, Monitoring oder entzogener Freigabe beenden, offene Laufzeitgrenzen nach Neustart wiederherstellen, Pumpenbefehle bestätigen und fehlgeschlagene Stopps erneut versuchen. Fremde/manuelle Läufe nicht beenden; Pumpenfehler bis zur expliziten Quittierung sperren. Tageslimits anhand des lokalen Kalendertags zurücksetzen.
- Ein natives Vue-Dashboard als HA-Seitenleistenpanel mit echten Temperatur-, Pumpen-, Lern- und Betriebsdaten ergänzen. Lade-, Verbindungs- und Fehlerzustände auf Deutsch anzeigen; die vorhandenen Sensor-/Schalterplattformen pro Konfigurationseintrag laden und Änderungen der Bedarfsautomatik dauerhaft speichern.
- Eine persistente Heatmap je halber Stunde für Montag bis Samstag und die gemeinsame Gruppe Sonn-/Feiertage ergänzen. 180 Tage Beobachtungen behalten, Messlücken und Pumpenlaufzeiten ausschließen, Teilmessungen kennzeichnen und Tagesquoten erst ab ausreichender Messbasis ausweisen. Gesetzliche Feiertage über das in der Konfiguration änderbare Land und Bundesland/Region mit `holidays>=0.108` zuordnen. Die Messwertbeobachtung selbst löst keine Pumpenbefehle aus.
- Native, durchsuchbare HA-Auswahl für Vorlauf- und optionalen Puffertemperaturfühler sowie den Pumpenschalter ergänzen. Deutsche Beschriftungen, Hilfetexte und Validierungsfehler für Einrichtung und nachträgliche Konfiguration bereitstellen. Laufzeit und tägliches Startlimit als begrenzte Ganzzahlen erfassen; geänderte Optionen automatisch neu laden und einen optionalen Puffersensor wieder entfernen können.
- Initiale Home-Assistant-Custom-Integration für lernende Warmwasserzirkulation.
- Vue-3-Oberfläche mit Vitest-Tests sowie CI- und Security-Prüfungen.
- Automatische Beta-/Stable-Releaseplanung mit expliziter Maintainer-Freigabe.

### Bugfixes

- `@vitejs/plugin-vue` für Vue-SFC-Kompilierung und Vite-Build von 5.2.4 auf 6.0.10 aktualisieren. Die höhere Node-Anforderung ist mit Node 22.22.2 bereits erfüllt; Vite 6 und die eingesetzte Vue-Version bleiben unterstützt. Keine zusätzliche Laufzeitabhängigkeit einführen.
- Den isolierten Chrome-Start für Browserprüfungen und Logo-Export auf 30 Sekunden begrenzen, Startabbrüche mit Exitcode und begrenzter Fehlerausgabe melden und ausschließlich den Start einmal mit einem neuen Profil wiederholen. Eigene Prozesse und temporäre Profile bei Fehlern bereinigen; UI- und Sicherheitsprüfungen unverändert erhalten.
- Vor dem Dependency Review das Repository mit `actions/checkout` 5.1.0 (vollständiger Commit-Pin, ohne gespeicherte Zugangsdaten) auschecken, damit die lokale Prüfkonfiguration verfügbar ist. Den unbeabsichtigten Umbruch der Titelleiste bei 641–760 px mit breiteren Linux-Systemschriften durch kompaktere Aktionsbuttons und Abstände verhindern; die strengen Browserprüfungen erhalten.
- Logo und Oberfläche farblich an EOS Energiezentrale angleichen: Türkis/Gold im Tropfenlogo sowie identische Hell-/Dunkelwerte für Flächen, Texte, Rahmen, Aktionen und Statusanzeigen. Die Heatmap aus den EOS-Akzentfarben ableiten und transparente HA-Brand-Dateien neu exportieren.
- Den Menübutton mit drei horizontalen Strichen aus der Panel-Titelleiste entfernen. Das native HA-Seitenmenü weiterhin über die Wischgeste vom linken Rand öffnen.
- Die Titelleiste als feste Layoutzeile außerhalb des scrollbaren Seiteninhalts halten. Die Panelhöhe auch bei unbestimmten HA-Elternhöhen begrenzen; Übersicht und Einstellungen bis zum Seitenende mit Mausrad und Touchpad prüfen.
- Den nativen Scrollbereich in den Shadow-DOM-Inhalt des Panels verlegen, damit Mausrad und Zwei-Finger-Touchpad-Scrollen auch bei einem von HA begrenzten äußeren Custom-Element funktionieren. Feste Titelleiste, horizontales Scrollen der Heatmap und Zurücksetzen der Scrollposition beim Seitenwechsel erhalten; Browser-Regression mit echten Rad-Deltas in der CI ergänzen.
- Den Frontend-Start unter Home Assistant reparieren: den internen Controller als echtes privates Feld führen, damit HAs öffentliche `panel`-Metadaten ihn nicht überschreiben. Den Start mit HA-Eigenschaften, spätere Metadatenänderungen und das Beenden des Pollings als Regression prüfen.
- Den Python-Code in ein vollständig mit HACS ausgeliefertes `app/`-Paket mit API, Konfiguration, Modellen, Validierung, Fachservices, Speicher, Adaptern und Hilfsfunktionen aufteilen. HA-Einstiege, WebSocket-Namen, Speicherschlüssel erhalten; Tests nach Verantwortlichkeiten ordnen und isolierte Installationskopien prüfen.

- Das Frontend in `assets`, `components`, `composables`, `views`, `router` und `stores` mit `App.vue` als Wurzel aufteilen. HA-Verbindung/Polling und Dashboard-Zustand in eigene Module auslagern; Tests, SVG-Quellen, Styles und Imports entsprechend zuordnen. `vue-router` 4.6.4 exakt gepinnt für interne Memory-Routen ergänzen, ohne HAs äußere URL zu ändern. Router und Zustand pro Panel-Instanz isolieren und alte Antworten nach Wiederverbindung verwerfen.
- Die Manifest-Schlüssel nach `domain`, `name` und anschließend alphabetisch sortieren. Den festen `holidays==0.109`-Pin in Manifest und Python-Projekt durch `holidays>=0.108` ersetzen, damit die mit Home Assistant 2026.11.2 geteilte Version 0.108 zulässig ist und spätere HA-Updates nicht durch einen exakten Pin blockiert werden. Die Mindestversion 0.108 in der Testumgebung festlegen und die Feiertagsfunktionen damit prüfen.
- Das Projektlogo im Dashboard-Kopf und sein Motiv als natives HA-Seitenleisten-Icon anzeigen. Die Dashboard-Variante nach der Home-Assistant-Themeneinstellung wechseln; das kleine Icon-Modul unabhängig vom Öffnen des Panels laden und bei Entladen des letzten Eintrags aus den Frontend-Ressourcen entfernen.
- Ein eigenes Logo aus Wassertropfen und Zirkulationspfeilen im lokalen `brand/`-Verzeichnis mitliefern, damit Home Assistant ab 2026.3 das Symbol in Geräte- und Integrationsansichten statt des Platzhalters anzeigt. Transparente Varianten für helle/dunkle Ansichten und hochauflösende Displays bereitstellen; die native Logo-Rückfalllogik und Authentifizierung erhalten.
- Die DOM-Testumgebung `jsdom` von 25.0.1 auf 31.0.0 aktualisieren und damit das veraltete `whatwg-encoding` aus der npm-Installation entfernen. Den Entwicklungs-/Build-Prozess auf Node 22 ab 22.22.2, Node 24 ab 24.15.0 oder Node 26+ festlegen; die CI mit Node 22.22.2 prüfen. Lifecycle-Skripte über die Projektkonfiguration deaktiviert halten.
- Die Navigationsschleife zwischen Dashboard und Integrationsseite beheben: Das Seitenleistenpanel nicht als HA-Konfigurationspanel registrieren, damit das Zahnrad den nativen Optionsdialog öffnet. Den Konfigurationslink mit einem Hinweis auf das Zahnrad am gewünschten Eintrag versehen.
- Das gebaute Panel-Bundle und Stylesheet im Integrationsordner erzeugen und in den Release-Snapshot aufnehmen; Veröffentlichungen ohne gebaute Assets ablehnen. Panel und Beobachtungsabonnements bei Entladen oder fehlgeschlagener Einrichtung aufräumen.
- Den Integrationsstart mit echten Home-Assistant-Adaptern statt des `hass`-Platzhalters für Speicher und Pumpensteuerung korrigieren. Laufzeitdaten pro Konfigurationseintrag asynchron speichern und zeitzonenbehaftete Pumpenlaufzeiten wiederherstellen. Ungültige gespeicherte Zustände verhindern den Start; unbekannte Pumpenzustände verhindern Einschaltbefehle. Das konfigurierte Tageslimit übernehmen und Servicefehler ohne rohe Ausnahmedetails protokollieren.

### Breaking Changes

- Keine.

### Security

- In der ausschließlich für Tests verwendeten Kette `@vue/test-utils` 2.6.0 → `js-beautify` 2.0.3 die betroffenen Unterpakete über gezielte Overrides aktualisieren: `glob` 13.0.7 → 14.0.4 und `minimatch` 10.2.6 → 11.0.5. Damit die gemeldeten Befunde CVE-2026-118773 (Abbruch von Dateisystemdurchläufen) und CVE-2026-118764 (Musterverstärkung) beheben; Formatter- und EditorConfig-Kompatibilität prüfen. Versionen mit mindestens 14 Tagen Veröffentlichungsalter verwenden.
- Panel und Status-WebSocket auf authentifizierte HA-Administratoren begrenzen. HA-Authentifizierung verwenden und private Fehlerantworten weder im Dashboard noch in Browsermeldungen offenlegen.
- Bandit, pip-audit, npm audit und Hassfest werden in der CI ausgeführt.

## 0.1.0 - 2026-11-22

### Features

- Reine Fachlogik mit synthetischen fachlichen Tests.
