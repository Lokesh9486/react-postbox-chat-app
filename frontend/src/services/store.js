"use client"
import { Provider } from "react-redux";
import authReducer from '../features/auth';
import { chatApi } from "./chatApi";
const { configureStore } = require("@reduxjs/toolkit");
const { authApi } = require("./authApi");

const store=configureStore({
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
};