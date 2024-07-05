// src/services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://r18brnk5-5000.inc1.devtunnels.ms/' }),
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => '/product/',
        }),
        addProduct: builder.mutation({
            query: (addProduct) => ({
                url: '/product/add',
                method: 'POST',
                body: addProduct,
            }),
        }),
    }),
});

export const {
    useGetAllProductsQuery,
    useAddProductMutation
} = productApi;
