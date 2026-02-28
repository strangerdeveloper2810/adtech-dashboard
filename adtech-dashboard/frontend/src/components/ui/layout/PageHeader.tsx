import type { ReactNode } from 'react';
import { Stack } from '@mui/material';
import { PageTitle, TextMuted } from '../typography/Text';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
      <Stack>
        <PageTitle>{title}</PageTitle>
        {subtitle && <TextMuted mt={0.5}>{subtitle}</TextMuted>}
      </Stack>
      {actions && <div>{actions}</div>}
    </Stack>
  );
}
