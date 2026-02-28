import { useParams } from 'react-router';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { Typography } from '@mui/material';
import { PageHeader } from '../../../components/ui';

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  useDocumentTitle(`Campaign #${id}`);

  return (
    <>
      <PageHeader title={`Campaign #${id}`} subtitle="Campaign details and analytics" />
      <Typography color="text.secondary">Campaign detail coming soon.</Typography>
    </>
  );
}
