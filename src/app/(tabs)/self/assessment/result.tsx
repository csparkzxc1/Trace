import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Card, Button } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as assessmentApi from "@/lib/api/assessment";
import { recommend } from "@/lib/data/tozer-assessment";
import { DEFAULT_CATEGORIES } from "@/lib/utils/categories";
import { colors, fonts } from "@/theme/tokens";
import type { CategorySlug } from "@/types/database";

export default function AssessmentResult() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!userId) return;
    assessmentApi
      .fetchMyAssessments(userId, "tozer-7")
      .then((all) => {
        const latest = all[0];
        if (latest) setScores(latest.scores as Record<string, number>);
      })
      .catch(() => {});
  }, [userId]);

  const rec = recommend(scores as Record<CategorySlug, number>);

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>지금의 자리</Text>
      <Text style={styles.label}>RESULT</Text>

      <View style={{ height: 24 }} />

      <View style={styles.bars}>
        {DEFAULT_CATEGORIES.map((cat) => {
          const v = scores[cat.slug] ?? 0;
          const widthPct = `${Math.min(100, (v / 3) * 100)}%` as const;
          return (
            <View key={cat.slug} style={styles.barRow}>
              <Text style={styles.barLabel}>{cat.ko}</Text>
              <View style={styles.bar}>
                <View style={[styles.fill, { width: widthPct }]} />
              </View>
              <Text style={styles.barValue}>{v}/3</Text>
            </View>
          );
        })}
      </View>

      <View style={{ height: 24 }} />

      <Card>
        <Text style={styles.recLabel}>추천 한 가지</Text>
        <Text style={styles.recBody}>{rec.message}</Text>
      </Card>

      <View style={{ height: 24 }} />
      <Button
        label="오늘로 돌아가기"
        size="lg"
        onPress={() => router.replace("/(tabs)/today")}
      />
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
  bars: { gap: 16 },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  barLabel: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.ink,
    width: 48,
  },
  bar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.creamDeep,
    borderRadius: 4,
  },
  fill: { height: 4, backgroundColor: colors.gold, borderRadius: 4 },
  barValue: {
    fontFamily: fonts.accent,
    fontSize: 12,
    color: colors.inkSoft,
    width: 32,
    textAlign: "right",
  },
  recLabel: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2,
  },
  recBody: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    marginTop: 8,
    lineHeight: 26,
  },
});
