import { Tabs as MuiTabs, Tab, Box } from '@mui/material';
import type { TabsProps } from '@adtech/types';

export function Tabs({ value, onChange, items }: TabsProps) {
  const active = items.find((item) => item.value === value);

  return (
    <Box>
      <MuiTabs value={value} onChange={(_, v) => onChange(v)}>
        {items.map((item) => (
          <Tab key={item.value} label={item.label} value={item.value} />
        ))}
      </MuiTabs>
      {active?.content !== undefined && <Box sx={{ pt: 2 }}>{active.content}</Box>}
    </Box>
  );
}
