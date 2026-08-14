import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Copy } from '@/components/icons'
import { Header, Hero, HeroLayout } from '@/components/layout'
import { Button, MeetingCard } from '@/components/ui'
import {
  API_BASE_URL,
  HEADER_PRESETS,
  HERO_CARD_OVERLAP,
  projectPath,
} from '@/lib'

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
      header={
        <Header {...HEADER_PRESETS.appOnHero} projectName={project.name} />
      }
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
