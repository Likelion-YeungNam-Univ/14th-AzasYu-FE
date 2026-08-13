import { createBrowserRouter, Navigate } from 'react-router'
import { LoginPage } from '@/pages/LoginPage'
import { MeetingNewPage } from '@/pages/MeetingNewPage'
import { MeetingBoardPage } from '@/pages/MeetingBoardPage'
import { MeetingInterviewPage } from '@/pages/MeetingInterviewPage'
import { MeetingLoadingPage } from '@/pages/MeetingLoadingPage'
import { MeetingResultPage } from '@/pages/MeetingResultPage'
import { MeetingsPage } from '@/pages/MeetingsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { MeetingUploadPage } from '@/pages/MeetingUploadPage'
import { ProjectCompletePage } from '@/pages/ProjectCompletePage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { ProjectNewPage } from '@/pages/ProjectNewPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { SignUpCompletePage } from '@/pages/SignUpCompletePage'
import { SignUpPage } from '@/pages/SignUpPage'
import { WelcomePage } from '@/pages/WelcomePage'
import { MEETING_PATTERNS, PATHS, PROJECT_PATTERNS } from '@/routes/paths'

/*
 * 라우트 트리. 도메인 구조는 paths.ts 주석 참고.
 *
 *   회의는 프로젝트에 소속된다 → /projects/:projectId/meetings/:meetingId/...
 *   예외는 /meetings 하나 (사용자가 소속된 회의 전체, 프로젝트 무관)
 *
 * 레이아웃 라우트를 쓰지 않고 각 페이지가 자기 헤더를 직접 렌더한다.
 * 헤더 preset(auth / authApp / appOnHero / appOnLight / landing)과 히어로 유무가
 * 화면마다 갈리는데(히어로 y좌표에 따라 결정됨) 그걸 라우트 config로 빼면
 * 배보다 배꼽이 커진다. nav에 필요한 projectId는 Header가 useParams로 직접 읽으므로
 * 레이아웃 라우트 없이도 프로젝트 컨텍스트가 전달된다.
 *
 * 정적 세그먼트가 동적 세그먼트보다 먼저 매칭된다 (react-router의 라우트 랭킹).
 * /projects/new > /projects/:projectId, /meetings/new > /meetings/:meetingId — 실측 확인함.
 *
 * 주의: BrowserRouter이므로 EC2 nginx에 SPA fallback이 필요하다 (§ 3-1).
 *   try_files $uri $uri/ /index.html;
 */
export const router = createBrowserRouter([
  /*
   * TODO(인증): 로그인 상태에 따라 분기해야 한다.
   *   로그인 O → PATHS.PROJECTS (Desktop - 29, 로그인 후 홈)
   *   로그인 X → PATHS.WELCOME  (Desktop - 25, 로그인 전 홈)
   * 지금은 인증이 없어 항상 WELCOME으로 보낸다. 백엔드가 붙으면 여기만 고치면 된다.
   */
  { path: PATHS.ROOT, element: <Navigate to={PATHS.WELCOME} replace /> },

  // ── 로그인 전 ────────────────────────────────────────────────
  { path: PATHS.WELCOME, element: <WelcomePage /> },
  { path: PATHS.LOGIN, element: <LoginPage /> },
  { path: PATHS.SIGNUP, element: <SignUpPage /> },
  { path: PATHS.SIGNUP_COMPLETE, element: <SignUpCompletePage /> },

  // ── 프로젝트 ────────────────────────────────────────────────
  { path: PATHS.PROJECTS, element: <ProjectsPage /> },
  { path: PATHS.PROJECT_NEW, element: <ProjectNewPage /> },
  { path: PROJECT_PATTERNS.DETAIL, element: <ProjectDetailPage /> },
  { path: PROJECT_PATTERNS.COMPLETE, element: <ProjectCompletePage /> },
  // ── 회의 (프로젝트 하위) ─────────────────────────────────────
  { path: PROJECT_PATTERNS.MEETING_NEW, element: <MeetingNewPage /> },
  { path: MEETING_PATTERNS.DETAIL, element: <MeetingResultPage /> },
  { path: MEETING_PATTERNS.INTERVIEW, element: <MeetingInterviewPage /> },
  { path: MEETING_PATTERNS.BOARD, element: <MeetingBoardPage /> },
  { path: MEETING_PATTERNS.UPLOAD, element: <MeetingUploadPage /> },
  { path: MEETING_PATTERNS.LOADING, element: <MeetingLoadingPage /> },

  // ── 회의 (프로젝트 무관) ─────────────────────────────────────
  // 사용자가 소속된 회의를 최신순으로 모아 보여준다. nav "지난 회의"의 목적지
  { path: PATHS.MEETINGS, element: <MeetingsPage /> },

  { path: '*', element: <NotFoundPage /> },
])
