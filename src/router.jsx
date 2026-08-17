import { createBrowserRouter } from 'react-router'
import { SignUpCompletePage } from '@/pages/auth/signup-complete'
import { SignUpPage } from '@/pages/auth/signup'
import { WelcomePage } from '@/pages/auth/welcome'
import { NotFoundPage } from '@/pages/not-found'
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
import {
  RequireAuth,
  RequireGuest,
  RequireSignUpComplete,
  RootRedirect,
  ScrollToTop,
} from '@/components/guards'
import { MEETING_PATTERNS, PATHS, PROJECT_PATTERNS } from '@/lib'

const protectedRoute = (path, element) => ({
  path,
  element: <RequireAuth>{element}</RequireAuth>,
})

const guestRoute = (path, element) => ({
  path,
  element: <RequireGuest>{element}</RequireGuest>,
})

export const router = createBrowserRouter([
  {
    element: <ScrollToTop />,
    children: [
      { path: PATHS.ROOT, element: <RootRedirect /> },

      guestRoute(PATHS.WELCOME, <WelcomePage />),
      guestRoute(PATHS.SIGNUP, <SignUpPage />),
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
      protectedRoute(PATHS.MEETINGS, <MeetingsPage />),
      protectedRoute(PROJECT_PATTERNS.MEETINGS, <MeetingsPage />),

      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
