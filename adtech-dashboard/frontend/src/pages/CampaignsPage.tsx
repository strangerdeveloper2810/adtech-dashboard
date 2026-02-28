import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router';
import { useGetCampaignsQuery } from '../features/campaigns/campaignApi';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { CampaignStatus } from '../types';

const statusColors: Record<CampaignStatus, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
  draft: 'default',
  active: 'success',
  paused: 'warning',
  completed: 'info',
  archived: 'error',
};

export default function CampaignsPage() {
  useDocumentTitle('Campaigns');
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetCampaignsQuery({
    page: page + 1,
    limit: rowsPerPage,
    search: search || undefined,
  });

  const campaigns = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Campaigns</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/campaigns/new')}
        >
          New Campaign
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            placeholder="Search campaigns..."
            size="small"
            sx={{ mb: 2, width: 300 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Budget</TableCell>
                  <TableCell align="right">Spent</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No campaigns found
                    </TableCell>
                  </TableRow>
                ) : (
                  campaigns.map((campaign) => (
                    <TableRow key={campaign.id} hover>
                      <TableCell>{campaign.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={campaign.status}
                          color={statusColors[campaign.status]}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        ${campaign.budget.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        ${campaign.spent.toLocaleString()}
                      </TableCell>
                      <TableCell>{campaign.start_date}</TableCell>
                      <TableCell>{campaign.end_date}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/campaigns/${campaign.id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
