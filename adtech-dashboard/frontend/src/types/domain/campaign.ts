export type CampaignStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "archived";

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
  totalCampaigns: number;
  activeCampaigns: number;
  totalEvents: number;
  totalImpressions: number;
  totalClicks: number;
  totalSpend: number;
  averageCtr: number;
  trafficByDevice: { device: string; count: number }[];
  trafficByCountry: { country: string; count: number }[];
}

export interface CampaignListParams {
  page?: number;
  limit?: number;
  status?: CampaignStatus;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// Input types for mutations (camelCase to match backend API)
export interface CreateCampaignInput {
  name: string;
  description: string;
  budget: number;
  dailyBudget: number;
  status?: CampaignStatus;
  targeting?: Targeting;
  startDate: string;
  endDate: string;
}

export interface UpdateCampaignInput extends Partial<CreateCampaignInput> {
  id: number;
}
