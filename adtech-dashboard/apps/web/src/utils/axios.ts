import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import store from "../app/store";
import { storage } from "@adtech/utils";
import { logout, setCredentials } from "@/features/auth/authSlice";

const api = axios.create({
  baseURL: "/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor — handle 401 + token refresh
let isRefreshing = false;

let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (error.response?.status === 401) {
      if (isRefreshing) {
        return new Promise((resolved, rejected) => {
          failedQueue.push({ resolve: resolved, reject: rejected });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }
      isRefreshing = true;

      const refreshToken = storage.getRefreshToken();

      return axios
        .post("/api/v1/auth/refresh", { refreshToken })
        .then((response) => {
          const {
            accessToken,
            user,
            refreshToken: newRefreshToken,
          } = response.data.data;

          storage.setAccessToken(accessToken);
          storage.setRefreshToken(newRefreshToken);
          store.dispatch(
            setCredentials({
              accessToken,
              refreshToken: newRefreshToken,
              user,
            }),
          );
          processQueue(null, accessToken);
          return api(originalRequest);
        })
        .catch((refreshError) => {
          processQueue(refreshError as AxiosError, null);
          store.dispatch(logout());
          window.location.href = "/login";
          return Promise.reject(refreshError);
        })

        .finally(() => {
          isRefreshing = false;
        });
    }

    return Promise.reject(error);
  },
);
export default api;
