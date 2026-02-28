import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../../app/hooks';
import type { UserRole } from '../../types';

interface Props {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
