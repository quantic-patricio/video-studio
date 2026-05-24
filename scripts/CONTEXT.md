# Workspace: scripts

## Propósito

Convertir ideas e investigación en **guiones del curso**, listos para grabar
voiceover o para generar un spec de animación.

## Audiencia y tono

> **TODO usuario**: completar esta sección con audiencia objetivo, nivel técnico,
> tono (formal / cercano / divulgativo), y referencias estilísticas. Sin esto,
> los guiones generados van a tener voz inconsistente.

Placeholder provisional:
- **Audiencia**: desarrolladores hispanohablantes que quieren entender IA aplicada.
- **Tono**: divulgativo, directo, sin jerga innecesaria. Analogías concretas.
- **Idioma**: español neutro (evitar regionalismos fuertes).

## Sub-carpetas

| Carpeta       | Duración objetivo | Cuándo usar                                          |
| ------------- | ----------------- | ---------------------------------------------------- |
| `long-form/`  | 5–25 min          | Explicaciones profundas, tutoriales, deep dives.     |
| `short-form/` | 30–90 s           | Hooks, tips sueltos, formato vertical (9:16).        |

## Estructura mínima de un guión

Cada guión es un MD con frontmatter + cuerpo:

```markdown
---
slug: <YYYY-MM-DD>_<kebab-slug>
title: "..."
format: long-form | short-form
target_seconds: 600
audience: "..."
status: draft | review | final
sources:
  - research/transcripts/<slug>.md
  - research/notes/<slug>_notes.md
---

# Hook (10–15 s)
...

# Contexto (30–60 s)
...

# Desarrollo
## Beat 1 — ...
## Beat 2 — ...

# Cierre / CTA
...
```

Los **beats** de esta sección son los mismos que después se traducen al
*beat map* del spec. Pensalos ya con timing aproximado.

## Qué NO hacer

- No escribir directivas visuales detalladas acá (van en el spec).
- No mezclar borradores y versiones finales en el mismo archivo. Si versionás,
  usá `<slug>_v2.md`, `<slug>_v3.md`, y dejá el final sin sufijo.
- No tocar `animations/` desde acá.
