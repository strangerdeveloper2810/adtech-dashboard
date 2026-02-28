import type { ThemeOptions } from '@mui/material/styles';
import { layoutComponents } from './layout';
import { surfaceComponents } from './surfaces';
import { navigationComponents } from './navigation';
import { inputComponents } from './inputs';
import { buttonComponents } from './buttons';
import { dataDisplayComponents } from './data-display';
import { feedbackComponents } from './feedback';

export const components: ThemeOptions['components'] = {
  ...layoutComponents,
  ...surfaceComponents,
  ...navigationComponents,
  ...inputComponents,
  ...buttonComponents,
  ...dataDisplayComponents,
  ...feedbackComponents,
};
