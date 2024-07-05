// src/services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const registerApi = createApi({
    reducerPath: 'registerApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://r18brnk5-5000.inc1.devtunnels.ms/' }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (credentials) => ({
                url: '/register/',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useRegisterUserMutation } = registerApi;
