import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import {
  NotoSerifKR_500Medium,
  NotoSerifKR_700Bold,
  useFonts as useNotoFonts,
} from "@expo-google-fonts/noto-serif-kr";
import { GowunDodum_400Regular } from "@expo-google-fonts/gowun-dodum";
import {
  CormorantGaramond_500Italic,
  CormorantGaramond_600SemiBold,
} from "@expo-google-fonts/cormorant-garamond";
import { BrandSplash } from "@/components/brand";
import { colors } from "@/theme/tokens";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* no-op */
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useNotoFonts({
    NotoSerifKR_500Medium,
    NotoSerifKR_700Bold,
    GowunDodum_400Regular,
    CormorantGaramond_500Italic,
    CormorantGaramond_600SemiBold,
  });

  const [brandSplashDone, setBrandSplashDone] = useState(false);

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
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.cream },
        }}
      />
      <StatusBar style="dark" />
    </>
  );
}
