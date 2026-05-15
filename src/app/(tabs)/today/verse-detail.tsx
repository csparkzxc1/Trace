import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Button, Input, Card } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import { useCheckinStore } from "@/lib/stores/checkin";
import * as memoryApi from "@/lib/api/memory";
import * as checkinApi from "@/lib/api/checkin";
import * as catApi from "@/lib/api/categories";
import { todayIso } from "@/lib/utils/date";
import { pickVerseForDate } from "@/lib/data/verses";
import { isSafeCopy } from "@/lib/utils/microcopy";
import { colors, fonts } from "@/theme/tokens";

export default function VerseDetail() {
  const router = useRouter();
  const date = todayIso();
  const verse = pickVerseForDate(date);
  const userId = useAuthStore((s) => s.user?.id);
  const upsert = useCheckinStore((s) => s.upsert);

  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function saveAsMemoryCard() {
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      await memoryApi.addCard({
        userId,
        reference: verse.reference,
        text: verse.text,
        translation: verse.translation,
      });
      setSaved(true);
    } catch {
      setError("다시 시도해주세요");
    } finally {
      setSaving(false);
    }
  }

  async function saveNoteAsWord() {
    if (!userId) return;
    if (note && !isSafeCopy(note)) {
      setError("따뜻한 말로 다시 적어주세요");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const cats = await catApi.fetchDefaultCategories();
      const wordCat = cats.find((c) => c.slug === "word");
      if (!wordCat) {
        setError("카테고리를 불러오지 못했습니다");
        return;
      }
      const check = await checkinApi.toggleCheckRpc(wordCat.id, date);
      const updated = await checkinApi.updateCheckDetails(check.id, {
        note: note || null,
        scripture_ref: verse.reference,
      });
      upsert(updated);
      router.back();
    } catch {
      setError("다시 시도해주세요");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.center}>
        <Text style={styles.label}>오늘의 말씀</Text>
        <Text style={styles.text}>{verse.text}</Text>
        <View style={styles.rule} />
        <Text style={styles.ref}>
          {verse.reference} · {verse.translation}
        </Text>
      </View>

      <View style={{ height: 24 }} />

      <Card>
        <Text style={styles.cardLabel}>이 말씀에 머무는 한 마디</Text>
        <View style={{ height: 8 }} />
        <Input
          value={note}
          onChangeText={(v) => {
            setError(null);
            setNote(v);
          }}
          placeholder="천천히 적어도 괜찮습니다"
          multiline
        />
        <Text style={styles.helper}>
          저장하면 "말씀 읽기" 카테고리가 오늘 흔적으로 남습니다. 메모는
          본인만 봅니다 — 구역장도 열람할 수 없습니다.
        </Text>
      </Card>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={{ height: 24 }} />

      <Button
        label="흔적으로 남기기"
        size="lg"
        loading={saving}
        onPress={saveNoteAsWord}
      />
      <View style={{ height: 8 }} />
      <Button
        label={saved ? "암송 카드에 추가됨 ·" : "암송 카드에 추가"}
        variant="secondary"
        disabled={saved}
        loading={saving && !saved}
        onPress={saveAsMemoryCard}
      />
      <View style={{ height: 8 }} />
      <Button label="닫기" variant="ghost" onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: 24,
  },
  label: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2.4,
    textAlign: "center",
  },
  text: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.ink,
    lineHeight: 42,
    textAlign: "center",
    marginTop: 20,
  },
  rule: {
    height: 0.8,
    width: 32,
    backgroundColor: colors.gold,
    marginVertical: 20,
    alignSelf: "center",
  },
  ref: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: "center",
  },
  cardLabel: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.ink,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 12,
    lineHeight: 18,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.burgundy,
    marginTop: 12,
  },
});
