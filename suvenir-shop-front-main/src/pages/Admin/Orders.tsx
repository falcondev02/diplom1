
import React, { useState } from 'react';
import {
  Typography,
  Table,
  Button,
  Tag,
  Select,
  Space,
  notification,
  Drawer,
  Descriptions,
  List,
  Spin,
  Divider,
} from 'antd';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../api/ordersApi';
import { Order, OrderItem, OrderStatus } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;

// Преобразование статуса заказа в русское название и цвет
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

const AdminOrders: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const { data: ordersData, isLoading } = useGetAllOrdersQuery({ page: currentPage, size: 10 });
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  
  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };
  
  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  
  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      notification.success({
        message: 'Статус заказа обновлен',
        description: `Заказ #${orderId} теперь имеет статус "${getStatusName(newStatus).name}"`,
      });
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось обновить статус заказа.',
      });
    }
  };
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => `#${id}`,
    },
    {
      title: 'Пользователь ID',
      dataIndex: 'userId',
      key: 'userId',
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
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Space>
          <Button type="primary" onClick={() => showOrderDetails(record)}>
            Детали
          </Button>
          
          <Select
            value={record.status}
            style={{ width: 160 }}
            onChange={(value) => handleStatusChange(record.id, value as OrderStatus)}
            disabled={isUpdating}
          >
            <Option value={OrderStatus.PENDING}>Ожидает обработки</Option>
            <Option value={OrderStatus.PROCESSING}>В обработке</Option>
            <Option value={OrderStatus.SHIPPED}>Отправлен</Option>
            <Option value={OrderStatus.DELIVERED}>Доставлен</Option>
            <Option value={OrderStatus.CANCELLED}>Отменен</Option>
          </Select>
        </Space>
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
      <Title level={2}>Управление заказами</Title>
      
      <Table
        columns={columns}
        dataSource={ordersData?.content || []}
        rowKey="id"
        pagination={{
          current: currentPage + 1,
          pageSize: ordersData?.size || 10,
          total: ordersData?.totalElements || 0,
          onChange: (page) => setCurrentPage(page - 1),
        }}
      />
      
      <Drawer
        title={`Детали заказа #${selectedOrder?.id}`}
        placement="right"
        onClose={closeDrawer}
        open={drawerVisible}
        width={500}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="ID заказа">{selectedOrder.id}</Descriptions.Item>
              <Descriptions.Item label="ID пользователя">{selectedOrder.userId}</Descriptions.Item>
              <Descriptions.Item label="Дата создания">{formatDate(selectedOrder.createdAt)}</Descriptions.Item>
              <Descriptions.Item label="Дата обновления">{formatDate(selectedOrder.updatedAt)}</Descriptions.Item>
              <Descriptions.Item label="Статус">
                <Tag color={getStatusName(selectedOrder.status).color}>
                  {getStatusName(selectedOrder.status).name}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Сумма заказа">
                {selectedOrder.totalSum.toLocaleString('ru-RU')} ₽
              </Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <div>
              <Title level={5}>Адрес доставки:</Title>
              <Text>{selectedOrder.address}</Text>
            </div>
            
            {selectedOrder.note && (
              <div className="mt-4">
                <Title level={5}>Комментарий к заказу:</Title>
                <Text>{selectedOrder.note}</Text>
              </div>
            )}
            
            <Divider />
            
            <Title level={5}>Товары в заказе:</Title>
            <List
              bordered
              dataSource={selectedOrder.items}
              renderItem={(item: OrderItem) => (
                <List.Item>
                  <div className="flex justify-between w-full">
                    <div>
                      <Text strong>ID товара: {item.productId}</Text>
                      <div>{item.name || `Товар #${item.productId}`}</div>
                    </div>
                    <div>
                      <div>{`${item.quantity} × ${item.priceCents.toLocaleString('ru-RU')} ₽`}</div>
                      <div className="text-right font-bold">
                        {(item.priceCents * item.quantity).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            
            <Divider />
            
            <div className="mt-4">
              <Title level={5}>Изменить статус:</Title>
              <Select
                value={selectedOrder.status}
                style={{ width: '100%' }}
                onChange={(value) => handleStatusChange(selectedOrder.id, value as OrderStatus)}
              >
                <Option value={OrderStatus.PENDING}>Ожидает обработки</Option>
                <Option value={OrderStatus.PROCESSING}>В обработке</Option>
                <Option value={OrderStatus.SHIPPED}>Отправлен</Option>
                <Option value={OrderStatus.DELIVERED}>Доставлен</Option>
                <Option value={OrderStatus.CANCELLED}>Отменен</Option>
              </Select>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdminOrders;
