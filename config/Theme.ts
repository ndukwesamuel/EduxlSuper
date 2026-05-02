export const Colors = {
  // Backgrounds
  ink: "#0B0D11",
  ink2: "#13161C",
  ink3: "#1C2028",
  ink4: "#252A35",

  // Accents
  lime: "#C8F135",
  limeDim: "rgba(200,241,53,0.14)",
  limeGlow: "rgba(200,241,53,0.28)",

  amber: "#FFC453",
  amberDim: "rgba(255,196,83,0.14)",

  sky: "#58C8FF",
  skyDim: "rgba(88,200,255,0.14)",

  rose: "#FF6B81",
  roseDim: "rgba(255,107,129,0.14)",

  mint: "#34E8B0",
  mintDim: "rgba(52,232,176,0.14)",

  violet: "#B89DFF",
  violetDim: "rgba(184,157,255,0.14)",

  // Text
  t1: "#F0F2F7",
  t2: "#8B93A6",
  t3: "#4E5668",
  t4: "#2E3444",

  // Borders
  border: "rgba(255,255,255,0.07)",
  border2: "rgba(255,255,255,0.12)",

  white: "#FFFFFF",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

export type ColorKeys = keyof typeof Colors;
export type SpacingKeys = keyof typeof Spacing;
export type RadiusKeys = keyof typeof Radius;
