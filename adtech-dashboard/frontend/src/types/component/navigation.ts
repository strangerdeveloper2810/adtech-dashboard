import type { TablePaginationProps } from '@mui/material';

export interface PaginationProps {
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  component?: TablePaginationProps['component'];
}
