import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScreenContainer, Card, Button } from "@/components/ui";
import { BillingAuthModal } from "@/components/payment/BillingAuthModal";
import { useAuthStore } from "@/lib/stores/auth";
import * as paymentApi from "@/lib/api/payment";
import * as authApi from "@/lib/api/auth";
import { isPremiumActive } from "@/lib/utils/premium";
import { colors, fonts } from "@/theme/tokens";

const TOSS_CLIENT_KEY =
  process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY ?? "test_ck_REPLACE_ME";

export default function SubscriptionSettings() {
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const userId = useAuthStore((s) => s.user?.id);
  const active = isPremiumActive(profile);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function startSubscription() {
    if (!userId) return;
    setHint(null);
    setModalOpen(true);
  }

  async function onAuthKey(authKey: string) {
    if (!userId) return;
    setModalOpen(false);
    setBusy(true);
    try {
      const r = await paymentApi.issueBillingKey({
        customerKey: userId,
        authKey,
      });
      if (!r.ok) throw new Error("issue failed");
      const fresh = await authApi.fetchProfile(userId);
      setProfile(fresh);
    } catch {
      setHint("결제가 완료되지 않았습니다. 잠시 뒤 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>구독</Text>
      <View style={{ height: 24 }} />

      <Card>
        <Text style={styles.tier}>{active ? "Premium" : "Free"}</Text>
        <Text style={styles.body}>
          {active
            ? "제자훈련 커리큘럼, 무제한 기도수첩, 통계 심화, AI 묵상 동반자가 활성화되어 있습니다."
            : "Free에서도 일일 체크·구역 1개·기본 통계는 그대로 제공됩니다."}
        </Text>
        {active && profile?.premium_until ? (
          <Text style={styles.untilLabel}>
            <Text style={styles.untilEm}>{profile.premium_until}</Text>
            <Text> 까지</Text>
          </Text>
        ) : null}
      </Card>

      {!active ? (
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
            label="Premium 시작하기"
            size="lg"
            loading={busy}
            onPress={startSubscription}
          />
          {hint ? <Text style={styles.hint}>{hint}</Text> : null}
          <Text style={styles.terms}>
            결제는 토스페이먼츠를 통해 안전하게 처리됩니다. 언제든 해지할 수
            있으며, 해지 후에도 결제 주기 끝까지 Premium이 유지됩니다.
          </Text>
        </>
      ) : null}

      {userId ? (
        <BillingAuthModal
          visible={modalOpen}
          customerKey={userId}
          customerEmail={profile?.email}
          customerName={profile?.display_name}
          clientKey={TOSS_CLIENT_KEY}
          onAuth={onAuthKey}
          onCancel={() => setModalOpen(false)}
        />
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
  untilLabel: {
    marginTop: 12,
  },
  untilEm: {
    fontFamily: fonts.accentBold,
    fontSize: 16,
    color: colors.burgundy,
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
  hint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.burgundy,
    marginTop: 12,
    lineHeight: 20,
  },
  terms: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 16,
    lineHeight: 18,
  },
});
