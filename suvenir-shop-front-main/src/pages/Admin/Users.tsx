import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  notification,
  Spin,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useGetUsersQuery, useCreateUserMutation } from '../../api/usersApi';
import { User } from '../../types';

const { Title } = Typography;
const { Option } = Select;

const AdminUsers: React.FC = () => {
  console.log('[RENDER] AdminUsers mounted'); // ✅ Проверка маунта

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const { data: usersData, isLoading, error } = useGetUsersQuery({ page: currentPage, size: 10 });
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  useEffect(() => {
    console.log('[DATA] usersData:', usersData); // ✅ Проверка полученных данных
    if (error) console.error('[ERROR] getUsersQuery failed:', error);
  }, [usersData, error]);

  const showCreateModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createUser(values).unwrap();
      notification.success({ message: 'Пользователь создан' });
      setIsModalVisible(false);
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Имя пользователя', dataIndex: 'username', key: 'username' },
    { title: 'Роль', dataIndex: 'role', key: 'role' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Управление пользователями</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>
          Добавить пользователя
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={usersData?.content || []}
        rowKey="id"
        pagination={{
          current: currentPage + 1,
          pageSize: usersData?.size || 10,
          total: usersData?.totalElements || 0,
          onChange: (page) => setCurrentPage(page - 1),
        }}
      />

      <Modal
        title="Добавить нового пользователя"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleFormSubmit}
        confirmLoading={isCreating}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Email"
            rules={[
              { required: true, message: 'Введите email пользователя' },
              { type: 'email', message: 'Введите корректный email' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 6, message: 'Пароль должен содержать минимум 6 символов' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="role" label="Роль" initialValue="USER">
            <Select>
              <Option value="USER">Пользователь</Option>
              <Option value="ADMIN">Администратор</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
