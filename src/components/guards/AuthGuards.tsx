"use client";

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ActionType, ResourceType } from '@/types/auth';

/**
 * 권한 기반 라우트 가드 컴포넌트
 * 사용자가 특정 리소스에 대해 특정 액션을 수행할 권한이 있는 경우에만 자식 컴포넌트를 렌더링합니다.
 */
interface PermissionGuardProps {
  children: ReactNode;
  action: ActionType | string;
  resource: ResourceType | string;
  fallback?: ReactNode;
  redirectTo?: string;
  context?: Record<string, unknown>;
}

export const AuthRouteGuard: React.FC<PermissionGuardProps> = ({
  children,
  action,
  resource,
  fallback = null,
  redirectTo,
  context = {}
}) => {
  const { checkPermission, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // 로딩 중인 경우 로딩 UI를 표시하거나 null 반환
  if (isLoading) {
    return <div>권한 확인 중...</div>;
  }

  // 인증되지 않은 경우 리디렉션 또는 대체 UI 표시
  if (!isAuthenticated) {
    if (redirectTo) {
      router.push(redirectTo);
      return null;
    }
    return fallback ? <>{fallback}</> : <div>로그인이 필요합니다.</div>;
  }

  // 권한 확인
  const result = checkPermission(action, resource, context);

  // 권한이 있는 경우 자식 컴포넌트 렌더링
  if (result.allowed) {
    return <>{children}</>;
  }

  // 권한이 없는 경우 리디렉션 또는 대체 UI 표시
  if (redirectTo) {
    router.push(redirectTo);
    return null;
  }

  return fallback ? <>{fallback}</> : <div>접근 권한이 없습니다.</div>;
};

/**
 * 이전 API와의 호환성을 위한 PermissionGuard 컴포넌트
 * AuthRouteGuard와 동일한 기능을 제공합니다.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = (props) => {
  return <AuthRouteGuard {...props} />;
};

interface RoleGuardProps {
  children: ReactNode;
  requiredRoles: string | string[];
  fallback?: ReactNode;
  redirectTo?: string;
  requireAll?: boolean;
}

/**
 * 역할 기반 라우트 가드 컴포넌트
 * 사용자가 지정된 역할을 가진 경우에만 자식 컴포넌트를 렌더링합니다.
 */
export const RoleRouteGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles,
  fallback = null,
  redirectTo,
  requireAll = false
}) => {
  const { getRoles, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // 로딩 중인 경우 로딩 UI를 표시하거나 null 반환
  if (isLoading) {
    return <div>권한 확인 중...</div>;
  }

  // 인증되지 않은 경우 리디렉션 또는 대체 UI 표시
  if (!isAuthenticated) {
    if (redirectTo) {
      router.push(redirectTo);
      return null;
    }
    return fallback ? <>{fallback}</> : <div>로그인이 필요합니다.</div>;
  }

  const userRoles = getRoles().map(role => role.id);
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  // 역할 확인
  const hasAccess = requireAll 
    ? roles.every(role => userRoles.includes(role))
    : roles.some(role => userRoles.includes(role));

  // 역할이 있는 경우 자식 컴포넌트 렌더링
  if (hasAccess) {
    return <>{children}</>;
  }

  // 역할이 없는 경우 리디렉션 또는 대체 UI 표시
  if (redirectTo) {
    router.push(redirectTo);
    return null;
  }

  return fallback ? <>{fallback}</> : <div>접근 권한이 없습니다.</div>;
};

const guards = { AuthRouteGuard, RoleRouteGuard, PermissionGuard };
export default guards; 