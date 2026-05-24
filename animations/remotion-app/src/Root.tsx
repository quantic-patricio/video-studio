import { Composition } from "remotion";
import { z } from "zod";
import {
  LoQuePasaCuandoEnviasHola,
  TOTAL_FRAMES,
} from "./compositions/2026-05-23_lo-que-pasa-cuando-envias-hola";
import { CipherTextPreview } from "./_shared/CipherTextPreview";
import { NarrationOverlayPreview } from "./_shared/NarrationOverlayPreview";
import { PhoneMockupPreview } from "./_shared/PhoneMockupPreview";

const episodeSchema = z.object({
  showNarration: z.boolean(),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="2026-05-23-lo-que-pasa-cuando-envias-hola"
        component={LoQuePasaCuandoEnviasHola}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
        schema={episodeSchema}
        defaultProps={{ showNarration: false }}
      />
      <Composition
        id="Shared-CipherText"
        component={CipherTextPreview}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Shared-NarrationOverlay"
        component={NarrationOverlayPreview}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Shared-PhoneMockup"
        component={PhoneMockupPreview}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
