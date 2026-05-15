// Apple Sign-In 가이드라인 (HIG):
// - 흰 배경 + 검정 텍스트, 또는 검정 배경 + 흰 텍스트
// - "Sign in with Apple" / "Apple로 로그인" 표준 레이블
// 본 프로젝트는 라이트 모드 cream 배경에서 ink 버튼 유지 (정책 호환)

import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import type { GestureResponderEvent } from "react-native";
import { colors, fonts, radii } from "@/theme/tokens";

type Props = {
  label?: string;
  loading?: boolean;
  onPress: (e: GestureResponderEvent) => void;
};

export function AppleButton({
  label = "Apple로 시작하기",
  loading,
  onPress,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.btn,
        { opacity: pressed && !loading ? 0.85 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.cream} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    backgroundColor: colors.ink,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.cream,
    letterSpacing: 0.2,
  },
});
