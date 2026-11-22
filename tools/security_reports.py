"""Convert Bandit, pip-audit and npm audit JSON reports to SARIF 2.1.0."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


SARIF_VERSION = "2.1.0"


def _message(text: str) -> dict[str, str]:
    return {"text": text}


def _level(severity: str) -> str:
    return {"critical": "error", "high": "error", "medium": "warning", "moderate": "warning", "low": "note"}.get(severity.casefold(), "warning")


def _rule(tool: str, rule_id: str, description: str) -> dict[str, Any]:
    return {
        "id": rule_id,
        "name": rule_id,
        "shortDescription": _message(description),
        "helpUri": f"https://github.com/{tool}",
    }


def _run(tool: str, rules: list[dict[str, Any]], results: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "tool": {
            "driver": {
                "name": tool,
                "informationUri": f"https://github.com/{tool}",
                "rules": rules,
            }
        },
        "results": results,
    }


def _location(path: str, line: int | None = None) -> dict[str, Any]:
    region = {"startLine": line} if line and line > 0 else {}
    return {"physicalLocation": {"artifactLocation": {"uri": path}, "region": region}}


def bandit_to_sarif(report: dict[str, Any]) -> dict[str, Any]:
    rules: dict[str, dict[str, Any]] = {}
    results: list[dict[str, Any]] = []
    for finding in report.get("results", []):
        rule_id = str(finding.get("test_id") or "bandit-finding")
        text = str(finding.get("issue_text") or "Bandit finding")
        rules.setdefault(rule_id, _rule("PyCQA/bandit", rule_id, text))
        result = {
            "ruleId": rule_id,
            "level": _level(str(finding.get("issue_severity", "warning"))),
            "message": _message(text),
            "locations": [_location(str(finding.get("filename", "")), finding.get("line_number"))],
        }
        results.append(result)
    return {"version": SARIF_VERSION, "$schema": "https://json.schemastore.org/sarif-2.1.0.json", "runs": [_run("PyCQA/bandit", list(rules.values()), results)]}


def pip_audit_to_sarif(report: dict[str, Any]) -> dict[str, Any]:
    rules: dict[str, dict[str, Any]] = {}
    results: list[dict[str, Any]] = []
    for dependency in report.get("dependencies", []):
        name = str(dependency.get("name", "unknown"))
        version = str(dependency.get("version", "unknown"))
        for vulnerability in dependency.get("vulns", []):
            rule_id = str(vulnerability.get("id", "pip-audit-finding"))
            description = str(vulnerability.get("description") or f"Vulnerability in {name}")
            rules.setdefault(rule_id, _rule("pypa/pip-audit", rule_id, description))
            fixes = vulnerability.get("fix_versions") or []
            fix_text = f" Upgrade to: {', '.join(map(str, fixes))}." if fixes else ""
            results.append({
                "ruleId": rule_id,
                "level": "error",
                "message": _message(f"{name} {version}: {description}{fix_text}"),
                "locations": [_location("pyproject.toml")],
            })
    return {"version": SARIF_VERSION, "$schema": "https://json.schemastore.org/sarif-2.1.0.json", "runs": [_run("pypa/pip-audit", list(rules.values()), results)]}


def npm_audit_to_sarif(report: dict[str, Any]) -> dict[str, Any]:
    rules: dict[str, dict[str, Any]] = {}
    results: list[dict[str, Any]] = []
    for package, vulnerability in (report.get("vulnerabilities") or {}).items():
        for advisory in vulnerability.get("via", []):
            if not isinstance(advisory, dict):
                continue
            rule_id = str(advisory.get("url") or advisory.get("source") or f"npm-{package}")
            description = str(advisory.get("title") or f"Vulnerability in {package}")
            rules.setdefault(rule_id, _rule("npm/cli", rule_id, description))
            severity = str(advisory.get("severity") or vulnerability.get("severity") or "warning")
            results.append({
                "ruleId": rule_id,
                "level": _level(severity),
                "message": _message(f"{package}: {description}. Affected range: {advisory.get('range', 'unknown')}"),
                "locations": [_location("frontend/package-lock.json")],
            })
    return {"version": SARIF_VERSION, "$schema": "https://json.schemastore.org/sarif-2.1.0.json", "runs": [_run("npm/cli", list(rules.values()), results)]}


def convert(kind: str, source: Path, destination: Path) -> None:
    report = json.loads(source.read_text(encoding="utf-8"))
    converters = {"bandit": bandit_to_sarif, "pip-audit": pip_audit_to_sarif, "npm-audit": npm_audit_to_sarif}
    destination.write_text(json.dumps(converters[kind](report), indent=2) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("kind", choices=("bandit", "pip-audit", "npm-audit"))
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    convert(args.kind, args.source, args.destination)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
