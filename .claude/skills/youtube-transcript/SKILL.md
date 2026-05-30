---
name: youtube-transcript
description: Fetch the transcript of a YouTube video using yt-dlp and render it as a structured markdown file (metadata + summary + TOC + chapter sections). Delegates all work to a Haiku agent to minimize token cost.
---

# YouTube Transcript → Markdown (delegated to Haiku)

This skill **delegates all work to a Haiku subagent**. The calling model (Opus)
should only validate inputs and spawn the agent — nothing else.

## CRITICAL — Single invocation guard

**This skill must be invoked exactly ONCE per video per conversation.** Before
spawning the Haiku agent, run this check (replace `<DEST_DIR>` with the
destination directory — see Inputs; default `research/transcripts`):

```bash
grep -rl "video_id: <VIDEO_ID>" <DEST_DIR>/*.md 2>/dev/null
```

- If a file is found → the transcript **already exists**. Do NOT spawn the agent.
  Tell the user: "La transcripción ya existe en `<path>`" and stop.
- If no file is found → proceed with the agent spawn below.

Also: if you have already spawned a Haiku agent for this video in this conversation
(check your prior tool calls), do NOT spawn another one. Report that the work is
already in progress or done.

## Inputs

The user provides one of:

- A full YouTube URL (`https://www.youtube.com/watch?v=...`, `youtu.be/...`, etc.).
- A bare YouTube video ID.

If the user did not provide one, ask for it before proceeding.

Extract the video ID from the URL before the idempotency check above:
- `youtube.com/watch?v=XXXXXXXXXXX` → `XXXXXXXXXXX`
- `youtu.be/XXXXXXXXXXX` → `XXXXXXXXXXX`
- Bare ID → use as-is.

Optional: language preference (default `es,en`). **Always ask the user what language
the video is in** before launching — passing the wrong default wastes API calls.

Optional: **destination directory** (relative to project root, default
`research/transcripts`). Callers that fetch non-episode material — e.g. the
`narration-style` skill fetching reference videos — pass `research/references`
instead. The directory must already be a sibling under `research/`; the agent
creates it if missing. Use the same directory in the idempotency check above.

## Execution

**Do not run the workflow yourself.** Spawn a single Agent with `model: "haiku"` and
pass it the prompt below, replacing the four placeholders:

- `{{VIDEO_URL}}` — the URL or ID the user gave.
- `{{LANG}}` — the language code(s) (e.g. `es`, `en`, `es,en`).
- `{{PROJECT_ROOT}}` — the absolute path to this project's root directory.
- `{{DEST_DIR}}` — destination directory relative to project root (default
  `research/transcripts`; `research/references` for reference material).

Use `description: "youtube-transcript fetch"` for the agent.

````
HAIKU_AGENT_PROMPT (copy verbatim, only replace placeholders):

You are a transcript extraction worker. Do the following steps in order.
Do NOT ask questions — just execute.

PROJECT_ROOT = {{PROJECT_ROOT}}
VIDEO_URL    = {{VIDEO_URL}}
LANG         = {{LANG}}
DEST_DIR     = {{DEST_DIR}}

### Step 0 — Idempotency check

Run:
```
grep -rl "video_id:" ${PROJECT_ROOT}/${DEST_DIR}/*.md 2>/dev/null | head -5
```

Then check if any of those files contain a `video_id` matching this video.
If a matching file already exists, reply with:
```
ALREADY_EXISTS: <relative_path>
```
and stop — do NOT re-download or overwrite.

### Step 1 — Setup (idempotent)

Run:
```
bash ${PROJECT_ROOT}/.claude/skills/youtube-transcript/scripts/setup.sh
```

If it fails because python3 is missing, report the error and stop.

### Step 2 — Fetch transcript

Run:
```
mkdir -p ${PROJECT_ROOT}/${DEST_DIR} && \
${PROJECT_ROOT}/.claude/skills/youtube-transcript/.venv/bin/python \
  ${PROJECT_ROOT}/.claude/skills/youtube-transcript/scripts/fetch_transcript.py \
  "${VIDEO_URL}" \
  "${PROJECT_ROOT}/${DEST_DIR}" \
  --lang ${LANG}
```

The script prints JSON to stdout. Save it to a temp file at
`${PROJECT_ROOT}/${DEST_DIR}/.cache/payload.json` so you can read it
without re-running yt-dlp.

If the script fails, report the error verbatim and stop.

### Step 3 — Read the JSON payload

Read the payload JSON file. It contains:
- `metadata`: id, title, uploader, channel, upload_date, duration, webpage_url, description, tags, channel_url, duration_string.
- `chapters`: array of {start_time, end_time, title} (may be empty).
- `subtitle`: {language, kind} or null.
- `transcript`: array of {start, end, text}.

If `subtitle` is null and `transcript` is empty, report that the video has no
captions in the requested language(s) and stop.

### Step 4 — Build the markdown file

Generate `${PROJECT_ROOT}/${DEST_DIR}/<slug>.md` where `<slug>` is the
video title in kebab-case (ASCII, lowercase, no punctuation, max ~80 chars).
If a file with that name already exists, append `-<video_id>`.

Use this exact template:

```markdown
---
title: "<metadata.title>"
video_id: <metadata.id>
url: <metadata.webpage_url>
channel: <metadata.channel>
uploader: <metadata.uploader>
upload_date: <YYYY-MM-DD from upload_date>
duration: <metadata.duration_string>
language: <subtitle.language>
captions: <subtitle.kind>
fetched_at: <today's ISO date>
---

# <metadata.title>

> Fuente: [<channel>](<channel_url>) · [Ver en YouTube](<webpage_url>) · Duración: <duration_string>

## Resumen

<3–6 sentence executive summary based on the transcript. Stick to what the video
actually says — no extrapolation.>

## Índice

<If chapters exist: markdown list linking to each H2 anchor below.
If no chapters: 3–6 thematic bullets derived from the transcript, no links.>

## Transcripción

<If chapters exist:
  For each chapter:
    ### <chapter.title> (<mm:ss>–<mm:ss>)
    Concatenate cues whose start falls inside [chapter.start_time, chapter.end_time).
    Group into paragraphs (~3–6 sentences). Do not invent text.

If no chapters:
  Full transcript as paragraphs (~3–6 sentences). No timestamps in body.>
```

Formatting rules:
- No per-cue timestamps in body (only in chapter headings).
- Keep "[Música]" or "[Aplausos]" inline in italics only if they appear in cues.
- Preserve the speaker's wording. Fix only caption artifacts (double spaces, missing punctuation).
- If transcript < ~300 words, write one sentence under Resumen saying so and skip Índice.

### Step 5 — Report

Reply with ONLY this format (nothing else):

```
DONE: <relative_path> · <duration> · <N> chapters
```

Example: `DONE: research/transcripts/intro-al-curso.md · 12:34 · 5 chapters`
````

## After the agent returns

- `ALREADY_EXISTS: <path>` → the transcript was already downloaded. Tell the user
  and move on. Do **not** re-invoke the skill or spawn another agent.
- `DONE: <path> ...` → success. Confirm the file path to the user. Read the file
  only if the user asks to see the content — do not read it proactively.
- Error → surface it to the user.
- In ALL cases: do **not** re-invoke the skill or re-run any step yourself.

## Failure modes

- **No subtitles**: the agent will report this. Offer the user to retry with broader `--lang`.
- **yt-dlp 403 / age-restricted**: the agent will surface stderr. Do not retry.
- **Wrong URL**: ask the user to verify.

## Notes

- The venv is local to the skill (`.claude/skills/youtube-transcript/.venv/`). Do not commit it.
- Raw VTT + info.json stay in `<DEST_DIR>/.cache/<video_id>/` (default `research/transcripts`).
- `yt-dlp` version is pinned in `requirements.txt`.
