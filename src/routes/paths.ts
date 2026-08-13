/**
 * 라우트 경로 한 곳 모음. 문자열을 화면 곳곳에 흩뿌리지 않는다.
 *
 * 화면 ↔ node ID ↔ 경로 대조표는 CLAUDE.md § 3 화면 목록에 있다.
 *
 * ── 도메인 구조 ──────────────────────────────────────────────
 * **회의는 프로젝트에 소속된다.** 그래서 회의 관련 화면은 전부
 * `/projects/:projectId/meetings/...` 아래로 중첩한다.
 *
 * 예외는 `/meetings`(Desktop - 41) 하나다. 이건 특정 프로젝트가 아니라
 * **사용자가 소속된 회의를 프로젝트와 무관하게 최신순으로 모아 보여주는** 화면이라
 * 최상위에 둔다. 상단 nav "지난 회의"의 목적지다.
 *
 * `Desktop - 26 / 27 / 28`은 로그인 한 화면의 3가지 상태(빈 값 / 입력됨 / 에러)이므로
 * 라우트는 LOGIN 하나다.
 */

/** 프로젝트에 속하지 않는 최상위 경로 */
export const PATHS = {
  /** 진입점. 로그인 여부에 따라 WELCOME 또는 PROJECTS로 보낸다 (아직 미구현) */
  ROOT: '/',
  /** Desktop - 25 랜딩 — 로그인 전 홈 */
  WELCOME: '/welcome',
  /** Desktop - 26/27/28 로그인 */
  LOGIN: '/login',
  /** Desktop - 8 회원가입 */
  SIGNUP: '/signup',
  /** Desktop - 39 회원가입 완료 */
  SIGNUP_COMPLETE: '/signup/complete',

  /** Desktop - 29 내 프로젝트 — 로그인 후 홈 */
  PROJECTS: '/projects',
  /** Desktop - 30 프로젝트 생성 */
  PROJECT_NEW: '/projects/new',

  /** Desktop - 41 지난 회의 — 사용자가 소속된 회의 전체(프로젝트 무관) */
  MEETINGS: '/meetings',
} as const

/**
 * 특정 프로젝트에 속한 화면.
 *
 * COMPLETE(생성 완료 + 참여코드 공유)를 `/projects/new/complete`가 아니라
 * projectId 아래에 둔 이유: 생성 직후가 아니어도 참여코드를 다시 열어볼 수 있고,
 * 새로고침해도 살아남는다. 라우터 state로만 코드를 넘기면 새로고침에 사라진다.
 */
export const PROJECT_PATTERNS = {
  /** Desktop - 46 프로젝트 상세 (회의 카드 목록) */
  DETAIL: '/projects/:projectId',
  /** Desktop - 51 프로젝트 생성 완료 — 참여코드 공유 */
  COMPLETE: '/projects/:projectId/complete',
  /** Desktop - 31 회의 생성 */
  MEETING_NEW: '/projects/:projectId/meetings/new',
} as const

/**
 * 특정 회의에 속한 화면. 회의는 항상 프로젝트 아래에 있으므로 projectId가 같이 필요하다.
 *
 * DETAIL(= Desktop - 36 회의 결과)이 회의의 기본 경로다. 업로드 → (로딩) → 분석 결과가
 * 회의의 최종 상태라서 별도 `/result`를 두지 않았다.
 */
export const MEETING_PATTERNS = {
  /** Desktop - 36 회의 결과 (AI 분석) */
  DETAIL: '/projects/:projectId/meetings/:meetingId',
  /** Desktop - 33 AI 사전 인터뷰 */
  INTERVIEW: '/projects/:projectId/meetings/:meetingId/interview',
  /** Desktop - 34 익명 아이디어 보드 */
  BOARD: '/projects/:projectId/meetings/:meetingId/board',
  /** Desktop - 35 회의 텍스트 업로드 */
  UPLOAD: '/projects/:projectId/meetings/:meetingId/upload',
  /**
   * Desktop - 58 분석 로딩.
   * 업로드(35) → 로딩(58) → 분석 완료되면 회의 결과(= DETAIL)로 간다.
   * 시안이 페이지 단위라 라우트로 뒀다 (사용자 확정).
   */
  LOADING: '/projects/:projectId/meetings/:meetingId/loading',
} as const

type ProjectSection = keyof typeof PROJECT_PATTERNS
type MeetingSection = keyof typeof MEETING_PATTERNS

/** projectPath('COMPLETE', 'abc') → '/projects/abc/complete' */
export function projectPath(section: ProjectSection, projectId: string): string {
  return PROJECT_PATTERNS[section].replace(':projectId', projectId)
}

/** meetingPath('BOARD', 'abc', '6') → '/projects/abc/meetings/6/board' */
export function meetingPath(
  section: MeetingSection,
  projectId: string,
  meetingId: string,
): string {
  return MEETING_PATTERNS[section]
    .replace(':projectId', projectId)
    .replace(':meetingId', meetingId)
}
