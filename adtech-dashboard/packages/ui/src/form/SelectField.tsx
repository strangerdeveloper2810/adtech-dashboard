import { TextField, MenuItem } from '@mui/material';
import type { SelectFieldProps } from '@adtech/types';

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
