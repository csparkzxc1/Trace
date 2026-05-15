import { Pressable, View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme/tokens";

type Props = {
  ko: string;
  en: string;
  completed: boolean;
  onToggle: () => void;
  onLongPress?: () => void;
};

export function CategoryRow({
  ko,
  en,
  completed,
  onToggle,
  onLongPress,
}: Props) {
  return (
    <Pressable
      onPress={onToggle}
      onLongPress={onLongPress}
      delayLongPress={300}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: completed }}
      style={({ pressed }) => [
        styles.row,
        completed && styles.rowDone,
        { opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View>
        <Text style={[styles.ko, completed && styles.koDone]}>{ko}</Text>
        <Text style={styles.en}>{en}</Text>
      </View>
      <View style={[styles.box, completed && styles.boxDone]}>
        <Text style={[styles.tick, completed && styles.tickDone]}>·</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
  },
  rowDone: {
    backgroundColor: colors.creamDeep,
    borderColor: colors.gold,
  },
  ko: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
  },
  koDone: {
    color: colors.ink,
  },
  en: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 2,
    marginTop: 2,
  },
  box: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1.2,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  boxDone: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  tick: {
    fontFamily: fonts.accent,
    fontSize: 28,
    color: "transparent",
    lineHeight: 28,
    includeFontPadding: false,
  },
  tickDone: {
    color: colors.cream,
  },
});
