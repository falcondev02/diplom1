
import React from 'react';
import { Form, Input, Typography } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface AddressStepProps {
  address: string;
  setAddress: (address: string) => void;
  note: string;
  setNote: (note: string) => void;
}

const AddressStep: React.FC<AddressStepProps> = ({ address, setAddress, note, setNote }) => {
  return (
    <div>
      <Title level={3}>Адрес доставки</Title>
      <Text type="secondary" className="mb-6 block">
        Укажите адрес, на который будет доставлен заказ
      </Text>
      
      <Form layout="vertical">
        <Form.Item
          label="Адрес доставки"
          required
          validateStatus={address ? 'success' : 'error'}
          help={address ? '' : 'Пожалуйста, введите адрес доставки'}
        >
          <TextArea
            rows={4}
            placeholder="Введите полный адрес доставки"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Item>
        
        <Form.Item label="Комментарий к заказу">
          <TextArea
            rows={3}
            placeholder="Дополнительная информация для доставки (необязательно)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddressStep;
