import { TextField, MenuItem, type TextFieldProps } from '@mui/material';

interface SelectOption {
  value: string;
  label: string;
}

type SelectFieldProps = Omit<TextFieldProps, 'select'> & {
  options: SelectOption[];
  placeholder?: string;
};

export function SelectField({ options, placeholder, ...props }: SelectFieldProps) {
  return (
    <TextField select size="small" {...props}>
      {placeholder && (
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>
      )}
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
