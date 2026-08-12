import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/cn'

/*
 * Figma: Desktop - 37 지난 회의 (node 765:1494)
 *
 *   컨테이너  w-1460 / bg-white / 1px #717171 / rounded-35 / px-70 py-29 / overflow-clip
 *   헤더 행   h-76 / 아래 1px #717171 / 20px SemiBold #717171
 *   본문 행   h-70 / 아래 1px #717171 / 20px Medium #717171 / 마지막 행은 선 없음
 *   컬럼      372 / 372 / 652
 *
 * 컬럼 폭 합이 372+372+652 = 1396인데 컨테이너 내부 폭은 1460-140 = 1320이다.
 * overflow-clip이 걸려 있어 3번째 컬럼이 576만 보이고 뒤가 잘린다.
 * **헤더 행 끝의 꺾쇠 아이콘(node 765:1499)은 x 1396~1416이라 완전히 잘려 보이지 않는다.**
 * → 3번째 컬럼을 flex-1(=576)로 두면 시각 결과가 같고 오버플로가 없다. 꺾쇠는 넣지 않았다.
 *   디자이너가 정렬/펼치기 아이콘을 의도했다면 위치를 고쳐야 한다.
 *
 * 반응형은 Figma에 근거가 없다 (§ 3-2). 컬럼 폭을 줄이면 20px 텍스트가 깨지므로
 * **내부 폭 1320을 유지하고 컨테이너 안에서 가로 스크롤**시킨다. 시안을 그대로 보존하는
 * 대신 좁은 화면에서 스크롤이 생긴다. 모바일 시안이 나오면 다시 잡아야 한다.
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
}

interface TableProps {
  columns: TableColumn[]
  rows: TableRow[]
  className?: string
}

/*
 * 좁은 화면에서 스크롤될 때 유지할 최소 폭.
 *
 * Figma 컨테이너는 1460이고 그 안의 행 폭이 1318이다 (테두리 1px x2 + px-70 x2 = 142 제외).
 * 이 값은 padding을 포함하는 border-box 기준이고, **스크롤 영역이 실제로 쓸 수 있는 폭은
 * 1460 - 테두리 2 = 1458**이다. 1460을 주면 2px 넘쳐서 lg에서도 가로 스크롤바가 생기고,
 * 그 스크롤바가 높이 15px를 먹어 테이블이 556이 아니라 571이 된다. (실제로 한 번 그랬다.)
 */
const INNER_WIDTH = 1458

const CELL = 'shrink-0 overflow-hidden pr-4 text-ellipsis whitespace-nowrap'

function cellWidth(col: TableColumn) {
  return col.width ? { width: col.width } : undefined
}

export function Table({ columns, rows, className }: TableProps) {
  return (
    <div
      className={cn(
        'w-full max-w-[1460px] overflow-hidden rounded-[35px] border border-solid border-[#717171] bg-white',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <div
          className="px-6 py-[29px] sm:px-10 lg:px-[70px]"
          style={{ minWidth: INNER_WIDTH }}
        >
          {/* 헤더 행 */}
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
          {rows.map((row, i) => {
            const cells = (
              <>
                {row.cells.map((cell, j) => (
                  <div
                    key={columns[j]?.label ?? j}
                    className={cn(CELL, !columns[j]?.width && 'flex-1')}
                    style={cellWidth(columns[j] ?? {})}
                  >
                    {cell}
                  </div>
                ))}
              </>
            )

            const rowClass = cn(
              'text-20 flex h-[70px] items-center font-medium text-[#717171]',
              i < rows.length - 1 && 'border-b border-solid border-[#717171]',
            )

            return row.href ? (
              <Link key={row.id} to={row.href} className={rowClass}>
                {cells}
              </Link>
            ) : (
              <div key={row.id} className={rowClass}>
                {cells}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
