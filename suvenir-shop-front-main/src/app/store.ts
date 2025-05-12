
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '../api';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import { loadCartFromLocalStorage, saveCartToLocalStorage } from '../features/cart/cartMiddleware';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(saveCartToLocalStorage),
  preloadedState: {
    cart: loadCartFromLocalStorage(),
  },
});

setupListeners(store.dispatch);

// Экспорт типов для хуков
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
