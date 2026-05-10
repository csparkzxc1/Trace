import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/ui";
import { Wordmark } from "@/components/brand";
import {
  YearHeatmap,
  RhythmSection,
  HeroStats,
  CategoryStats,
  RecentTraces,
} from "@/components/journey";
import { useAuthStore } from "@/lib/stores/auth";
import * as journeyApi from "@/lib/api/journey";
import * as catApi from "@/lib/api/categories";
import type { TrainingCategory } from "@/types/database";
import {
  todayIso,
  startOfMonth,
  formatKoreanDate,
} from "@/lib/utils/date";
import {
  extractSignals,
  generateRhythm,
  type DayActivity,
  type RhythmLine,
} from "@/lib/utils/rhythm";
import { TRACE_THRESHOLD } from "@/types/domain";
import { colors, fonts } from "@/theme/tokens";

type RecentGroup = {
  date: string;
  items: { categoryKo: string; note: string | null; categoryEn?: string }[];
};

export default function JourneyScreen() {
  const userId = useAuthStore((s) => s.user?.id);
  const today = todayIso();
  const year = new Date(today).getFullYear();

  const [categories, setCategories] = useState<TrainingCategory[]>([]);
  const [yearActivity, setYearActivity] = useState<DayActivity[]>([]);
  const [monthStats, setMonthStats] = useState<
    { category_id: string; count: number }[]
  >([]);
  const [recents, setRecents] = useState<RecentGroup[]>([]);

  useEffect(() => {
    if (!userId) return;
    catApi.fetchDefaultCategories().then(setCategories).catch(() => {});
  }, [userId]);

  useEffect(() => {
    if (!userId || categories.length === 0) return;
    Promise.all([
      journeyApi.fetchYearActivity(userId, year, categories),
      journeyApi.fetchCategoryStats(userId, startOfMonth(today)),
      journeyApi
        .fetchRecentTraces(userId, 12)
        .catch(
          () =>
            [] as Awaited<ReturnType<typeof journeyApi.fetchRecentTraces>>,
        ),
    ])
      .then(([year, month, recent]) => {
        setYearActivity(year);
        setMonthStats(month);

        const grouped = new Map<string, RecentGroup>();
        for (const r of recent) {
          if (!grouped.has(r.date)) {
            grouped.set(r.date, { date: r.date, items: [] });
          }
          grouped.get(r.date)!.items.push({
            categoryKo: r.categoryKo,
            note: r.note,
          });
        }
        setRecents(
          [...grouped.values()]
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .slice(0, 7),
        );
      })
      .catch(() => {});
  }, [userId, year, today, categories]);

  const rhythmLines: RhythmLine[] = useMemo(() => {
    if (yearActivity.length === 0) return [];
    return generateRhythm(extractSignals(yearActivity, today));
  }, [yearActivity, today]);

  const traceDays = yearActivity.filter(
    (d) => d.count >= TRACE_THRESHOLD && d.date <= today,
  ).length;
  const totalChecks = yearActivity.reduce((a, d) => a + d.count, 0);
  const lastTrace = [...yearActivity]
    .reverse()
    .find((d) => d.count > 0);

  const enrichedMonthStats = categories.map((cat) => ({
    ko: cat.name_ko,
    en: cat.name_en ?? cat.name_ko,
    count: monthStats.find((s) => s.category_id === cat.id)?.count ?? 0,
  }));
  const monthDayCount = (() => {
    const ms = startOfMonth(today);
    return yearActivity.filter((d) => d.date >= ms && d.date <= today).length;
  })();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Wordmark variant="horizontal" size={18} />
          <View style={styles.yearPill}>
            <Text style={styles.yearPillText}>{year}</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>MY JOURNEY · 나의 흔적</Text>
          <Text style={styles.heroTitle}>
            <Text style={styles.heroNum}>{traceDays}</Text>
            <Text>일의 흔적이{"\n"}</Text>
            <Text>{year}년에 남았습니다</Text>
          </Text>
          <Text style={styles.heroSub}>
            올해의 동행을 한 화면에서 돌아봅니다
            {lastTrace
              ? ` · 마지막 흔적: ${formatKoreanDate(lastTrace.date)}`
              : ""}
          </Text>

          <HeroStats
            stats={[
              { num: `${traceDays}`, label: "함께한 날", emphasized: true },
              { num: `${totalChecks}`, label: "남긴 흔적" },
              { num: "7", label: "영성훈련 영역" },
            ]}
          />
        </View>

        {/* Year heatmap */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>YEAR AT A GLANCE</Text>
          <Text style={styles.sectionTitle}>한 해의 결</Text>
          <View style={{ height: 16 }} />
          <YearHeatmap days={yearActivity} year={year} />
        </View>

        {/* Rhythm */}
        {rhythmLines.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RHYTHM OF THE YEAR</Text>
            <Text style={styles.sectionTitle}>올해의 결</Text>
            <View style={{ height: 16 }} />
            <RhythmSection lines={rhythmLines} />
          </View>
        ) : null}

        {/* Month breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {monthLabelEn(new Date(today).getMonth())} {year}
          </Text>
          <Text style={styles.sectionTitle}>이번 달의 흔적</Text>
          <View style={{ height: 16 }} />
          <CategoryStats
            stats={enrichedMonthStats}
            totalDays={monthDayCount}
          />
        </View>

        {/* Recent */}
        {recents.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RECENT TRACES</Text>
            <Text style={styles.sectionTitle}>최근의 흔적</Text>
            <View style={{ height: 16 }} />
            <RecentTraces groups={recents} />
          </View>
        ) : null}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerQuote}>
            "Leave a trace, not a score."
          </Text>
          <Text style={styles.footerKo}>
            신앙은 점수가 아닌 흔적입니다.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function monthLabelEn(m: number): string {
  return [
    "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
    "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER",
  ][m] ?? "";
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  yearPill: {
    backgroundColor: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 100,
  },
  yearPillText: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 13,
    color: colors.cream,
    letterSpacing: 1.2,
  },
  hero: {
    paddingTop: 40,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  eyebrow: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 3,
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.ink,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  heroNum: {
    fontFamily: fonts.accentBold,
    fontStyle: "italic",
    color: colors.burgundy,
    fontSize: 40,
  },
  heroSub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 12,
    lineHeight: 20,
  },
  section: {
    paddingTop: 36,
    paddingBottom: 36,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  sectionLabel: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2.4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  footer: {
    marginTop: 32,
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: colors.ink,
    alignItems: "center",
  },
  footerQuote: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 18,
    color: colors.goldSoft,
  },
  footerKo: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: "rgba(245, 241, 232, 0.65)",
    marginTop: 4,
  },
});
