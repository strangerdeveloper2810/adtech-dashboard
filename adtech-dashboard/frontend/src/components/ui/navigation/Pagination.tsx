import { TablePagination } from '@mui/material';
import type { PaginationProps } from '../../../types';

export function Pagination({
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 50],
  component = 'div',
}: PaginationProps) {
  return (
    <TablePagination
      component={component}
      count={total}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={(_, newPage) => onPageChange(newPage)}
      onRowsPerPageChange={(e) => {
        onRowsPerPageChange(parseInt(e.target.value, 10));
        onPageChange(0);
      }}
      rowsPerPageOptions={rowsPerPageOptions}
      labelRowsPerPage="Rows:"
    />
  );
}
