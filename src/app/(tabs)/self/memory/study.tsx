import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Card, Button } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as memoryApi from "@/lib/api/memory";
import { useVoiceRecorder } from "@/features/memory/use-voice-recorder";
import {
  similarity,
  qualityFromSimilarity,
} from "@/lib/utils/text-similarity";
import type { ScriptureMemory } from "@/types/database";
import { SRS_QUALITY_LABELS_KO, type SrsQuality } from "@/types/domain";
import { colors, fonts } from "@/theme/tokens";

type Mode = "blank" | "first-letter" | "full" | "voice";

function maskBlanks(text: string): string {
  return text.replace(/[가-힣]{2,}/g, (w) =>
    w.length > 2 ? w[0] + "○".repeat(w.length - 1) : "○○",
  );
}

function firstLetters(text: string): string {
  return text.replace(/[가-힣]{2,}/g, (w) => w[0] + "ㆍ".repeat(w.length - 1));
}

export default function MemoryStudy() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const [queue, setQueue] = useState<ScriptureMemory[]>([]);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("blank");

  useEffect(() => {
    if (!userId) return;
    memoryApi.fetchDueCards(userId, 20).then(setQueue).catch(() => {});
  }, [userId]);

  const card = queue[index];
  const voice = useVoiceRecorder();
  const [voiceScore, setVoiceScore] = useState<number | null>(null);

  async function grade(quality: SrsQuality) {
    if (!card) return;
    await memoryApi.gradeCard(card, quality);
    if (index + 1 >= queue.length) {
      router.replace("/(tabs)/self/memory");
      return;
    }
    setIndex(index + 1);
    setMode("blank");
    setVoiceScore(null);
    voice.reset();
  }

  async function stopAndScore() {
    const text = await voice.stop();
    if (text == null || !card) return;
    const score = similarity(card.text, text);
    setVoiceScore(score);
  }

  if (!card) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.done}>오늘의 복습이 끝났습니다 ·</Text>
          <Button
            label="목록으로"
            variant="ghost"
            onPress={() => router.back()}
          />
        </View>
      </ScreenContainer>
    );
  }

  const display =
    mode === "blank"
      ? maskBlanks(card.text)
      : mode === "first-letter"
        ? firstLetters(card.text)
        : card.text;

  return (
    <ScreenContainer scroll>
      <Text style={styles.step}>
        {index + 1} / {queue.length}
      </Text>

      <View style={{ height: 16 }} />

      <Card>
        <Text style={styles.ref}>{card.reference}</Text>
        <Text style={styles.text}>{display}</Text>
      </Card>

      <View style={{ height: 16 }} />
      <View style={styles.modeRow}>
        {(["blank", "first-letter", "full", "voice"] as Mode[]).map((m) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
          >
            <Text style={styles.modeLabel}>
              {m === "blank"
                ? "빈칸"
                : m === "first-letter"
                  ? "첫글자"
                  : m === "voice"
                    ? "음성"
                    : "정답"}
            </Text>
          </Pressable>
        ))}
      </View>

      {mode === "voice" ? (
        <View style={{ marginTop: 16 }}>
          {voice.state === "idle" || voice.state === "ready" ? (
            <Button
              label={voice.state === "ready" ? "다시 녹음" : "녹음 시작"}
              onPress={voice.start}
            />
          ) : null}
          {voice.state === "recording" ? (
            <Button label="녹음 끝내기" onPress={stopAndScore} />
          ) : null}
          {voice.state === "processing" ? (
            <Text style={styles.voiceHint}>전사 중…</Text>
          ) : null}
          {voice.state === "error" ? (
            <Text style={styles.voiceHint}>
              마이크 권한을 허용한 뒤 다시 시도해주세요
            </Text>
          ) : null}
          {voice.transcript ? (
            <View style={styles.transcriptBox}>
              <Text style={styles.transcriptLabel}>들은 말</Text>
              <Text style={styles.transcript}>{voice.transcript}</Text>
              {voiceScore !== null ? (
                <Text style={styles.scoreLine}>
                  유사도{" "}
                  <Text style={styles.scoreNum}>
                    {Math.round(voiceScore * 100)}
                  </Text>
                  % · 추천 채점{" "}
                  <Text style={styles.scoreNum}>
                    {SRS_QUALITY_LABELS_KO[qualityFromSimilarity(voiceScore)]}
                  </Text>
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={{ height: 24 }} />

      <Text style={styles.gradeLabel}>얼마나 떠올랐나요?</Text>
      <View style={styles.gradeRow}>
        {([0, 1, 2, 3] as SrsQuality[]).map((q) => (
          <Pressable
            key={q}
            onPress={() => grade(q)}
            style={({ pressed }) => [
              styles.grade,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.gradeText}>{SRS_QUALITY_LABELS_KO[q]}</Text>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  step: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 13,
    color: colors.gold,
    letterSpacing: 1.6,
    textAlign: "right",
  },
  ref: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 1.6,
  },
  text: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
    marginTop: 12,
    lineHeight: 30,
  },
  modeRow: {
    flexDirection: "row",
    gap: 8,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    alignItems: "center",
  },
  modeBtnActive: {
    borderColor: colors.ink,
    backgroundColor: colors.creamDeep,
  },
  modeLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ink,
  },
  gradeLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginBottom: 8,
  },
  gradeRow: {
    flexDirection: "row",
    gap: 8,
  },
  grade: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    alignItems: "center",
  },
  gradeText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  done: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    marginBottom: 16,
  },
  voiceHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: "center",
    marginTop: 12,
  },
  transcriptBox: {
    marginTop: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    borderRadius: 4,
  },
  transcriptLabel: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 1.6,
  },
  transcript: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    marginTop: 6,
    lineHeight: 22,
  },
  scoreLine: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 12,
  },
  scoreNum: {
    fontFamily: fonts.accentBold,
    color: colors.burgundy,
  },
});
