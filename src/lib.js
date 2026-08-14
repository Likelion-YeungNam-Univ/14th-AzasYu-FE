export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const SERVICE_NAME = '이해했습니다! (아님)'

export const SAMPLE_PROJECT_NAME = '신규 서비스 기획'

export const HERO_CARD_OVERLAP = 269

export const PATHS = {
  ROOT: '/',
  WELCOME: '/welcome',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SIGNUP_COMPLETE: '/signup/complete',
  PROJECTS: '/projects',
  PROJECT_NEW: '/projects/new',
  MEETINGS: '/meetings',
}

export const PROJECT_PATTERNS = {
  DETAIL: '/projects/:projectId',
  COMPLETE: '/projects/:projectId/complete',
  MEETING_NEW: '/projects/:projectId/meetings/new',
  MEETINGS: '/projects/:projectId/meetings',
}

export const MEETING_PATTERNS = {
  DETAIL: '/projects/:projectId/meetings/:meetingId',
  INTERVIEW: '/projects/:projectId/meetings/:meetingId/interview',
  BOARD: '/projects/:projectId/meetings/:meetingId/board',
  UPLOAD: '/projects/:projectId/meetings/:meetingId/upload',
  LOADING: '/projects/:projectId/meetings/:meetingId/loading',
}

export function projectPath(section, projectId) {
  return PROJECT_PATTERNS[section].replace(':projectId', projectId)
}

export function meetingPath(section, projectId, meetingId) {
  return MEETING_PATTERNS[section]
    .replace(':projectId', projectId)
    .replace(':meetingId', meetingId)
}

export const HEADER_PRESETS = {
  appOnHero: { tone: 'onHero', nav: true },
  appOnLight: { tone: 'onLight', nav: true },
  appOnWhite: { tone: 'onDark', nav: true },
  auth: {
    tone: 'onDark',
    nav: false,
    action: { label: '홈', href: PATHS.WELCOME },
  },
  authApp: {
    tone: 'onDark',
    nav: false,
    action: { label: '홈', href: PATHS.PROJECTS },
  },
  landing: {
    tone: 'onHero',
    nav: false,
    action: { label: '회원가입', href: PATHS.SIGNUP },
  },
}

export function buildNavItems(projectId, projectName = SAMPLE_PROJECT_NAME) {
  const items = [{ label: '홈', href: PATHS.PROJECTS }]

  if (projectId) {
    items.push({ label: projectName, href: projectPath('DETAIL', projectId) })
  }

  items.push({ label: '지난 회의', href: PATHS.MEETINGS })

  return items
}
