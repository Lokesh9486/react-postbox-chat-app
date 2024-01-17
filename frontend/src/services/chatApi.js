import getCookies from "../utils/getCookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/chat",
    prepareHeaders: (headers) => {
      const token=getCookies()
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
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
