import { Alert, AlertTitle, Box, Button } from '@mui/material';
import type { ErrorStateProps } from '@adtech/types';

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  action,
}: ErrorStateProps) {
  return (
    <Box py={4} maxWidth={500} mx="auto">
      <Alert severity="error" variant="outlined">
        <AlertTitle>{title}</AlertTitle>
        {message}
        {(onRetry || action) && (
          <Box mt={2}>
            {onRetry && (
              <Button size="small" variant="outlined" color="error" onClick={onRetry}>
                Try Again
              </Button>
            )}
            {action}
          </Box>
        )}
      </Alert>
    </Box>
  );
}
