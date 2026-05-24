# Tipografía

## Font stack

| Rol       | Font            | Fallback      | Por qué                                                |
| --------- | --------------- | ------------- | ------------------------------------------------------- |
| Display   | Space Grotesk   | sans-serif    | Geométrica con carácter, moderna, excelente en bold a tamaños grandes. Ideal para títulos que piden atención sin gritar. |
| Body      | Inter           | sans-serif    | Legibilidad máxima a cualquier tamaño, gran rango de pesos, probada en interfaces oscuras. |
| Code      | JetBrains Mono  | monospace     | Ligaduras, alta legibilidad en snippets, distingue bien `0/O`, `1/l/I`. |

## Descarga (Google Fonts)

```
Space Grotesk: wght@400;500;600;700
Inter: wght@300;400;500;600;700
JetBrains Mono: wght@400;500;700
```

En Remotion, cargar vía `@remotion/google-fonts` o `staticFile()` con archivos `.woff2`.

## Escala tipográfica

Base: 16px. Ratio: ~1.333 (perfect fourth).

| Nivel      | Tamaño | Peso | Tracking    | Font          | Uso                              |
| ---------- | ------ | ---- | ----------- | ------------- | -------------------------------- |
| Display    | 72px   | 700  | -2px        | Space Grotesk | Título principal del episodio    |
| H1         | 48px   | 700  | -1.5px      | Space Grotesk | Títulos de sección / capítulo    |
| H2         | 36px   | 600  | -1px        | Space Grotesk | Subtítulos, conceptos clave      |
| H3         | 24px   | 600  | -0.5px      | Space Grotesk | Tercer nivel, labels grandes     |
| Body L     | 20px   | 400  | 0           | Inter         | Narración en pantalla            |
| Body       | 16px   | 400  | 0           | Inter         | Descripciones, bullets           |
| Caption    | 14px   | 500  | +0.5px      | Inter         | Metadata, footnotes, timestamps  |
| Label      | 12px   | 600  | +1px        | Inter         | Tags, badges, uppercase labels   |
| Code       | 16px   | 400  | 0           | JetBrains Mono| Code snippets                    |
| Code sm    | 14px   | 400  | 0           | JetBrains Mono| Inline code, terminal output     |

## Line-height por contexto

| Contexto              | Line-height |
| --------------------- | ----------- |
| Display / H1          | 1.1         |
| H2 / H3              | 1.2         |
| Body (en pantalla)    | 1.5         |
| Code                  | 1.6         |

## Pesos y jerarquía

- **700 (Bold)**: títulos, números destacados, datos clave.
- **600 (Semibold)**: subtítulos, labels activos.
- **500 (Medium)**: énfasis en body, captions.
- **400 (Regular)**: texto corrido, descripciones.
- **300 (Light)**: quotes, texto decorativo grande (solo en Display ≥48px).

## Color de texto por jerarquía

| Nivel           | Token            |
| --------------- | ---------------- |
| Título / H1     | `fg-primary`     |
| Subtítulo / H2  | `fg-primary`     |
| Body            | `fg-secondary`   |
| Caption / Label | `fg-muted`       |
| Accent text     | `accent-warm`    |
| Code text       | `fg-primary` sobre `bg-elevated` |
