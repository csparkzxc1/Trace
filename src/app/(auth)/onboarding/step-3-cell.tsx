import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Input, Button, StepHeader } from "@/components/ui";
import { useOnboardingStore } from "@/features/auth/onboarding-store";
import { colors, fonts } from "@/theme/tokens";

export default function StepCell() {
  const router = useRouter();
  const set = useOnboardingStore((s) => s.set);
  const [code, setCode] = useState("");

  function next() {
    set({ cellInviteCode: code.trim() || null });
    router.push("/(auth)/onboarding/step-4-priorities");
  }

  return (
    <ScreenContainer scroll>
      <StepHeader step={3} total={5} title="구역 코드 (선택)" />
      <Text style={styles.helper}>
        구역 멤버는 서로의 흔적 개수만 봅니다. 노트는 누구도 보지 못합니다.
      </Text>

      <View style={{ height: 32 }} />

      <Input
        label="구역 초대 코드"
        placeholder="예: 흔적-2026-A1"
        autoCapitalize="characters"
        value={code}
        onChangeText={setCode}
      />

      <View style={{ flex: 1 }} />

      <Button label="계속하기" size="lg" onPress={next} />
      <View style={{ height: 12 }} />
      <Button
        label="혼자 시작하기"
        variant="ghost"
        onPress={() => {
          set({ cellInviteCode: null });
          router.push("/(auth)/onboarding/step-4-priorities");
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 8,
    lineHeight: 20,
  },
});
