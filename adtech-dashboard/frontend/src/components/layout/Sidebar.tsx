import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CampaignIcon from '@mui/icons-material/Campaign';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate, useLocation } from 'react-router';
import { useAppSelector } from '../../app/hooks';
import { useUIStore } from '../../store/uiStore';
import { DRAWER_WIDTH, ROUTES } from '../../constants';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
  { text: 'Campaigns', icon: <CampaignIcon />, path: ROUTES.CAMPAIGNS },
];

const adminItems = [
  { text: 'Users', icon: <PeopleIcon />, path: ROUTES.ADMIN_USERS },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transform: sidebarOpen ? 'none' : `translateX(-${DRAWER_WIDTH}px)`,
          transition: (theme) =>
            theme.transitions.create('transform', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname.startsWith(item.path)}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      {user?.role === 'admin' && (
        <>
          <Divider />
          <List>
            {adminItems.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname.startsWith(item.path)}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </>
      )}
    </Drawer>
  );
}
