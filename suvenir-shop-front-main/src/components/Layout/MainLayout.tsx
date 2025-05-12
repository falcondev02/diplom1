
import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const { Content, Footer } = Layout;

const MainLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </Content>
      <Footer className="text-center">
        СувенирШоп ©{new Date().getFullYear()} Все права защищены
      </Footer>
    </Layout>
  );
};

export default MainLayout;
