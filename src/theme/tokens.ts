export const colors = {
  cream: "#F5F1E8",
  creamDeep: "#ECE5D3",
  paper: "#FAF7EE",
  ink: "#1F2A37",
  inkSoft: "#4A5568",
  gold: "#B8924F",
  goldSoft: "#D4B57A",
  burgundy: "#7A2E2E",
  sage: "#6B7F5A",
  line: "rgba(31, 42, 55, 0.12)",
} as const;

export const fonts = {
  display: "NotoSerifKR_500Medium",
  displayBold: "NotoSerifKR_700Bold",
  body: "GowunDodum_400Regular",
  accent: "CormorantGaramond_500Medium_Italic",
  accentBold: "CormorantGaramond_600SemiBold",
} as const;

export const spacing = [0, 4, 8, 12, 16, 20, 24, 32, 40, 56, 80] as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 22,
  xl: 28,
  xxl: 38,
  hero: 56,
} as const;

export const motion = {
  splashFadeIn: 600,
  splashTaglineDelay: 300,
  splashTaglineFadeIn: 400,
  splashTotal: 1500,
} as const;

export type ColorToken = keyof typeof colors;
export type FontToken = keyof typeof fonts;
export type FontSizeToken = keyof typeof fontSize;
export type RadiusToken = keyof typeof radii;
