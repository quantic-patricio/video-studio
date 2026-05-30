#!/usr/bin/env python3
"""Materialize Video Studio templates into their runtime locations.

Single deterministic renderer used by:
  - /project-setup        — initial materialization after the wizard.
  - studio-maintainer     — re-sync runtime files after a template changes.

It reads `.claude/studio-config.yaml` + `.claude/templates/manifest.json`,
substitutes every `{{dotted.config.path}}` placeholder in each listed template
with the matching value from the config, and writes the result to the runtime
path. Placeholders are plain dotted paths into the config tree, so adding a new
templated value never requires touching this script — only the template and the
config.

Lists render comma-joined; None/empty render as "". If any placeholder has no
matching config value, the run aborts BEFORE writing anything and reports the
missing keys (fail-loud, never half-materialize).
"""
import argparse
import json
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("[materialize] PyYAML is not installed. Run this skill's scripts/setup.sh first.")

PLACEHOLDER = re.compile(r"\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}")


def flatten(obj, prefix=""):
    """Flatten a nested config dict into {dotted.key: rendered_string}."""
    out = {}
    if isinstance(obj, dict):
        for key, value in obj.items():
            out.update(flatten(value, f"{prefix}{key}."))
    elif isinstance(obj, list):
        out[prefix[:-1]] = ", ".join(str(x) for x in obj)
    else:
        out[prefix[:-1]] = "" if obj is None else str(obj)
    return out


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=None, help="Project root (default: inferred from script location).")
    parser.add_argument("--config", default=None, help="Path to studio-config.yaml (default: <root>/.claude/studio-config.yaml).")
    parser.add_argument("--dry-run", action="store_true", help="Validate and report without writing files.")
    args = parser.parse_args()

    root = Path(args.root).resolve() if args.root else Path(__file__).resolve().parents[4]
    templates_dir = root / ".claude" / "templates"
    manifest_path = templates_dir / "manifest.json"
    config_path = Path(args.config).resolve() if args.config else root / ".claude" / "studio-config.yaml"

    if not config_path.exists():
        sys.exit(f"[materialize] config not found: {config_path}\nRun /project-setup first.")
    if not manifest_path.exists():
        sys.exit(f"[materialize] manifest not found: {manifest_path}")

    config = yaml.safe_load(config_path.read_text(encoding="utf-8")) or {}
    values = flatten(config)
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    paths = manifest.get("paths", [])

    # First pass: load every template and validate that all placeholders resolve.
    rendered = {}
    missing = {}  # placeholder key -> set of files using it
    for rel in paths:
        tpl = templates_dir / rel
        if not tpl.exists():
            sys.exit(f"[materialize] template missing: {tpl}")
        text = tpl.read_text(encoding="utf-8")
        for match in PLACEHOLDER.finditer(text):
            key = match.group(1)
            if key not in values:
                missing.setdefault(key, set()).add(rel)
        rendered[rel] = text

    if missing:
        lines = ["[materialize] missing config values for these placeholders:"]
        for key in sorted(missing):
            lines.append(f"  - {{{{{key}}}}}  (used in: {', '.join(sorted(missing[key]))})")
        lines.append("Add them to the config and re-run. Nothing was written.")
        sys.exit("\n".join(lines))

    # Second pass: substitute and write (lambda avoids backref interpretation).
    written = []
    for rel, text in rendered.items():
        out = PLACEHOLDER.sub(lambda m: values[m.group(1)], text)
        dest = root / rel
        if args.dry_run:
            written.append(f"[dry-run] would write {rel}")
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(out, encoding="utf-8")
        written.append(f"[materialize] wrote {rel}")

    print("\n".join(written))
    verb = "would materialize" if args.dry_run else "materialized"
    print(f"[materialize] {verb} {len(rendered)} file(s) from templates.")


if __name__ == "__main__":
    main()
