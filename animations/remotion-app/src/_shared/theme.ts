export const colors = {
  bgDeep: "#030712",
  bgBase: "#0a0f1a",
  bgElevated: "#111827",
  bgSubtle: "#1f2937",

  fgPrimary: "#F9FAFB",
  fgSecondary: "#9CA3AF",
  fgMuted: "#6B7280",

  accentWarm: "#F59E0B",
  accentWarmGlow: "rgba(245, 158, 11, 0.15)",
  accentCool: "#6366F1",
  accentCoolGlow: "rgba(99, 102, 241, 0.12)",

  success: "#10B981",
  error: "#EF4444",

  border: "rgba(255, 255, 255, 0.08)",
  borderAccent: "rgba(245, 158, 11, 0.25)",
  surfaceGlass: "rgba(255, 255, 255, 0.05)",
} as const;

export const fonts = {
  display: "Space Grotesk, sans-serif",
  body: "Inter, sans-serif",
  code: "JetBrains Mono, monospace",
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
