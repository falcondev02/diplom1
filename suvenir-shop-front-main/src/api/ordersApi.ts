import { api } from './index';
import { CreateOrderRequest, Order, OrderStatus, PaginatedResponse } from '../types';

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/api/orders',
        method: 'POST',
        body: orderData,
      }),
    }),

    getUserOrders: builder.query<Order[], void>({
      query: () => '/api/orders/self',
      transformResponse: (orders: any[]) =>
        orders.map((order) => ({
          ...order,
          totalSum: order.totalSumCents / 100,
          items: order.items.map((item: any) => ({
            ...item,
            price: item.priceCents / 100,
          })),
        })),
    }),

    getAllOrders: builder.query<PaginatedResponse<Order>, { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 }) => ({
        url: '/api/orders',
        params: { page, size },
      }),
      transformResponse: (resp: any) => ({
        ...resp,
        content: resp.content.map((order: any) => ({
          ...order,
          totalSum: order.totalSumCents / 100,
          items: order.items.map((item: any) => ({
            ...item,
            price: item.priceCents / 100,
          })),
        })),
      }),
    }),

    updateOrderStatus: builder.mutation<Order, { id: number; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/api/orders/${id}/status`,
        method: 'PUT',
        params: { status },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
