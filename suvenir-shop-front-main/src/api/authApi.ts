// src/api/authApi.ts
import { api } from "./index";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: credentials => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: data => ({
        url: "/api/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    // ---------------- Новый endpoint ----------------
    changePassword: builder.mutation<
      { msg: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (payload) => ({
        url: "/api/users/me/password",
        method: "PUT",
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useChangePasswordMutation, // экспортируем новый хук
} = authApi;
