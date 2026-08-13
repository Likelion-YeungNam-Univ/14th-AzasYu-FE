import { useParams } from 'react-router'
import { Copy } from '@/components/icons/Copy'
import { Header } from '@/components/layout/Header'
import { Hero, HeroLayout } from '@/components/layout/Hero'
import { MeetingCard, type Meeting } from '@/components/ui/MeetingCard'
import { HEADER_PRESETS } from '@/constants/header'
import { HERO_CARD_OVERLAP, SAMPLE_PROJECT_NAME } from '@/constants/site'

/*
 * Figma: Desktop - 46 (node 3:634), 1920 x 1521 — 프로젝트 상세
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   히어로        0 ~ 670, 헤더가 위에 겹침 (tone onHero)
 *   히어로 콘텐츠  x808 y229 w303 h108 — 제목(프로젝트명) 48 Bold + gap16 + 참여코드 행
 *   회의 카드      x521 y401 / y1232 / y2063 — 878x799, **간격 32**
 *   문서 높이      2708 (아래 주의 참고)
 *
 * 히어로 중심 x = 808 + 151.5 = 959.5로 정중앙이다.
 * 참여코드 행은 제목과 gap 16이라 Hero의 footer(gap 40)가 아니라 **description**으로 넘긴다.
 *
 * **이 화면에서 nav 4항목이 처음으로 시안과 그대로 일치한다.** URL에 projectId가 있어
 * Header가 프로젝트명과 "프로젝트 설정"을 렌더한다 (`buildNavItems` 참고).
 *
 * ⚠️ **시안 프레임 높이가 자기 내용보다 짧다.** 마지막 카드가 y2063 + 799 = 2862에서
 * 끝나는데 프레임은 2708이다. 디자이너가 카드를 3개로 늘리면서 프레임을 안 늘린 것으로
 * 보인다. 문서 높이를 2708에 맞추면 마지막 카드가 잘리므로 **내용에 맞춰 늘리고**
 * 아래 여백은 개편 전과 같은 229를 유지했다. 디자이너 확인 필요.
 */

/** 카드 사이 간격. Figma 카드 간격 831 - 카드 높이 799 = 32 */
const CARD_GAP = 'gap-[32px]'

/*
 * 시안의 더미 데이터. 실제 API 연동은 범위 밖이다 (§ 1).
 * 개편된 시안은 회의 3개를 최근순으로 보여준다.
 */
const MEETINGS: Meeting[] = [
  {
    id: '6',
    title: '6차 기획 회의',
    startsAt: '2026. 08. 12 오후 2:00',
    sortKey: 20260812,
    participantsDone: 4,
    participantsTotal: 6,
  },
  {
    id: '5',
    title: '5차 기획 회의',
    startsAt: '2026. 08. 04 오후 5:00',
    sortKey: 20260804,
    participantsDone: 6,
    participantsTotal: 6,
  },
  {
    id: '4',
    title: '4차 기획 회의',
    startsAt: '2026. 07. 25 오후 5:00',
    sortKey: 20260725,
    participantsDone: 6,
    participantsTotal: 6,
  },
]

/** 시안의 참여코드. 실제로는 프로젝트 조회 응답에서 받아야 한다 */
const JOIN_CODE = 'A7K9-M2P4'

export function ProjectDetailPage() {
  const { projectId = '' } = useParams()

  // 최근 회의 순
  const meetings = [...MEETINGS].sort((a, b) => b.sortKey - a.sortKey)

  return (
    <HeroLayout
      overlapHeader
      cardOverlap={HERO_CARD_OVERLAP}
      header={<Header {...HEADER_PRESETS.appOnHero} />}
      hero={
        <Hero
          size="lg"
          align="center"
          title={SAMPLE_PROJECT_NAME}
          description={
            <span className="inline-flex items-center gap-[8px]">
              참여코드 {JOIN_CODE}
              <Copy className="h-[15px] w-[14px]" />
            </span>
          }
        />
      }
    >
      <div
        className={`flex w-full flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[229px] ${CARD_GAP}`}
      >
        {meetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            projectId={projectId}
            meeting={meeting}
          />
        ))}
      </div>
    </HeroLayout>
  )
}
