"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { ActionType, ResourceType, AuthUser, Role, AuthorizationResult, Group, UserAttributes } from "@/types/auth";
import authorizationService from "@/lib/auth/authorizationService";
import { PermissionGuard } from "@/components/guards/AuthGuards";

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  // 사용자 정보
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // 권한 관리 메서드
  checkPermission: (action: ActionType | string, resource: ResourceType | string, context?: Record<string, unknown>) => AuthorizationResult;
  can: (action: ActionType | string, resource: ResourceType | string, context?: Record<string, unknown>) => boolean;
  assignRole: (role: Role) => void;
  updateAttributes: (attributes: Record<string, unknown>) => void;
  getRoles: () => Role[];
  getGroups: () => Group[];
}

// 기본값으로 빈 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  checkPermission: () => ({ allowed: false, reason: "Context not initialized" }),
  can: () => false,
  assignRole: () => {},
  updateAttributes: () => {},
  getRoles: () => [],
  getGroups: () => []
});

// 사용자 역할 모의 데이터 (실제로는 API에서 가져올 것)
const mockRoles: Role[] = [
  {
    id: "user",
    name: "User",
    permissions: [
      {
        action: "read",
        resource: { type: "data", id: "user-profile" }
      }
    ]
  },
  {
    id: "admin",
    name: "Administrator",
    permissions: [
      {
        action: "read",
        resource: { type: "data", id: "*" }
      },
      {
        action: "update",
        resource: { type: "data", id: "*" }
      },
      {
        action: "create",
        resource: { type: "data", id: "*" }
      },
      {
        action: "delete",
        resource: { type: "data", id: "*" }
      }
    ]
  }
];

// 사용자 그룹 모의 데이터
const mockGroups: Group[] = [
  {
    id: "standard-users",
    name: "Standard Users",
    roles: [mockRoles[0]], // User 역할
    attributes: {
      accessLevel: 1
    }
  },
  {
    id: "administrators",
    name: "Administrators",
    roles: [mockRoles[1]], // Admin 역할
    attributes: {
      accessLevel: 10
    }
  }
];

/**
 * 인증 제공자 컴포넌트
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  
  // 세션 정보를 기반으로 사용자 정보 초기화
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // 실제 애플리케이션에서는 API에서 사용자 정보, 역할, 그룹 등을 가져옵니다.
      // 여기서는 간단한 모의 데이터를 사용합니다.
      const isAdmin = session.user.email?.includes("admin");
      
      const authUser: AuthUser = {
        id: session.user.id || "unknown",
        email: session.user.email || "unknown",
        name: session.user.name || undefined,
        roles: isAdmin ? [mockRoles[0], mockRoles[1]] : [mockRoles[0]],
        groups: isAdmin ? [mockGroups[0], mockGroups[1]] : [mockGroups[0]],
        attributes: {
          isActive: true,
          registeredDate: new Date().toISOString()
        }
      };
      
      setUser(authUser);
    } else {
      setUser(null);
    }
  }, [session, status]);

  // 권한 확인 메서드
  const checkPermission = (
    action: ActionType | string, 
    resource: ResourceType | string, 
    context: Record<string, unknown> = {}
  ): AuthorizationResult => {
    if (!user) {
      return { allowed: false, reason: "User not authenticated" };
    }
    
    // 인가 서비스를 사용하여 권한 확인
    return authorizationService.checkPermission(user, action, resource, context);
  };

  // 역할 할당 메서드
  const assignRole = (role: Role) => {
    if (!user) return;
    
    const updatedUser = authorizationService.assignRoleToUser(user, role);
    setUser(updatedUser);
  };

  // 속성 업데이트 메서드
  const updateAttributes = (attributes: Record<string, unknown>) => {
    if (!user) return;
    
    const updatedUser = authorizationService.updateUserAttributes(user, attributes as Partial<UserAttributes>);
    setUser(updatedUser);
  };

  // 역할 가져오기 메서드
  const getRoles = (): Role[] => {
    return user?.roles || [];
  };

  // 그룹 가져오기 메서드
  const getGroups = (): Group[] => {
    return user?.groups || [];
  };

  // 컨텍스트 값 정의
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading: status === "loading",
    checkPermission,
    can: (action: ActionType | string, resource: ResourceType | string, context: Record<string, unknown> = {}) =>
      checkPermission(action, resource, context).allowed,
    assignRole,
    updateAttributes,
    getRoles,
    getGroups
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { PermissionGuard };
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 