import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import type { GestureResponderEvent, PressableProps } from "react-native";
import { colors, fonts, radii } from "@/theme/tokens";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type Props = Omit<PressableProps, "children" | "style"> & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
};

export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  onPress,
  ...rest
}: Props) {
  const isDisabled = disabled || loading;
  const palette = paletteFor(variant, isDisabled);
  const heights = size === "lg" ? styles.lg : styles.md;

  return (
    <Pressable
      {...rest}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        heights,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: pressed && !isDisabled ? 0.85 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <Text style={[styles.label, { color: palette.fg }]}>{label}</Text>
      )}
    </Pressable>
  );
}

function paletteFor(variant: Variant, disabled: boolean) {
  if (disabled) {
    return { bg: colors.creamDeep, fg: colors.inkSoft, border: "transparent" };
  }
  if (variant === "primary") {
    return { bg: colors.ink, fg: colors.cream, border: "transparent" };
  }
  if (variant === "secondary") {
    return { bg: "transparent", fg: colors.ink, border: colors.ink };
  }
  return { bg: "transparent", fg: colors.ink, border: "transparent" };
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.sm,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  md: { height: 48 },
  lg: { height: 56 },
  label: {
    fontFamily: fonts.body,
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
