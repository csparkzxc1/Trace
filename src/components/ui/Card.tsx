import { View, StyleSheet } from "react-native";
import type { ViewProps } from "react-native";
import { colors, radii } from "@/theme/tokens";

type Props = ViewProps & {
  inset?: number;
  bordered?: boolean;
};

export function Card({
  inset = 16,
  bordered = true,
  style,
  children,
  ...rest
}: Props) {
  return (
    <View
      {...rest}
      style={[
        styles.base,
        {
          padding: inset,
          borderWidth: bordered ? StyleSheet.hairlineWidth : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.paper,
    borderColor: colors.line,
    borderRadius: radii.sm,
  },
});
