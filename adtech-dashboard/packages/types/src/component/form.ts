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

export interface ComboboxProps {
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
}

export interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options?: string[];
  label?: string;
  placeholder?: string;
}

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  formatValue?: (v: number) => string;
}

export interface DropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  hint?: string;
}
