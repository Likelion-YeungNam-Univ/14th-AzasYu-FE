import { PATHS } from '@/lib'

const SESSION_KEYS = ['accessToken', 'userId', 'userName']

const AUTH_ENDPOINT = '/api/v1/auth/'

const UNAUTHORIZED_STATUSES = [401, 403]

let handling = false

export function clearSession() {
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key))
}

function handleUnauthorized() {
  if (handling) return

  handling = true

  clearSession()
  alert('로그인이 만료되었습니다. 다시 로그인해주세요.')
  window.location.replace(PATHS.WELCOME)
}

function requestUrl(input) {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href

  return input?.url ?? ''
}

export function installUnauthorizedHandler() {
  const originalFetch = window.fetch

  window.fetch = async (...args) => {
    const response = await originalFetch(...args)

    if (
      UNAUTHORIZED_STATUSES.includes(response.status) &&
      !requestUrl(args[0]).includes(AUTH_ENDPOINT) &&
      localStorage.getItem('accessToken')
    ) {
      handleUnauthorized()
    }

    return response
  }
}
