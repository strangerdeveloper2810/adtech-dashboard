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
