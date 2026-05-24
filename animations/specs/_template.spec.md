---
slug: <YYYY-MM-DD>_<kebab-slug>
source_script: scripts/{long-form|short-form}/<slug>.md
target_seconds: 60
fps: 30
dimensions: 1920x1080      # vertical 9:16 → 1080x1920
status: draft | review | locked
---

# <Título del episodio>

> Fuente: link al script en `scripts/`. Voiceover esperado: español neutro.

## Visual philosophy

Describir en 3–5 líneas el **mood, paleta, tipografía y referencias** estéticas
de **este episodio** (puede heredar de la "visual philosophy" global definida en
`animations/CLAUDE.md`, pero también puede sobrescribirla).

- **Paleta**: ...
- **Tipografía**: ...
- **Mood / energía**: ...
- **Referencias**: ... (otros canales, brand guides, frames inspiradores)

## Beat map

Lista narrativa, no técnica. Una fila por beat. Sin frames ni pixels.

| # | Tiempo aprox. | Duración | Narración (resumen)              | Qué se ve                                                |
| - | ------------- | -------- | -------------------------------- | -------------------------------------------------------- |
| 1 | 00:00–00:08   | 8 s      | Hook: "..."                      | Texto grande aparece desde abajo, fondo limpio.          |
| 2 | 00:08–00:25   | 17 s     | Contexto del problema.           | Diagrama simple con dos columnas que se contrastan.      |
| 3 | 00:25–00:50   | 25 s     | Solución / desarrollo principal. | Foco en un único elemento que evoluciona.                |
| 4 | 00:50–01:00   | 10 s     | Cierre + CTA.                    | Logo + handle al pie, fade out suave.                    |

## Key moments

Los 2–3 instantes que **tienen que salir perfectos**. Describir intención,
no implementación.

- **Moment A — Hook**: que el texto se sienta inevitable. Latencia mínima entre
  el primer fotograma y la primera palabra del voiceover.
- **Moment B — Pivote conceptual**: en el beat #3, cuando la idea cristaliza,
  la animación tiene que pausar (~0.5 s) antes de continuar.

## Audio sync points

Marcas explícitas donde animación y narración se alinean. Útil para que el
voiceover y el build no se desacomoden.

- `[00:08]` — comienzo del beat 2 coincide con la palabra "imaginá".
- `[00:25]` — corte visual + cambio de fondo coincide con "la solución es".
- `[00:50]` — primer frame del cierre cuando dice "y por eso".

## Notas para Claude (build)

Cualquier intención que no encaje en las secciones anteriores. Ejemplos válidos:

- "Mantené todo a 30 fps, easing tipo `Easing.inOut(Easing.ease)`."
- "No uses partículas ni shaders; sólo formas planas y tipografía."
- "Re-utilizá componentes ya existentes en `src/compositions/_shared/`."

Ejemplos **NO válidos** (esto no va acá, va en código):

- ~~"En el frame 240, mover el título a `top: 120px`."~~
- ~~"Usar `<AbsoluteFill style={{ backgroundColor: '#111' }}>`."~~
- ~~"El componente `Hook` recibe prop `fontSize={96}`."~~

---

**Recordatorio**: este spec es un **contrato entre el voiceover y la animación**.
Si después el build no respeta una intención, se arregla el spec primero y se
re-genera el código. No al revés.
