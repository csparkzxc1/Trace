import { Pressable, View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme/tokens";

type Props = {
  displayName: string;
  todayCount: number | null;
  onPress?: () => void;
};

export function MemberRow({ displayName, todayCount, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.85 : 1 }]}
    >
      <View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.label}>TODAY</Text>
      </View>
      <View style={styles.right}>
        {todayCount === null ? (
          <Text style={styles.private}>비공개</Text>
        ) : (
          <Text style={styles.count}>
            <Text style={styles.numeric}>{todayCount}</Text>
            <Text style={styles.unit}> 흔적</Text>
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.ink,
  },
  label: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 2,
    marginTop: 2,
  },
  right: { alignItems: "flex-end" },
  count: {},
  numeric: {
    fontFamily: fonts.accentBold,
    fontSize: 22,
    color: colors.burgundy,
  },
  unit: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
  },
  private: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
  },
});
