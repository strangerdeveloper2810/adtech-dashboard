import type { ThemeOptions } from '@mui/material/styles';
import { palette } from '../palette';
import { shadows } from '../shadows';

const borderRadius = 8;

export const surfaceComponents: ThemeOptions['components'] = {
  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        border: `1px solid ${palette.divider}`,
        borderRadius,
        boxShadow: shadows?.[2],
      },
    },
  },

  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 24,
        '&:last-child': { paddingBottom: 24 },
      },
    },
  },

  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: { backgroundImage: 'none' },
      rounded: { borderRadius },
    },
  },
};
