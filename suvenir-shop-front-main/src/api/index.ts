    // src/api/index.ts
    import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
    import type { RootState } from '../app/store';

    const baseUrl = 'http://localhost:8081';

    export const api = createApi({
      reducerPath: 'api',
      baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
          // Смотрим токен в state.auth.token или localStorage
          const token = (getState() as RootState).auth.token || localStorage.getItem('token');
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          return headers;
        },
      }),
      endpoints: () => ({}), // пусто, будем расширять в других файлах
    });
