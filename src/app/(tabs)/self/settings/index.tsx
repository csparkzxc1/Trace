import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ui";
import { colors, fonts } from "@/theme/tokens";

const ITEMS = [
  { ko: "프로필", en: "Profile", href: "/(tabs)/self/settings/profile" },
  {
    ko: "알림 시간",
    en: "Notifications",
    href: "/(tabs)/self/settings/notifications",
  },
  {
    ko: "교회 · 구역",
    en: "Church & Cell",
    href: "/(tabs)/self/settings/church",
  },
  {
    ko: "구독",
    en: "Subscription",
    href: "/(tabs)/self/settings/subscription",
  },
];

export default function SettingsHome() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Text style={styles.title}>설정</Text>
      <View style={{ height: 24 }} />
      <View style={styles.list}>
        {ITEMS.map((item) => (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href as never)}
            style={({ pressed }) => [
              styles.row,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <View>
              <Text style={styles.ko}>{item.ko}</Text>
              <Text style={styles.en}>{item.en}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.ink },
  list: { gap: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
  },
  ko: { fontFamily: fonts.display, fontSize: 17, color: colors.ink },
  en: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 2,
    marginTop: 2,
  },
  chevron: { fontFamily: fonts.accent, fontSize: 22, color: colors.inkSoft },
});
