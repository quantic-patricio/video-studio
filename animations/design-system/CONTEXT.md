# Design System

## Identidad visual

> Configurado por el wizard `/project-setup`. Si los archivos de abajo
> muestran placeholders, ejecutá el wizard primero.

**Mood**: [configured by wizard]
**Inspiracion**: [configured by wizard]
**Anti-patrones**: [configured by wizard]

## Archivos del sistema

| Archivo          | Contenido                                                    |
| ---------------- | ------------------------------------------------------------ |
| `palette.md`     | Tokens de color: fondos, foregrounds, accents, semanticos.   |
| `typography.md`  | Fonts, escala tipografica, pesos, tracking.                  |
| `motion.md`      | Easing, duraciones, springs, transiciones entre escenas.     |
| `components.md`  | Patrones de componentes para elementos comunes de video.     |

## Como se usa

1. **Al escribir un spec** — leer `palette.md` + `typography.md` para anclar la
   *visual philosophy* del episodio al sistema global.
2. **Al construir una animacion** — leer `motion.md` + `components.md` para usar
   los tokens de timing y los patrones de componentes existentes.
3. **Al crear un componente nuevo en `_shared/`** — actualizar `components.md`
   con el inventario.

Este design system es un punto de partida. Cada spec puede sobrescribir tokens
especificos si el episodio lo justifica, pero el default es este.

## Estilo ui-ux-pro-max

Al invocar la skill `ui-ux-pro-max:ui-ux-pro-max`, leer los parametros
de estilo desde `.claude/studio-config.yaml` campo `visual.style_query`.
Si el config no existe, ejecutar `/project-setup` primero.

## Iconografia

Libreria obligatoria: **Phosphor Icons** (`@phosphor-icons/react`).

- Import: `import { IconName } from "@phosphor-icons/react"`
- Pesos disponibles: `thin` | `light` | `regular` | `bold` | `fill` | `duotone`
- Elegir el peso segun la jerarquia visual del momento:
  - `thin` / `light` — elementos decorativos, sutiles, secundarios
  - `regular` — uso general, diagramas, UI
  - `bold` / `fill` — emphasis, key moments, CTAs
  - `duotone` — elementos con doble tono (accent-warm + fg-primary, etc.)
- Color y tamano se controlan via props `color` y `size`.
- **Prohibido**: iconos ASCII, emoji, o caracteres Unicode como sustituto de iconos reales.
