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

// 타입 정의
type RoleData = {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

type GroupData = {
  id: string;
  name: string;
  description?: string;
  roles: Role[];
  attributes?: Record<string, string | boolean | number>;
}

type PolicyData = {
  id: string;
  name: string;
  effect: "allow" | "deny";
  priority: number;
}

// 공통 컴포넌트
type ActionButtonsProps = {
  onEdit: () => void;
  onDelete: () => void;
}

const ActionButtons = ({ onEdit, onDelete }: ActionButtonsProps) => (
  <>
    <Button size="small" startIcon={<EditIcon />} onClick={onEdit}>
      수정
    </Button>
    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={onDelete}>
      삭제
    </Button>
  </>
);

type SectionHeaderProps = {
  title: string;
  onAdd: () => void;
}

const SectionHeader = ({ title, onAdd }: SectionHeaderProps) => (
  <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
    <Typography variant="h6">{title}</Typography>
    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={onAdd}>
      {title.includes("역할") ? "역할 추가" : title.includes("그룹") ? "그룹 추가" : "정책 추가"}
    </Button>
  </Box>
);

// 역할 관리 컴포넌트
function RoleList() {
  const roles: RoleData[] = [
    {
      id: "admin",
      name: "관리자",
      description: "시스템 관리자 역할",
      permissions: [{ 
        action: "read" as ActionType, 
        resource: { type: "page" as ResourceType, id: "*" } 
      }],
    },
    {
      id: "manager",
      name: "매니저",
      description: "부서 매니저 역할",
      permissions: [{ 
        action: "read" as ActionType, 
        resource: { type: "page" as ResourceType, id: "dashboard" } 
      }],
    },
    {
      id: "user",
      name: "일반 사용자",
      description: "기본 사용자 역할",
      permissions: [{ 
        action: "read" as ActionType, 
        resource: { type: "page" as ResourceType, id: "dashboard" } 
      }],
    },
  ];

  const [open, setOpen] = useState(false);
  const [editRole, setEditRole] = useState<RoleData | null>(null);

  const handleOpenDialog = (role?: RoleData) => {
    setEditRole(role || null);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditRole(null);
  };

  const handleDelete = (roleId: string) => {
    // 삭제 로직 구현
    console.log(`역할 삭제: ${roleId}`);
  };

  return (
    <>
      <SectionHeader title="역할 관리" onAdd={() => handleOpenDialog()} />
      
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
                  <ActionButtons 
                    onEdit={() => handleOpenDialog(role)} 
                    onDelete={() => handleDelete(role.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <RoleDialog 
        open={open} 
        role={editRole} 
        onClose={handleCloseDialog} 
      />
    </>
  );
}

type RoleDialogProps = {
  open: boolean;
  role: RoleData | null;
  onClose: () => void;
}

function RoleDialog({ open, role, onClose }: RoleDialogProps) {
  const handleSave = () => {
    // 저장 로직 구현
    onClose();
  };

  const handleAddPermission = () => {
    // 새 권한 추가 로직
    console.log("권한 추가");
  };

  const handleDeletePermission = (index: number) => {
    // 권한 삭제 로직
    console.log(`권한 삭제: ${index}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{role ? "역할 편집" : "새 역할 추가"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="역할 이름"
            defaultValue={role?.name}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="설명"
            defaultValue={role?.description}
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
                {(role?.permissions || []).map((permission, index) => (
                  <TableRow key={index}>
                    <TableCell>{permission.action}</TableCell>
                    <TableCell>{permission.resource.type}</TableCell>
                    <TableCell>{permission.resource.id}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeletePermission(index)}
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
            onClick={handleAddPermission}
          >
            권한 추가
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={handleSave}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// 그룹 관리 컴포넌트
function GroupList() {
  const groups: GroupData[] = [
    {
      id: "group-it",
      name: "IT 부서",
      description: "IT 부서 구성원",
      roles: [] as Role[],
      attributes: { department: "IT" },
    },
    {
      id: "group-hr",
      name: "인사 부서",
      description: "인사 부서 구성원",
      roles: [] as Role[],
      attributes: { department: "HR" },
    },
    {
      id: "group-developers",
      name: "개발자 그룹",
      description: "개발 팀원",
      roles: [] as Role[],
      attributes: { position: "Developer" },
    },
  ];

  const handleAddGroup = () => {
    // 그룹 추가 로직
    console.log("그룹 추가");
  };

  const handleEditGroup = (groupId: string) => {
    // 그룹 편집 로직
    console.log(`그룹 편집: ${groupId}`);
  };

  const handleDeleteGroup = (groupId: string) => {
    // 그룹 삭제 로직
    console.log(`그룹 삭제: ${groupId}`);
  };

  return (
    <>
      <SectionHeader title="그룹 관리" onAdd={handleAddGroup} />
      
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
                  <ActionButtons 
                    onEdit={() => handleEditGroup(group.id)} 
                    onDelete={() => handleDeleteGroup(group.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

// 정책 관리 컴포넌트
function PolicyList() {
  const policies: PolicyData[] = [
    {
      id: "admin-full-access",
      name: "관리자 전체 접근 권한",
      effect: "allow",
      priority: 100,
    },
    {
      id: "developer-feature-access",
      name: "개발자 기능 접근 권한",
      effect: "allow",
      priority: 80,
    },
    {
      id: "region-restriction",
      name: "지역 접근 제한",
      effect: "deny",
      priority: 110,
    },
  ];

  const handleAddPolicy = () => {
    // 정책 추가 로직
    console.log("정책 추가");
  };

  const handleEditPolicy = (policyId: string) => {
    // 정책 편집 로직
    console.log(`정책 편집: ${policyId}`);
  };

  const handleDeletePolicy = (policyId: string) => {
    // 정책 삭제 로직
    console.log(`정책 삭제: ${policyId}`);
  };

  return (
    <>
      <SectionHeader title="정책 관리" onAdd={handleAddPolicy} />
      
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
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell>{policy.id}</TableCell>
                <TableCell>{policy.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={policy.effect === "allow" ? "허용" : "거부"} 
                    color={policy.effect === "allow" ? "success" : "error"} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{policy.priority}</TableCell>
                <TableCell>
                  <ActionButtons 
                    onEdit={() => handleEditPolicy(policy.id)} 
                    onDelete={() => handleDeletePolicy(policy.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

// 메인 컴포넌트
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