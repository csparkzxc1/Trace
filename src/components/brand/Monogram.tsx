import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme/tokens";

export type MonogramMode = "light" | "dark" | "gold";

type Props = {
  size?: number;
  mode?: MonogramMode;
  testID?: string;
};

export function Monogram({ size = 64, mode = "light", testID }: Props) {
  const palette = paletteFor(mode);
  const isSmall = size <= 48;

  return (
    <View
      testID={testID}
      accessibilityLabel="흔"
      style={[
        styles.container,
        { width: size, height: size, backgroundColor: palette.bg },
      ]}
    >
      <Text
        style={[
          styles.glyph,
          {
            fontFamily: isSmall ? fonts.displayBold : fonts.display,
            fontSize: size * 0.66,
            color: palette.fg,
          },
        ]}
      >
        흔
      </Text>
    </View>
  );
}

function paletteFor(mode: MonogramMode) {
  if (mode === "dark") return { bg: colors.ink, fg: colors.cream };
  if (mode === "gold") return { bg: colors.cream, fg: colors.gold };
  return { bg: colors.cream, fg: colors.ink };
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: {
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
