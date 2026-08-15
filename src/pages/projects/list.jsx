import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from '@/components/icons'
import { Footer, Header, Hero, HeroLayout } from '@/components/layout'
import { Button, ProjectCard, TextField } from '@/components/ui'
import { API_BASE_URL, HEADER_PRESETS, PATHS } from '@/lib'

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

const getMeetingCount = async (projectId) => {
  const accessToken = localStorage.getItem('accessToken')

  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects/${projectId}/meetings`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!response.ok) return undefined

  const result = await response.json()

  return Array.isArray(result.data) ? result.data.length : undefined
}

const formatProjectDate = (value) => {
  const created = new Date(value)

  if (Number.isNaN(created.getTime())) return ''

  const pad = (part) => String(part).padStart(2, '0')

  return `${created.getFullYear()}. ${pad(created.getMonth() + 1)}. ${pad(created.getDate())}`
}

const formatParticipants = (members) => {
  if (!members?.length) return '참여자 없음'

  return members.length === 1
    ? members[0].name
    : `${members[0].name} 외 ${members.length - 1}명`
}

const toProjectCards = async (rawProjects) => {
  const counts = await Promise.all(
    rawProjects.map((project) =>
      getMeetingCount(project.id).catch(() => undefined),
    ),
  )

  return rawProjects.map((project, index) => ({
    ...project,

    // 프로젝트 생성일
    date: formatProjectDate(project.createdAt),

    // 프로젝트 참여자
    participants: formatParticipants(project.members),

    meetingCount: counts[index],
  }))
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

        setProjects(await toProjectCards(response.data))
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

      setProjects(await toProjectCards(projectsResponse.data))
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
          surface="light"
          title="내 프로젝트"
          description="진행 중인 프로젝트를 열거나, 참여코드로 새로운 팀에 합류해보세요."
          descriptionWeight="medium"
          footer={
            <Button
              size="inline"
              variant="secondary"
              className="bg-white"
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
      <div className="mx-auto w-full max-w-[1460px] px-5 pb-20 sm:px-8 lg:px-0 lg:pb-[151px]">
        {/* 새 프로젝트 만들기 */}
        <div className="mt-10 flex lg:mt-[111px]">
          <Button
            size="action"
            variant="subtle"
            onClick={() => navigate(PATHS.PROJECT_NEW)}
          >
            <Plus />
            새 프로젝트
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
          <div className="mt-6 grid grid-cols-1 gap-x-[25px] gap-y-10 sm:grid-cols-2 lg:mt-[35px] lg:grid-cols-3 lg:gap-y-[70px]">
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

      <Footer />
    </HeroLayout>
  )
}
