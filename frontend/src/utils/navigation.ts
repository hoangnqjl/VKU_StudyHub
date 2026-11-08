import { router } from 'expo-router';
import { Platform } from 'react-native';

export function triggerScreenTransition(isBack: boolean = false) {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const target = document.querySelector('[data-testid="screen-stage"]') as HTMLElement | null;
    if (target) {
      target.classList.remove('vku-screen-enter-forward', 'vku-screen-enter-back');
      void target.offsetWidth;
      target.classList.add(isBack ? 'vku-screen-enter-back' : 'vku-screen-enter-forward');
    }
  }
}

/**
 * Điều hướng quay lại an toàn với animation slide lùi mượt mà.
 * Nếu không có màn hình trước đó trong lịch sử (người dùng F5, vào link trực tiếp),
 * tự động chuyển hướng về trang fallback thay vì gây lỗi 'GO_BACK was not handled'.
 */
export function safeBack(fallback: string = '/home') {
  triggerScreenTransition(true);
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback as any);
  }
}
