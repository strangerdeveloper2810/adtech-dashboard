import { Card, CardContent, Box, Stack } from '@mui/material';
import { Label, StatValue } from '../typography/Text';
import type { StatCardProps } from '../../../types';

export function StatCard({ label, value, icon, color = '#1976d2', trend }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          {icon && (
            <Box
              sx={{
                bgcolor: color,
                color: 'white',
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
          <Box flex={1}>
            <Label>{label}</Label>
            <StatValue>{value}</StatValue>
          </Box>
        </Stack>
        {trend && (
          <Box mt={1}>
            <Label
              sx={{
                color: trend.value >= 0 ? 'success.main' : 'error.main',
                textTransform: 'none',
              }}
            >
              {trend.value >= 0 ? '+' : ''}
              {trend.value}% {trend.label}
            </Label>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
