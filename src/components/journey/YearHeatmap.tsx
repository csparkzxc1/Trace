import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { colors, fonts } from "@/theme/tokens";
import type { DayActivity } from "@/lib/utils/rhythm";
import { todayIso } from "@/lib/utils/date";

const CELL = 12;
const GAP = 2;
const COL = CELL + GAP;

const MONTH_LABELS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];
const DOW_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

type Props = {
  days: DayActivity[];
  year: number;
};

function levelColor(count: number): string {
  if (count <= 0) return colors.creamDeep;
  if (count <= 2) return "rgba(184, 146, 79, 0.20)";
  if (count <= 4) return "rgba(184, 146, 79, 0.45)";
  if (count <= 5) return "rgba(122, 46, 46, 0.55)";
  return colors.ink;
}

export function YearHeatmap({ days, year }: Props) {
  const today = todayIso();
  const yearStart = `${year}-01-01`;
  const startDow = new Date(yearStart).getDay();

  const grid = useMemo(() => {
    const cells: (DayActivity | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    days.forEach((d) => cells.push(d));
    while (cells.length < 53 * 7) cells.push(null);
    return cells;
  }, [days, startDow]);

  const monthMarkers = useMemo(() => {
    const markers: { col: number; label: string }[] = [];
    let lastMonth = -1;
    grid.forEach((c, i) => {
      if (!c) return;
      const dow = i % 7;
      const m = new Date(c.date).getMonth();
      if (dow === 0 && m !== lastMonth) {
        lastMonth = m;
        markers.push({ col: Math.floor(i / 7), label: MONTH_LABELS[m] ?? "" });
      }
    });
    return markers;
  }, [grid]);

  const [active, setActive] = useState<DayActivity | null>(null);

  const totalCols = 53;
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View>
          <View style={[styles.monthRow, { width: totalCols * COL + 32 }]}>
            <View style={{ width: 32 }} />
            {monthMarkers.map((m) => (
              <Text
                key={`${m.col}-${m.label}`}
                style={[styles.monthLabel, { left: 32 + m.col * COL }]}
              >
                {m.label}
              </Text>
            ))}
          </View>

          <View style={styles.gridRow}>
            <View style={styles.dowCol}>
              {DOW_LABELS.map((d, i) => (
                <Text
                  key={i}
                  style={[
                    styles.dowLabel,
                    i === 0 && { color: colors.gold },
                  ]}
                >
                  {d}
                </Text>
              ))}
            </View>

            <View
              style={{
                width: totalCols * COL,
                height: 7 * COL,
                position: "relative",
              }}
            >
              {grid.map((c, i) => {
                const col = Math.floor(i / 7);
                const row = i % 7;
                const isFuture = c ? c.date > today : true;
                const empty = !c;
                const bg = empty || isFuture ? "transparent" : levelColor(c.count);
                const isSunday = row === 0;

                return (
                  <Pressable
                    key={i}
                    disabled={empty || isFuture}
                    onPress={() => c && !isFuture && setActive(c)}
                    style={[
                      styles.cell,
                      {
                        left: col * COL,
                        top: row * COL,
                        backgroundColor: bg,
                        borderWidth: isSunday && !empty && !isFuture ? 1 : 0,
                        borderColor: "rgba(184,146,79,0.4)",
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <Text style={styles.legendLink}>흔적은 어떻게 쌓이나요 →</Text>
        <View style={styles.legendScale}>
          <Text style={styles.legendLabel}>덜</Text>
          {[0, 2, 4, 5, 7].map((c) => (
            <View
              key={c}
              style={[styles.legendCell, { backgroundColor: levelColor(c) }]}
            />
          ))}
          <Text style={styles.legendLabel}>더</Text>
        </View>
      </View>

      {active ? (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipDate}>
            {fmtDate(active.date)}
          </Text>
          {active.count === 0 ? (
            <Text style={styles.tooltipBody}>흔적 없는 날 — 괜찮습니다</Text>
          ) : (
            <Text style={styles.tooltipBody}>
              <Text style={styles.tooltipNum}>{active.count}</Text>
              가지 영역의 흔적
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const dows = ["일", "월", "화", "수", "목", "금", "토"];
  return `${MONTH_LABELS[d.getMonth()]} ${d.getDate()} · ${dows[d.getDay()]}`;
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  monthRow: {
    height: 16,
    marginBottom: 6,
    position: "relative",
  },
  monthLabel: {
    position: "absolute",
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 10,
    color: colors.inkSoft,
    letterSpacing: 1,
    top: 0,
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  dowCol: {
    width: 32,
    paddingRight: 6,
  },
  dowLabel: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 9,
    color: colors.inkSoft,
    height: COL,
    lineHeight: CELL,
  },
  cell: {
    position: "absolute",
    width: CELL,
    height: CELL,
    borderRadius: 2,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  legendLink: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
  },
  legendScale: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendLabel: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.inkSoft,
  },
  legendCell: {
    width: 11,
    height: 11,
    borderRadius: 2,
  },
  tooltip: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: colors.ink,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  tooltipDate: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.goldSoft,
    letterSpacing: 1,
    marginBottom: 2,
  },
  tooltipBody: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.cream,
  },
  tooltipNum: {
    fontFamily: fonts.accentBold,
    fontSize: 14,
    color: colors.goldSoft,
  },
});
