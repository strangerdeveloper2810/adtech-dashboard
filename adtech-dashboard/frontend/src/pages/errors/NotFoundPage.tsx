import { useNavigate } from 'react-router';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Box, Button, Typography } from '@mui/material';
import { ROUTES } from '../../constants';

export default function NotFoundPage() {
  useDocumentTitle('Page Not Found');
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h1" fontWeight={700} color="text.disabled">
        404
      </Typography>
      <Typography variant="h5">Page Not Found</Typography>
      <Typography color="text.secondary">
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" onClick={() => navigate(ROUTES.DASHBOARD)}>
        Back to Dashboard
      </Button>
    </Box>
  );
}
