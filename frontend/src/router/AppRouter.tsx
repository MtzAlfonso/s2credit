import { Navigate, Route, Routes } from 'react-router-dom';

import { LoginPage } from '../auth/pages/LoginPage';
import { HomePage } from '../home/pages/HomePage';
import { PrivateLayout } from '../shared/layouts';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/">
        <Route path="" element={<Navigate to="/login" />} />

        <Route element={<PublicRoute />}>
          <Route path="login" element={<LoginPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="home" element={<HomePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Route>
    </Routes>
  );
};
