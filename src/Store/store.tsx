// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { productApi } from '../Services/productServices';
import { loginApi } from '../Services/loginServices';
import { registerApi } from '../Services/registerServices';

export const store = configureStore({
    reducer: {
        [productApi.reducerPath]: productApi.reducer,
        [loginApi.reducerPath]: loginApi.reducer,
        [registerApi.reducerPath]: registerApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(registerApi.middleware).concat(loginApi.middleware).concat(productApi.middleware),
});

setupListeners(store.dispatch);
