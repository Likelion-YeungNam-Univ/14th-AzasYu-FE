import { createBrowserRouter, Navigate } from 'react-router'
import {
  LoginPage,
  NotFoundPage,
  SignUpCompletePage,
  SignUpPage,
  WelcomePage,
} from '@/pages/auth'
import {
  MeetingBoardPage,
  MeetingInterviewPage,
  MeetingLoadingPage,
  MeetingNewPage,
  MeetingResultPage,
  MeetingsPage,
  MeetingUploadPage,
} from '@/pages/meetings'
import {
  ProjectCompletePage,
  ProjectDetailPage,
  ProjectNewPage,
  ProjectsPage,
} from '@/pages/projects'
import { MEETING_PATTERNS, PATHS, PROJECT_PATTERNS } from '@/lib'

export const router = createBrowserRouter([
  { path: PATHS.ROOT, element: <Navigate to={PATHS.WELCOME} replace /> },

  { path: PATHS.WELCOME, element: <WelcomePage /> },
  { path: PATHS.LOGIN, element: <LoginPage /> },
  { path: PATHS.SIGNUP, element: <SignUpPage /> },
  { path: PATHS.SIGNUP_COMPLETE, element: <SignUpCompletePage /> },

  { path: PATHS.PROJECTS, element: <ProjectsPage /> },
  { path: PATHS.PROJECT_NEW, element: <ProjectNewPage /> },
  { path: PROJECT_PATTERNS.DETAIL, element: <ProjectDetailPage /> },
  { path: PROJECT_PATTERNS.COMPLETE, element: <ProjectCompletePage /> },

  { path: PROJECT_PATTERNS.MEETING_NEW, element: <MeetingNewPage /> },
  { path: MEETING_PATTERNS.DETAIL, element: <MeetingResultPage /> },
  { path: MEETING_PATTERNS.INTERVIEW, element: <MeetingInterviewPage /> },
  { path: MEETING_PATTERNS.BOARD, element: <MeetingBoardPage /> },
  { path: MEETING_PATTERNS.UPLOAD, element: <MeetingUploadPage /> },
  { path: MEETING_PATTERNS.LOADING, element: <MeetingLoadingPage /> },
  { path: PROJECT_PATTERNS.MEETINGS, element: <MeetingsPage /> },
  
  { path: '*', element: <NotFoundPage /> },
])
