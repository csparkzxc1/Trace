import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ui";
import {
  CategoryRow,
  VerseCard,
  WeekHeatmap,
} from "@/components/today";
import { useToday } from "@/features/check-in/use-today";
import { dailySummaryMessage, streakMessage } from "@/lib/utils/microcopy";
import { pickVerseForDate } from "@/lib/data/verses";
import { colors, fonts } from "@/theme/tokens";
import { formatKoreanDate } from "@/lib/utils/date";

export default function TodayScreen() {
  const router = useRouter();
  const { date, categories, checks, completedCount, heatmap, streak, toggle } =
    useToday();
  const verse = pickVerseForDate(date);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{formatKoreanDate(date)}</Text>
          <Text style={styles.summary}>{dailySummaryMessage(completedCount)}</Text>
          {streak > 0 ? (
            <Text style={styles.streak}>
              <Text style={styles.streakNum}>{streak}</Text>
              <Text style={styles.streakUnit}> 일</Text> · {streakMessage(streak)}
            </Text>
          ) : null}
        </View>

        <View style={{ height: 24 }} />
        <WeekHeatmap days={heatmap} />

        <View style={{ height: 24 }} />
        <View style={styles.list}>
          {categories.map((cat) => {
            const check = checks[cat.id];
            return (
              <CategoryRow
                key={cat.id}
                ko={cat.name_ko}
                en={cat.name_en ?? cat.name_ko}
                completed={!!check?.completed}
                onToggle={() => toggle(cat)}
                onLongPress={() =>
                  router.push({
                    pathname: "/(tabs)/today/category/[id]",
                    params: { id: cat.id },
                  })
                }
              />
            );
          })}
        </View>

        <View style={{ height: 24 }} />
        <VerseCard verse={verse} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 8 },
  greeting: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 13,
    color: colors.gold,
    letterSpacing: 1.6,
  },
  summary: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
    marginTop: 4,
    letterSpacing: -0.3,
  },
  streak: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 8,
  },
  streakNum: {
    fontFamily: fonts.accentBold,
    fontSize: 16,
    color: colors.burgundy,
  },
  streakUnit: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
  },
  list: { gap: 8 },
});
