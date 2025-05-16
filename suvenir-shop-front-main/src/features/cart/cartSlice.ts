
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState, Product } from '../../types';

const initialState: CartState = {
  items: [],
  totalQty: 0,
  totalSum: 0,
};

// Пересчет общего количества и суммы
const recalculateTotals = (state: CartState) => {
  state.totalQty = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalSum = state.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          productId: product.id,
          name: product.name,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl,
          quantity,
        });
      }
      
      recalculateTotals(state);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
      recalculateTotals(state);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
        recalculateTotals(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQty = 0;
      state.totalSum = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
