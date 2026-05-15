import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Button, StepHeader } from "@/components/ui";
import { colors, fonts } from "@/theme/tokens";

export default function StepOne() {
  const router = useRouter();

  return (
    <ScreenContainer scroll>
      <StepHeader step={1} total={5} title="흔적은 점수가 아닙니다" />

      <View style={{ height: 32 }} />

      <Text style={styles.body}>
        하루 7가지를 모두 채우지 않아도 괜찮습니다.{"\n"}
        4가지를 시작한 날에도 흔적은 남습니다.{"\n"}
        끊어져도 다시 시작할 수 있습니다.
      </Text>

      <View style={{ height: 24 }} />

      <Text style={styles.body}>
        구역 멤버끼리는 서로의 노트나 메모를 보지 못합니다.{"\n"}
        나의 동행은 나의 자율 안에서 이어집니다.
      </Text>

      <View style={{ flex: 1 }} />

      <Text style={styles.tagline}>천천히 가도 괜찮습니다.</Text>

      <View style={{ height: 24 }} />
      <Button
        label="동의하고 계속하기"
        size="lg"
        onPress={() => router.push("/(auth)/onboarding/step-2-church")}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.ink,
    lineHeight: 28,
  },
  tagline: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 18,
    color: colors.burgundy,
    textAlign: "center",
    marginTop: 24,
  },
});
