import type { TypographyVariantsOptions } from '@mui/material/styles';

import { signalTokens as t } from './tokens';

const { sans, serif, mono } = t.font;

/**
 * Signal type system.
 *
 * - Fraunces (serif) for voice: display h1–h3 and headline numbers.
 * - Geist (sans) for the working interface: h4–h6, body, buttons, captions.
 * - Geist Mono for tokens, tabular numerals and the overline eyebrow.
 *
 * Base UI size is 14px; body copy reads at 15px on a 1.6 rhythm.
 */
export const typography: TypographyVariantsOptions = {
  fontFamily: sans,
  fontSize: 14,
  fontWeightLight: 400,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,

  /* ---- Display · Instrument Serif (single weight 400) --------------- */
  h1: {
    fontFamily: serif,
    fontWeight: 400,
    fontSize: '2.5rem', // 40px — serif reads smaller, so bump
    lineHeight: 1.1,
    letterSpacing: '-0.01em',
  },
  h2: {
    fontFamily: serif,
    fontWeight: 400,
    fontSize: '2rem', // 32px
    lineHeight: 1.15,
    letterSpacing: '-0.005em',
  },
  h3: {
    fontFamily: serif,
    fontWeight: 400,
    fontSize: '1.625rem', // 26px
    lineHeight: 1.2,
    letterSpacing: 0,
  },

  /* ---- Titles · Geist ----------------------------------------------- */
  h4: {
    fontFamily: sans,
    fontWeight: 600,
    fontSize: '1.25rem', // 20px
    lineHeight: 1.3,
    letterSpacing: '-0.005em',
  },
  h5: {
    fontFamily: sans,
    fontWeight: 600,
    fontSize: '1.125rem', // 18px
    lineHeight: 1.4,
  },
  h6: {
    fontFamily: sans,
    fontWeight: 600,
    fontSize: '1rem', // 16px
    lineHeight: 1.5,
  },

  subtitle1: {
    fontFamily: sans,
    fontWeight: 500,
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  subtitle2: {
    fontFamily: sans,
    fontWeight: 500,
    fontSize: '0.875rem', // 14px
    lineHeight: 1.5,
  },

  /* ---- Body · Geist ------------------------------------------------- */
  body1: {
    fontFamily: sans,
    fontWeight: 400,
    fontSize: '0.9375rem', // 15px
    lineHeight: 1.6,
  },
  body2: {
    fontFamily: sans,
    fontWeight: 400,
    fontSize: '0.875rem', // 14px
    lineHeight: 1.6,
  },

  caption: {
    fontFamily: sans,
    fontWeight: 400,
    fontSize: '0.75rem', // 12px
    lineHeight: 1.5,
  },

  button: {
    fontFamily: sans,
    fontWeight: 500,
    fontSize: '0.875rem', // 14px
    lineHeight: 1,
    letterSpacing: 0,
    textTransform: 'none',
  },

  /* ---- Overline · Geist Mono (eyebrow) ------------------------------ */
  overline: {
    fontFamily: mono,
    fontWeight: 500,
    fontSize: '0.6875rem', // 11px
    lineHeight: 1.5,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
  },
};
