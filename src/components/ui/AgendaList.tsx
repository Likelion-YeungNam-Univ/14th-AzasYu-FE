import { Close } from '@/components/icons/Close'
import { cn } from '@/lib/cn'

/*
 * 번호 매긴 안건 목록. Figma node `1:400` — Desktop-31 회의 안건.
 *
 *   박스   1px #606060 / **rounded-7** / h-154 / px-16 py-14 / flex-col gap-10 / overflow-clip
 *   행     h-36 / w-529 / justify-between — 번호 목록 텍스트 + 삭제 × 20px
 *   텍스트 20px Medium #606060, 번호는 list-decimal (Figma가 ms-30으로 들여쓴다)
 *
 * **모서리가 7px이다** — 다른 인풋은 8px인데 여기만 7이다. 디자이너 오차로 보이지만
 * § 1에 따라 시안 값을 그대로 쓴다.
 *
 * **Figma 높이 154는 내용보다 4px 작다.** 3행 x 36 + gap 2 x 10 = 128인데
 * 사용 가능 높이는 154 - 테두리 2 - py 28 = 124다. `justify-center`라 위아래 2px씩
 * 잘리는데, 행(36) 안에서 텍스트(28)에 4px 여유가 있어 **시각적 손실은 없다.**
 *
 * lg에서는 시안 값 154를 고정해 아래 요소가 밀리지 않게 한다 (min-h로 두면 158이 되어
 * 카드 안 모든 요소가 4px 내려간다). lg 미만은 시안 근거가 없으니 늘어나게 둔다.
 *
 * **행이 4개 이상인 경우는 시안에 없다.** lg에서 4번째 행부터 잘린다 —
 * 디자이너 확인이 필요하다.
 */
export interface AgendaItem {
  id: string
  text: string
}

interface AgendaListProps {
  items: AgendaItem[]
  onRemove?: (id: string) => void
  className?: string
}

export function AgendaList({ items, onRemove, className }: AgendaListProps) {
  return (
    <div
      className={cn(
        'flex min-h-[154px] flex-col justify-center gap-[10px] rounded-[7px] border border-solid border-[#606060] px-[16px] py-[14px] lg:h-[154px] lg:min-h-0 lg:overflow-clip',
        className,
      )}
    >
      <ol className="text-20 flex list-decimal flex-col gap-[10px] font-medium text-[#606060]">
        {items.map((item) => (
          <li key={item.id} className="ms-[30px] h-[36px]">
            <div className="flex h-full items-center justify-between gap-[10px]">
              <span className="truncate">{item.text}</span>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label={`${item.text} 삭제`}
                  className="flex shrink-0 cursor-pointer items-center"
                >
                  <Close className="size-[20px]" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
