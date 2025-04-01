import { Policy, AuthUser } from "@/types/auth";
import ConditionEvaluator from "./conditionEvaluator";

/**
 * 정책 평가 서비스
 * 정책 및 컨텍스트를 기반으로 정책 적용 여부를 평가합니다.
 */
export class PolicyEvaluator {
  /**
   * 주어진 정책, 사용자, 액션, 리소스, 컨텍스트를 기반으로 정책 적용 여부를 평가합니다.
   * 
   * @param policy 평가할 정책
   * @param user 사용자 정보
   * @param action 요청된 액션
   * @param resource 요청된 리소스
   * @param context 추가 컨텍스트 정보
   * @returns 정책 평가 결과 (허용 여부 및 우선순위)
   */
  static evaluate(
    policy: Policy,
    user: AuthUser,
    action: string,
    resource: string,
    context: Record<string, unknown> = {}
  ): { allowed: boolean; priority: number } {
    // 1. 액션 매칭 확인
    if (!this.matchesAction(policy.actions, action)) {
      return { allowed: false, priority: policy.priority };
    }
    
    // 2. 리소스 매칭 확인
    if (!this.matchesResource(policy.resources, resource)) {
      return { allowed: false, priority: policy.priority };
    }

    // 3. 조건 평가
    if (!this.allConditionsMet(policy, user, context)) {
      return { allowed: false, priority: policy.priority };
    }

    // 4. 정책 효과에 따른 결과 반환
    return {
      allowed: policy.effect === "allow",
      priority: policy.priority,
    };
  }

  /**
   * 주어진 액션이 정책의 액션 목록과 일치하는지 확인합니다.
   * 
   * @param policyActions 정책 액션 목록
   * @param requestedAction 요청된 액션
   * @returns 일치 여부
   */
  private static matchesAction(policyActions: string[], requestedAction: string): boolean {
    return policyActions.includes(requestedAction) || policyActions.includes("*");
  }

  /**
   * 주어진 리소스가 정책의 리소스 목록과 일치하는지 확인합니다.
   * 
   * @param policyResources 정책 리소스 목록
   * @param requestedResource 요청된 리소스
   * @returns 일치 여부
   */
  private static matchesResource(policyResources: string[], requestedResource: string): boolean {
    // 정확한 일치 또는 와일드카드 일치
    if (policyResources.includes(requestedResource) || policyResources.includes("*")) {
      return true;
    }
    
    // 와일드카드 패턴 지원 (예: data:users:*)
    return policyResources.some(r => {
      if (r.endsWith('*')) {
        const prefix = r.slice(0, -1);
        return requestedResource.startsWith(prefix);
      }
      return false;
    });
  }

  /**
   * 정책의 모든 조건이 충족되는지 확인합니다.
   * 
   * @param policy 평가할 정책
   * @param user 사용자 정보
   * @param context 추가 컨텍스트 정보
   * @returns 모든 조건 충족 여부
   */
  private static allConditionsMet(
    policy: Policy, 
    user: AuthUser, 
    context: Record<string, unknown>
  ): boolean {
    // 조건이 없으면 기본적으로 충족된 것으로 간주
    if (policy.conditions.length === 0) {
      return true;
    }
    
    // 모든 조건이 충족되어야 함
    return policy.conditions.every(condition => 
      ConditionEvaluator.evaluate(condition, user, context)
    );
  }
}

// 단일 인스턴스 내보내기
export default PolicyEvaluator; 