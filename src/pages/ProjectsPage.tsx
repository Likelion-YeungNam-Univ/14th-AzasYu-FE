import { useNavigate } from 'react-router'
import { Plus } from '@/components/icons/Plus'
import { Header } from '@/components/layout/Header'
import { Hero, HeroLayout } from '@/components/layout/Hero'
import { Button } from '@/components/ui/Button'
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
 *   새 프로젝트    x229 y541 h49 — **왼쪽 정렬** (개편 전에는 오른쪽 1489였다)
 *   카드 그리드    y625 시작, 3열 470px, 가로 gap 25, 행 간격 484
 *   문서 높이      2190
 *
 * **그리드 전체 폭이 1460이다** — 470x3 + 25x2 = 1460, left 230 / right 230.
 * Desktop-41 테이블과 같은 폭이라 같은 컨테이너 규칙을 쓴다 (max-w-1460 + 중앙 정렬).
 * 좌우 여백을 px-[230px]로 고정하면 세로 스크롤바가 생길 때 폭이 모자란다 (§ 4 참고).
 *
 * 세로 리듬 (Figma 절대 y좌표에서 역산)
 *   히어로 bottom 450 → 버튼 541           gap 91
 *   버튼 bottom 590 → 그리드 625           gap 35
 *   그리드 bottom 2007.2 → 문서 2190       아래 여백 182.8
 *
 * **2026-08-13 개편에서 필터 탭(전체/진행 중/완료)이 통째로 사라졌다.**
 * 상태 데이터가 없어 어차피 동작하지 않던 UI였다. FilterTabs 컴포넌트도 함께 지웠다.
 */
/*
 * 시안의 더미 데이터. 실제 API 연동은 범위 밖이다 (§ 1).
 * 시안은 프로젝트 3개가 3행 반복되는 형태라 그대로 9개를 둔다.
 *
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
        {/* 히어로 바닥 450 → 버튼 541 */}
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

        {/* 버튼 바닥 590 → 그리드 625 */}
        <div className="mt-6 grid grid-cols-1 gap-x-[25px] gap-y-10 sm:grid-cols-2 lg:mt-[35px] lg:grid-cols-3 lg:gap-y-[69.8px]">
          {PROJECTS.map(({ key, ...project }) => (
            <ProjectCard key={key} project={project} />
          ))}
        </div>
      </div>
    </HeroLayout>
  )
}
