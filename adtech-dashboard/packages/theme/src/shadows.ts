import type { Shadows } from '@mui/material/styles';

import { signalTokens as t } from './tokens';
import type { SignalMode } from './tokens';

/**
 * Warm-tinted elevation ramp.
 *
 * MUI expects exactly 25 entries (`shadows[0]` is always `'none'`). Signal
 * uses four honest levels — e-1 subtle · e-2 card · e-3 pop · e-4 modal —
 * mapped to indices 1–4; every deeper slot collapses back to `'none'` so
 * nothing in the product invents a heavier shadow than the system allows.
 */
function buildShadows(mode: SignalMode): Shadows {
  const real = mode === 'light' ? t.shadows.light : t.shadows.dark;
  return ['none', ...real, ...Array(20).fill('none')] as unknown as Shadows;
}

/** Mode-aware elevation ramp. */
export function shadowsFor(mode: SignalMode): Shadows {
  return buildShadows(mode);
}

/** Default (light) elevation ramp — 4 real levels then `'none'`. */
export const shadows: Shadows = buildShadows('light');
