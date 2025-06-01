import React, { useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  notification,
  Spin,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../../api/productsApi';
import { useGetCategoriesQuery } from '../../api/categoriesApi';
import { Product } from '../../types';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AdminProducts: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const { data: productsData, isLoading } = useGetProductsQuery({ page: currentPage, size: 10 });
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const showCreateModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
    ...product,
    price: product.priceCents / 100, // тут конвертируем копейки → рубли
  });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

const handleFormSubmit = async () => {
  try {
    const values = await form.validateFields();
    if (editingProduct) {
      await updateProduct({
        id: editingProduct.id,
        product: {
          ...values,
          // values.price — это рубли, переводим в копейки:
          priceCents: Math.round((values.price || 0) * 100),
        },
      }).unwrap();
      notification.success({ message: 'Товар обновлён' });
    } else {
      await createProduct({
        ...values,
        priceCents: Math.round((values.price || 0) * 100),
      }).unwrap();
      notification.success({ message: 'Товар создан' });
    }
    setIsModalVisible(false);
  } catch (error) {
    console.error('Ошибка при сохранении товара:', error);
  }
};


  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id).unwrap();
      notification.success({ message: 'Товар удален' });
    } catch (error) {
      notification.error({ message: 'Ошибка при удалении товара' });
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
      title: 'Цена',
      dataIndex: 'priceCents',
      key: 'priceCents',
      render: (price: number | undefined) => `${(price ?? 0).toLocaleString('ru-RU')} ₽`,
    },
    {
      title: 'В наличии',
      dataIndex: 'inStock',
      key: 'inStock',
      render: (val: number | undefined) => val ?? '–',
    },
    {
      title: 'Категория',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId: number) => {
        const category = categories?.find(c => c.id === categoryId);
        return category ? category.name : 'Без категории';
      },
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            Редактировать
          </Button>
          <Popconfirm
            title="Вы уверены, что хотите удалить этот товар?"
            onConfirm={() => handleDelete(record.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button danger icon={<DeleteOutlined />} loading={isDeleting}>
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading || categoriesLoading) {
    return (
      <div className="flex justify-center p-12">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Управление товарами</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>
          Добавить товар
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={productsData?.content || []}
        rowKey="id"
        pagination={{
          current: currentPage + 1,
          pageSize: productsData?.size || 10,
          total: productsData?.totalElements || 0,
          onChange: (page) => setCurrentPage(page - 1),
        }}
      />

      <Modal
        title={editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleFormSubmit}
        confirmLoading={isCreating || isUpdating}
        okText={editingProduct ? 'Сохранить' : 'Создать'}
        cancelText="Отмена"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название товара' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Цена"
            rules={[{ required: true, message: 'Укажите цену' }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }}
            formatter={(value) => `${Number(value || 0).toLocaleString('ru-RU')} ₽`}
    parser={(value) => value?.replace(/\s?₽|\s/g, '') || ''}
     />
          </Form.Item>

          <Form.Item
            name="inStock"
            label="Количество в наличии"
            rules={[{ required: true, message: 'Укажите количество' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Категория"
            rules={[{ required: true, message: 'Выберите категорию' }]}
          >
            <Select>
              {categories?.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="imageUrl" label="URL изображения">
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProducts;
