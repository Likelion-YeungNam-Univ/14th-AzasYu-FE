/**
 * 화면 전반에서 공유하는 상수.
 * 컴포넌트 파일에서 같이 export하면 Fast Refresh가 깨져 별도 파일로 둔다.
 */

/** Figma 헤더 로고 텍스트 */
export const SERVICE_NAME = '이해했습니다! (아님)'

/** 로그인 후 화면 공통 내비게이션 */
export const NAV_ITEMS = [
  '홈',
  '신규 서비스 기획',
  '지난 회의',
  '프로젝트 설정',
] as const

/**
 * 히어로(670px) 위로 카드를 top-401px에 올리기 위한 겹침 값.
 * 670 - 401 = 269
 */
export const HERO_CARD_OVERLAP = 269
