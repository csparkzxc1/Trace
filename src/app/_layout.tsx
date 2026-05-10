import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  NotoSerifKR_500Medium,
  NotoSerifKR_700Bold,
  useFonts as useNotoFonts,
} from "@expo-google-fonts/noto-serif-kr";
import { GowunDodum_400Regular } from "@expo-google-fonts/gowun-dodum";
import {
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
} from "@expo-google-fonts/cormorant-garamond";
import { BrandSplash } from "@/components/brand";
import { colors } from "@/theme/tokens";
import { useSessionBootstrap } from "@/lib/hooks/useSession";
import { useAuthStore } from "@/lib/stores/auth";
import * as authApi from "@/lib/api/auth";
import { initAnalytics, setAnalyticsUser } from "@/lib/analytics";

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function AuthGate() {
  const segments = useSegments();
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const initialized = useAuthStore((s) => s.initialized);
  const setProfile = useAuthStore((s) => s.setProfile);

  useEffect(() => {
    if (!initialized) return;
    const inAuth = segments[0] === "(auth)";
    if (!session && !inAuth) {
      router.replace("/(auth)/welcome");
    } else if (session && inAuth) {
      router.replace("/(tabs)/today");
    }
  }, [session, initialized, segments, router]);

  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setAnalyticsUser(null);
      return;
    }
    setAnalyticsUser(userId);
    authApi
      .fetchProfile(userId)
      .then((p) => setProfile(p))
      .catch(() => setProfile(null));
  }, [userId, setProfile]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useNotoFonts({
    NotoSerifKR_500Medium,
    NotoSerifKR_700Bold,
    GowunDodum_400Regular,
    CormorantGaramond_500Medium_Italic,
    CormorantGaramond_600SemiBold,
  });

  const [brandSplashDone, setBrandSplashDone] = useState(false);
  useSessionBootstrap();

  useEffect(() => {
    initAnalytics();
  }, []);

  const onLayoutReady = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    onLayoutReady();
  }, [onLayoutReady]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!brandSplashDone) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream }}>
        <BrandSplash onFinish={() => setBrandSplashDone(true)} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.cream },
        }}
      />
      <StatusBar style="dark" />
    </QueryClientProvider>
  );
}
