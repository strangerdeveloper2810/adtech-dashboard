import type { ThemeOptions } from '@mui/material/styles';
import { palette } from '../palette';

export const buttonComponents: ThemeOptions['components'] = {
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
        textTransform: 'none',
        padding: '6px 16px',
      },
      sizeSmall: { padding: '4px 12px', fontSize: '0.813rem' },
      sizeLarge: { padding: '10px 24px', fontSize: '0.938rem' },
      outlined: {
        borderColor: palette.grey[300],
        '&:hover': { borderColor: palette.grey[400], backgroundColor: palette.grey[50] },
      },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: { borderRadius: 6 },
    },
  },

  MuiButtonGroup: {
    defaultProps: { disableElevation: true },
  },
};
