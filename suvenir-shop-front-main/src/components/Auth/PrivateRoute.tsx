
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuth } = useAppSelector(state => state.auth);
  
  if (!isAuth) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
