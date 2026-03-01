import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./hooks";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/v1",
  prepareHeaders: (header, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      header.set("Authorization", `Bearer ${token}`);
    }
    return header;
  },
});

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Campaign", "Ad", "Metrics", "User"],
  endpoints: (builder) => ({
    // Define your endpoints here
  }),
});

export default apiSlice;
