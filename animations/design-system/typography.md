# Tipografia

## Font stack

> [SETUP REQUIRED] Run `/project-setup` to configure fonts.
> Fonts must be available via Google Fonts for `@remotion/google-fonts`.

| Rol       | Font            | Fallback      | Por que                                 |
| --------- | --------------- | ------------- | --------------------------------------- |
| Display   | [SETUP]         | sans-serif    | [configured by wizard]                  |
| Body      | [SETUP]         | sans-serif    | [configured by wizard]                  |
| Code      | [SETUP]         | monospace     | [configured by wizard]                  |

## Descarga (Google Fonts)

```
[SETUP] — wizard generates the exact weights to load
```

En Remotion, cargar via `@remotion/google-fonts` o `staticFile()` con archivos `.woff2`.

## Escala tipografica

Base: 16px. Ratio: ~1.333 (perfect fourth).

| Nivel      | Tamano | Peso | Tracking    | Font          | Uso                              |
| ---------- | ------ | ---- | ----------- | ------------- | -------------------------------- |
| Display    | 72px   | 700  | -2px        | Display       | Titulo principal del episodio    |
| H1         | 48px   | 700  | -1.5px      | Display       | Titulos de seccion / capitulo    |
| H2         | 36px   | 600  | -1px        | Display       | Subtitulos, conceptos clave      |
| H3         | 24px   | 600  | -0.5px      | Display       | Tercer nivel, labels grandes     |
| Body L     | 20px   | 400  | 0           | Body          | Narracion en pantalla            |
| Body       | 16px   | 400  | 0           | Body          | Descripciones, bullets           |
| Caption    | 14px   | 500  | +0.5px      | Body          | Metadata, footnotes, timestamps  |
| Label      | 12px   | 600  | +1px        | Body          | Tags, badges, uppercase labels   |
| Code       | 16px   | 400  | 0           | Code          | Code snippets                    |
| Code sm    | 14px   | 400  | 0           | Code          | Inline code, terminal output     |

## Line-height por contexto

| Contexto              | Line-height |
| --------------------- | ----------- |
| Display / H1          | 1.1         |
| H2 / H3              | 1.2         |
| Body (en pantalla)    | 1.5         |
| Code                  | 1.6         |

## Pesos y jerarquia

- **700 (Bold)**: titulos, numeros destacados, datos clave.
- **600 (Semibold)**: subtitulos, labels activos.
- **500 (Medium)**: enfasis en body, captions.
- **400 (Regular)**: texto corrido, descripciones.
- **300 (Light)**: quotes, texto decorativo grande (solo en Display >= 48px).

## Color de texto por jerarquia

| Nivel           | Token            |
| --------------- | ---------------- |
| Titulo / H1     | `fg-primary`     |
| Subtitulo / H2  | `fg-primary`     |
| Body            | `fg-secondary`   |
| Caption / Label | `fg-muted`       |
| Accent text     | `accent-warm`    |
| Code text       | `fg-primary` sobre `bg-elevated` |
