import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AuthLoading } from '../auth/components';
import { AuthContext } from '../auth/contexts';
import { AuthStatus } from '../auth/interfaces';

export const PublicRoute = () => {
  const { authStatus } = useContext(AuthContext);

  if (authStatus === AuthStatus.notAuthenticated) return <Outlet />;
  if (authStatus === AuthStatus.checking) return <AuthLoading />;

  return <Navigate to="/home" />;
};
