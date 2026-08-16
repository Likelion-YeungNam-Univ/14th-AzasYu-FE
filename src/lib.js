export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const SERVICE_NAME = '이해했습니다! (아님)'

export const MEETING_TITLE = '회의'

export const API_BASE_URL = import.meta.env.VITE_API_URL

export const FIELD_LIMITS = {
  PROJECT_NAME: 100,
  PROJECT_DESCRIPTION: 1000,
  MEETING_TITLE: 150,
  MEETING_PURPOSE: 1000,
  AGENDA: 100,
}

export function alertOnTruncatedPaste(limit) {
  return (event) => {
    if (typeof limit !== 'number') return

    const input = event.currentTarget
    const pasted = event.clipboardData?.getData('text') ?? ''
    const selected = (input.selectionEnd ?? 0) - (input.selectionStart ?? 0)

    if (input.value.length - selected + pasted.length <= limit) return
    if (input.dataset.limitNotified) return

    input.dataset.limitNotified = '1'
    alert(`최대 ${limit}자까지 입력할 수 있어 뒷부분이 잘렸습니다.`)
  }
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export function formatDateWithWeekday(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const pad = (part) => String(part).padStart(2, '0')

  return `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())} (${WEEKDAYS[date.getDay()]})`
}

export const PATHS = {
  ROOT: '/',
  WELCOME: '/welcome',
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
  SUMMARY: '/projects/:projectId/meetings/:meetingId/summary',
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
  landing: { tone: 'onDark', nav: false, action: null },
}

export function buildNavItems(projectId, projectName) {
  const items = [{ label: '홈', href: PATHS.PROJECTS }]

  if (projectId && projectName) {
    items.push({ label: projectName, href: projectPath('DETAIL', projectId) })
  }

  items.push({ label: '지난 회의', href: PATHS.MEETINGS })

  return items
}
