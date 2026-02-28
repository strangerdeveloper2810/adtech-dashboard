import { Box, type BoxProps } from '@mui/material';

// Full-page wrapper with consistent padding
export function PageContainer({ children, ...props }: BoxProps) {
  return (
    <Box px={1} py={2} {...props}>
      {children}
    </Box>
  );
}
