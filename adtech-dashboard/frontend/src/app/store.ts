import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/features/auth/authSlice";
import apiSlice from "./api";

const store = configureStore({
  reducer: {
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
