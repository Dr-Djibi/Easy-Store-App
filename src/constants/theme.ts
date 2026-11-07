// ============================================================
// Theme — Source unique de vérité pour couleurs et espacements
// ============================================================

export const COLORS = {
  // Backgrounds
  BG_PRIMARY: '#060501',
  BG_CARD: '#100e04',
  BG_INPUT: '#18160a',

  // Text
  TEXT_PRIMARY: '#fef9e7',
  TEXT_MUTED: 'rgba(254, 249, 231, 0.65)',
  TEXT_FAINT: 'rgba(254, 249, 231, 0.4)',

  // Borders
  BORDER: 'rgba(255, 255, 255, 0.12)',
  BORDER_FAINT: 'rgba(255, 255, 255, 0.08)',

  // Accents
  ACCENT: '#facc15',
  INFO: '#38bdf8',
  SUCCESS: '#4ade80',
  DANGER: '#ef4444',

  // Accent backgrounds (semi-transparent)
  ACCENT_BG: 'rgba(250, 204, 21, 0.2)',
  INFO_BG: 'rgba(56, 189, 248, 0.2)',
  SUCCESS_BG: 'rgba(74, 222, 128, 0.2)',
  DANGER_BG: 'rgba(239, 68, 68, 0.2)',
  DANGER_BG_LIGHT: 'rgba(239, 68, 68, 0.15)',
  DANGER_BORDER: 'rgba(239, 68, 68, 0.3)',
  MUTED_BG: 'rgba(148, 163, 184, 0.15)',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 30,
} as const;

export const RADII = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  xxxl: 18,
} as const;

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 13,
  base: 14,
  lg: 15,
  xl: 16,
  xxl: 22,
  xxxl: 24,
} as const;
