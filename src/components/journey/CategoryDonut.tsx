import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { colors, fonts } from "@/theme/tokens";

type Slice = {
  ko: string;
  en: string;
  count: number;
};

type Props = {
  slices: Slice[];
  size?: number;
};

const SLICE_COLORS = [
  "#B8924F", // gold
  "#7A2E2E", // burgundy
  "#6B7F5A", // sage
  "#4A5568", // ink-soft
  "#D4B57A", // gold-soft
  "#A37777", // muted burgundy
  "#1F2A37", // ink
];

export function CategoryDonut({ slices, size = 220 }: Props) {
  const total = slices.reduce((a, s) => a + s.count, 0);
  const radius = size / 2;
  const stroke = 28;
  const inner = radius - stroke;
  const circumference = 2 * Math.PI * (radius - stroke / 2);

  let offset = 0;

  return (
    <View style={styles.wrap}>
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <Svg width={size} height={size}>
          <G rotation={-90} origin={`${radius}, ${radius}`}>
            {total > 0 ? (
              slices.map((s, i) => {
                if (s.count === 0) return null;
                const ratio = s.count / total;
                const dash = ratio * circumference;
                const gap = circumference - dash;
                const dashArr = `${dash} ${gap}`;
                const dashOffset = -offset * circumference;
                offset += ratio;
                return (
                  <Circle
                    key={s.ko}
                    cx={radius}
                    cy={radius}
                    r={radius - stroke / 2}
                    stroke={SLICE_COLORS[i % SLICE_COLORS.length]}
                    strokeWidth={stroke}
                    strokeDasharray={dashArr}
                    strokeDashoffset={dashOffset}
                    fill="none"
                  />
                );
              })
            ) : (
              <Circle
                cx={radius}
                cy={radius}
                r={radius - stroke / 2}
                stroke={colors.creamDeep}
                strokeWidth={stroke}
                fill="none"
              />
            )}
          </G>
        </Svg>
        <View style={[styles.center, { width: inner * 2, height: inner * 2 }]}>
          <Text style={styles.totalNum}>{total}</Text>
          <Text style={styles.totalLabel}>이번 달 흔적</Text>
        </View>
      </View>

      <View style={styles.legend}>
        {slices.map((s, i) => (
          <View key={s.ko} style={styles.legendRow}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: SLICE_COLORS[i % SLICE_COLORS.length] },
              ]}
            />
            <Text style={styles.legendKo}>{s.ko}</Text>
            <Text style={styles.legendEn}>{s.en}</Text>
            <Text style={styles.legendValue}>
              <Text style={styles.legendNum}>{s.count}</Text>
              <Text style={styles.legendUnit}>회</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  center: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  totalNum: {
    fontFamily: fonts.accentBold,
    fontSize: 36,
    color: colors.burgundy,
  },
  totalLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 4,
  },
  legend: {
    marginTop: 24,
    width: "100%",
    gap: 8,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  swatch: {
    width: 12,
    height: 12,
    marginRight: 12,
    borderRadius: 2,
  },
  legendKo: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.ink,
    marginRight: 8,
  },
  legendEn: {
    flex: 1,
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 1.4,
  },
  legendValue: {},
  legendNum: {
    fontFamily: fonts.accentBold,
    fontSize: 14,
    color: colors.burgundy,
  },
  legendUnit: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
  },
});
