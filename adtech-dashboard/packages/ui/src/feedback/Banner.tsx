import { Alert, Collapse } from '@mui/material';
import type { BannerProps } from '@adtech/types';

export function Banner({ severity = 'info', children, onClose, open }: BannerProps) {
  return (
    <Collapse in={open ?? true}>
      <Alert severity={severity} onClose={onClose}>
        {children}
      </Alert>
    </Collapse>
  );
}
