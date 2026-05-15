import { useColorScheme } from "react-native";
import { colors } from "@/theme/tokens";

export function useColorTone() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return {
    isDark,
    bg: isDark ? colors.ink : colors.cream,
    fg: isDark ? colors.cream : colors.ink,
    fgSoft: isDark ? colors.creamDeep : colors.inkSoft,
    accent: isDark ? colors.goldSoft : colors.gold,
    paper: isDark ? "#2A3744" : colors.paper,
    line: isDark ? "rgba(245, 241, 232, 0.15)" : colors.line,
  } as const;
}
