import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import {
  useGetCampaignByIdQuery,
  useDeleteCampaignMutation,
} from "@/features/campaigns/campaignApi";
import { useGetMetricsQuery } from "@/features/metrics/metricsApi";
import { toast } from "@/store/toastStore";
import {
  Box,
  IconButton,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  InfoRow,
  ChartCard,
  TextMuted,
  ConfirmDialog,
} from "../../../components/ui";
import { PerformanceTrendChart } from "@/components/charts";
import { CampaignDetailSkeleton } from "./CampaignDetailSkeleton";
import { CAMPAIGN_STATUS_COLORS, ROUTES } from "../../../constants";
import { formatCurrency, formatDate } from "../../../utils/format";
import type { CampaignStatus } from "../../../types";

// Helper to format date for API (YYYY-MM-DD)
const toApiDate = (date: Date) => date.toISOString().split("T")[0];

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useDocumentTitle(`Campaign #${id}`);

  const { data: detailCampaign, isLoading } = useGetCampaignByIdQuery(id!);
  const [deleteCampaign, { isLoading: isDeleting }] =
    useDeleteCampaignMutation();

  // Default date range: last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const { data: metrics, isLoading: isLoadingMetrics } = useGetMetricsQuery(
    {
      campaignId: Number(id),
      granularity: "daily",
      from: toApiDate(thirtyDaysAgo),
      to: toApiDate(today),
    },
    { skip: !id },
  );

  const campaign = detailCampaign?.data;

  const handleBack = () => navigate(-1);
  const handleEdit = () => navigate(`/campaigns/${id}/edit`);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCampaign(Number(id)).unwrap();
      toast.success("Campaign deleted successfully");
      navigate(ROUTES.CAMPAIGNS);
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      toast.error("Failed to delete campaign");
    }
  };

  const budgetPercentage = campaign
    ? Math.round((campaign.spent / campaign.budget) * 100)
    : 0;

  // Calculate stats from metrics
  const stats = useMemo(() => {
    if (!metrics?.length) {
      return [
        { label: "Impressions", value: "0" },
        { label: "Clicks", value: "0" },
        { label: "Conversions", value: "0" },
        { label: "CTR", value: "0%" },
      ];
    }

    const totals = metrics.reduce(
      (acc, m) => ({
        impressions: acc.impressions + m.impressions,
        clicks: acc.clicks + m.clicks,
        conversions: acc.conversions + m.conversions,
      }),
      { impressions: 0, clicks: 0, conversions: 0 },
    );

    const ctr =
      totals.impressions > 0
        ? ((totals.clicks / totals.impressions) * 100).toFixed(2)
        : "0";

    return [
      { label: "Impressions", value: totals.impressions.toLocaleString() },
      { label: "Clicks", value: totals.clicks.toLocaleString() },
      { label: "Conversions", value: totals.conversions.toLocaleString() },
      { label: "CTR", value: `${ctr}%` },
    ];
  }, [metrics]);

  if (isLoading) {
    return <CampaignDetailSkeleton />;
  }

  if (!campaign) {
    return (
      <Box>
        <Typography>Campaign not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <IconButton onClick={handleBack} sx={{ ml: -1, mb: 1 }}>
            <ArrowBackIcon />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Back to campaigns
            </Typography>
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h4">{campaign.name}</Typography>
            <Chip
              label={campaign.status}
              color={CAMPAIGN_STATUS_COLORS[campaign.status as CampaignStatus]}
              size="small"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {campaign.description}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h5" sx={{ mt: 1 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Performance Chart */}
      <ChartCard title="Performance" subtitle="Last 30 days">
        {isLoadingMetrics ? (
          <TextMuted>Loading chart...</TextMuted>
        ) : !metrics?.length ? (
          <TextMuted>No data available</TextMuted>
        ) : (
          <PerformanceTrendChart data={metrics} height={300} />
        )}
      </ChartCard>

      {/* Campaign Info & Budget Cards */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Campaign Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Campaign Info
              </Typography>

              <InfoRow label="Name" value={campaign.name} />
              <InfoRow label="Description" value={campaign.description} />
              <InfoRow
                label="Target Countries"
                value={campaign.targeting?.countries?.join(", ") || "All"}
              />
              <InfoRow
                label="Target Devices"
                value={campaign.targeting?.devices?.join(", ") || "All"}
              />
              <InfoRow label="Created" value={formatDate(campaign.created_at)} />
              <InfoRow label="Last Updated" value={formatDate(campaign.updated_at)} />
            </CardContent>
          </Card>
        </Grid>

        {/* Budget & Dates */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Budget & Schedule
              </Typography>

              <InfoRow
                label="Total Budget"
                value={formatCurrency(campaign.budget)}
              />
              <InfoRow
                label="Daily Budget"
                value={formatCurrency(campaign.daily_budget)}
              />

              <Box sx={{ my: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Spent
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(campaign.spent)} ({budgetPercentage}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={budgetPercentage}
                  sx={{ height: 8, borderRadius: 1 }}
                  color={budgetPercentage > 90 ? "error" : "primary"}
                />
              </Box>

              <InfoRow label="Start Date" value={formatDate(campaign.start_date)} />
              <InfoRow label="End Date" value={formatDate(campaign.end_date)} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaign.name}"? This action cannot be undone.`}
        confirmText="Delete"
        severity="error"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
}
