import type { PaletteOptions } from '@mui/material/styles';

import { signalTokens as t } from './tokens';
import type { SignalMode } from './tokens';

/**
 * Build a MUI `PaletteOptions` for the Signal design system.
 *
 * Light mode is the canonical spec: cobalt accent on warm paper neutrals.
 * Dark mode raises accent/semantic luminance and inverts the grey ramp so
 * `theme.palette.grey[n]` stays "n steps darker than paper" in both modes.
 */
export function paletteFor(mode: SignalMode): PaletteOptions {
  const isLight = mode === 'light';

  const surface = isLight ? t.surfaces.light : t.surfaces.dark;
  const sem = isLight ? t.semantic : t.semanticDark;
  const grey = isLight ? t.neutral : t.neutralDark;

  const accentMain = isLight ? t.accent.main : t.accent.darkMain;
  const accentLight = isLight ? t.accent.hi : t.accent.darkHi;
  const accentDark = isLight ? t.accent.ink : t.accent.darkInk;

  const secondaryMain = isLight ? t.secondary.main : t.secondary.darkMain;
  const secondaryLight = isLight ? t.secondary.light : t.secondary.darkLight;
  const secondaryDark = isLight ? t.secondary.dark : t.secondary.darkDark;

  const onAccent = t.contrast.onAccent; // white
  // Dark-mode accents are light, so their contrast text is the dark canvas.
  const onColor = isLight ? onAccent : t.surfaces.dark.default;

  return {
    mode,

    primary: {
      main: accentMain,
      light: accentLight,
      dark: accentDark,
      contrastText: onColor,
    },
    secondary: {
      main: secondaryMain,
      light: secondaryLight,
      dark: secondaryDark,
      contrastText: onColor,
    },

    success: { main: sem.success.main, contrastText: onColor },
    warning: { main: sem.warning.main, contrastText: onColor },
    error: { main: sem.error.main, contrastText: onColor },
    info: { main: sem.info.main, contrastText: onColor },

    background: {
      default: surface.default,
      paper: surface.paper,
    },
    text: {
      primary: surface.textPrimary,
      secondary: surface.textSecondary,
      disabled: surface.textDisabled,
    },

    divider: surface.divider,

    grey: {
      50: grey[50],
      100: grey[100],
      200: grey[200],
      300: grey[300],
      400: grey[400],
      500: grey[500],
      600: grey[600],
      700: grey[700],
      800: grey[800],
      900: grey[900],
    },

    common: {
      black: '#000000',
      white: '#FFFFFF',
    },

    // A subtly warmer contrast threshold keeps the muted semantic chips legible.
    contrastThreshold: 3,
    tonalOffset: 0.15,
  };
}
