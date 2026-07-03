import { Box, Stack, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { KpiDeltaProps } from '@adtech/types';

export function KpiDelta({ value, delta, previous, label }: KpiDeltaProps) {
  const positive = delta >= 0;
  return (
    <Box>
      {label && (
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
      )}
      <Stack direction="row" alignItems="baseline" gap={1}>
        <Typography variant="h4">{value}</Typography>
        <Stack direction="row" alignItems="center" sx={{ color: positive ? 'success.main' : 'error.main' }}>
          {positive ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
          <Typography variant="body2">{Math.abs(delta)}%</Typography>
        </Stack>
        {previous !== undefined && (
          <Typography variant="caption" color="text.secondary">
            prev {previous}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
