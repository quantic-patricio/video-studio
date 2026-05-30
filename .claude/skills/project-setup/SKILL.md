---
name: project-setup
description: |
  Interactive setup wizard for Video Studio. Guides the user through project
  identity, audience, tone, and visual design. Generates studio-config.yaml
  and all design system files. Run once per project clone.
---

# Video Studio — Setup Wizard

This skill configures a fresh Video Studio clone for the user's specific
project. It generates the design system, updates CONTEXT.md files, and sets
up Root.tsx via Remotion MCP.

## Guard — run only once

```bash
test -f .claude/studio-config.yaml && echo "ALREADY_CONFIGURED"
```

If `ALREADY_CONFIGURED` → tell the user the studio is already set up. Offer
to re-run only if they explicitly ask. If they confirm re-run, proceed
normally (overwrite existing files).

## Prerequisites check

Before starting the wizard, verify:

1. **ui-ux-pro-max skill** — check that it appears in the available skills
   list. If missing, tell the user:
   "This wizard requires the `ui-ux-pro-max` skill for design system
   generation. Install it first, then re-run `/project-setup`."
   Stop here.

2. **Remotion MCP** — check that `.mcp.json` contains the `remotion` server.
   If missing, tell the user:
   "This wizard requires the Remotion MCP server. Add it to `.mcp.json`
   first, then re-run `/project-setup`."
   Stop here.

## Phase 1 — Project Identity

Use `AskUserQuestion` to ask these questions (batch into 1-2 calls):

**Questions:**
1. "What is this video studio for?" — free text.
   Examples: "AI course for developers", "cooking channel", "startup explainers".
   → `project.name` (short name) and `project.description` (full description).

2. "What language is your content in?" — options:
   - Spanish (default)
   - English
   - Portuguese
   - Other (free text)
   → `project.content_language` (ISO code: es, en, pt, etc.)

## Phase 2 — Audience & Tone

Use `AskUserQuestion`:

1. "Who is your target audience?" — free text.
   Examples: "Hispanic developers wanting to learn applied AI",
   "home cooks looking for quick recipes".
   → `audience.profile`

2. "What tone should the scripts use?" — options:
   - Divulgativo / educational casual
   - Formal / academic
   - Energetic / fast-paced
   - Conversational / friendly
   → `audience.tone`

### Step 2.1 — Narration voice

`tone` is the broad register; the four dimensions below define the fine-grained
narration voice. There are two ways to fill them — try to **derive from real
examples** first, fall back to self-report.

#### Step 2.1.0 — Analysis mode (optional, paid)

Ask once whether to enable the **Gemini** integration — a paid multimodal mode
that *watches* reference videos (delivery, cadence, visual style) for a much
richer voice profile than transcript text. Use `AskUserQuestion`:

- "¿Querés habilitar el modo Gemini (análisis multimodal de video, **de pago**)?"
  - No (recommended default) — usa transcript + Haiku, sin costo.
  - Sí — requiere una `GEMINI_API_KEY` (la configuramos **antes** de perfilar la
    voz, en el Step 2.1.a — no al final).
  → `integrations.gemini.enabled` (true/false). If yes, also record
  `integrations.gemini.model` (default `gemini-2.5-flash`).

This flag is project-wide: `narration-style` and research mining both honor it.

#### Step 2.1.a — Reference videos (preferred)

Ask (free text), making the two inputs distinct:

> "Para perfilar tu voz narrativa:
> 1. Pegá 1–N URLs de **videos específicos** de YouTube cuya narración te
>    guste (formato `youtube.com/watch?v=...`). **Un link de canal no sirve** —
>    necesito videos puntuales para analizarlos.
> 2. (Opcional) ¿Cómo se llama el **creador**? Con el nombre puedo investigar su
>    estilo en la web y enriquecer el perfil.
>
> O escribí 'skip' para auto-reportar las dimensiones."

Capture the **video URLs** and the optional **creator name** separately.

**Key gate (only if Gemini mode is ON).** Before invoking `narration-style`,
ensure the key is ready so we use the rich Gemini path instead of silently
degrading to transcript:

1. Run `bash .claude/skills/gemini-video/scripts/setup.sh` — it provisions the
   venv AND scaffolds `./.env` from `.env.example` if missing.
2. Check the key (`.env`-aware; an exported var also counts):
   ```bash
   { [ -n "$GEMINI_API_KEY" ] || { [ -f .env ] && grep -Eq '^GEMINI_API_KEY=.+' .env; }; } \
     && echo OK || echo MISSING
   ```
3. If MISSING → **pause**. Tell the user: "Pegá tu `GEMINI_API_KEY` en `./.env`
   (conseguila en https://aistudio.google.com/apikey — es de pago y no se
   commitea), avisame y re-chequeo." Re-run the check when they confirm. Do NOT
   silently fall back. If the user prefers not to set it now, ask explicitly via
   `AskUserQuestion`: *seguir con transcript (sin Gemini) ahora* vs *skipear el
   perfilado de referencia* — never assume.

Then dispatch:

- If the user provided video URLs (and, for Gemini, the key is OK) → invoke the
  **`narration-style`** skill with the URLs **and** the optional creator name. It
  returns a voice profile (`person`, `pacing`, `jargon`, `devices`,
  `signature_moves`, plus `creator_context` if a creator was given). Use it to
  **pre-fill** the four questions below — present each with the derived value
  already selected so the user just confirms or adjusts. Carry `signature_moves`,
  `creator_context`, the source URLs (`reference_videos`) and the creator name
  (`reference_creator`) into the `narration` config block.
- If the user writes 'skip' (or the skill returns nothing usable) → ask the four
  questions blank, as below.

#### Step 2.1.b — Confirm / self-report the four dimensions

Use `AskUserQuestion` (batch into one call). Adapt the phrasing and options to
the chosen `content_language` — the examples below assume Spanish content. If a
reference profile exists, pre-select its values:

1. "How should the narrator address the viewer?" — options:
   - Tú (close, neutral Latin American)
   - Vos (Rioplatense)
   - Usted (formal, distant)
   - Nosotros (inclusive — "vamos a ver…")
   → `narration.person`

2. "What sentence rhythm should the narration have?" — options:
   - Short & punchy (clipped sentences, fast cadence)
   - Developed & explanatory (longer, unfolding sentences)
   - Mixed (alternates depending on the beat)
   → `narration.pacing`

3. "How much technical jargon is allowed?" — options:
   - None (everything in plain language)
   - Always explained (jargon is fine if defined on first use)
   - Free (expert audience, no need to explain)
   → `narration.jargon`

4. "Which rhetorical devices should the narration use?" — multiSelect:
   - Rhetorical questions to the viewer
   - Analogies & metaphors
   - Light humor
   - Storytelling / anecdotes
   → `narration.devices` (array)

## Phase 3 — Visual Identity

Use `AskUserQuestion`:

1. "What visual mood do you want for your videos?" — options:
   - Dark & cinematic (mysterious, deep, reveals)
   - Bright & clean (minimal, airy, modern)
   - Warm & friendly (approachable, soft, organic)
   - Bold & energetic (saturated, dynamic, high-contrast)
   → `visual.mood`

2. "Do you have brand colors? (hex codes, or 'none' to auto-generate)" — free text.
   → `visual.brand_colors` (array of hex codes or empty)

3. "Any visual references? Channels, brands, or aesthetics you admire." — free text.
   → `visual.references`

4. "Video format?" — options:
   - 1920x1080 @ 30fps (cinematic, recommended)
   - 1920x1080 @ 60fps (tech demos, screen recordings)
   - 1080x1920 @ 30fps (vertical/shorts only)
   → `visual.fps` and `visual.dimensions`

## Phase 4 — Generate Design System

This phase is automated. No questions.

### Step 4.1 — Invoke ui-ux-pro-max

Build a style query from the user's answers. Example:
```
educational video {mood} {references} {audience_context}
```

Invoke the `ui-ux-pro-max:ui-ux-pro-max` skill with this query to get
recommendations for:
- Color palette (backgrounds, foregrounds, accents, semantics)
- Typography (display, body, code fonts — must be Google Fonts)
- Motion principles (easing, durations, transitions)

If the user provided brand colors, tell ui-ux-pro-max to build the palette
around those colors.

### Step 4.2 — Write `studio-config.yaml` (single source of truth)

Assemble the FULL config from the wizard answers (Phases 1–3) **and** the
ui-ux-pro-max output, and write it to `.claude/studio-config.yaml`. This is the
single source the renderer reads — every templated value lives here.

Map the ui-ux-pro-max recommendations into the `design:` block: hex tokens, font
choices + one-line rationales, the Google-Fonts load string, the palette
philosophy/contrast notes, and the visual inspiration/anti-patterns. If the user
provided brand colors, build the palette around them.

```yaml
# Video Studio Configuration
# Generated by /project-setup wizard — re-run to reconfigure

project:
  name: "<from Phase 1>"
  description: "<from Phase 1>"
  content_language: <ISO code>
  code_language: en

audience:
  profile: "<from Phase 2>"
  tone: "<from Phase 2>"

narration:
  person: "<tú | vos | usted | nosotros>"
  pacing: "<short | developed | mixed>"
  jargon: "<none | explained | free>"
  devices: [<rhetorical-questions, analogies, humor, storytelling — or empty>]
  signature_moves: "<one paragraph from the reference profile, or empty>"
  reference_videos: [<specific video URLs from Step 2.1.a, or empty>]
  reference_creator: "<creator name from Step 2.1.a, or empty>"
  creator_context: "<2-4 web-derived bullets about the creator's style, or empty>"

visual:
  mood: "<from Phase 3>"
  fps: <number>
  dimensions: "<WxH>"
  brand_colors: [<hex codes or empty>]
  references: "<from Phase 3>"
  style_query: "<built query for ui-ux-pro-max>"

# Design tokens from ui-ux-pro-max. Consumed by materialize.py to render the
# design-system files, theme.ts and style.css. Edit here + re-materialize to
# change the look project-wide.
design:
  inspiration: "<creators / aesthetics that inspire the look>"
  anti_patterns: "<what to avoid visually>"
  palette:
    philosophy: "<one or two sentences on the color logic>"
    contrast_notes: "<WCAG ratios for key fg/bg combos>"
    bg_deep: "#......"
    bg_base: "#......"
    bg_elevated: "#......"
    bg_subtle: "#......"
    fg_primary: "#......"
    fg_secondary: "#......"
    fg_muted: "#......"
    accent_warm: "#......"
    accent_warm_glow: "rgba(...)"
    accent_cool: "#......"
    accent_cool_glow: "rgba(...)"
    success: "#......"
    warning: "#......"
    error: "#......"
    info: "#......"
    border: "rgba(...)"
    border_accent: "rgba(...)"
    surface_glass: "rgba(...)"
    bg_gradient: "<linear/radial gradient>"
    reveal_gradient: "<radial gradient>"
    tech_gradient: "<linear gradient>"
  typography:
    display_font: "<Google Font name>"
    body_font: "<Google Font name>"
    code_font: "<Google Font name>"
    display_rationale: "<one line>"
    body_rationale: "<one line>"
    code_rationale: "<one line>"
    google_fonts_load: "<e.g. Sora:700, Inter:400;500, JetBrains Mono:400>"

integrations:
  gemini:
    enabled: <true | false from Step 2.1.0>
    model: "gemini-2.5-flash"   # only used when enabled; key comes from GEMINI_API_KEY env

setup_version: 2
setup_date: "<today YYYY-MM-DD>"
```

> fps/dimensions live in `visual:`, identity mood in `visual.mood`. Do NOT
> duplicate them inside `design:`.

### Step 4.3 — Materialize the runtime files (deterministic, no hand-writing)

Do NOT write the design-system files, `theme.ts`, `style.css`, or the workspace
`CONTEXT.md` files by hand. They are **generated** from `.claude/templates/` by a
script that substitutes the `{{config.path}}` placeholders with the values just
written to the config:

```bash
bash .claude/skills/project-setup/scripts/setup.sh          # one-time: provision the venv
.claude/skills/project-setup/.venv/bin/python \
  .claude/skills/project-setup/scripts/materialize.py        # render all templated files
```

`materialize.py` fails loud and writes nothing if any placeholder lacks a config
value — if it reports missing keys, fill them in the `design:` block and re-run.
The materialized runtime files are gitignored and owned by the user; the
committed source of truth is `.claude/templates/`. To change a value later, edit
the config and re-run `materialize.py` — no need to re-run the whole wizard.

## Phase 5 — Remotion Setup

### Step 5.1 — Set up Root.tsx

Use the Remotion MCP (`mcp__remotion__remotion-documentation`) to look up the
correct `<Composition>` API for the user's chosen fps and dimensions.

Write `animations/remotion-app/src/Root.tsx`:

```tsx
import { Composition } from "remotion";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Episode compositions are registered here during the build phase. */}
      {/* Shared component previews are added as _shared/ grows. */}
    </>
  );
};
```

This is intentionally empty. Compositions are added as episodes are built.

### Step 5.2 — Verify build

Run:
```bash
cd animations/remotion-app && npx tsc --noEmit
```

If TypeScript errors → fix them. Common issues:
- Broken imports from deleted shared components.
- Missing type references.

## Phase 6 — Confirm

`studio-config.yaml` was written and all runtime files materialized in Phase 4,
and the build was verified in Phase 5. Nothing left to generate — just confirm.

### Step 6.1 — Confirm to user

Show a summary:
```
Studio configured:
- Project: <name>
- Audience: <profile>
- Style: <mood>
- Format: <dimensions> @ <fps>fps
- Config: .claude/studio-config.yaml

Next steps:
1. cd animations/remotion-app && npm install
2. npm run dev  (preview in Remotion Studio)
3. Start creating episodes!
```

If `integrations.gemini.enabled` is true, add a reminder (the key was normally
already set during Step 2.1.a — this just covers the case it was skipped):
```
Gemini mode is ON. The key lives in ./.env (gitignored, paid):
- If ./.env still has an empty GEMINI_API_KEY=, paste your key there.
  Get one at https://aistudio.google.com/apikey
- The gemini-video skill loads ./.env automatically — no export needed.
```

## Error handling

- If ui-ux-pro-max fails → fall back to asking the user to manually describe
  their palette, fonts, and motion preferences. Fill the `design:` block of the
  config from their text descriptions, then materialize (Step 4.3) as usual.
- If Remotion MCP is unavailable → write Root.tsx without MCP verification.
  The empty shell is always valid.
- If tsc fails → report errors and fix. Do not leave the project in a broken
  state.

## Important rules

- This skill materializes MANY files via the script in Step 4.3. Do NOT write
  them by hand and do NOT confirm each one — run the renderer once.
- The config file `.claude/studio-config.yaml` is gitignored. It is local
  to each developer's machine and is the single source of truth.
- The design-system / workspace `CONTEXT.md` files are NO LONGER committed —
  they are materialized per-project and gitignored, owned by the user. The
  committed source of truth is `.claude/templates/` (the harness). To change a
  default for every project, edit the **template**, not the runtime file.
- Do NOT create any episode content (compositions, scripts, specs). The
  wizard only sets up the studio infrastructure.
