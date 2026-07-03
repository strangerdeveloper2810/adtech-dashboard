import apiSlice from "@/app/api";
import type {
  Campaign,
  CampaignListParams,
  PaginatedResponse,
  CreateCampaignInput,
  UpdateCampaignInput,
} from "@adtech/types";

// Backend response structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

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
    // GET /campaigns - List campaigns
    getCampaigns: builder.query<
      PaginatedResponse<Campaign>,
      CampaignListParams
    >({
      query: (params) => ({
        url: "/campaigns",
        params,
      }),
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

    // GET /campaigns/:id - Get single campaign
    getCampaignById: builder.query<
      { success: boolean; data: Campaign },
      string
    >({
      query: (id) => `/campaigns/${id}`,
      transformResponse: (response: ApiResponse<Campaign>) => ({
        success: response.success,
        data: response.data,
      }),
      providesTags: (_result, _error, id) => [{ type: "Campaign", id }],
    }),

    // POST /campaigns - Create campaign
    createCampaign: builder.mutation<Campaign, CreateCampaignInput>({
      query: (body) => ({
        url: "/campaigns",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Campaign>) => response.data,
      invalidatesTags: [{ type: "Campaign", id: "LIST" }],
    }),

    // PUT /campaigns/:id - Update campaign
    updateCampaign: builder.mutation<Campaign, UpdateCampaignInput>({
      query: ({ id, ...body }) => ({
        url: `/campaigns/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<Campaign>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Campaign", id },
        { type: "Campaign", id: "LIST" },
      ],
    }),

    // DELETE /campaigns/:id - Delete campaign
    deleteCampaign: builder.mutation<void, number>({
      query: (id) => ({
        url: `/campaigns/${id}`,
        method: "DELETE",
      }),
      // Only invalidate LIST - don't invalidate the deleted campaign's tag
      // as it will trigger a refetch of a non-existent resource
      invalidatesTags: [{ type: "Campaign", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} = campaignApi;
