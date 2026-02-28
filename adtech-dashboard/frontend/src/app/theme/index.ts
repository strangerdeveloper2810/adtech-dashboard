import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { shadows } from './shadows';
import { components } from './components';

const spacing = 8;
const borderRadius = 8;

const theme = createTheme({
  palette,
  typography,
  spacing,
  shape: { borderRadius },
  shadows,
  components,
});

export default theme;
