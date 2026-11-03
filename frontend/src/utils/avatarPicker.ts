import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';
import { authService } from '../services/authService';

/**
 * Mở trình chọn ảnh từ thư viện/máy tính và chuyển đổi sang Base64 Data URL
 */
export async function pickImageAsBase64(): Promise<string | null> {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      type: ['image/jpeg', 'image/png', 'image/webp', 'image/*'],
      copyToCacheDirectory: true,
    });

    if (res.canceled || !res.assets || res.assets.length === 0) {
      return null;
    }

    const asset = res.assets[0];

    // Trình duyệt Web: Đọc trực tiếp từ File object nếu có
    if (Platform.OS === 'web' && (asset as any).file) {
      const file = (asset as any).file as File;
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Không thể đọc file ảnh'));
        reader.readAsDataURL(file);
      });
    }

    // Di động hoặc Web Blob URI
    const response = await fetch(asset.uri);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Không thể chuyển đổi blob ảnh'));
      reader.readAsDataURL(blob);
    });
  } catch (err: any) {
    console.error('[AvatarPicker] Lỗi khi chọn ảnh:', err.message);
    return null;
  }
}

/**
 * Chọn và tải ảnh đại diện lên Cloudinary (có fallback an toàn)
 */
export async function pickAndUploadAvatar(): Promise<{
  success: boolean;
  avatarUrl?: string;
  isCloudinary?: boolean;
  error?: string;
}> {
  const base64 = await pickImageAsBase64();
  if (!base64) {
    return { success: false };
  }

  try {
    const uploadRes = await authService.uploadAvatar(base64);
    return {
      success: true,
      avatarUrl: uploadRes.avatarUrl,
      isCloudinary: uploadRes.isCloudinary,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Không thể tải ảnh lên',
    };
  }
}

