/**
 * 라우트 경로 한 곳 모음. 문자열을 화면 곳곳에 흩뿌리지 않는다.
 *
 * Figma 와이어프레임 16개 화면(`# 와이어프레임` 섹션)을 전수 확인해 만든 매핑이다.
 * 화면 ↔ node ID ↔ 경로 대조표는 CLAUDE.md § 3 화면 목록에 있다.
 *
 * `Desktop - 26 / 27 / 28`은 로그인 한 화면의 3가지 상태(빈 값 / 입력됨 / 에러)이므로
 * 라우트는 LOGIN 하나다.
 */
export const PATHS = {
  /** Desktop - 25 랜딩 */
  HOME: '/',
  /** Desktop - 26/27/28 로그인 */
  LOGIN: '/login',
  /** Desktop - 8 회원가입 */
  SIGNUP: '/signup',
  /** Desktop - 39 회원가입 완료 */
  SIGNUP_COMPLETE: '/signup/complete',

  /** Desktop - 29 내 프로젝트 */
  PROJECTS: '/projects',
  /** Desktop - 30 프로젝트 생성 */
  PROJECT_NEW: '/projects/new',
  /** Desktop - 40 프로젝트 생성 완료 (참여코드 공유) */
  PROJECT_NEW_COMPLETE: '/projects/new/complete',
  /** 시안 없음 — nav "프로젝트 설정"의 목적지 */
  SETTINGS: '/settings',

  /** Desktop - 37 지난 회의 */
  MEETINGS: '/meetings',
  /** Desktop - 31 회의 생성 */
  MEETING_NEW: '/meetings/new',
} as const

/**
 * 회의 하위 화면. `Desktop - 34 / 35 / 36`이 모두 "6차 기획 회의"라는 특정 회의에
 * 속하므로 회의 ID 하위로 묶는다.
 *
 * 라우트 정의용 패턴은 `:meetingId`, 링크 생성은 아래 meetingPath()를 쓴다.
 */
export const MEETING_PATTERNS = {
  /** Desktop - 11 회의 상세 */
  DETAIL: '/meetings/:meetingId',
  /** Desktop - 33 AI 사전 인터뷰 */
  INTERVIEW: '/meetings/:meetingId/interview',
  /** Desktop - 34 아이디어 보드 */
  IDEAS: '/meetings/:meetingId/ideas',
  /** Desktop - 35 회의 텍스트 업로드 */
  UPLOAD: '/meetings/:meetingId/upload',
  /** Desktop - 36 회의 결과 */
  RESULT: '/meetings/:meetingId/result',
} as const

type MeetingSection = keyof typeof MEETING_PATTERNS

/** meetingPath('IDEAS', 'abc') → '/meetings/abc/ideas' */
export function meetingPath(section: MeetingSection, meetingId: string): string {
  return MEETING_PATTERNS[section].replace(':meetingId', meetingId)
}
