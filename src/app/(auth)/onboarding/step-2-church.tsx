import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Input, Button, StepHeader } from "@/components/ui";
import { useOnboardingStore } from "@/features/auth/onboarding-store";
import { colors, fonts } from "@/theme/tokens";

export default function StepChurch() {
  const router = useRouter();
  const set = useOnboardingStore((s) => s.set);
  const [church, setChurch] = useState("");

  function next() {
    set({ churchName: church.trim() || null });
    router.push("/(auth)/onboarding/step-3-cell");
  }

  return (
    <ScreenContainer scroll>
      <StepHeader step={2} total={5} title="섬기시는 교회를 알려주세요" />
      <Text style={styles.helper}>나중에 변경할 수 있습니다.</Text>

      <View style={{ height: 32 }} />

      <Input
        label="교회 이름"
        placeholder="예: 사랑의교회"
        value={church}
        onChangeText={setChurch}
      />

      <View style={{ flex: 1 }} />

      <Button label="계속하기" size="lg" onPress={next} />
      <View style={{ height: 12 }} />
      <Button
        label="아직 교회를 정하지 않았어요"
        variant="ghost"
        onPress={() => {
          set({ churchName: null });
          router.push("/(auth)/onboarding/step-3-cell");
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
  },
});
