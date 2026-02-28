import type { TextFieldProps } from '@mui/material';
import type { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

export type FormFieldProps<T extends FieldValues> = Omit<TextFieldProps, 'name'> & {
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

export interface SelectOption {
  value: string;
  label: string;
}

export type SelectFieldProps = Omit<TextFieldProps, 'select'> & {
  options: SelectOption[];
  placeholder?: string;
};

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  width?: number | string;
}
