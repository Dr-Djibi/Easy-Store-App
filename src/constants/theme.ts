// ============================================================
// Theme Tokens — Senior Developer Obsidian Minimalist & Clean Light
// ============================================================

export const THEME_LIGHT = {
  // Backgrounds - Modern Clean Slate
  BG_PRIMARY: '#f8fafc',      // Slate-50 ultra-propre
  BG_CARD: '#ffffff',         // Blanc pur pour les cartes
  BG_INPUT: '#f1f5f9',        // Slate-100 neutre
  BG_SURFACE_ALT: '#e2e8f0',   // Slate-200 pour délimitations

  // Text
  TEXT_PRIMARY: '#0f172a',    // Noir ardoise profond (Slate-900)
  TEXT_MUTED: '#64748b',      // Slate-500 pour labels
  TEXT_FAINT: '#94a3b8',      // Slate-400 placeholders

  // Borders
  BORDER: '#e2e8f0',          // Bordure fine
  BORDER_FAINT: '#f1f5f9',    // Bordure subtile

  // Accent Senior Dev : Indigo / Noir élégant
  ACCENT: '#0f172a',          // Noir profond / Slate-900 pur pour actions principales
  ACCENT_BG: 'rgba(15, 23, 42, 0.08)',
  INFO: '#2563eb',            // Bleu corporate
  INFO_BG: 'rgba(37, 99, 235, 0.08)',
  SUCCESS: '#16a34a',         // Vert émeraude sobre
  SUCCESS_BG: 'rgba(22, 163, 74, 0.08)',
  DANGER: '#dc2626',          // Rouge sobre
  DANGER_BG: 'rgba(220, 38, 38, 0.08)',
  DANGER_BG_LIGHT: 'rgba(220, 38, 38, 0.05)',
  DANGER_BORDER: 'rgba(220, 38, 38, 0.20)',
  MUTED_BG: 'rgba(100, 116, 139, 0.08)',

  // Bottom Navigation Bar
  NAV_BG: '#ffffff',
  NAV_BORDER: '#e2e8f0',
  NAV_ACTIVE: '#0f172a',
  NAV_INACTIVE: '#94a3b8',
  NAV_SHADOW: 'rgba(15, 23, 42, 0.06)',
} as const;

export const THEME_DARK = {
  // Backgrounds - Obsidian Deep Slate (fini le jaune criard, place au luxe sobre)
  BG_PRIMARY: '#090a0f',      // Noir bleuté profond
  BG_CARD: '#12141c',         // Surface surélevée Slate sombre
  BG_INPUT: '#1a1d27',        // Surface d'input sobre
  BG_SURFACE_ALT: '#222634',   // Surface de séparation

  // Text
  TEXT_PRIMARY: '#f8fafc',    // Blanc pur anti-reflet
  TEXT_MUTED: '#94a3b8',      // Slate doux pour descriptions
  TEXT_FAINT: '#64748b',      // Placeholders

  // Borders
  BORDER: 'rgba(255, 255, 255, 0.08)',
  BORDER_FAINT: 'rgba(255, 255, 255, 0.04)',

  // Accent Senior Dev : Blanc titane / Indigo néon sobre
  ACCENT: '#f8fafc',          // Blanc titane éclatant
  ACCENT_BG: 'rgba(248, 250, 252, 0.12)',
  INFO: '#38bdf8',            // Bleu glacier
  INFO_BG: 'rgba(56, 189, 248, 0.12)',
  SUCCESS: '#34d399',         // Vert menthe sobre
  SUCCESS_BG: 'rgba(52, 211, 153, 0.12)',
  DANGER: '#f87171',          // Rouge doux
  DANGER_BG: 'rgba(248, 113, 113, 0.12)',
  DANGER_BG_LIGHT: 'rgba(248, 113, 113, 0.08)',
  DANGER_BORDER: 'rgba(248, 113, 113, 0.25)',
  MUTED_BG: 'rgba(148, 163, 184, 0.10)',

  // Bottom Navigation Bar
  NAV_BG: '#12141c',
  NAV_BORDER: 'rgba(255, 255, 255, 0.08)',
  NAV_ACTIVE: '#f8fafc',
  NAV_INACTIVE: '#64748b',
  NAV_SHADOW: 'rgba(0, 0, 0, 0.50)',
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
