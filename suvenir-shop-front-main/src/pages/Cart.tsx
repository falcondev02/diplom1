
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Table,
  Button,
  InputNumber,
  Image,
  Empty,
  Space,
  Card,
  Divider,
} from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { removeFromCart, updateQuantity } from '../features/cart/cartSlice';
import { CartItem } from '../types';

const { Title, Text } = Typography;

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, totalQty, totalSum } = useAppSelector((state) => state.cart);
  
  const handleQuantityChange = (productId: number, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };
  
  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };
  
  const columns = [
    {
      title: 'Товар',
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: CartItem) => (
        <div className="flex items-center">
          <Image
            src={record.imageUrl || 'https://placehold.co/80x80?text=Нет+фото'}
            alt={record.name}
            width={80}
            height={80}
            className="mr-4"
            fallback="https://placehold.co/80x80?text=Ошибка"
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: 'Цена',
      dataIndex: 'priceCents',
      key: 'priceCents',
      render: (priceCents: number) => `${priceCents.toLocaleString('ru-RU')} ₽`,
    },
    {
      title: 'Количество',
      key: 'quantity',
      render: (_: any, record: CartItem) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record.productId, value || 1)}
        />
      ),
    },
    {
      title: 'Сумма',
      key: 'total',
      render: (_: any, record: CartItem) => 
        `${(record.priceCents * record.quantity).toLocaleString('ru-RU')} ₽`,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.productId)}
        >
          Удалить
        </Button>
      ),
    },
  ];
  
  if (items.length === 0) {
    return (
      <div className="text-center p-8">
        <Empty
          description="Ваша корзина пуста"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Перейти в каталог
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <Title level={2}>Корзина</Title>
      <Divider />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <Table
            columns={columns}
            dataSource={items}
            rowKey="productId"
            pagination={false}
          />
        </div>
        
        <div className="lg:w-1/3">
          <Card className="sticky top-6">
            <Title level={4}>Сводка заказа</Title>
            <Space direction="vertical" className="w-full">
              <div className="flex justify-between">
                <Text>Товары ({totalQty}):</Text>
                <Text>{totalSum.toLocaleString('ru-RU')} ₽</Text>
              </div>
              
              <Divider />
              
              <div className="flex justify-between">
                <Text strong>Итого:</Text>
                <Title level={4} className="m-0 text-blue-600">
                  {totalSum.toLocaleString('ru-RU')} ₽
                </Title>
              </div>
              
              <Button
                type="primary"
                size="large"
                block
                onClick={() => navigate('/checkout')}
                className="mt-4"
              >
                Оформить заказ
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
