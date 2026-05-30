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

### Modo Gemini (opcional, de pago)

Si `integrations.gemini.enabled` está en `true`, el mining puede ir más allá del
transcript: Gemini **mira** el video (entrega, plano visual, ritmo de edición).
El patrón es **dirigido por intención**, no genérico:

1. Claude primero descubre con el usuario **qué busca** del video (¿la técnica de
   hook? ¿la estructura de beats? ¿un segmento puntual?).
2. Con eso compone un *brief estructurado* y se lo pasa al skill `gemini-video`.
3. Claude **sintetiza** la respuesta en `notes/` — Gemini solo observa y responde,
   nunca redacta contenido creativo.

Es opcional y avisa el costo antes de cada llamada. Sin Gemini, el transcript +
notas manuales siguen siendo el camino por defecto.

## Qué NO hacer acá

- Escribir guiones (eso es `scripts/`).
- Editar el transcript original — si necesitás resumirlo, creá un archivo aparte
  en `notes/` y referencialo.
- Mezclar transcripts de distintos videos en un mismo archivo.

## Sub-carpetas

- `transcripts/` — output crudo de `youtube-transcript` por **episodio**. Incluye
  `.cache/` con los artefactos de `yt-dlp` (info.json + VTT). El `.cache/` no se commitea.
- `references/` — transcripts de videos de **referencia** (no ligados a un slug de
  episodio) que el skill `narration-style` baja para derivar el perfil de voz del
  proyecto. Mismo formato que `transcripts/` y, como ellos, **gitignored** (es
  contenido de terceros). La trazabilidad queda en las URLs (`reference_videos`)
  del config y en el perfil de voz derivado, que sí se commitean.
- `notes/` *(crear cuando haga falta)* — apuntes propios derivados.

Los resultados crudos de Gemini se cachean como `*.gemini.json` (gitignored)
junto al material que analizan, para no re-pagar la misma consulta.
