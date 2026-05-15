import { useState } from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Input, Button, Checkbox } from "@/components/ui";
import { Wordmark } from "@/components/brand";
import * as authApi from "@/lib/api/auth";
import { colors, fonts } from "@/theme/tokens";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  async function onSubmit() {
    if (!agreeTerms || !agreePrivacy) {
      setError("이용약관과 개인정보처리방침에 동의해주세요");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const session = await authApi.signUpWithPassword(
        email.trim(),
        password,
        displayName.trim() || email.split("@")[0] || "벗",
      );
      if (session?.user) {
        await authApi.upsertProfile({
          id: session.user.id,
          email: session.user.email ?? email.trim(),
          display_name: displayName.trim() || (email.split("@")[0] ?? "벗"),
        });
      }
      router.replace("/(auth)/onboarding/step-1-welcome");
    } catch (e) {
      setError(e instanceof Error ? e.message : "다시 시도해주세요");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Wordmark variant="ko" size={40} />
      </View>
      <Text style={styles.title}>흔적을 시작합니다</Text>
      <Text style={styles.sub}>
        점수가 아닌 흔적이 남는 자리. 천천히 동행해도 괜찮습니다.
      </Text>

      <View style={{ height: 24 }} />

      <Input
        label="이름 또는 별명"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <View style={{ height: 16 }} />
      <Input
        label="이메일"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <View style={{ height: 16 }} />
      <Input
        label="비밀번호 (8자 이상)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={{ height: 24 }} />
      <Checkbox
        checked={agreeTerms}
        onToggle={setAgreeTerms}
        label="(필수) 이용약관에 동의합니다"
      />
      <Pressable
        onPress={() => Linking.openURL("https://trace.faith/legal/terms")}
      >
        <Text style={styles.legalLink}>약관 보기</Text>
      </Pressable>
      <View style={{ height: 12 }} />
      <Checkbox
        checked={agreePrivacy}
        onToggle={setAgreePrivacy}
        label="(필수) 개인정보처리방침에 동의합니다"
      />
      <Pressable
        onPress={() => Linking.openURL("https://trace.faith/legal/privacy")}
      >
        <Text style={styles.legalLink}>방침 보기</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={{ height: 24 }} />
      <Button
        label="계속하기"
        size="lg"
        loading={loading}
        onPress={onSubmit}
      />
      <View style={{ height: 12 }} />
      <Button
        label="이미 계정이 있어요"
        variant="ghost"
        onPress={() => router.push("/(auth)/login")}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "flex-start", marginTop: 8 },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
    marginTop: 24,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 8,
    lineHeight: 20,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.burgundy,
    marginTop: 12,
  },
  legalLink: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.gold,
    marginLeft: 34,
    marginTop: 4,
    textDecorationLine: "underline",
  },
});
