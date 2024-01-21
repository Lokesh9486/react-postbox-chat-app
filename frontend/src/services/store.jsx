import { Provider } from "react-redux";
import authReducer from '../features/auth.js';
import { chatApi } from "./chatApi.js";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi.js";

export const store=configureStore({
    reducer:{
        auth:authReducer,
     [authApi.reducerPath]:authApi.reducer,
     [chatApi.reducerPath]:chatApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware,chatApi.middleware]),
});

export default function Providers({children}){
    return <Provider store={store}>{children}</Provider>
}