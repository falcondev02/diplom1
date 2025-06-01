// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState, Product } from "../../types";

const initialState: CartState = {
  items: [],
  totalQty: 0,
  totalSum: 0,
};

const recalc = (s: CartState) => {
  s.totalQty = s.items.reduce((sum, i) => sum + i.quantity, 0);
  s.totalSum = s.items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Этот экшен установит массив CartItem[] и пересчитает totalQty/totalSum
    setCart: (s, action: PayloadAction<CartItem[]>) => {
      s.items = action.payload;
      recalc(s);
    },
    addToCart: (s, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existing = s.items.find((i) => i.productId === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        s.items.push({
          productId: product.id,
          name: product.name,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl,
          quantity,
        });
      }
      recalc(s);
    },
    removeFromCart: (s, action: PayloadAction<number>) => {
      s.items = s.items.filter((i) => i.productId !== action.payload);
      recalc(s);
    },
    updateQuantity: (s, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = s.items.find((i) => i.productId === productId);
      if (item && quantity > 0) {
        item.quantity = quantity;
        recalc(s);
      }
    },
    clearCart: (s) => {
      s.items = [];
      s.totalQty = 0;
      s.totalSum = 0;
    },
  },
});

export const { setCart, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
