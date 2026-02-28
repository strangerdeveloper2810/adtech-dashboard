import { apiSlice } from '../../app/api';
import type {
  ApiResponse,
  PaginatedResponse,
  Campaign,
  CampaignStatus,
  CampaignListParams,
} from '../../types';

export const campaignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query<PaginatedResponse<Campaign>, CampaignListParams>({
      query: (params) => ({
        url: '/campaigns',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Campaign' as const, id })),
              { type: 'Campaign', id: 'LIST' },
            ]
          : [{ type: 'Campaign', id: 'LIST' }],
    }),

    getCampaign: builder.query<ApiResponse<Campaign>, number>({
      query: (id) => `/campaigns/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Campaign', id }],
    }),

    createCampaign: builder.mutation<ApiResponse<Campaign>, Partial<Campaign>>({
      query: (data) => ({
        url: '/campaigns',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Campaign', id: 'LIST' }],
    }),

    updateCampaignStatus: builder.mutation<
      ApiResponse<{ message: string }>,
      { id: number; status: CampaignStatus }
    >({
      query: ({ id, status }) => ({
        url: `/campaigns/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Campaign', id },
        { type: 'Campaign', id: 'LIST' },
      ],
    }),

    deleteCampaign: builder.mutation<ApiResponse<{ message: string }>, number>({
      query: (id) => ({
        url: `/campaigns/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Campaign', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignStatusMutation,
  useDeleteCampaignMutation,
} = campaignApi;
