export const API = {
  BASE_URL: "/api/v1",
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
  },
  CAMPAIGNS: "/campaigns",
  ADS: "/ads",
  EVENTS: "/events",
  METRICS: "/metrics",
  USERS: "/users",
} as const;

export const WS = {
  METRICS_URL: "ws://localhost:8080/ws/metrics",
  RECONNECT_INTERVAL: 1000, // — delay ban đầu khi reconnect
  MAX_RECONNECT_ATTEMPTS: 5, // MAX_RECONNECT_ATTEMPTS
  MAX_RECONNECT_DELAY: 30000, //  delay tối đa (exponential backoff sẽ tăng dần)
} as const;

export const HTTP_TIMEOUT = 10000;
