"""Plan and publish approved beta or stable GitHub releases."""

import argparse
from datetime import date
import json
import os
from pathlib import Path
import re
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "custom_components" / "warmwasser_zirkulation" / "manifest.json"
CHANGELOG = ROOT / "CHANGELOG.md"
CATEGORIES = ("Features", "Bugfixes", "Breaking Changes", "Security")
VERSION_RE = re.compile(r"^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$")
BRANCH_RE = re.compile(r"^(?:main|(?:feature|bug|bugfix)/[^\s`\x00-\x1f]{1,240})$")


class GitHub:
    """Small GitHub REST client that never prints API responses."""

    def __init__(self, repository, token):
        if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository):
            raise ValueError("Invalid repository")
        if not token:
            raise ValueError("Missing GitHub token")
        self.base = f"https://api.github.com/repos/{repository}"
        self.token = token

    def request(self, path, method="GET", payload=None):
        body = None if payload is None else json.dumps(payload).encode("utf-8")
        request = Request(
            self.base + path,
            data=body,
            method=method,
            headers={
                "Accept": "application/vnd.github+json",
                "Authorization": f"Bearer {self.token}",
                "User-Agent": "ha-warmwasser-zirkulation-release",
                "X-GitHub-Api-Version": "2022-11-28",
                **({"Content-Type": "application/json"} if body else {}),
            },
        )
        try:
            with urlopen(request, timeout=30) as response:  # nosec B310
                raw = response.read()
        except HTTPError as error:
            if error.code == 404:
                return None
            raise ValueError(f"GitHub request failed with HTTP {error.code}") from error
        return json.loads(raw.decode("utf-8")) if raw else {}


def changelog_sections(text):
    """Read the first, structured release draft from CHANGELOG.md."""
    match = re.search(r"^## New Version\s*$", text, re.MULTILINE)
    if not match or text[: match.start()].count("## New Version"):
        raise ValueError("CHANGELOG.md needs exactly one first 'New Version' section")
    end_match = re.search(r"^## \S.*$", text[match.end() :], re.MULTILINE)
    end = match.end() + end_match.start() if end_match else len(text)
    body = text[match.end() : end]
    headings = list(re.finditer(r"^### (.+?)\s*$", body, re.MULTILINE))
    if [item.group(1).strip() for item in headings] != list(CATEGORIES):
        raise ValueError("New Version needs Features, Bugfixes, Breaking Changes and Security")
    result = {}
    for index, heading in enumerate(headings):
        section_end = headings[index + 1].start() if index + 1 < len(headings) else len(body)
        entries = [line.strip() for line in body[heading.end() : section_end].splitlines() if line.strip()]
        if not entries or any(not line.startswith("- ") for line in entries):
            raise ValueError("Changelog sections must contain bullet entries")
        result[heading.group(1).strip()] = [line for line in entries if line not in ("- Keine.", "- None.")]
    return result, end


def render_notes(sections):
    return "\n\n".join(
        f"### {category}\n\n{chr(10).join(sections[category]) or '- Keine.'}"
        for category in CATEGORIES
    )


def next_version(base, sections):
    match = VERSION_RE.fullmatch(base)
    if not match:
        raise ValueError("manifest.json contains an invalid base version")
    major, minor, patch = map(int, match.groups())
    if sections["Breaking Changes"]:
        return f"{major + 1}.0.0"
    if sections["Features"]:
        return f"{major}.{minor + 1}.0"
    return f"{major}.{minor}.{patch + 1}"


def latest_stable_version(github):
    if github is None:
        return None
    releases = github.request("/releases?per_page=100") or []
    versions = []
    for release in releases:
        tag = release.get("tag_name", "") if isinstance(release, dict) else ""
        if release.get("prerelease") or release.get("draft") or not tag.startswith("v"):
            continue
        version = tag[1:]
        if VERSION_RE.fullmatch(version):
            versions.append(version)
    return max(versions, key=lambda value: tuple(map(int, value.split("."))), default=None)


def build_plan(channel, beta_number, branch, github=None):
    if channel not in ("stable", "beta") or not BRANCH_RE.fullmatch(branch):
        raise ValueError("Invalid release channel or branch")
    if channel == "stable" and branch != "main":
        raise ValueError("Stable releases may only originate from main")
    if channel == "beta" and not re.fullmatch(r"[1-9][0-9]{0,24}", beta_number or ""):
        raise ValueError("Beta releases need the numeric GitHub run ID")
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    sections, _ = changelog_sections(CHANGELOG.read_text(encoding="utf-8"))
    if not any(sections.values()):
        raise ValueError("New Version contains no release changes")
    base_version = latest_stable_version(github) or manifest["version"]
    version = next_version(base_version, sections)
    if channel == "beta":
        version += f"b{beta_number}"
    return version, sections


def append_output(name, value):
    output = os.environ.get(name)
    if output:
        with Path(output).open("a", encoding="utf-8") as handle:
            handle.write(f"{name.lower()}={value}\n")


def plan(args):
    github = GitHub(args.repository, os.environ.get("GH_TOKEN", "")) if args.repository and os.environ.get("GH_TOKEN") else None
    version, sections = build_plan(args.channel, args.beta_number, args.branch, github)
    notes = render_notes(sections)
    print(f"Release plan: {version} ({args.channel})")
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with Path(summary).open("a", encoding="utf-8") as handle:
            handle.write(f"### Release plan\n\n- Version: `{version}`\n- Kanal: `{args.channel}`\n\n{notes}\n")



def frontend_files(directory=None):
    """Only ship the two built panel assets; never publish an empty dashboard."""
    directory = directory or MANIFEST.parent / 'web'
    result = {}
    for name in ('panel.js', 'panel.css'):
        path = directory / name
        if path.is_symlink() or not path.is_file() or path.stat().st_size == 0:
            raise ValueError('Build the frontend before publishing')
        result[f'custom_components/warmwasser_zirkulation/web/{name}'] = path.read_text(encoding='utf-8')
    return result


def publish(args):
    assets = frontend_files()
    version, sections = build_plan(args.channel, args.beta_number, args.branch, GitHub(args.repository, os.environ.get("GH_TOKEN", "")))
    tag = f"v{version}"
    github = GitHub(args.repository, os.environ.get("GH_TOKEN", ""))
    if github.request(f"/git/ref/tags/{quote(tag, safe='')}"):
        print(f"Release {tag} already exists")
        return
    source = args.commit
    if not re.fullmatch(r"[0-9a-f]{40}", source):
        raise ValueError("Release needs a full source commit SHA")
    branch_ref = github.request(f"/git/ref/heads/{quote(args.branch, safe='/')}")
    if not branch_ref or branch_ref.get("object", {}).get("sha") != source:
        raise ValueError("Branch changed after approval; refusing to publish")
    source_commit = github.request(f"/git/commits/{source}")
    tree_sha = source_commit.get("tree", {}).get("sha") if source_commit else None
    if not tree_sha:
        raise ValueError("GitHub did not return the source tree")

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    manifest["version"] = version
    manifest_blob = github.request("/git/blobs", "POST", {
        "content": json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        "encoding": "utf-8",
    })
    changelog_text = CHANGELOG.read_text(encoding="utf-8")
    _, draft_end = changelog_sections(changelog_text)
    notes = render_notes(sections)
    history = changelog_text[draft_end:].lstrip("\r\n")
    release_changelog = f"# Changelog\n\n## {version} - {date.today().isoformat()}\n\n{notes}\n\n{history}"
    changelog_blob = github.request("/git/blobs", "POST", {
        "content": release_changelog,
        "encoding": "utf-8",
    })
    asset_tree = []
    for asset_path, content in assets.items():
        blob = github.request('/git/blobs', 'POST', {'content': content, 'encoding': 'utf-8'})
        asset_tree.append({'path': asset_path, 'mode': '100644', 'type': 'blob', 'sha': blob['sha']})
    tree = github.request("/git/trees", "POST", {
        "base_tree": tree_sha,
        "tree": asset_tree + [
            {"path": str(MANIFEST.relative_to(ROOT)).replace("\\", "/"), "mode": "100644", "type": "blob", "sha": manifest_blob["sha"]},
            {"path": "CHANGELOG.md", "mode": "100644", "type": "blob", "sha": changelog_blob["sha"]},
        ],
    })
    commit = github.request("/git/commits", "POST", {
        "message": f"Release {tag}",
        "tree": tree["sha"],
        "parents": [source],
    })
    target = commit.get("sha") if commit else None
    if not target:
        raise ValueError("GitHub did not create the release commit")
    # Keep the source branch unchanged. The generated commit is an immutable
    # release snapshot and is reachable through the release tag only.
    github.request("/git/refs", "POST", {"ref": f"refs/tags/{tag}", "sha": target})
    github.request("/releases", "POST", {
        "tag_name": tag,
        "target_commitish": target,
        "name": f"Warmwasser-Zirkulation {tag}",
        "body": notes,
        "prerelease": args.channel == "beta",
        "draft": False,
    })
    print(f"Published {tag}")


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("operation", choices=("plan", "publish"))
    parser.add_argument("--repository", required=False, default=os.environ.get("REPOSITORY", ""))
    parser.add_argument("--commit", default=os.environ.get("COMMIT", ""))
    parser.add_argument("--channel", required=True, choices=("stable", "beta"))
    parser.add_argument("--beta-number", default="")
    parser.add_argument("--branch", default=os.environ.get("BRANCH", "main"))
    args = parser.parse_args(argv)
    try:
        if args.operation == "plan":
            plan(args)
        else:
            if not args.repository:
                parser.error("publish requires --repository")
            publish(args)
        return 0
    except (OSError, ValueError, KeyError, TypeError, HTTPError, json.JSONDecodeError) as error:
        print(f"Release operation failed: {type(error).__name__}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
