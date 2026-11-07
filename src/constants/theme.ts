// ============================================================
// Theme Tokens — Thème Clair (Light First) & Thème Sombre
// ============================================================

export const THEME_LIGHT = {
  // Backgrounds
  BG_PRIMARY: '#f8fafc',    // Fond doux et moderne (slate-50)
  BG_CARD: '#ffffff',       // Blanc pur pour cartes et conteneurs
  BG_INPUT: '#f1f5f9',      // Input gris très clair neutre (slate-100)
  BG_SURFACE_ALT: '#e2e8f0', // Surface alternative subtile

  // Text
  TEXT_PRIMARY: '#0f172a',  // Noir ardoise profond, lisibilité maximale (slate-900)
  TEXT_MUTED: '#64748b',    // Gris ardoise médian pour labels (slate-500)
  TEXT_FAINT: '#94a3b8',    // Gris clair pour placeholders (slate-400)

  // Borders
  BORDER: '#e2e8f0',        // Délimitation fine et discrète
  BORDER_FAINT: '#f1f5f9',  // Bordure ultra subtile

  // Accents & Actions
  ACCENT: '#d97706',        // Ambre doré chaleureux (bonne visibilité sur blanc)
  ACCENT_BG: 'rgba(217, 119, 6, 0.12)',
  INFO: '#0284c7',          // Bleu d'information (sky-600)
  INFO_BG: 'rgba(2, 132, 199, 0.12)',
  SUCCESS: '#16a34a',       // Vert émeraude validation (green-600)
  SUCCESS_BG: 'rgba(22, 163, 74, 0.12)',
  DANGER: '#dc2626',        // Rouge alerte (red-600)
  DANGER_BG: 'rgba(220, 38, 38, 0.12)',
  DANGER_BG_LIGHT: 'rgba(220, 38, 38, 0.08)',
  DANGER_BORDER: 'rgba(220, 38, 38, 0.25)',
  MUTED_BG: 'rgba(100, 116, 139, 0.10)',

  // Bottom Navigation Bar
  NAV_BG: '#ffffff',
  NAV_BORDER: 'rgba(226, 232, 240, 0.9)',
  NAV_ACTIVE: '#d97706',
  NAV_INACTIVE: '#94a3b8',
  NAV_SHADOW: 'rgba(15, 23, 42, 0.08)',
} as const;

export const THEME_DARK = {
  // Backgrounds
  BG_PRIMARY: '#060501',
  BG_CARD: '#100e04',
  BG_INPUT: '#18160a',
  BG_SURFACE_ALT: '#221f0f',

  // Text
  TEXT_PRIMARY: '#fef9e7',
  TEXT_MUTED: 'rgba(254, 249, 231, 0.65)',
  TEXT_FAINT: 'rgba(254, 249, 231, 0.40)',

  // Borders
  BORDER: 'rgba(255, 255, 255, 0.12)',
  BORDER_FAINT: 'rgba(255, 255, 255, 0.08)',

  // Accents & Actions
  ACCENT: '#facc15',
  ACCENT_BG: 'rgba(250, 204, 21, 0.20)',
  INFO: '#38bdf8',
  INFO_BG: 'rgba(56, 189, 248, 0.20)',
  SUCCESS: '#4ade80',
  SUCCESS_BG: 'rgba(74, 222, 128, 0.20)',
  DANGER: '#ef4444',
  DANGER_BG: 'rgba(239, 68, 68, 0.20)',
  DANGER_BG_LIGHT: 'rgba(239, 68, 68, 0.15)',
  DANGER_BORDER: 'rgba(239, 68, 68, 0.30)',
  MUTED_BG: 'rgba(148, 163, 184, 0.15)',

  // Bottom Navigation Bar
  NAV_BG: '#100e04',
  NAV_BORDER: 'rgba(255, 255, 255, 0.12)',
  NAV_ACTIVE: '#facc15',
  NAV_INACTIVE: 'rgba(254, 249, 231, 0.45)',
  NAV_SHADOW: 'rgba(0, 0, 0, 0.40)',
} as const;

// Compatibilité descendante directe
export const COLORS = THEME_LIGHT;

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
  xxxl: 20,
  pill: 32,
  full: 9999,
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
