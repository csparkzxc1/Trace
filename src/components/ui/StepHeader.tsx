import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme/tokens";

type Props = {
  step: number;
  total: number;
  title: string;
};

export function StepHeader({ step, total, title }: Props) {
  return (
    <View>
      <Text style={styles.label}>
        STEP {step} · {total}
      </Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2.4,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
    marginTop: 8,
    letterSpacing: -0.3,
  },
});
