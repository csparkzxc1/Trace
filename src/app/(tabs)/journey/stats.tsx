import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/ui";
import { CategoryDonut } from "@/components/journey";
import { useAuthStore } from "@/lib/stores/auth";
import * as journeyApi from "@/lib/api/journey";
import * as catApi from "@/lib/api/categories";
import type { TrainingCategory } from "@/types/database";
import { startOfMonth, todayIso } from "@/lib/utils/date";
import { colors, fonts } from "@/theme/tokens";

export default function StatsScreen() {
  const userId = useAuthStore((s) => s.user?.id);
  const [stats, setStats] = useState<{ category_id: string; count: number }[]>(
    [],
  );
  const [categories, setCategories] = useState<TrainingCategory[]>([]);

  useEffect(() => {
    if (!userId) return;
    const ms = startOfMonth(todayIso());
    Promise.all([
      journeyApi.fetchCategoryStats(userId, ms),
      catApi.fetchDefaultCategories(),
    ])
      .then(([s, c]) => {
        setStats(s);
        setCategories(c);
      })
      .catch(() => {});
  }, [userId]);

  const slices = categories.map((cat) => ({
    ko: cat.name_ko,
    en: cat.name_en ?? cat.name_ko,
    count: stats.find((s) => s.category_id === cat.id)?.count ?? 0,
  }));

  const today = new Date(todayIso());
  const monthLabel = `${today.getFullYear()}년 ${today.getMonth() + 1}월`;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>영역별 흔적</Text>
        <Text style={styles.label}>STATS · {monthLabel}</Text>

        <View style={{ height: 32 }} />

        <CategoryDonut slices={slices} />

        <View style={{ height: 24 }} />

        <Text style={styles.helper}>
          영역의 균형은 정답이 아닙니다. 한 영역에 깊이 머무는 시기도, 여러 영역을
          가볍게 동행하는 시기도 모두 흔적입니다.
        </Text>
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
  label: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2.4,
    marginTop: 8,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
});
