import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useRegisterMutation } from '../features/auth/authApi';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../features/auth/authSlice';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { RegisterRequest } from '../types';

export default function RegisterPage() {
  useDocumentTitle('Create Account');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    try {
      setError('');
      const result = await registerUser(data).unwrap();
      dispatch(setCredentials(result.data));
      navigate('/dashboard');
    } catch {
      setError('Registration failed. Email may already exist.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" mb={3}>
            Create Account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              {...register('full_name', { required: 'Full name is required' })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          <Typography textAlign="center" mt={2} variant="body2">
            Already have an account?{' '}
            <Link href="/login" underline="hover">
              Sign In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
