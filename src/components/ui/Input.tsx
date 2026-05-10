import { useState, forwardRef } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import type { TextInputProps } from "react-native";
import { colors, fonts } from "@/theme/tokens";

type Props = Omit<TextInputProps, "style"> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, error, helperText, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const lineColor = error
    ? colors.burgundy
    : focused
      ? colors.burgundy
      : colors.line;

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        ref={ref}
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        placeholderTextColor={colors.inkSoft}
        style={[styles.input, { borderBottomColor: lineColor }]}
      />
      {error ? (
        <Text style={[styles.helper, { color: colors.burgundy }]}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginBottom: 6,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.inkSoft,
    marginTop: 6,
  },
});
