import { View, Text, Pressable, Linking, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/ui";
import { Wordmark } from "@/components/brand";
import { colors, fonts } from "@/theme/tokens";

export default function About() {
  return (
    <ScreenContainer scroll>
      <View style={styles.center}>
        <Wordmark variant="stacked" size={56} />
        <Text style={styles.tagline}>신앙은 점수가 아닌 흔적입니다.</Text>
      </View>

      <View style={{ height: 32 }} />

      <Text style={styles.body}>
        흔적은 점수표가 아닙니다. 매일의 동행 안에 남는 작은 자국입니다.
        {"\n\n"}
        하루 7가지를 모두 채우지 않아도, 4가지를 시작한 날에도 흔적은 남습니다.
        끊어져도 다시 시작할 수 있습니다.
        {"\n\n"}
        구역 멤버끼리는 서로의 노트나 메모를 보지 못합니다. 우리의 동행은
        자율 안에서 이어집니다.
      </Text>

      <View style={{ height: 32 }} />

      <View style={styles.legalRow}>
        <Pressable
          onPress={() => Linking.openURL("https://trace.faith/legal/terms")}
        >
          <Text style={styles.legalLink}>이용약관</Text>
        </Pressable>
        <Text style={styles.legalSep}>·</Text>
        <Pressable
          onPress={() => Linking.openURL("https://trace.faith/legal/privacy")}
        >
          <Text style={styles.legalLink}>개인정보처리방침</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    marginTop: 32,
  },
  tagline: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 16,
    color: colors.burgundy,
    marginTop: 24,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    lineHeight: 26,
  },
  legalRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  legalLink: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.gold,
    textDecorationLine: "underline",
  },
  legalSep: {
    fontFamily: fonts.accent,
    fontSize: 16,
    color: colors.gold,
  },
});
