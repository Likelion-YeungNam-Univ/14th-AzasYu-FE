import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus } from '@/components/icons/Plus'
import { Header } from '@/components/layout/Header'
import { Hero, HeroLayout } from '@/components/layout/Hero'
import { Button } from '@/components/ui/Button'
import { FilterTabs, type FilterTab } from '@/components/ui/FilterTabs'
import { ProjectCard, type Project } from '@/components/ui/ProjectCard'
import { HEADER_PRESETS } from '@/constants/header'
import { PATHS } from '@/routes/paths'

/*
 * Figma: Desktop - 29 (node 3:394), 1920 x 2190 — 내 프로젝트 (로그인 후 홈)
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   헤더          0 ~ 80        tone onLight (히어로가 y=80이라 헤더는 흰 배경 위)
 *   히어로        80 ~ 450      h-370
 *   히어로 콘텐츠  x230 y162 w634 h207 — 텍스트 109 + gap40 + "참여코드 입력" 58
 *   필터 탭       x230 y532 w337 h69   (탭 h51 + py-9)
 *   새 프로젝트    x1489 y541 h49, 오른쪽 정렬 (오른쪽 끝 1690.14)
 *   카드 그리드    y625 시작, 3열 470px, 가로 gap 25, 행 간격 484
 *   문서 높이      2190
 *
 * **그리드 전체 폭이 1460이다** — 470x3 + 25x2 = 1460, left 230 / right 230.
 * Desktop-41 테이블과 같은 폭이라 같은 컨테이너 규칙을 쓴다 (max-w-1460 + 중앙 정렬).
 * 좌우 여백을 px-[230px]로 고정하면 세로 스크롤바가 생길 때 폭이 모자란다 (§ 4 참고).
 *
 * 세로 리듬 (Figma 절대 y좌표에서 역산)
 *   히어로 bottom 450 → 필터 행 532        gap 82
 *   필터 행 bottom 601 → 그리드 625        gap 24
 *   그리드 bottom 2007.2 → 문서 2190       아래 여백 182.8
 */
const TABS: FilterTab[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'done', label: '완료' },
]

/*
 * 시안의 더미 데이터. 실제 API 연동은 범위 밖이다 (§ 1).
 * 시안은 프로젝트 3개가 3행 반복되는 형태라 그대로 9개를 둔다.
 *
 * **시안에 프로젝트 상태(진행 중/완료) 데이터가 없다.** 카드에 상태 표시가 아예 없어서
 * 필터를 실제로 걸 수가 없다 — 상태를 지어내지 않고 탭 선택만 동작시킨다.
 * API가 붙으면 Project에 status를 추가하고 여기서 거르면 된다.
 */
const BASE_PROJECTS: Project[] = [
  { id: '1', name: '신규 서비스 기획', participants: '이지혜 외 5명', date: '2026. 08. 09' },
  { id: '2', name: '앱 개선 프로젝트', participants: '박소연 외 7명', date: '2026. 07. 10' },
  { id: '3', name: '마케팅 전략 회의', participants: '이지혜 외 4명', date: '2026. 06. 20' },
]

const PROJECTS = [0, 1, 2].flatMap((row) =>
  BASE_PROJECTS.map((p) => ({ ...p, key: `${p.id}-${row}` })),
)

export function ProjectsPage() {
  const [filter, setFilter] = useState('all')
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
        {/* 필터 탭과 액션 버튼이 같은 행. Figma는 각각 y532 / y541이고 세로 중앙이 1px 차이다 */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 lg:mt-[82px]">
          <FilterTabs tabs={TABS} value={filter} onChange={setFilter} />
          <Button
            size="action"
            variant="subtle"
            onClick={() => navigate(PATHS.PROJECT_NEW)}
          >
            <Plus />
            새 프로젝트 만들기
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-[25px] gap-y-10 sm:grid-cols-2 lg:mt-[24px] lg:grid-cols-3 lg:gap-y-[69.8px]">
          {PROJECTS.map(({ key, ...project }) => (
            <ProjectCard key={key} project={project} />
          ))}
        </div>
      </div>
    </HeroLayout>
  )
}
