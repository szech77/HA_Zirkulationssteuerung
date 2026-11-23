# Projektlogo

Eigenes Symbol für die Warmwasser-Zirkulation: orangefarbener Wassertropfen und
petrolfarbene Zirkulationspfeile. Keine Markenbestandteile von Home Assistant.
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
