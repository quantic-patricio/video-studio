import { AbsoluteFill } from "remotion";
import { NarrationOverlay } from "./NarrationOverlay";

export const NarrationOverlayPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#030712" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: 48,
          fontWeight: 700,
          color: "#F9FAFB",
        }}
      >
        Hola
      </div>
      <NarrationOverlay
        text='Acabás de escribir "Hola" y tocar enviar. Seis letras. Algunos segundos de tu vida. Pero ese mensaje, antes de llegar al otro teléfono, fue cifrado con matemáticas que ninguna computadora actual puede romper.'
        beatLabel="Beat 1 · Hook"
        timeRange="00:00–00:15"
      />
    </AbsoluteFill>
  );
};
