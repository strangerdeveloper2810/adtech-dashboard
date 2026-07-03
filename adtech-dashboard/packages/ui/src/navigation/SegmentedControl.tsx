import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import type { SegmentedControlProps } from '@adtech/types';

export function SegmentedControl({
  value,
  onChange,
  options,
  size = 'small',
}: SegmentedControlProps) {
  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      size={size}
      onChange={(_, v) => v !== null && onChange(v)}
    >
      {options.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
