# Shared Components Registry

Catálogo de componentes compartidos en `_shared/`.
Claude lee este archivo **antes de construir cada escena** para sugerir
componentes existentes y evitar duplicación.

## Cómo usar este archivo

1. **Antes de cada escena** → leer este registry completo.
2. **Sugerir** al usuario qué componentes existentes aplican a la escena.
3. **Si se necesita un patrón nuevo** → preguntar al usuario si estandarizarlo.
4. **Al crear un nuevo `_shared/`** → agregar su entrada aquí inmediatamente.
5. **Al modificar props o comportamiento** → actualizar la entrada correspondiente.

## Formato de cada entrada

```
### NombreDelComponente
- **Path**: `_shared/NombreDelComponente.tsx`
- **Descripción**: qué hace y cuándo usarlo.
- **Props**: lista de props con tipo y default.
- **Variantes de uso**: contextos típicos donde aplica.
- **Preview**: registrado en Root.tsx como `<Composition id="Shared-NombreDelComponente">`.
```

---

## Componentes

### CipherText
- **Path**: `_shared/CipherText.tsx`
- **Descripción**: Efecto "hacker" sobre texto — los caracteres se muestran como aleatorios y se revelan progresivamente (o se scramblean). Controlado por un `progress` (0–1) o por frames de inicio/duración.
- **Exports**:
  - `CipherText` — controlado manualmente por prop `progress`.
  - `CipherTextAnimated` — auto-animado con `startFrame` y `durationFrames`.
- **Props (CipherText)**:
  - `text: string` — el texto final a revelar.
  - `progress: number` — 0 = todo scrambled, 1 = todo revelado. Revela izquierda→derecha.
  - `style?: React.CSSProperties` — estilos inline para el `<span>`.
  - `scrambleSpeed?: number` (default: 3) — cada cuántos frames cambia el carácter aleatorio.
- **Props (CipherTextAnimated)**:
  - `text`, `style`, `scrambleSpeed` — igual que arriba.
  - `startFrame: number` — frame donde arranca la animación.
  - `durationFrames: number` — cuántos frames dura el reveal/scramble completo.
  - `mode?: "reveal" | "scramble"` (default: "reveal") — "reveal" va de scrambled→legible, "scramble" va de legible→ilegible.
- **Variantes de uso**:
  - Hook: texto "Hola" se scrambles como flash-forward.
  - Beat 2: "Hola" se cifra (mode="scramble") al explicar E2E encryption.
  - Beat 6: "Hola" se revela al descifrar del otro lado.
- **Preview**: registrado en Root.tsx como `<Composition id="Shared-CipherText">`.

### NarrationOverlay
- **Path**: `_shared/NarrationOverlay.tsx`
- **Descripción**: Barra inferior semi-transparente que muestra el guión/narración sobre la animación. Para uso exclusivo en preview (Remotion Studio) — no se incluye en el render final. Permite leer el texto mientras se ve la animación y evaluar si el timing es correcto.
- **Props**:
  - `text: string` — el texto de la narración para el beat actual.
  - `beatLabel: string` — identificador del beat (ej: "Beat 1 · Hook").
  - `timeRange: string` — rango de tiempo (ej: "00:00–00:15").
  - `visible?: boolean` (default: true) — toggle para mostrar/ocultar.
- **Integración**: la composición principal define un prop `showNarration: boolean` (via zod schema). El `SceneWrapper` pasa la narración del beat actual al overlay. En el render final se pone `showNarration: false`.
- **Variantes de uso**:
  - Preview en Remotion Studio: leer el guión mientras se evalúa el timing.
  - Ajuste de duración: si el texto no cabe en el beat, el beat es muy corto.
- **Preview**: registrado en Root.tsx como `<Composition id="Shared-NarrationOverlay">`.

### LayerStack
- **Path**: `_shared/LayerStack.tsx`
- **Descripción**: Columna vertical de rectángulos apilados representando las capas del stack tecnológico (hardware, SO, app, radio, infra, IA). Cada capa tiene ícono Phosphor, label y colores del design system. Las capas se iluminan progresivamente a medida que el video las revela. Elemento visual recurrente de todo el video.
- **Exports**:
  - `LayerStack` — componente principal.
  - `LayerId` — type union de los IDs de capa: `"hardware" | "os" | "app" | "radio" | "infra" | "ia"`.
  - `LAYER_ORDER` — array con el orden bottom-up de las capas.
- **Props (LayerStack)**:
  - `revealedLayers?: LayerId[]` — capas marcadas como "reveladas" (con color y glow).
  - `highlightLayer?: LayerId` — capa actualmente en foco (glow más intenso).
  - `visibleLayers?: LayerId[]` — subset de capas a renderizar (default: todas).
  - `showLabels?: boolean` (default: true) — mostrar el nombre de cada capa.
  - `animateReveal?: boolean` (default: false) — animar la entrada escalonada de las capas.
  - `revealStartFrame?: number` (default: 0) — frame donde arranca la animación de entrada.
  - `revealStagger?: number` (default: 8) — frames entre la entrada de cada capa.
  - `scale?: number` (default: 1) — factor de escala del componente.
  - `style?: React.CSSProperties` — estilos adicionales del contenedor.
- **Variantes de uso**:
  - Contexto: stack aparece como reveal desde el punto "hoy" de la timeline.
  - Beats 1–5: cada beat marca una capa como revealed.
  - Beat 6: el stack se recorre en reversa.
  - Beats 7–8: fallas visuales y zoom al fondo del stack.
  - Beat 9: se agrega la capa "IA".
