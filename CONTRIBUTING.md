# Mitwirken

Vielen Dank für Beiträge zur Warmwasser-Zirkulationssteuerung. Änderungen sollen
klein, nachvollziehbar und auf die sichere Betriebsweise der Integration ausgerichtet
sein.

## Entwicklungsumgebung

1. Repository klonen und den Branch `feature/initial` für die initiale Umsetzung
   verwenden.
2. Die projektlokale Umgebung `.venv\Scripts\python.exe` auswählen.
3. Test- und Security-Abhängigkeiten installieren:

   ```powershell
   .venv\Scripts\python.exe -m pip install -e ".[test]"
   .venv\Scripts\python.exe -m pip install -e ".[security]"
   cd frontend
   npm ci --ignore-scripts --no-audit --no-fund
   ```

## Änderungen entwickeln

- Fachlogik gehört in `domain.py` und bleibt frei von Home-Assistant-Importen.
- Home-Assistant-Adapter bleiben dünn; Fehler werden fail-closed behandelt.
- Vue-Komponenten müssen zugänglich bleiben und sichtbare Zustände für Monitoring,
  Pause, Fehler und Aktivität unterscheiden.
- Keine Secrets, privaten URLs, echten Entity-IDs oder vollständigen externen Payloads
  in Quelltext, Tests oder Logs aufnehmen.

## Tests vor einem Pull Request

```powershell
.venv\Scripts\python.exe -m pytest -q
.venv\Scripts\python.exe -m pytest -q --cov=custom_components.warmwasser_zirkulation --cov-branch --cov-report=term-missing
.venv\Scripts\python.exe -m compileall -q custom_components tests
.venv\Scripts\python.exe -m bandit -r custom_components -ll
.venv\Scripts\python.exe -m pip_audit --skip-editable

cd frontend
npm test
npm run test:coverage
npm run audit
npm run build
```

Neue Fachlogik braucht Tests für Normalfall, Grenzwerte und Fehlerfälle. Neue oder
geänderte Vue-Komponenten brauchen Vitest- und Vue-Test-Utils-Tests.

## Pull Requests

- Titel und Beschreibung sollen die fachliche Wirkung und mögliche Sicherheitsfolgen
  erklären.
- Changelog, Dokumentation und Tests bei Bedarf im selben Pull Request aktualisieren.
- Commits thematisch klein halten.
- Keine produktiven Systeme aktivieren und nicht automatisch pushen.
