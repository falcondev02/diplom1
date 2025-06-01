
import React, { useState } from 'react';
import { Typography, Card, Form, Input, Button, notification, Tabs } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAppSelector } from '../app/hooks';
import { useChangePasswordMutation } from '../api/usersApi'; // путь может отличаться!


const { Title } = Typography;
const { TabPane } = Tabs;

const Profile: React.FC = () => {
  const { username } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  
  const [changePassword] = useChangePasswordMutation();

const handlePasswordChange = async (values: { currentPassword: string; newPassword: string }) => {
  setIsLoading(true);
  try {
    await changePassword({
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    }).unwrap();
    notification.success({
      message: 'Пароль изменен',
      description: 'Ваш пароль был успешно изменен.',
    });
  } catch (e) {
    notification.error({
      message: 'Ошибка',
      description: 'Не удалось изменить пароль. Проверьте текущий пароль.',
    });
  } finally {
    setIsLoading(false);
  }
};

  
  const handleUsernameChange = (values: { username: string }) => {
    setIsLoading(true);
    
    // Имитация запроса на сервер
    setTimeout(() => {
      setIsLoading(false);
      notification.success({
        message: 'Имя пользователя изменено',
        description: 'Ваше имя пользователя было успешно изменено.',
      });
    }, 1000);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Title level={2} className="mb-6">Профиль пользователя</Title>
      
      <Card>
        <Tabs defaultActiveKey="password">
          <TabPane tab="Сменить пароль" key="password">
            <Form
              name="passwordChange"
              layout="vertical"
              onFinish={handlePasswordChange}
            >
              <Form.Item
                name="currentPassword"
                label="Текущий пароль"
                rules={[
                  { required: true, message: 'Введите текущий пароль' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Текущий пароль"
                />
              </Form.Item>
              
              <Form.Item
                name="newPassword"
                label="Новый пароль"
                rules={[
                  { required: true, message: 'Введите новый пароль' },
                  { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Новый пароль"
                />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="Подтверждение пароля"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Подтвердите новый пароль' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Пароли не совпадают!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Подтвердите пароль"
                />
              </Form.Item>
              
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                >
                  Изменить пароль
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="Сменить логин" key="username">
            <Form
              name="usernameChange"
              layout="vertical"
              onFinish={handleUsernameChange}
              initialValues={{ username }}
            >
              <Form.Item
                name="username"
                label="Логин (email)"
                rules={[
                  { required: true, message: 'Введите логин' },
                  { type: 'email', message: 'Введите корректный email' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Новый email"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                label="Пароль для подтверждения"
                rules={[
                  { required: true, message: 'Введите пароль для подтверждения' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Ваш текущий пароль"
                />
              </Form.Item>
              
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                >
                  Изменить логин
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Profile;
