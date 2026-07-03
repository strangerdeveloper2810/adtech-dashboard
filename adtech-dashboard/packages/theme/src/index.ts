import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

import { paletteFor } from './palette';
import { typography } from './typography';
import { shadowsFor } from './shadows';
import { componentsFor } from './components';
import { signalTokens } from './tokens';
import type { SignalMode } from './tokens';

/**
 * Build the Signal MUI theme for a given colour mode.
 *
 * This is the single entry point the app should use:
 *
 * ```ts
 * import { createSignalTheme } from '@adtech/theme';
 * const theme = createSignalTheme('dark');
 * ```
 */
export function createSignalTheme(mode: SignalMode = 'light'): Theme {
  return createTheme({
    palette: paletteFor(mode),
    typography,
    shadows: shadowsFor(mode),
    shape: { borderRadius: signalTokens.radius.base },
    spacing: signalTokens.spacing,
    components: componentsFor(mode),
  });
}

/** Prebuilt light theme (convenience default). */
export const lightTheme: Theme = createSignalTheme('light');

/** Prebuilt dark theme (convenience). */
export const darkTheme: Theme = createSignalTheme('dark');

/* ---- Public API ---------------------------------------------------- */
export { signalTokens };
export type { SignalTokens, SignalMode } from './tokens';

export { paletteFor } from './palette';
export { typography } from './typography';
export { shadows, shadowsFor } from './shadows';
export { componentsFor } from './components';

/** Default export: the canonical light theme. */
export default lightTheme;
