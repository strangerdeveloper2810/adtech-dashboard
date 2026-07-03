import { Box, Slider as MuiSlider, Typography } from '@mui/material';
import type { SliderProps } from '@adtech/types';

export function Slider({ value, onChange, min, max, step, label, formatValue }: SliderProps) {
  return (
    <Box>
      {label && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatValue ? formatValue(value) : value}
          </Typography>
        </Box>
      )}
      <MuiSlider
        value={value}
        onChange={(_, v) => onChange(v as number)}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        valueLabelFormat={formatValue}
      />
    </Box>
  );
}
