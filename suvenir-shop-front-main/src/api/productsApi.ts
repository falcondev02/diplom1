// src/api/productsApi.ts
import { api } from './index';
import type { Product, PaginatedResponse } from '../types';

export const productsApi = api.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query<PaginatedResponse<Product>, { page?: number; size?: number; categoryId?: number }>({
      query: ({ page = 0, size = 10, categoryId }) => ({
        url: '/api/products',
        params: {
          page,
          size,
          ...(categoryId ? { categoryId } : {}),
        },
      }),
      transformResponse: (response: any): PaginatedResponse<Product> => ({
        ...response,
        content: response.content.map((item: any) => ({
          ...item,
          price: item.priceCents / 100,
        })),
      }),
    }),
    getProduct: builder.query<Product, number>({
      query: id => `/api/products/${id}`,
      transformResponse: (item: any): Product => ({
        ...item,
        price: item.priceCents / 100,
      }),
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: newProduct => {
        const productToSend = {
          ...newProduct,
          priceCents: Math.round((newProduct.price || 0) * 100),
        };
        delete (productToSend as any).price;
        return {
          url: '/api/products',
          method: 'POST',
          body: productToSend,
        };
      },
    }),
    updateProduct: builder.mutation<Product, { id: number; product: Partial<Product> }>({
      query: ({ id, product }) => {
        const productToSend = {
          ...product,
          priceCents: Math.round((product.price || 0) * 100),
        };
        delete (productToSend as any).price;
        return {
          url: `/api/products/${id}`,
          method: 'PUT',
          body: productToSend,
        };
      },
    }),
    deleteProduct: builder.mutation<void, number>({
      query: id => ({
        url: `/api/products/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
