---
name: narration-style
description: |
  Derive a reusable narration voice profile from real reference videos. Given
  1–N YouTube URLs (ideally from a single creator), fetches their transcripts
  and analyzes them to extract HOW they narrate: grammatical person, sentence
  pacing, jargon level, rhetorical devices, and signature moves (hooks,
  transitions, closings, vocabulary). Use during /project-setup to pre-fill the
  narration block, or standalone anytime to refresh the studio voice or model a
  new creator. Delegates transcript fetch and analysis to Haiku agents to keep
  token cost low.
---

# Narration Style — Reference Voice Profiler

This skill turns *admired videos* into a **narration voice profile** the studio
can imitate when writing scripts. It does NOT copy script content — it extracts
the *style*, never verbatim text. Imitating a narrative style is legitimate;
cloning a creator's words is not.

## Two invocation modes

| Mode           | Caller          | What it does with the profile                              |
| -------------- | --------------- | ---------------------------------------------------------- |
| **Wizard**     | `project-setup` | Returns the profile so the wizard pre-fills its questions. |
| **Standalone** | user directly   | Writes the profile into `scripts/CONTEXT.md` voice section.|

The analysis is identical in both modes. Only the persistence step differs.

## Inputs

- **1–N YouTube URLs.** If the user gives none, ask for them. Recommend **a
  single creator** — N videos from one creator yields a robust profile; mixing
  creators dilutes the voice. If the user insists on mixing, warn and proceed.
- **Language** of the videos (default `es,en`). Ask before fetching.

## Step 0 — Choose the analysis path

Check `.claude/studio-config.yaml` → `integrations.gemini.enabled`:

- **`true` → Gemini "pro" path** (Step 1b). Gemini *watches* the videos and
  profiles delivery, cadence, visual style and audio↔image sync — far richer
  than transcript text for a narration voice. Paid; the `gemini-video` skill
  gates and confirms cost.
- **`false`/absent → transcript path** (Step 1a + Step 2). Fetch transcripts and
  analyze the text with Haiku. Always available, no cost.

Both paths produce the **same profile shape** (Step 2's `yaml` block), so the
rest of the flow is identical. If the Gemini path errors, fall back to the
transcript path rather than failing.

## Step 1a — Fetch reference transcripts (transcript path)

For **each** URL, invoke the `youtube-transcript` skill with destination
directory **`research/references`** (not the default `research/transcripts` —
reference material is not episode material). The skill is idempotent and
delegates to Haiku; do not re-fetch a URL already present.

Wait for all transcripts to land in `research/references/` before analyzing.

## Step 1b — Analyze with Gemini (pro path)

Invoke the **`gemini-video`** skill once per URL with a brief that asks Gemini to
profile the narration voice across the four dimensions **plus** what only video
reveals: delivery cadence and emphasis, energy, on-screen text usage, editing
rhythm, and how visuals reinforce the words. Pass a JSON schema matching Step 2's
shape (adding optional `delivery`, `visual_style`, `audio_visual_sync` fields).
Cache each result at `research/references/<slug>.gemini.json`.

When done, hand the merged profile to Step 3 (skip Step 2 — Gemini already
classified the dimensions). Remember: Gemini only analyzes; **never** ask it to
write narration.

## Step 2 — Analyze (delegate to Haiku)

Spawn **one** Agent with `model: "haiku"` and `description: "narration-style analysis"`.
Pass it the prompt below, replacing `{{PROJECT_ROOT}}` and `{{TRANSCRIPT_PATHS}}`
(newline-separated relative paths from Step 1).

````
HAIKU_AGENT_PROMPT (copy verbatim, only replace placeholders):

You are a narration-style analyst. Read the reference transcripts and extract a
voice profile. Do NOT quote or copy sentences from the transcripts — describe
patterns only.

PROJECT_ROOT     = {{PROJECT_ROOT}}
TRANSCRIPT_PATHS =
{{TRANSCRIPT_PATHS}}

### Step A — Read
Read every transcript file listed above (the `## Transcripción` section is what
matters; skip the metadata).

### Step B — Classify the four dimensions
For each, pick the single best-fitting value AND give a one-line justification
grounded in what you observed (no quotes):

- person:  one of [tú, vos, usted, nosotros]  — how the narrator addresses the viewer
- pacing:  one of [short, developed, mixed]   — sentence rhythm and length
- jargon:  one of [none, explained, free]     — how technical terms are handled
- devices: subset of [rhetorical-questions, analogies, humor, storytelling]

### Step C — Signature moves
Write ONE paragraph (4–8 sentences) describing the creator's recurring moves:
how they open/hook, how they transition between ideas, how they close, recurring
vocabulary or phrasing patterns, energy and cadence. Describe — never quote.

### Step D — Report
Reply with ONLY a fenced ```yaml block in this exact shape (nothing else):

```yaml
person: <value>            # why: <one line>
pacing: <value>            # why: <one line>
jargon: <value>            # why: <one line>
devices: [<subset>]        # why: <one line>
signature_moves: |
  <the paragraph from Step C>
sources:
  - <relative path of each transcript analyzed>
```
````

## Step 3 — Persist (depends on mode)

**Wizard mode** (`project-setup` called this skill): do NOT write any file.
Return the analyst's `yaml` block verbatim to the caller. The wizard pre-fills
its narration questions from it and confirms with the user.

**Standalone mode** (the user ran this skill directly):
1. Show the user the profile and let them adjust any value.
2. Write/update the **"Voz narrativa"** section of `scripts/CONTEXT.md` with the
   confirmed values (person, pacing, jargon, devices, signature_moves) plus a
   `> Derivado de: <urls>` provenance line.
3. Remind the user that `scripts/CONTEXT.md` is the runtime source read when
   writing scripts, and that the matching `narration:` block in
   `.claude/studio-config.yaml` should be updated to stay in sync.

## Notes

- Reference transcripts live in `research/references/` and are **gitignored**
  (third-party content). Traceability lives in the `reference_videos` URLs of the
  config and the derived voice profile, which are committed.
- If a video has no captions, `youtube-transcript` reports it — skip that URL and
  proceed with the rest. If zero transcripts succeed, tell the user and stop.
- This skill never edits `animations/` or `scripts/**/*.md` episode files.
