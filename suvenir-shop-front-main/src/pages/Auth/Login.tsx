// src/features/auth/Login.tsx

import React, { useState } from 'react';
import { Form, Input, Button, Tabs, Card, Typography, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../../api/authApi';

const { Title } = Typography;
const { TabPane } = Tabs;

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  
  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      await login(values).unwrap();
      notification.success({
        message: 'Вход выполнен',
        description: 'Добро пожаловать!',
      });
      navigate('/');
    } catch (error) {
      notification.error({
        message: 'Ошибка входа',
        description: 'Неверный логин или пароль.',
      });
    }
  };
  
  const handleRegister = async (values: { username: string; password: string; confirm: string }) => {
    const { username, password } = values;
    try {
      const result = await register({ username, password }).unwrap();
      // result имеет вид { msg: "User registered" }
      notification.success({
        message: 'Регистрация успешна',
        description: result.msg ?? 'Аккаунт создан',
      });
      setActiveTab('login');
    } catch (error) {
      notification.error({
        message: 'Ошибка регистрации',
        description: 'Не удалось создать аккаунт (возможно, уже существует).',
      });
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <Title level={2} className="text-center mb-6">СувенирШоп</Title>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="Вход" key="login">
            <Form name="login" onFinish={handleLogin} layout="vertical">
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Введите email' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Введите пароль' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" size="large" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isLoginLoading}
                >
                  Войти
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="Регистрация" key="register">
            <Form name="register" onFinish={handleRegister} layout="vertical">
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Введите email' },
                  { type: 'email',  message: 'Введите корректный email' }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Введите пароль' },
                  { min: 6, message: 'Пароль минимум 6 символов' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" size="large" />
              </Form.Item>
              
              <Form.Item
                name="confirm"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Подтвердите пароль' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Пароли не совпадают'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Подтверждение" size="large" />
              </Form.Item>
              
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isRegisterLoading}
                >
                  Зарегистрироваться
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
