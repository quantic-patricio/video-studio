# Workspace: animations

## Propósito

Pipeline **script → spec → build → render** usando Remotion + Claude Code.
El usuario no toca código React. La pieza central es el **spec**, no el código.

## Design system

El studio tiene un design system global en `animations/design-system/`:
`palette.md`, `typography.md`, `motion.md`, `components.md`.

Leer **antes de generar un spec o construir una animación**. Cada spec puede
sobrescribir tokens específicos, pero el default es el del sistema.

## Las 4 etapas

1. **Script** — viene de `scripts/{long-form,short-form}/<slug>.md`. Input al pipeline.
2. **Spec** — `animations/specs/<slug>.spec.md`. Storyboard en MD. **Pieza más importante.**
3. **Build** — `animations/remotion-app/src/compositions/<slug>/`. Código React generado por Claude desde el spec.
4. **Render** — `animations/renders/<slug>.mp4`. Output final para CapCut.

## Qué contiene un spec (y qué NO)

**SÍ**:
- *Beat map*: cada momento, qué pasa, cuánto dura, qué se ve, qué se dice.
- *Visual philosophy*: paleta, tipografía, mood, referencias estéticas.
- *Key moments*: las 2–3 escenas que tienen que salir perfectas.
- *Audio sync points*: marcas donde animación y narración se alinean.

**NO**:
- Frame numbers exactos (`frame={48}`).
- Pixel positions (`top: 234px`).
- Component props (`<Title fontSize={64} color="#fff" />`).
- Código React, JSX, ningún snippet.

> Regla: sobre-restringir el spec **empeora** las
> animaciones. El modelo necesita libertad creativa controlada por intención,
> no por geometría.

Ver `animations/specs/_template.spec.md` para la plantilla.

## Build workflow — escena por escena

Al construir una animación desde un spec, **no construir todo de una vez**.
Seguir este flujo por cada beat/escena del spec:

1. **Mostrar el fragmento del guión** correspondiente a la escena actual.
2. **Leer `_shared/REGISTRY.md`** e identificar componentes existentes que apliquen.
3. **Sugerir** los componentes existentes al usuario. Si no hay ninguno que aplique
   y la escena necesita un patrón visual reutilizable, **preguntar al usuario** si
   quiere estandarizarlo como `_shared/`.
4. **Construir** la escena (invocar `ui-ux-pro-max` si es obligatorio según routing).
5. **Esperar feedback** del usuario. Iterar hasta que apruebe.
6. **Avanzar** a la siguiente escena. No continuar sin aprobación.

Si en el paso 3 el usuario aprueba un nuevo componente compartido:
- Crearlo en `remotion-app/src/_shared/`.
- Registrarlo en `_shared/REGISTRY.md` inmediatamente.
- Registrarlo como `<Composition>` en `Root.tsx` para preview en Remotion Studio.

## Narración en preview

Cada composición tiene un prop `showNarration` (zod schema, default `true`).
Cuando está activo, el componente `NarrationOverlay` (ver REGISTRY.md) muestra
una barra inferior semi-transparente con el texto del guión, el nombre del beat
y el rango de tiempo. Esto permite leer la narración mientras se ve la animación
y decidir si el timing del beat es correcto.

**Patrón de integración**:
- Cada beat define su narración en el archivo de datos del episodio (ej: `narration.ts`).
- El `SceneWrapper` recibe la narración del beat actual y la pasa a `NarrationOverlay`.
- Para el render final: `showNarration: false` — el overlay no aparece en el mp4.

## Componentes compartidos (`_shared/`)

Los componentes reutilizables viven en `remotion-app/src/_shared/`.

- **Registry**: `remotion-app/src/_shared/REGISTRY.md` es la **única fuente**
  para decidir qué componentes usar. Claude lee **solo REGISTRY.md** para
  sugerir componentes — **nunca leer los archivos `.tsx` de `_shared/` ni
  de `compositions/` para explorar qué existe**. Todo lo que Claude necesita
  saber está en el registry: nombre, descripción, props, variantes de uso.
- **Regla de extracción**: un componente se mueve a `_shared/` cuando se usa
  en 2+ compositions **o cuando el usuario lo aprueba explícitamente**.
- **Showcase**: `npm run showcase` abre una galería web para navegar y
  previsualizar los componentes. También se ven en Remotion Studio como
  compositions individuales.
- **No explorar código fuente**: para saber qué componentes existen, leer
  REGISTRY.md. Para saber cómo usarlos, leer REGISTRY.md. Solo abrir el
  `.tsx` si hay que **modificar** el componente.

## Sub-carpetas

```
animations/
├── CONTEXT.md            ← este archivo
├── design-system/        ← paleta, tipografía, motion, componentes
│   ├── CONTEXT.md
│   ├── palette.md
│   ├── typography.md
│   ├── motion.md
│   └── components.md
├── specs/                ← storyboards MD (uno por episodio)
├── remotion-app/         ← proyecto Node + Remotion
│   ├── package.json
│   ├── src/
│   │   ├── Root.tsx      ← registra compositions + previews de _shared/
│   │   ├── _shared/      ← componentes React reutilizables
│   │   │   └── REGISTRY.md  ← catálogo (Claude lo lee antes de cada escena)
│   │   ├── showcase/     ← galería web de componentes
│   │   └── compositions/
│   │       └── <slug>/   ← una carpeta por episodio
│   └── ...
└── renders/              ← mp4 finales
```

## Comandos típicos

Todo se corre desde `animations/remotion-app/`:

```bash
npm install                          # primera vez
npm start                            # dev preview (Remotion Studio en :3000)
npm run showcase                     # galería web de componentes _shared/
npx remotion render <comp-id>        # render headless del comp registrado
```

## Visual philosophy

Definida en `design-system/`. Resumen ejecutivo:
- **Mood**: misterioso, cautivador, moderno. Oscuridad con destellos cálidos.
- **Paleta**: fondos deep-dark (#030712), accent ámbar (#F59E0B) para reveals,
  accent indigo (#6366F1) para tech/estructura.
- **Tipografía**: Space Grotesk (display) + Inter (body) + JetBrains Mono (code).
- **Motion**: easing `bezier(0.16,1,0.3,1)` para entradas, springs para énfasis,
  todo a 30 fps, max 2 elementos animándose a la vez.

## Skill: ui-ux-pro-max

Al construir una animación o ajustar el design system, invocar la skill
`ui-ux-pro-max:ui-ux-pro-max` para obtener guía de diseño alineada al estilo
del studio.

**Estilo seleccionado**: Modern Dark Cinema.  
**Query base para la skill**:
```
educational video dark cinematic mysterious captivating modern AI course
```

**Cuándo invocarla**:
- Al crear un componente visual nuevo que no está en `design-system/components.md`.
- Al necesitar guía sobre un patrón de UI no cubierto (ej: chart, tabla, layout).
- Al validar decisiones de color, tipografía o motion contra best practices.
- Al ajustar o extender el design system global.

**Cuándo NO invocarla**:
- Si el spec ya referencia componentes documentados en el design system.
- Durante el render (no hay decisiones de diseño en esa fase).

## Stack técnico

- **Remotion** (React + TypeScript) para animaciones programáticas.
- **TailwindCSS v4** para utilities. Los tokens del design system están
  definidos en `remotion-app/src/style.css` bajo `@theme`.
- Fonts cargados via `@remotion/google-fonts` o `staticFile()`.
- **Phosphor Icons** (`@phosphor-icons/react`) para todos los iconos.
  6 pesos: `thin`, `light`, `regular`, `bold`, `fill`, `duotone`.
  Uso: `import { Lock, Check } from "@phosphor-icons/react"`, con prop `weight`.
  **Prohibido**: iconos ASCII/emoji (🔒, →, ✕, ✓, ●) en animaciones.

## Qué NO hacer

- No escribir el spec mientras se construye el código (separá fases).
- No editar el código bajo `compositions/<slug>/` para "arreglar" algo del spec:
  arreglar el spec primero y regenerar.
- No mezclar compositions de distintos episodios en una sola carpeta.
- No commitear los `renders/` pesados sin Git LFS.
- No usar iconos ASCII ni emoji como elementos visuales — usar Phosphor Icons.
