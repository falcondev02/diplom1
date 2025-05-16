import React, { useState } from 'react';
import {
  Typography, Table, Button, Space, Modal, Form, Input, Select,
  Popconfirm, notification, Spin,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
} from '../../api/usersApi';
import { User } from '../../types';

const { Title } = Typography;
const { Option } = Select;

const AdminUsers: React.FC = () => {
  const [form] = Form.useForm();
  const [modal, setModal] = useState(false);
  const [page, setPage]   = useState(0);

  const { data, isLoading } = useGetUsersQuery({ page, size: 10 });
  const [createUser, { isLoading: saving }]   = useCreateUserMutation();
  const [deleteUser, { isLoading: removing }] = useDeleteUserMutation();

  /** создать нового */
  const save = async () => {
    try {
      const v = await form.validateFields();
      await createUser(v).unwrap();
      notification.success({ message: 'Пользователь создан' });
      setModal(false);
    } catch {}
  };

  /** удалить */
  const del = (id: number) =>
    deleteUser(id)
      .unwrap()
      .then(() => notification.success({ message: 'Удалён' }))
      .catch(() => notification.error({ message: 'Не удалён' }));

  const cols = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Email', dataIndex: 'username' },
    { title: 'Роль', dataIndex: 'role' },
    {
      title: 'Действия',
      render: (_: any, r: User) => (
        <Popconfirm
          title="Удалить пользователя?"
          okText="Да" cancelText="Нет"
          onConfirm={() => del(r.id!)}
        >
          <Button danger loading={removing}>
            Удалить
          </Button>
        </Popconfirm>
      ),
    },
  ];

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <Spin size="large" />
      </div>
    );

  return (
    <>
      <div className="flex justify-between mb-6">
        <Title level={2}>Управление пользователями</Title>
        <Button icon={<PlusOutlined />} type="primary" onClick={() => setModal(true)}>
          Добавить пользователя
        </Button>
      </div>

      <Table
        columns={cols}
        dataSource={data?.content}
        rowKey="id"
        pagination={{
          current: page + 1,
          pageSize: data?.size,
          total: data?.totalElements,
          onChange: p => setPage(p - 1),
        }}
      />

      <Modal
        title="Новый пользователь"
        open={modal}
        okText="Создать"
        cancelText="Отмена"
        confirmLoading={saving}
        onOk={save}
        onCancel={() => setModal(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Неверный email' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 6, message: 'Минимум 6 символов' },
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
    </>
  );
};

export default AdminUsers;
