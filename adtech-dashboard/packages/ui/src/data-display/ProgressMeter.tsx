import { Box, LinearProgress, Typography } from '@mui/material';
import type { ProgressMeterProps } from '@adtech/types';

export function ProgressMeter({ value, label, warnAt, dangerAt }: ProgressMeterProps) {
  const color = value >= (dangerAt ?? 95) ? 'error' : value >= (warnAt ?? 80) ? 'warning' : 'primary';
  return (
    <Box>
      {label && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">{label}</Typography>
          <Typography variant="body2" color="text.secondary">
            {value}%
          </Typography>
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={value}
        color={color}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
}
