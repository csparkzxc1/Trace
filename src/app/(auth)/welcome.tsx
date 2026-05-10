import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui";
import { colors, fonts } from "@/theme/tokens";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.center}>
        <Wordmark variant="stacked" size={72} />
        <Text style={styles.tagline}>신앙은 점수가 아닌 흔적입니다.</Text>
      </View>

      <View style={styles.actions}>
        <Button
          label="시작하기"
          size="lg"
          onPress={() => router.push("/(auth)/onboarding/step-1-welcome")}
        />
        <View style={{ height: 12 }} />
        <Button
          label="이미 계정이 있어요"
          variant="ghost"
          size="md"
          onPress={() => router.push("/(auth)/login")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: 24,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tagline: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 18,
    color: colors.burgundy,
    marginTop: 32,
    textAlign: "center",
  },
  actions: {
    paddingBottom: 24,
  },
});
