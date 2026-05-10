import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Button, Card } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as memoryApi from "@/lib/api/memory";
import type { ScriptureMemory } from "@/types/database";
import { colors, fonts } from "@/theme/tokens";

export default function MemoryHome() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const [cards, setCards] = useState<ScriptureMemory[]>([]);
  const [due, setDue] = useState<ScriptureMemory[]>([]);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      memoryApi.fetchAllCards(userId),
      memoryApi.fetchDueCards(userId, 50),
    ])
      .then(([all, dueCards]) => {
        setCards(all);
        setDue(dueCards);
      })
      .catch(() => {});
  }, [userId]);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>성경암송</Text>

        <View style={{ height: 24 }} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.numeric}>{due.length}</Text>
            <Text style={styles.unit}>오늘 복습</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.numeric}>{cards.length}</Text>
            <Text style={styles.unit}>전체</Text>
          </View>
        </View>

        <View style={{ height: 16 }} />

        <Button
          label={due.length > 0 ? "오늘의 복습 시작" : "오늘 복습할 카드가 없습니다"}
          size="lg"
          disabled={due.length === 0}
          onPress={() => router.push("/(tabs)/self/memory/study")}
        />
        <View style={{ height: 8 }} />
        <Button
          label="새 카드 추가"
          variant="ghost"
          onPress={() => router.push("/(tabs)/self/memory/add")}
        />

        <View style={{ height: 24 }} />
        <Text style={styles.section}>저장된 말씀</Text>
        <View style={{ height: 12 }} />

        {cards.length === 0 ? (
          <Text style={styles.empty}>
            마음에 새기고 싶은 첫 구절을 추가해보세요.
          </Text>
        ) : (
          <View style={{ gap: 8 }}>
            {cards.map((c) => (
              <Card key={c.id}>
                <Text style={styles.cardRef}>{c.reference}</Text>
                <Text style={styles.cardText} numberOfLines={3}>
                  {c.text}
                </Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
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
  summaryRow: {
    flexDirection: "row",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    paddingVertical: 16,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  divider: { width: 0.8, height: 32, backgroundColor: colors.gold },
  numeric: {
    fontFamily: fonts.accentBold,
    fontSize: 28,
    color: colors.burgundy,
  },
  unit: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 4,
  },
  section: { fontFamily: fonts.display, fontSize: 18, color: colors.ink },
  empty: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: "center",
  },
  cardRef: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 1.6,
  },
  cardText: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.ink,
    marginTop: 6,
    lineHeight: 24,
  },
});
