import type { Components, Theme } from '@mui/material/styles';

import { signalTokens as t } from './tokens';
import type { SignalMode } from './tokens';

/**
 * MUI component overrides for the Signal design system.
 *
 * Every value resolves from `signalTokens` at build time (mode is fixed per
 * theme), so overrides stay static objects — no `ownerState` callbacks needed.
 * The editorial-precision feel: flat elevation, warm borders, a cobalt focus
 * ring, mono uppercase table headers and pill status chips.
 */
export function componentsFor(mode: SignalMode): Components<Theme> {
  const isLight = mode === 'light';

  const surface = isLight ? t.surfaces.light : t.surfaces.dark;
  const sem = isLight ? t.semantic : t.semanticDark;
  const neutral = isLight ? t.neutral : t.neutralDark;

  const accentMain = isLight ? t.accent.main : t.accent.darkMain;
  const accentInk = isLight ? t.accent.ink : t.accent.darkInk;
  const accentSoft = isLight ? t.accent.soft : t.accent.darkSoft;
  const onAccent = t.contrast.onAccent;

  const errorMain = sem.error.main;
  const errorSoft = sem.error.soft;

  const { radius, shadows } = t;
  const level = isLight ? shadows.light : shadows.dark;
  const e1 = level[0];
  const e3 = level[2];

  const focusRing = `0 0 0 3px ${accentSoft}`;
  const errorFocusRing = `0 0 0 3px ${errorSoft}`;

  // Inverted tooltip: dark chip on light, light chip on dark.
  const tooltipBg = neutral[900];
  const tooltipFg = neutral[50];

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          backgroundColor: surface.default,
          color: surface.textPrimary,
        },
        '::selection': {
          backgroundColor: accentMain,
          color: onAccent,
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: radius.base,
          textTransform: 'none',
          fontWeight: 500,
          lineHeight: 1,
          padding: '10px 16px',
          transition:
            'background-color 120ms cubic-bezier(.22,.61,.36,1), border-color 120ms cubic-bezier(.22,.61,.36,1), color 120ms cubic-bezier(.22,.61,.36,1)',
          '&.Mui-focusVisible': {
            outline: `2px solid ${accentMain}`,
            outlineOffset: '2px',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8125rem', // 13px
          borderRadius: radius.sm,
        },
        sizeLarge: {
          padding: '13px 22px',
          fontSize: '0.9375rem', // 15px
        },
        containedPrimary: {
          boxShadow: e1,
          '&:hover': {
            backgroundColor: accentInk,
            boxShadow: e1,
          },
        },
        outlined: {
          borderColor: surface.dividerStrong,
          color: surface.textPrimary,
          '&:hover': {
            borderColor: accentMain,
            color: accentInk,
            backgroundColor: 'transparent',
          },
        },
        text: {
          color: surface.textSecondary,
          '&:hover': {
            backgroundColor: surface.surface,
            color: surface.textPrimary,
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          color: surface.textSecondary,
          '&:hover': {
            backgroundColor: surface.surface,
            color: surface.textPrimary,
          },
        },
      },
    },

    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: surface.paper,
          color: surface.textPrimary,
        },
        outlined: {
          border: `1px solid ${surface.divider}`,
        },
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          border: `1px solid ${surface.divider}`,
          backgroundImage: 'none',
          backgroundColor: surface.paper,
          boxShadow: e1,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius.base,
          backgroundColor: surface.paper,
          transition:
            'box-shadow 120ms cubic-bezier(.22,.61,.36,1), border-color 120ms cubic-bezier(.22,.61,.36,1)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: surface.dividerStrong,
            transition: 'border-color 120ms cubic-bezier(.22,.61,.36,1)',
          },
          '&:hover:not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline':
            {
              borderColor: neutral[400],
            },
          '&.Mui-focused': {
            boxShadow: focusRing,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: accentMain,
            borderWidth: 1,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: errorMain,
          },
          '&.Mui-error.Mui-focused': {
            boxShadow: errorFocusRing,
          },
        },
        input: {
          '&::placeholder': {
            color: surface.textDisabled,
            opacity: 1,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: surface.textSecondary,
          fontSize: '0.875rem',
          fontWeight: 500,
          '&.Mui-focused': {
            color: accentMain,
          },
          '&.Mui-error': {
            color: errorMain,
          },
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          marginLeft: 2,
          color: surface.textSecondary,
          '&.Mui-error': {
            color: errorMain,
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radius.pill,
          fontWeight: 500,
          fontSize: '0.78rem',
        },
        outlined: {
          borderColor: surface.divider,
        },
        filled: {
          backgroundColor: surface.surface,
          color: surface.textSecondary,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tooltipBg,
          color: tooltipFg,
          fontFamily: t.font.sans,
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: radius.sm,
          padding: '6px 10px',
          boxShadow: e3,
        },
        arrow: {
          color: tooltipBg,
        },
      },
    },

    MuiAppBar: {
      defaultProps: {
        color: 'default',
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: surface.paper,
          color: surface.textPrimary,
          backgroundImage: 'none',
          boxShadow: 'none',
          border: 'none',
          borderBottom: `1px solid ${surface.divider}`,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: surface.divider,
        },
      },
    },

    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
      styleOverrides: {
        root: {
          color: accentMain,
          fontWeight: 500,
          '&:hover': {
            color: accentInk,
          },
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: radius.md,
          border: `1px solid ${surface.divider}`,
          boxShadow: e3,
          marginTop: 4,
          backgroundImage: 'none',
        },
        list: {
          padding: 6,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          fontSize: '0.875rem',
          color: surface.textSecondary,
          '&:hover': {
            backgroundColor: surface.surface,
            color: surface.textPrimary,
          },
          '&.Mui-selected': {
            backgroundColor: accentSoft,
            color: accentInk,
          },
          '&.Mui-selected:hover': {
            backgroundColor: accentSoft,
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${surface.divider}`,
        },
        head: {
          fontFamily: t.font.mono,
          fontSize: '0.6875rem', // 11px
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: surface.textSecondary,
          borderBottom: `1px solid ${surface.dividerStrong}`,
          whiteSpace: 'nowrap',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td, &:last-child th': {
            borderBottom: 0,
          },
          '&.MuiTableRow-hover:hover': {
            backgroundColor: surface.surface,
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: accentMain,
          height: 2,
          borderRadius: 2,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          color: surface.textSecondary,
          '&:hover': {
            color: surface.textPrimary,
          },
          '&.Mui-selected': {
            color: accentInk,
          },
        },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderColor: surface.divider,
          color: surface.textSecondary,
          '&:hover': {
            backgroundColor: surface.surface,
          },
          '&.Mui-selected': {
            backgroundColor: accentSoft,
            color: accentInk,
            '&:hover': {
              backgroundColor: accentSoft,
            },
          },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          fontSize: '0.875rem',
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radius.lg,
          border: `1px solid ${surface.divider}`,
          backgroundImage: 'none',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: t.font.serif,
          fontWeight: 600,
          fontSize: '1.25rem',
          letterSpacing: '-0.01em',
        },
      },
    },
  };
}
