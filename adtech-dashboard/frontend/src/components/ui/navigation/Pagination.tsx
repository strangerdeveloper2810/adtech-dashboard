import { TablePagination, type TablePaginationProps } from '@mui/material';

interface PaginationProps {
  total: number;
  page: number;         // 0-indexed for MUI
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  component?: TablePaginationProps['component'];
}

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
