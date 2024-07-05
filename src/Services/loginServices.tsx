// src/services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const loginApi = createApi({
    reducerPath: 'loginApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://r18brnk5-5000.inc1.devtunnels.ms/' }),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: '/login/',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginUserMutation } = loginApi;
