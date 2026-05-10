import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ui";
import { MonthHeatmap, CategoryStats } from "@/components/journey";
import { useAuthStore } from "@/lib/stores/auth";
import * as journeyApi from "@/lib/api/journey";
import * as catApi from "@/lib/api/categories";
import type { TrainingCategory } from "@/types/database";
import { startOfMonth, todayIso } from "@/lib/utils/date";
import { TRACE_THRESHOLD } from "@/types/domain";
import { colors, fonts } from "@/theme/tokens";

export default function JourneyScreen() {
  const userId = useAuthStore((s) => s.user?.id);
  const router = useRouter();
  const [days, setDays] = useState<{ date: string; count: number }[]>([]);
  const [stats, setStats] = useState<{ category_id: string; count: number }[]>([]);
  const [categories, setCategories] = useState<TrainingCategory[]>([]);

  useEffect(() => {
    if (!userId) return;
    const monthStart = startOfMonth(todayIso());
    Promise.all([
      journeyApi.fetchMonthHeatmap(userId, monthStart),
      journeyApi.fetchCategoryStats(userId, monthStart),
      catApi.fetchDefaultCategories(),
    ])
      .then(([d, s, c]) => {
        setDays(d);
        setStats(s);
        setCategories(c);
      })
      .catch(() => {});
  }, [userId]);

  const monthLabel = (() => {
    const d = new Date(todayIso());
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
  })();

  const traceDays = days.filter((d) => d.count >= TRACE_THRESHOLD).length;
  const enrichedStats = categories.map((cat) => ({
    ko: cat.name_ko,
    en: cat.name_en ?? cat.name_ko,
    count: stats.find((s) => s.category_id === cat.id)?.count ?? 0,
  }));

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>여정</Text>

        <View style={{ height: 24 }} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.numeric}>{traceDays}</Text>
            <Text style={styles.unit}>일 흔적</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.numeric}>{days.length}</Text>
            <Text style={styles.unit}>일 동행</Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
        <MonthHeatmap days={days} monthLabel={monthLabel} />

        <View style={{ height: 32 }} />
        <Text style={styles.sectionTitle}>영역별</Text>
        <View style={{ height: 12 }} />
        <CategoryStats stats={enrichedStats} totalDays={days.length} />

        <View style={{ height: 24 }} />
        <Pressable
          onPress={() => router.push("/(tabs)/journey/reading-plan" as never)}
        >
          <Text style={styles.linkRow}>통독표 →</Text>
        </Pressable>
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
    alignItems: "center",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    paddingVertical: 16,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  divider: {
    width: 0.8,
    height: 32,
    backgroundColor: colors.gold,
  },
  numeric: {
    fontFamily: fonts.accentBold,
    fontSize: 32,
    color: colors.burgundy,
  },
  unit: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
  },
  linkRow: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: colors.line,
  },
});
