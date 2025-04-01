import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { PermissionGuard } from '@/context/AuthContext';

const menuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/dashboard' },
  { text: '프로필', icon: <PersonIcon />, path: '/dashboard/profile' },
  { text: '분석', icon: <AnalyticsIcon />, path: '/dashboard/analytics' },
  { text: '알림', icon: <NotificationsIcon />, path: '/dashboard/notifications' },
  { text: '설정', icon: <SettingsIcon />, path: '/dashboard/settings' },
];

// 관리자 전용 메뉴 항목
const adminMenuItems = [
  { text: '권한 관리', icon: <SecurityIcon />, path: '/dashboard/permissions' },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        height: '100vh',
        bgcolor: 'background.paper',
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: pathname === item.path ? 'inherit' : undefined }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* 관리자 전용 메뉴 */}
        <PermissionGuard action="access" resource="page:permissions">
          {adminMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => router.push(item.path)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: pathname === item.path ? 'inherit' : undefined }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </PermissionGuard>
      </List>
    </Box>
  );
} 