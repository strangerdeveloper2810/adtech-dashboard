import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { Typography } from '@mui/material';
import { PageHeader } from '../../../components/ui';

export default function CampaignNewPage() {
  useDocumentTitle('New Campaign');

  return (
    <>
      <PageHeader title="New Campaign" subtitle="Create a new ad campaign" />
      <Typography color="text.secondary">Campaign form coming soon.</Typography>
    </>
  );
}
