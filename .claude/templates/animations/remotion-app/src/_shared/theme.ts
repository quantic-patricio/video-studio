export const colors = {
  bgDeep: "{{design.palette.bg_deep}}",
  bgBase: "{{design.palette.bg_base}}",
  bgElevated: "{{design.palette.bg_elevated}}",
  bgSubtle: "{{design.palette.bg_subtle}}",

  fgPrimary: "{{design.palette.fg_primary}}",
  fgSecondary: "{{design.palette.fg_secondary}}",
  fgMuted: "{{design.palette.fg_muted}}",

  accentWarm: "{{design.palette.accent_warm}}",
  accentWarmGlow: "{{design.palette.accent_warm_glow}}",
  accentCool: "{{design.palette.accent_cool}}",
  accentCoolGlow: "{{design.palette.accent_cool_glow}}",

  success: "{{design.palette.success}}",
  error: "{{design.palette.error}}",

  border: "{{design.palette.border}}",
  borderAccent: "{{design.palette.border_accent}}",
  surfaceGlass: "{{design.palette.surface_glass}}",
} as const;

export const fonts = {
  display: "{{design.typography.display_font}}, sans-serif",
  body: "{{design.typography.body_font}}, sans-serif",
  code: "{{design.typography.code_font}}, monospace",
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
