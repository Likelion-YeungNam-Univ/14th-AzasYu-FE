import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Header, Hero, HeroLayout } from '@/components/layout'
import {
  Button,
  ColorSwatches,
  TextAreaField,
  TextField,
} from '@/components/ui'
import {
  API_BASE_URL,
  FIELD_LIMITS,
  HEADER_PRESETS,
  projectPath,
} from '@/lib'

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

    if (!description.trim()) {
      alert('프로젝트 설명을 입력해주세요.')
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
      header={<Header {...HEADER_PRESETS.appOnLight} />}
      hero={
        <Hero
          size="sm"
          align="center"
          title="어떤 일을 함께 하나요?"
          description="함께할 프로젝트의 기본 정보를 입력해주세요."
          descriptionWeight="medium"
        />
      }
    >
      <div className="flex w-full justify-center px-5 pt-12 pb-16 sm:px-8 lg:pt-[60px] lg:pb-[126px]">
        <div className="w-full max-w-[562px]">
          <div className="flex w-full flex-col items-center gap-[34px]">
            <TextField
              tone="form"
              label="프로젝트 이름"
              required
              limit={FIELD_LIMITS.PROJECT_NAME}
              placeholder={`프로젝트 이름을 입력하세요. (${FIELD_LIMITS.PROJECT_NAME}자 이내)`}
              wrapperClassName={FORM_COLUMN}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <TextAreaField
              tone="form"
              label="프로젝트 설명"
              required
              limit={FIELD_LIMITS.PROJECT_DESCRIPTION}
              placeholder={`프로젝트에 대해 간단히 설명해주세요. (${FIELD_LIMITS.PROJECT_DESCRIPTION}자 이내)`}
              wrapperClassName={FORM_COLUMN}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className={`${FORM_COLUMN} flex flex-col gap-[18px]`}>
              <span className="text-20 font-medium text-[#1c232b]">
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
              {loading ? '프로젝트 생성 중...' : '프로젝트 만들기'}
            </Button>
          </div>
        </div>
      </div>
    </HeroLayout>
  )
}
