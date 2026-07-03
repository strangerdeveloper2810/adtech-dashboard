import type { ReactNode } from 'react';
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

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  items: { label: string; value: string; content?: ReactNode }[];
}

export interface SegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  size?: 'small' | 'medium';
}

export interface StepperProps {
  activeStep: number;
  steps: string[];
  alternativeLabel?: boolean;
}

export interface FilterBarProps {
  filters: { key: string; label: string; value: string }[];
  onRemove: (key: string) => void;
  onAdd?: () => void;
}
