# Workspace: research

## Propósito

Recolectar inspiración para los videos del proyecto: transcripts de videos de YouTube,
papers, notas, hooks, frases sueltas. **No** se escriben guiones acá — los guiones
viven en `scripts/`.

## Flujo de trabajo

1. **Traer una transcripción**: invocar la skill `youtube-transcript` con la URL/ID.
   **Siempre preguntar al usuario en qué idioma está el video** antes de lanzar
   la descarga, y pasar `--lang <código>` acorde (ej. `en`, `es`). El default
   `es,en` provoca errores 429 cuando el idioma primario no coincide.
   Output → `research/transcripts/<slug>.md`.
2. **Anotar takeaways**: si el video aporta ideas concretas para un futuro episodio,
   crear `research/notes/<YYYY-MM-DD>_<tema>.md` con bullets cortos: hooks, datos,
   analogías, links.
3. **Cross-reference**: cuando una nota se pueda mapear a un episodio concreto,
   renombrarla con el slug raíz (`research/notes/<slug>_notes.md`) para que el
   guión correspondiente la encuentre por nombre.

## Qué NO hacer acá

- Escribir guiones (eso es `scripts/`).
- Editar el transcript original — si necesitás resumirlo, creá un archivo aparte
  en `notes/` y referencialo.
- Mezclar transcripts de distintos videos en un mismo archivo.

## Sub-carpetas

- `transcripts/` — output crudo de `youtube-transcript`. Incluye `.cache/` con
  los artefactos de `yt-dlp` (info.json + VTT). El `.cache/` no se commitea.
- `notes/` *(crear cuando haga falta)* — apuntes propios derivados.
