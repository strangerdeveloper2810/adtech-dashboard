/**
 * Signal — AdTech Design System · raw design tokens.
 *
 * Single source of truth. Every other file in this package derives its values
 * from `signalTokens`. Editorial precision: warm paper neutrals, one cobalt
 * signal, Fraunces / Geist / Geist Mono type system.
 *
 * Mirrors the CSS custom properties in `apps/web/design-system.html`.
 * No hardcoded hex anywhere else — change a token here, change the product.
 */

export const signalTokens = {
  /* ---- Type families ------------------------------------------------ */
  font: {
    /** Body & UI — Geist (self-hosted variable) */
    sans: '"Geist Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    /** Display headings (h1–h3) — Instrument Serif (self-hosted) */
    serif: '"Instrument Serif", Georgia, "Times New Roman", serif',
    /** Overline / numeric / code / tokens — Geist Mono (self-hosted variable) */
    mono: '"Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace',
  },

  /* ---- Warm neutral scale (light, canonical) ------------------------ */
  neutral: {
    50: '#FBFAF8',
    100: '#F4F1EC',
    200: '#E7E1D6',
    300: '#D9D1C2',
    400: '#B8AF9F',
    500: '#8A8175',
    600: '#6B6355',
    700: '#514B3E',
    800: '#38332A',
    900: '#211E18',
  },

  /* ---- Warm neutral scale (dark, inverted for grey ramp) ------------ */
  neutralDark: {
    50: '#211E18',
    100: '#2A2620',
    200: '#38332A',
    300: '#514B3E',
    400: '#6B6355',
    500: '#8A8175',
    600: '#B8AF9F',
    700: '#D9D1C2',
    800: '#E7E1D6',
    900: '#F4F1EC',
  },

  /* ---- Brand / accent — cobalt -------------------------------------- */
  accent: {
    /** primary.main (light) */
    main: '#2340D9',
    /** hover / pressed / on-soft ink → primary.dark (light) */
    ink: '#1B33B0',
    /** highlight → primary.light (light) */
    hi: '#3D57E8',
    /** soft tint (chips, selected rows, focus ring) */
    soft: '#EAEDFC',
    /** dark-mode accent (raised luminance) → primary.main (dark) */
    darkMain: '#7C8FF7',
    darkInk: '#93A3F9',
    darkHi: '#A6B3FA',
    darkSoft: '#20223A',
  },

  /* ---- Secondary — refined violet (complements cobalt) -------------- */
  secondary: {
    main: '#6D5DD3',
    light: '#9C90E4',
    dark: '#4E3FB0',
    darkMain: '#A79BF0',
    darkLight: '#C0B7F5',
    darkDark: '#7E6FDB',
  },

  /* ---- Semantic (light) --------------------------------------------- */
  semantic: {
    success: { main: '#0F766E', soft: '#E2F1EF' },
    warning: { main: '#B45309', soft: '#FBEEDD' },
    error: { main: '#BE123C', soft: '#FBE6EC' },
    info: { main: '#0E7490', soft: '#E1F1F5' },
  },

  /* ---- Semantic (dark, raised luminance) ---------------------------- */
  semanticDark: {
    success: { main: '#5EBAAF', soft: '#16231F' },
    warning: { main: '#E0913F', soft: '#2A2013' },
    error: { main: '#F0728E', soft: '#2C1620' },
    info: { main: '#4DB6CE', soft: '#12232A' },
  },

  /* ---- Surfaces & text ---------------------------------------------- */
  surfaces: {
    light: {
      /** app canvas (paper-toned) → background.default */
      default: '#FBFAF8',
      /** raised panels / cards → background.paper */
      paper: '#FFFFFF',
      /** recessed fills (inputs, table hover, toolbars) */
      surface: '#F4F1EC',
      divider: '#E7E1D6',
      dividerStrong: '#D9D1C2',
      textPrimary: '#17150F',
      textSecondary: '#6B6355',
      textDisabled: '#B8AF9F',
    },
    dark: {
      default: '#14120E',
      paper: '#201D17',
      surface: '#1C1A15',
      divider: '#2E2A22',
      dividerStrong: '#3A352B',
      textPrimary: '#F3EEE4',
      textSecondary: '#A69C8B',
      textDisabled: '#6B6355',
    },
  },

  /** Constant on-accent text for the cobalt light-mode accent. */
  contrast: {
    onAccent: '#FFFFFF',
  },

  /* ---- Radius (MUI shape.borderRadius base = 8) --------------------- */
  radius: {
    base: 8,
    xs: 4,
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    pill: 999,
  },

  /* ---- Spacing (8px base) ------------------------------------------- */
  spacing: 8,

  /* ---- Elevation (warm-tinted) — 4 real levels --------------------- */
  shadows: {
    /** index 0 → e-1 (subtle) … index 3 → e-4 (modal) */
    light: [
      '0 1px 2px rgba(33,30,24,.06)',
      '0 1px 3px rgba(33,30,24,.10), 0 1px 2px rgba(33,30,24,.06)',
      '0 6px 16px -6px rgba(33,30,24,.16), 0 2px 6px -2px rgba(33,30,24,.08)',
      '0 20px 40px -12px rgba(33,30,24,.24)',
    ],
    dark: [
      '0 1px 2px rgba(0,0,0,.4)',
      '0 1px 3px rgba(0,0,0,.5), 0 1px 2px rgba(0,0,0,.4)',
      '0 8px 20px -8px rgba(0,0,0,.6)',
      '0 24px 48px -12px rgba(0,0,0,.7)',
    ],
  },
} as const;

export type SignalTokens = typeof signalTokens;

/** Design-system colour modes. */
export type SignalMode = 'light' | 'dark';
