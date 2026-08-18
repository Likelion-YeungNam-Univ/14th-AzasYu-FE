import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import checkBadge from '@/assets/icons/check-badge.svg'
import { ArrowRight, Copy } from '@/components/icons'
import { Header } from '@/components/layout'
import { Toast } from '@/components/toast'
import { API_BASE_URL, copyText, HEADER_PRESETS, projectPath } from '@/lib'

export function ProjectCompletePage() {
  const { projectId = '' } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const [joinCode, setJoinCode] = useState(state?.joinCode ?? '')

  useEffect(() => {
    if (joinCode || !projectId) return

    let cancelled = false

    const fetchJoinCode = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')

        const response = await fetch(
          `${API_BASE_URL}/api/v1/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )

        const result = await response.json()

        if (!response.ok || !result.success || !result.data?.joinCode) return

        if (!cancelled) {
          setJoinCode(result.data.joinCode)
        }
      } catch (error) {
        console.error('참여코드 조회 실패:', error)
      }
    }

    fetchJoinCode()

    return () => {
      cancelled = true
    }
  }, [joinCode, projectId])

  const [copyMessage, setCopyMessage] = useState('')

  const handleCopyJoinCode = async () => {
    if (!joinCode) return

    const copied = await copyText(joinCode)

    setCopyMessage(copied ? '참여코드를 복사했습니다.' : '복사하지 못했습니다.')
  }

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.authApp} />

      <main className="flex flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[120px]">
        <div className="mt-24 flex flex-col items-center gap-[32px] sm:mt-40 lg:mt-[314px]">
          <img
            src={checkBadge}
            alt=""
            className="block size-[56.186px] shrink-0"
          />

          <div className="flex flex-col items-center gap-[12px]">
            <h1 className="text-28 text-center font-bold text-ink sm:text-34 lg:text-48 lg:whitespace-nowrap">
              프로젝트가 생성되었습니다!
            </h1>

            <p className="text-16 text-center font-medium text-muted sm:text-18 lg:text-20">
              팀원에게 아래 참여코드를 공유해주세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-[24px]">
            <button
              type="button"
              onClick={handleCopyJoinCode}
              aria-label={`참여코드 ${joinCode} 복사`}
              className="text-20 flex cursor-pointer items-center gap-[10px] rounded-[33px] border border-solid border-ink px-[18px] py-[14px] font-semibold whitespace-nowrap text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {joinCode}
              <Copy className="h-[22px] w-[20px]" />
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(projectPath('DETAIL', projectId))
              }
              className="text-20 flex cursor-pointer items-center gap-[10px] rounded-[33px] border border-solid border-white bg-ink px-[18px] py-[14px] font-semibold whitespace-nowrap text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              프로젝트 보러가기
              <ArrowRight />
            </button>
          </div>
        </div>
      </main>

      <Toast message={copyMessage} onDone={() => setCopyMessage('')} />
    </div>
  )
}
