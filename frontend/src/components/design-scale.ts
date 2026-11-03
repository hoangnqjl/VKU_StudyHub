import { useMemo } from 'react';
import { useWindowDimensions, Platform } from 'react-native';

// Bề ngang khung iPhone tiêu chuẩn trong Figma
export const DESIGN_WIDTH = 402;
export const MAX_DESKTOP_WIDTH = 460;

// Các thuộc tính kích thước sẽ được nhân theo tỉ lệ màn hình
const SCALE_KEYS = new Set([
  'width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'marginHorizontal', 'marginVertical',
  'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'paddingHorizontal', 'paddingVertical',
  'top', 'left', 'right', 'bottom',
  'gap', 'rowGap', 'columnGap',
  'borderRadius', 'fontSize', 'lineHeight', 'letterSpacing', 'shadowRadius',
]);

function scaleStyles<T extends Record<string, any>>(styles: T, k: number): T {
  const out: any = {};
  for (const name of Object.keys(styles)) {
    const st = styles[name];
    const o: any = {};
    for (const key of Object.keys(st)) {
      const v = st[key];
      if (typeof v === 'number' && SCALE_KEYS.has(key)) o[key] = Math.round(v * k * 10) / 10;
      else if (key === 'shadowOffset' && v)
        o[key] = { width: v.width * k, height: v.height * k };
      else o[key] = v;
    }
    out[name] = o;
  }
  return out;
}

/**
 * Tối ưu hiển thị responsive đa nền tảng:
 * - Trên mobile: co giãn linh hoạt theo tỷ lệ màn hình (hệ số k: 0.85 - 1.25)
 * - Trên laptop / desktop / iPad web: cố định hệ số tỉ lệ chuẩn k = 1.05 để chữ và icon sắc nét, không bị vỡ phóng đại quá khổ
 */
export function useDesign<T extends Record<string, any>>(raw: T) {
  const { width } = useWindowDimensions();
  
  const isLargeScreen = width >= 600;
  // Trên desktop/laptop, chuẩn hóa hệ số co giãn vừa mắt người dùng máy tính
  const k = isLargeScreen ? 1.05 : Math.min(Math.max(width / DESIGN_WIDTH, 0.85), 1.25);

  const s = useMemo(() => scaleStyles(raw, k), [raw, k]);
  const z = (n: number) => (isLargeScreen ? n * 1.05 : n * k);
  
  return { s, z, isLargeScreen };
}
