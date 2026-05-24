# Motion & Animation

## Principios

1. **La animación comunica, no decora.** Cada movimiento tiene una razón:
   revelar información, guiar la atención, crear ritmo narrativo.
2. **Misterio = timing.** Los reveals son más cautivadores con una pausa
   antes del movimiento (anticipation) y un ease-out suave después.
3. **Menos es más.** Max 2 elementos animándose simultáneamente en pantalla.
   Si todo se mueve, nada destaca.

## FPS y canvas

| Propiedad   | Valor              |
| ----------- | ------------------ |
| FPS         | 30                 |
| Resolución  | 1920×1080 (16:9)   |
| Resolución vertical | 1080×1920 (9:16, shorts) |

## Easing curves (Remotion)

| Nombre         | Valor                                      | Cuándo usar                              |
| -------------- | ------------------------------------------ | ---------------------------------------- |
| `enter`        | `Easing.bezier(0.16, 1, 0.3, 1)`          | Elementos que aparecen (decelerate in)   |
| `exit`         | `Easing.bezier(0.7, 0, 0.84, 0)`          | Elementos que salen (accelerate out)     |
| `emphasis`     | `Easing.bezier(0.34, 1.56, 0.64, 1)`      | Escala/bounce sutil para key moments     |
| `linear`       | `Easing.linear`                            | Solo para progress bars o contadores     |

## Duraciones (en frames @ 30fps)

| Escala      | Frames | Segundos | Uso                                         |
| ----------- | ------ | -------- | ------------------------------------------- |
| `micro`     | 6–10   | 0.2–0.3s | Fades de opacidad, cursor blink             |
| `standard`  | 15–20  | 0.5–0.7s | Entrada/salida de texto, bullets            |
| `emphasis`  | 25–35  | 0.8–1.2s | Reveal de conceptos clave, diagramas        |
| `scene`     | 45–60  | 1.5–2.0s | Transiciones entre escenas/capítulos        |
| `dramatic`  | 60–90  | 2.0–3.0s | Pausa de anticipación antes de un reveal    |

## Spring configs (Remotion `spring()`)

| Nombre          | Config                                     | Uso                                  |
| --------------- | ------------------------------------------ | ------------------------------------ |
| `gentle`        | `{ damping: 200, stiffness: 80, mass: 1 }` | Elementos que flotan suavemente      |
| `responsive`    | `{ damping: 20, stiffness: 120, mass: 0.8 }` | Respuesta rápida, ligeramente bouncy |
| `dramatic`      | `{ damping: 12, stiffness: 60, mass: 1.2 }` | Overshoot intencional para emphasis  |

## Stagger (escalonamiento)

- **Bullets / lista**: 3–5 frames entre items.
- **Diagrama con nodos**: 4–6 frames entre nodos.
- **Grid de elementos**: 2–3 frames por item, recorrido top-left → bottom-right.

## Transiciones entre escenas

| Tipo          | Duración   | Cuándo usar                                    |
| ------------- | ---------- | ---------------------------------------------- |
| Crossfade     | 15–20 fr   | Default entre beats del mismo capítulo         |
| Fade to black | 20–30 fr   | Cierre de capítulo / pausa dramática           |
| Slide left    | 20–25 fr   | Avance lineal (paso 1 → paso 2)               |
| Scale + fade  | 25–30 fr   | Zoom in a un detalle / reveal de concepto      |
| Cut directo   | 0 fr       | Cambio de ritmo, ruptura intencional           |

## Ambient effects (opcionales)

Estos efectos crean la atmósfera "misteriosa" del studio. Son sutiles y nunca
deben competir con el contenido.

| Efecto               | Implementación                                    | Intensidad        |
| -------------------- | ------------------------------------------------- | ----------------- |
| Ambient glow blob    | `<div>` absoluto, blur 60–80px, opacity 0.06–0.10 | Muy baja          |
| Warm reveal halo     | Radial gradient `accent-warm-glow`, 200–400px     | Aparece en key moments |
| Subtle grain         | Noise overlay, opacity 0.03–0.05, blend: overlay  | Casi imperceptible |
| Vignette             | Radial gradient transparent→`bg-deep`, desde borde | Solo en escenas dramáticas |

## Lo que NO hacer

- No animar `width`, `height`, `top`, `left` — solo `transform` y `opacity`.
- No usar `Easing.linear` para UI transitions (reservado a progress indicators).
- No hacer bounce en elementos de texto (se siente amateur; el bounce es para
  gráficos aislados con spring `dramatic`).
- No superar opacity 0.15 en glows ambientales (deja de ser sutil).
- No animar más de 2 elementos a la vez en la misma zona del canvas.
