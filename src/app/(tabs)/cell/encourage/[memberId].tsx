import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer, Input, Button } from "@/components/ui";
import * as cellApi from "@/lib/api/cell";
import { isSafeCopy } from "@/lib/utils/microcopy";
import { colors, fonts } from "@/theme/tokens";

const EMOJIS = ["🌿", "🕯️", "✿", "✦", "·"];

export default function EncourageScreen() {
  const { memberId } = useLocalSearchParams<{ memberId: string }>();
  const router = useRouter();
  const [emoji, setEmoji] = useState<string>(EMOJIS[0]!);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function send() {
    if (!memberId) return;
    if (message && !isSafeCopy(message)) {
      setError("따뜻한 말로 다시 적어주세요");
      return;
    }
    if (message.length > 50) {
      setError("50자 이내로 적어주세요");
      return;
    }
    setSending(true);
    try {
      await cellApi.sendEncouragement(memberId, emoji, message || undefined);
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "다시 시도해주세요");
    } finally {
      setSending(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>격려 보내기</Text>
      <Text style={styles.helper}>
        50자 이내로, 점수보다 마음을 전합니다.
      </Text>

      <View style={{ height: 24 }} />

      <Text style={styles.label}>이모지</Text>
      <View style={styles.emojiRow}>
        {EMOJIS.map((e) => (
          <Pressable
            key={e}
            onPress={() => setEmoji(e)}
            style={[styles.emoji, emoji === e && styles.emojiSelected]}
          >
            <Text style={styles.emojiText}>{e}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ height: 16 }} />
      <Input
        label="짧은 한마디 (선택)"
        value={message}
        onChangeText={(v) => {
          setError(null);
          setMessage(v);
        }}
        placeholder="오늘도 동행합니다"
        maxLength={50}
        multiline
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={{ height: 24 }} />
      <Button label="보내기" size="lg" loading={sending} onPress={send} />
      <View style={{ height: 8 }} />
      <Button label="취소" variant="ghost" onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 8,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginBottom: 8,
  },
  emojiRow: {
    flexDirection: "row",
    gap: 8,
  },
  emoji: {
    width: 56,
    height: 56,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.creamDeep,
  },
  emojiText: {
    fontSize: 28,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.burgundy,
    marginTop: 12,
  },
});
