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
import type { DataTableProps } from '@adtech/types';

export type { Column } from '@adtech/types';

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
