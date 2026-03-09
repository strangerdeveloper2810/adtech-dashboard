import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "./hooks";
import type { User } from "@/types";
import { logout, setCredentials } from "@/features/auth/authSlice";
import { storage } from "@/utils/storage";

interface RefreshResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: "/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh the token
    const refreshToken = storage.getRefreshToken();

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const { data } = refreshResult.data as RefreshResponse;

        // Store the new tokens
        storage.setAccessToken(data.accessToken);
        storage.setRefreshToken(data.refreshToken);
        api.dispatch(
          setCredentials({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: data.user,
          }),
        );

        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout
        api.dispatch(logout());
        window.location.href = "/login";
      }
    } else {
      // No refresh token, logout
      api.dispatch(logout());
      window.location.href = "/login";
    }
  }

  return result;
};

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Campaign", "Ad", "Metrics", "User"],
  endpoints: () => ({}),
});

export default apiSlice;
