# Workspace: assets

## Propósito

Biblioteca centralizada de recursos visuales y audiovisuales que complementan
los videos del curso: fotos, imágenes, clips de video, audio, logos.

Estos recursos alimentan las animaciones (vía `remotion-app/public/`) y los
specs (como referencia visual). No son output del pipeline — son input.

## Sub-carpetas

| Carpeta    | Contenido                                                      |
| ---------- | -------------------------------------------------------------- |
| `images/`  | Fotos, screenshots, diagramas PNG/SVG, fondos.                 |
| `videos/`  | Clips cortos de referencia o b-roll (no raw-videos completos). |
| `audio/`   | Música, efectos de sonido, voiceovers grabados.                |
| `logos/`   | Logo del curso, iconos del canal, marcas de terceros.          |

## Naming convention

Seguir el slug raíz del episodio cuando el asset es específico de un video:

> `<YYYY-MM-DD>_<slug>_<descriptor>.<ext>`  
> Ej: `2026-05-22_intro-al-curso_hero-bg.png`

Para assets genéricos (reutilizables entre episodios):

> `<descriptor-descriptivo>.<ext>`  
> Ej: `logo-curso-blanco.svg`, `transicion-whoosh.mp3`

## Integración con Remotion

Remotion accede a archivos estáticos vía `staticFile()`, que resuelve desde
`remotion-app/public/`. Para usar un asset en una animación:

1. Copiar o symlinkar el archivo a `animations/remotion-app/public/assets/`.
2. En el código: `staticFile("assets/hero-bg.png")`.

> Regla temporal: esta copia es manual. Cuando duela, automatizar con un
> script o skill.

## Relación con `raw-videos/`

`raw-videos/` contiene las grabaciones de cámara del usuario (archivos pesados,
fuera del pipeline de animación). Si un clip de `raw-videos/` se necesita en
una animación, recortar la porción relevante y copiarla a `assets/videos/`.

## Qué NO hacer

- No guardar renders terminados acá (van a `animations/renders/`).
- No subir assets > 100 MB sin Git LFS.
- No duplicar un asset para cada episodio: si es genérico, dejarlo sin slug.
