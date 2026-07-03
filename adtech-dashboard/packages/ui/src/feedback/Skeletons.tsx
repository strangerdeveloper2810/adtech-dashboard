import { Box, Skeleton, Stack } from '@mui/material';
import type { TextSkeletonProps, CardSkeletonProps } from '@adtech/types';

export function TextSkeleton({ lines = 3, width }: TextSkeletonProps) {
  return (
    <Stack spacing={1}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          animation="wave"
          width={i === lines - 1 ? (width ?? '60%') : width}
        />
      ))}
    </Stack>
  );
}

export function CardSkeleton({ lines = 3 }: CardSkeletonProps) {
  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Skeleton variant="circular" animation="wave" width={40} height={40} />
        <Stack spacing={0.5} flex={1}>
          <Skeleton variant="text" animation="wave" width="50%" />
          <Skeleton variant="text" animation="wave" width="30%" />
        </Stack>
      </Stack>
      <Stack spacing={1}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            animation="wave"
            width={i === lines - 1 ? '60%' : undefined}
          />
        ))}
      </Stack>
    </Box>
  );
}
