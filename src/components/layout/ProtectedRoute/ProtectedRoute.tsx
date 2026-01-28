import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks';
import { LoadingSpinner } from '../../common';
import type { ProtectedRouteProps } from './ProtectedRoute.types';

export const ProtectedRoute = ({
  children,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Ładowanie..." />;
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children ?? <Outlet />;
};
