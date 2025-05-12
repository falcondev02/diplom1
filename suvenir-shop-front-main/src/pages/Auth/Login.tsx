
import React, { useState } from 'react';
import { Form, Input, Button, Tabs, Card, Typography, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../../api/authApi';

const { Title } = Typography;
const { TabPane } = Tabs;

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  
  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      await login(values).unwrap();
      notification.success({
        message: 'Вход выполнен',
        description: 'Добро пожаловать в систему!',
      });
      navigate('/');
    } catch (error) {
      notification.error({
        message: 'Ошибка входа',
        description: 'Неверный логин или пароль. Пожалуйста, попробуйте снова.',
      });
    }
  };
  
  const handleRegister = async (values: { username: string; password: string; confirm: string }) => {
    // Игнорируем поле confirm, оно нужно только для валидации
    const { username, password } = values;
    
    try {
      await register({ username, password }).unwrap();
      notification.success({
        message: 'Регистрация успешна',
        description: 'Аккаунт создан. Теперь вы можете войти.',
      });
      setActiveTab('login'); // Переключаемся на вкладку входа
    } catch (error) {
      notification.error({
        message: 'Ошибка регистрации',
        description: 'Не удалось создать аккаунт. Возможно, такой пользователь уже существует.',
      });
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <Title level={2} className="text-center mb-6">
          СувенирШоп
        </Title>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="Вход" key="login">
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Пожалуйста, введите email!' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Email" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Пароль"
                  size="large"
                />
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
            <Form
              name="register"
              onFinish={handleRegister}
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Пожалуйста, введите email!' },
                  { type: 'email', message: 'Введите корректный email!' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Email" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Пожалуйста, введите пароль!' },
                  { min: 6, message: 'Пароль должен содержать минимум 6 символов!' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Пароль"
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="confirm"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Подтвердите пароль!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Пароли не совпадают!'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Подтверждение пароля"
                  size="large"
                />
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
