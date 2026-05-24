import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { CipherText } from "./CipherText";
import { colors, fonts } from "./theme";

export const CipherTextPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bgDeep,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CipherText
        text="Hola"
        progress={progress}
        style={{
          fontFamily: fonts.display,
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: -2,
          color: colors.fgPrimary,
        }}
      />
    </AbsoluteFill>
  );
};
