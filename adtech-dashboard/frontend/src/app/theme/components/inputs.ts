import type { ThemeOptions } from '@mui/material/styles';
import { palette } from '../palette';

export const inputComponents: ThemeOptions['components'] = {
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: palette.grey[300],
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: palette.grey[400],
        },
      },
    },
  },

  MuiSelect: {
    defaultProps: { size: 'small' },
  },
};
