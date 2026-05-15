import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme/tokens";
import { TRACE_THRESHOLD } from "@/types/domain";

type Cell = { date: string; count: number };

type Props = {
  days: Cell[];
};

const DOW = ["일", "월", "화", "수", "목", "금", "토"];

function intensityColor(count: number): string {
  if (count <= 0) return colors.creamDeep;
  if (count < TRACE_THRESHOLD) return "#E8DDC4";
  if (count < 6) return "#C2A35A";
  return colors.gold;
}

export function WeekHeatmap({ days }: Props) {
  return (
    <View>
      <Text style={styles.label}>이번 주 흔적</Text>
      <View style={styles.row}>
        {days.map((d) => {
          const date = new Date(d.date);
          return (
            <View key={d.date} style={styles.cell}>
              <Text style={styles.dow}>{DOW[date.getDay()]}</Text>
              <View
                style={[
                  styles.box,
                  { backgroundColor: intensityColor(d.count) },
                ]}
              />
              <Text style={styles.dom}>{date.getDate()}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 2.2,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cell: {
    alignItems: "center",
    flex: 1,
  },
  dow: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.inkSoft,
    marginBottom: 4,
  },
  box: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  dom: {
    fontFamily: fonts.accent,
    fontSize: 11,
    color: colors.inkSoft,
    marginTop: 4,
  },
});
