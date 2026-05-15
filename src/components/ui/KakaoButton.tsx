// 카카오 디자인 가이드 — 노란 배경(#FEE500) + 검정 텍스트.
// 본 프로젝트 브랜드는 타이포 중심이지만 카카오 정책상 색상 변경 불가.
// 다른 화면과 시각적으로 분리하기 위해 라운드는 4px(절제) 유지.

import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import type { GestureResponderEvent } from "react-native";
import { fonts, radii } from "@/theme/tokens";

type Props = {
  label?: string;
  loading?: boolean;
  onPress: (e: GestureResponderEvent) => void;
};

export function KakaoButton({ label = "카카오로 시작하기", loading, onPress }: Props) {
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
        <ActivityIndicator color="#1A1A1A" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    backgroundColor: "#FEE500",
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: "#1A1A1A",
    letterSpacing: 0.2,
  },
});
