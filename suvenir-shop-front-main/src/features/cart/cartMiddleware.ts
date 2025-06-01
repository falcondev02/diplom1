// src/features/cart/cartMiddleware.ts
import type { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { setCart, clearCart } from "./cartSlice";
import { authApi } from "../../api/authApi";
import { logout } from "../auth/authSlice";

export const cartMiddleware: Middleware = (store) => (next) => (action) => {
  // 1) После login.fulfilled → подгружаем корзину из localStorage
  if (authApi.endpoints.login.matchFulfilled(action)) {
    const { username } = action.payload as { username: string };
    const key = `cart_${username}`;
    const saved = localStorage.getItem(key);
    console.log("[cartMiddleware] login.fulfilled → raw из localStorage:", saved);
    if (saved) {
      try {
        const arr = JSON.parse(saved) as Array<{ productId: number; quantity: number; name: string; priceCents: number; imageUrl: string; }>;
        console.log("[cartMiddleware] login.fulfilled → распарсил arr длиной", arr.length, "→", arr);
        store.dispatch(setCart(arr));
      } catch (e) {
        console.error("cartMiddleware: JSON.parse(saved) error:", e);
      }
    } else {
      // Если в localStorage ещё ничего не было, сбросим на пустой:
      store.dispatch(setCart([]));
    }
  }

  // 2) Перед logout → сохраняем корзину и чистим Redux
  if (action.type === logout.type) {
    const stateBefore = store.getState() as RootState;
    const username = stateBefore.auth.username;
    if (username) {
      const key = `cart_${username}`;
      console.log("[cartMiddleware] logout → сохраняю старый state.cart.items:", stateBefore.cart.items);
      localStorage.setItem(key, JSON.stringify(stateBefore.cart.items));
    }
    // Сначала обрабатываем logout (он удалит token, username и т. д.)
    next(action);
    // Затем полностью очищаем cart в Redux
    store.dispatch(clearCart());
    return; // и сразу возвращаемся
  }

  // 3) При любом действии cart/* (кроме setCart) → сначала let reducer update state, потом save to localStorage
  if (action.type.startsWith("cart/") && action.type !== setCart.type) {
    // Пусть редьюсер сначала обновит state
    const result = next(action);

    // После этого уже читаем изменённый state.cart.items и сохраняем в localStorage
    const stateAfter = store.getState() as RootState;
    const username = stateAfter.auth.username;
    if (username) {
      const key = `cart_${username}`;
      console.log("[cartMiddleware] после cart/* → сохраняю:", stateAfter.cart.items);
      localStorage.setItem(key, JSON.stringify(stateAfter.cart.items));
    }
    return result;
  }

  // 4) Все остальные экшены тупо передаем дальше
  return next(action);
};
