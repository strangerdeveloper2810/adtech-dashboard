import { useState, type ReactNode } from "react";
import { Box, Stack, Typography, Button, Divider, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CampaignIcon from "@mui/icons-material/Campaign";
import AddIcon from "@mui/icons-material/Add";
import {
  PageContainer,
  PageHeader,
  Tabs,
  SegmentedControl,
  Stepper,
  FilterBar,
  DropdownMenu,
  Drawer,
  FormDialog,
  InfoPopover,
  CommandPalette,
  Combobox,
  TagInput,
  Slider,
  Dropzone,
  TextSkeleton,
  CardSkeleton,
  Banner,
  Accordion,
  NotificationCenter,
  ProgressMeter,
  RingMeter,
  KpiDelta,
  GeoDistribution,
  FormField,
} from "@adtech/ui";
import { useDocumentTitle } from "@adtech/hooks";
import { useForm } from "react-hook-form";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="overline" color="text.secondary">
        {title}
      </Typography>
      <Divider sx={{ mb: 2, mt: 0.5 }} />
      {children}
    </Box>
  );
}

export default function StyleguidePage() {
  useDocumentTitle("Styleguide");

  const [tab, setTab] = useState("overview");
  const [granularity, setGranularity] = useState("daily");
  const [filters, setFilters] = useState([
    { key: "status", label: "Status", value: "Active" },
    { key: "country", label: "Country", value: "Vietnam" },
  ]);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popAnchor, setPopAnchor] = useState<HTMLElement | null>(null);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [country, setCountry] = useState<string | null>("Vietnam");
  const [tags, setTags] = useState<string[]>(["Vietnam", "Singapore"]);
  const [budget, setBudget] = useState(1200);
  const [bannerOpen, setBannerOpen] = useState(true);

  const { register, formState: { errors } } = useForm<{ name: string }>();

  return (
    <PageContainer>
      <PageHeader
        title="Signal — Styleguide"
        subtitle="Live gallery of the @adtech/ui extended component library"
      />

      <Section title="Navigation · Tabs">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { label: "Overview", value: "overview", content: <Typography>Impressions, clicks and spend.</Typography> },
            { label: "Ads", value: "ads", content: <Typography>3 active ads · 1 in review.</Typography> },
            { label: "Settings", value: "settings", content: <Typography>Targeting, schedule & budget.</Typography> },
          ]}
        />
      </Section>

      <Section title="Navigation · Segmented control + Stepper">
        <Stack spacing={3}>
          <SegmentedControl
            value={granularity}
            onChange={setGranularity}
            options={[
              { label: "Hourly", value: "hourly" },
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ]}
          />
          <Stepper activeStep={2} steps={["Details", "Targeting", "Budget", "Review"]} />
        </Stack>
      </Section>

      <Section title="Navigation · Filter bar">
        <FilterBar
          filters={filters}
          onRemove={(key) => setFilters((f) => f.filter((x) => x.key !== key))}
          onAdd={() => setFilters((f) => [...f, { key: `k${f.length}`, label: "Device", value: "Mobile" }])}
        />
      </Section>

      <Section title="Overlay · Menu · Drawer · Dialog · Popover · Command palette">
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Button variant="outlined" onClick={(e) => setMenuAnchor(e.currentTarget)}>
            Actions ▾
          </Button>
          <DropdownMenu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            items={[
              { label: "Edit", icon: <EditIcon fontSize="small" />, onClick: () => {} },
              { label: "Duplicate", icon: <ContentCopyIcon fontSize="small" />, onClick: () => {} },
              { label: "Delete", icon: <DeleteIcon fontSize="small" />, danger: true, divider: true, onClick: () => {} },
            ]}
          />

          <Button variant="contained" onClick={() => setDrawerOpen(true)}>
            Open drawer
          </Button>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Quick edit">
            <FormField name="name" label="Daily budget" register={register} errors={errors} defaultValue="$1,200" />
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => setDrawerOpen(false)}>
              Save
            </Button>
          </Drawer>

          <Button variant="outlined" onClick={() => setDialogOpen(true)}>
            New campaign
          </Button>
          <FormDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="New campaign"
            actions={
              <>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={() => setDialogOpen(false)}>Create</Button>
              </>
            }
          >
            <FormField name="name" label="Campaign name" register={register} errors={errors} placeholder="Autumn launch" />
          </FormDialog>

          <Button variant="text" onClick={(e) => setPopAnchor(e.currentTarget)}>
            What is CTR?
          </Button>
          <InfoPopover
            anchorEl={popAnchor}
            open={Boolean(popAnchor)}
            onClose={() => setPopAnchor(null)}
            title="CTR"
          >
            Click-through rate = clicks ÷ impressions, over the selected window.
          </InfoPopover>

          <Button variant="outlined" onClick={() => setCmdkOpen(true)}>
            Command ⌘K
          </Button>
          <CommandPalette
            open={cmdkOpen}
            onClose={() => setCmdkOpen(false)}
            groups={[
              {
                label: "Navigate",
                items: [
                  { label: "Dashboard", icon: <DashboardIcon fontSize="small" />, onSelect: () => {} },
                  { label: "Campaigns", icon: <CampaignIcon fontSize="small" />, onSelect: () => {} },
                ],
              },
              {
                label: "Actions",
                items: [{ label: "New campaign", icon: <AddIcon fontSize="small" />, onSelect: () => {} }],
              },
            ]}
          />
        </Stack>
      </Section>

      <Section title="Form · Combobox · Tag input · Slider · Dropzone">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Combobox
                options={["Vietnam", "United States", "Singapore", "Japan", "Germany"]}
                value={country}
                onChange={setCountry}
                label="Country"
              />
              <TagInput value={tags} onChange={setTags} label="Targeting" placeholder="Add country…" />
              <Slider
                value={budget}
                onChange={setBudget}
                min={100}
                max={5000}
                step={50}
                label="Daily cap"
                formatValue={(v) => `$${v.toLocaleString()}`}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Dropzone onFiles={() => {}} hint="PNG, JPG or MP4 · up to 20MB" />
          </Grid>
        </Grid>
      </Section>

      <Section title="Data · Meters · KPI delta · Geo distribution">
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2}>
              <ProgressMeter value={62} label="Q3 Retargeting" />
              <ProgressMeter value={88} label="Summer Push" />
              <ProgressMeter value={97} label="Email Blast" />
            </Stack>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <RingMeter value={72} label="Goal" />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <KpiDelta value="2,481" delta={18.2} previous="2,099" label="Conversions" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <GeoDistribution
              data={[
                { flag: "🇻🇳", label: "Vietnam", value: 412 },
                { flag: "🇺🇸", label: "United States", value: 288 },
                { flag: "🇸🇬", label: "Singapore", value: 201 },
                { flag: "🇯🇵", label: "Japan", value: 128 },
              ]}
            />
          </Grid>
        </Grid>
      </Section>

      <Section title="Feedback · Banner · Accordion · Notifications · Skeletons">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              {bannerOpen && (
                <Banner severity="info" onClose={() => setBannerOpen(false)}>
                  <strong>New:</strong> geo heatmaps are now available in reports.
                </Banner>
              )}
              <Accordion
                defaultExpanded={0}
                items={[
                  { title: "What counts as an impression?", content: <Typography variant="body2">Rendered in the viewport for ≥1s.</Typography> },
                  { title: "How is CTR calculated?", content: <Typography variant="body2">Clicks ÷ impressions.</Typography> },
                ]}
              />
              <Stack spacing={2} direction="row">
                <Box sx={{ flex: 1 }}><CardSkeleton /></Box>
                <Box sx={{ flex: 1 }}><TextSkeleton lines={4} /></Box>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <NotificationCenter
              onMarkAllRead={() => {}}
              items={[
                { id: "1", title: "Campaign approved", description: "“Autumn Launch” is now live.", time: "2m", unread: true, severity: "success" },
                { id: "2", title: "Budget at 88%", description: "Summer Push is pacing fast.", time: "1h", unread: true, severity: "warning" },
                { id: "3", title: "Weekly report ready", description: "Your summary for last week.", time: "1d", severity: "info" },
              ]}
            />
          </Grid>
        </Grid>
      </Section>
    </PageContainer>
  );
}
