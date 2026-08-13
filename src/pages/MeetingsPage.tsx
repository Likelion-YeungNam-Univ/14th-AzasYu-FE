import { Header } from '@/components/layout/Header'
import { HEADER_PRESETS } from '@/constants/header'
import { Hero, HeroLayout } from '@/components/layout/Hero'
import { Link } from 'react-router'
import { Table, type TableColumn, type TableRow } from '@/components/ui/Table'
import { meetingPath, projectPath } from '@/routes/paths'

/*
 * Figma: Desktop - 41 (node 3:745), 1920 x 1150
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   헤더        0 ~ 80        tone onLight (히어로가 y=80이라 헤더는 흰 배경 위)
 *   히어로      80 ~ 350      h-270, 그라데이션 2겹
 *   히어로 텍스트 x230 y162 w634 h109 — 제목 48 Bold h67 + gap14 + 부제 20 Regular h28
 *   테이블      left 230 top 432 w-1452 **h-626**, rounded-35, 1px #717171, px-70 py-29
 *   헤더 행     h-76, 본문 행 h-70 x**7** (마지막 행은 아래 선 없음), 행 폭 1310
 *   문서 높이   1150
 *
 * 테이블 바닥 = 432 + 626 = 1058. 아래 여백 = 1150 - 1058 = 92.
 * (행이 x=71 y=30에서 시작하는 건 px-70 py-29 + 테두리 1px이다 — Figma는 stroke를
 *  프레임 크기에 포함시킨다. Button 58px과 같은 규칙.)
 *
 * lg 미만은 Figma에 시안이 없다. 테이블은 컬럼 폭을 유지하고 컨테이너 안에서
 * 가로 스크롤한다 (Table 컴포넌트 주석 참고).
 */
/* 폭 합 300+280+530+180 + 꺾쇠 20 = 1310으로 내부 폭과 정확히 맞는다 */
const COLUMNS: TableColumn[] = [
  { label: '회의명', width: 300 },
  { label: '프로젝트', width: 280 },
  { label: '주요 안건', width: 530 },
  { label: '날짜', width: 180 },
]

/*
 * 시안의 더미 데이터. 실제 API 연동은 범위 밖이다 (§ 1).
 *
 * 이 화면은 특정 프로젝트가 아니라 **사용자가 소속된 회의 전체**를 보여주므로
 * 행마다 소속 프로젝트가 다를 수 있다. 그래서 회의 링크를 만들려면 projectId가
 * 행 데이터에 있어야 한다 (URL이 /projects/:projectId/meetings/:meetingId라서).
 * 시안에는 프로젝트가 하나뿐이라 더미는 전부 같은 projectId를 쓴다.
 */
const MEETINGS = [
  { id: '6', projectId: '1', project: '신규 서비스 기획', title: '6차 기획 회의', agenda: '최종 서비스 방향 및 출시 일정 확정', date: '2026. 08. 12 (수)' },
  { id: '5', projectId: '1', project: '신규 서비스 기획', title: '5차 기획 회의', agenda: '프로토타입 검토 및 개선사항 논의', date: '2026. 08. 12 (수)' },
  { id: '4', projectId: '1', project: '신규 서비스 기획', title: '4차 기획 회의', agenda: '서비스 화면 구성 및 기능 우선순위 결정', date: '2026. 08. 12 (수)' },
  { id: '3', projectId: '1', project: '신규 서비스 기획', title: '3차 기획 회의', agenda: '서비스 핵심 기능 및 사용자 경험 논의', date: '2026. 08. 12 (수)' },
  { id: '2', projectId: '1', project: '신규 서비스 기획', title: '2차 기획 회의', agenda: '타깃 사용자 및 핵심 니즈 분석', date: '2026. 08. 12 (수)' },
  { id: '1', projectId: '1', project: '신규 서비스 기획', title: '1차 기획 회의', agenda: '서비스 목표 및 문제 정의', date: '2026. 08. 12 (수)' },
  { id: '0', projectId: '3', project: '마케팅 전략 회의', title: '마케팅 방향성 논의', agenda: '서비스 방향 설정', date: '2026. 08. 12 (수)' },
]

/*
 * 행 전체는 회의 결과(Desktop - 36)로, **프로젝트 셀만 따로** 프로젝트 상세로 간다
 * (사용자 확정). 셀 링크가 행 오버레이 링크 위로 오도록 z-20을 준다 — Table 주석 참고.
 */
const ROWS: TableRow[] = MEETINGS.map((m) => ({
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
      {/*
       * 히어로 바닥 350 → 테이블 top 432 = 82px 간격.
       * 테이블 바닥 1058 → 문서 1150 = 아래 여백 92.
       *
       * 좌우는 px-[230px] 고정이 아니라 **max-w-[1460px] 컨테이너를 중앙 정렬하고
       * 그 안에서 테이블(1452)을 왼쪽 정렬**한다. 히어로 텍스트도 같은 1460 컨테이너를
       * 쓰므로 둘의 왼쪽 선이 230으로 맞는다.
       *
       * 테이블을 중앙 정렬하면 1460 안에서 1452가 가운데로 가서 234가 되고
       * 히어로와 4px 어긋난다. 시안도 왼쪽 230 / 오른쪽 238로 왼쪽 정렬이다.
       */}
      <div className="mx-auto w-full max-w-[1460px] px-5 pb-16 sm:px-8 lg:px-0 lg:pb-[92px]">
        <div className="mt-[40px] lg:mt-[82px]">
          <Table columns={COLUMNS} rows={ROWS} />
        </div>
      </div>
    </HeroLayout>
  )
}
