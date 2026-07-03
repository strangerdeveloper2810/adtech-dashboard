import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import type { FormDialogProps } from '@adtech/types';

export function FormDialog({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth,
}: FormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth ?? 'sm'}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}
