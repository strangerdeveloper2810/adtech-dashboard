import { Card, CardContent, Stack, Box } from '@mui/material';
import { SectionTitle, TextMuted } from '../typography/Text';
import type { ChartCardProps } from '@adtech/types';

export function ChartCard({
  title,
  subtitle,
  height = 350,
  action,
  children,
}: ChartCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack>
            <SectionTitle>{title}</SectionTitle>
            {subtitle && <TextMuted>{subtitle}</TextMuted>}
          </Stack>
          {action && <div>{action}</div>}
        </Stack>
        <Box height={height}>{children}</Box>
      </CardContent>
    </Card>
  );
}
