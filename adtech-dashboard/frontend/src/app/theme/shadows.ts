import type { ThemeOptions } from '@mui/material/styles';

export const shadows = [
  'none',
  '0 1px 2px rgba(0,0,0,0.05)',                                         // 1 - subtle
  '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',             // 2 - card
  '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',   // 3 - dropdown
  '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', // 4 - modal
  ...Array(20).fill('none'),
] as ThemeOptions['shadows'];
