import type { ReactNode } from 'react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'error' | 'warning' | 'info';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface DropdownMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: {
    label: string;
    icon?: ReactNode;
    danger?: boolean;
    divider?: boolean;
    onClick: () => void;
  }[];
}

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: number;
  children: ReactNode;
}

export interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md';
}

export interface InfoPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  placeholder?: string;
  groups: {
    label: string;
    items: {
      label: string;
      icon?: ReactNode;
      onSelect: () => void;
    }[];
  }[];
}
