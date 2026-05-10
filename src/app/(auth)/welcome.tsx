import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Wordmark } from "@/components/brand";
import { Button, KakaoButton } from "@/components/ui";
import { signInWithKakao } from "@/features/auth/oauth";
import { colors, fonts } from "@/theme/tokens";

export default function Welcome() {
  const router = useRouter();
  const [kakaoBusy, setKakaoBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loginKakao() {
    setKakaoBusy(true);
    setError(null);
    const r = await signInWithKakao();
    setKakaoBusy(false);
    if (r.ok) {
      router.replace("/(tabs)/today");
      return;
    }
    if (r.reason === "cancelled") return;
    setError("카카오 로그인을 마치지 못했습니다. 잠시 뒤 다시 시도해주세요.");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.center}>
        <Wordmark variant="stacked" size={72} />
        <Text style={styles.tagline}>신앙은 점수가 아닌 흔적입니다.</Text>
      </View>

      <View style={styles.actions}>
        <KakaoButton loading={kakaoBusy} onPress={loginKakao} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerLabel}>또는</Text>
          <View style={styles.line} />
        </View>
        <Button
          label="이메일로 시작하기"
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
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.burgundy,
    marginTop: 8,
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
  },
});
