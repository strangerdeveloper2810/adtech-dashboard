import { useNavigate } from "react-router";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useCreateCampaignMutation } from "@/features/campaigns/campaignApi";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CampaignForm, type CampaignFormValues } from "./CampaignForm";
import { toast } from "@/store/toastStore";

export default function CampaignNewPage() {
  useDocumentTitle("New Campaign");
  const navigate = useNavigate();

  const [createCampaign, { isLoading }] = useCreateCampaignMutation();

  const handleBack = () => navigate(-1);

  const handleSubmit = async (data: CampaignFormValues) => {
    try {
      const result = await createCampaign({
        name: data.name,
        description: data.description || "",
        budget: data.budget,
        dailyBudget: data.daily_budget,
        status: data.status,
        startDate: data.start_date,
        endDate: data.end_date,
        targeting: data.targeting,
      }).unwrap();

      toast.success("Campaign created successfully");
      navigate(`/campaigns/${result.id}`);
    } catch (error) {
      console.error("Failed to create campaign:", error);
      toast.error("Failed to create campaign");
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ ml: -1, mb: 1 }}>
          <ArrowBackIcon />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Back to campaigns
          </Typography>
        </IconButton>

        <Typography variant="h4">Create New Campaign</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Fill in the details to create a new ad campaign
        </Typography>
      </Box>

      {/* Form */}
      <CampaignForm
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        submitLabel="Create Campaign"
      />
    </Box>
  );
}
