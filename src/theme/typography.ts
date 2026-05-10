import type { TextStyle } from "react-native";
import { colors, fonts, fontSize } from "./tokens";

export const typography = {
  wordmark: {
    fontFamily: fonts.display,
    color: colors.ink,
    letterSpacing: -0.02 * fontSize.xxl,
  },
  pageTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    color: colors.ink,
    letterSpacing: -0.01 * fontSize.xl,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.md + 1,
    color: colors.ink,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.md,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: fontSize.base,
    color: colors.ink,
  },
  bodySoft: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.inkSoft,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
    color: colors.inkSoft,
  },
  enLabel: {
    fontFamily: fonts.accent,
    fontSize: fontSize.xs + 1,
    color: colors.gold,
    letterSpacing: 0.2 * (fontSize.xs + 1),
  },
  numeric: {
    fontFamily: fonts.accentBold,
    color: colors.burgundy,
  },
  tagline: {
    fontFamily: fonts.accent,
    fontSize: fontSize.md + 1,
    color: colors.burgundy,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
