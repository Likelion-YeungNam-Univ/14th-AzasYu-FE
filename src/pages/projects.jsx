import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import checkBadge from '@/assets/icons/check-badge.svg'
import { ArrowRight, Copy, Plus } from '@/components/icons'
import { Header, Hero, HeroLayout } from '@/components/layout'
import {
  Button,
  Card,
  ColorSwatches,
  MeetingCard,
  ProjectCard,
  TextAreaField,
  TextField,
} from '@/components/ui'
import {
  HEADER_PRESETS,
  HERO_CARD_OVERLAP,
  PATHS,
  projectPath,
  SAMPLE_PROJECT_NAME,
} from '@/lib'

const JOIN_CODE = 'A7K9-M2P4'

const BASE_PROJECTS = [
  { id: '1', name: '신규 서비스 기획', participants: '이지혜 외 5명', date: '2026. 08. 09' },
  { id: '2', name: '앱 개선 프로젝트', participants: '박소연 외 7명', date: '2026. 07. 10' },
  { id: '3', name: '마케팅 전략 회의', participants: '이지혜 외 4명', date: '2026. 06. 20' },
]

const PROJECTS = [0, 1, 2].flatMap((row) =>
  BASE_PROJECTS.map((p) => ({ ...p, key: `${p.id}-${row}` })),
)

export function ProjectsPage() {
  const navigate = useNavigate()

  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="md"
          align="left"
          title="내 프로젝트"
          description="참여할 프로젝트의 코드를 입력해주세요."
          descriptionWeight="semibold"
          footer={
            <Button size="inline" variant="secondaryOnHero">
              참여코드 입력
            </Button>
          }
        />
      }
    >
      <div className="mx-auto w-full max-w-[1460px] px-5 pb-20 sm:px-8 lg:px-0 lg:pb-[182.8px]">
        <div className="mt-10 flex lg:mt-[91px]">
          <Button
            size="action"
            variant="subtle"
            onClick={() => navigate(PATHS.PROJECT_NEW)}
          >
            <Plus />
            새 프로젝트 만들기
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-[25px] gap-y-10 sm:grid-cols-2 lg:mt-[35px] lg:grid-cols-3 lg:gap-y-[69.8px]">
          {PROJECTS.map(({ key, ...project }) => (
            <ProjectCard key={key} project={project} />
          ))}
        </div>
      </div>
    </HeroLayout>
  )
}

const FORM_COLUMN = 'w-full max-w-[562px]'

export function ProjectNewPage() {
  const [color, setColor] = useState(0)
  const navigate = useNavigate()

  return (
    <HeroLayout
      overlapHeader
      cardOverlap={HERO_CARD_OVERLAP}
      header={<Header {...HEADER_PRESETS.appOnHero} />}
      hero={
        <Hero
          size="lg"
          align="center"
          title="프로젝트 생성"
          description="함께할 프로젝트의 기본 정보를 입력해주세요."
          contentTop={220}
        />
      }
    >
      <div className="flex w-full justify-center px-5 pb-16 sm:px-8 lg:pb-[220px]">
        <Card className="w-full max-w-[869px] px-6 py-10 sm:px-10 lg:px-[152px] lg:py-[88px]">
          <div className="mx-auto flex w-full max-w-[565px] flex-col items-center gap-[34px]">
            <TextField
              tone="form"
              label="프로젝트 이름"
              placeholder="프로젝트 이름을 입력하세요."
              wrapperClassName={FORM_COLUMN}
            />

            <TextAreaField
              tone="form"
              label="프로젝트 설명"
              placeholder="프로젝트에 대해 간단히 설명해주세요."
              wrapperClassName={FORM_COLUMN}
            />

            <div className={`${FORM_COLUMN} flex flex-col gap-[18px]`}>
              <span className="text-20 font-medium text-[#717171]">프로젝트 색상</span>
              <ColorSwatches value={color} onChange={setColor} />
            </div>

            <Button
              className={FORM_COLUMN}
              onClick={() => navigate(projectPath('COMPLETE', '1'))}
            >
              프로젝트 생성
            </Button>
          </div>
        </Card>
      </div>
    </HeroLayout>
  )
}

export function ProjectCompletePage() {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.authApp} />

      <main className="flex flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[120px]">
        <div className="mt-24 flex flex-col items-center gap-[32px] sm:mt-40 lg:mt-[314px]">
          <img src={checkBadge} alt="" className="block size-[56.186px] shrink-0" />

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
              onClick={() => navigator.clipboard?.writeText(JOIN_CODE)}
              aria-label={`참여코드 ${JOIN_CODE} 복사`}
              className="text-20 flex cursor-pointer items-center gap-[10px] rounded-[33px] border border-solid border-[#606060] px-[18px] py-[14px] font-semibold whitespace-nowrap text-[#606060] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#606060]"
            >
              {JOIN_CODE}
              <Copy className="h-[22px] w-[20px]" />
            </button>

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

const DETAIL_MEETINGS = [
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

export function ProjectDetailPage() {
  const { projectId = '' } = useParams()

  const meetings = [...DETAIL_MEETINGS].sort((a, b) => b.sortKey - a.sortKey)

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
      <div className="flex w-full flex-col items-center gap-[32px] px-5 pb-16 sm:px-8 lg:pb-[229px]">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} projectId={projectId} meeting={meeting} />
        ))}
      </div>
    </HeroLayout>
  )
}
