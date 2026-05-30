#!/usr/bin/env bash
# Idempotent setup for the gemini-video skill.
# Creates a local venv inside the skill and installs pinned dependencies.
# Safe to call on every run: exits fast if already installed.

set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV_DIR="$SKILL_DIR/.venv"
REQ_FILE="$SKILL_DIR/requirements.txt"
STAMP_FILE="$VENV_DIR/.requirements.sha"
MIN_PY_MAJOR=3
MIN_PY_MINOR=10

REQ_HASH="$(shasum -a 256 "$REQ_FILE" | awk '{print $1}')"

if [[ -d "$VENV_DIR" && -f "$STAMP_FILE" && "$(cat "$STAMP_FILE")" == "$REQ_HASH" ]]; then
  echo "[setup] venv already provisioned (hash $REQ_HASH)"
  exit 0
fi

# Resolve a Python interpreter that satisfies the minimum version.
# Respect PYTHON_BIN if the user pinned one; otherwise probe known names.
PYTHON_BIN="${PYTHON_BIN:-}"
check_python_version() {
  "$1" -c "import sys; sys.exit(0 if sys.version_info >= ($MIN_PY_MAJOR, $MIN_PY_MINOR) else 1)" 2>/dev/null
}

if [[ -n "$PYTHON_BIN" ]]; then
  if ! command -v "$PYTHON_BIN" >/dev/null 2>&1 || ! check_python_version "$PYTHON_BIN"; then
    echo "[setup] error: PYTHON_BIN='$PYTHON_BIN' is missing or below ${MIN_PY_MAJOR}.${MIN_PY_MINOR}" >&2
    exit 1
  fi
else
  for candidate in python3.12 python3.11 python3.13 python3.10 python3; do
    if command -v "$candidate" >/dev/null 2>&1 && check_python_version "$candidate"; then
      PYTHON_BIN="$candidate"
      break
    fi
  done
fi

if [[ -z "$PYTHON_BIN" ]]; then
  echo "[setup] error: no python >= ${MIN_PY_MAJOR}.${MIN_PY_MINOR} found on PATH" >&2
  echo "[setup] install one (e.g. 'brew install python@3.12') or set PYTHON_BIN" >&2
  exit 1
fi

# If an existing venv was built with an incompatible interpreter, rebuild it.
if [[ -d "$VENV_DIR" ]] && ! check_python_version "$VENV_DIR/bin/python"; then
  echo "[setup] existing venv uses an unsupported python; rebuilding"
  rm -rf "$VENV_DIR"
fi

if [[ ! -d "$VENV_DIR" ]]; then
  echo "[setup] creating venv at $VENV_DIR using $PYTHON_BIN ($($PYTHON_BIN --version))"
  "$PYTHON_BIN" -m venv "$VENV_DIR"
fi

echo "[setup] installing pinned dependencies"
"$VENV_DIR/bin/pip" install --quiet --upgrade pip
"$VENV_DIR/bin/pip" install --quiet -r "$REQ_FILE"

echo "$REQ_HASH" > "$STAMP_FILE"
echo "[setup] done"
