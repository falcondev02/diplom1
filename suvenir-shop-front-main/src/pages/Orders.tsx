
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Typography,
  Table,
  Tag,
  Collapse,
  Empty,
  notification,
  Spin,
  Card,
  List,
} from 'antd';
import { useGetUserOrdersQuery } from '../api/ordersApi';
import { Order, OrderItem, OrderStatus } from '../types';

const { Title, Text } = Typography;
const { Panel } = Collapse;

// Преобразование статуса заказа в русское название
const getStatusName = (status: OrderStatus) => {
  const statusMap = {
    [OrderStatus.PENDING]: { name: 'Ожидает обработки', color: 'blue' },
    [OrderStatus.PROCESSING]: { name: 'В обработке', color: 'orange' },
    [OrderStatus.SHIPPED]: { name: 'Отправлен', color: 'cyan' },
    [OrderStatus.DELIVERED]: { name: 'Доставлен', color: 'green' },
    [OrderStatus.CANCELLED]: { name: 'Отменен', color: 'red' },
  };

  return statusMap[status] || { name: 'Неизвестно', color: 'default' };
};

// Форматирование даты в локальный формат
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Orders: React.FC = () => {
  const location = useLocation();
  const { data: orders, isLoading, error } = useGetUserOrdersQuery();
  
  // Показываем уведомление при успешном оформлении заказа
  useEffect(() => {
    if (location.state?.orderPlaced) {
      notification.success({
        message: 'Заказ оформлен',
        description: 'Ваш заказ успешно оформлен. Спасибо за покупку!',
      });
    }
  }, [location.state]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Spin size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-6">
        <Title level={3} type="danger">Ошибка при загрузке заказов</Title>
        <Text>Пожалуйста, попробуйте обновить страницу.</Text>
      </div>
    );
  }
  
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center p-8">
        <Empty description="У вас еще нет заказов" />
      </div>
    );
  }
  
  const columns = [
    {
      title: 'Номер заказа',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => `#${id}`,
    },
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => {
        const { name, color } = getStatusName(status);
        return <Tag color={color}>{name}</Tag>;
      },
    },
    {
      title: 'Сумма',
      dataIndex: 'totalSum',
      key: 'totalSum',
      render: (sum: number) => `${sum.toLocaleString('ru-RU')} ₽`,
    },
  ];
  
  const expandedRowRender = (order: Order) => (
    <Card className="bg-gray-50">
      <div className="mb-4">
        <Text strong>Адрес доставки: </Text>
        <Text>{order.address}</Text>
      </div>
      
      {order.note && (
        <div className="mb-4">
          <Text strong>Комментарий: </Text>
          <Text>{order.note}</Text>
        </div>
      )}
      
      <div>
        <Text strong>Товары:</Text>
        <List
          dataSource={order.items}
          renderItem={(item: OrderItem) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={`${item.quantity} × ${item.price.toLocaleString('ru-RU')} ₽`}
              />
              <div>{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</div>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
  
  return (
    <div>
      <Title level={2}>История заказов</Title>
      
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        expandable={{
          expandedRowRender,
        }}
        pagination={false}
      />
    </div>
  );
};

export default Orders;
