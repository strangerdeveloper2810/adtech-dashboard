import { Chip, type ChipProps } from '@mui/material';
import type { CampaignStatus, StatusChipProps } from '@adtech/types';

const statusConfig: Record<CampaignStatus, { color: ChipProps['color']; label: string }> = {
  draft: { color: 'default', label: 'Draft' },
  active: { color: 'success', label: 'Active' },
  paused: { color: 'warning', label: 'Paused' },
  completed: { color: 'info', label: 'Completed' },
  archived: { color: 'error', label: 'Archived' },
};

export function StatusChip({ status, size = 'small' }: StatusChipProps) {
  const config = statusConfig[status];
  return <Chip label={config.label} color={config.color} size={size} />;
}
