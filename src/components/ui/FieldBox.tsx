import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/*
 * 값을 보여주는 작은 테두리 박스. Figma node `1:423` / `1:434` / `1:438`
 * — Desktop-31 회의 일시 (날짜 217 / 시간 163 / 소요시간 139), gap-22.
 *
 *   1px #606060 / rounded-8 / px-16 py-8 / 높이는 내용에 맡긴다 (실측 40.4)
 *   텍스트 16px Medium #606060, 아이콘이 있으면 gap-12
 *
 * 폭은 호출부가 정한다 (§ 3-3 — 여기서 w-full을 주면 호출부 폭이 무시된다).
 *
 * 시안에는 달력/시간 피커의 열린 상태가 없다. 그래서 지금은 **표시 전용**이다.
 * 실제 피커 UI는 지어내지 않았다 — 시안이 나오면 붙일 것.
 */
interface FieldBoxProps {
  children: ReactNode
  /** 오른쪽에 붙는 아이콘 (예: 달력) */
  icon?: ReactNode
  className?: string
}

export function FieldBox({ children, icon, className }: FieldBoxProps) {
  return (
    <div
      className={cn(
        'flex items-center rounded-[8px] border border-solid border-[#606060] px-[16px] py-[8px]',
        className,
      )}
    >
      <span className="text-16 flex items-center gap-[12px] font-medium whitespace-nowrap text-[#606060]">
        {children}
        {icon}
      </span>
    </div>
  )
}
