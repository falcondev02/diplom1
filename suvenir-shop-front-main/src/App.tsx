
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import { Provider } from 'react-redux';
import { store } from './app/store';

// Layouts
import MainLayout from './components/Layout/MainLayout';
import AdminLayout from './components/Layout/AdminLayout';

// Public Pages
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Auth/Login';
import NotFound from './pages/NotFound';

// Protected Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

// Admin Pages
import AdminProducts from './pages/Admin/Products';
import AdminCategories from './pages/Admin/Categories';
import AdminUsers from './pages/Admin/Users';
import AdminOrders from './pages/Admin/Orders';

// Auth Components
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={ruRU}>
        <BrowserRouter>
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Catalog />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="login" element={<Login />} />
              
              {/* Защищенные маршруты для пользователей */}
              <Route path="cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route path="orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
              <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            </Route>
            
            {/* Маршруты администратора */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Navigate to="/admin/products" replace />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
            
            {/* 404 страница */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
