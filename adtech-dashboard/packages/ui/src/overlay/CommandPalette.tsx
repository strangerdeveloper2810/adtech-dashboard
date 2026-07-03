import { Dialog, Box } from '@mui/material';
import { Command } from 'cmdk';
import type { CommandPaletteProps } from '@adtech/types';

export function CommandPalette({ open, onClose, placeholder, groups }: CommandPaletteProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box
        sx={{
          '& [cmdk-input]': {
            width: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            p: 2,
            fontSize: '1rem',
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
          '& [cmdk-list]': {
            maxHeight: 360,
            overflowY: 'auto',
            p: 1,
          },
          '& [cmdk-item]': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1.5,
            borderRadius: 1,
            cursor: 'pointer',
            '&[data-selected="true"]': {
              bgcolor: 'action.hover',
            },
          },
          '& [cmdk-group-heading]': {
            typography: 'caption',
            color: 'text.secondary',
            p: 1,
          },
          '& [cmdk-empty]': {
            p: 2,
            textAlign: 'center',
            color: 'text.secondary',
          },
        }}
      >
        <Command>
          <Command.Input autoFocus placeholder={placeholder ?? 'Search…'} />
          <Command.List>
            <Command.Empty>No results</Command.Empty>
            {groups.map((group, groupIndex) => (
              <Command.Group key={groupIndex} heading={group.label}>
                {group.items.map((item, itemIndex) => (
                  <Command.Item
                    key={itemIndex}
                    onSelect={() => {
                      item.onSelect();
                      onClose();
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </Box>
    </Dialog>
  );
}
