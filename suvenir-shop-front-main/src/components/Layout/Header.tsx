
import React from 'react';
import { Layout, Menu, Badge, Button, Dropdown } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuth, username, role } = useAppSelector(state => state.auth);
  const { totalQty } = useAppSelector(state => state.cart);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Профиль</Link>
      </Menu.Item>
      <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
        <Link to="/orders">Мои заказы</Link>
      </Menu.Item>
      {role === 'ADMIN' && (
        <Menu.Item key="admin">
          <Link to="/admin">Админ-панель</Link>
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Выйти
      </Menu.Item>
    </Menu>
  );
  
  return (
    <AntHeader className="bg-white shadow-md px-4 flex items-center justify-between" style={{ height: 64 }}>
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 mr-8">
          СувенирШоп
        </Link>
        
        <Menu mode="horizontal" className="border-0">
          <Menu.Item key="catalog">
            <Link to="/">Каталог</Link>
          </Menu.Item>
          {isAuth && role === 'ADMIN' && (
            <Menu.Item key="admin">
              <Link to="/admin">Админ-панель</Link>
            </Menu.Item>
          )}
        </Menu>
      </div>
      
      <div className="flex items-center">
        <Link to="/cart" className="mr-4">
          <Badge count={totalQty} showZero>
            <Button shape="circle" icon={<ShoppingCartOutlined />} />
          </Badge>
        </Link>
        
        {isAuth ? (
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Button type="text">
              <UserOutlined className="mr-1" />
              {username}
            </Button>
          </Dropdown>
        ) : (
          <Link to="/login">
            <Button type="primary">Войти</Button>
          </Link>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
