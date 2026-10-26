import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0F1629" />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="radar/invite" options={{ presentation: 'modal' }} />
          <Stack.Screen name="radar/match" options={{ presentation: 'modal' }} />
          <Stack.Screen name="docs/upload" options={{ presentation: 'modal' }} />
          <Stack.Screen name="docs/view" />
          <Stack.Screen name="docs/qr" options={{ presentation: 'modal' }} />
          <Stack.Screen name="docs/scan" options={{ presentation: 'modal' }} />
          <Stack.Screen name="pomodoro/room" />
          <Stack.Screen name="pomodoro/create" options={{ presentation: 'modal' }} />
          <Stack.Screen name="pomodoro/join" options={{ presentation: 'modal' }} />
          <Stack.Screen name="profile/edit" />
          <Stack.Screen name="profile/subjects" />
          <Stack.Screen name="notifications" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
