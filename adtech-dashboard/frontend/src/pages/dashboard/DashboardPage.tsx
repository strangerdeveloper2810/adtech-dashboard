import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Grid } from '@mui/material';
import { PageHeader, StatCard, ChartCard, TextMuted } from '../../components/ui';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CampaignIcon from '@mui/icons-material/Campaign';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TouchAppIcon from '@mui/icons-material/TouchApp';

const stats = [
  { label: 'Active Campaigns', value: '—', icon: <CampaignIcon />, color: '#1976d2' },
  { label: 'Total Impressions', value: '—', icon: <TrendingUpIcon />, color: '#16a34a' },
  { label: 'Total Clicks', value: '—', icon: <TouchAppIcon />, color: '#f59e0b' },
  { label: 'Total Spend', value: '—', icon: <MonetizationOnIcon />, color: '#7c3aed' },
];

export default function DashboardPage() {
  useDocumentTitle('Dashboard');

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
          <ChartCard title="Performance Trend" subtitle="Last 30 days">
            <TextMuted>Chart will be implemented with ECharts</TextMuted>
          </ChartCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ChartCard title="Top Campaigns" height={350}>
            <TextMuted>Coming soon</TextMuted>
          </ChartCard>
        </Grid>
      </Grid>
    </>
  );
}
