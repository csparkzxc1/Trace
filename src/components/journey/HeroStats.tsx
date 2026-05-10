import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme/tokens";

type Stat = {
  num: string;
  label: string;
  emphasized?: boolean;
};

type Props = {
  stats: Stat[];
};

export function HeroStats({ stats }: Props) {
  return (
    <View style={styles.row}>
      {stats.map((s) => (
        <View key={s.label} style={styles.item}>
          <Text
            style={[
              styles.num,
              s.emphasized && { color: colors.burgundy, fontStyle: "italic" },
            ]}
          >
            {s.num}
          </Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 28,
    marginTop: 24,
    flexWrap: "wrap",
  },
  item: {
    flexDirection: "column",
  },
  num: {
    fontFamily: fonts.accentBold,
    fontSize: 32,
    color: colors.ink,
    lineHeight: 36,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 4,
  },
});
