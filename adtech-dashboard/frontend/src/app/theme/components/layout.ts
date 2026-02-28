import type { ThemeOptions } from '@mui/material/styles';
import { palette } from '../palette';

export const layoutComponents: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': { width: 6, height: 6 },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: palette.grey[300],
          borderRadius: 3,
        },
      },
    },
  },

  MuiContainer: {
    defaultProps: { maxWidth: 'xl' },
    styleOverrides: {
      root: { paddingLeft: 24, paddingRight: 24 },
    },
  },

  MuiStack: {
    defaultProps: { useFlexGap: true },
  },
};
