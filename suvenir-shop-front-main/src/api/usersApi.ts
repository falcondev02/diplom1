import { api } from './index';
import { User, PaginatedResponse } from '../types';

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => {
        console.log('[RTK QUERY] getUsers called with', { page, size }); // 💬 Лог запроса
        return {
          url: '/api/users',
          params: { page, size },
        };
      },
    }),

    createUser: builder.mutation<User, { username: string; password: string; role?: string }>({
      query: (userData) => ({
        url: '/api/users',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = usersApi;
