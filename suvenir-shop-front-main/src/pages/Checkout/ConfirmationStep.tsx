
import React from 'react';
import { Typography, Divider, List, Space } from 'antd';
import { useAppSelector } from '../../app/hooks';
import { CartItem } from '../../types';

const { Title, Text } = Typography;

interface ConfirmationStepProps {
  address: string;
  note?: string;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ address, note }) => {
  const { items, totalQty, totalSum } = useAppSelector((state) => state.cart);
  
  return (
    <div>
      <Title level={3}>Подтверждение заказа</Title>
      
      <div className="bg-gray-50 p-4 rounded mb-6">
        <Title level={5}>Адрес доставки</Title>
        <Text>{address}</Text>
        
        {note && (
          <>
            <Divider className="my-2" />
            <Title level={5}>Комментарий к заказу</Title>
            <Text>{note}</Text>
          </>
        )}
      </div>
      
      <div>
        <Title level={5}>Товары ({totalQty})</Title>
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={(item: CartItem) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={`${item.quantity} × ${item.price.toLocaleString('ru-RU')} ₽`}
              />
              <div>
                {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
              </div>
            </List.Item>
          )}
        />
        
        <Divider />
        
        <div className="flex justify-between">
          <Text strong>Итого:</Text>
          <Space>
            <Text strong>{totalQty} товаров на сумму</Text>
            <Text strong className="text-xl text-blue-600">
              {totalSum.toLocaleString('ru-RU')} ₽
            </Text>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
