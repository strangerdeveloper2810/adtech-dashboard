import { TextField } from '@mui/material';
import type { FieldValues } from 'react-hook-form';
import type { FormFieldProps } from '@adtech/types';

export function FormField<T extends FieldValues>({
  name,
  register,
  errors,
  ...props
}: FormFieldProps<T>) {
  const error = errors[name];

  return (
    <TextField
      fullWidth
      margin="normal"
      error={!!error}
      helperText={error?.message as string}
      {...register(name)}
      {...props}
    />
  );
}
