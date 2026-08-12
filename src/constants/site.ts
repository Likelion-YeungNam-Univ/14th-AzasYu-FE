/**
 * 화면 전반에서 공유하는 상수.
 * 컴포넌트 파일에서 같이 export하면 Fast Refresh가 깨져 별도 파일로 둔다.
 */
import { PATHS } from '@/routes/paths'

/** Figma 헤더 로고 텍스트 */
export const SERVICE_NAME = '이해했습니다! (아님)'

/**
 * 로그인 후 화면 공통 내비게이션.
 *
 * 목적지 확정 상태 — Figma에 nav 클릭 흐름이 그려져 있지 않아 일부는 추정이다.
 *   지난 회의       확정 (Desktop - 37)
 *   홈             추정. 로그인 후이므로 랜딩(/)보다 "내 프로젝트"가 자연스럽다고 봤다
 *   신규 서비스 기획  추정. Desktop - 31 "회의 생성"으로 걸었다
 *   프로젝트 설정    **대응 Figma 시안이 없다.** placeholder로 연결돼 있다
 * → 디자이너 확인 후 여기 href만 고치면 된다.
 */
export const NAV_ITEMS = [
  { label: '홈', href: PATHS.PROJECTS },
  { label: '신규 서비스 기획', href: PATHS.MEETING_NEW },
  { label: '지난 회의', href: PATHS.MEETINGS },
  { label: '프로젝트 설정', href: PATHS.SETTINGS },
] as const

/**
 * 히어로(670px) 위로 카드를 top-401px에 올리기 위한 겹침 값.
 * 670 - 401 = 269
 */
export const HERO_CARD_OVERLAP = 269
