---
name: gemini-video
description: |
  Analyze a public YouTube video with Gemini's multimodal API — a paid,
  opt-in "sensor" that actually WATCHES the video (delivery, cadence, visual
  style, editing rhythm, on-screen text, audio↔image sync), going beyond what a
  text transcript can capture. Gemini answers a structured brief; it never
  authors creative content. Used by narration-style (richer voice profiling)
  and by research mining (intent-directed video analysis). Requires
  integrations.gemini.enabled in studio-config.yaml and a GEMINI_API_KEY env var.
---

# Gemini Video — Multimodal Sensor (paid, opt-in)

Gemini is the only tool in this studio that can **watch** a video. It is a
**sensor**, not an author: Claude composes a structured brief, Gemini answers it,
Claude synthesizes the result into the project. Never ask Gemini to write a
script, spec, or narration — only to *analyze* what it observes.

## Preconditions — check ALL before any paid call

1. **Enabled**: `.claude/studio-config.yaml` → `integrations.gemini.enabled: true`.
   If false/absent → tell the user Gemini mode is off and fall back to the
   transcript path (see narration-style). Do NOT proceed.
2. **API key**: `GEMINI_API_KEY` is available — either exported in the
   environment or present in the project-local `.env` (gitignored). An exported
   var wins over `.env`.
   ```bash
   { [ -n "$GEMINI_API_KEY" ] || { [ -f .env ] && grep -Eq '^GEMINI_API_KEY=.+' .env; }; } \
     && echo OK || echo MISSING
   ```
   If MISSING → run `bash .claude/skills/gemini-video/scripts/setup.sh` (it
   scaffolds `.env` from `.env.example`), tell the user: "Pegá tu `GEMINI_API_KEY`
   en `./.env` (es de pago y no se commitea) y reintentá." Stop. The analyzer
   loads `.env` itself, so no `export` is needed.
3. **Public video**: Gemini only accepts public videos (not private/unlisted).

## Cost gate — confirm before spending

Before invoking the script, tell the user exactly what will run and ask to
proceed, e.g.:

> "Esto hará **N** llamada(s) paga(s) a Gemini (modelo `<model>`) sobre estos
> videos: <list>. El costo escala con la duración. ¿Procedo?"

If the videos are long, offer to clip a representative segment (`--start/--end`)
to control cost. **Never make a paid call without this confirmation.**

## Inputs

- **url** — one public YouTube URL per call.
- **brief** — the structured analysis questions Claude composed from the user's
  intent. Write it to a temp file and pass `--prompt-file` (briefs are long).
- **model** — from `integrations.gemini.model` (default `gemini-2.5-flash`).
- **schema** *(optional)* — a JSON Schema file to force structured JSON output.
  Strongly recommended so the result is machine-usable.
- **start/end** *(optional)* — clip offsets like `"90s"`, `"300s"` for long videos.

## Execution

1. Ensure the venv exists (idempotent):
   ```bash
   bash .claude/skills/gemini-video/scripts/setup.sh
   ```
2. Run the analyzer (key is read from the environment, never passed on argv):
   ```bash
   .claude/skills/gemini-video/.venv/bin/python \
     .claude/skills/gemini-video/scripts/analyze_video.py \
     --url "<URL>" \
     --prompt-file "<brief_path>" \
     --model "<model>" \
     [--schema-file "<schema_path>"] [--start "<off>" --end "<off>"]
   ```
3. The script prints a single JSON object: `{"ok": true, "analysis": ...}` or
   `{"ok": false, "error": ...}`. On `ok: false`, surface the error verbatim.

## Caching — do not re-pay

Save each successful result under the **caller's** reference directory
(`research/references/<slug>.gemini.json` for narration; `research/notes/` or
`research/transcripts/` for mining). Before calling, check whether a cached
result for that URL already exists and reuse it. The `.gemini.json` files are
gitignored alongside the venv.

## Division of labor (do not cross)

- **Claude** discovers the user's intent, composes the brief and schema,
  synthesizes the answer into project artifacts, and writes all creative content.
- **Gemini** only observes the video and answers the brief.
- **Haiku** handles the cheap text-only fallback when Gemini is disabled.

## Notes

- The YouTube-URL feature is in preview; pricing and model names may change.
  Keep the model in `integrations.gemini.model` so it's easy to update.
- Free tier caps total YouTube minutes/day; paid tier removes the length limit.
- The venv (`.venv/`) and cached `*.gemini.json` results are gitignored.
