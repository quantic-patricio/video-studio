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
  - Sí — requiere una `GEMINI_API_KEY` (la pedimos al cerrar el setup).
  → `integrations.gemini.enabled` (true/false). If yes, also record
  `integrations.gemini.model` (default `gemini-2.5-flash`).

This flag is project-wide: `narration-style` and research mining both honor it.

#### Step 2.1.a — Reference videos (preferred)

Ask (free text): "¿Hay algún creador o video cuya **narración** te gustaría
emular? Pegá 1–N URLs de YouTube (idealmente del mismo creador), o escribí
'skip'."

- If the user provides URLs → invoke the **`narration-style`** skill with them.
  It fetches the transcripts into `research/references/` and returns a voice
  profile (`person`, `pacing`, `jargon`, `devices`, `signature_moves`). Use that
  profile to **pre-fill** the four questions below — present each with the
  derived value already selected so the user just confirms or adjusts. Carry
  `signature_moves` and the source URLs into the `narration` config block.
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

### Step 4.2 — Write design system files

Using the ui-ux-pro-max output, generate these files. Follow the exact
structure of the existing placeholder templates but fill in real values:

1. **`animations/design-system/palette.md`** — full token tables with hex values,
   philosophy section, gradients, contrast notes.

2. **`animations/design-system/typography.md`** — font stack, typographic scale,
   weights, line-heights. Fonts MUST be available via Google Fonts (for
   `@remotion/google-fonts` loading).

3. **`animations/design-system/motion.md`** — keep the universal principles
   (they're good defaults). Update fps, canvas dimensions, and any
   mood-specific timing adjustments.

4. **`animations/design-system/components.md`** — keep the 7 component patterns
   (Title Card, Bullet Reveal, Code Snippet, Diagram, Key Stat, Scene
   Transition, Closing Card). Update color/font token references to match
   the new palette. Reset the `_shared/` inventory to empty.

5. **`animations/design-system/CONTEXT.md`** — identity, mood, inspiration,
   anti-patterns, file index, ui-ux-pro-max style query, iconography section.

### Step 4.3 — Write code files

1. **`animations/remotion-app/src/style.css`** — Tailwind `@theme` block with
   all color tokens and font families matching palette.md and typography.md.

2. **`animations/remotion-app/src/_shared/theme.ts`** — JS exports of colors
   and fonts matching the design system. Keep the `fullScreen` utility style.

### Step 4.4 — Update CONTEXT.md files

1. **`scripts/CONTEXT.md`** — fill in the audience, tone, and language sections
   with the user's answers. Also fill the **"Voz narrativa"** section from the
   `narration` block (person, pacing, jargon, devices, and `signature_moves` if
   a reference profile was derived). This section is the runtime source the
   script-writing flow reads, so it must mirror the config `narration` block.
   Keep the rest of the file structure.

2. **`animations/CONTEXT.md`** — update the "Visual philosophy" summary section
   and the "Skill: ui-ux-pro-max" section with the new style query and mood.
   Keep all other sections (build workflow, commands, etc.) unchanged.

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

## Phase 6 — Write Config & Confirm

### Step 6.1 — Write studio-config.yaml

Write `.claude/studio-config.yaml`:

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
  reference_videos: [<URLs from Step 2.1.a, or empty>]

visual:
  mood: "<from Phase 3>"
  fps: <number>
  dimensions: "<WxH>"
  brand_colors: [<hex codes or empty>]
  references: "<from Phase 3>"
  style_query: "<built query for ui-ux-pro-max>"

integrations:
  gemini:
    enabled: <true | false from Step 2.1.0>
    model: "gemini-2.5-flash"   # only used when enabled; key comes from GEMINI_API_KEY env

setup_version: 1
setup_date: "<today YYYY-MM-DD>"
```

### Step 6.2 — Confirm to user

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

If `integrations.gemini.enabled` is true, add to the next steps:
```
Gemini mode is ON. Before using it:
- export GEMINI_API_KEY="<tu key>"  (es de pago y NO se commitea)
- bash .claude/skills/gemini-video/scripts/setup.sh  (instala el SDK, una vez)
```

## Error handling

- If ui-ux-pro-max fails → fall back to asking the user to manually describe
  their palette, fonts, and motion preferences. Generate the design system
  from their text descriptions.
- If Remotion MCP is unavailable → write Root.tsx without MCP verification.
  The empty shell is always valid.
- If tsc fails → report errors and fix. Do not leave the project in a broken
  state.

## Important rules

- This skill writes MANY files. Do not ask for confirmation on each file.
  Generate all files in Phase 4-5, then show the summary in Phase 6.
- The config file `.claude/studio-config.yaml` is gitignored. It is local
  to each developer's machine.
- Design system files ARE committed. They are shared across the team.
- Do NOT create any episode content (compositions, scripts, specs). The
  wizard only sets up the studio infrastructure.
