
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  // Перенаправляем на главную страницу (каталог)
  return <Navigate to="/" replace />;
};

export default Index;
