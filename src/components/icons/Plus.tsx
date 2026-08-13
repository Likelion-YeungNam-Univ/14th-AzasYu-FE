import { Close } from '@/components/icons/Close'
import { cn } from '@/lib/cn'

/*
 * + (추가). Figma node `3:260` — Desktop-31 "안건 추가" 버튼.
 *
 * **Figma도 별도 글리프를 쓰지 않는다.** 10px × 를 -45° 회전시켜 +로 만든다.
 * 10px를 45° 돌리면 바운딩 박스가 10 x root2 = 14.142가 되므로 바깥 박스가 14.142다.
 * 그래서 Close를 그대로 재사용하고 회전만 건다 — 글리프를 새로 그리지 않는다.
 *
 * 주의: Tailwind v4는 rotate를 transform이 아니라 `rotate` 개별 CSS 속성으로 출력한다.
 * getComputedStyle(el).transform이 none이라고 적용 안 된 게 아니다 (§ 3-3).
 */
export function Plus({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex size-[14.142px] shrink-0 items-center justify-center',
        className,
      )}
    >
      <Close className="size-[10px] -rotate-45" />
    </span>
  )
}
