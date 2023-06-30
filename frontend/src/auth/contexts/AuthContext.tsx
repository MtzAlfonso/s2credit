import { createContext, FC, PropsWithChildren } from 'react';

import { useAuth } from '../hooks';
import { AuthStatus } from '../interfaces';

interface AuthContextProps {
  authStatus: AuthStatus;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  authStatus: AuthStatus.checking,
  login: () => null,
  logout: () => null,
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { authStatus, login, logout } = useAuth();

  const authContextValue: AuthContextProps = {
    authStatus,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
