import { useEffect, useRef } from 'react'
import { Navigate, Outlet, ScrollRestoration } from 'react-router'
import { PATHS } from '@/lib'

export const SIGNUP_COMPLETE_KEY = 'signupCompleted'

export function RequireAuth({ children }) {
  const token = localStorage.getItem('accessToken')
  const notified = useRef(false)

  useEffect(() => {
    if (token || notified.current) return

    notified.current = true
    alert('해당 페이지는 로그인이 필요합니다.')
  }, [token])

  if (!token) {
    return <Navigate to={PATHS.WELCOME} replace />
  }

  return children
}

export function RequireGuest({ children }) {
  const token = localStorage.getItem('accessToken')

  if (token) {
    return <Navigate to={PATHS.PROJECTS} replace />
  }

  return children
}

export function RootRedirect() {
  const token = localStorage.getItem('accessToken')

  return <Navigate to={token ? PATHS.PROJECTS : PATHS.WELCOME} replace />
}

export function RequireSignUpComplete({ children }) {
  const completed = sessionStorage.getItem(SIGNUP_COMPLETE_KEY) === '1'

  if (!completed) {
    return <Navigate to={PATHS.SIGNUP} replace />
  }

  return children
}

export function ScrollToTop() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}
