import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme/tokens";

type Trace = {
  date: string;
  categoryKo: string;
  categoryEn?: string;
  note: string | null;
};

type Props = {
  groups: { date: string; items: Trace[] }[];
};

const DOWS = ["일", "월", "화", "수", "목", "금", "토"];

export function RecentTraces({ groups }: Props) {
  return (
    <View>
      {groups.map((g, i) => {
        const d = new Date(g.date);
        return (
          <View
            key={g.date}
            style={[
              styles.row,
              i === groups.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={styles.dateCol}>
              <Text style={styles.month}>
                {d.getMonth() + 1}월 · {DOWS[d.getDay()]}
              </Text>
              <Text style={styles.day}>{d.getDate()}</Text>
            </View>
            <View style={styles.itemsCol}>
              {g.items.map((it, idx) => (
                <Text key={idx} style={styles.itemText}>
                  <Text style={styles.tag}>{it.categoryKo}</Text>
                  {it.note ? <Text> · {it.note}</Text> : null}
                </Text>
              ))}
            </View>
            <View style={styles.cells}>
              {g.items.slice(0, 5).map((_, idx) => (
                <View key={idx} style={styles.miniCell} />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  dateCol: {
    width: 70,
  },
  month: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.inkSoft,
  },
  day: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
    marginTop: 2,
  },
  itemsCol: {
    flex: 1,
    gap: 4,
  },
  itemText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 22,
  },
  tag: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 0.5,
  },
  cells: {
    flexDirection: "row",
    gap: 2,
  },
  miniCell: {
    width: 8,
    height: 8,
    backgroundColor: "rgba(122, 46, 46, 0.55)",
    borderRadius: 1,
  },
});
