// VKU StudyHub – Brand Color Tokens
export const Colors = {
  // Primary palette
  primary: '#FED014',       // Vàng VKU
  primaryDark: '#E5B800',
  primaryLight: '#FFF3B0',

  danger: '#DF0218',        // Đỏ VKU
  dangerDark: '#B50114',
  dangerLight: '#FFE0E3',

  accent: '#374F8A',        // Xanh dương VKU
  accentDark: '#243660',
  accentLight: '#C9D5F5',

  // Neutral
  white: '#FFFFFF',
  black: '#0A0A0A',

  // Surface / Background
  bgBase: '#0F1629',        // Dark navy background
  bgCard: '#1A2540',        // Card surface
  bgCardAlt: '#1F2D4E',
  bgInput: '#243057',

  // Text
  textPrimary: '#F0F4FF',
  textSecondary: '#8B9CC8',
  textMuted: '#4E5F8A',
  textInvert: '#0F1629',

  // Status
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Radar / Status indicators
  online: '#22C55E',
  busy: '#F59E0B',
  offline: '#6B7280',

  // Overlay
  overlay: 'rgba(15, 22, 41, 0.85)',
  overlayLight: 'rgba(15, 22, 41, 0.5)',

  // Border
  border: '#2A3A63',
  borderLight: 'rgba(55, 79, 138, 0.3)',
} as const;

// Gradient presets
export const Gradients = {
  primary: ['#FED014', '#E5B800'] as const,
  danger: ['#DF0218', '#9B0110'] as const,
  accent: ['#374F8A', '#243660'] as const,
  hero: ['#0F1629', '#1A2540', '#243057'] as const,
  card: ['#1A2540', '#1F2D4E'] as const,
  golden: ['#FED014', '#FFB300', '#FF8800'] as const,
  radar: ['#374F8A', '#243660', '#0F1629'] as const,
  pomodoro: ['#DF0218', '#B50114', '#7A000C'] as const,
} as const;
