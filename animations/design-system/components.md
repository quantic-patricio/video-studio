# Componentes — Patrones de video

Inventario de los patrones recurrentes en los videos del proyecto. Cuando un
patron se reutilice en 2+ episodios, extraer a `remotion-app/src/_shared/`.

## 1. Title Card (pantalla completa)

**Cuando**: hook del video (primeros 3-8 segundos).

```
+------------------------------------------------------+
|                                                      |
|                                                      |
|             [Display 72px, fg-primary]               |
|               TITULO DEL VIDEO                       |
|                                                      |
|             [Caption 14px, fg-muted]                 |
|             subtitulo o contexto breve               |
|                                                      |
|                  -- accent-warm --                    |
|                 linea decorativa                      |
|                                                      |
+------------------------------------------------------+
  Fondo: bg-gradient + ambient glow blob (accent-cool-glow)
```

**Animacion**: fade in (opacity 0-1, `standard`) + translateY leve (20px-0,
easing `enter`). La linea decorativa se expande desde el centro (`emphasis`).

## 2. Bullet Reveal (lista progresiva)

**Cuando**: presentar ideas, pasos, conceptos como lista.

```
+------------------------------------------------------+
|                                                      |
|  [H2, fg-primary]  Concepto principal                |
|                                                      |
|  * [Body, fg-secondary]  Primer punto                |
|  * [Body, fg-secondary]  Segundo punto               |
|  * [Body, fg-secondary]  Tercer punto                |
|                                                      |
+------------------------------------------------------+
```

**Animacion**: cada bullet entra con translateX(-30px-0) + opacity(0-1),
easing `enter`, stagger 4 frames. El bullet marker usa `accent-warm`.

## 3. Code Snippet

**Cuando**: mostrar codigo, comandos, configuraciones.

```
+------------------------------------------------------+
|                                                      |
|  +- bg-elevated, border, radius 12px ---------------+|
|  |                                                   ||
|  |  [Code 16px, Code font]                          ||
|  |  const model = new Anthropic();                   ||
|  |  const response = await model.messages.create({   ||
|  |    model: "claude-sonnet-4-6",                    ||
|  |    max_tokens: 1024,                              ||
|  |  });                                              ||
|  |                                                   ||
|  +---------------------------------------------------+|
|                                                      |
+------------------------------------------------------+
```

**Syntax highlighting tokens**:
- Keywords (`const`, `await`, `new`): `accent-cool`
- Strings: `accent-warm`
- Comments: `fg-muted`
- Default: `fg-primary`

**Animacion**: la caja entra con scale(0.95-1) + opacity, easing `enter`.
Lineas de codigo aparecen secuencialmente (stagger 2 frames por linea,
typewriter opcional para emphasis).

## 4. Diagram / Flowchart

**Cuando**: explicar arquitectura, flujos, relaciones entre conceptos.

```
+------------------------------------------------------+
|                                                      |
|     +--------+      +--------+      +--------+      |
|     | Nodo A | ---> | Nodo B | ---> | Nodo C |      |
|     +--------+      +--------+      +--------+      |
|                                                      |
+------------------------------------------------------+
  Nodos: bg-elevated, border, radius 8px
  Flechas: fg-muted -> accent-warm (animadas)
  Labels: Body, fg-primary
```

**Animacion**: nodos aparecen en secuencia (stagger 6 frames), las flechas
se dibujan progresivamente entre nodos (stroke-dashoffset animation, easing
`enter`). El nodo activo pulsa con un halo `accent-warm-glow`.

## 5. Key Stat / Number Reveal

**Cuando**: dato impactante, porcentaje, cifra que ancla el argumento.

```
+------------------------------------------------------+
|                                                      |
|              [Display 72px, accent-warm]              |
|                    12,000                             |
|              [H3, fg-secondary]                       |
|              lineas de codigo                         |
|                                                      |
+------------------------------------------------------+
  Fondo: reveal-gradient (halo accent detras del numero)
```

**Animacion**: el numero cuenta desde 0 con `interpolate()` + easing
`emphasis` (~35 frames). El halo aparece con el numero ya al 60%.

## 6. Scene Transition

**Cuando**: cambio de capitulo o bloque tematico.

**Variante A — Crossfade** (default):
Overlap de 15-20 frames, la escena saliente baja opacity mientras la
entrante sube.

**Variante B — Fade to black**:
Fade out a `bg-deep` (15 fr) -> hold 10 fr -> fade in nueva escena (15 fr).
Reservar para cierres de capitulo o pausas dramaticas.

**Variante C — Slide + Fade**:
Escena saliente se desplaza ligeramente a la izquierda (translateX 0->-50px)
con fade out. La entrante viene de la derecha (translateX 50px->0) con fade in.
Duracion: 20-25 frames.

## 7. Closing Card

**Cuando**: ultimos 5-10 segundos del video.

```
+------------------------------------------------------+
|                                                      |
|              [H1, fg-primary]                         |
|              Nombre del proyecto / canal              |
|                                                      |
|              [Body, fg-secondary]                     |
|              CTA: "Suscribite" / URL                 |
|                                                      |
|              -- accent-warm, fade in --               |
|                                                      |
+------------------------------------------------------+
  Fondo: bg-deep + vignette sutil
```

**Animacion**: fade in general (`standard`). Los elementos entran con
stagger leve (5 frames). La linea accent se expande desde el centro.

---

## Inventario `_shared/` (componentes React reutilizables)

> Esta seccion se actualiza cuando se extraen componentes a
> `remotion-app/src/_shared/`.

| Componente     | Path                          | Estado       |
| -------------- | ----------------------------- | ------------ |
| *(vacio)*      | —                             | Por crear    |

**Regla**: un componente se extrae a `_shared/` cuando se usa en **2 o mas**
compositions distintas. Antes de eso, vive en la composition del episodio.
