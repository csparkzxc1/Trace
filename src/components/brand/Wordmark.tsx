import { View, Text, StyleSheet } from "react-native";
import type { ColorValue } from "react-native";
import { colors, fonts } from "@/theme/tokens";

export type WordmarkVariant = "horizontal" | "stacked" | "ko" | "en";

type Props = {
  variant?: WordmarkVariant;
  size?: number;
  tone?: "light" | "dark";
  testID?: string;
};

export function Wordmark({
  variant = "horizontal",
  size = 28,
  tone = "light",
  testID,
}: Props) {
  const inkColor: ColorValue = tone === "dark" ? colors.cream : colors.ink;
  const goldColor: ColorValue = tone === "dark" ? colors.goldSoft : colors.gold;

  if (variant === "ko") {
    return (
      <Text
        testID={testID}
        accessibilityLabel="흔적"
        style={[styles.ko, { fontSize: size, color: inkColor }]}
      >
        흔적
      </Text>
    );
  }

  if (variant === "en") {
    return (
      <Text
        testID={testID}
        accessibilityLabel="Trace"
        style={[styles.en, { fontSize: size, color: inkColor }]}
      >
        Trace
      </Text>
    );
  }

  if (variant === "stacked") {
    const subSize = Math.max(10, Math.round(size * 0.28));
    return (
      <View testID={testID} accessibilityLabel="흔적 Trace" style={styles.stacked}>
        <Text style={[styles.ko, { fontSize: size, color: inkColor }]}>흔적</Text>
        <View style={[styles.rule, { backgroundColor: goldColor }]} />
        <Text
          style={[
            styles.stackedEn,
            { fontSize: subSize, color: goldColor, letterSpacing: subSize * 0.3 },
          ]}
        >
          TRACE
        </Text>
      </View>
    );
  }

  return (
    <View
      testID={testID}
      accessibilityLabel="흔적 · Trace"
      style={styles.horizontalRow}
    >
      <Text style={[styles.ko, { fontSize: size, color: inkColor }]}>흔적</Text>
      <Text
        style={[
          styles.dot,
          { fontSize: size, color: goldColor, marginHorizontal: size * 0.15 },
        ]}
      >
        ·
      </Text>
      <Text style={[styles.en, { fontSize: size, color: inkColor }]}>Trace</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  stacked: {
    alignItems: "center",
  },
  ko: {
    fontFamily: fonts.display,
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  en: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    includeFontPadding: false,
  },
  stackedEn: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    marginTop: 4,
    includeFontPadding: false,
  },
  dot: {
    fontFamily: fonts.accent,
    includeFontPadding: false,
  },
  rule: {
    height: 0.8,
    width: 32,
    marginTop: 6,
  },
});
