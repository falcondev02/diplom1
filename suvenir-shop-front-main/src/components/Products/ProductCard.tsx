
import React from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { Product } from '../../types';
import { useAppDispatch } from '../../app/hooks';
import { addToCart } from '../../features/cart/cartSlice';

const { Meta } = Card;
const { Text } = Typography;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  
  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };
  
  return (
    <Card
      hoverable
      className="h-full flex flex-col"
      cover={
        <img 
          alt={product.name} 
          src={product.imageUrl || 'https://placehold.co/300x300?text=Нет+фото'} 
          className="h-48 object-contain"
        />
      }
      actions={[
        <Link to={`/product/${product.id}`} key="details">
          <EyeOutlined /> Детали
        </Link>,
        <Button 
          type="text" 
          icon={<ShoppingCartOutlined />} 
          onClick={handleAddToCart}
          disabled={product.inStock <= 0}
          key="add"
        >
          {product.inStock > 0 ? 'В корзину' : 'Нет в наличии'}
        </Button>,
      ]}
    >
      <Meta
        title={<Link to={`/product/${product.id}`}>{product.name}</Link>}
        description={
          <Space direction="vertical">
            <Text type="secondary" ellipsis={{ rows: 2 }}>
              {product.description}
            </Text>
            <Text strong className="text-lg text-blue-600">
            {(product.priceCents ?? 0).toLocaleString('ru-RU')} ₽
            </Text>

            <Text type={product.inStock > 0 ? 'success' : 'danger'}>
              {product.inStock > 0 ? 'В наличии' : 'Нет в наличии'}
            </Text>
          </Space>
        }
      />
    </Card>
  );
};

export default ProductCard;
