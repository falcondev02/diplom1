import { api } from './index';
import { User, PaginatedResponse } from '../types';

export const usersApi = api.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query<
      PaginatedResponse<User>,
      { page?: number; size?: number }
    >({
      query: ({ page = 0, size = 10 }) => ({
        url: '/api/users',
        params: { page, size },
      }),
      providesTags: ['Users'],
    }),

    createUser: builder.mutation<User, { username: string; password: string; role?: string }>({
      query: body => ({ url: '/api/users', method: 'POST', body }),
      invalidatesTags: ['Users'],
    }),
    changePassword: builder.mutation<void, { oldPassword: string; newPassword: string }>({
  query: body => ({
    url: '/api/users/me/password',
    method: 'PUT',
    body,
  }),
}),


    deleteUser: builder.mutation<void, number>({
      query: id => ({ url: `/api/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
    useChangePasswordMutation, 
} = usersApi;
