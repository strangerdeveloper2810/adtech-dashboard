import { Box, Stack, Typography } from '@mui/material';
import type { GeoDistributionProps } from '@adtech/types';

export function GeoDistribution({ data, max }: GeoDistributionProps) {
  const peak = max ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <Stack gap={1.5}>
      {data.map((d) => (
        <Stack key={d.label} direction="row" alignItems="center" gap={1}>
          {d.flag && <Typography>{d.flag}</Typography>}
          <Typography variant="body2" sx={{ minWidth: 96 }}>
            {d.label}
          </Typography>
          <Box
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              bgcolor: 'action.hover',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${(d.value / peak) * 100}%`,
                height: '100%',
                bgcolor: 'primary.main',
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {d.value}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
