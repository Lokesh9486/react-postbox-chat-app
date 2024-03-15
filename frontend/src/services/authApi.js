import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.1.16:8000/user",
    credentials: "include"
  // prepareHeaders: (headers) => {
  //     headers.set("credentials", `include`);
  //     return headers;
  //   },
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => ({
        url: "/signup",
        method: "POST",
        body: data,
      }),
    }),
    signIn: builder.mutation({
      query: (data) => ({
        url: "/signin",
        method: "POST",
        body: data,
      }),
    }),
    otpVerification: builder.mutation({
      query: (data) => ({
        url: "/otpverification",
        method: "POST",
        body: data,
      }),
    }),
    resendOTP: builder.mutation({
      query: (data) => ({
        url: "/resendotp",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useOtpVerificationMutation,
  useResendOTPMutation,
  useSignInMutation
} = authApi;
