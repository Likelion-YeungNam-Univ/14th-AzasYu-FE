import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import emptyMeetings from '@/assets/icons/empty-meetings.svg'
import { Copy, Plus } from '@/components/icons'
import { Header } from '@/components/layout'
import { StateView } from '@/components/states'
import { AvatarStack, Button, MeetingCard } from '@/components/ui'
import { API_BASE_URL, HEADER_PRESETS, projectPath } from '@/lib'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
})

const getProjectDetail = async (projectId) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/projects/${projectId}`, {
    method: 'GET',
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error(`프로젝트 상세 조회 실패: ${response.status}`)
  }

  return response.json()
}

const getProjectMeetings = async (projectId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/projects/${projectId}/meetings`,
    {
      method: 'GET',
      headers: authHeaders(),
    },
  )

  if (!response.ok) {
    throw new Error(`회의 목록 조회 실패: ${response.status}`)
  }

  return response.json()
}

const readJson = async (url) => {
  try {
    const response = await fetch(url, { headers: authHeaders() })

    if (!response.ok) return null

    return await response.json()
  } catch {
    return null
  }
}

const getMeetingProgress = async (meetingId) => {
  const [detail, record] = await Promise.all([
    readJson(`${API_BASE_URL}/api/v1/meetings/${meetingId}`),
    readJson(`${API_BASE_URL}/api/v1/meetings/${meetingId}/record`),
  ])

  const status = detail?.data?.interviewStatus

  return {
    participantsDone: status?.submittedCount ?? 0,
    participantsTotal:
      status?.totalParticipants ?? detail?.data?.participants?.length ?? 0,
    hasRecord: Boolean(record?.data),
  }
}

const toStartsAt = (meeting) => {
  if (!meeting.meetingDate) return meeting.startsAt ?? ''

  return meeting.startTime
    ? `${meeting.meetingDate}T${meeting.startTime}`
    : meeting.meetingDate
}

const toMeetingCards = async (rawMeetings) => {
  const progress = await Promise.all(
    rawMeetings.map((meeting) => getMeetingProgress(meeting.id)),
  )

  return rawMeetings.map((meeting, index) => ({
    ...meeting,
    startsAt: toStartsAt(meeting),
    ...progress[index],
  }))
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
        setMeetings(await toMeetingCards(meetingsResponse.data || []))
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

  const handleCopyJoinCode = () => {
    const joinCode = project?.joinCode

    if (!joinCode) return

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(joinCode)
      return
    }

    const textarea = document.createElement('textarea')

    textarea.value = joinCode
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'

    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  if (loading) {
    return <StateView size="screen" title="프로젝트를 불러오는 중입니다" />
  }

  if (error || !project) {
    return (
      <StateView
        variant="error"
        size="screen"
        title={error || '프로젝트를 찾을 수 없습니다.'}
      />
    )
  }

  return (
    <div className="min-h-svh w-full bg-white">
      <Header {...HEADER_PRESETS.appOnLight} omitProjectNav />

      <div className="w-full bg-[#f5f5f5] py-10 lg:h-[300px] lg:py-0">
        <div className="mx-auto flex w-full max-w-[562px] flex-col items-start gap-8 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:px-0 lg:pt-[70px]">
          <div className="flex shrink-0 flex-col items-start gap-[16px]">
            <p className="text-34 font-bold text-[#1c232b] lg:text-48">
              {project.name}
            </p>

            <button
              type="button"
              onClick={handleCopyJoinCode}
              aria-label={`참여코드 ${project.joinCode} 복사`}
              className="text-18 flex cursor-pointer items-center gap-[8px] font-medium text-[#858894] lg:text-20"
            >
              참여코드 {project.joinCode}
              <Copy className="h-[15px] w-[14px]" />
            </button>

            <AvatarStack members={project.members ?? []} />
          </div>

          <Button
            size="action"
            variant="subtle"
            className="shrink-0"
            onClick={() => navigate(projectPath('MEETING_NEW', projectId))}
          >
            <Plus />
            새 회의
          </Button>
        </div>
      </div>

      {meetings.length > 0 ? (
        <div className="mx-auto flex w-full max-w-[658px] flex-col gap-10 px-5 pt-10 pb-20 sm:px-8 lg:gap-[70px] lg:px-0 lg:pt-[70px] lg:pb-[150px]">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              projectId={projectId}
              meeting={meeting}
            />
          ))}
        </div>
      ) : (
        <StateView
          variant="empty"
          size="page"
          icon={
            <img
              src={emptyMeetings}
              alt=""
              className="block h-[48.036px] w-[62.997px] max-w-none shrink-0"
            />
          }
          title="아직 회의가 없어요"
          description="첫 회의를 만들어 프로젝트를 시작해보세요!"
        />
      )}
    </div>
  )
}
