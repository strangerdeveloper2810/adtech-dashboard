import { useParams, useNavigate } from "react-router";
import { useDocumentTitle } from "@adtech/hooks";
import {
  useGetCampaignByIdQuery,
  useUpdateCampaignMutation,
} from "@/features/campaigns/campaignApi";
import { Box, IconButton, Typography, Skeleton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CampaignForm, type CampaignFormValues } from "./CampaignForm";
import { toast } from "@adtech/ui";

export default function CampaignEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useDocumentTitle(`Edit Campaign #${id}`);

  const { data: detailCampaign, isLoading } = useGetCampaignByIdQuery(id!);
  const [updateCampaign, { isLoading: isUpdating }] =
    useUpdateCampaignMutation();

  const campaign = detailCampaign?.data;

  const handleBack = () => navigate(-1);

  const handleSubmit = async (data: CampaignFormValues) => {
    try {
      await updateCampaign({
        id: Number(id),
        name: data.name,
        description: data.description || "",
        budget: data.budget,
        dailyBudget: data.daily_budget,
        status: data.status,
        startDate: data.start_date,
        endDate: data.end_date,
        targeting: data.targeting,
      }).unwrap();

      toast.success("Campaign updated successfully");
      navigate(`/campaigns/${id}`);
    } catch (error) {
      console.error("Failed to update campaign:", error);
      toast.error("Failed to update campaign");
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Skeleton width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
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
      <Box sx={{ mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ ml: -1, mb: 1 }}>
          <ArrowBackIcon />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Back to campaign
          </Typography>
        </IconButton>

        <Typography variant="h4">Edit Campaign</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Update details for "{campaign.name}"
        </Typography>
      </Box>

      {/* Form */}
      <CampaignForm
        defaultValues={campaign}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        submitLabel="Save Changes"
      />
    </Box>
  );
}
