import type { ThemeOptions } from '@mui/material/styles';
import { palette } from '../palette';

export const navigationComponents: ThemeOptions['components'] = {
  MuiAppBar: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: {
        borderBottom: `1px solid ${palette.divider}`,
        backgroundColor: palette.background.paper,
        color: palette.text.primary,
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: `1px solid ${palette.divider}`,
        backgroundColor: palette.background.paper,
      },
    },
  },

  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 2,
        '&.Mui-selected': {
          backgroundColor: `${palette.primary.main}14`,
          color: palette.primary.main,
          '& .MuiListItemIcon-root': { color: palette.primary.main },
          '&:hover': { backgroundColor: `${palette.primary.main}20` },
        },
      },
    },
  },

  MuiTab: {
    styleOverrides: {
      root: { textTransform: 'none', fontWeight: 500, minHeight: 44 },
    },
  },

  MuiTabs: {
    styleOverrides: {
      indicator: { height: 2, borderRadius: 1 },
    },
  },

  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: 8,
        border: `1px solid ${palette.divider}`,
      },
    },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: { fontSize: '0.875rem', borderRadius: 4, margin: '2px 4px' },
    },
  },
};
