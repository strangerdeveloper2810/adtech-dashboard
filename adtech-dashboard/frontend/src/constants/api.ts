export const API = {
  BASE_URL: '/api/v1',
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
  },
  CAMPAIGNS: '/campaigns',
  ADS: '/ads',
  EVENTS: '/events',
  METRICS: '/metrics',
  USERS: '/users',
} as const;

export const HTTP_TIMEOUT = 10000;
