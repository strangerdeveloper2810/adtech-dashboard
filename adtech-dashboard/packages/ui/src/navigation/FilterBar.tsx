import { Stack, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { FilterBarProps } from '@adtech/types';

export function FilterBar({ filters, onRemove, onAdd }: FilterBarProps) {
  return (
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {filters.map((filter) => (
        <Chip
          key={filter.key}
          label={`${filter.label}: ${filter.value}`}
          onDelete={() => onRemove(filter.key)}
        />
      ))}
      {onAdd && (
        <Chip
          label="Add filter"
          icon={<AddIcon />}
          variant="outlined"
          onClick={onAdd}
          sx={{ borderStyle: 'dashed' }}
        />
      )}
    </Stack>
  );
}
