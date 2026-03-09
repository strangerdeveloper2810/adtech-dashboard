import apiSlice from "@/app/api";
import type { Campaign, CampaignListParams, PaginatedResponse } from "@/types";

// Backend response structure for paginated endpoints
interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const campaignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query<
      PaginatedResponse<Campaign>,
      CampaignListParams
    >({
      query: (params) => ({
        url: "/campaigns",
        params,
      }),
      // Transform response to match PaginatedResponse type
      transformResponse: (response: PaginatedApiResponse<Campaign>) => ({
        success: response.success,
        data: response.data,
        meta: response.meta,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Campaign" as const,
                id,
              })),
              { type: "Campaign", id: "LIST" },
            ]
          : [{ type: "Campaign", id: "LIST" }],
    }),
  }),
});

export const { useGetCampaignsQuery } = campaignApi;
