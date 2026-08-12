import { Close } from '@/components/icons/Close'
import { cn } from '@/lib/cn'

/*
 * 참여자 태그. Figma node `1:448` — Desktop-31 참여자, Desktop-30 팀원 초대.
 *
 *   h-41 / 1px #606060 / rounded-8 / px-16 py-8
 *   내부 gap-6, 라벨 16px Medium #606060, 삭제 × 20px
 *   칩 사이 gap 12 (Figma가 ml-0 / 113 / 226에 두고 칩 폭이 101이므로 113-101=12)
 *
 * Figma 높이 41은 py-8 x2 + 라벨 22.4 + 테두리 2 = 40.4의 반올림이다.
 * 시안 값에 맞춰 h-41을 명시한다.
 *
 * 삭제 아이콘은 실제 <button>으로 감싼다 — 시안에는 인터랙션 표시가 없지만
 * ×는 누를 수 있어야 하고, 칩 전체를 버튼으로 만들면 라벨 클릭도 삭제가 되어버린다.
 */
interface ChipProps {
  label: string
  /** 주면 삭제 × 를 렌더한다. 없으면 라벨만 */
  onRemove?: () => void
  className?: string
}

export function Chip({ label, onRemove, className }: ChipProps) {
  return (
    <span
      className={cn(
        'text-16 flex h-[41px] w-fit items-center justify-center gap-[6px] rounded-[8px] border border-solid border-[#606060] px-[16px] py-[8px] font-medium whitespace-nowrap text-[#606060]',
        className,
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${label} 삭제`}
          className="flex shrink-0 cursor-pointer items-center"
        >
          <Close />
        </button>
      )}
    </span>
  )
}
