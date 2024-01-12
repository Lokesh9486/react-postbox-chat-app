import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  viewUser: undefined,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    emailAction: (state, { payload }) => {
      state.email = payload;
    },
    viewUserAction: (state, { payload }) => {
      state.viewUser = payload;
    },
  },
});

export const { emailAction,viewUserAction } = authSlice.actions;

export const getEmail = (state) => state.auth.email;
export const getViewUserAction = (state) => state.auth.viewUser;

export default authSlice.reducer;
