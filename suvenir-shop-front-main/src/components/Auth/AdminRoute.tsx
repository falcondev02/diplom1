
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuth, role } = useAppSelector(state => state.auth);
  
  if (!isAuth) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    return <Navigate to="/login" replace />;
  }
  
  if (role !== 'ADMIN') {
    // Если пользователь не администратор, перенаправляем на главную страницу
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default AdminRoute;
