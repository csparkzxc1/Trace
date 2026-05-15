import { Pressable, Text, View, StyleSheet } from "react-native";
import { colors, fonts, radii } from "@/theme/tokens";

type Props = {
  checked: boolean;
  onToggle: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
  testID?: string;
};

export function Checkbox({
  checked,
  onToggle,
  label,
  disabled = false,
  testID,
}: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      onPress={disabled ? undefined : () => onToggle(!checked)}
      style={({ pressed }) => [
        styles.row,
        { opacity: pressed && !disabled ? 0.7 : 1 },
      ]}
      hitSlop={8}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: disabled ? colors.line : colors.ink,
            backgroundColor: checked ? colors.ink : "transparent",
          },
        ]}
      >
        {checked ? <Text style={styles.tick}>·</Text> : null}
      </View>
      {label ? (
        <Text
          style={[
            styles.label,
            { color: disabled ? colors.inkSoft : colors.ink },
          ]}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: radii.sm,
    borderWidth: 1.2,
    alignItems: "center",
    justifyContent: "center",
  },
  tick: {
    fontFamily: fonts.accent,
    fontSize: 28,
    color: colors.cream,
    lineHeight: 22,
    includeFontPadding: false,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 15,
    marginLeft: 12,
  },
});
