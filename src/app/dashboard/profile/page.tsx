"use client";

import { useSession } from "next-auth/react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import { Email as EmailIcon } from "@mui/icons-material";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          프로필 설정
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Stack spacing={3} alignItems="center">
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: "primary.main",
                    }}
                  >
                    {session?.user?.name?.[0] || "U"}
                  </Avatar>
                  <Button variant="outlined" color="primary">
                    프로필 사진 변경
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card elevation={2}>
              <CardContent>
                <Stack spacing={3}>
                  <Typography variant="h6">기본 정보</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="이름"
                        defaultValue={session?.user?.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="이메일"
                        defaultValue={session?.user?.email}
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary">
                      변경사항 저장
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 