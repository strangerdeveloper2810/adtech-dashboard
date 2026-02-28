import type { ThemeOptions } from '@mui/material/styles';
import { shadows } from '../shadows';

export const feedbackComponents: ThemeOptions['components'] = {
  MuiAlert: {
    styleOverrides: {
      root: { borderRadius: 6 },
      standardSuccess: { backgroundColor: '#f0fdf4', color: '#166534' },
      standardError: { backgroundColor: '#fef2f2', color: '#991b1b' },
      standardWarning: { backgroundColor: '#fffbeb', color: '#92400e' },
      standardInfo: { backgroundColor: '#f0f9ff', color: '#075985' },
    },
  },

  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: 12, boxShadow: shadows?.[4] },
    },
  },

  MuiDialogTitle: {
    styleOverrides: {
      root: { fontSize: '1.125rem', fontWeight: 600, padding: '20px 24px 12px' },
    },
  },

  MuiDialogContent: {
    styleOverrides: {
      root: { padding: '8px 24px 16px' },
    },
  },

  MuiDialogActions: {
    styleOverrides: {
      root: { padding: '12px 24px 20px', gap: 8 },
    },
  },
};
