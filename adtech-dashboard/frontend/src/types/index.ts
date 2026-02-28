// Domain types matching backend models

export type UserRole = 'admin' | 'advertiser' | 'viewer';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export interface Targeting {
  countries?: string[];
  devices?: string[];
  age_range?: { min: number; max: number };
}

export interface Campaign {
  id: number;
  user_id: number;
  name: string;
  description: string;
  budget: number;
  daily_budget: number;
  spent: number;
  status: CampaignStatus;
  targeting: Targeting;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export type AdType = 'banner' | 'native' | 'video';

export interface Ad {
  id: number;
  campaign_id: number;
  name: string;
  ad_type: AdType;
  content_url: string;
  destination_url: string;
  is_active: boolean;
  created_at: string;
}

export type EventType = 'impression' | 'click' | 'conversion';

export interface AdEvent {
  id: number;
  ad_id: number;
  campaign_id: number;
  event_type: EventType;
  country: string;
  device: string;
  cost: number;
  created_at: string;
}

export interface CampaignMetrics {
  campaign_id: number;
  period: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
}

export interface DashboardOverview {
  total_campaigns: number;
  active_campaigns: number;
  total_spend: number;
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  avg_ctr: number;
  avg_cpc: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// Auth types
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}
