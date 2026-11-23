from tools.security_reports import bandit_to_sarif, npm_audit_to_sarif, pip_audit_to_sarif


def test_bandit_findings_are_mapped_to_sarif_locations() -> None:
    report = {"results": [{"test_id": "B101", "issue_text": "assert used", "filename": "a.py", "line_number": 7, "issue_severity": "LOW"}]}

    result = bandit_to_sarif(report)

    finding = result["runs"][0]["results"][0]
    assert finding["ruleId"] == "B101"
    assert finding["locations"][0]["physicalLocation"]["region"]["startLine"] == 7


def test_pip_audit_finding_contains_upgrade_information() -> None:
    report = {"dependencies": [{"name": "demo", "version": "1.0", "vulns": [{"id": "PYSEC-1", "fix_versions": ["1.1"], "description": "bad"}]}]}

    result = pip_audit_to_sarif(report)

    assert "Upgrade to: 1.1" in result["runs"][0]["results"][0]["message"]["text"]


def test_npm_audit_maps_advisory_severity() -> None:
    report = {"vulnerabilities": {"demo": {"severity": "high", "via": [{"source": 42, "title": "bad", "range": "<2.0"}]}}}

    result = npm_audit_to_sarif(report)

    finding = result["runs"][0]["results"][0]
    assert finding["level"] == "error"
    assert finding["locations"][0]["physicalLocation"]["artifactLocation"]["uri"] == "frontend/package-lock.json"
