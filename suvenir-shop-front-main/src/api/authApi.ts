// src/api/authApi.ts
import { api } from './index';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

// Вход и регистрация через RTK Query
export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: credentials => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: data => ({
        url: '/api/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
} = authApi;
