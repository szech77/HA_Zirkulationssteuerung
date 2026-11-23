# Projektlogo

Eigenes Symbol für die Warmwasser-Zirkulation: goldener Wassertropfen (`#FFCB62`) und
türkise Zirkulationspfeile (`#55C7CB`). Die Farben entsprechen EOS Energiezentrale.
Keine Markenbestandteile von Home Assistant.
Die SVG-Dateien unter `frontend/src/assets/images/` sind bearbeitbare Vektorquellen; sie gehören wie der übrige
Projektcode zur Apache-2.0-Lizenz dieses Repositorys.

Die Integration liefert transparente PNG-Exporte unter
`custom_components/warmwasser_zirkulation/brand/` aus: `icon.png` mit 256 × 256
und `icon@2x.png` mit 512 × 512 Pixeln sowie entsprechende `dark_`-Varianten.
Bei Änderungen beide SVG-Varianten bearbeiten und die PNG-Dateien in diesen
Größen mit transparenter Fläche exportieren. Diese Brand-Dateien werden als
Integrationsressourcen mit versioniert und gehören in jeden Release-Snapshot.

Da das Logo quadratisch ist, liegen gemäß HA-Konvention nur Icon-Dateien vor.
Home Assistant verwendet diese über seine native Rückfalllogik auch für
Logo-Anfragen. Der Zugriff bleibt durch HAs Brands-API authentifiziert.

Referenz: [Integration brands and images](https://contributors.home-assistant.io/core/integrations/brands/).


Das Panel bindet `assets/images/icon.svg` und `assets/images/dark_icon.svg` direkt in sein gebautes Bundle ein;
die HA-Themeneinstellung wählt die Variante. `assets/images/sidebar.svg` enthält die gefüllten
Konturen für `warmwasser:circulation`. Dieselben Pfade in
`custom_components/warmwasser_zirkulation/icons.js` aktuell halten. Das Menü nutzt
HAs native Iconfarben; die Tropfenform ist der sekundäre Pfad. Dieses kleine Modul
wird global geladen und benötigt weder die Vue-App noch Betriebsdaten.

## Gemeinsame Farbpalette mit EOS

Referenz ist [EOS Energiezentrale, Commit 7e1717b](https://github.com/szech77/HA_EOS_Akkodoktor_Energiezentrale/tree/7e1717b74c96156b95762fbcf98e815610ffe1d0):
[Markenfarben](https://github.com/szech77/HA_EOS_Akkodoktor_Energiezentrale/blob/7e1717b74c96156b95762fbcf98e815610ffe1d0/BRANDING.md),
[UI-Farbwerte](https://github.com/szech77/HA_EOS_Akkodoktor_Energiezentrale/blob/7e1717b74c96156b95762fbcf98e815610ffe1d0/custom_components/eos_energiezentrale/energy/web/style.css).
Die Werte liegen zentral in `frontend/src/assets/styles/theme.css`.

| Verwendung | Hell | Dunkel |
| --- | --- | --- |
| Hintergrund | `#EEF2F6` | `#10151D` |
| Karten / Titelleiste | `#FFFFFF` | `#181F2A` |
| Sekundäre Fläche | `#F4F7FB` | `#202938` |
| Text | `#162231` | `#EEF4FC` |
| Sekundärer Text | `#4F6075` | `#A7B6CA` |
| Rahmen | `#D4DEE9` | `#303C50` |
| Aktion / Information | `#185DA4` | `#8EC5FF` |
| Warnung | `#8A5A00` | `#FFD27A` |
| Fehler | `#B42318` | `#FF8A80` |

Das Tropfenmotiv bleibt eigenständig. Die Lichtreflexion verwendet den dunklen
bzw. hellen EOS-Vordergrund. Auch die primären Buttons übernehmen die zugehörige
EOS-Kontrastfarbe (`--on-accent`). Die integrationsspezifische Heatmap mischt
EOS-Akzent und sekundäre Fläche, statt eine zweite Farbpalette einzuführen.
Grün ist ausschließlich als semantische Erfolgsfarbe definiert; die dunklen
Grundflächen enthalten keinen Grünstich.
Die monochrome native HA-Seitenleiste übernimmt weiterhin HAs Themefarben.

PNG-Exporte reproduzierbar erzeugen (installiertes Chrome/Chromium, alternativ
`CHROME_BIN` setzen): im Ordner `frontend` den Befehl `npm run brand:render`
ausführen. Der Export verwendet nur die beiden lokalen SVG-Quellen und ein
isoliertes, temporäres Browserprofil; es werden keine Dateien heruntergeladen.
Danach `npm run build` ausführen und den vollständigen Integrationsordner kopieren.

## Gemeinsames Layout und Typografie

`frontend/src/assets/styles/identity.css` ist die zentrale Umsetzung der EOS-
Gestaltung: `system-ui` mit 15 px / 1,45, Flächenrahmen von 1 px, Kartenradius
12 px und identische fließende Seitenränder (`clamp(12px, 3vw, 28px)`).
Logo und Inhalt beginnen an derselben linken Kante. Die Wortmarke übernimmt
Schriftstärke, Laufweite und Unterzeile der EOS-Marke; das eigene Motiv bleibt.

Die Titelleiste misst bei einzeiliger Navigation 65 px. Ab 640 px und kleiner
wandert dieselbe Navigation mit Symbol und Beschriftung dauerhaft an den unteren
Rand; das Logo bleibt oben sichtbar. Auf Geräten bis 450 px ist das Logo 32 px
groß und die Titelleiste 57 px hoch; zwischen 451 und 640 px beträgt die
Leistenhöhe 63 px. Der untere Bereich berücksichtigt Safe-Area-
Insets. Beide Leisten stehen außerhalb des Scrollbereichs; weder Inhalt noch
Speicheraktionen werden verdeckt. Einstellungen und Entwürfe bleiben beim
Ändern der Fenstergröße erhalten. Die Einstellungsbereiche sind auf kleinen
Geräten wie bei EOS horizontal scrollbar.

## Heatmap

Die im Backend berechnete Quote `ratio` wird ohne Klassen oder Rundungsstufen
mit `color-mix` zwischen sekundärer Fläche (0 %) und EOS-Akzent (100 %) abgebildet.
Die Backend-Angabe `level` bleibt aus Kompatibilitätsgründen im API-Vertrag,
steuert die neue Darstellung aber nicht mehr. Fehlende Messbasis bleibt separat
schraffiert; vorläufige Messungen behalten ihre Schraffur und ihren Messwert.
Die Legende zeigt denselben kontinuierlichen Verlauf von 0 bis 100 %.

Freigaben verwenden EOS-Grün (`--ok`, hell `#277448`, dunkel `#75DBA0`) als 5 px
hohe Balken mit abgrenzender Kontur. Das unterscheidet sie auch bei 100 % Quote
von der Entnahmefarbe. Geplantes Vorwärmen bleibt ein eigener warmer Marker.
Die Farben betreffen nur die Anzeige; Freigaben, Quoten und Planung werden
weiterhin im Backend berechnet und auch im Monitoring angezeigt.
