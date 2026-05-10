import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import * as authApi from "@/lib/api/auth";
import { colors, fonts } from "@/theme/tokens";

type MenuItem = { ko: string; en: string; href: string };

const ITEMS: MenuItem[] = [
  { ko: "자가진단", en: "Self-Assessment", href: "/(tabs)/self/assessment" },
  { ko: "성경암송", en: "Memory", href: "/(tabs)/self/memory" },
  { ko: "기도수첩", en: "Prayer Journal", href: "/(tabs)/self/prayer-archive" },
  { ko: "설정", en: "Settings", href: "/(tabs)/self/settings" },
  { ko: "흔적 이야기", en: "About", href: "/(tabs)/self/about" },
];

export default function SelfMenu() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const reset = useAuthStore((s) => s.reset);

  async function logout() {
    await authApi.signOut();
    reset();
    router.replace("/(auth)/welcome");
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.title}>나</Text>
        {profile ? (
          <Text style={styles.subtitle}>{profile.display_name} ·</Text>
        ) : null}

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

        <View style={{ height: 32 }} />
        <Pressable onPress={logout}>
          <Text style={styles.logout}>로그아웃</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 15,
    color: colors.gold,
    marginTop: 8,
  },
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
  chevron: {
    fontFamily: fonts.accent,
    fontSize: 22,
    color: colors.inkSoft,
  },
  logout: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: "center",
    paddingVertical: 16,
  },
});
