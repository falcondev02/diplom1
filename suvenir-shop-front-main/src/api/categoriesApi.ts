import { api } from './index';
import { Category } from '../types';

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/api/categories',
    }),
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (newCategory) => ({
        url: '/api/categories',
        method: 'POST',
        body: newCategory,
      }),
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/categories/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
