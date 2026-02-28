import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import type { EmptyStateProps } from '../../../types';

export function EmptyState({
  icon = <InboxIcon sx={{ fontSize: 64 }} />,
  title = 'No data',
  description,
  action,
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      gap={1}
    >
      <Box color="text.disabled">{icon}</Box>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
      {action && <Box mt={2}>{action}</Box>}
    </Box>
  );
}
