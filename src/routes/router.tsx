import { createBrowserRouter } from 'react-router'
import { LoginPage } from '@/pages/LoginPage'
import { MeetingsPage } from '@/pages/MeetingsPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { SignUpCompletePage } from '@/pages/SignUpCompletePage'
import { SignUpPage } from '@/pages/SignUpPage'
import { MEETING_PATTERNS, PATHS } from '@/routes/paths'

/*
 * Figma 와이어프레임 16개 화면을 그대로 옮긴 라우트 트리.
 *
 * 레이아웃 라우트를 쓰지 않고 각 페이지가 자기 헤더를 직접 렌더한다.
 * 헤더 preset(auth / appOnHero / appOnLight / landing)과 히어로 유무가 화면마다
 * 갈리는데(히어로 y좌표에 따라 결정됨) 그걸 라우트 config로 빼면 배보다 배꼽이 커진다.
 * 지금 구현된 페이지 2개도 이미 이 방식이다. 헤더 중복이 실제로 거슬려지면 그때
 * PageShell 같은 걸 도입할 것.
 *
 * 주의: BrowserRouter이므로 EC2 nginx에 SPA fallback이 필요하다 (§ 3-1).
 *   try_files $uri $uri/ /index.html;
 */
export const router = createBrowserRouter([
  // ── 로그인 전 ────────────────────────────────────────────────
  {
    path: PATHS.HOME,
    element: (
      <PlaceholderPage title="홈 (랜딩)" figma="Desktop - 25" nodeId="759:1263" />
    ),
  },
  { path: PATHS.LOGIN, element: <LoginPage /> },
  { path: PATHS.SIGNUP, element: <SignUpPage /> },
  { path: PATHS.SIGNUP_COMPLETE, element: <SignUpCompletePage /> },

  // ── 프로젝트 ────────────────────────────────────────────────
  {
    path: PATHS.PROJECTS,
    element: (
      <PlaceholderPage
        title="내 프로젝트"
        figma="Desktop - 29"
        nodeId="759:724"
      />
    ),
  },
  {
    path: PATHS.PROJECT_NEW,
    element: (
      <PlaceholderPage
        title="프로젝트 생성"
        figma="Desktop - 30"
        nodeId="759:1008"
      />
    ),
  },
  {
    path: PATHS.PROJECT_NEW_COMPLETE,
    element: (
      <PlaceholderPage
        title="프로젝트 생성 완료"
        figma="Desktop - 40"
        nodeId="775:42"
      />
    ),
  },
  // nav "프로젝트 설정"의 목적지. 대응하는 Figma 시안이 아직 없다
  {
    path: PATHS.SETTINGS,
    element: <PlaceholderPage title="프로젝트 설정" designMissing />,
  },

  // ── 회의 ────────────────────────────────────────────────────
  // /meetings/new가 /meetings/:meetingId보다 먼저 매칭된다 (정적 세그먼트 우선)
  { path: PATHS.MEETINGS, element: <MeetingsPage /> },
  {
    path: PATHS.MEETING_NEW,
    element: (
      <PlaceholderPage
        title="회의 생성"
        figma="Desktop - 31"
        nodeId="759:1074"
      />
    ),
  },
  {
    path: MEETING_PATTERNS.DETAIL,
    element: (
      <PlaceholderPage title="회의 상세" figma="Desktop - 11" nodeId="772:42" />
    ),
  },
  {
    path: MEETING_PATTERNS.INTERVIEW,
    element: (
      <PlaceholderPage
        title="AI 사전 인터뷰"
        figma="Desktop - 33"
        nodeId="759:1179"
      />
    ),
  },
  {
    path: MEETING_PATTERNS.IDEAS,
    element: (
      <PlaceholderPage
        title="아이디어 보드"
        figma="Desktop - 34"
        nodeId="759:789"
      />
    ),
  },
  {
    path: MEETING_PATTERNS.UPLOAD,
    element: (
      <PlaceholderPage
        title="회의 텍스트 업로드"
        figma="Desktop - 35"
        nodeId="759:981"
      />
    ),
  },
  {
    path: MEETING_PATTERNS.RESULT,
    element: (
      <PlaceholderPage
        title="회의 결과"
        figma="Desktop - 36"
        nodeId="759:828"
      />
    ),
  },

  { path: '*', element: <PlaceholderPage title="404 — 없는 경로" /> },
])
