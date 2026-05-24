# Workspace: scripts

## Propósito

Convertir ideas e investigación en **guiones del proyecto**, listos para grabar
voiceover o para generar un spec de animación.

## Audiencia y tono

> Configurado en `.claude/studio-config.yaml`. Si el archivo no existe,
> ejecutá `/project-setup` primero.

| Campo     | Valor           |
| --------- | --------------- |
| Audiencia | [from config]   |
| Tono      | [from config]   |
| Idioma    | [from config]   |

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
