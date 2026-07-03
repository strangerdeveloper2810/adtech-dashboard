import { Fragment } from 'react';
import { Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import type { DropdownMenuProps } from '@adtech/types';

export function DropdownMenu({ anchorEl, open, onClose, items }: DropdownMenuProps) {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {items.map((item, index) => (
        <Fragment key={index}>
          {item.divider && <Divider />}
          <MenuItem
            onClick={() => {
              item.onClick();
              onClose();
            }}
            sx={item.danger ? { color: 'error.main' } : undefined}
          >
            {item.icon && (
              <ListItemIcon sx={item.danger ? { color: 'error.main' } : undefined}>
                {item.icon}
              </ListItemIcon>
            )}
            {item.label}
          </MenuItem>
        </Fragment>
      ))}
    </Menu>
  );
}
