
import React from 'react';
import { Menu, Layout } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  
  // Определяем активный ключ на основе текущего пути
  const getSelectedKey = () => {
    if (location.pathname.includes('/admin/products')) return 'products';
    if (location.pathname.includes('/admin/categories')) return 'categories';
    if (location.pathname.includes('/admin/users')) return 'users';
    if (location.pathname.includes('/admin/orders')) return 'orders';
    return 'products';
  };
  
  return (
    <Sider width={200} className="bg-white">
      <Menu
        mode="vertical"
        selectedKeys={[getSelectedKey()]}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="products" icon={<ShoppingOutlined />}>
          <Link to="/admin/products">Товары</Link>
        </Menu.Item>
        <Menu.Item key="categories" icon={<AppstoreOutlined />}>
          <Link to="/admin/categories">Категории</Link>
        </Menu.Item>
        <Menu.Item key="users" icon={<UserOutlined />}>
          <Link to="/admin/users">Пользователи</Link>
        </Menu.Item>
        <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
          <Link to="/admin/orders">Заказы</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AdminSidebar;
