import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { campaignSchema } from "@/validation/campaign.validation";
import type { Campaign, CampaignStatus } from "@adtech/types";
import type { CampaignFormValues } from "@/validation/campaign.validation";

// Re-export for convenience
export type { CampaignFormValues };

interface CampaignFormProps {
  defaultValues?: Partial<Campaign>;
  onSubmit: (data: CampaignFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

const DEVICE_OPTIONS = ["desktop", "mobile", "tablet"];
const COUNTRY_OPTIONS = ["US", "UK", "CA", "AU", "DE", "FR", "JP"];

// Helper to format date for input (YYYY-MM-DD)
const toInputDate = (date?: string) => {
  if (!date) return "";
  return date.split("T")[0];
};

export function CampaignForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save",
}: CampaignFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema) as Resolver<CampaignFormValues>,
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      budget: defaultValues?.budget || 1000,
      daily_budget: defaultValues?.daily_budget || 100,
      status: defaultValues?.status || "draft",
      start_date: toInputDate(defaultValues?.start_date) || "",
      end_date: toInputDate(defaultValues?.end_date) || "",
      targeting: {
        countries: defaultValues?.targeting?.countries || [],
        devices: defaultValues?.targeting?.devices || [],
      },
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* Basic Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Basic Information
              </Typography>

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Campaign Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="start_date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Start Date"
                        type="date"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        error={!!errors.start_date}
                        helperText={errors.start_date?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="end_date"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="End Date"
                        type="date"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        error={!!errors.end_date}
                        helperText={errors.end_date?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Status & Budget */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Status
              </Typography>

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    fullWidth
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Budget
              </Typography>

              <Controller
                name="budget"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Total Budget ($)"
                    type="number"
                    fullWidth
                    error={!!errors.budget}
                    helperText={errors.budget?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Controller
                name="daily_budget"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Daily Budget ($)"
                    type="number"
                    fullWidth
                    error={!!errors.daily_budget}
                    helperText={errors.daily_budget?.message}
                  />
                )}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Targeting */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Targeting
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="targeting.countries"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Target Countries"
                        fullWidth
                        slotProps={{
                          select: { multiple: true },
                        }}
                        value={field.value || []}
                      >
                        {COUNTRY_OPTIONS.map((country) => (
                          <MenuItem key={country} value={country}>
                            {country}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="targeting.devices"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Target Devices"
                        fullWidth
                        slotProps={{
                          select: { multiple: true },
                        }}
                        value={field.value || []}
                      >
                        {DEVICE_OPTIONS.map((device) => (
                          <MenuItem key={device} value={device}>
                            {device.charAt(0).toUpperCase() + device.slice(1)}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Submit */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}
