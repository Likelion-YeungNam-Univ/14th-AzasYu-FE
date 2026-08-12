import type { ReactNode } from 'react'
import { Header } from '@/components/layout/Header'
import { Hero, HeroLayout } from '@/components/layout/Hero'
import { Card } from '@/components/ui/Card'
import { HEADER_PRESETS } from '@/constants/header'
import { HERO_CARD_OVERLAP } from '@/constants/site'

/*
 * Figma: Desktop - 33 (node 1:466), 1920 x 2249 — AI 사전 인터뷰
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   히어로       0 ~ 670, 헤더가 위에 겹침 (tone onHero)
 *   히어로 텍스트  y229 — 48 Bold + gap16 + 18 SemiBold
 *   카드         x521 y401 878x1628 — px-48 py-40, rounded-30, shadow soft, gap-24
 *   문서 높이     2249
 *
 * 챗 UI 구성 (카드 자식 13개, 전부 gap 24)
 *   인트로 봇 메시지 1개 → (질문 블록 + 사용자 답변) x 6
 *
 * 봇 메시지     아바타 32 + gap8 + [ "AI 챗봇" 16 Medium / 말풍선 ]
 *              말풍선 bg #e3e3e3, px-20 py-12, rounded-20, 16 Medium, **행높이 1.5**
 *              라벨 top 기준 말풍선 top: 인트로 34, 질문 31
 * 질문 블록     "질문 N/6" 14 Medium + gap8 + 봇 메시지
 * 사용자 답변    오른쪽 정렬, bg #f6f6f6, px-20 py-12, **rounded-26**, 텍스트 폭 439 (2줄 → h71)
 *
 * 아바타는 양쪽 에셋이 완전히 같은 **`#D9D9D9` 단색 원**이라(diff로 확인) CSS로 그렸다.
 * 글리프가 아니라 색 도형이므로 ColorSwatches와 같은 판단이다.
 *
 * 시안에서 라벨은 ml-41, 말풍선은 ml-40이다. 한 컬럼에 넣으면 둘 중 하나가 1px 어긋나는데
 * 눈에 띄는 쪽인 **말풍선을 40에 맞췄다** (라벨이 1px 오른쪽).
 */

/*
 * 시안의 더미 대화. 실제 API 연동은 범위 밖이다 (§ 1).
 * **"@@님"은 시안에 그대로 적혀 있는 문자열이다** — 이름 치환용 자리로 보이지만
 * 바로 윗줄은 "지혜님"이라 일관되지 않는다. 지어내지 않고 시안 그대로 뒀다. 디자이너 확인 필요.
 */
const INTRO = [
  ['안녕하세요, 지혜님! 👋', '회의를 시작하기 전에 @@님의 생각을 먼저 들어볼게요.'],
  [
    '이 대화에서 나눈 의견은 익명으로 수집되니 부담 갖지 말고 편하게 이야기해주세요.',
    '정해진 답은 없어요. 지금 떠오르는 생각을 솔직하게 들려주시면 됩니다.',
  ],
]

const QUESTIONS = [
  {
    q: '이번에 기획하고 있는 서비스는 어떤 문제를 해결하기 위한 서비스라고 생각하시나요?',
    a: '저는 사람들이 필요한 서비스를 찾을 때 정보가 너무 흩어져 있어서 불편한 문제를 해결하는 서비스라고 생각해요.',
  },
  {
    q: '이 서비스가 가장 먼저 해결해야 할 사용자의 불편은 무엇이라고 생각하시나요?',
    a: '원하는 정보를 찾기까지 너무 많은 곳을 찾아봐야 한다는 점이 가장 큰 불편인 것 같아요.',
  },
  {
    q: '서비스에 꼭 필요하다고 생각하는 기능은 무엇인가요?',
    a: '사용자가 원하는 조건을 입력하면 필요한 정보를 한 번에 비교해서 보여주는 기능이 있었으면 좋겠어요.',
  },
  {
    q: '반대로, 이 서비스에서 굳이 없어도 된다고 생각하는 기능이 있나요?',
    a: '처음부터 기능을 너무 많이 넣으면 오히려 복잡해질 것 같아요. 핵심 기능에 집중하는 게 좋을 것 같습니다.',
  },
  {
    q: '서비스를 실제로 사용하게 된다면 가장 걱정되는 점은 무엇인가요?',
    a: '추천해주는 정보가 정말 나한테 맞는지 믿기 어려울 수 있을 것 같아요. 추천 기준이 어느 정도 보이면 좋겠어요.',
  },
  {
    q: '이번 회의에서 팀원들과 꼭 의견을 맞춰보고 싶은 부분이 있다면 무엇인가요?',
    a: '어떤 기능을 가장 먼저 개발할지 의견을 맞춰보고 싶어요. 각자 중요하다고 생각하는 기능이 조금씩 다른 것 같아요.',
  },
]

/** 라벨 행(22.4) 아래로 말풍선 top이 오는 위치. 인트로 34 / 질문 31 */
function BotMessage({
  children,
  bubbleTop,
}: {
  children: ReactNode
  bubbleTop: number
}) {
  return (
    <div className="flex gap-[8px]">
      <span className="mt-[2px] size-[32px] shrink-0 rounded-full bg-[#d9d9d9]" />
      <div className="flex min-w-0 flex-col">
        <p className="text-16 font-medium text-[#717171]">AI 챗봇</p>
        <div
          style={{ marginTop: bubbleTop - 22.4 }}
          className="text-16 w-fit rounded-[20px] bg-[#e3e3e3] px-[20px] py-[12px] leading-[1.5] font-medium text-[#717171]"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="rounded-[26px] bg-[#f6f6f6] px-[20px] py-[12px]">
        <p className="text-16 leading-[1.5] font-medium text-[#717171] lg:w-[439px]">
          {children}
        </p>
      </div>
    </div>
  )
}

export function MeetingInterviewPage() {
  return (
    <HeroLayout
      overlapHeader
      cardOverlap={HERO_CARD_OVERLAP}
      header={<Header {...HEADER_PRESETS.appOnHero} />}
      hero={
        <Hero
          size="lg"
          align="center"
          title="AI 사전 인터뷰"
          description="6개의 질문으로 생각을 정리해보세요."
        />
      }
    >
      <div className="flex w-full justify-center px-5 pb-16 sm:px-8 lg:pb-[220px]">
        {/*
         * 카드 높이 1628은 콘텐츠(40 ~ 1553.6)보다 34px 크다.
         * Desktop-30(778 vs 744)·31(1097 vs 1034)과 같이 디자이너가 프레임을 늘린 경우다.
         * 시안 높이를 재현해야 카드 바닥과 문서 높이가 맞으므로 그대로 둔다.
         *
         * `min-h`를 쓰는 이유: 답변 말풍선이 72px로 렌더되지만 Figma는 71로 잡는다
         * (텍스트 2줄 48 vs 47). 지금은 여유 안에 들어가지만, 문구가 길어져 줄이 늘면
         * 고정 높이에서는 Card의 overflow-clip에 잘린다.
         */}
        <Card className="w-full max-w-[878px] px-6 py-8 sm:px-10 lg:min-h-[1628px] lg:px-[48px] lg:py-[40px]">
          <div className="flex w-full flex-col gap-[24px]">
            <BotMessage bubbleTop={34}>
              {INTRO.map((lines, i) => (
                <p key={i}>
                  {lines[0]}
                  <br />
                  {lines[1]}
                </p>
              ))}
            </BotMessage>

            {QUESTIONS.map(({ q, a }, i) => (
              <div key={q} className="contents">
                <div className="flex flex-col gap-[8px]">
                  <p className="text-14 font-medium text-[#717171]">
                    질문 {i + 1}/{QUESTIONS.length}
                  </p>
                  <BotMessage bubbleTop={31}>{q}</BotMessage>
                </div>
                <UserMessage>{a}</UserMessage>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </HeroLayout>
  )
}
