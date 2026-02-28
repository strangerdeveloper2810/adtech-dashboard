import { Box, CircularProgress, Typography, Skeleton, Stack } from '@mui/material';
import type { LoadingStateProps, TableSkeletonProps } from '../../../types';

export function LoadingState({ message = 'Loading...', fullPage = false }: LoadingStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={fullPage ? 20 : 8}
      gap={2}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <Stack spacing={1}>
      {Array.from({ length: rows }).map((_, i) => (
        <Stack key={i} direction="row" spacing={2}>
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} variant="text" width={`${100 / columns}%`} height={40} />
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
