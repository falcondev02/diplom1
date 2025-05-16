
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Image,
  Button,
  Card,
  Descriptions,
  InputNumber,
  Space,
  notification,
  Breadcrumb,
  Spin,
} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useGetProductQuery } from '../api/productsApi';
import { useGetCategoriesQuery } from '../api/categoriesApi';
import { useAppDispatch } from '../app/hooks';
import { addToCart } from '../features/cart/cartSlice';

const { Title, Paragraph } = Typography;

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading, error } = useGetProductQuery(Number(id));
  const { data: categories } = useGetCategoriesQuery();
  
  const getCategoryName = () => {
    if (!categories || !product) return '';
    const category = categories.find(cat => cat.id === product.categoryId);
    return category?.name || '';
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(addToCart({ product, quantity }));
    notification.success({
      message: 'Товар добавлен в корзину',
      description: `${product.name} - ${quantity} шт.`,
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Spin size="large" />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="text-center p-6">
        <Title level={3} type="danger">Товар не найден</Title>
        <Button type="primary" onClick={() => navigate('/')}>Вернуться в каталог</Button>
      </div>
    );
  }
  
  return (
    <div>
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item href="/">Каталог</Breadcrumb.Item>
        {getCategoryName() && <Breadcrumb.Item>{getCategoryName()}</Breadcrumb.Item>}
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>
      
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
            <Image
              src={product.imageUrl || 'https://placehold.co/600x400?text=Нет+фото'}
              alt={product.name}
              className="rounded"
              fallback="https://placehold.co/600x400?text=Ошибка+загрузки"
            />
          </div>
          
          <div className="md:w-1/2">
            <Title level={2}>{product.name}</Title>
            
            <Title level={3} className="text-blue-600 mb-6">
              {product.priceCents.toLocaleString('ru-RU')} ₽
            </Title>
            
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Категория">{getCategoryName()}</Descriptions.Item>
              <Descriptions.Item label="В наличии">
                {product.inStock > 0 ? `${product.inStock} шт.` : 'Нет в наличии'}
              </Descriptions.Item>
            </Descriptions>
            
            <div className="mt-6">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="flex items-center">
                  <span className="mr-4">Количество:</span>
                  <InputNumber
                    min={1}
                    max={product.inStock}
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                    disabled={product.inStock <= 0}
                  />
                </div>
                
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  disabled={product.inStock <= 0}
                  block
                >
                  Добавить в корзину
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </Card>
      
      <Card title="Описание товара">
        <Paragraph>{product.description || 'Описание отсутствует'}</Paragraph>
      </Card>
    </div>
  );
};

export default ProductDetails;
