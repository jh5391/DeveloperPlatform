import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { text: '대시보드', icon: <DashboardIcon />, path: '/dashboard' },
  { text: '프로필', icon: <PersonIcon />, path: '/dashboard/profile' },
  { text: '설정', icon: <SettingsIcon />, path: '/dashboard/settings' },
];

// 관리자 전용 메뉴 항목
const adminMenuItems = [
  { 
    text: '권한 관리', 
    icon: <SecurityIcon />, 
    path: '/dashboard/permissions', 
    resource: 'page:permissions'
  },
];

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { can } = useAuth();

  // 사용자의 권한에 따라 관리자 메뉴를 필터링합니다
  const filteredAdminMenuItems = adminMenuItems.filter(
    (item) => can('access', item.resource)
  );

  const drawer = (
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
      
      {/* 관리자 전용 메뉴 - 권한이 있는 항목만 표시 */}
      {filteredAdminMenuItems.length > 0 && filteredAdminMenuItems.map((item) => (
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
    </List>
  );

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
} 