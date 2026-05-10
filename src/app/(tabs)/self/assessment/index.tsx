import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Button, Card } from "@/components/ui";
import { colors, fonts } from "@/theme/tokens";

export default function AssessmentIntro() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Text style={styles.title}>자가진단</Text>
      <Text style={styles.label}>SELF · ASSESSMENT</Text>

      <View style={{ height: 24 }} />

      <Card>
        <Text style={styles.desc}>
          7가지 영역을 짧게 돌아보는 시간입니다.{"\n"}
          정답을 찾는 것이 아니라, 마음의 자리를 살피는 도구입니다.
        </Text>
      </Card>

      <View style={{ height: 16 }} />
      <Text style={styles.helper}>
        분기마다 한 번 권장. 결과는 시계열로 저장되며, 다른 사람에게 공유되지 않습니다.
      </Text>

      <View style={{ flex: 1 }} />

      <Button
        label="시작하기"
        size="lg"
        onPress={() => router.push("/(tabs)/self/assessment/quiz")}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  label: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2.4,
    marginTop: 8,
  },
  desc: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    lineHeight: 24,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 20,
  },
});
