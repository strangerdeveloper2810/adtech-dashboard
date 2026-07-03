import { Autocomplete, TextField } from '@mui/material';
import type { ComboboxProps } from '@adtech/types';

export function Combobox({ options, value, onChange, label, placeholder }: ComboboxProps) {
  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={(_, v) => onChange(v)}
      size="small"
      fullWidth
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} size="small" />
      )}
    />
  );
}
