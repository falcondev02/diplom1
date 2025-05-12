
import React, { useState } from 'react';
import { Steps, Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import AddressStep from './AddressStep';
import ConfirmationStep from './ConfirmationStep';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { clearCart } from '../../features/cart/cartSlice';
import { useCreateOrderMutation } from '../../api/ordersApi';

const { Step } = Steps;

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const { items } = useAppSelector(state => state.cart);
  
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  
  // Если корзина пуста, перенаправляем на страницу корзины
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handlePlaceOrder = async () => {
    try {
      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      
      await createOrder({
        items: orderItems,
        address,
        note: note || undefined,
      }).unwrap();
      
      // После успешного создания заказа очищаем корзину
      dispatch(clearCart());
      
      // Перенаправляем на страницу успеха
      navigate('/orders', { state: { orderPlaced: true } });
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
    }
  };
  
  const steps = [
    {
      title: 'Адрес доставки',
      content: <AddressStep address={address} setAddress={setAddress} note={note} setNote={setNote} />,
    },
    {
      title: 'Подтверждение',
      content: <ConfirmationStep address={address} note={note} />,
    },
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <Steps current={currentStep}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </Card>
      
      <Card className="mb-6">
        <div className="min-h-[300px]">
          {steps[currentStep].content}
        </div>
        
        <div className="flex justify-between mt-6">
          {currentStep > 0 && (
            <Button onClick={handlePrev}>
              Назад
            </Button>
          )}
          
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              Далее
            </Button>
          )}
          
          {currentStep === steps.length - 1 && (
            <Button
              type="primary"
              onClick={handlePlaceOrder}
              loading={isLoading}
              disabled={!address}
            >
              Оформить заказ
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Checkout;
