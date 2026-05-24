import { AbsoluteFill } from "remotion";
import { PhoneMockup } from "./PhoneMockup";
import { colors, fonts } from "./theme";

export const PhoneMockupPreview: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bgDeep,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PhoneMockup>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.body,
            fontSize: 14,
            color: colors.fgSecondary,
          }}
        >
          Screen Content
        </div>
      </PhoneMockup>
    </AbsoluteFill>
  );
};
