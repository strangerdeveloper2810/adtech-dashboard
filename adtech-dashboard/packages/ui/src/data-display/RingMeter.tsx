import { Box, CircularProgress, Typography } from '@mui/material';
import type { RingMeterProps } from '@adtech/types';

export function RingMeter({ value, label, size }: RingMeterProps) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size ?? 104}
        thickness={4}
        sx={{ color: 'divider' }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={size ?? 104}
        thickness={4}
        sx={{ position: 'absolute', left: 0 }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6">{value}%</Typography>
        {label && (
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
