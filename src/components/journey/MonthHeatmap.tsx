import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme/tokens";
import { TRACE_THRESHOLD } from "@/types/domain";

type Day = { date: string; count: number };

type Props = {
  days: Day[];
  monthLabel: string;
};

function intensityColor(count: number): string {
  if (count <= 0) return colors.creamDeep;
  if (count < TRACE_THRESHOLD) return "#E8DDC4";
  if (count < 6) return "#C2A35A";
  return colors.gold;
}

export function MonthHeatmap({ days, monthLabel }: Props) {
  // Pad start so first row aligns to weekday
  const first = days[0]?.date ? new Date(days[0].date) : new Date();
  const padStart = first.getDay();

  return (
    <View>
      <Text style={styles.label}>{monthLabel}</Text>
      <View style={styles.grid}>
        {Array.from({ length: padStart }).map((_, i) => (
          <View key={`pad-${i}`} style={styles.cellEmpty} />
        ))}
        {days.map((d) => (
          <View
            key={d.date}
            style={[styles.cell, { backgroundColor: intensityColor(d.count) }]}
          />
        ))}
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>적게</Text>
        {[0, 3, 5, 7].map((c) => (
          <View
            key={c}
            style={[styles.legendCell, { backgroundColor: intensityColor(c) }]}
          />
        ))}
        <Text style={styles.legendLabel}>많이</Text>
      </View>
    </View>
  );
}

const CELL = 36;
const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2.4,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 4,
  },
  cellEmpty: {
    width: CELL,
    height: CELL,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 4,
  },
  legendLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.inkSoft,
  },
  legendCell: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
});
