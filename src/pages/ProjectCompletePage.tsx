import { useNavigate, useParams } from 'react-router'
import checkBadge from '@/assets/icons/check-badge.svg'
import { ArrowRight } from '@/components/icons/ArrowRight'
import { Copy } from '@/components/icons/Copy'
import { Header } from '@/components/layout/Header'
import { HEADER_PRESETS } from '@/constants/header'
import { projectPath } from '@/routes/paths'

/*
 * Figma: Desktop - 51 (node 3:606), 1920 x 1080 — 프로젝트 생성 완료
 *
 * Desktop-39(회원가입 완료)와 골격이 같다. 헤더 + 세로 중앙 스택.
 * 다른 점은 ① 부제가 있고 ② 마지막 줄에 참여코드 알약과 이동 버튼이 나란히 온다는 것.
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   헤더        0 ~ 80        preset authApp — 생김새는 auth와 같지만 "홈"이 /projects다
 *                            (로그인 후 화면이라 로그인 전 홈으로 보내면 안 된다)
 *   스택        x712 y394 w495, gap 32
 *   체크 아이콘  56.186 정사각
 *   제목        48px SemiBold 검정
 *   부제        24px SemiBold #606060, 제목과 gap 12
 *   마지막 행    참여코드 알약 + "프로젝트 보러가기" 버튼, **gap 24**
 *     참여코드   1px #606060 / rounded-33 / px-18 py-14 / gap-10 → 높이 58
 *                코드 20px SemiBold #606060 + 복사 아이콘 20x22
 *     보러가기   bg #606060 + 1px 흰 테두리 / 20px SemiBold 흰 글씨 + 화살표
 *   스택 바닥    684.99
 *
 * 스택 중심 x = 712 + 247.5 = 959.5로 정중앙(960)이다. w-495는 제목의 natural width라
 * 고정하지 않는다 (Desktop-39와 같은 판단).
 *
 * lg 미만은 Figma에 시안이 없다 — 아래 값은 Claude가 정한 것이다 (§ 3-2).
 * 제목이 길어(13자) 좁은 폭에서 nowrap이면 넘치므로 lg 미만에서만 줄바꿈을 허용한다.
 */

/*
 * 시안의 참여코드. 실제로는 프로젝트 생성 API 응답에서 받아야 한다 (§ 1).
 * Desktop-46(프로젝트 상세)에도 같은 코드가 적혀 있다.
 */
const JOIN_CODE = 'A7K9-M2P4'

export function ProjectCompletePage() {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()

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

          {/*
           * 참여코드 알약 + "프로젝트 보러가기"가 gap 24로 나란히 온다.
           *
           * 둘 다 Button(inline)과 치수가 같지만 gap이 10이라(Button은 12) 그대로 쓸 수 없다
           * — cn()이 단순 concat이라 SIZE 맵의 gap을 덮을 수 없다 (§ 3-3). 직접 조립했다.
           */}
          <div className="flex flex-wrap items-center justify-center gap-[24px]">
            {/*
             * 클릭하면 코드를 클립보드에 복사한다. **시안에 "복사됨" 상태가 없어서**
             * 성공 표시는 지어내지 않았다 (Checkbox·ColorSwatches와 같은 처리).
             */}
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(JOIN_CODE)}
              aria-label={`참여코드 ${JOIN_CODE} 복사`}
              className="text-20 flex cursor-pointer items-center gap-[10px] rounded-[33px] border border-solid border-[#606060] px-[18px] py-[14px] font-semibold whitespace-nowrap text-[#606060] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#606060]"
            >
              {JOIN_CODE}
              <Copy className="h-[22px] w-[20px]" />
            </button>

            {/*
             * 테두리가 흰색이라 흰 배경에서는 보이지 않지만, Figma가 stroke를 프레임 크기에
             * 포함시키므로 높이 58을 맞추려면 있어야 한다 (알약과 같은 높이가 된다).
             */}
            <button
              type="button"
              onClick={() => navigate(projectPath('DETAIL', projectId))}
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
