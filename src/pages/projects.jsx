import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
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
  meetingPath,
  projectPath,
} from '@/lib'
const API_BASE_URL = import.meta.env.VITE_API_URL

const getMyProjects = async () => {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`프로젝트 조회 실패: ${response.status}`)
  }

  return response.json()
}

const createProject = async (data) => {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    },
  )

  if (!response.ok) {
    throw new Error(`프로젝트 생성 실패: ${response.status}`)
  }

  return response.json()
}

const joinProject = async (joinCode) => {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects/join`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        joinCode,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`프로젝트 참여 실패: ${response.status}`)
  }

  return response.json()
}

const getProjectDetail = async (projectId) => {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects/${projectId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`프로젝트 상세 조회 실패: ${response.status}`)
  }

  return response.json()
}

const getProjectMeetings = async (projectId) => {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects/${projectId}/meetings`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`회의 목록 조회 실패: ${response.status}`)
  }

  return response.json()
}

export function ProjectsPage() {
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 프로젝트 참여 관련 상태
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinError, setJoinError] = useState('')

  // 내 프로젝트 목록 조회
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getMyProjects()

        console.log('프로젝트 API 응답:', response)

        const formattedProjects = response.data.map((project) => ({
          ...project,

          // 프로젝트 생성일
          date: new Date(project.createdAt).toLocaleDateString('ko-KR'),

          // 프로젝트 참여자
          participants:
            project.members?.length > 0
              ? project.members.length === 1
                ? project.members[0].name
                : `${project.members[0].name} 외 ${project.members.length - 1}명`
              : '참여자 없음',
        }))

        setProjects(formattedProjects)
      } catch (error) {
        console.error(error)
        setError('프로젝트를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleJoinProject = async () => {
    if (!joinCode.trim()) {
      setJoinError('참여코드를 입력해주세요.')
      return
    }

    try {
      setJoinLoading(true)
      setJoinError('')

      const response = await joinProject(joinCode.trim())

      console.log('프로젝트 참여 응답:', response)

      if (!response.success) {
        setJoinError(
          response.error?.message || '프로젝트 참여에 실패했습니다.',
        )
        return
      }

      setIsJoinModalOpen(false)
      setJoinCode('')
      setJoinError('')

      // 프로젝트 목록 다시 조회
      const projectsResponse = await getMyProjects()

      const formattedProjects = projectsResponse.data.map((project) => ({
        ...project,
        date: new Date(project.createdAt).toLocaleDateString('ko-KR'),
        participants:
          project.members?.length > 0
            ? project.members.length === 1
              ? project.members[0].name
              : `${project.members[0].name} 외 ${project.members.length - 1}명`
            : '참여자 없음',
      }))

      setProjects(formattedProjects)
    } catch (error) {
      console.error(error)
      setJoinError('프로젝트 참여에 실패했습니다.')
    } finally {
      setJoinLoading(false)
    }
  }

  const handleCloseJoinModal = () => {
    setIsJoinModalOpen(false)
    setJoinCode('')
    setJoinError('')
  }

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
            <Button
              size="inline"
              variant="secondaryOnHero"
              onClick={() => {
                setIsJoinModalOpen(true)
                setJoinError('')
              }}
            >
              참여코드 입력
            </Button>
          }
        />
      }
    >
      <div className="mx-auto w-full max-w-[1460px] px-5 pb-20 sm:px-8 lg:px-0 lg:pb-[182.8px]">
        {/* 새 프로젝트 만들기 */}
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

        {/* 로딩 */}
        {loading && (
          <div className="mt-10 text-center">
            프로젝트를 불러오는 중입니다...
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div className="mt-10 text-center text-red-500">
            {error}
          </div>
        )}

        {/* 프로젝트 목록 */}
        {!loading && !error && (
          <div className="mt-6 grid grid-cols-1 gap-x-[25px] gap-y-10 sm:grid-cols-2 lg:mt-[35px] lg:grid-cols-3 lg:gap-y-[69.8px]">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}
      </div>

      {/* 프로젝트 참여 모달 */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <div className="w-full max-w-[500px] rounded-[24px] bg-white p-8">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-28 font-semibold text-black">
                  프로젝트 참여
                </h2>

                <p className="mt-2 text-16 text-[#717171]">
                  참여코드를 입력해주세요.
                </p>
              </div>

              <TextField
                tone="form"
                label="참여코드"
                placeholder="참여코드를 입력하세요."
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value)
                  setJoinError('')
                }}
                wrapperClassName="w-full"
              />

              {joinError && (
                <p className="text-14 text-red-500">
                  {joinError}
                </p>
              )}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={handleCloseJoinModal}
                >
                  취소
                </Button>

                <Button
                  className="flex-1"
                  onClick={handleJoinProject}
                  disabled={joinLoading}
                >
                  {joinLoading ? '참여 중...' : '프로젝트 참여'}
                </Button>
              </div>

              <button
                type="button"
                onClick={handleCloseJoinModal}
                className="text-14 text-[#717171]"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </HeroLayout>
  )
}

const FORM_COLUMN = 'w-full max-w-[562px]'


export function ProjectNewPage() {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(0)

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      alert('프로젝트 이름을 입력해주세요.')
      return
    }

    try {
      setLoading(true)

      const response = await createProject({
        name: projectName,
        description,
      })

      console.log('프로젝트 생성 응답:', response)

      const projectId = response.data.id
      const joinCode = response.data.joinCode

      navigate(projectPath('COMPLETE', projectId), {
        state: { joinCode },
      })
    } catch (error) {
      console.error(error)
      alert('프로젝트 생성에 실패했습니다.')
    } finally {
      setLoading(false)
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
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <TextAreaField
              tone="form"
              label="프로젝트 설명"
              placeholder="프로젝트에 대해 간단히 설명해주세요."
              wrapperClassName={FORM_COLUMN}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className={`${FORM_COLUMN} flex flex-col gap-[18px]`}>
              <span className="text-20 font-medium text-[#717171]">
                프로젝트 색상
              </span>

              <ColorSwatches
                value={color}
                onChange={setColor}
              />
            </div>

            <Button
              className={FORM_COLUMN}
              onClick={handleCreateProject}
              disabled={loading}
            >
              {loading ? '프로젝트 생성 중...' : '프로젝트 생성'}
            </Button>
          </div>
        </Card>
      </div>
    </HeroLayout>
  )
}

export function ProjectCompletePage() {
  const { projectId = '' } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const joinCode = state?.joinCode ?? ''

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

          <div className="flex flex-wrap items-center justify-center gap-[24px]">
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(joinCode)}
              aria-label={`참여코드 ${joinCode} 복사`}
              className="text-20 flex cursor-pointer items-center gap-[10px] rounded-[33px] border border-solid border-[#606060] px-[18px] py-[14px] font-semibold whitespace-nowrap text-[#606060] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#606060]"
            >
              {joinCode}
              <Copy className="h-[22px] w-[20px]" />
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(projectPath('DETAIL', projectId))
              }
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

export function ProjectDetailPage() {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        const [projectResponse, meetingsResponse] = await Promise.all([
          getProjectDetail(projectId),
          getProjectMeetings(projectId),
        ])

        console.log('프로젝트 상세 API 응답:', projectResponse)
        console.log('회의 목록 API 응답:', meetingsResponse)

        if (!projectResponse.success) {
          throw new Error(
            projectResponse.error?.message ||
              '프로젝트를 불러오지 못했습니다.',
          )
        }

        if (!meetingsResponse.success) {
          throw new Error(
            meetingsResponse.error?.message ||
              '회의 목록을 불러오지 못했습니다.',
          )
        }

        setProject(projectResponse.data)
        setMeetings(meetingsResponse.data || [])
      } catch (error) {
        console.error('프로젝트 상세 조회 실패:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProjectDetail()
    }
  }, [projectId])

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        프로젝트를 불러오는 중입니다...
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex min-h-svh items-center justify-center text-red-500">
        {error || '프로젝트를 찾을 수 없습니다.'}
      </div>
    )
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
          title={project.name}
          description={
            <span className="inline-flex items-center gap-[8px]">
              참여코드 {project.joinCode}
              <Copy className="h-[15px] w-[14px]" />
            </span>
          }
        />
      }
    >
      <div className="flex w-full flex-col items-center px-5 pb-16 sm:px-8 lg:pb-[229px]">

      {meetings.length > 0 ? (
        <div className="flex w-full max-w-[878px] flex-col gap-[24px]">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              projectId={projectId}
              meeting={meeting}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-24 text-center">
          <p className="text-24 font-semibold text-[#717171]">
            아직 등록된 회의가 없어요.
          </p>

          <p className="mt-3 text-16 font-medium text-[#878787]">
            새로운 회의를 생성해보세요.
          </p>

          <Button
            className="mt-8"
            onClick={() =>
              navigate(projectPath('MEETING_NEW', projectId))
            }
          >
            회의 생성하기
          </Button>
        </div>
      )}
      </div>
    </HeroLayout>
  )
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-4 bg-white px-5 text-center">
      <p className="text-28 font-semibold text-black">페이지를 찾을 수 없습니다</p>
      <p className="text-16 font-medium text-[#717171]">
        주소가 바뀌었거나 삭제된 페이지일 수 있어요.
      </p>
      <Link
        to={PATHS.PROJECTS}
        className="text-18 mt-2 font-medium text-[#606060] underline underline-offset-4"
      >
        홈으로 가기
      </Link>
    </div>
  )
}