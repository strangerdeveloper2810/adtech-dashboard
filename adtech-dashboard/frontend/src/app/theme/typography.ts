import type { ThemeOptions } from '@mui/material/styles';
import { palette } from './palette';

const fontFamily = '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif';

export const typography: ThemeOptions['typography'] = {
  fontFamily,
  fontSize: 14,

  h1: {
    fontSize: '2.25rem',    // 36px
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '1.875rem',   // 30px
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.5rem',     // 24px
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: '1.25rem',    // 20px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.125rem',   // 18px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1rem',       // 16px
    fontWeight: 600,
    lineHeight: 1.5,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
    color: palette.text.secondary,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
    color: palette.text.secondary,
  },
  body1: {
    fontSize: '0.938rem',   // 15px
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',   // 14px
    lineHeight: 1.6,
  },
  caption: {
    fontSize: '0.75rem',    // 12px
    lineHeight: 1.5,
    color: palette.text.secondary,
  },
  overline: {
    fontSize: '0.688rem',   // 11px
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
  },
};
