/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import axios, { AxiosHeaders, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import { AuthStatus, ILoginResponse, IUser } from '../../auth/interfaces';

interface ILoginArgs {
  username: string;
  password: string;
}

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.checking);

  const loginMutation = useMutation<
    AxiosResponse<ILoginResponse>,
    Error,
    ILoginArgs
  >(({ username, password }) => {
    return axios.post('http://localhost:4000/api/auth/login', {
      username,
      password,
    });
  });

  const revalidateMutation = useMutation<
    AxiosResponse<ILoginResponse>,
    Error,
    void
  >(() => {
    const token = localStorage.getItem('token');
    const headers = new AxiosHeaders().set('Authorization', `Bearer ${token}`);

    return axios.post('http://localhost:4000/api/auth/revalidate', null, {
      headers,
    });
  });

  const login = (username: string, password: string) => {
    loginMutation.mutate({ username, password });
  };

  const checkAuthStatus = (): boolean => {
    const token = localStorage.getItem('token');

    if (!token) {
      logout();
      return false;
    }

    revalidateMutation.mutate();

    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setAuthStatus(AuthStatus.notAuthenticated);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (loginMutation.data) {
      localStorage.setItem('token', loginMutation.data.data.token);
      setCurrentUser(loginMutation.data.data.user);
      setAuthStatus(AuthStatus.authenticated);
    }
  }, [loginMutation.data]);

  useEffect(() => {
    if (loginMutation.error) {
      message.error('Error while logging in');
    }
  }, [loginMutation.error]);

  useEffect(() => {
    if (revalidateMutation.data) {
      setCurrentUser(revalidateMutation.data.data.user);
      setAuthStatus(AuthStatus.authenticated);
    }
  }, [revalidateMutation.data]);

  useEffect(() => {
    if (revalidateMutation.error) {
      logout();
    }
  }, [revalidateMutation.error]);

  return {
    authStatus,
    currentUser,
    login,
    logout,
    checkAuthStatus,
  };
};
