import { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import type { SearchInputProps } from '@adtech/types';

export function SearchInput({
  value: externalValue,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  width = 300,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(externalValue);

  // Sync external → local
  useEffect(() => {
    setLocalValue(externalValue);
  }, [externalValue]);

  // Debounce local → external
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== externalValue) {
        onChange(localValue);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, externalValue]);

  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      sx={{ width }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: localValue ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setLocalValue('')}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}
