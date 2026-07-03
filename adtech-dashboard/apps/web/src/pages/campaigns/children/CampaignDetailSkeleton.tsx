import { Box, Grid, Skeleton } from "@mui/material";

export function CampaignDetailSkeleton() {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Skeleton width={150} height={24} />
        <Skeleton width={300} height={40} sx={{ mt: 1 }} />
      </Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Skeleton variant="rectangular" height={100} />
          </Grid>
        ))}
      </Grid>
      <Skeleton variant="rectangular" height={300} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton variant="rectangular" height={250} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton variant="rectangular" height={250} />
        </Grid>
      </Grid>
    </Box>
  );
}
