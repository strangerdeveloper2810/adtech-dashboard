import type { ReactNode } from "react";
import type { ChipProps } from "@mui/material";
import type { CampaignStatus } from "../domain/campaign";

export interface Column<T> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: number | string;
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  getRowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  toolbar?: ReactNode;
  footer?: ReactNode;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  trend?: { value: number; label: string };
}

export interface StatusChipProps {
  status: CampaignStatus;
  size?: ChipProps["size"];
}

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  height?: number;
  action?: ReactNode;
  children: ReactNode;
}

export interface ProgressMeterProps {
  value: number;
  label?: string;
  warnAt?: number;
  dangerAt?: number;
}

export interface RingMeterProps {
  value: number;
  label?: string;
  size?: number;
}

export interface KpiDeltaProps {
  value: string | number;
  delta: number;
  previous?: string | number;
  label?: string;
}

export interface GeoDistributionProps {
  data: { flag?: string; label: string; value: number }[];
  max?: number;
}
