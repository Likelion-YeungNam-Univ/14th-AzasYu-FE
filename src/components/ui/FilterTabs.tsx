import { cn } from '@/lib/cn'

/*
 * 필터 탭 (전체 / 진행 중 / 완료).
 *
 * ⚠️ **2026-08-13 시안 개편에서 Desktop-29의 필터 탭이 통째로 사라졌다.**
 * 대응하는 Figma 노드가 더 이상 없다 (옛 node `1:578`).
 * `ProjectsPage`는 아직 이 컴포넌트를 렌더한다 — 29를 새 시안으로 재구현할 때
 * 화면에서 걷어낼지, 컴포넌트째 지울지 정할 것.
 *
 *   컨테이너  flex gap-33 items-center py-9   (Figma 337x69 = 51 + py-9 x2)
 *   탭        h-51 / rounded-45 / 20px Medium 검정 / px 23.5 (Figma 폭 82 = 35 + 23.5x2)
 *   선택된 탭  bg #c8c8c8, 나머지는 배경 없음
 *
 * **자간이 `+0.4px`다.** 이 프로젝트의 다른 모든 텍스트는 -2.5%(음수)인데 여기만 양수다.
 * 디자이너 오차로 보이지만 § 1에 따라 시안 값을 그대로 쓴다.
 * 그래서 전역 토큰(`text-20`)의 자간을 `tracking-[0.4px]`로 덮는다.
 *
 * 시안에는 선택 상태가 "전체" 하나뿐이다. hover/focus 표현은 없어서 지어내지 않고
 * 접근성용 focus-visible 링만 뒀다.
 */
export interface FilterTab {
  /** 상태 식별자 */
  value: string
  label: string
}

interface FilterTabsProps {
  tabs: FilterTab[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function FilterTabs({
  tabs,
  value,
  onChange,
  className,
}: FilterTabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex flex-wrap items-center gap-[33px] py-[9px]',
        className,
      )}
    >
      {tabs.map((tab) => {
        const selected = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={cn(
              'text-20 flex h-[51px] shrink-0 cursor-pointer items-center justify-center rounded-[45px] px-[23.5px] font-medium tracking-[0.4px] whitespace-nowrap text-black',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#606060]',
              selected && 'bg-[#c8c8c8]',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
