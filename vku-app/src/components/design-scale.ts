import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

// Bề ngang khung iPhone trong Figma
export const DESIGN_WIDTH = 402;

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
      if (typeof v === 'number' && SCALE_KEYS.has(key)) o[key] = v * k;
      else if (key === 'shadowOffset' && v)
        o[key] = { width: v.width * k, height: v.height * k };
      else o[key] = v;
    }
    out[name] = o;
  }
  return out;
}

/**
 * Nhân toàn bộ kích thước theo bề ngang điện thoại / 402 (bề ngang thiết kế),
 * để bố cục, cỡ chữ và chỗ ngắt dòng giống thiết kế trên mọi cỡ màn hình.
 * Trả về: s = style đã nhân tỉ lệ, z = hàm nhân tỉ lệ cho số viết trực tiếp.
 */
export function useDesign<T extends Record<string, any>>(raw: T) {
  const { width } = useWindowDimensions();
  const k = Math.min(Math.max(width / DESIGN_WIDTH, 0.7), 1.4);
  const s = useMemo(() => scaleStyles(raw, k), [raw, k]);
  const z = (n: number) => n * k;
  return { s, z };
}