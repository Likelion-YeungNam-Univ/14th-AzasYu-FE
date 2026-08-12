import { useNavigate } from 'react-router'
import checkBadge from '@/assets/icons/check-badge.svg'
import { ArrowRight } from '@/components/icons/ArrowRight'
import { AuthHeader } from '@/components/layout/AuthHeader'
import { Button } from '@/components/ui/Button'
import { PATHS } from '@/routes/paths'

/*
 * Figma: Desktop - 39 (node 767:1603), 1920 x 1089
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   헤더          0 ~ 80        (Desktop-8과 출력이 동일해 AuthHeader 그대로 재사용)
 *   스택 top      427           (헤더 아래 347px)
 *   체크 아이콘    56.186 정사각
 *   gap           27
 *   제목          48px SemiBold, 행높이 1.4 → 67.2
 *   버튼          py-14 + 행높이 28 = 56, rounded-33, 1px #606060 테두리
 *   스택 바닥      660.386
 *
 * 시안은 스택을 left-714 / w-495로 두는데 1920 - (714+495) = 711이라 3px 비대칭이다.
 * § 3-3에 따라 디자이너의 미세 오차로 보고 정중앙 정렬로 구현한다.
 * w-495는 제목("회원가입이 완료되었습니다" 48px nowrap)의 natural width라 별도로 고정하지 않는다.
 *
 * 참고: 스택 중심 y가 543.7로 1089 프레임의 정중앙(544.5)과 거의 같다.
 * 즉 시안 의도는 "페이지 세로 중앙"일 수 있으나, 뷰포트 높이에 따라 값이 흔들리므로
 * § 3-2("lg 이상은 실측값과 정확히 일치")를 지키려고 헤더 기준 mt-347로 고정했다.
 *
 * lg 미만은 Figma에 시안이 없다 — 아래 값은 전부 Claude가 정한 것이다.
 *   제목은 시안이 쓰는 스케일(48 / 34 / 28) 안에서만 내린다.
 *   제목이 13자라 좁은 폭에서 nowrap이면 넘친다 → lg 미만에서만 줄바꿈을 허용한다.
 *   (index.css의 word-break: keep-all 때문에 어절 단위로 끊긴다)
 *   아이콘 56.186과 gap 27은 360px에서도 답답하지 않아 그대로 둔다.
 */
export function SignUpCompletePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-svh w-full bg-white">
      <AuthHeader />

      <main className="flex flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[140px]">
        <div className="mt-24 flex flex-col items-center gap-[27px] sm:mt-40 lg:mt-[347px]">
          <img
            src={checkBadge}
            alt=""
            className="block size-[56.186px] shrink-0"
          />

          <h1 className="text-28 text-center font-semibold text-black sm:text-34 lg:text-48 lg:whitespace-nowrap">
            회원가입이 완료되었습니다
          </h1>

          <Button
            variant="secondary"
            size="inline"
            onClick={() => navigate(PATHS.LOGIN)}
          >
            로그인하러 가기
            <ArrowRight />
          </Button>
        </div>
      </main>
    </div>
  )
}
