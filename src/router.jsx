import { createBrowserRouter, Navigate } from 'react-router'
import {
  NotFoundPage,
  SignUpCompletePage,
  SignUpPage,
  WelcomePage,
} from '@/pages/auth'
import { MeetingBoardPage } from '@/pages/meetings/board'
import { MeetingInterviewPage } from '@/pages/meetings/interview'
import { MeetingsPage } from '@/pages/meetings/list'
import { MeetingLoadingPage } from '@/pages/meetings/loading'
import { MeetingNewPage } from '@/pages/meetings/new'
import { MeetingResultPage } from '@/pages/meetings/result'
import { MeetingSummaryPage } from '@/pages/meetings/summary'
import { MeetingUploadPage } from '@/pages/meetings/upload'
import { ProjectCompletePage } from '@/pages/projects/complete'
import { ProjectDetailPage } from '@/pages/projects/detail'
import { ProjectsPage } from '@/pages/projects/list'
import { ProjectNewPage } from '@/pages/projects/new'
import { RequireAuth, RequireSignUpComplete } from '@/components/guards'
import { MEETING_PATTERNS, PATHS, PROJECT_PATTERNS } from '@/lib'

const protectedRoute = (path, element) => ({
  path,
  element: <RequireAuth>{element}</RequireAuth>,
})

export const router = createBrowserRouter([
  { path: PATHS.ROOT, element: <Navigate to={PATHS.WELCOME} replace /> },

  { path: PATHS.WELCOME, element: <WelcomePage /> },
  { path: PATHS.SIGNUP, element: <SignUpPage /> },
  {
    path: PATHS.SIGNUP_COMPLETE,
    element: (
      <RequireSignUpComplete>
        <SignUpCompletePage />
      </RequireSignUpComplete>
    ),
  },

  protectedRoute(PATHS.PROJECTS, <ProjectsPage />),
  protectedRoute(PATHS.PROJECT_NEW, <ProjectNewPage />),
  protectedRoute(PROJECT_PATTERNS.DETAIL, <ProjectDetailPage />),
  protectedRoute(PROJECT_PATTERNS.COMPLETE, <ProjectCompletePage />),

  protectedRoute(PROJECT_PATTERNS.MEETING_NEW, <MeetingNewPage />),
  protectedRoute(MEETING_PATTERNS.DETAIL, <MeetingResultPage />),
  protectedRoute(MEETING_PATTERNS.INTERVIEW, <MeetingInterviewPage />),
  protectedRoute(MEETING_PATTERNS.BOARD, <MeetingBoardPage />),
  protectedRoute(MEETING_PATTERNS.UPLOAD, <MeetingUploadPage />),
  protectedRoute(MEETING_PATTERNS.LOADING, <MeetingLoadingPage />),
  protectedRoute(MEETING_PATTERNS.SUMMARY, <MeetingSummaryPage />),
  protectedRoute(PROJECT_PATTERNS.MEETINGS, <MeetingsPage />),

  { path: '*', element: <NotFoundPage /> },
])
