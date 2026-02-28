export const APP_NAME = 'AdTech Dashboard';

export const DRAWER_WIDTH = 240;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  ROWS_PER_PAGE_OPTIONS: [10, 25, 50],
} as const;

export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

export const CAMPAIGN_STATUS_LABELS = {
  draft: 'Draft',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  archived: 'Archived',
} as const;

export const CAMPAIGN_STATUS_COLORS = {
  draft: 'default',
  active: 'success',
  paused: 'warning',
  completed: 'info',
  archived: 'error',
} as const;

export const AD_TYPE_LABELS = {
  banner: 'Banner',
  native: 'Native',
  video: 'Video',
} as const;

export const USER_ROLE_LABELS = {
  admin: 'Admin',
  advertiser: 'Advertiser',
  viewer: 'Viewer',
} as const;
