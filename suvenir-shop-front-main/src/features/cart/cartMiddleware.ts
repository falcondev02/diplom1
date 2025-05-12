
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// Загрузка корзины из localStorage
export const loadCartFromLocalStorage = () => {
  try {
    const cartJSON = localStorage.getItem('cart');
    return cartJSON ? JSON.parse(cartJSON) : { items: [], totalQty: 0, totalSum: 0 };
  } catch (error) {
    console.error('Ошибка при загрузке корзины из localStorage:', error);
    return { items: [], totalQty: 0, totalSum: 0 };
  }
};

// Middleware для сохранения корзины в localStorage
export const saveCartToLocalStorage: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Если действие относится к корзине, сохраняем обновленное состояние
  if (action.type?.startsWith('cart/')) {
    const cartState = (store.getState() as RootState).cart;
    localStorage.setItem('cart', JSON.stringify(cartState));
  }
  
  return result;
};
