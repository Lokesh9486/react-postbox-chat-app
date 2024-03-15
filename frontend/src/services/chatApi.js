import getCookies from "../utils/getCookies";
import * as rtkQuery from '@reduxjs/toolkit/query/react';
const { createApi, fetchBaseQuery } = rtkQuery.default ?? rtkQuery;

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.1.16:8000/chat",
    credentials: "include"
    // prepareHeaders: (headers) => {
    //   const token=getCookies()
    //   if (token) {
    //     headers.set("authorization", `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  tagTypes: ['User','Chat'],
  endpoints: (builder) => ({
    getChatedUsers: builder.query({
      query: (data) => ({
        url: "/getChatedUser",
        method: "GET",
        body: data,
      }),
    }),
    getSpecificChat: builder.query({
      query: (data) => `/getMessage/${data}`,
      providesTags: ['Chat'],
    }),
    getUserDetails: builder.query({
      query: () => `/getUserDetails`,
      providesTags: ['User'],
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/message",
        method: "POST",
        body: data,
      }),
    }),
    deleteMessage:builder.mutation({
      query:(chatId)=>({
        url:"/message",
        method: "Delete",
        body: {chatId},
      }),
    }),
    searchUserProfile:builder.query({
      query:data=>(`/searchUsersProfile/${data}`),
    }),
    getUser:builder.query({
      query:data=>(`/getUser/${data}`),
    })
  }),
});

export const {
  useGetChatedUsersQuery,
  useGetSpecificChatQuery,
  useGetUserDetailsQuery,
  useSendMessageMutation,
  useSearchUserProfileQuery,
  useDeleteMessageMutation,
  useGetUserQuery
} = chatApi;
