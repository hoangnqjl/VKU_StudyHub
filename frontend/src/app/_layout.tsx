import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { AlertProvider } from '../components/AlertContext';
import { LoadingProvider } from '../components/LoadingContext';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.setAttribute('data-gramm', 'false');
      document.body.setAttribute('data-gramm_editor', 'false');
      document.body.setAttribute('data-enable-grammarly', 'false');
      document.body.setAttribute('spellcheck', 'false');

      // Inject TemoFlutter iOS smooth route transition (Curves.easeInOutCubic 350ms)
      const styleId = 'temo-screen-transitions';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          @keyframes temoScreenEnter {
            0% {
              opacity: 0.1;
              transform: translate3d(28px, 0, 0);
            }
            100% {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }

          /* Animate all navigation screens smoothly */
          .temo-route-screen {
            animation: temoScreenEnter 350ms cubic-bezier(0.65, 0.05, 0.36, 1) both;
            will-change: transform, opacity;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <AlertProvider>
      <LoadingProvider>
        <View style={styles.appShell}>
          <View style={styles.appContainer}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                animationDuration: 350,
                gestureEnabled: true,
                contentStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
          </View>
        </View>
      </LoadingProvider>
    </AlertProvider>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: '#0F172A', // Nền tối sang trọng bao quanh khi mở trên màn hình rộng máy tính / laptop
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 500, // Khung chuẩn ứng dụng di động trên màn hình laptop
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
      },
    }),
  },
});
