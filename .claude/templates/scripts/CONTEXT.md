# Workspace: scripts

## Propósito

Convertir ideas e investigación en **guiones del proyecto**, listos para grabar
voiceover o para generar un spec de animación.

## Audiencia y tono

> Configurado en `.claude/studio-config.yaml`. Si el archivo no existe,
> ejecutá `/project-setup` primero.

| Campo     | Valor           |
| --------- | --------------- |
| Audiencia | {{audience.profile}}   |
| Tono      | {{audience.tone}}   |
| Idioma    | {{project.content_language}}   |

## Voz narrativa

> Espejo del bloque `narration` de `.claude/studio-config.yaml`. Esta sección es
> la fuente que se lee **al escribir un guión**. Si está vacía, ejecutá
> `/project-setup` (o el skill `narration-style` para derivarla de videos de
> referencia).

| Dimensión          | Valor          | Qué define                                  |
| ------------------ | -------------- | ------------------------------------------- |
| Persona gramatical | {{narration.person}}  | Cómo se dirige al espectador (tú/vos/etc).  |
| Ritmo de frase     | {{narration.pacing}}  | Cadencia: cortas y punchy / desarrolladas.  |
| Jerga técnica      | {{narration.jargon}}  | Nivel de accesibilidad del vocabulario.     |
| Recursos retóricos | {{narration.devices}}  | Preguntas, analogías, humor, storytelling.  |

**Signature moves**: {{narration.signature_moves}}

## Registro regional — {{narration.dialect}}

> Variante del idioma en la que se escriben los guiones. Modifica el **registro**
> (léxico, modismos, trato), no el resto del perfil de voz. El dialecto es del
> **proyecto**: aunque la voz se derive de un creador de otra región, los guiones
> se escriben siempre en este dialecto.

{{narration.dialect_register}}

Aplicá esta voz **y este registro** al redactar el `<slug>.ai.md`. Al invocar el
`humanizer`, pasale esta sección (voz narrativa + registro regional) como
referencia de voz, para que **preserve el dialecto** y no lo neutralice al
generar el `<slug>.md`.

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

## Dos versiones por guión: IA vs humanizado

Cada guión vive en **dos archivos** que conviven para poder comparar el
*antes/después* de la skill `humanizer`:

| Archivo        | Contenido                       | Rol                                |
| -------------- | ------------------------------- | ---------------------------------- |
| `<slug>.ai.md` | Guión tal cual lo redactó la IA | El *antes*. Referencia y rollback. |
| `<slug>.md`    | Guión humanizado                | **Canónico** — fluye al spec.      |

**Flujo de cierre (obligatorio al terminar de escribir):**

1. Escribir el borrador completo en `<slug>.ai.md`.
2. Invocar la skill `humanizer` sobre `<slug>.ai.md`, pasándole la sección **Voz
   narrativa + Registro regional** de este archivo como referencia de voz (para
   que preserve el dialecto, no lo neutralice).
3. Guardar el resultado en `<slug>.md` (sin sufijo). **Nunca** sobrescribir
   `<slug>.ai.md`: es la versión cruda de referencia.
4. Mostrar al usuario el diff `<slug>.ai.md` ↔ `<slug>.md`. Si el humanizer
   rompió el sentido o el tono, ajustar `<slug>.md` a mano (el `.ai.md` queda
   intacto como punto de retorno).

Solo `<slug>.md` (el humanizado) se lee aguas abajo al generar el spec.

## Qué NO hacer

- No escribir directivas visuales detalladas acá (van en el spec).
- No mezclar el guión crudo y el humanizado en el mismo archivo: van en
  `<slug>.ai.md` y `<slug>.md` respectivamente (ver sección de versiones).
  Si necesitás snapshots iterativos del borrador, usá `<slug>_v2.ai.md`, etc.
- No tocar `animations/` desde acá.
