import { useEffect, useState } from 'react' 
import { Link, useNavigate, useParams,useSearchParams } from 'react-router' 
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
  PATHS,
} from '@/lib'

const API_BASE_URL = import.meta.env.VITE_API_URL 

function formatMeetingDate(value) {
  if (!value) return ''

  const date = new Date(value)

  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

const TABLE_COLUMNS = [ 
  { label: '회의명', width: 300 }, 
  { label: '프로젝트', width: 280 }, 
  { label: '회의 목적', width: 530 }, 
  { label: '날짜', width: 180 }, 
] 

const MEETING_TITLE = '회의'

const INITIAL_AGENDA = [ ] 
 
const INITIAL_MEMBERS = [ ] 
 
const NEW_COLUMN = 'w-full max-w-[562px]' 
 
export function MeetingsPage() { 
  const [searchParams] = useSearchParams()

  const [meetings, setMeetings] = useState([]) 
  const [loading, setLoading] = useState(true) 
  const [error, setError] = useState('') 
 
  useEffect(() => {
  if (!projectId) {
    setLoading(false)
    setError('프로젝트 정보가 없습니다.')
    return
  }

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      setError('')

      const accessToken = localStorage.getItem('accessToken')

      const response = await fetch(
        `${API_BASE_URL}/api/v1/projects/${projectId}/meetings`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      const result = await response.json()

      console.log('회의 목록 조회 응답:', result)

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message ||
            '회의 목록을 불러오지 못했습니다.',
        )
      }

      setMeetings(result.data)
    } catch (error) {
      console.error('회의 목록 조회 실패:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  fetchMeetings()
}, [projectId])
 
  const tableRows = meetings.map((meeting) => ({ 
    id: meeting.id, 
 
    label: `${meeting.title} 회의 결과 보기`, 
 
    cells: [ 
      meeting.title, 
 
      <Link 
        key="project" 
        to={projectPath('DETAIL', projectId)} 
        className="relative z-20 hover:underline" 
      > 
        프로젝트 
      </Link>, 
 
      meeting.purpose, 
 
      formatMeetingDate(meeting.meetingDate), 
    ], 
 
    href: meetingPath( 
      'DETAIL', 
      projectId, 
      meeting.id, 
    ), 
  })) 
 
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
          {loading ? (
            <p>회의 목록을 불러오는 중...</p>
          ) : error ? (
            <p>{error}</p>
          ) : meetings.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="text-24 font-semibold text-[#717171]">
                아직 등록된 회의가 없어요.
              </p>

              <p className="mt-3 text-16 font-medium text-[#878787]">
                새로운 회의를 생성해보세요.
              </p>

              <Link
                to={
                  projectId
                    ? projectPath('MEETING_NEW', projectId)
                    : PATHS.PROJECTS
                }
                className="mt-8 rounded-[8px] bg-[#d0d0d0] px-6 py-3 text-16 font-semibold text-[#717171]"
              >
                회의 생성하기
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="mb-8 flex justify-end">
                <Link
                  to={projectPath('MEETING_NEW', projectId)}
                  className="rounded-[8px] bg-[#d0d0d0] px-6 py-3 text-16 font-semibold text-[#717171]"
                >
                  다음 회의 생성하기
                </Link>
              </div>

              <Table
                columns={TABLE_COLUMNS}
                rows={tableRows}
              />
            </div>
          )}
        </div>
      </div>
    </HeroLayout>
  )
}
 
export function MeetingNewPage() {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()

  // 초기 안건은 없음
  const [agenda, setAgenda] = useState([])

  const [members, setMembers] = useState(INITIAL_MEMBERS)

  const [title, setTitle] = useState('')
  const [purpose, setPurpose] = useState('')

  // 오늘 날짜를 기본값으로 사용
  const today = new Date()
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const [meetingDate, setMeetingDate] = useState(todayString)
  const [startTime, setStartTime] = useState('10:00')
  const [expectedDurationMinutes, setExpectedDurationMinutes] =
    useState(90)

  const [creating, setCreating] = useState(false)

  // 안건 입력창 표시 여부
  const [isAddingAgenda, setIsAddingAgenda] = useState(false)

  // 현재 작성 중인 안건
  const [newAgenda, setNewAgenda] = useState('')

  // 안건 추가
  const handleAddAgenda = () => {
    if (!newAgenda.trim()) {
      alert('안건을 입력해주세요.')
      return
    }

    setAgenda((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: newAgenda.trim(),
      },
    ])

    setNewAgenda('')
    setIsAddingAgenda(false)
  }

  // 안건 삭제
  const handleRemoveAgenda = (id) => {
    setAgenda((prev) =>
      prev.filter((item) => item.id !== id),
    )
  }

  const handleCreateMeeting = async () => {
    if (!projectId) {
      alert('프로젝트 정보가 없습니다.')
      return
    }

    if (!title.trim()) {
      alert('회의 제목을 입력해주세요.')
      return
    }

    if (!purpose.trim()) {
      alert('회의 목적을 입력해주세요.')
      return
    }

    try {
      setCreating(true)

      const userId = localStorage.getItem('userId')
      const accessToken = localStorage.getItem('accessToken')

      if (!userId || !accessToken) {
        alert('로그인이 필요합니다.')
        return
      }

      const requestBody = {
        title,
        purpose,

        // 추가된 안건만 서버로 전달
        agendas: agenda.map((item) => item.text),

        meetingDate,
        startTime,
        expectedDurationMinutes,

        participantUserIds: [Number(userId)],
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/projects/${projectId}/meetings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        },
      )

      console.log('회의 생성 요청:', requestBody)

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message ||
            '회의 생성에 실패했습니다.',
        )
      }

      console.log('회의 생성 성공:', result.data)

      alert('회의가 생성되었습니다.')

      navigate(projectPath('DETAIL', projectId), {
        replace: true,
      })
    } catch (error) {
      console.error('회의 생성 실패:', error)
      alert(error.message)
    } finally {
      setCreating(false)
    }
  }

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
          <div className="mx-auto flex w-full max-w-[565px] flex-col items-center gap-[34px]">

            {/* 회의 제목 */}
            <TextField
              tone="form"
              label="회의 제목"
              placeholder="회의 제목을 입력하세요."
              wrapperClassName={NEW_COLUMN}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* 회의 목적 */}
            <TextAreaField
              tone="form"
              label="회의 목적"
              placeholder="이번 회의의 목적을 간단히 작성해주세요."
              wrapperClassName={NEW_COLUMN}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />

            {/* 회의 안건 */}
            <div
              className={`${NEW_COLUMN} flex flex-col gap-[18px]`}
            >
              <span className="text-20 font-medium text-[#717171]">
                회의 안건
              </span>

              {/* 추가된 안건 */}
              {agenda.length > 0 && (
                <AgendaList
                  items={agenda}
                  onRemove={handleRemoveAgenda}
                />
              )}

              {/* 안건 입력 */}
              {isAddingAgenda && (
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    autoFocus
                    value={newAgenda}
                    onChange={(e) =>
                      setNewAgenda(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddAgenda()
                      }

                      if (e.key === 'Escape') {
                        setNewAgenda('')
                        setIsAddingAgenda(false)
                      }
                    }}
                    placeholder="회의 안건을 입력하세요."
                    className="text-16 min-w-0 flex-1 rounded-[8px] border border-[#d0d0d0] px-4 py-3 outline-none focus:border-[#606060]"
                  />

                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleAddAgenda}
                  >
                    추가
                  </Button>
                </div>
              )}

              {/* 안건 추가 버튼 */}
              {!isAddingAgenda && (
                <Button
                  variant="secondary"
                  size="small"
                  className="w-[117px]"
                  onClick={() => setIsAddingAgenda(true)}
                >
                  <Plus />
                  안건 추가
                </Button>
              )}
            </div>

            {/* 회의 일시 */}
            <div
              className={`${NEW_COLUMN} flex flex-col gap-[18px]`}
            >
              <span className="text-20 font-medium text-[#717171]">
                회의 일시
              </span>

              <div className="flex flex-wrap items-end gap-[16px]">

                {/* 날짜 */}
                <div className="flex flex-col gap-2">
                  <label className="text-14 font-medium text-[#717171]">
                    날짜
                  </label>

                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) =>
                      setMeetingDate(e.target.value)
                    }
                    className="text-16 h-[52px] w-[217px] rounded-[8px] border border-[#d0d0d0] bg-white px-4 font-medium text-[#717171] outline-none focus:border-[#606060]"
                  />
                </div>

                {/* 시작 시간 */}
                <div className="flex flex-col gap-2">
                  <label className="text-14 font-medium text-[#717171]">
                    시작 시간
                  </label>

                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) =>
                      setStartTime(e.target.value)
                    }
                    className="text-16 h-[52px] w-[163px] rounded-[8px] border border-[#d0d0d0] bg-white px-4 font-medium text-[#717171] outline-none focus:border-[#606060]"
                  />
                </div>

                {/* 예상 시간 */}
                <div className="flex flex-col gap-2">
                  <label className="text-14 font-medium text-[#717171]">
                    예상 시간
                  </label>

                  <select
                    value={expectedDurationMinutes}
                    onChange={(e) =>
                      setExpectedDurationMinutes(
                        Number(e.target.value),
                      )
                    }
                    className="text-16 h-[52px] w-[139px] rounded-[8px] border border-[#d0d0d0] bg-white px-4 font-medium text-[#717171] outline-none focus:border-[#606060]"
                  >
                    <option value={30}>30분</option>
                    <option value={60}>1시간</option>
                    <option value={90}>1시간 30분</option>
                    <option value={120}>2시간</option>
                    <option value={180}>3시간</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 참여자 */}
            <div
              className={`${NEW_COLUMN} flex flex-col gap-[18px]`}
            >
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
                      setMembers((prev) =>
                        prev.filter((m) => m !== name),
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* 회의 생성 */}
            <Button
              className={NEW_COLUMN}
              onClick={handleCreateMeeting}
              disabled={creating}
            >
              {creating
                ? '회의 생성 중...'
                : '회의 생성'}
            </Button>
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
          {`${MEETING_TITLE} 결과`} 
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
  const [content, setContent] = useState('') 
  const [uploading, setUploading] = useState(false) 
  const handleTextUpload = async () => { 
  if (!content.trim()) { 
    alert('회의 내용을 입력해주세요.') 
    return 
  } 
 
  try { 
    setUploading(true) 
 
    const accessToken = localStorage.getItem('accessToken') 
 
    if (!accessToken) { 
      alert('로그인이 필요합니다.') 
      return 
    } 
 
    const response = await fetch( 
      `${API_BASE_URL}/api/v1/meetings/${meetingId}/record`, 
      { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${accessToken}`, 
        }, 
        body: JSON.stringify({ 
          content, 
        }), 
      }, 
    ) 
 
    const result = await response.json() 
 
    if (!response.ok || !result.success) { 
      throw new Error( 
        result.error?.message || '회의 원문 등록에 실패했습니다.', 
      ) 
    } 
 
    // 원문 등록 성공 → 자동 분석 → 결과 페이지 
    navigate( 
      meetingPath('LOADING', projectId, meetingId), 
    ) 
  } catch (error) { 
    console.error('회의 원문 등록 실패:', error) 
    alert(error.message) 
  } finally { 
    setUploading(false) 
  } 
} 
const handleFileUpload = async (file) => { 
  try { 
    setUploading(true) 
 
    const accessToken = localStorage.getItem('accessToken') 
 
    if (!accessToken) { 
      alert('로그인이 필요합니다.') 
      return 
    } 
 
    const formData = new FormData() 
    formData.append('file', file) 
 
    const response = await fetch( 
      `${API_BASE_URL}/api/v1/meetings/${meetingId}/record/file`, 
      { 
        method: 'POST', 
        headers: { 
          Authorization: `Bearer ${accessToken}`, 
        }, 
        body: formData, 
      }, 
    ) 
 
    const result = await response.json() 
 
    if (!response.ok || !result.success) { 
      throw new Error( 
        result.error?.message || '회의 원문 등록에 실패했습니다.', 
      ) 
    } 
 
    // 원문 등록 성공 → 자동 분석 → 결과 페이지 
    navigate( 
      meetingPath('LOADING', projectId, meetingId), 
    ) 
  } catch (error) { 
    console.error('회의 파일 업로드 실패:', error) 
    alert(error.message) 
  } finally { 
    setUploading(false) 
  } 
} 
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
                  const file = e.target.files?.[0] 
 
                  if (file) { 
                    handleFileUpload(file) 
                  } 
                }} 
              /> 
            </label> 
 
            <p className="text-14 font-semibold text-[#717171]">또는</p> 
 
            <textarea 
              placeholder="텍스트 직접 입력하기" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              className="text-14 h-[491px] w-full max-w-[514px] resize-none rounded-[8px] bg-[#eaeaea] px-[24px] py-[14px] font-semibold text-[#717171] placeholder:text-[#717171]" 
            /> 
 
            <Button 
              className="w-full max-w-[514px]" 
              onClick={handleTextUpload} 
              disabled={uploading} 
            > 
              {uploading ? '회의 내용 등록 중...' : '회의 내용 등록'} 
            </Button> 
          </div> 
        </Card> 
      </div> 
    </HeroLayout> 
  ) 
} 
 
export function MeetingLoadingPage() { 
  const { projectId = '', meetingId = '' } = useParams() 
  const navigate = useNavigate() 
 
  useEffect(() => { 
    if (!meetingId) return 
 
    let stopped = false 
 
    const checkResult = async () => { 
      try { 
        const accessToken = localStorage.getItem('accessToken') 
 
        if (!accessToken) { 
          alert('로그인이 필요합니다.') 
          return 
        } 
 
        const response = await fetch(
          `${API_BASE_URL}/api/v1/meetings/${meetingId}/result`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )

        if (response.status === 404) {
          console.log('아직 분석 결과가 생성되지 않았습니다.')
          return
        }

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(
            result.error?.message ||
              '회의 분석 결과를 확인하지 못했습니다.',
          )
        }
 
        const status = result.data?.status 
 
        console.log('회의 분석 상태:', status) 
 
        if (status === 'GENERATED') { 
          if (stopped) return 
 
          navigate( 
            meetingPath('DETAIL', projectId, meetingId), 
            { replace: true }, 
          ) 
 
          return 
        } 
 
        if (status === 'FAILED') { 
          throw new Error( 
            result.data?.failureMessage || 
              '회의 분석에 실패했습니다.', 
          ) 
        } 
 
        // PENDING, PROCESSING 등의 상태라면 
        // 아무것도 하지 않고 다음 polling을 기다린다. 
      } catch (error) { 
        console.error('회의 분석 상태 확인 실패:', error) 
 
        if (!stopped) { 
          alert(error.message) 
        } 
      } 
    } 
 
    // 처음 한 번 바로 확인 
    checkResult() 
 
    // 이후 2초마다 상태 확인 
    const intervalId = setInterval(checkResult, 2000) 
 
    return () => { 
      stopped = true 
      clearInterval(intervalId) 
    } 
  }, [meetingId, projectId, navigate]) 
 
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
 
const RESULT_CONTAINER = 'mx-auto w-full max-w-[1460px] px-5 sm:px-8 lg:px-0' 
 
export function MeetingResultPage() { 
  const { projectId = '', meetingId = '' } = useParams() 
 
  const [result, setResult] = useState(null) 
  const [loading, setLoading] = useState(true) 
  const [error, setError] = useState('') 
 
  useEffect(() => { 
    if (!meetingId) return 
 
    const fetchResult = async () => { 
      try { 
        setLoading(true) 
        setError('') 
 
        const accessToken = localStorage.getItem('accessToken') 
 
        if (!accessToken) { 
          throw new Error('로그인이 필요합니다.') 
        } 
 
        const response = await fetch( 
          `${API_BASE_URL}/api/v1/meetings/${meetingId}/result`, 
          { 
            headers: { 
              Authorization: `Bearer ${accessToken}`, 
            }, 
          }, 
        ) 
 
        const data = await response.json() 
 
        if (!response.ok || !data.success) { 
          throw new Error( 
            data.error?.message || 
              '회의 분석 결과를 불러오지 못했습니다.', 
          ) 
        } 
 
        setResult(data.data) 
      } catch (error) { 
        console.error('회의 분석 결과 조회 실패:', error) 
        setError(error.message) 
      } finally { 
        setLoading(false) 
      } 
    } 
 
    fetchResult() 
  }, [meetingId]) 
 
  if (loading) { 
    return <p>회의 분석 결과를 불러오는 중...</p> 
  } 
 
  if (error) { 
    return <p>{error}</p> 
  } 
 
  if (!result) { 
    return <p>회의 분석 결과가 없습니다.</p> 
  } 
 
  if (result.status !== 'GENERATED') { 
    return ( 
      <p> 
        {result.failureMessage || '회의 분석에 실패했습니다.'} 
      </p> 
    ) 
  } 
 
  const resultSections = [ 
    { 
      label: '회의 목적', 
      content: result.meetingPurpose, 
    }, 
    { 
      label: '주요 논의 내용', 
      content: result.keyDiscussions, 
    }, 
    { 
      label: '회의에서 결정된 내용', 
      content: result.decisions, 
    }, 
    { 
      label: '추가로 확인할 내용', 
      content: result.followUpChecks, 
    }, 
  ] 
 
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
      <div 
        className={`${RESULT_CONTAINER} mt-10 flex flex-col gap-[52px] lg:mt-[82px]`} 
      > 
        {resultSections.map((section) => ( 
          <section 
            key={section.label} 
            className="flex flex-col gap-[28px]" 
          > 
            <h2 className="text-24 font-semibold text-[#717171] lg:text-28"> 
              {section.label} 
            </h2> 
 
            <div className="text-18 rounded-[14px] bg-[#eee] px-6 py-6 leading-[1.5] font-medium text-[#717171] sm:px-10 sm:py-[36px] lg:text-20"> 
              {section.content} 
            </div> 
          </section> 
        ))} 
      </div> 
 
      <div className="mt-20 w-full bg-[#eee] py-12 lg:mt-[161px] lg:py-[79px]"> 
        <div 
          className={`${RESULT_CONTAINER} flex flex-col gap-[28px]`} 
        > 
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
            {result.ambiguities?.map((ambiguity, i) => ( 
              <li 
                key={ambiguity.id} 
                className="flex items-start gap-[14px]" 
              > 
                <span className="text-20 flex size-[36px] shrink-0 items-center justify-center rounded-[10px] bg-white leading-[1.5] font-medium text-[#717171] lg:text-24"> 
                  {i + 1} 
                </span> 
 
                <div className="flex flex-col gap-[4px]"> 
                  <p className="text-18 font-medium text-[#717171] lg:text-24"> 
                    {ambiguity.expression} 
                  </p> 
 
                  <p className="text-16 font-medium text-[#878787] lg:text-20"> 
                    {ambiguity.reason} 
                  </p> 
                </div> 
              </li> 
            ))} 
          </ol> 
        </div> 
      </div> 
 
      <div className="h-16 lg:h-[531px]" /> 
    </HeroLayout> 
  ) 
} 
