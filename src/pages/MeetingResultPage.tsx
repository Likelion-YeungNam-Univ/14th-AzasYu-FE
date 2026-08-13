import warningIcon from '@/assets/icons/warning-triangle.svg'
import { Header } from '@/components/layout/Header'
import { Hero, HeroLayout } from '@/components/layout/Hero'
import { HEADER_PRESETS } from '@/constants/header'

/*
 * Figma: Desktop - 36 (node 3:3), 1920 x 3097 — 회의 결과 (AI 분석)
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   헤더         0 ~ 80      tone onLight (히어로가 y=80)
 *   히어로        80 ~ 350    h-270(sm), 텍스트 x230 y162 — 48 Bold + gap14 + 20 **Regular**
 *   섹션 목록     x230 y432 1460x1604, 섹션 간 gap 52
 *   하단 밴드     y2197 **1920 전체 폭** h369, bg #eee
 *   경고 블록     x230 y2276 1460x211 (밴드 안, 위아래 79 여백)
 *   문서 높이     3097  ← 밴드 바닥(2566) 아래로 531px 흰 여백이 있다
 *
 * 섹션 하나 = 라벨 28 SemiBold + gap28 + 박스(bg #eee, px-40 py-36, rounded-14)
 * 박스 안은 불릿 목록 20 Medium **행높이 1.5**, `list-disc` 들여쓰기 30.
 * 1460 폭에서 불릿이 전부 한 줄이라 섹션 높이가 항목 수로 결정된다 (1줄 = 30).
 *
 * 밴드만 1460 컨테이너 밖으로 나가 화면 전체 폭을 쓴다.
 *
 * **시안에 "추가로 확인할 내용" 섹션이 제목·불릿까지 똑같이 두 번 들어 있다.**
 * 복사 실수로 보이지만, 빼면 문서 높이가 281px 줄어 시안과 어긋난다.
 * § 1에 따라 시안 그대로 두고 사용자에게 알렸다. 디자이너 확인 후 지울 것.
 */

/* 시안의 더미 분석 결과. 실제로는 AI 분석 응답에서 받아야 한다 (§ 1) */
const MEETING_TITLE = '6차 기획 회의'
const MEETING_TIME = '2026. 08. 12 오후 2:00 - 4:00'

const SECTIONS = [
  {
    label: '회의 목적',
    items: [
      '새로운 서비스의 방향을 설정하고, 핵심 기능과 초기 아이디어를 구체화했습니다.',
    ],
  },
  {
    label: '주요 논의 내용',
    items: [
      '사용자가 실제로 겪는 불편을 먼저 파악하고, 이를 바탕으로 서비스 방향을 설정하기로 했습니다.',
      '기존 서비스와 차별화할 수 있는 핵심 기능이 필요하다는 의견이 있었습니다.',
      '초기에는 많은 기능을 추가하기보다 핵심 기능 중심으로 MVP를 제작하기로 했습니다.',
      '실제 사용자 테스트를 통해 서비스의 사용성과 개선점을 확인할 필요가 있다는 의견이 나왔습니다.',
    ],
  },
  {
    label: '회의에서 결정된 내용',
    items: [
      '초기 버전은 핵심 기능에 집중하고, 이후 사용자 피드백을 바탕으로 기능을 확장합니다.',
      '다음 회의 전까지 경쟁 서비스 및 사용자 조사 결과를 정리합니다.',
    ],
  },
  {
    label: '추가로 확인할 내용',
    items: [
      'AI를 어느 단계까지 활용할 것인지',
      '경쟁 서비스와 어떤 점에서 차별화할 것인지',
      '가장 먼저 서비스를 사용할 핵심 타깃은 누구인지',
    ],
  },
  // 시안에 그대로 중복돼 있는 섹션 (위와 제목·내용 동일) — 디자이너 확인 필요
  {
    label: '추가로 확인할 내용',
    items: [
      'AI를 어느 단계까지 활용할 것인지',
      '경쟁 서비스와 어떤 점에서 차별화할 것인지',
      '가장 먼저 서비스를 사용할 핵심 타깃은 누구인지',
    ],
  },
  {
    label: '역할 및 할 일',
    items: [
      '이지혜 - 사용자 문제 및 핵심 타깃 정의',
      '박소연 - 서비스 사용 흐름 설계',
      '이승민 - 핵심 기능 구현 가능 여부 검토',
      '최도훈 - 사용자 조사 결과 정리',
    ],
  },
]

const AMBIGUITIES = [
  '핵심 기능의 범위를 어디까지로 볼 것인지에 대한 기준이 명확하지 않습니다.',
  '테스트 대상이 누구인지, 몇 명을 대상으로 진행할 것인지 정해지지 않았습니다.',
  '어떤 서비스를 경쟁 대상으로 보고, 어떤 부분을 차별화할 것인지 명확하지 않습니다.',
]

const CONTAINER = 'mx-auto w-full max-w-[1460px] px-5 sm:px-8 lg:px-0'

export function MeetingResultPage() {
  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="left"
          title={`${MEETING_TITLE} 결과`}
          description={MEETING_TIME}
        />
      }
    >
      {/* 히어로 바닥 350 → 섹션 목록 432 */}
      <div className={`${CONTAINER} mt-10 flex flex-col gap-[52px] lg:mt-[82px]`}>
        {SECTIONS.map((section, i) => (
          <section key={`${section.label}-${i}`} className="flex flex-col gap-[28px]">
            <h2 className="text-24 font-semibold text-[#717171] lg:text-28">
              {section.label}
            </h2>
            <ul className="text-18 flex list-disc flex-col rounded-[14px] bg-[#eee] px-6 py-6 leading-[1.5] font-medium text-[#717171] sm:px-10 sm:py-[36px] lg:text-20">
              {section.items.map((item) => (
                <li key={item} className="ms-[30px]">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* 밴드만 1460 컨테이너 밖으로 나가 화면 전체 폭을 쓴다 */}
      <div className="mt-20 w-full bg-[#eee] py-12 lg:mt-[161px] lg:py-[79px]">
        <div className={`${CONTAINER} flex flex-col gap-[28px]`}>
          <div className="flex items-center gap-[12px]">
            <img
              src={warningIcon}
              alt=""
              className="block h-[31px] w-[34px] max-w-none shrink-0"
            />
            <h2 className="text-24 font-semibold text-[#717171] lg:text-28">
              다르게 이해될 수 있는 부분
            </h2>
          </div>

          <ol className="flex flex-col gap-[18px]">
            {AMBIGUITIES.map((text, i) => (
              <li key={text} className="flex items-center gap-[14px]">
                <span className="text-20 flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-white leading-[1.5] font-medium text-[#717171] lg:text-24">
                  {i + 1}
                </span>
                <p className="text-18 font-medium text-[#717171] lg:text-24">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* 시안은 밴드 바닥(2566) 아래로 531px 흰 여백을 둔다 */}
      <div className="h-16 lg:h-[531px]" />
    </HeroLayout>
  )
}
