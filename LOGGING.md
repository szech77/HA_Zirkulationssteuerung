# Logging und Diagnose

Die Integration verwendet das Python-Logging-Modul. Logging unterstützt Diagnose und
Monitoring, darf aber weder zur Steuerung noch zur Speicherung sensibler Daten dienen.

## Regeln

- Für normale Ereignisse `INFO`, für erwartbare Einschränkungen `WARNING` und für
  technische Fehler `ERROR` verwenden.
- Ereignisse mit maschinenlesbaren Zusatzdaten versehen, zum Beispiel `reason`,
  `pump_entity` und `daily_starts`.
- Fehlermeldungen sollen die Aktion, den sicheren Fallback und eine geeignete Ursache
  nennen.
- Automatische Starts bei unsicherem Zustand mit einem klaren Pausierungsgrund loggen.
- Wiederholte Polling- oder Diagnoseereignisse nicht unnötig auf `INFO` loggen.

Beispiel:

```python
_LOGGER.warning(
    "Automatic pump start paused",
    extra={"reason": "stale_flow_value", "pump_entity": pump_entity},
)
```

## Nicht loggen

Nie loggen:

- Tokens, Passwörter, API-Schlüssel oder Session-Daten
- vollständige Home-Assistant-, InfluxDB- oder Frontend-Payloads
- unnötige Temperaturverläufe oder personenbezogene Informationen
- private URLs, wenn für die Diagnose nur ein Fehlercode genügt

Logs müssen auch dann sicher bleiben, wenn Eingaben fehlerhaft oder von externen
Quellen manipuliert sind. Werte aus Home Assistant, InfluxDB und dem Frontend werden
vor Verwendung validiert.


Die Dashboard-Konfiguration protokolliert `control_settings_saved` ohne Payload;
Speicherfehler verwenden `settings_save_failed`. Zustandswechsel der Steuerung
tragen dieselben Gründe wie Dashboard und Betriebssensor, darunter `outside_schedule`,
`waiting_for_demand`, `daily_limit_reached`, `calendar_unavailable` und
`pump_unreachable`. Unveränderte Steuerzustände werden dedupliziert.
Adapterfehler verwenden `control_failed`, die Wiederaufnahme `control_restored`.
