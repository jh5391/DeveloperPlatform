import { Condition, AuthUser } from "@/types/auth";

/**
 * 조건 평가 서비스
 * 조건 및 컨텍스트를 기반으로 조건 충족 여부를 평가합니다.
 */
export class ConditionEvaluator {
  /**
   * 주어진 조건과 사용자 정보, 컨텍스트를 기반으로 조건 충족 여부를 평가합니다.
   * 
   * @param condition 평가할 조건
   * @param user 사용자 정보
   * @param context 추가 컨텍스트 정보
   * @returns 조건 충족 여부
   */
  static evaluate(
    condition: Condition,
    user: AuthUser,
    context: Record<string, unknown> = {}
  ): boolean {
    // 사용자 속성, 그룹 속성 및 컨텍스트를 포함한 전체 평가 컨텍스트 생성
    const evaluationContext = {
      user: {
        ...user,
        ...user.attributes,
      },
      context,
    };

    // 조건의 필드 경로 분석 (예: user.department, context.time 등)
    const fieldPath = condition.field.split(".");
    let fieldValue: unknown = evaluationContext;

    for (const path of fieldPath) {
      if (fieldValue === undefined || fieldValue === null) return false;
      fieldValue = (fieldValue as Record<string, unknown>)[path];
    }

    // 값이 존재하지 않으면 조건 불충족
    if (fieldValue === undefined || fieldValue === null) return false;

    return this.compareValues(fieldValue, condition.operator, condition.value);
  }

  /**
   * 두 값을 지정된 연산자로 비교합니다.
   * 
   * @param fieldValue 필드 값
   * @param operator 비교 연산자
   * @param conditionValue 조건 값
   * @returns 비교 결과
   */
  private static compareValues(
    fieldValue: unknown,
    operator: string,
    conditionValue: unknown
  ): boolean {
    switch (operator) {
      case "==":
        return fieldValue === conditionValue;
      case "!=":
        return fieldValue !== conditionValue;
      case ">":
        return (fieldValue as number) > (conditionValue as number);
      case "<":
        return (fieldValue as number) < (conditionValue as number);
      case ">=":
        return (fieldValue as number) >= (conditionValue as number);
      case "<=":
        return (fieldValue as number) <= (conditionValue as number);
      case "includes":
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(conditionValue);
        }
        if (typeof fieldValue === "string" && typeof conditionValue === "string") {
          return fieldValue.includes(conditionValue);
        }
        return false;
      case "startsWith":
        return typeof fieldValue === "string" && typeof conditionValue === "string"
          ? fieldValue.startsWith(conditionValue)
          : false;
      case "endsWith":
        return typeof fieldValue === "string" && typeof conditionValue === "string"
          ? fieldValue.endsWith(conditionValue)
          : false;
      default:
        return false;
    }
  }
}

// 단일 인스턴스 내보내기
export default ConditionEvaluator; 