
import { api } from './index';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: (data) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
