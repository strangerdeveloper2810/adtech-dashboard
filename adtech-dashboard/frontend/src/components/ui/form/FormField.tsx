import { TextField, type TextFieldProps } from '@mui/material';
import type { FieldValues, Path, UseFormRegister, FieldErrors } from 'react-hook-form';

type FormFieldProps<T extends FieldValues> = Omit<TextFieldProps, 'name'> & {
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

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
