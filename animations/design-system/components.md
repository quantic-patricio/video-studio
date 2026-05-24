# Componentes — Patrones de video

Inventario de los patrones recurrentes en los videos del curso. Cuando un
patrón se reutilice en 2+ episodios, extraer a `remotion-app/src/_shared/`.

## 1. Title Card (pantalla completa)

**Cuándo**: hook del video (primeros 3–8 segundos).

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                                                      │
│             [Display 72px, fg-primary]               │
│               TÍTULO DEL VIDEO                       │
│                                                      │
│             [Caption 14px, fg-muted]                 │
│             subtítulo o contexto breve               │
│                                                      │
│                  ── accent-warm ──                    │
│                 línea decorativa                      │
│                                                      │
└──────────────────────────────────────────────────────┘
  Fondo: bg-gradient + ambient glow blob (accent-cool-glow)
```

**Animación**: fade in (opacity 0→1, `standard`) + translateY leve (20px→0,
easing `enter`). La línea decorativa se expande desde el centro (`emphasis`).

## 2. Bullet Reveal (lista progresiva)

**Cuándo**: presentar ideas, pasos, conceptos como lista.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  [H2, fg-primary]  Concepto principal                │
│                                                      │
│  ● [Body, fg-secondary]  Primer punto               │ ← aparece
│  ● [Body, fg-secondary]  Segundo punto              │ ← stagger +4fr
│  ● [Body, fg-secondary]  Tercer punto               │ ← stagger +4fr
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Animación**: cada bullet entra con translateX(-30px→0) + opacity(0→1),
easing `enter`, stagger 4 frames. El bullet `●` usa `accent-warm`.

## 3. Code Snippet

**Cuándo**: mostrar código, comandos, configuraciones.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  ┌─ bg-elevated, border, radius 12px ─────────────┐ │
│  │                                                 │ │
│  │  [Code 16px, JetBrains Mono]                    │ │
│  │  const model = new Anthropic();                 │ │
│  │  const response = await model.messages.create({ │ │
│  │    model: "claude-sonnet-4-6",                  │ │
│  │    max_tokens: 1024,                            │ │
│  │  });                                            │ │
│  │                                                 │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Syntax highlighting tokens**:
- Keywords (`const`, `await`, `new`): `accent-cool`
- Strings: `accent-warm`
- Comments: `fg-muted`
- Default: `fg-primary`

**Animación**: la caja entra con scale(0.95→1) + opacity, easing `enter`.
Líneas de código aparecen secuencialmente (stagger 2 frames por línea,
typewriter opcional para emphasis).

## 4. Diagram / Flowchart

**Cuándo**: explicar arquitectura, flujos, relaciones entre conceptos.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│     ┌────────┐      ┌────────┐      ┌────────┐      │
│     │ Nodo A │ ───→ │ Nodo B │ ───→ │ Nodo C │      │
│     └────────┘      └────────┘      └────────┘      │
│                                                      │
└──────────────────────────────────────────────────────┘
  Nodos: bg-elevated, border, radius 8px
  Flechas: fg-muted → accent-warm (animadas)
  Labels: Body, fg-primary
```

**Animación**: nodos aparecen en secuencia (stagger 6 frames), las flechas
se dibujan progresivamente entre nodos (stroke-dashoffset animation, easing
`enter`). El nodo activo pulsa con un halo `accent-warm-glow`.

## 5. Key Stat / Number Reveal

**Cuándo**: dato impactante, porcentaje, cifra que ancla el argumento.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              [Display 72px, accent-warm]              │
│                    12,000                             │
│              [H3, fg-secondary]                       │
│              líneas de código                         │
│                                                      │
└──────────────────────────────────────────────────────┘
  Fondo: reveal-gradient (halo ámbar detrás del número)
```

**Animación**: el número cuenta desde 0 con `interpolate()` + easing
`emphasis` (~35 frames). El halo aparece con el número ya al 60%.

## 6. Scene Transition

**Cuándo**: cambio de capítulo o bloque temático.

**Variante A — Crossfade** (default):
Overlap de 15–20 frames, la escena saliente baja opacity mientras la
entrante sube.

**Variante B — Fade to black**:
Fade out a `bg-deep` (15 fr) → hold 10 fr → fade in nueva escena (15 fr).
Reservar para cierres de capítulo o pausas dramáticas.

**Variante C — Slide + Fade**:
Escena saliente se desplaza ligeramente a la izquierda (translateX 0→-50px)
con fade out. La entrante viene de la derecha (translateX 50px→0) con fade in.
Duración: 20–25 frames.

## 7. Closing Card

**Cuándo**: últimos 5–10 segundos del video.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              [H1, fg-primary]                         │
│              Nombre del curso / canal                 │
│                                                      │
│              [Body, fg-secondary]                     │
│              CTA: "Suscribite" / URL                 │
│                                                      │
│              ── accent-warm, fade in ──               │
│                                                      │
└──────────────────────────────────────────────────────┘
  Fondo: bg-deep + vignette sutil
```

**Animación**: fade in general (`standard`). Los elementos entran con
stagger leve (5 frames). La línea ámbar se expande desde el centro.

---

## Inventario `_shared/` (componentes React reutilizables)

> Esta sección se actualiza cuando se extraen componentes a
> `remotion-app/src/_shared/`.

| Componente     | Path                          | Estado       |
| -------------- | ----------------------------- | ------------ |
| *(vacío)*      | —                             | Por crear    |

**Regla**: un componente se extrae a `_shared/` cuando se usa en **2 o más**
compositions distintas. Antes de eso, vive en la composition del episodio.
