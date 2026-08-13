import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import analyzingIllustration from '@/assets/icons/analyzing.svg'
import uploadIcon from '@/assets/icons/upload.svg'
import warningIcon from '@/assets/icons/warning-triangle.svg'
import { Calendar, Plus } from '@/components/icons'
import { Header, Hero, HeroLayout } from '@/components/layout'
import {
  AgendaList,
  Button,
  Card,
  Chip,
  FieldBox,
  Table,
  TextAreaField,
  TextField,
} from '@/components/ui'
import {
  HEADER_PRESETS,
  HERO_CARD_OVERLAP,
  meetingPath,
  projectPath,
} from '@/lib'

const MEETING_TITLE = '6차 기획 회의'

const TABLE_COLUMNS = [
  { label: '회의명', width: 300 },
  { label: '프로젝트', width: 280 },
  { label: '주요 안건', width: 530 },
  { label: '날짜', width: 180 },
]

const PAST_MEETINGS = [
  { id: '6', projectId: '1', project: '신규 서비스 기획', title: '6차 기획 회의', agenda: '최종 서비스 방향 및 출시 일정 확정', date: '2026. 08. 12 (수)' },
  { id: '5', projectId: '1', project: '신규 서비스 기획', title: '5차 기획 회의', agenda: '프로토타입 검토 및 개선사항 논의', date: '2026. 08. 12 (수)' },
  { id: '4', projectId: '1', project: '신규 서비스 기획', title: '4차 기획 회의', agenda: '서비스 화면 구성 및 기능 우선순위 결정', date: '2026. 08. 12 (수)' },
  { id: '3', projectId: '1', project: '신규 서비스 기획', title: '3차 기획 회의', agenda: '서비스 핵심 기능 및 사용자 경험 논의', date: '2026. 08. 12 (수)' },
  { id: '2', projectId: '1', project: '신규 서비스 기획', title: '2차 기획 회의', agenda: '타깃 사용자 및 핵심 니즈 분석', date: '2026. 08. 12 (수)' },
  { id: '1', projectId: '1', project: '신규 서비스 기획', title: '1차 기획 회의', agenda: '서비스 목표 및 문제 정의', date: '2026. 08. 12 (수)' },
  { id: '0', projectId: '3', project: '마케팅 전략 회의', title: '마케팅 방향성 논의', agenda: '서비스 방향 설정', date: '2026. 08. 12 (수)' },
]

const TABLE_ROWS = PAST_MEETINGS.map((m) => ({
  id: m.id,
  label: `${m.title} 회의 결과 보기`,
  cells: [
    m.title,
    <Link
      key="project"
      to={projectPath('DETAIL', m.projectId)}
      className="relative z-20 hover:underline"
    >
      {m.project}
    </Link>,
    m.agenda,
    m.date,
  ],
  href: meetingPath('DETAIL', m.projectId, m.id),
}))

export function MeetingsPage() {
  return (
    <HeroLayout
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="left"
          title="지난 회의"
          description="회의를 클릭하면 회의 결과와 다르게 이해될 수 있는 부분을 다시 확인할 수 있어요."
        />
      }
    >
      <div className="mx-auto w-full max-w-[1460px] px-5 pb-16 sm:px-8 lg:px-0 lg:pb-[92px]">
        <div className="mt-[40px] lg:mt-[82px]">
          <Table columns={TABLE_COLUMNS} rows={TABLE_ROWS} />
        </div>
      </div>
    </HeroLayout>
  )
}

const INITIAL_AGENDA = [
  { id: 'a1', text: '주요 기능 확정' },
  { id: 'a2', text: '타겟 논의' },
  { id: 'a3', text: '개발 일정 및 역할 분담' },
]

const INITIAL_MEMBERS = ['이지혜', '박소연', '이승민']

const NEW_COLUMN = 'w-full max-w-[562px]'

export function MeetingNewPage() {
  const [agenda, setAgenda] = useState(INITIAL_AGENDA)
  const [members, setMembers] = useState(INITIAL_MEMBERS)

  return (
    <HeroLayout
      overlapHeader
      cardOverlap={HERO_CARD_OVERLAP}
      header={<Header {...HEADER_PRESETS.appOnHero} />}
      hero={
        <Hero
          size="lg"
          align="center"
          title="회의 생성"
          description="새로운 회의를 시작해보세요."
        />
      }
    >
      <div className="flex w-full justify-center px-5 pb-16 sm:px-8 lg:pb-[175px]">
        <Card className="w-full max-w-[869px] px-6 py-10 sm:px-10 lg:px-[152px] lg:py-[88px]">
          <div className="mx-auto flex w-full max-w-[565px] flex-col items-center gap-[34px] lg:min-h-[1097px]">
            <TextField
              tone="form"
              label="회의 제목"
              placeholder="회의 제목을 입력하세요."
              wrapperClassName={NEW_COLUMN}
            />

            <TextAreaField
              tone="form"
              label="회의 목적"
              placeholder="이번 회의의 목적을 간단히 작성해주세요."
              wrapperClassName={NEW_COLUMN}
            />

            <div className={`${NEW_COLUMN} flex flex-col gap-[18px]`}>
              <span className="text-20 font-medium text-[#717171]">회의 안건</span>
              <AgendaList
                items={agenda}
                onRemove={(id) => setAgenda((prev) => prev.filter((a) => a.id !== id))}
              />
              <Button variant="secondary" size="small" className="-mt-[4px] w-[117px]">
                <Plus />
                안건 추가
              </Button>
            </div>

            <div className={`${NEW_COLUMN} flex flex-col gap-[18px] lg:max-w-[565px]`}>
              <span className="text-20 font-medium text-[#717171]">회의 일시</span>
              <div className="flex flex-wrap items-center gap-[22px]">
                <FieldBox className="w-[217px]" icon={<Calendar />}>
                  2026. 08. 12 (수)
                </FieldBox>
                <FieldBox className="w-[163px]">오전 10:00</FieldBox>
                <FieldBox className="w-[139px]">약 1시간 30분</FieldBox>
              </div>
            </div>

            <div className={`${NEW_COLUMN} flex flex-col gap-[18px]`}>
              <TextField
                tone="form"
                label="참여자"
                placeholder="이름을 입력하여 검색하세요."
              />
              <div className="-mt-[5px] flex flex-wrap gap-[12px]">
                {members.map((name) => (
                  <Chip
                    key={name}
                    label={name}
                    onRemove={() =>
                      setMembers((prev) => prev.filter((m) => m !== name))
                    }
                  />
                ))}
              </div>
            </div>

            <Button className={NEW_COLUMN}>회의 생성</Button>
          </div>
        </Card>
      </div>
    </HeroLayout>
  )
}

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

function BotMessage({ children, bubbleTop }) {
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

function UserMessage({ children }) {
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
        <p className="text-24 mt-10 font-semibold text-[#717171] lg:mt-[94px] lg:text-28">
          {MEETING_TITLE}
        </p>

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

export function MeetingUploadPage() {
  const { projectId = '', meetingId = '' } = useParams()
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
          title={`${MEETING_TITLE} 텍스트 업로드`}
          contentTop={258}
        />
      }
    >
      <div className="flex w-full justify-center px-5 pb-16 sm:px-8 lg:pb-[191px]">
        <Card className="w-full max-w-[878px] px-6 py-10 sm:px-10 lg:px-[40px] lg:py-[99px]">
          <div className="flex w-full flex-col items-center gap-[20px]">
            <img
              src={uploadIcon}
              alt=""
              className="block h-[36px] w-[48px] max-w-none shrink-0"
            />

            <div className="flex flex-col items-center gap-[12px] py-[10px] text-center">
              <p className="text-20 font-semibold text-[#717171] lg:text-24">
                회의 내용을 분석해볼까요?
              </p>
              <p className="text-16 font-medium text-[#878787] lg:text-18">
                회의 내용을 담은 TXT, DOCX, PDF 파일을 업로드해주세요.
              </p>
            </div>

            <label className="text-20 flex w-full max-w-[282px] cursor-pointer items-center justify-center rounded-[8px] bg-[#d0d0d0] px-[24px] py-[14px] font-semibold whitespace-nowrap text-[#717171] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#606060]">
              파일 업로드
              <input
                type="file"
                accept=".txt,.docx,.pdf"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    navigate(meetingPath('LOADING', projectId, meetingId))
                  }
                }}
              />
            </label>

            <p className="text-14 font-semibold text-[#717171]">또는</p>

            <textarea
              placeholder="텍스트 직접 입력하기"
              className="text-14 h-[491px] w-full max-w-[514px] resize-none rounded-[8px] bg-[#eaeaea] px-[24px] py-[14px] font-semibold text-[#717171] placeholder:text-[#717171]"
            />
          </div>
        </Card>
      </div>
    </HeroLayout>
  )
}

const FAKE_ANALYSIS_MS = 2000

export function MeetingLoadingPage() {
  const { projectId = '', meetingId = '' } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
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

const MEETING_TIME = '2026. 08. 12 오후 2:00 - 4:00'

const RESULT_SECTIONS = [
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

const RESULT_CONTAINER = 'mx-auto w-full max-w-[1460px] px-5 sm:px-8 lg:px-0'

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
      <div className={`${RESULT_CONTAINER} mt-10 flex flex-col gap-[52px] lg:mt-[82px]`}>
        {RESULT_SECTIONS.map((section, i) => (
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

      <div className="mt-20 w-full bg-[#eee] py-12 lg:mt-[161px] lg:py-[79px]">
        <div className={`${RESULT_CONTAINER} flex flex-col gap-[28px]`}>
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
                <p className="text-18 font-medium text-[#717171] lg:text-24">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="h-16 lg:h-[531px]" />
    </HeroLayout>
  )
}
