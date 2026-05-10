import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer, Card } from "@/components/ui";
import { todayIso } from "@/lib/utils/date";
import { readingForDate, READING_PLAN_ID } from "@/lib/data/reading-plan";
import { colors, fonts } from "@/theme/tokens";

export default function ReadingPlan() {
  const today = todayIso();
  const planStart = `${new Date(today).getFullYear()}-01-01`;
  const passage = readingForDate(today, planStart);

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>통독표</Text>
      <Text style={styles.label}>{READING_PLAN_ID.toUpperCase()}</Text>

      <View style={{ height: 24 }} />

      <Card>
        <Text style={styles.miniLabel}>오늘의 본문</Text>
        <Text style={styles.passage}>{passage}</Text>
      </Card>

      <View style={{ height: 16 }} />

      <Text style={styles.helper}>
        체크하면 자동으로 "말씀 읽기"가 완료 처리됩니다 (§8.5).
      </Text>
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
  miniLabel: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 2,
  },
  passage: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
    marginTop: 8,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 20,
  },
});
