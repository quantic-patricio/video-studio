#!/usr/bin/env bash
# Non-destructive sync helper for the studio-maintainer skill.
# Renders the CURRENT templates with THIS project's config into a temp tree and
# diffs the result against the project's live (materialized) runtime files.
# Output = what the current templates would change. Nothing in the project is
# touched. Read the diff to separate harness improvements (pull them) from the
# user's own project edits (preserve them).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
PS="$ROOT/.claude/skills/project-setup"
PY="$PS/.venv/bin/python"
CONFIG="$ROOT/.claude/studio-config.yaml"
TEMPLATES="$ROOT/.claude/templates"

[[ -x "$PY" ]]      || { echo "[template-diff] venv missing — run: bash $PS/scripts/setup.sh" >&2; exit 1; }
[[ -f "$CONFIG" ]]  || { echo "[template-diff] no studio-config.yaml — run /project-setup first" >&2; exit 1; }
[[ -d "$TEMPLATES" ]] || { echo "[template-diff] no .claude/templates dir" >&2; exit 1; }

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
mkdir -p "$STAGE/.claude"
cp -R "$TEMPLATES" "$STAGE/.claude/templates"
cp "$CONFIG" "$STAGE/.claude/studio-config.yaml"

"$PY" "$PS/scripts/materialize.py" --root "$STAGE" --config "$STAGE/.claude/studio-config.yaml" >/dev/null

any=0
while IFS= read -r rel; do
  [[ -z "$rel" ]] && continue
  live="$ROOT/$rel"
  staged="$STAGE/$rel"
  if [[ ! -f "$live" ]]; then
    echo "### $rel — not materialized in this project (template would create it)"
    echo
    any=1
    continue
  fi
  if ! diff -q "$live" "$staged" >/dev/null 2>&1; then
    echo "### $rel"
    diff -u "$live" "$staged" || true
    echo
    any=1
  fi
done < <("$PY" -c 'import json,sys; print("\n".join(json.load(open(sys.argv[1]))["paths"]))' "$TEMPLATES/manifest.json")

if [[ "$any" -eq 0 ]]; then
  echo "[template-diff] all materialized files match the current templates — nothing to sync."
fi
