import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { AlertProvider } from '../components/AlertContext';
import { LoadingProvider } from '../components/LoadingContext';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Auto reload on chunk load failure / stale bundle
      const handleChunkError = (e: ErrorEvent) => {
        const msg = e?.message || '';
        if (
          msg.includes('Loading module') ||
          msg.includes('Requiring unknown module') ||
          msg.includes("expected expression, got '<'") ||
          msg.includes('Loading chunk')
        ) {
          console.warn('Phát hiện phiên bản web mới, đang đồng bộ và tải lại...', msg);
          window.location.reload();
        }
      };
      window.addEventListener('error', handleChunkError);

      document.body.setAttribute('data-gramm', 'false');
      document.body.setAttribute('data-gramm_editor', 'false');
      document.body.setAttribute('data-enable-grammarly', 'false');
      document.body.setAttribute('spellcheck', 'false');

      // Unified Smooth Route Transitions (Slide & Fade Curves.easeInOutCubic)
      const styleId = 'vku-screen-transitions';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          @keyframes vkuSlideForward {
            0% {
              opacity: 0.25;
              transform: translate3d(36px, 0, 0);
            }
            100% {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }

          @keyframes vkuSlideBack {
            0% {
              opacity: 0.25;
              transform: translate3d(-36px, 0, 0);
            }
            100% {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }

          .vku-screen-enter-forward {
            animation: vkuSlideForward 320ms cubic-bezier(0.16, 1, 0.3, 1) both !important;
            will-change: transform, opacity;
          }

          .vku-screen-enter-back {
            animation: vkuSlideBack 320ms cubic-bezier(0.16, 1, 0.3, 1) both !important;
            will-change: transform, opacity;
          }

          /* Bỏ hoàn toàn viền chữ nhật xanh mặc định của trình duyệt trên mọi input */
          input, textarea, select {
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none !important;
            -webkit-tap-highlight-color: transparent !important;
          }

          input:focus, textarea:focus, select:focus {
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none !important;
          }

          /* Hiệu ứng viền xanh hiện ra từ từ cho mọi thanh tìm kiếm & ô nhập liệu khi ấn vào */
          div:has(> input),
          div:has(> textarea),
          div:has(> div > input),
          div:has(> form > input) {
            transition: border-color 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }

          div:has(> input:focus),
          div:has(> textarea:focus),
          div:has(> div > input:focus),
          div:has(> form > input:focus) {
            border-color: #208AEF !important;
            box-shadow: 0 0 0 3px rgba(32, 138, 239, 0.18) !important;
          }
        `;
        document.head.appendChild(style);
      }

      // Xử lý sự kiện focusin / focusout đồng bộ mượt mà cho mọi ô nhập liệu
      const onFocusIn = (e: any) => {
        const el = e.target;
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
          el.style.outline = 'none';
          const parent = el.closest('div[style*="border"], div[style*="Border"]');
          if (parent && parent.getAttribute('data-testid') !== 'screen-stage' && parent.getAttribute('data-testid') !== 'app-container') {
            parent.style.transition = 'border-color 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
            parent.style.borderColor = '#208AEF';
            parent.style.boxShadow = '0 0 0 3px rgba(32, 138, 239, 0.18)';
          }
        }
      };

      const onFocusOut = (e: any) => {
        const el = e.target;
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
          const parent = el.closest('div[style*="border"], div[style*="Border"]');
          if (parent) {
            parent.style.borderColor = '';
            parent.style.boxShadow = '';
          }
        }
      };

      document.addEventListener('focusin', onFocusIn, true);
      document.addEventListener('focusout', onFocusOut, true);

      const triggerScreenTransition = (isBack = false) => {
        const target = document.querySelector('[data-testid="screen-stage"]') || document.querySelector('#root > div > div');
        if (target) {
          target.classList.remove('vku-screen-enter-forward', 'vku-screen-enter-back');
          void target.offsetWidth;
          target.classList.add(isBack ? 'vku-screen-enter-back' : 'vku-screen-enter-forward');
        }
      };

      const onPopState = () => triggerScreenTransition(true);
      window.addEventListener('popstate', onPopState);

      const origPush = history.pushState;
      history.pushState = function (...args) {
        origPush.apply(this, args);
        triggerScreenTransition(false);
      };

      const origReplace = history.replaceState;
      history.replaceState = function (...args) {
        origReplace.apply(this, args);
        triggerScreenTransition(false);
      };
    }
  }, []);

  return (
    <AlertProvider>
      <LoadingProvider>
        <View style={styles.appShell}>
          <View style={styles.appContainer}>
            <View testID="screen-stage" style={styles.screenStage}>
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                  animationDuration: 320,
                  gestureEnabled: true,
                  animationTypeForReplace: 'push',
                  contentStyle: { backgroundColor: '#FFFFFF' },
                }}
              />
            </View>
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
  screenStage: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
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
