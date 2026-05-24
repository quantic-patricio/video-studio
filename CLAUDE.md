# AI Course — Video Studio

## Identidad

Studio para producir los videos del curso de IA end-to-end:
**inspiración → guión → spec → animación Remotion → render mp4**.

No hay frameworks, no hay bases de datos, no hay agentes custom. El file tree
ES la app. Claude Code ES el runtime. Markdown ES el formato. Las convenciones
de nombres reemplazan la metadata estructurada.


## Idioma

- **Contenido** (guiones, specs, narración, descripciones): español.
- **Código, identificadores, comandos, nombres de carpetas top-level**: inglés.
- **Frontmatter y metadata**: inglés.

## Mapa de carpetas

```
ai-course/videos/
├── CLAUDE.md                      ← Layer 1 (este archivo): identidad + routing
├── .claude/skills/                ← Layer 3: piezas plug-and-play
│   ├── youtube-transcript/        (sacar transcripts de YouTube)
│   └── humanizer/                 (limpiar patrones AI del texto)
├── research/                      ← Workspace 1: inspiración / mining
│   ├── CONTEXT.md
│   └── transcripts/               (output de youtube-transcript)
├── scripts/                       ← Workspace 2: guiones del curso
│   ├── CONTEXT.md
│   ├── long-form/                 (videos largos, 5–25 min)
│   └── short-form/                (shorts, 30–90 s)
├── assets/                        ← Workspace 4: recursos visuales y audio
│   ├── CONTEXT.md
│   ├── images/                    (fotos, screenshots, fondos, SVGs)
│   ├── videos/                    (clips cortos, b-roll)
│   ├── audio/                     (música, SFX, voiceovers)
│   └── logos/                     (logo del curso, iconos, marcas)
├── animations/                    ← Workspace 3: pipeline Remotion
│   ├── CONTEXT.md
│   ├── design-system/             (paleta, tipografía, motion, componentes)
│   ├── specs/                     (storyboards en MD — pieza central)
│   ├── remotion-app/              (proyecto Node + Remotion)
│   │   └── src/_shared/           (componentes React reutilizables)
│   └── renders/                   (mp4 finales)
└── raw-videos/                    ← grabaciones del usuario (fuera del pipeline)
```

## Naming convention (obligatoria)

Toda pieza ligada a un episodio comparte el mismo **slug raíz**:

> `YYYY-MM-DD_<kebab-slug>` — ej. `2026-05-22_intro-al-curso`

| Etapa                         | Path                                                          |
| ----------------------------- | ------------------------------------------------------------- |
| Transcripción de referencia   | `research/transcripts/<slug>.md`                              |
| Guión                         | `scripts/{long-form,short-form}/<slug>.md`                    |
| Spec                          | `animations/specs/<slug>.spec.md`                             |
| Assets del episodio           | `assets/{images,videos,audio}/<slug>_<descriptor>.<ext>`      |
| Composition Remotion          | `animations/remotion-app/src/compositions/<slug>/`            |
| Render                        | `animations/renders/<slug>.mp4`                               |

Con esto, **una sola búsqueda por slug encuentra todo lo asociado** sin necesidad de base de datos ni índice.

## Routing table — la regla más importante

| Tarea                              | Workspace activo            | Lee primero                                          | Ignora                                 | Skill / herramienta                |
| ---------------------------------- | --------------------------- | ---------------------------------------------------- | -------------------------------------- | ---------------------------------- |
| Traer transcripción de YouTube     | `research/`                 | `research/CONTEXT.md`                                 | `scripts/`, `animations/`              | `youtube-transcript`               |
| Tomar notas / extraer ideas        | `research/`                 | `research/CONTEXT.md`, transcripts del slug           | `animations/`                          | —                                  |
| Escribir un guión                  | `scripts/long-form` o `/short-form` | `scripts/CONTEXT.md`, `research/transcripts/<slug>*`   | `animations/`                          | —                                  |
| Humanizar / pulir guión            | `scripts/`                          | `scripts/**/<slug>.md`                                 | `animations/`, `research/`             | `humanizer`                        |
| Agregar / organizar assets         | `assets/`                   | `assets/CONTEXT.md`                                  | `scripts/`, `animations/`             | —                                  |
| Generar spec desde un guión        | `animations/specs/`         | `animations/CONTEXT.md`, `animations/design-system/*.md`, `scripts/**/<slug>.md`, `assets/<slug>*` | `remotion-app/src/`  | —                                  |
| Construir animación desde un spec  | `animations/remotion-app/`  | `animations/specs/<slug>.spec.md`, `animations/CONTEXT.md`, `animations/design-system/*.md`, `_shared/REGISTRY.md`, `assets/<slug>*` | `research/`, `scripts/` | `ui-ux-pro-max:ui-ux-pro-max` |
| Renderizar a mp4                   | `animations/remotion-app/`  | `package.json`, spec del slug                        | todo lo de arriba del pipeline         | —                                  |
| Definir / ajustar design system    | `animations/design-system/` | `animations/design-system/CONTEXT.md`, `animations/design-system/*.md` | `research/`, `scripts/`                | `ui-ux-pro-max:ui-ux-pro-max`      |
| Visualizar componentes compartidos | `animations/remotion-app/`  | `_shared/REGISTRY.md`                                | todo lo demás                          | —                                  |

**Regla**: si una tarea no está en la tabla, preguntar al usuario antes de actuar.

**Regla de skills obligatorias**: cuando la columna "Skill / herramienta" indica una skill, invocarla es un **requisito previo** al trabajo, no una sugerencia. Invocarla **antes** de escribir código o generar contenido. No empezar la tarea sin la skill.

## Standards

- DRY + SOLID. DDD por capas (research → scripts → specs → build → render); no saltar capas hacia arriba.
- Los **specs nunca contienen** frame numbers, pixel positions, props de componentes, ni código React.
  Contienen: *beat map*, *visual philosophy*, *key moments*, *audio sync points*. (Regla — sobre-restringir empeora las animaciones.)
- Una animación = una `composition/` con su propio entry point. No mezclar episodios en una sola comp.
- Renders nunca se commitean en git si superan 50 MB; usar Git LFS o output externo.
- Al terminar una etapa, **actualizar el `CONTEXT.md` del workspace** si aprendiste algo nuevo (Layer 2 maintenance).
- **Iconos**: usar exclusivamente `@phosphor-icons/react`. Está **prohibido** usar iconos ASCII/emoji (🔒, →, ✕, ✓, ●, etc.) como elementos visuales en las animaciones. Phosphor ofrece 6 variantes de peso (thin/light/regular/bold/fill/duotone) — elegir el peso según la jerarquía visual del momento.
- **Build escena por escena**: al construir una animación, ir beat por beat. Por cada escena: mostrar el fragmento del guión, consultar `_shared/REGISTRY.md` para sugerir componentes existentes, preguntar antes de crear un shared nuevo, construir, iterar con el usuario, y recién avanzar a la siguiente. Ver detalle en `animations/CONTEXT.md`.
- **Registry de componentes**: `remotion-app/src/_shared/REGISTRY.md` es la **única fuente** para saber qué componentes existen y cómo usarlos. Leer **solo** REGISTRY.md antes de cada escena — **nunca explorar archivos `.tsx`** de `_shared/` ni `compositions/` para descubrir componentes. Solo abrir un `.tsx` si hay que modificarlo.

## Mantenimiento de este archivo

Este `CLAUDE.md` evoluciona con el proyecto. Actualizarlo cuando:
- Se agrega un nuevo workspace top-level.
- Cambia una naming convention.
- Se incorpora una skill nueva → agregar fila al routing table.
- Se descubre una tarea recurrente no contemplada → agregar fila.

Mantenerlo **lean** (se carga en cada conversación). Si una sección crece más de
~15 líneas, mover detalle al `CLAUDE.md` del workspace correspondiente.
