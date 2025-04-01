"use client";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from "@mui/material";
import { PermissionGuard } from "@/context/AuthContext";

export default function SettingsPage() {  
  return (
    <PermissionGuard 
      action="access" 
      resource="page:settings"
      fallback={
        <Box sx={{ py: 4 }}>
          <Container maxWidth="lg">
            <Alert severity="error">
              이 페이지에 접근할 권한이 없습니다. 관리자 계정이 필요합니다.
            </Alert>
          </Container>
        </Box>
      }
    >
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            설정
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    개인 정보
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="이메일"
                        defaultValue="user@example.com"
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="이름"
                        defaultValue="사용자"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" color="primary">
                        정보 저장
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    알림 설정
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="이메일 알림 허용"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                    중요 업데이트 및 보안 알림을 이메일로 받습니다.
                  </Typography>
                  
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="푸시 알림 허용"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                    앱에서 푸시 알림을 받습니다.
                  </Typography>
                  
                  <Button variant="contained" color="primary">
                    설정 저장
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PermissionGuard>
  );
} 