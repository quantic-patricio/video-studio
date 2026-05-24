# Design System — AI Course Video Studio

## Identidad visual

**Mood**: misterioso, cautivador, moderno. El espectador debe sentir que algo
profundo está a punto de revelarse. Oscuridad controlada con destellos cálidos
que guían la atención.

**Inspiración**: cine documental de ciencia (Cosmos, Kurzgesagt oscuro),
interfaces de herramientas de IA premium (Linear, Vercel), la estética
"luz en la oscuridad" de un terminal a medianoche.

**Anti-patrones**: nada cyberpunk, nada neón saturado, nada "gamer".
El misterio viene de la contención, no del exceso.

## Archivos del sistema

| Archivo          | Contenido                                                    |
| ---------------- | ------------------------------------------------------------ |
| `palette.md`     | Tokens de color: fondos, foregrounds, accents, semánticos.   |
| `typography.md`  | Fonts, escala tipográfica, pesos, tracking.                  |
| `motion.md`      | Easing, duraciones, springs, transiciones entre escenas.     |
| `components.md`  | Patrones de componentes para elementos comunes de video.     |

## Cómo se usa

1. **Al escribir un spec** → leer `palette.md` + `typography.md` para anclar la
   *visual philosophy* del episodio al sistema global.
2. **Al construir una animación** → leer `motion.md` + `components.md` para usar
   los tokens de timing y los patrones de componentes existentes.
3. **Al crear un componente nuevo en `_shared/`** → actualizar `components.md`
   con el inventario.

Este design system es un punto de partida. Cada spec puede sobrescribir tokens
específicos si el episodio lo justifica, pero el default es este.

## Estilo ui-ux-pro-max

Al invocar la skill `ui-ux-pro-max:ui-ux-pro-max`, usar siempre estos parámetros
para mantener coherencia con el studio:

- **Estilo**: Modern Dark Cinema
- **Query base**: `educational video dark cinematic mysterious captivating modern AI course`

## Iconografía

Librería obligatoria: **Phosphor Icons** (`@phosphor-icons/react`).

- Import: `import { IconName } from "@phosphor-icons/react"`
- Pesos disponibles: `thin` | `light` | `regular` | `bold` | `fill` | `duotone`
- Elegir el peso según la jerarquía visual del momento:
  - `thin` / `light` → elementos decorativos, sutiles, secundarios
  - `regular` → uso general, diagramas, UI
  - `bold` / `fill` → emphasis, key moments, CTAs
  - `duotone` → elementos con doble tono (accent-warm + fg-primary, etc.)
- Color y tamaño se controlan via props `color` y `size`.
- **Prohibido**: iconos ASCII (`→`, `✕`, `✓`, `●`), emoji (`🔒`, `📡`), o
  caracteres Unicode como sustituto de iconos reales.
