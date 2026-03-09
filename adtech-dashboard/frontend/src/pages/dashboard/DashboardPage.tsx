import { useEffect, useMemo } from "react";
import useWebSocket from "@/hooks/useWebSocket";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setSelectedCampaign } from "@/features/dashboard/dashboardSlice";
import {
  useGetDashboardOverviewQuery,
  useGetMetricsQuery,
} from "@/features/metrics/metricsApi";
import { useGetCampaignsQuery } from "@/features/campaigns/campaignApi";
import { Grid, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import {
  PageHeader,
  StatCard,
  ChartCard,
  TextMuted,
} from "../../components/ui";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CampaignIcon from "@mui/icons-material/Campaign";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import TouchAppIcon from "@mui/icons-material/TouchApp";

import {
  PerformanceTrendChart,
  LiveEventsChart,
  DeviceDistributionChart,
  CountryTrafficChart,
} from "@/components/charts";

export default function DashboardPage() {
  useDocumentTitle("Dashboard");

  // Campaign selector state from Redux
  const dispatch = useAppDispatch();
  const selectedCampaignId = useAppSelector(
    (state) => state.dashboard.selectedCampaignId,
  );

  // WebSocket for live events
  const { status, messages: wsMessages } = useWebSocket();

  // Default date range: last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // Dashboard data
  const { data: overview } = useGetDashboardOverviewQuery();

  // Campaigns list for selector
  const { data: campaignsData } = useGetCampaignsQuery({ limit: 100 });
  const campaigns = campaignsData?.data ?? [];

  // Set default campaign (first one) if none selected
  useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaignId) {
      dispatch(setSelectedCampaign(campaigns[0].id));
    }
  }, [campaigns, selectedCampaignId, dispatch]);

  // Performance data - only fetch when campaign is selected
  const { data: metrics, isLoading } = useGetMetricsQuery(
    {
      campaignId: selectedCampaignId as number,
      granularity: "daily",
      from: formatDate(thirtyDaysAgo),
      to: formatDate(today),
    },
    { skip: !selectedCampaignId },
  );

  const renderingPerformanceChart = () => {
    if (!selectedCampaignId)
      return <TextMuted>Select a campaign to view metrics</TextMuted>;

    if (isLoading) return <TextMuted>Chart is rendering</TextMuted>;

    if (!metrics || metrics?.length === 0)
      return <TextMuted>No data available</TextMuted>;

    return <PerformanceTrendChart data={metrics} height={300} />;
  };

  const campaignSelector = (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Campaign</InputLabel>
      <Select
        value={selectedCampaignId ?? ""}
        label="Campaign"
        onChange={(e) => dispatch(setSelectedCampaign(e.target.value as number))}
      >
        {campaigns.map((campaign) => (
          <MenuItem key={campaign.id} value={campaign.id}>
            {campaign.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderLiveEventsChart = () => {
    if (status === "connecting") return <TextMuted>Connecting...</TextMuted>;
    if (status === "error") return <TextMuted>Connection error</TextMuted>;
    if (wsMessages.length === 0)
      return <TextMuted>Waiting for events...</TextMuted>;

    return <LiveEventsChart messages={wsMessages} height={300} />;
  };

  const stats = useMemo(
    () => [
      {
        label: "Active Campaigns",
        value: overview?.activeCampaigns ?? "—",
        icon: <CampaignIcon />,
        color: "#1976d2",
      },
      {
        label: "Total Impressions",
        value: overview?.totalImpressions.toLocaleString() ?? "—",
        icon: <TrendingUpIcon />,
        color: "#16a34a",
      },
      {
        label: "Total Clicks",
        value: overview?.totalClicks.toLocaleString() ?? "—",
        icon: <TouchAppIcon />,
        color: "#f59e0b",
      },
      {
        label: "Total Spend",
        value: overview
          ? `$${overview.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : "—",
        icon: <MonetizationOnIcon />,
        color: "#7c3aed",
      },
    ],
    [overview],
  );

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your ad campaigns" />

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} mt={1}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ChartCard
            title="Performance Trend"
            subtitle="Last 30 days"
            action={campaignSelector}
          >
            {renderingPerformanceChart()}
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ChartCard
            title="Live Events"
            subtitle={status === "connected" ? "Real-time" : status}
          >
            {renderLiveEventsChart()}
          </ChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={1}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Traffic by Device">
            {overview?.trafficByDevice ? (
              <DeviceDistributionChart
                data={overview.trafficByDevice}
                height={250}
              />
            ) : (
              <TextMuted>Loading...</TextMuted>
            )}
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard title="Traffic by Country">
            {overview?.trafficByCountry ? (
              <CountryTrafficChart
                data={overview.trafficByCountry}
                height={250}
              />
            ) : (
              <TextMuted>Loading...</TextMuted>
            )}
          </ChartCard>
        </Grid>
      </Grid>
    </>
  );
}
