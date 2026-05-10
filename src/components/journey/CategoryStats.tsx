import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme/tokens";

type Stat = { ko: string; en: string; count: number };

type Props = {
  stats: Stat[];
  totalDays: number;
};

export function CategoryStats({ stats, totalDays }: Props) {
  const max = Math.max(...stats.map((s) => s.count), 1);
  return (
    <View style={styles.list}>
      {stats.map((s) => {
        const ratio = totalDays > 0 ? s.count / totalDays : 0;
        const widthPct = `${Math.min(100, (s.count / max) * 100)}%` as const;
        return (
          <View key={s.ko} style={styles.row}>
            <View style={styles.head}>
              <Text style={styles.ko}>{s.ko}</Text>
              <Text style={styles.en}>{s.en}</Text>
            </View>
            <View style={styles.bar}>
              <View style={[styles.fill, { width: widthPct }]} />
            </View>
            <Text style={styles.value}>
              <Text style={styles.numeric}>{s.count}</Text>
              <Text style={styles.unit}>
                /{totalDays} · {Math.round(ratio * 100)}%
              </Text>
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 16 },
  row: {},
  head: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  ko: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.ink,
  },
  en: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 2,
  },
  bar: {
    height: 4,
    backgroundColor: colors.creamDeep,
    borderRadius: 4,
    marginTop: 6,
  },
  fill: {
    height: 4,
    backgroundColor: colors.gold,
    borderRadius: 4,
  },
  value: {
    marginTop: 6,
  },
  numeric: {
    fontFamily: fonts.accentBold,
    fontSize: 16,
    color: colors.burgundy,
  },
  unit: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
  },
});
