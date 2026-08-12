import { Header } from '@/components/layout/Header'
import { HEADER_PRESETS } from '@/constants/header'
import { Hero, HeroLayout } from '@/components/layout/Hero'
import { Table, type TableColumn, type TableRow } from '@/components/ui/Table'
import { meetingPath } from '@/routes/paths'

/*
 * Figma: Desktop - 37 (node 765:1476), 1920 x 1150
 *
 * lg(1024px) 이상에서 시안 실측값과 일치한다.
 *   헤더        0 ~ 80        tone onLight (히어로가 y=80이라 헤더는 흰 배경 위)
 *   히어로      80 ~ 350      h-270, 그라데이션 2겹
 *   히어로 텍스트 x230 y162 w634 h109 — 제목 48 Bold h67 + gap14 + 부제 20 Regular h28
 *   테이블      left 230 top 432 w-1460 **h-556**, rounded-35, 1px #717171, px-70 py-29
 *   헤더 행     h-76, 본문 행 h-70 x6 (마지막 행은 아래 선 없음), 행 폭 1318
 *   문서 높이   1150
 *
 * 테이블 바닥 = 432 + 556 = 988. 아래 여백 = 1150 - 988 = 162.
 * (행이 x=71 y=30에서 시작하는 건 px-70 py-29 + 테두리 1px이다 — Figma는 stroke를
 *  프레임 크기에 포함시킨다. Button 58px과 같은 규칙.)
 *
 * lg 미만은 Figma에 시안이 없다. 테이블은 컬럼 폭을 유지하고 컨테이너 안에서
 * 가로 스크롤한다 (Table 컴포넌트 주석 참고).
 */
const COLUMNS: TableColumn[] = [
  { label: '회의명', width: 372 },
  { label: '날짜', width: 372 },
  // 3번째는 남는 폭을 채운다. Figma 값 652는 컨테이너를 넘어 잘린다
  { label: '주요 안건' },
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
  { id: '6', projectId: '1', title: '6차 기획 회의', date: '2026. 08. 12 (수)', agenda: '서비스 방향 설정' },
  { id: '5', projectId: '1', title: '5차 기획 회의', date: '2026. 08. 12 (수)', agenda: '서비스 방향 설정' },
  { id: '4', projectId: '1', title: '4차 기획 회의', date: '2026. 08. 12 (수)', agenda: '서비스 방향 설정' },
  { id: '3', projectId: '1', title: '3차 기획 회의', date: '2026. 08. 12 (수)', agenda: '서비스 방향 설정' },
  { id: '2', projectId: '1', title: '2차 기획 회의', date: '2026. 08. 12 (수)', agenda: '서비스 방향 설정' },
  { id: '1', projectId: '1', title: '1차 기획 회의', date: '2026. 08. 12 (수)', agenda: '서비스 방향 설정' },
]

// 회의를 클릭하면 회의 결과(Desktop - 36)로 간다 — 회의의 기본 경로다
const ROWS: TableRow[] = MEETINGS.map((m) => ({
  id: m.id,
  cells: [m.title, m.date, m.agenda],
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
       *
       * 좌우는 px-[230px] 고정이 아니라 max-w-[1460px] 중앙 정렬로 잡는다.
       * 1920에서 (1920 - 64 - 1460) / 2 + 32 = 230으로 Figma와 정확히 같으면서,
       * 세로 스크롤바가 생겨 폭이 15px 줄어도 테이블이 1460을 유지한다.
       * px-[230px]로 고정하면 그 순간 테이블이 1445로 줄고 내부 가로 스크롤바가 생긴다.
       */}
      <div className="flex w-full justify-center px-5 pb-16 sm:px-8 lg:pb-[162px]">
        <div className="mt-[40px] flex w-full justify-center lg:mt-[82px]">
          <Table columns={COLUMNS} rows={ROWS} />
        </div>
      </div>
    </HeroLayout>
  )
}
