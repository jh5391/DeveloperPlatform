import {
  AuthUser,
  AuthorizationResult,
  Policy,
  ActionType,
  ResourceType,
  UserAttributes,
  Role
} from "@/types/auth";
import PolicyEvaluator from "./evaluators/policyEvaluator";

/**
 * RBAC 기반 권한 확인 함수
 * 사용자의 역할과 그룹에 할당된 권한을 확인합니다.
 */
function checkRBACPermission(
  user: AuthUser,
  action: ActionType,
  resourceType: ResourceType,
  resourceId: string
): boolean {
  // 사용자가 가진 직접 역할에서 권한 확인
  const hasDirectPermission = user.roles.some((role) => {
    return role.permissions.some((permission) => {
      return (
        permission.action === action &&
        permission.resource.type === resourceType &&
        (permission.resource.id === resourceId || permission.resource.id === "*")
      );
    });
  });

  if (hasDirectPermission) return true;

  // 사용자가 속한 그룹의 역할에서 권한 확인
  return user.groups.some((group) => {
    return group.roles.some((role) => {
      return role.permissions.some((permission) => {
        return (
          permission.action === action &&
          permission.resource.type === resourceType &&
          (permission.resource.id === resourceId || permission.resource.id === "*")
        );
      });
    });
  });
}

/**
 * 권한 관리 서비스 클래스
 * RBAC 및 ABAC 기반 권한 관리를 위한 기능을 제공합니다.
 */
export class AuthorizationService {
  private static instance: AuthorizationService;
  private policies: Policy[] = [];
  
  /**
   * 싱글톤 인스턴스를 반환합니다.
   */
  public static getInstance(): AuthorizationService {
    if (!AuthorizationService.instance) {
      AuthorizationService.instance = new AuthorizationService();
    }
    return AuthorizationService.instance;
  }

  private constructor() {
    // 기본 정책 초기화
    this.initializeDefaultPolicies();
  }

  /**
   * 기본 정책을 초기화합니다.
   * 여기에 애플리케이션 기본 정책을 추가하세요.
   */
  private initializeDefaultPolicies(): void {
    // 관리자 정책 추가
    this.addPolicy({
      name: "admin-full-access",
      effect: "allow",
      actions: ["*"],
      resources: ["*"],
      conditions: [
        {
          field: "roles",
          operator: "includes",
          value: "admin",
        },
      ],
      priority: 100,
    });

    // 사용자 정책 추가 - 자신의 데이터에 대한 접근만 허용
    this.addPolicy({
      name: "user-own-data-access",
      effect: "allow",
      actions: ["read", "update"],
      resources: ["data:user:*"],
      conditions: [
        {
          field: "resourceId",
          operator: "==",
          value: "$userId",
        },
      ],
      priority: 50,
    });

    // 인증된 사용자는 공개 리소스에 액세스 가능
    this.addPolicy({
      name: "authenticated-user-public-access",
      effect: "allow",
      actions: ["read"],
      resources: ["data:public:*"],
      conditions: [],
      priority: 10,
    });
  }

  /**
   * 정책 우선순위별 정렬
   */
  private sortPolicies(): void {
    this.policies.sort((a, b) => b.priority - a.priority);
  }

  /**
   * 정책 추가
   */
  public addPolicy(policy: Policy): void {
    // 이미 존재하는 정책이 있는지 확인
    const existingPolicyIndex = this.policies.findIndex(p => p.name === policy.name);
    
    if (existingPolicyIndex >= 0) {
      // 기존 정책 업데이트
      this.policies[existingPolicyIndex] = policy;
    } else {
      // 새 정책 추가
      this.policies.push(policy);
    }
    
    // 우선순위에 따라 정책 재정렬
    this.policies.sort((a, b) => b.priority - a.priority);
  }

  /**
   * 정책 설정 (기존 정책 제거 후 새로운 정책으로 설정)
   */
  public setPolicies(policies: Policy[]): void {
    this.policies = [...policies];
    this.sortPolicies();
  }

  /**
   * 정책 제거
   */
  public removePolicy(policyName: string): boolean {
    const initialLength = this.policies.length;
    this.policies = this.policies.filter(p => p.name !== policyName);
    return initialLength !== this.policies.length;
  }

  /**
   * 권한 확인 (RBAC + ABAC)
   * 사용자가 특정 리소스에 대해 특정 액션을 수행할 권한이 있는지 확인합니다.
   */
  public authorize(
    user: AuthUser,
    action: string,
    resource: string,
    context: Record<string, unknown> = {}
  ): AuthorizationResult {
    // 리소스 형식: {타입}:{ID} (예: page:dashboard, data:users:123)
    const [resourceType, ...resourceIdParts] = resource.split(":");
    const resourceId = resourceIdParts.join(":");

    // 1. RBAC 기반 검사 (빠른 경로)
    const rbacAllowed = checkRBACPermission(
      user, 
      action as ActionType, 
      resourceType as ResourceType, 
      resourceId
    );
    
    if (rbacAllowed) {
      return {
        allowed: true,
        action,
        resource,
        reason: "Allowed by RBAC role permission",
      };
    }

    // 2. ABAC 기반 정책 평가
    if (this.policies.length > 0) {
      // 우선순위에 따라 정책 평가 (이미 정렬되어 있음)
      for (const policy of this.policies) {
        const result = PolicyEvaluator.evaluate(policy, user, action, resource, context);
        
        if (result.allowed) {
          return {
            allowed: true,
            action,
            resource,
            reason: `Allowed by policy: ${policy.name}`,
          };
        } else if (result.allowed === false && policy.effect === "deny") {
          // 명시적 거부 정책이 매치된 경우
          return {
            allowed: false,
            action,
            resource,
            reason: `Denied by policy: ${policy.name}`,
          };
        }
      }
    }

    // 기본적으로 거부
    return {
      allowed: false,
      action,
      resource,
      reason: "No matching allow policy",
    };
  }

  /**
   * 권한 확인 (세분화된 버전)
   * 여러 권한이 필요한 경우, 모두 충족해야 하는지 하나만 충족해도 되는지 지정할 수 있습니다.
   */
  public authorizeMultiple(
    user: AuthUser,
    actions: string[],
    resource: string,
    context: Record<string, unknown> = {},
    requireAll: boolean = true
  ): AuthorizationResult {
    if (requireAll) {
      // 모든 액션에 대한 권한이 필요한 경우
      for (const action of actions) {
        const result = this.authorize(user, action, resource, context);
        if (!result.allowed) {
          return result;
        }
      }
      return {
        allowed: true,
        action: actions.join(','),
        resource,
        reason: "All required permissions granted",
      };
    } else {
      // 하나 이상의 액션에 대한 권한이 필요한 경우
      for (const action of actions) {
        const result = this.authorize(user, action, resource, context);
        if (result.allowed) {
          return result;
        }
      }
      return {
        allowed: false,
        action: actions.join(','),
        resource,
        reason: "No matching permissions",
      };
    }
  }

  /**
   * 리소스에 대한 사용자의 허용된 권한 목록 가져오기
   */
  public getUserPermissionsForResource(
    user: AuthUser,
    resourceType: ResourceType,
    resourceId: string
  ): ActionType[] {
    const actions = new Set<ActionType>();

    // 직접 역할에서 권한 수집
    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        if (
          permission.resource.type === resourceType &&
          (permission.resource.id === resourceId || permission.resource.id === "*")
        ) {
          actions.add(permission.action);
        }
      });
    });

    // 그룹의 역할에서 권한 수집
    user.groups.forEach((group) => {
      group.roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          if (
            permission.resource.type === resourceType &&
            (permission.resource.id === resourceId || permission.resource.id === "*")
          ) {
            actions.add(permission.action);
          }
        });
      });
    });

    // ABAC 정책에서 추가 권한 확인
    const possibleActions: ActionType[] = ['create', 'read', 'update', 'delete', 'execute', 'access'];
    
    possibleActions.forEach(action => {
      if (!actions.has(action)) {
        const resourceString = `${resourceType}:${resourceId}`;
        const result = this.authorize(user, action, resourceString);
        if (result.allowed) {
          actions.add(action);
        }
      }
    });

    return Array.from(actions);
  }

  /**
   * 사용자에게 특정 역할을 할당합니다.
   * 
   * @param user 사용자 객체
   * @param role 할당할 역할
   * @returns 업데이트된 사용자 객체
   */
  public assignRoleToUser(user: AuthUser, role: Role): AuthUser {
    if (!user.roles) {
      user.roles = [];
    }
    
    // 이미 역할이 있는지 확인
    const hasRole = user.roles.some(r => r.id === role.id);
    
    if (!hasRole) {
      user.roles.push(role);
    }
    
    return user;
  }

  /**
   * 사용자의 속성을 업데이트합니다.
   * 
   * @param user 사용자 객체
   * @param attributes 업데이트할 속성
   * @returns 업데이트된 사용자 객체
   */
  public updateUserAttributes(
    user: AuthUser, 
    attributes: Partial<UserAttributes>
  ): AuthUser {
    return {
      ...user,
      attributes: {
        ...user.attributes,
        ...attributes
      }
    };
  }

  /**
   * 사용자가 특정 리소스에 대해 특정 액션을 수행할 권한이 있는지 확인합니다.
   * alias for authorize function
   */
  public checkPermission(
    user: AuthUser,
    action: string,
    resource: string,
    context: Record<string, unknown> = {}
  ): AuthorizationResult {
    return this.authorize(user, action, resource, context);
  }
}

// 싱글톤 인스턴스 내보내기
export default AuthorizationService.getInstance(); 