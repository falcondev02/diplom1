// src/api/categoriesApi.ts
import { api } from './index';
import type { Category } from '../types';

export const categoriesApi = api.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/api/categories',
    }),
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: newCategory => ({
        url: '/api/categories',
        method: 'POST',
        body: newCategory,
      }),
    }),
    deleteCategory: builder.mutation<void, number>({
      query: id => ({
        url: `/api/categories/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
