import { useNavigate } from 'react-router'
import { ArrowRight } from '@/components/icons/ArrowRight'
import { Header } from '@/components/layout/Header'
import { Hero, HeroLayout } from '@/components/layout/Hero'
import { Button } from '@/components/ui/Button'
import { HEADER_PRESETS } from '@/constants/header'
import { PATHS } from '@/routes/paths'

/*
 * Figma: Desktop - 25 (node 3:454), 1920 x 1089 — 랜딩 (로그인 전 홈)
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   페이지 배경   **#f4f4f4** ← 다른 화면은 전부 흰 배경이다. 이 화면만 다르다
 *   헤더         0 ~ 80, 히어로 위에 겹침. preset **landing** (nav 없음, 오른쪽 "회원가입")
 *   히어로        0 ~ 670, align left
 *   콘텐츠        x229 y231 w634 — 텍스트 블록(48 Bold + gap14 + 20 SemiBold) + gap40 + 버튼
 *   문서 높이     1089 → 히어로 아래 419px이 #f4f4f4로 남는다
 *
 * `Hero`의 lg/left 기본 contentTop이 231이라 그대로 맞는다 (이 화면 값으로 정해둔 것).
 * **`HEADER_PRESETS.landing`이 여기서 처음 실제로 쓰인다.**
 *
 * 히어로 아래에 콘텐츠가 없어서 HeroLayout의 children은 비어 있다.
 * 그래도 헤더 겹침·배경 처리를 같은 방식으로 두려고 HeroLayout을 쓴다.
 */
export function WelcomePage() {
  const navigate = useNavigate()

  return (
    <HeroLayout
      overlapHeader
      background="bg-[#f4f4f4]"
      header={<Header {...HEADER_PRESETS.landing} />}
      hero={
        <Hero
          size="lg"
          align="left"
          title="우리... 같은 얘기하고 있는 거 맞죠?"
          description="모두가 같은 의미로 이해할 수 있도록, 협업의 시작"
          descriptionWeight="semibold"
          footer={
            <Button
              size="inline"
              variant="secondaryOnHero"
              onClick={() => navigate(PATHS.LOGIN)}
            >
              로그인하기
              <ArrowRight />
            </Button>
          }
        />
      }
    >
      {null}
    </HeroLayout>
  )
}
