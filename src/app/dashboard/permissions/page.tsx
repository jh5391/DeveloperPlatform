"use client";
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
  Stack,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { PermissionGuard } from "@/context/AuthContext";
import { Role, ResourceType, Permission, ActionType } from "@/types/auth";

// 타입 안전한 역할 인터페이스
interface RoleData {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

// 타입 안전한 그룹 인터페이스
interface GroupData {
  id: string;
  name: string;
  description?: string;
  roles: Role[];
  attributes?: Record<string, string | boolean | number>;
}

function RoleList() {
  const roles: RoleData[] = Array.from(
    new Map(
      [
        {
          id: "role-admin",
          name: "관리자",
          description: "시스템 관리자 역할",
          permissions: [{ 
            action: "read" as ActionType, 
            resource: { type: "page" as ResourceType, id: "dashboard" } 
          }],
        },
        {
          id: "role-manager",
          name: "매니저",
          description: "부서 매니저 역할",
          permissions: [{ 
            action: "read" as ActionType, 
            resource: { type: "page" as ResourceType, id: "dashboard" } 
          }],
        },
        {
          id: "role-user",
          name: "일반 사용자",
          description: "기본 사용자 역할",
          permissions: [{ 
            action: "read" as ActionType, 
            resource: { type: "page" as ResourceType, id: "dashboard" } 
          }],
        },
      ].map((role) => [role.id, role])
    ).values()
  );

  const [open, setOpen] = useState(false);
  const [editRole, setEditRole] = useState<RoleData | null>(null);

  const handleOpenDialog = (role?: RoleData) => {
    if (role) {
      setEditRole(role);
    } else {
      setEditRole(null);
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditRole(null);
  };

  return (
    <>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">역할 관리</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          역할 추가
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>역할</TableCell>
              <TableCell>설명</TableCell>
              <TableCell>권한 수</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>{role.permissions.length}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(role)}
                  >
                    수정
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      /* 삭제 로직 */
                    }}
                  >
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editRole ? "역할 편집" : "새 역할 추가"}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="역할 이름"
              defaultValue={editRole?.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="설명"
              defaultValue={editRole?.description}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              권한 목록
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>작업</TableCell>
                    <TableCell>리소스 타입</TableCell>
                    <TableCell>리소스 ID</TableCell>
                    <TableCell>작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(editRole?.permissions || []).map((permission, index) => (
                    <TableRow key={index}>
                      <TableCell>{permission.action}</TableCell>
                      <TableCell>{permission.resource.type}</TableCell>
                      <TableCell>{permission.resource.id}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                        >
                          삭제
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                /* 새 권한 추가 로직 */
              }}
            >
              권한 추가
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button variant="contained" onClick={handleCloseDialog}>
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function GroupList() {
  const groups: GroupData[] = Array.from(
    new Map(
      [
        {
          id: "group-it",
          name: "IT 부서",
          description: "IT 부서 구성원",
          roles: [] as Role[],
          attributes: { department: "IT" } as Record<string, string | boolean | number>,
        },
        {
          id: "group-hr",
          name: "인사 부서",
          description: "인사 부서 구성원",
          roles: [] as Role[],
          attributes: { department: "HR" } as Record<string, string | boolean | number>,
        },
        {
          id: "group-developers",
          name: "개발자 그룹",
          description: "개발 팀원",
          roles: [] as Role[],
          attributes: { position: "Developer" } as Record<string, string | boolean | number>,
        },
      ].map((group) => [group.id, group])
    ).values()
  );

  return (
    <>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">그룹 관리</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          그룹 추가
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>그룹</TableCell>
              <TableCell>설명</TableCell>
              <TableCell>소속 역할</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.description}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {group.roles.map((role) => (
                      <Chip
                        key={role.id}
                        label={role.name}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {group.roles.length === 0 && "없음"}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Button size="small" startIcon={<EditIcon />}>
                    수정
                  </Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />}>
                    삭제
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function PolicyList() {
  return (
    <>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">정책 관리</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          정책 추가
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>정책 ID</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>효과</TableCell>
              <TableCell>우선순위</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>admin-full-access</TableCell>
              <TableCell>관리자 전체 접근 권한</TableCell>
              <TableCell>
                <Chip label="허용" color="success" size="small" />
              </TableCell>
              <TableCell>100</TableCell>
              <TableCell>
                <Button size="small" startIcon={<EditIcon />}>
                  수정
                </Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />}>
                  삭제
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>developer-feature-access</TableCell>
              <TableCell>개발자 기능 접근 권한</TableCell>
              <TableCell>
                <Chip label="허용" color="success" size="small" />
              </TableCell>
              <TableCell>80</TableCell>
              <TableCell>
                <Button size="small" startIcon={<EditIcon />}>
                  수정
                </Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />}>
                  삭제
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>region-restriction</TableCell>
              <TableCell>지역 접근 제한</TableCell>
              <TableCell>
                <Chip label="거부" color="error" size="small" />
              </TableCell>
              <TableCell>110</TableCell>
              <TableCell>
                <Button size="small" startIcon={<EditIcon />}>
                  수정
                </Button>
                <Button size="small" color="error" startIcon={<DeleteIcon />}>
                  삭제
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default function PermissionsPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <PermissionGuard
      action="access"
      resource="page:permissions"
      fallback={
        <Box sx={{ py: 4 }}>
          <Container maxWidth="lg">
            <Alert severity="error">
              권한 관리 페이지에 접근할 수 없습니다. 관리자 권한이 필요합니다.
            </Alert>
          </Container>
        </Box>
      }
    >
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            권한 관리
          </Typography>
          <Card elevation={2}>
            <CardContent>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={{ mb: 3 }}
              >
                <Tab label="역할" />
                <Tab label="그룹" />
                <Tab label="정책" />
              </Tabs>

              {tabIndex === 0 && <RoleList />}
              {tabIndex === 1 && <GroupList />}
              {tabIndex === 2 && <PolicyList />}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </PermissionGuard>
  );
} 