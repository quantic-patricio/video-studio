import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface NarrationOverlayProps {
  text: string;
  beatLabel: string;
  timeRange: string;
  visible?: boolean;
}

export const NarrationOverlay: React.FC<NarrationOverlayProps> = ({
  text,
  beatLabel,
  timeRange,
  visible = true,
}) => {
  const frame = useCurrentFrame();

  if (!visible) return null;

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(3, 7, 18, 0.88)",
          borderTop: "2px solid rgba(255, 255, 255, 0.1)",
          padding: "28px 60px 36px",
          opacity,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: 24,
              fontWeight: 700,
              color: "#F59E0B",
              letterSpacing: 0.5,
            }}
          >
            {beatLabel}
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 20,
              color: "#6B7280",
            }}
          >
            {timeRange}
          </span>
        </div>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 30,
            lineHeight: 1.5,
            color: "#D1D5DB",
            margin: 0,
          }}
        >
          {text}
        </p>
      </div>
    </AbsoluteFill>
  );
};
