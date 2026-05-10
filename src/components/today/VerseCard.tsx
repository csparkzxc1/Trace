import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/theme/tokens";
import type { Verse } from "@/lib/data/verses";

export function VerseCard({ verse }: { verse: Verse }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>오늘의 말씀</Text>
      <Text style={styles.text}>{verse.text}</Text>
      <View style={styles.rule} />
      <Text style={styles.ref}>
        {verse.reference} · {verse.translation}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    padding: 20,
  },
  label: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 2.4,
    marginBottom: 12,
  },
  text: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
    lineHeight: 30,
  },
  rule: {
    height: 0.8,
    backgroundColor: colors.gold,
    marginVertical: 12,
    width: 32,
  },
  ref: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
  },
});
