import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer, Card, Button } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";
import { colors, fonts } from "@/theme/tokens";

export default function SubscriptionSettings() {
  const profile = useAuthStore((s) => s.profile);
  const isPremium = profile?.is_premium ?? false;

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>구독</Text>
      <View style={{ height: 24 }} />

      <Card>
        <Text style={styles.tier}>{isPremium ? "Premium" : "Free"}</Text>
        <Text style={styles.body}>
          {isPremium
            ? "제자훈련 커리큘럼, 무제한 기도수첩, 통계 심화, AI 묵상 동반자가 활성화되어 있습니다."
            : "Free에서도 일일 체크·구역 1개·기본 통계는 그대로 제공됩니다."}
        </Text>
      </Card>

      {!isPremium ? (
        <>
          <View style={{ height: 16 }} />
          <Card>
            <Text style={styles.priceLabel}>Premium</Text>
            <Text style={styles.price}>
              <Text style={styles.priceNum}>4,900</Text>
              <Text style={styles.priceUnit}>원 / 월</Text>
            </Text>
            <View style={{ height: 12 }} />
            <Text style={styles.body}>
              · 제자훈련 커리큘럼{"\n"}
              · 무제한 기도수첩{"\n"}
              · 통계 심화{"\n"}
              · AI 묵상 동반자
            </Text>
          </Card>
          <View style={{ height: 24 }} />
          <Button
            label="Premium 시작하기 (출시 후 활성)"
            disabled
            onPress={() => {}}
          />
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.ink },
  tier: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 14,
    color: colors.gold,
    letterSpacing: 1.6,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 22,
    marginTop: 8,
  },
  priceLabel: {
    fontFamily: fonts.accent,
    fontStyle: "italic",
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2,
  },
  price: { marginTop: 6 },
  priceNum: {
    fontFamily: fonts.accentBold,
    fontSize: 32,
    color: colors.burgundy,
  },
  priceUnit: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
  },
});
