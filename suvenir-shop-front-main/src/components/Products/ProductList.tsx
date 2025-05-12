
import React from 'react';
import { Row, Col, Pagination, Empty, Spin } from 'antd';
import ProductCard from './ProductCard';
import { Product } from '../../types';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error?: string;
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  error,
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Spin size="large" />
      </div>
    );
  }
  
  if (error) {
    return <div className="text-red-500 text-center p-4">Ошибка: {error}</div>;
  }
  
  if (!products || products.length === 0) {
    return <Empty description="Товары не найдены" />;
  }
  
  return (
    <div>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      
      <div className="mt-6 flex justify-center">
        <Pagination
          current={currentPage + 1}
          total={totalItems}
          pageSize={pageSize}
          onChange={(page) => onPageChange(page - 1)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default ProductList;
