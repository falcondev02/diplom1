// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import type { AuthResponse } from '../../types';

export interface AuthState {
  token: string | null;
  username: string | null;
  role: string | null;
  isAuth: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  username: localStorage.getItem('username'),
  role: localStorage.getItem('role'),
  isAuth: Boolean(localStorage.getItem('token')),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      state.token = null;
      state.username = null;
      state.role = null;
      state.isAuth = false;
    }
  },
  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<AuthResponse>) => {
        const { token, username, role } = action.payload;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
        state.token = token;
        state.username = username;
        state.role = role;
        state.isAuth = true;
      }
    );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
