import type { ReactNode } from 'react';

export interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  action?: ReactNode;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface LazyPageProps {
  children: ReactNode;
  message?: string;
}

export interface TextSkeletonProps {
  lines?: number;
  width?: number | string;
}

export interface CardSkeletonProps {
  lines?: number;
}

export interface BannerProps {
  severity?: 'info' | 'success' | 'warning' | 'error';
  children: ReactNode;
  onClose?: () => void;
  open?: boolean;
}

export interface AccordionProps {
  items: { title: string; content: ReactNode }[];
  defaultExpanded?: number;
}

export interface NotificationCenterProps {
  items: {
    id: string;
    title: string;
    description?: string;
    time?: string;
    unread?: boolean;
    severity?: 'info' | 'success' | 'warning' | 'error';
  }[];
  onMarkAllRead?: () => void;
}
