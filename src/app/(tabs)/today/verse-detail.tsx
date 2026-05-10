import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, Button } from "@/components/ui";
import { todayIso } from "@/lib/utils/date";
import { pickVerseForDate } from "@/lib/data/verses";
import { colors, fonts } from "@/theme/tokens";

export default function VerseDetail() {
  const router = useRouter();
  const verse = pickVerseForDate(todayIso());

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <Text style={styles.label}>오늘의 말씀</Text>
        <Text style={styles.text}>{verse.text}</Text>
        <View style={styles.rule} />
        <Text style={styles.ref}>
          {verse.reference} · {verse.translation}
        </Text>
      </View>
      <Button label="닫기" variant="ghost" onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2.4,
    textAlign: "center",
  },
  text: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
    lineHeight: 44,
    textAlign: "center",
    marginTop: 24,
  },
  rule: {
    height: 0.8,
    width: 32,
    backgroundColor: colors.gold,
    marginVertical: 24,
    alignSelf: "center",
  },
  ref: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: "center",
  },
});
