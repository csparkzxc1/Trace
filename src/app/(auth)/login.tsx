import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Input, Button } from "@/components/ui";
import { Wordmark } from "@/components/brand";
import * as authApi from "@/lib/api/auth";
import { colors, fonts } from "@/theme/tokens";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    setError(null);
    try {
      await authApi.signInWithPassword(email.trim(), password);
      router.replace("/(tabs)/today");
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
      <Text style={styles.title}>다시 만나서 반갑습니다</Text>

      <View style={{ height: 32 }} />

      <Input
        label="이메일"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <View style={{ height: 16 }} />
      <Input
        label="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={{ height: 32 }} />
      <Button
        label="로그인"
        size="lg"
        loading={loading}
        onPress={onSubmit}
      />
      <View style={{ height: 12 }} />
      <Button
        label="계정 만들기"
        variant="ghost"
        onPress={() => router.push("/(auth)/signup")}
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
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.burgundy,
    marginTop: 12,
  },
});
