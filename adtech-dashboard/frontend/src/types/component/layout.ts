import type { ReactNode } from 'react';
import type { UserRole } from '../domain/user';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}
