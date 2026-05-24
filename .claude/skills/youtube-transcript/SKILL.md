---
name: youtube-transcript
description: Fetch the transcript of a YouTube video using yt-dlp and render it as a structured markdown file (metadata + summary + TOC + chapter sections).
---

# YouTube Transcript → Markdown

Convert a YouTube video into a clean, structured markdown document containing:

- Frontmatter with metadata (title, channel, duration, URL, upload date).
- Auto-generated **title (H1)**, **executive summary**, and **table of contents (TOC)**.
- One **H2 section per YouTube chapter** when the video has chapters.
- A single flowing transcript broken into paragraphs when it does not.

The skill **does not paraphrase or rewrite** the video. It only formats the transcript and adds a brief generated summary + TOC at the top.

## Inputs

The user provides one of:

- A full YouTube URL (`https://www.youtube.com/watch?v=...`, `youtu.be/...`, etc.).
- A bare YouTube video ID.

If the user did not provide one, ask for it before proceeding.

Optional: language preference (default `es,en`).

## Workflow

### 1. Ensure dependencies (idempotent)

Always run the setup script first. It's a no-op if the venv is already provisioned.

```bash
bash .claude/skills/youtube-transcript/scripts/setup.sh
```

If this fails because `python3` is missing, stop and tell the user — do not try to install Python.

### 2. Fetch the transcript

Resolve the output directory: `research/transcripts/` relative to the project root (create it if it doesn't exist). The script also creates a `.cache/` subfolder for raw yt-dlp artifacts (info.json + VTT) — leave those alone, they're useful for debugging.

```bash
.claude/skills/youtube-transcript/.venv/bin/python \
  .claude/skills/youtube-transcript/scripts/fetch_transcript.py \
  "<URL_OR_ID>" \
  "research/transcripts" \
  --lang es,en
```

The script prints a JSON payload to stdout with:

- `metadata`: id, title, uploader, channel, upload_date, duration, webpage_url, description, tags.
- `chapters`: array of `{start_time, end_time, title}` (empty if the video has none).
- `subtitle`: `{language, kind: "manual"|"auto", source_file}` or null.
- `transcript`: array of `{start, end, text}` (deduplicated, rolling-caption noise removed).
- `cache_dir`: path to raw yt-dlp artifacts.

Capture this JSON to a temp file (e.g. `research/transcripts/.cache/<id>/payload.json`) so you can read it without re-running yt-dlp.

### 3. Build the markdown

Generate `research/transcripts/<slug>.md` where `<slug>` is the video title in kebab-case (ASCII, lowercased, no punctuation; cap ~80 chars). If a file with that name already exists, append `-<video_id>`.

**Template:**

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

<3–6 sentence executive summary you write yourself, based on the transcript. Stick to what the video actually says — no extrapolation.>

## Índice

<Markdown list with one entry per chapter (if chapters exist), linking to its H2 anchor.
If no chapters: 3–6 thematic bullets you derive from the transcript, no links.>

## Transcripción

<If chapters exist:
  For each chapter, emit:
    ### <chapter.title> (<mm:ss>–<mm:ss>)
    <Concatenate cues whose start falls inside [chapter.start_time, chapter.end_time).
     Group them into readable paragraphs (~3–6 sentences each). Do not invent text;
     just join cue.text values with spaces and split on sentence boundaries.>

If no chapters:
  Emit the full transcript as paragraphs (~3–6 sentences). No timestamps in the body.>
```

**Important formatting rules:**

- Do not include per-cue timestamps in the body. Timestamps belong to chapter headings only.
- Do not insert filler like "[Música]" or "[Aplausos]" unless they appear in the cues. If they do, keep them inline in italics.
- Preserve the speaker's wording. Fix only obvious caption artifacts (stray double spaces, missing punctuation between sentences).
- The summary must be grounded in the transcript. If the transcript is too short to summarize meaningfully (< ~300 words), say so in one sentence under `## Resumen` and skip the TOC.

### 4. Report back

After writing the file, print one line: the relative path of the generated markdown plus duration and chapter count. Example:

```
research/transcripts/intro-al-curso.md · 12:34 · 5 chapters
```

## Failure modes to handle

- **No subtitles available** (`subtitle` is null and `transcript` is empty): tell the user the video has no captions in the requested languages. Offer to retry with a broader `--lang` (e.g. `--lang es,en,pt,fr`). Do not write an empty markdown.
- **yt-dlp returns a 403 / age-restricted / region-locked error**: surface the stderr verbatim; do not retry with workarounds.
- **Wrong/expired URL**: ask the user to verify.

## Notes

- The venv is local to the skill (`.claude/skills/youtube-transcript/.venv/`). Do not commit it.
- `yt-dlp` version is pinned in `requirements.txt`. Bump it explicitly when YouTube changes break the extractor.
- The raw VTT + info.json stay in `research/transcripts/.cache/<video_id>/` for inspection.
