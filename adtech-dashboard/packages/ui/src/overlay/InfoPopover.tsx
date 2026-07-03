import { Popover, Box, Typography } from '@mui/material';
import type { InfoPopoverProps } from '@adtech/types';

export function InfoPopover({ anchorEl, open, onClose, title, children }: InfoPopoverProps) {
  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Box sx={{ p: 2, maxWidth: 280 }}>
        {title && (
          <Typography variant="subtitle2" gutterBottom>
            {title}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {children}
        </Typography>
      </Box>
    </Popover>
  );
}
