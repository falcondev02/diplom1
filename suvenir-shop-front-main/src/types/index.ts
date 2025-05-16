
// Типы данных для приложения

// Пользователь
export interface User {
  id?: number;
  username: string;
  role?: string;
}

// Данные авторизации
export interface AuthState {
  token: string | null;
  username: string | null;
  role: string | null;
  isAuth: boolean;
}

// Продукт
export interface Product {
  id: number;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  categoryId: number;
  inStock: number;
}

// Категория
export interface Category {
  id: number;
  name: string;
}

// Элемент корзины
export interface CartItem {
  productId: number;
  name: string;
  priceCents: number;
  imageUrl: string;
  quantity: number;
}

// Состояние корзины
export interface CartState {
  items: CartItem[];
  totalQty: number;
  totalSum: number;
}

// Заказ
export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  address: string;
  note?: string;
  totalSum: number;
}

// Элемент заказа
export interface OrderItem {
  productId: number;
  name?: string;
  priceCents: number;
  quantity: number;
}

// Статус заказа
export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

// Данные для создания заказа
export interface CreateOrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
  address: string;
  note?: string;
}

// Ответ при авторизации
export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

// Запрос на регистрацию
export interface RegisterRequest {
  username: string;
  password: string;
}

// Запрос на вход
export interface LoginRequest {
  username: string;
  password: string;
}

// Ответ с пагинацией
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
