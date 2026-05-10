import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Input, Button, Card, Checkbox } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as prayerApi from "@/lib/api/prayer";
import type { PrayerJournalEntry } from "@/types/database";
import { isSafeCopy } from "@/lib/utils/microcopy";
import { isPremiumActive, FREE_PRAYER_LIMIT } from "@/lib/utils/premium";
import { colors, fonts } from "@/theme/tokens";

export default function PrayerArchive() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const profile = useAuthStore((s) => s.profile);
  const isPremium = isPremiumActive(profile);
  const [entries, setEntries] = useState<PrayerJournalEntry[]>([]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [request, setRequest] = useState("");
  const [shareToCell, setShareToCell] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reachedFreeLimit = !isPremium && entries.length >= FREE_PRAYER_LIMIT;

  const reload = useCallback(async () => {
    if (!userId) return;
    const list = await prayerApi.fetchMyPrayerEntries(userId);
    setEntries(list);
  }, [userId]);

  useEffect(() => {
    reload().catch(() => {});
  }, [reload]);

  async function add() {
    if (!userId) return;
    if (reachedFreeLimit) {
      setError(
        `Free 에서는 기도제목을 ${FREE_PRAYER_LIMIT}개까지 보관할 수 있습니다. Premium 으로 무제한 보관해보세요.`,
      );
      return;
    }
    if (!isSafeCopy(request) || !isSafeCopy(title)) {
      setError("따뜻한 표현으로 다시 적어주세요");
      return;
    }
    if (!request.trim()) {
      setError("기도제목을 적어주세요");
      return;
    }
    await prayerApi.addPrayerEntry({
      userId,
      title: title.trim() || undefined,
      request: request.trim(),
      shareToCell,
    });
    setTitle("");
    setRequest("");
    setShareToCell(false);
    setAdding(false);
    setError(null);
    await reload();
  }

  async function markAnswered(id: string) {
    await prayerApi.markPrayerAnswered(id);
    await reload();
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>기도수첩</Text>
        <Text style={styles.helper}>
          개인 메모는 외부에 공유되지 않습니다. 응답 노트는 어떤 경우에도 비공개입니다.
        </Text>

        {!isPremium ? (
          <Text style={styles.limit}>
            <Text style={styles.numericInline}>{entries.length}</Text>
            <Text> / {FREE_PRAYER_LIMIT} (Free)</Text>
          </Text>
        ) : null}

        <View style={{ height: 16 }} />

        {reachedFreeLimit ? (
          <Pressable
            onPress={() => router.push("/(tabs)/self/settings/subscription")}
          >
            <Card>
              <Text style={styles.upsellLabel}>PREMIUM</Text>
              <Text style={styles.upsellBody}>
                기도제목을 무제한으로 보관하고 싶다면 Premium 을 살펴보세요.
              </Text>
            </Card>
          </Pressable>
        ) : !adding ? (
          <Button label="새 제목 추가" onPress={() => setAdding(true)} />
        ) : (
          <View>
            <Input label="제목 (선택)" value={title} onChangeText={setTitle} />
            <View style={{ height: 12 }} />
            <Input
              label="기도제목"
              value={request}
              onChangeText={setRequest}
              multiline
            />
            <View style={{ height: 12 }} />
            <Checkbox
              checked={shareToCell}
              onToggle={setShareToCell}
              label="구역에 공유 (개인 메모는 그대로 비공개)"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={{ height: 12 }} />
            <Button label="저장" onPress={add} />
            <View style={{ height: 8 }} />
            <Button
              label="취소"
              variant="ghost"
              onPress={() => {
                setAdding(false);
                setError(null);
              }}
            />
          </View>
        )}

        <View style={{ height: 24 }} />

        {entries.length === 0 ? (
          <Text style={styles.empty}>
            기도제목을 적어두면 응답을 기억하기 좋습니다.
          </Text>
        ) : (
          <View style={{ gap: 8 }}>
            {entries.map((p) => (
              <Card key={p.id}>
                {p.title ? <Text style={styles.cardTitle}>{p.title}</Text> : null}
                <Text style={styles.cardBody}>{p.request}</Text>
                {p.answered_at ? (
                  <Text style={styles.answered}>응답됨 ·</Text>
                ) : (
                  <Pressable onPress={() => markAnswered(p.id)}>
                    <Text style={styles.markLink}>응답되었습니다</Text>
                  </Pressable>
                )}
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.ink },
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 8,
    lineHeight: 20,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: "center",
    marginTop: 32,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.ink,
    marginBottom: 6,
  },
  cardBody: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    lineHeight: 24,
  },
  answered: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.sage,
    marginTop: 8,
  },
  markLink: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.gold,
    marginTop: 8,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.burgundy,
    marginTop: 8,
  },
  limit: {
    marginTop: 8,
  },
  numericInline: {
    fontFamily: fonts.accentBold,
    fontSize: 14,
    color: colors.burgundy,
  },
  upsellLabel: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 1.6,
  },
  upsellBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    marginTop: 8,
    lineHeight: 22,
  },
});
