# Motion & Animation

## Principios

1. **La animacion comunica, no decora.** Cada movimiento tiene una razon:
   revelar informacion, guiar la atencion, crear ritmo narrativo.
2. **Timing = engagement.** Los reveals son mas cautivadores con una pausa
   antes del movimiento (anticipation) y un ease-out suave despues.
3. **Menos es mas.** Max 2 elementos animandose simultaneamente en pantalla.
   Si todo se mueve, nada destaca.

## FPS y canvas

> Values configured by `/project-setup` wizard.

| Propiedad   | Valor              |
| ----------- | ------------------ |
| FPS         | {{visual.fps}}            |
| Resolucion  | {{visual.dimensions}} (16:9)     |
| Resolucion vertical | 1080x1920 (9:16, shorts) |

## Easing curves (Remotion)

| Nombre         | Valor                                      | Cuando usar                              |
| -------------- | ------------------------------------------ | ---------------------------------------- |
| `enter`        | `Easing.bezier(0.16, 1, 0.3, 1)`          | Elementos que aparecen (decelerate in)   |
| `exit`         | `Easing.bezier(0.7, 0, 0.84, 0)`          | Elementos que salen (accelerate out)     |
| `emphasis`     | `Easing.bezier(0.34, 1.56, 0.64, 1)`      | Escala/bounce sutil para key moments     |
| `linear`       | `Easing.linear`                            | Solo para progress bars o contadores     |

## Duraciones (en frames)

| Escala      | Frames | Segundos | Uso                                         |
| ----------- | ------ | -------- | ------------------------------------------- |
| `micro`     | 6-10   | 0.2-0.3s | Fades de opacidad, cursor blink             |
| `standard`  | 15-20  | 0.5-0.7s | Entrada/salida de texto, bullets            |
| `emphasis`  | 25-35  | 0.8-1.2s | Reveal de conceptos clave, diagramas        |
| `scene`     | 45-60  | 1.5-2.0s | Transiciones entre escenas/capitulos        |
| `dramatic`  | 60-90  | 2.0-3.0s | Pausa de anticipacion antes de un reveal    |

## Spring configs (Remotion `spring()`)

| Nombre          | Config                                     | Uso                                  |
| --------------- | ------------------------------------------ | ------------------------------------ |
| `gentle`        | `{ damping: 200, stiffness: 80, mass: 1 }` | Elementos que flotan suavemente      |
| `responsive`    | `{ damping: 20, stiffness: 120, mass: 0.8 }` | Respuesta rapida, ligeramente bouncy |
| `dramatic`      | `{ damping: 12, stiffness: 60, mass: 1.2 }` | Overshoot intencional para emphasis  |

## Stagger (escalonamiento)

- **Bullets / lista**: 3-5 frames entre items.
- **Diagrama con nodos**: 4-6 frames entre nodos.
- **Grid de elementos**: 2-3 frames por item, recorrido top-left a bottom-right.

## Transiciones entre escenas

| Tipo          | Duracion   | Cuando usar                                    |
| ------------- | ---------- | ---------------------------------------------- |
| Crossfade     | 15-20 fr   | Default entre beats del mismo capitulo         |
| Fade to black | 20-30 fr   | Cierre de capitulo / pausa dramatica           |
| Slide left    | 20-25 fr   | Avance lineal (paso 1 a paso 2)               |
| Scale + fade  | 25-30 fr   | Zoom in a un detalle / reveal de concepto      |
| Cut directo   | 0 fr       | Cambio de ritmo, ruptura intencional           |

## Ambient effects (opcionales)

Estos efectos crean atmosfera. Son sutiles y nunca deben competir con el contenido.

| Efecto               | Implementacion                                    | Intensidad        |
| -------------------- | ------------------------------------------------- | ----------------- |
| Ambient glow blob    | `<div>` absoluto, blur 60-80px, opacity 0.06-0.10 | Muy baja          |
| Warm reveal halo     | Radial gradient `accent-warm-glow`, 200-400px     | Aparece en key moments |
| Subtle grain         | Noise overlay, opacity 0.03-0.05, blend: overlay  | Casi imperceptible |
| Vignette             | Radial gradient transparent a `bg-deep`, desde borde | Solo en escenas dramaticas |

## Lo que NO hacer

- No animar `width`, `height`, `top`, `left` — solo `transform` y `opacity`.
- No usar `Easing.linear` para UI transitions (reservado a progress indicators).
- No hacer bounce en elementos de texto (se siente amateur; el bounce es para
  graficos aislados con spring `dramatic`).
- No superar opacity 0.15 en glows ambientales (deja de ser sutil).
- No animar mas de 2 elementos a la vez en la misma zona del canvas.
