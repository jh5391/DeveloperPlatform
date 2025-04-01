import { Policy } from "@/types/auth";

// 샘플 정책 데이터
export const samplePolicies: Policy[] = [
  // 관리자를 위한 정책 - 모든 리소스에 대한 모든 액션 허용
  {
    id: "admin-full-access",
    name: "관리자 전체 접근 권한",
    effect: "allow",
    actions: ["*"],
    resources: ["*"],
    conditions: [
      {
        field: "user.attributes.level",
        operator: ">=",
        value: 5,
      },
      {
        field: "user.attributes.isActive",
        operator: "==",
        value: true,
      },
    ],
    priority: 100,
  },
  
  // 매니저를 위한 정책 - 자신의 부서 데이터에 대한 접근 허용
  {
    id: "manager-department-access",
    name: "매니저 부서 데이터 접근 권한",
    effect: "allow",
    actions: ["read", "update"],
    resources: ["data:users:*", "data:projects:*"],
    conditions: [
      {
        field: "user.attributes.position",
        operator: "==",
        value: "Manager",
      },
      {
        field: "user.attributes.isActive",
        operator: "==",
        value: true,
      },
      {
        field: "context.department",
        operator: "==",
        value: "user.attributes.department",
      },
    ],
    priority: 90,
  },
  
  // 개발자를 위한 정책 - 특정 기능 및 페이지 접근 허용
  {
    id: "developer-feature-access",
    name: "개발자 기능 접근 권한",
    effect: "allow",
    actions: ["access"],
    resources: ["feature:codeReview", "feature:debugging", "page:analytics"],
    conditions: [
      {
        field: "user.attributes.position",
        operator: "==",
        value: "Developer",
      },
      {
        field: "user.attributes.level",
        operator: ">=",
        value: 2,
      },
    ],
    priority: 80,
  },
  
  // 특정 리전 사용자에 대한 접근 제한 정책
  {
    id: "region-restriction",
    name: "지역 접근 제한",
    effect: "deny",
    actions: ["update", "delete"],
    resources: ["data:customers:*", "data:sales:*"],
    conditions: [
      {
        field: "user.attributes.region",
        operator: "!=",
        value: "HQ",
      },
      {
        field: "context.isEmergency",
        operator: "!=",
        value: true,
      },
    ],
    priority: 110, // 명시적 거부는 높은 우선순위
  },
  
  // 시간 기반 접근 제한 정책 (예: 업무 시간 이외의 수정 제한)
  {
    id: "time-based-restriction",
    name: "업무 시간 외 수정 제한",
    effect: "deny",
    actions: ["update", "delete", "create"],
    resources: ["data:*"],
    conditions: [
      {
        field: "context.hourOfDay",
        operator: "<",
        value: 9,
      },
      {
        field: "context.hourOfDay",
        operator: ">",
        value: 18,
      },
      {
        field: "context.isEmergency",
        operator: "!=",
        value: true,
      },
    ],
    priority: 105,
  },
  
  // 기본 사용자 정책 - 일반 페이지 접근 허용
  {
    id: "default-user-page-access",
    name: "기본 사용자 페이지 접근",
    effect: "allow",
    actions: ["read"],
    resources: ["page:dashboard", "page:profile", "page:help"],
    conditions: [
      {
        field: "user.attributes.isActive",
        operator: "==",
        value: true,
      },
    ],
    priority: 10, // 낮은 우선순위
  },

  // 기본 사용자 리소스 정책 - 자신의 데이터에 대한 접근 허용
  {
    id: "user-own-data-access",
    name: "사용자 개인 데이터 접근",
    effect: "allow",
    actions: ["read", "update"],
    resources: ["data:users:*"],
    conditions: [
      {
        field: "context.userId",
        operator: "==",
        value: "user.id",
      },
    ],
    priority: 20,
  },
]; 