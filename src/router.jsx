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
import { MeetingUploadPage } from '@/pages/meetings/upload'
import { ProjectCompletePage } from '@/pages/projects/complete'
import { ProjectDetailPage } from '@/pages/projects/detail'
import { ProjectsPage } from '@/pages/projects/list'
import { ProjectNewPage } from '@/pages/projects/new'
import { MEETING_PATTERNS, PATHS, PROJECT_PATTERNS } from '@/lib'

export const router = createBrowserRouter([
  { path: PATHS.ROOT, element: <Navigate to={PATHS.WELCOME} replace /> },

  { path: PATHS.WELCOME, element: <WelcomePage /> },
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
