import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight } from '@/components/icons/ChevronRight'
import { cn } from '@/lib/cn'

/*
 * Figma: Desktop - 41 지난 회의 (node 3:762)
 *
 *   컨테이너  w-1452 / bg-white / 1px #717171 / rounded-35 / px-70 py-29 / overflow-clip
 *   헤더 행   h-76 / 아래 1px #717171 / 20px SemiBold #717171 / **꺾쇠 없음**
 *   본문 행   h-70 / 아래 1px #717171 / 20px Medium #717171 / 마지막 행은 선 없음
 *             행 끝에 꺾쇠 20px
 *   컬럼      회의명 300 / 프로젝트 280 / 주요 안건 530 / 날짜 180
 *
 * **컬럼 폭이 내부 폭과 정확히 맞는다**: 300+280+530+180 + 꺾쇠 20 = 1310,
 * 내부 폭 = 1452 - px70x2 - 테두리 2 = 1310.
 *
 * ── 행 링크와 셀 링크가 같이 있다 ─────────────────────────────
 * 행 전체는 회의 결과로, **프로젝트 셀만 따로 프로젝트 상세로** 간다 (사용자 확정).
 * 행을 `<Link>`로 감싸면 그 안의 셀 링크가 **링크 중첩**이 되어 HTML이 깨진다.
 * → 행 링크를 `absolute inset-0` 오버레이로 깔고, 셀 링크에 더 높은 z를 준다.
 *   (오버레이가 덮으므로 행 안의 텍스트 드래그 선택은 안 된다 — 표에서는 허용 가능)
 *
 * 반응형은 Figma에 근거가 없다 (§ 3-2). 컬럼 폭을 줄이면 20px 텍스트가 깨지므로
 * **내부 폭을 유지하고 컨테이너 안에서 가로 스크롤**시킨다.
 */
export interface TableColumn {
  label: string
  /** Figma 컬럼 폭. 마지막 컬럼은 생략하면 남는 폭을 채운다 */
  width?: number
}

export interface TableRow {
  id: string
  cells: ReactNode[]
  /** 행을 클릭했을 때 갈 경로. 주면 행 전체가 링크가 된다 */
  href?: string
  /** 스크린리더용 행 링크 설명. 셀 텍스트만으로 부족할 때 준다 */
  label?: string
}

interface TableProps {
  columns: TableColumn[]
  rows: TableRow[]
  className?: string
}

/*
 * 좁은 화면에서 스크롤될 때 유지할 최소 폭.
 *
 * **컨테이너 폭에서 테두리 2px를 뺀 값을 써야 한다.** 1452를 그대로 주면 2px 넘쳐서
 * lg에서도 가로 스크롤바가 생기고, 그 스크롤바가 높이 15px를 먹어 테이블이 커진다.
 * (실제로 한 번 이렇게 터졌다.)
 */
const CONTAINER_WIDTH = 1452
const INNER_WIDTH = CONTAINER_WIDTH - 2

const CELL = 'shrink-0 overflow-hidden pr-4 text-ellipsis whitespace-nowrap'

function cellWidth(col: TableColumn) {
  return col.width ? { width: col.width } : undefined
}

export function Table({ columns, rows, className }: TableProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[35px] border border-solid border-[#717171] bg-white',
        className,
      )}
      style={{ maxWidth: CONTAINER_WIDTH }}
    >
      <div className="overflow-x-auto">
        <div
          className="px-6 py-[29px] sm:px-10 lg:px-[70px]"
          style={{ minWidth: INNER_WIDTH }}
        >
          {/* 헤더 행 — 본문과 달리 꺾쇠가 없다 */}
          <div className="text-20 flex h-[76px] items-center border-b border-solid border-[#717171] font-semibold text-[#717171]">
            {columns.map((col) => (
              <p
                key={col.label}
                className={cn(CELL, !col.width && 'flex-1')}
                style={cellWidth(col)}
              >
                {col.label}
              </p>
            ))}
          </div>

          {/* 본문 행 — 마지막 행만 아래 선이 없다 */}
          {rows.map((row, i) => (
            <div
              key={row.id}
              className={cn(
                'text-20 relative flex h-[70px] items-center font-medium text-[#717171]',
                i < rows.length - 1 &&
                  'border-b border-solid border-[#717171]',
              )}
            >
              {row.cells.map((cell, j) => (
                <div
                  key={columns[j]?.label ?? j}
                  className={cn(CELL, !columns[j]?.width && 'flex-1')}
                  style={cellWidth(columns[j] ?? {})}
                >
                  {cell}
                </div>
              ))}

              <ChevronRight className="shrink-0" />

              {/*
               * 행 전체 링크. 셀 안의 링크를 감싸지 않도록 오버레이로 깐다.
               * 셀 링크는 z-20이라 이 위로 올라온다.
               */}
              {row.href && (
                <Link
                  to={row.href}
                  aria-label={row.label}
                  className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#606060]"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
