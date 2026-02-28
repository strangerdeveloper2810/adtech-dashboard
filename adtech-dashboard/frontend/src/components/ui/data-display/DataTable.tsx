import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { EmptyState } from '../feedback/EmptyState';
import { TableSkeleton } from '../feedback/LoadingState';

// Column definition
export interface Column<T> {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  getRowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  toolbar?: ReactNode;
  footer?: ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data found',
  getRowKey,
  onRowClick,
  toolbar,
  footer,
}: DataTableProps<T>) {
  return (
    <Card>
      <CardContent>
        {toolbar && <Stack mb={2}>{toolbar}</Stack>}

        {isLoading ? (
          <TableSkeleton rows={5} columns={columns.length} />
        ) : data.length === 0 ? (
          <EmptyState title={emptyMessage} />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align ?? 'left'}
                      width={col.width}
                      sx={{ fontWeight: 600 }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={getRowKey(row)}
                    hover
                    onClick={() => onRowClick?.(row)}
                    sx={onRowClick ? { cursor: 'pointer' } : undefined}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key} align={col.align ?? 'left'}>
                        {col.render
                          ? col.render(row)
                          : (row as Record<string, unknown>)[col.key] as ReactNode}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {footer && <Stack mt={2}>{footer}</Stack>}
      </CardContent>
    </Card>
  );
}
