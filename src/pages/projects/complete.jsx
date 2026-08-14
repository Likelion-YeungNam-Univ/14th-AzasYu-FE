import { useLocation, useNavigate, useParams } from 'react-router'
import checkBadge from '@/assets/icons/check-badge.svg'
import { ArrowRight, Copy } from '@/components/icons'
import { Header } from '@/components/layout'
import { HEADER_PRESETS, projectPath } from '@/lib'

export function ProjectCompletePage() {
  const { projectId = '' } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const joinCode = state?.joinCode ?? ''

  const handleCopyJoinCode = () => {
    if (!joinCode) return

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(joinCode)
      return
    }

    const textarea = document.createElement('textarea')

    textarea.value = joinCode
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'

    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
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
            <h1 className="text-28 text-center font-semibold text-black sm:text-34 lg:text-48 lg:whitespace-nowrap">
              프로젝트가 생성되었습니다!
            </h1>

            <p className="text-18 text-center font-semibold text-[#606060] sm:text-20 lg:text-24">
              팀원에게 아래 참여코드를 공유해주세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-[24px]">
            <button
              type="button"
              onClick={handleCopyJoinCode}
              aria-label={`참여코드 ${joinCode} 복사`}
              className="text-20 flex cursor-pointer items-center gap-[10px] rounded-[33px] border border-solid border-[#606060] px-[18px] py-[14px] font-semibold whitespace-nowrap text-[#606060] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#606060]"
            >
              {joinCode}
              <Copy className="h-[22px] w-[20px]" />
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(projectPath('DETAIL', projectId))
              }
              className="text-20 flex cursor-pointer items-center gap-[10px] rounded-[33px] border border-solid border-white bg-[#606060] px-[18px] py-[14px] font-semibold whitespace-nowrap text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#606060]"
            >
              프로젝트 보러가기
              <ArrowRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
