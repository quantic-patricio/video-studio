export const colors = {
  bgDeep: "#000000",
  bgBase: "#0a0a0a",
  bgElevated: "#1a1a1a",
  bgSubtle: "#2a2a2a",

  fgPrimary: "#ffffff",
  fgSecondary: "#999999",
  fgMuted: "#666666",

  accentWarm: "#ff9900",
  accentWarmGlow: "rgba(255, 153, 0, 0.15)",
  accentCool: "#6666ff",
  accentCoolGlow: "rgba(102, 102, 255, 0.12)",

  success: "#00cc77",
  error: "#ff4444",

  border: "rgba(255, 255, 255, 0.08)",
  borderAccent: "rgba(255, 153, 0, 0.25)",
  surfaceGlass: "rgba(255, 255, 255, 0.05)",
} as const;

export const fonts = {
  display: "sans-serif",
  body: "sans-serif",
  code: "monospace",
} as const;

export const fullScreen: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
  backgroundColor: colors.bgDeep,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};
