import { router } from 'expo-router';

/**
 * Điều hướng quay lại an toàn.
 * Nếu không có màn hình trước đó trong lịch sử (người dùng F5, vào link trực tiếp),
 * tự động chuyển hướng về trang fallback thay vì gây lỗi 'GO_BACK was not handled'.
 */
export function safeBack(fallback: string = '/home') {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback as any);
  }
}

