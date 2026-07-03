import apiSlice from "@/app/api";
import type {
  ApiResponse,
  CampaignMetrics,
  MetricParams,
  DashboardOverview,
} from "@adtech/types";

const metricApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverview, void>({
      query: () => ({
        url: "/dashboard/overview",
      }),
      transformResponse: (response: ApiResponse<DashboardOverview>) =>
        response.data,
      providesTags: ["Metrics"],
    }),
    getMetrics: builder.query<CampaignMetrics[], MetricParams>({
      query: ({ campaignId, from, to, granularity }) => ({
        url: "/metrics",
        params: { campaignId, from, to, granularity },
      }),
      transformResponse: (response: ApiResponse<CampaignMetrics[]>) =>
        response.data,
      providesTags: (_result, _error, { campaignId }) => [
        { type: "Metrics", id: campaignId },
      ],
    }),
  }),
});

export const { useGetDashboardOverviewQuery, useGetMetricsQuery } = metricApi;
