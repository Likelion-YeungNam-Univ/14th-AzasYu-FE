import { Header } from '@/components/layout/Header'
import { Hero, HeroLayout } from '@/components/layout/Hero'
import { HEADER_PRESETS } from '@/constants/header'

/*
 * Figma: Desktop - 34 (node 1:256), 1920 x 1532 — 익명 아이디어 보드
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   헤더        0 ~ 80     tone onLight (히어로가 y=80)
 *   히어로       80 ~ 350   h-270(sm), 텍스트 x230 y162 — 48 Bold + gap14 + 20 **SemiBold**
 *   회의명       x230 y444  28 SemiBold #717171
 *   카드 그리드   y525 시작, 3열 470x265, gap 25, 행 간격 290
 *   문서 높이    1532
 *
 * 그리드 폭 1460(470x3 + 25x2)으로 Desktop-29·37과 같다 → 같은 컨테이너 규칙.
 *
 * **카드 배경색이 카드마다 다르다** (#d1d1d1 / #e6e6e6 / #cfcfcf가 섞여 있다).
 * 규칙이 보이지 않고 같은 색이 반복되므로 회색 플레이스홀더로 본다 (§ 1).
 * 실제로는 작성자별 색이나 랜덤일 수 있다 — 컬러가 나오면 이 데이터만 교체하면 된다.
 *
 * **시안에 프레임 밖으로 벗어난 이미지가 하나 있다** (`image 261`, node `1:292`):
 * x1690 y1201에 **1930x379** 크기로 놓여 있어 1920 프레임을 1700px이나 넘어간다.
 * opacity 26%에 pointer-events도 없다. 디자이너가 흘린 잔여물로 보고 **넣지 않았다.**
 * 의도된 것이면 알려달라고 사용자에게 전달했다.
 *
 * 카드 하나만 `items-center`이고 나머지는 `items-start`인데, 텍스트 높이(193)가
 * 카드 안쪽 높이(265 - 36x2 = 193)와 같아 **렌더 결과가 동일하다.** 전부 items-start로 뒀다.
 */

/* 시안의 회의명. 실제로는 회의 조회 응답에서 받아야 한다 (§ 1) */
const MEETING_TITLE = '6차 기획 회의'

/*
 * 시안의 더미 아이디어 9개. 배경색도 시안 값 그대로다 (§ 1 — 색을 지어내지 않는다).
 * 읽기 순서(행 우선)대로 나열했다.
 */
const IDEAS = [
  { id: 1, color: '#d1d1d1', text: '추천 결과가 나온 이유를 함께 보여주면 좋겠어요.' },
  { id: 2, color: '#e6e6e6', text: '처음 사용하는 사람도 별도의 설명 없이 바로 이해할 수 있는 간단한 구조였으면 좋겠어요.' },
  { id: 3, color: '#cfcfcf', text: '처음에는 핵심 기능만 제공하고, 필요한 기능을 단계적으로 추가하는 게 좋을 것 같아요.' },
  { id: 4, color: '#e6e6e6', text: '사용자가 자주 사용하는 기능을 첫 화면에서 바로 찾을 수 있게 하면 좋겠어요.' },
  { id: 5, color: '#d1d1d1', text: '다른 사람의 실제 사용 후기를 확인할 수 있으면 좋겠어요.' },
  { id: 6, color: '#e6e6e6', text: '개인정보를 많이 수집해야 한다면 사용자들이 부담을 느낄 것 같아요.' },
  { id: 7, color: '#d1d1d1', text: 'AI 챗봇을 통해 사용자가 궁금한 점을 바로 해결할 수 있게 하면 좋겠어요.' },
  { id: 8, color: '#e6e6e6', text: '사용자가 원하는 조건을 직접 설정해서 검색할 수 있으면 좋겠어요.' },
  { id: 9, color: '#cfcfcf', text: '자주 사용하는 기능을 개인화해서 배치할 수 있으면 좋겠어요.' },
]

export function MeetingBoardPage() {
  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="left"
          title="아이디어 보드"
          description="모두의 생각을 한곳에"
          descriptionWeight="semibold"
        />
      }
    >
      <div className="mx-auto w-full max-w-[1460px] px-5 pb-16 sm:px-8 lg:px-0 lg:pb-[162px]">
        {/* 히어로 바닥 350 → 회의명 444 */}
        <p className="text-24 mt-10 font-semibold text-[#717171] lg:mt-[94px] lg:text-28">
          {MEETING_TITLE}
        </p>

        {/* 회의명 바닥 483.2 → 카드 525 */}
        <ul className="mt-6 grid grid-cols-1 gap-[25px] sm:grid-cols-2 lg:mt-[41.8px] lg:grid-cols-3">
          {IDEAS.map((idea) => (
            <li
              key={idea.id}
              style={{ backgroundColor: idea.color }}
              className="text-20 flex min-h-[265px] rounded-[14px] px-[24px] py-[24px] font-semibold text-[#717171] sm:px-[40px] sm:py-[36px] lg:h-[265px] lg:text-24"
            >
              {idea.text}
            </li>
          ))}
        </ul>
      </div>
    </HeroLayout>
  )
}
