
import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import AdminSidebar from './AdminSidebar';

const { Content, Footer } = Layout;

const AdminLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Layout>
        <AdminSidebar />
        <Layout>
          <Content className="p-6">
            <div className="bg-white p-6 rounded shadow">
              <Outlet />
            </div>
          </Content>
          <Footer className="text-center">
            СувенирШоп ©{new Date().getFullYear()} Административная панель
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
