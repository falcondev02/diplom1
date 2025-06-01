// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import ruRU from "antd/lib/locale/ru_RU";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "./app/store";

import MainLayout from "./components/Layout/MainLayout";
import AdminLayout from "./components/Layout/AdminLayout";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Auth/Login";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import AdminProducts from "./pages/Admin/Products";
import AdminCategories from "./pages/Admin/Categories";
import AdminUsers from "./pages/Admin/Users";
import AdminOrders from "./pages/Admin/Orders";

import PrivateRoute from "./components/Auth/PrivateRoute";
import AdminRoute from "./components/Auth/AdminRoute";

import { setCart } from "./features/cart/cartSlice";

const AppWrapper: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuth, username } = useSelector((state: RootState) => state.auth);

  // Как только мы оказались _авторизованными_, пробуем загрузить корзину из localStorage
  useEffect(() => {
    if (isAuth && username) {
      const key = `cart_${username}`;
      const raw = localStorage.getItem(key);
      console.log("[AppWrapper] useEffect → raw из localStorage:", raw);
      if (raw) {
        try {
          const arr = JSON.parse(raw) as Array<{
            productId: number;
            name: string;
            priceCents: number;
            imageUrl: string;
            quantity: number;
          }>;
          console.log("[AppWrapper] useEffect → передаю в setCart:", arr);
          dispatch(setCart(arr));
        } catch (e) {
          console.error("JSON.parse error при загрузке корзины в AppWrapper:", e);
        }
      } else {
        // Если в localStorage ещё ничего не было, то явно сбросим
        dispatch(setCart([]));
      }
    }
  }, [isAuth, username, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Catalog />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="login" element={<Login />} />

          {/* Защищенные роуты */}
          <Route
            path="cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Админские роуты */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <ConfigProvider locale={ruRU}>
      <AppWrapper />
    </ConfigProvider>
  </Provider>
);

export default App;
