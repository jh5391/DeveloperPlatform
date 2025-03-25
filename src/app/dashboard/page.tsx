"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h6">로딩 중...</Typography>
      </Box>
    );
  }

  const stats = [
    { title: "총 방문자", value: "1,234" },
    { title: "활성 사용자", value: "789" },
    { title: "오늘의 방문", value: "123" },
    { title: "평균 체류 시간", value: "5분" },
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* 사용자 프로필 카드 */}
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Stack spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "primary.main",
                      mb: 2,
                    }}
                  >
                    {session?.user?.name?.[0] || "U"}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {session?.user?.name || "사용자"}
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    color="text.secondary"
                  >
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2">
                      {session?.user?.email}
                    </Typography>
                  </Box>
                  <Divider sx={{ width: "100%", my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    마지막 로그인: 방금 전
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* 통계 카드들 */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card elevation={2}>
                    <CardContent>
                      <Typography
                        color="text.secondary"
                        gutterBottom
                        variant="subtitle2"
                      >
                        {stat.title}
                      </Typography>
                      <Typography variant="h4">{stat.value}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* 활동 내역 카드 */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  최근 활동
                </Typography>
                <Typography color="text.secondary">
                  아직 기록된 활동이 없습니다.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 