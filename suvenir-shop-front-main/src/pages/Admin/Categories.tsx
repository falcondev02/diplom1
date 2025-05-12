
import React, { useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Popconfirm,
  notification,
  Spin,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../api/categoriesApi';
import { Category } from '../../types';

const { Title } = Typography;

const AdminCategories: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  
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
      await createCategory(values).unwrap();
      
      notification.success({ message: 'Категория создана' });
      setIsModalVisible(false);
    } catch (error) {
      console.error('Ошибка при создании категории:', error);
    }
  };
  
  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
      notification.success({ message: 'Категория удалена' });
    } catch (error) {
      notification.error({ message: 'Ошибка при удалении категории' });
    }
  };
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Category) => (
        <Popconfirm
          title="Вы уверены, что хотите удалить эту категорию?"
          onConfirm={() => handleDelete(record.id)}
          okText="Да"
          cancelText="Нет"
        >
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={isDeleting}
          >
            Удалить
          </Button>
        </Popconfirm>
      ),
    },
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
        <Title level={2}>Управление категориями</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
        >
          Добавить категорию
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={categories || []}
        rowKey="id"
        pagination={false}
      />
      
      <Modal
        title="Добавить новую категорию"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleFormSubmit}
        confirmLoading={isCreating}
        okText="Создать"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Название категории"
            rules={[{ required: true, message: 'Введите название категории' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategories;
