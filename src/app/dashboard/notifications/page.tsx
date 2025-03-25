"use client";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Badge,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const notifications = [
  {
    id: 1,
    title: "시스템 업데이트",
    message: "새로운 기능이 추가되었습니다.",
    time: "10분 전",
    read: false,
  },
  {
    id: 2,
    title: "보안 알림",
    message: "계정 보안을 위해 비밀번호를 변경해주세요.",
    time: "1시간 전",
    read: true,
  },
  {
    id: 3,
    title: "새로운 로그인",
    message: "새로운 기기에서 로그인이 감지되었습니다.",
    time: "2시간 전",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          알림
        </Typography>
        <Card elevation={2}>
          <CardContent>
            <List>
              {notifications.map((notification, index) => (
                <Box key={notification.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Badge
                        color="error"
                        variant="dot"
                        invisible={notification.read}
                      >
                        <Avatar>
                          <NotificationsIcon />
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: notification.read ? "normal" : "bold",
                          }}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {notification.message}
                          </Typography>
                          {" — "}
                          {notification.time}
                        </>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
} 