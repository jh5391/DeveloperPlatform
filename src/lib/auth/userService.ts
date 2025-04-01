import { AuthUser, Role, Group, Permission } from "@/types/auth";

// 샘플 역할 데이터
const sampleRoles: Role[] = [
  {
    id: "role-admin",
    name: "관리자",
    description: "시스템 관리자 역할",
    permissions: [
      {
        action: "create",
        resource: { type: "data", id: "*" },
      },
      {
        action: "read",
        resource: { type: "data", id: "*" },
      },
      {
        action: "update",
        resource: { type: "data", id: "*" },
      },
      {
        action: "delete",
        resource: { type: "data", id: "*" },
      },
      {
        action: "access",
        resource: { type: "page", id: "*" },
      },
      {
        action: "execute",
        resource: { type: "feature", id: "*" },
      },
    ],
  },
  {
    id: "role-manager",
    name: "매니저",
    description: "부서 매니저 역할",
    permissions: [
      {
        action: "read",
        resource: { type: "data", id: "*" },
      },
      {
        action: "update",
        resource: { type: "data", id: "department" },
      },
      {
        action: "access",
        resource: { type: "page", id: "dashboard" },
      },
      {
        action: "access",
        resource: { type: "page", id: "analytics" },
      },
      {
        action: "access",
        resource: { type: "page", id: "settings" },
      },
    ],
  },
  {
    id: "role-user",
    name: "일반 사용자",
    description: "기본 사용자 역할",
    permissions: [
      {
        action: "read",
        resource: { type: "data", id: "public" },
      },
      {
        action: "access",
        resource: { type: "page", id: "dashboard" },
      },
      {
        action: "access",
        resource: { type: "page", id: "profile" },
      },
    ],
  },
  {
    id: "role-developer",
    name: "개발자",
    description: "개발자 역할",
    permissions: [
      {
        action: "read",
        resource: { type: "data", id: "code" },
      },
      {
        action: "update",
        resource: { type: "data", id: "code" },
      },
      {
        action: "execute",
        resource: { type: "feature", id: "codeReview" },
      },
      {
        action: "execute",
        resource: { type: "feature", id: "debugging" },
      },
    ],
  },
];

// 샘플 그룹 데이터
const sampleGroups: Group[] = [
  {
    id: "group-it",
    name: "IT 부서",
    description: "IT 부서 구성원",
    roles: [sampleRoles.find(r => r.id === "role-user")!],
    attributes: {
      department: "IT",
      canAccessServers: true,
    },
  },
  {
    id: "group-hr",
    name: "인사 부서",
    description: "인사 부서 구성원",
    roles: [sampleRoles.find(r => r.id === "role-user")!],
    attributes: {
      department: "HR",
      canAccessPersonnelFiles: true,
    },
  },
  {
    id: "group-developers",
    name: "개발자 그룹",
    description: "개발 팀원",
    roles: [
      sampleRoles.find(r => r.id === "role-user")!,
      sampleRoles.find(r => r.id === "role-developer")!,
    ],
    attributes: {
      department: "IT",
      position: "Developer",
    },
  },
  {
    id: "group-managers",
    name: "관리자 그룹",
    description: "부서 관리자",
    roles: [
      sampleRoles.find(r => r.id === "role-user")!,
      sampleRoles.find(r => r.id === "role-manager")!,
    ],
    attributes: {
      position: "Manager",
    },
  },
];

// 사용자 관리 서비스 클래스
export class UserService {
  private users: Map<string, AuthUser> = new Map();
  private roles: Map<string, Role> = new Map();
  private groups: Map<string, Group> = new Map();

  constructor() {
    // 샘플 역할 및 그룹 초기화
    sampleRoles.forEach((role) => this.roles.set(role.id, role));
    sampleGroups.forEach((group) => this.groups.set(group.id, group));
  }

  // 사용자 생성
  createUser(user: Partial<AuthUser>): AuthUser {
    if (!user.id) throw new Error("사용자 ID가 필요합니다.");
    
    // 기본 역할 및 그룹 할당
    const defaultRole = this.roles.get("role-user");
    const userRoles = user.roles || (defaultRole ? [defaultRole] : []);
    
    const newUser: AuthUser = {
      id: user.id,
      email: user.email || "",
      name: user.name,
      roles: userRoles,
      groups: user.groups || [],
      attributes: user.attributes || {},
    };

    this.users.set(user.id, newUser);
    return newUser;
  }

  // 사용자 조회
  getUser(userId: string): AuthUser | undefined {
    return this.users.get(userId);
  }

  // 사용자에게 역할 할당
  assignRoleToUser(userId: string, roleId: string): boolean {
    const user = this.users.get(userId);
    const role = this.roles.get(roleId);
    
    if (!user || !role) return false;
    
    if (!user.roles.some((r) => r.id === role.id)) {
      user.roles.push(role);
    }
    
    return true;
  }

  // 사용자에게 그룹 할당
  assignGroupToUser(userId: string, groupId: string): boolean {
    const user = this.users.get(userId);
    const group = this.groups.get(groupId);
    
    if (!user || !group) return false;
    
    if (!user.groups.some((g) => g.id === group.id)) {
      user.groups.push(group);
    }
    
    return true;
  }

  // 사용자 속성 업데이트
  updateUserAttributes(
    userId: string,
    attributes: Partial<AuthUser["attributes"]>
  ): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    
    user.attributes = {
      ...user.attributes,
      ...attributes,
    };
    
    return true;
  }

  // 사용자가 가진 모든 권한 조회 (역할 및 그룹에서)
  getAllUserPermissions(userId: string): Permission[] {
    const user = this.users.get(userId);
    if (!user) return [];
    
    const allPermissions: Permission[] = [];
    
    // 역할에서 권한 수집
    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        allPermissions.push(permission);
      });
    });
    
    // 그룹에서 권한 수집
    user.groups.forEach((group) => {
      group.roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          // 중복 권한은 추가하지 않음
          if (
            !allPermissions.some(
              (p) =>
                p.action === permission.action &&
                p.resource.type === permission.resource.type &&
                p.resource.id === permission.resource.id
            )
          ) {
            allPermissions.push(permission);
          }
        });
      });
    });
    
    return allPermissions;
  }

  // 역할 생성
  createRole(role: Partial<Role>): Role {
    if (!role.id) throw new Error("역할 ID가 필요합니다.");
    
    const newRole: Role = {
      id: role.id,
      name: role.name || role.id,
      description: role.description,
      permissions: role.permissions || [],
    };
    
    this.roles.set(role.id, newRole);
    return newRole;
  }

  // 역할 조회
  getRole(roleId: string): Role | undefined {
    return this.roles.get(roleId);
  }

  // 역할에 권한 추가
  addPermissionToRole(roleId: string, permission: Permission): boolean {
    const role = this.roles.get(roleId);
    if (!role) return false;
    
    // 중복 권한은 추가하지 않음
    if (
      !role.permissions.some(
        (p) =>
          p.action === permission.action &&
          p.resource.type === permission.resource.type &&
          p.resource.id === permission.resource.id
      )
    ) {
      role.permissions.push(permission);
    }
    
    return true;
  }

  // 그룹 생성
  createGroup(group: Partial<Group>): Group {
    if (!group.id) throw new Error("그룹 ID가 필요합니다.");
    
    const newGroup: Group = {
      id: group.id,
      name: group.name || group.id,
      description: group.description,
      roles: group.roles || [],
      attributes: group.attributes || {},
    };
    
    this.groups.set(group.id, newGroup);
    return newGroup;
  }

  // 그룹 조회
  getGroup(groupId: string): Group | undefined {
    return this.groups.get(groupId);
  }

  // 그룹에 역할 추가
  addRoleToGroup(groupId: string, roleId: string): boolean {
    const group = this.groups.get(groupId);
    const role = this.roles.get(roleId);
    
    if (!group || !role) return false;
    
    if (!group.roles.some((r) => r.id === role.id)) {
      group.roles.push(role);
    }
    
    return true;
  }

  // 그룹 속성 업데이트
  updateGroupAttributes(
    groupId: string,
    attributes: Record<string, string | boolean | number>
  ): boolean {
    const group = this.groups.get(groupId);
    if (!group) return false;
    
    group.attributes = {
      ...group.attributes,
      ...attributes,
    };
    
    return true;
  }
}

// 서비스 인스턴스 생성 및 내보내기
export const userService = new UserService(); 