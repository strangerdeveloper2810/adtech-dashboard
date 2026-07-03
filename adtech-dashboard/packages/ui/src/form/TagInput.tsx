import { Autocomplete, Chip, TextField } from '@mui/material';
import type { TagInputProps } from '@adtech/types';

export function TagInput({ value, onChange, options, label, placeholder }: TagInputProps) {
  return (
    <Autocomplete
      multiple
      freeSolo
      options={options ?? []}
      value={value}
      onChange={(_, v) => onChange(v as string[])}
      size="small"
      fullWidth
      renderTags={(vals, getTagProps) =>
        vals.map((opt, i) => {
          const { key, ...tagProps } = getTagProps({ index: i });
          return <Chip key={key} label={opt} size="small" {...tagProps} />;
        })
      }
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} size="small" />
      )}
    />
  );
}
