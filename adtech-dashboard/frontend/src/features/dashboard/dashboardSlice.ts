import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  selectedCampaignId: number | null;
}

const initialState: DashboardState = {
  selectedCampaignId: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedCampaign: (state, action: PayloadAction<number | null>) => {
      state.selectedCampaignId = action.payload;
    },
  },
});

export const { setSelectedCampaign } = dashboardSlice.actions;
export default dashboardSlice.reducer;
