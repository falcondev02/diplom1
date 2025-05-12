
import React, { useState, useEffect } from 'react';
import { Typography, Select, Divider, Empty, notification } from 'antd';
import { useGetProductsQuery } from '../api/productsApi';
import { useGetCategoriesQuery } from '../api/categoriesApi';
import ProductList from '../components/Products/ProductList';

const { Title } = Typography;
const { Option } = Select;

const Catalog: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  
  const { data: categories, error: categoriesError } = useGetCategoriesQuery();
  const {
    data: productsData,
    error: productsError,
    isLoading,
  } = useGetProductsQuery({ page: currentPage, size: 12, categoryId });
  
  useEffect(() => {
    if (productsError) {
      notification.error({
        message: 'Ошибка загрузки товаров',
        description: 'Не удалось загрузить список товаров. Пожалуйста, попробуйте позже.',
      });
    }
    
    if (categoriesError) {
      notification.error({
        message: 'Ошибка загрузки категорий',
        description: 'Не удалось загрузить список категорий. Пожалуйста, попробуйте позже.',
      });
    }
  }, [productsError, categoriesError]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleCategoryChange = (value: string) => {
    setCategoryId(value ? Number(value) : undefined);
    setCurrentPage(0); // Сбрасываем страницу при смене категории
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Каталог товаров</Title>
        
        <div className="flex items-center">
          <span className="mr-2">Категория:</span>
          <Select
            style={{ width: 200 }}
            placeholder="Все категории"
            onChange={handleCategoryChange}
            allowClear
          >
            {categories?.map((category) => (
              <Option key={category.id} value={category.id.toString()}>
                {category.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      
      <Divider />
      
      {productsData?.content ? (
        <ProductList
          products={productsData.content}
          loading={isLoading}
          totalItems={productsData.totalElements}
          pageSize={productsData.size}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      ) : (
        !isLoading && <Empty description="Товары не найдены" />
      )}
    </div>
  );
};

export default Catalog;
