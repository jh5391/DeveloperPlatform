/**
 * 권한 관리 시스템의 기본 타입 정의
 */

// 리소스 타입 정의
export type ResourceType = 'page' | 'data' | 'feature' | 'api';

// 액션 타입 정의
export type ActionType = 'create' | 'read' | 'update' | 'delete' | 'execute' | 'access';

/**
 * 권한 정의
 * 특정 리소스에 대한 특정 액션 수행 권한을 나타냅니다.
 */
export type Permission = {
  action: ActionType;
  resource: {
    type: ResourceType;
    id: string;
  };
};

/**
 * 역할 정의
 * 여러 권한을 그룹화한 역할을 나타냅니다.
 */
export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
};

/**
 * 그룹 정의
 * 여러 역할과 속성을 가진 사용자 그룹을 나타냅니다.
 */
export type Group = {
  id: string;
  name: string;
  description?: string;
  roles: Role[];
  attributes?: Record<string, string | boolean | number>;
};

/**
 * 사용자 속성 정의
 * 속성 기반 접근 제어(ABAC)에 사용되는 사용자 속성을 나타냅니다.
 */
export type UserAttributes = {
  department?: string;
  position?: string;
  level?: number;
  region?: string;
  isActive?: boolean;
  [key: string]: unknown;
};

/**
 * 인증된 사용자 정의
 * 인증된 사용자의 정보, 역할, 그룹, 속성을 포함합니다.
 */
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles: Role[];
  groups: Group[];
  attributes: UserAttributes;
}

// ABAC 관련 타입 정의
// -------------------------

/**
 * 조건 연산자 정의
 * 속성 기반 권한 정책에서 사용되는 비교 연산자입니다.
 */
export type ConditionOperator = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'includes' | 'startsWith' | 'endsWith';

/**
 * 조건 정의
 * 특정 필드에 대한 조건 평가 규칙을 정의합니다.
 */
export type Condition = {
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean | unknown[];
};

/**
 * 정책 효과 정의
 * 정책이 허용(allow) 또는 거부(deny)인지 나타냅니다.
 */
export type PolicyEffect = 'allow' | 'deny';

/**
 * 정책 정의
 * 속성 기반 접근 제어(ABAC)를 위한 정책을 나타냅니다.
 */
export type Policy = {
  id?: string;
  name: string;
  description?: string;
  effect: PolicyEffect;
  actions: string[];
  resources: string[];
  conditions: Condition[];
  priority: number;
};

/**
 * 권한 확인 결과
 * 권한 검사 결과를 나타냅니다.
 */
export type AuthorizationResult = {
  allowed: boolean;
  resource?: string;
  action?: string;
  reason?: string;
}; 