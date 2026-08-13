import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import analyzingIllustration from '@/assets/icons/analyzing.svg'
import { Header } from '@/components/layout/Header'
import { HEADER_PRESETS } from '@/constants/header'
import { meetingPath } from '@/routes/paths'

/*
 * Figma: Desktop - 58 (node 3:850), 1920 x 1080 — 회의 분석 로딩
 *
 * 흐름: 회의 텍스트 업로드(35) → **이 화면** → 분석이 끝나면 회의 결과(36)
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   헤더        0 ~ 80    **히어로가 없다.** nav 3항목 + 로그아웃, 글자색 검정
 *                        (preset appOnWhite — 이 화면 때문에 새로 만들었다)
 *   일러스트     y376, 176.084x165, 가로 중앙
 *   텍스트 블록  y591, 가로 중앙, gap 12
 *     제목      48 SemiBold 검정
 *     부제      24 SemiBold #606060
 *   문서 높이    1080
 *
 * 일러스트 바닥 541 → 텍스트 591이므로 그 사이 간격은 50이다.
 *
 * 부제의 "최대 @분"에서 `@`는 **예상 소요 시간이 들어갈 자리**다. 서버가 그 값을 주므로
 * 연동 전까지는 시안 그대로 둔다.
 */

/*
 * ⚠️ **임시 구현: 2초 뒤 회의 결과로 넘어간다.**
 *
 * 원래는 백엔드가 "분석 완료"를 알려줄 때 이동해야 한다. API 연동이 아직 없어서
 * 화면 흐름만 볼 수 있도록 고정 지연을 뒀다 (사용자 확정, 2026-08-13).
 *
 * 연동할 때 할 일
 *   - setTimeout을 분석 상태 폴링이나 소켓 구독으로 교체
 *   - 부제의 "@분"을 서버가 준 예상 소요 시간으로 치환
 *   - 실패 상태 처리 (시안 없음)
 */
const FAKE_ANALYSIS_MS = 2000

export function MeetingLoadingPage() {
  const { projectId = '', meetingId = '' } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      // replace: 결과 화면에서 뒤로 가기를 눌렀을 때 로딩으로 되돌아오지 않게 한다
      navigate(meetingPath('DETAIL', projectId, meetingId), { replace: true })
    }, FAKE_ANALYSIS_MS)

    return () => clearTimeout(timer)
  }, [navigate, projectId, meetingId])

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.appOnWhite} />

      <main
        className="flex flex-col items-center px-5 pb-16 sm:px-8"
        aria-live="polite"
      >
        <img
          src={analyzingIllustration}
          alt=""
          className="mt-24 block h-[165px] w-[176.084px] max-w-none shrink-0 sm:mt-40 lg:mt-[296px]"
        />

        {/* 일러스트 바닥 → 제목 간격 50 */}
        <div className="mt-10 flex flex-col items-center gap-[12px] text-center lg:mt-[50px]">
          <h1 className="text-28 font-semibold text-black sm:text-34 lg:text-48">
            회의 내용을 꼼꼼히 분석하고 있어요
          </h1>
          <p className="text-18 font-semibold text-[#606060] sm:text-20 lg:text-24">
            회의 내용에 따라 최대 @분 정도 소요될 수 있어요.
          </p>
        </div>
      </main>
    </div>
  )
}
