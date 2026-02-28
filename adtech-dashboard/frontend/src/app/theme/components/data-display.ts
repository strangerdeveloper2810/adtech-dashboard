import type { ThemeOptions } from '@mui/material/styles';
import { palette } from '../palette';

export const dataDisplayComponents: ThemeOptions['components'] = {
  MuiChip: {
    styleOverrides: {
      root: { fontWeight: 500, borderRadius: 6 },
      sizeSmall: { height: 24, fontSize: '0.75rem' },
    },
  },

  MuiAvatar: {
    styleOverrides: {
      root: { fontSize: '0.875rem', fontWeight: 600 },
    },
  },

  MuiTooltip: {
    defaultProps: { arrow: true },
    styleOverrides: {
      tooltip: {
        backgroundColor: palette.grey[800],
        fontSize: '0.75rem',
        borderRadius: 4,
        padding: '4px 8px',
      },
    },
  },

  // Table
  MuiTableHead: {
    styleOverrides: {
      root: { backgroundColor: palette.grey[50] },
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: {
        borderColor: palette.divider,
        padding: '12px 16px',
      },
      head: {
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: palette.text.secondary,
      },
    },
  },

  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:last-child td': { borderBottom: 0 },
        '&.MuiTableRow-hover:hover': { backgroundColor: palette.grey[50] },
      },
    },
  },

  MuiTablePagination: {
    styleOverrides: {
      root: { borderTop: `1px solid ${palette.divider}` },
    },
  },

  MuiSkeleton: {
    defaultProps: { animation: 'wave' },
    styleOverrides: {
      root: { borderRadius: 4 },
    },
  },
};
