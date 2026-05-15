// 토스 빌링 인증 WebView 모달.
// HTML 자산을 로컬에서 로드하고, 사용자 결제 완료 시 successUrl/failUrl 의
// about:blank 리다이렉트를 onShouldStartLoadWithRequest 로 가로채 authKey 를
// 부모에게 전달.

import { useRef, useState } from "react";
import { Modal, View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import type {
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview";
import { Asset } from "expo-asset";
import { useEffect } from "react";
import { colors } from "@/theme/tokens";

type Props = {
  visible: boolean;
  customerKey: string;
  customerEmail?: string;
  customerName?: string;
  clientKey: string;
  onAuth: (authKey: string) => void;
  onCancel: () => void;
};

const HTML_MODULE = require("../../../assets/web/toss-billing.html");

export function BillingAuthModal({
  visible,
  customerKey,
  customerEmail,
  customerName,
  clientKey,
  onAuth,
  onCancel,
}: Props) {
  const [uri, setUri] = useState<string | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    if (!visible) return;
    cancelled.current = false;
    Asset.fromModule(HTML_MODULE).downloadAsync().then((asset) => {
      if (cancelled.current || !asset.localUri) return;
      const params = new URLSearchParams({
        clientKey,
        customerKey,
        ...(customerEmail ? { customerEmail } : {}),
        ...(customerName ? { customerName } : {}),
      });
      setUri(`${asset.localUri}?${params.toString()}`);
    });
    return () => {
      cancelled.current = true;
      setUri(null);
    };
  }, [visible, clientKey, customerKey, customerEmail, customerName]);

  function onNav(req: WebViewNavigation): boolean {
    // about:blank?status=success&authKey=... 가로채기
    if (req.url.startsWith("about:blank")) {
      try {
        const u = new URL(req.url);
        const status = u.searchParams.get("status");
        if (status === "success") {
          const authKey = u.searchParams.get("authKey");
          if (authKey) onAuth(authKey);
          else onCancel();
        } else {
          onCancel();
        }
      } catch {
        onCancel();
      }
      return false;
    }
    return true;
  }

  function onMessage(e: WebViewMessageEvent) {
    try {
      const msg = JSON.parse(e.nativeEvent.data) as { type: string };
      if (msg.type === "cancelled" || msg.type === "error") onCancel();
    } catch {
      /* ignore */
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onCancel}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {uri ? (
          <WebView
            source={{ uri }}
            originWhitelist={["*"]}
            onShouldStartLoadWithRequest={onNav}
            onMessage={onMessage}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            renderLoading={() => (
              <ActivityIndicator
                style={styles.loading}
                color={colors.ink}
              />
            )}
          />
        ) : (
          <ActivityIndicator style={styles.loading} color={colors.ink} />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  loading: { flex: 1, alignSelf: "center", marginTop: 80 },
});
