import type { ReactNode } from 'react';
import { Card, CardContent, Stack, Box } from '@mui/material';
import { SectionTitle, TextMuted } from '../typography/Text';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  height?: number;
  action?: ReactNode;
  children: ReactNode;
}

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
