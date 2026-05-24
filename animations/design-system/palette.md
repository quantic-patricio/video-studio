# Paleta de colores

## Filosofía

Oscuridad profunda con subtono azulado (profundidad, misterio) + un acento
cálido ámbar/dorado que funciona como "luz en la oscuridad" (atracción,
revelación) + un acento frío indigo para elementos estructurales y técnicos
(AI, código, diagramas).

El contraste alto garantiza legibilidad; los glows sutiles generan atmósfera
sin distraer.

## Tokens — Fondos

| Token            | Hex       | Uso                                          |
| ---------------- | --------- | -------------------------------------------- |
| `bg-deep`        | `#030712` | Fondo base del canvas (gray-950)             |
| `bg-base`        | `#0a0f1a` | Superficie principal, ligeramente elevada    |
| `bg-elevated`    | `#111827` | Cards, paneles, cajas de código (gray-900)   |
| `bg-subtle`      | `#1f2937` | Superficies secundarias, separadores (gray-800) |

## Tokens — Foreground (texto)

| Token            | Hex       | Uso                                          |
| ---------------- | --------- | -------------------------------------------- |
| `fg-primary`     | `#F9FAFB` | Texto principal, títulos (gray-50)           |
| `fg-secondary`   | `#9CA3AF` | Texto secundario, subtítulos (gray-400)      |
| `fg-muted`       | `#6B7280` | Captions, labels, metadata (gray-500)        |

## Tokens — Accents

| Token            | Hex       | Rol                                          |
| ---------------- | --------- | -------------------------------------------- |
| `accent-warm`    | `#F59E0B` | Highlights, CTAs, el "reveal" (amber-500)    |
| `accent-warm-glow` | `rgba(245, 158, 11, 0.15)` | Glow ambiental en key moments |
| `accent-cool`    | `#6366F1` | Estructura, diagramas, tech (indigo-500)     |
| `accent-cool-glow` | `rgba(99, 102, 241, 0.12)` | Glow sutil para elementos AI |

## Tokens — Semánticos

| Token            | Hex       |
| ---------------- | --------- |
| `success`        | `#10B981` |
| `warning`        | `#F59E0B` |
| `error`          | `#EF4444` |
| `info`           | `#6366F1` |

## Tokens — Bordes y superficies

| Token            | Valor                        |
| ---------------- | ---------------------------- |
| `border`         | `rgba(255, 255, 255, 0.08)`  |
| `border-accent`  | `rgba(245, 158, 11, 0.25)`   |
| `surface-glass`  | `rgba(255, 255, 255, 0.05)`  |

## Gradientes recurrentes

| Nombre           | Valor                                         | Uso                         |
| ---------------- | --------------------------------------------- | --------------------------- |
| `bg-gradient`    | `linear(180deg, #0a0f1a, #030712)`            | Fondo general top→bottom    |
| `reveal-gradient`| `radial(circle, accent-warm-glow, transparent)`| Halo detrás de key moments |
| `tech-gradient`  | `linear(135deg, #6366F1, #818CF8)`            | Elementos de IA/código      |

## Notas de contraste

- `fg-primary` sobre `bg-deep`: ratio ~18:1 (AAA+).
- `accent-warm` sobre `bg-deep`: ratio ~8.5:1 (AAA).
- `accent-cool` sobre `bg-deep`: ratio ~4.8:1 (AA).
- `fg-muted` sobre `bg-deep`: ~4.7:1 (AA). Para tamaños < 24px en video, usar
  `fg-secondary` en vez de `fg-muted`.
