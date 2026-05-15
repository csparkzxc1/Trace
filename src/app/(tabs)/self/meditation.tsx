import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Input, Button, Card } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as meditationApi from "@/lib/api/meditation";
import { isPremiumActive } from "@/lib/utils/premium";
import { isSafeCopy } from "@/lib/utils/microcopy";
import { colors, fonts } from "@/theme/tokens";

export default function Meditation() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const isPremium = isPremiumActive(profile);

  const [reference, setReference] = useState("");
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isPremium) {
    return (
      <ScreenContainer scroll>
        <Text style={styles.title}>AI 묵상 동반자</Text>
        <Text style={styles.label}>PREMIUM</Text>
        <View style={{ height: 24 }} />
        <Card>
          <Text style={styles.body}>
            한 절의 말씀과 짧은 메모를 적으면, 따뜻한 묵상 동반의 한마디를
            돌려드립니다. 점수화·정죄 없이 동행을 이어가는 도구입니다.
          </Text>
        </Card>
        <View style={{ height: 24 }} />
        <Button
          label="Premium 살펴보기"
          size="lg"
          onPress={() => router.push("/(tabs)/self/settings/subscription")}
        />
      </ScreenContainer>
    );
  }

  async function generate() {
    if (note && !isSafeCopy(note)) {
      setError("따뜻한 표현으로 다시 적어주세요");
      return;
    }
    if (!reference.trim() || !text.trim()) {
      setError("본문과 구절을 적어주세요");
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const r = await meditationApi.generateMeditation({
        scriptureRef: reference.trim(),
        text: text.trim(),
        userNote: note.trim() || undefined,
      });
      setResult(r.message);
    } catch {
      setError("잠시 뒤 다시 시도해주세요");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>AI 묵상 동반자</Text>
      <Text style={styles.label}>MEDITATION COMPANION</Text>

      <View style={{ height: 24 }} />

      <Input
        label="본문"
        value={reference}
        onChangeText={setReference}
        placeholder="예: 시편 23편"
      />
      <View style={{ height: 16 }} />
      <Input
        label="구절"
        value={text}
        onChangeText={setText}
        multiline
        placeholder="개역개정 본문"
      />
      <View style={{ height: 16 }} />
      <Input
        label="짧은 메모 (선택)"
        value={note}
        onChangeText={setNote}
        multiline
        placeholder="이 말씀에서 머물고 있는 한 마디"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={{ height: 16 }} />
      <Button
        label="묵상 동반 받기"
        size="lg"
        loading={busy}
        onPress={generate}
      />

      {result ? (
        <>
          <View style={{ height: 24 }} />
          <Card>
            <Text style={styles.resultLabel}>오늘의 동반</Text>
            <Text style={styles.resultBody}>{result}</Text>
          </Card>
        </>
      ) : null}

      <View style={{ height: 16 }} />
      <Text style={styles.terms}>
        AI 응답은 사용자의 본문·메모를 바탕으로 생성된 권유형 한 마디입니다.
        신학적 단정이 아닌 묵상의 거울로 받아주세요.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.ink },
  label: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2.4,
    marginTop: 8,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 22,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.burgundy,
    marginTop: 12,
  },
  resultLabel: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 1.6,
  },
  resultBody: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.ink,
    lineHeight: 28,
    marginTop: 8,
  },
  terms: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
    lineHeight: 18,
  },
});
