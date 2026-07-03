import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import type { NotificationCenterProps } from '@adtech/types';

export function NotificationCenter({ items, onMarkAllRead }: NotificationCenterProps) {
  return (
    <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', maxWidth: 380 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1">Notifications</Typography>
        {onMarkAllRead && (
          <Button size="small" onClick={onMarkAllRead}>
            Mark all read
          </Button>
        )}
      </Box>
      <List disablePadding>
        {items.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              bgcolor: item.unread ? 'action.hover' : 'transparent',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: `${item.severity ?? 'info'}.main`, width: 34, height: 34 }} />
            </ListItemAvatar>
            <ListItemText primary={item.title} secondary={item.description} />
            {item.time && (
              <Typography variant="caption" color="text.secondary">
                {item.time}
              </Typography>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
